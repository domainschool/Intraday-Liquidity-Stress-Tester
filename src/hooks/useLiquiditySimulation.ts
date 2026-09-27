import { useMemo } from 'react';
import { 
  Account, 
  PaymentTransaction, 
  StressParameters, 
  TimelinePoint, 
  SimulationResult, 
  BCBS248Metrics 
} from '../types/liquidity';

interface UseLiquiditySimulationProps {
  accounts: Account[];
  transactions: PaymentTransaction[];
  stressParams: StressParameters;
}

export function useLiquiditySimulation({
  accounts,
  transactions,
  stressParams,
}: UseLiquiditySimulationProps): SimulationResult {
  return useMemo(() => {
    // 1. Calculate opening liquidity based on FX freeze status
    const fedAccount = accounts.find((a) => a.type === 'CENTRAL_BANK');
    const overdraftLimit = fedAccount ? fedAccount.daylightOverdraftLimit : 250_000_000;
    const overdraftThreshold = -overdraftLimit; // -$250,000,000

    let baselineOpeningLiquidityUSD = 0;
    let stressedOpeningLiquidityUSD = 0;

    accounts.forEach((acc) => {
      const balanceUSD = acc.openingBalance * acc.fxRateToBaseUSD;
      baselineOpeningLiquidityUSD += balanceUSD;

      if (stressParams.foreignExchangeFreeze) {
        // Only domestic USD central bank account is directly available for RTGS settlement
        if (acc.type === 'CENTRAL_BANK') {
          stressedOpeningLiquidityUSD += balanceUSD;
        }
      } else {
        stressedOpeningLiquidityUSD += balanceUSD;
      }
    });

    // 2. Generate 15-minute buckets from 08:00 (480 min) to 17:00 (1020 min) -> 37 points
    const START_MIN = 480; // 08:00
    const END_MIN = 1020;  // 17:00
    const STEP_MIN = 15;

    const timeline: TimelinePoint[] = [];

    // Track total active flows for summaries
    let totalHeldOutflowUSD = 0;
    let totalActiveOutflowsUSD = 0;
    let totalActiveInflowsUSD = 0;

    transactions.forEach((tx) => {
      if (tx.direction === 'OUTFLOW') {
        if (tx.status === 'HELD') {
          totalHeldOutflowUSD += tx.amountUSD;
        } else {
          totalActiveOutflowsUSD += tx.amountUSD;
        }
      } else {
        totalActiveInflowsUSD += tx.amountUSD;
      }
    });

    // 3. Compute cumulative curves at each time bucket
    let timeToBreach: string | null = null;
    let minutesToBreach: number | null = null;
    let lowestStressedBalance = Infinity;
    let peakDeficitTime = '08:00';

    for (let currentMinute = START_MIN; currentMinute <= END_MIN; currentMinute += STEP_MIN) {
      const hours = Math.floor(currentMinute / 60);
      const mins = currentMinute % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      // Baseline flows up to currentMinute
      let cumBaselineInflows = 0;
      let cumBaselineOutflows = 0;

      // Stressed flows up to currentMinute
      let cumStressedInflows = 0;
      let cumStressedOutflows = 0;

      transactions.forEach((tx) => {
        // --- BASELINE ---
        if (tx.scheduledMinute <= currentMinute) {
          if (tx.direction === 'INFLOW') {
            cumBaselineInflows += tx.amountUSD;
          } else if (tx.direction === 'OUTFLOW' && tx.status !== 'HELD') {
            cumBaselineOutflows += tx.amountUSD;
          }
        }

        // --- STRESSED ---
        if (tx.direction === 'INFLOW') {
          // Inflows delayed by inflowLagMinutes
          const effectiveArrivalMinute = tx.scheduledMinute + stressParams.inflowLagMinutes;
          if (effectiveArrivalMinute <= currentMinute) {
            if (stressParams.foreignExchangeFreeze && tx.currency !== 'USD') {
              // Trapped in foreign market - delayed or excluded
              cumStressedInflows += 0;
            } else {
              cumStressedInflows += tx.amountUSD;
            }
          }
        } else if (tx.direction === 'OUTFLOW') {
          if (tx.status !== 'HELD' && tx.scheduledMinute <= currentMinute) {
            // Amplified by deposit runoff rate
            const runoffMultiplier = 1 + (stressParams.depositRunoffRate / 100);
            if (tx.category === 'RETAIL_DEPOSIT' || tx.category === 'FEDWIRE_WHOLESALE') {
              cumStressedOutflows += tx.amountUSD * runoffMultiplier;
            } else {
              cumStressedOutflows += tx.amountUSD;
            }
          }
        }
      });

      // Add instant margin call shock if applicable
      if (stressParams.instantMarginCallUSD && currentMinute >= 660) { // after 11:00
        cumStressedOutflows += stressParams.instantMarginCallUSD;
      }

      const baselineBalance = baselineOpeningLiquidityUSD + cumBaselineInflows - cumBaselineOutflows;
      const stressedBalance = stressedOpeningLiquidityUSD + cumStressedInflows - cumStressedOutflows;

      const bufferRemaining = stressedBalance - overdraftThreshold; // how much above the -$250M line
      const isBreached = stressedBalance < overdraftThreshold;

      if (isBreached && timeToBreach === null) {
        timeToBreach = timeStr;
        minutesToBreach = currentMinute - START_MIN;
      }

      if (stressedBalance < lowestStressedBalance) {
        lowestStressedBalance = stressedBalance;
        peakDeficitTime = timeStr;
      }

      timeline.push({
        time: timeStr,
        minuteOfDay: currentMinute,
        baselineInflows: cumBaselineInflows,
        baselineOutflows: cumBaselineOutflows,
        baselineBalance,
        stressedInflows: cumStressedInflows,
        stressedOutflows: cumStressedOutflows,
        stressedBalance,
        overdraftThreshold,
        bufferRemaining,
        isBreached,
      });
    }

    const lastPoint = timeline[timeline.length - 1];
    const projectedEodBalanceUSD = lastPoint ? lastPoint.stressedBalance : 0;
    const baselineEodBalanceUSD = lastPoint ? lastPoint.baselineBalance : 0;

    // 4. Calculate BCBS 248 metrics
    const totalPaymentsUSD = transactions
      .filter((t) => t.direction === 'OUTFLOW' && t.status !== 'HELD')
      .reduce((sum, t) => sum + t.amountUSD, 0);

    const settledBy1100 = transactions
      .filter((t) => t.direction === 'OUTFLOW' && t.status !== 'HELD' && t.scheduledMinute <= 660)
      .reduce((sum, t) => sum + t.amountUSD, 0);

    const settledBy1300 = transactions
      .filter((t) => t.direction === 'OUTFLOW' && t.status !== 'HELD' && t.scheduledMinute <= 780)
      .reduce((sum, t) => sum + t.amountUSD, 0);

    const settledBy1700 = transactions
      .filter((t) => t.direction === 'OUTFLOW' && t.status !== 'HELD' && t.scheduledMinute <= 1020)
      .reduce((sum, t) => sum + t.amountUSD, 0);

    const bcbsMetrics: BCBS248Metrics = {
      metricA_maxIntradayUsageUSD: lowestStressedBalance < 0 ? Math.abs(lowestStressedBalance) : 0,
      metricB_availableStartDayLiquidityUSD: stressedOpeningLiquidityUSD + overdraftLimit,
      metricC_totalGrossSentUSD: totalActiveOutflowsUSD,
      metricC_totalGrossReceivedUSD: totalActiveInflowsUSD,
      metricD_settledBy1100Pct: totalPaymentsUSD > 0 ? (settledBy1100 / totalPaymentsUSD) * 100 : 0,
      metricD_settledBy1300Pct: totalPaymentsUSD > 0 ? (settledBy1300 / totalPaymentsUSD) * 100 : 0,
      metricD_settledBy1700Pct: totalPaymentsUSD > 0 ? (settledBy1700 / totalPaymentsUSD) * 100 : 0,
    };

    return {
      timeline,
      timeToBreach,
      minutesToBreach,
      peakIntradayDeficitUSD: lowestStressedBalance,
      peakDeficitTime,
      projectedEodBalanceUSD,
      baselineEodBalanceUSD,
      totalHeldOutflowUSD,
      totalActiveOutflowsUSD,
      totalActiveInflowsUSD,
      isBreached: timeToBreach !== null,
      bcbsMetrics,
    };
  }, [accounts, transactions, stressParams]);
}
