import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { RunwayCountdownClock } from './components/RunwayCountdownClock';
import { IntradayRunwayChart } from './components/IntradayRunwayChart';
import { StressControlPanel } from './components/StressControlPanel';
import { PaymentQueueTable } from './components/PaymentQueueTable';
import { NostroBalancesCard } from './components/NostroBalancesCard';
import { AboutModal } from './components/AboutModal';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS } from './data/mockLiquidityData';
import { Account, PaymentTransaction, StressParameters } from './types/liquidity';
import { useLiquiditySimulation } from './hooks/useLiquiditySimulation';
import { BookOpen, ShieldCheck, Scale, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [accounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [stressParams, setStressParams] = useState<StressParameters>({
    depositRunoffRate: 0,
    inflowLagMinutes: 0,
    foreignExchangeFreeze: false,
    instantMarginCallUSD: 0,
  });

  // Core mathematical recalculation
  const simulation = useLiquiditySimulation({
    accounts,
    transactions,
    stressParams,
  });

  // Hold / Release specific wire
  const handleToggleHold = useCallback((txId: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txId) {
          return {
            ...t,
            status: t.status === 'HELD' ? 'QUEUED' : 'HELD',
          };
        }
        return t;
      })
    );
  }, []);

  // One-click Safe Throttle (Hold all discretionary interbank outflows)
  const handleHoldAllDiscretionary = useCallback(() => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.direction === 'OUTFLOW' && t.priority === 'DISCRETIONARY' && t.status === 'QUEUED') {
          return { ...t, status: 'HELD' };
        }
        return t;
      })
    );
  }, []);

  // Release all held transactions
  const handleReleaseAll = useCallback(() => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.status === 'HELD') {
          return { ...t, status: 'QUEUED' };
        }
        return t;
      })
    );
  }, []);

  // Reset stress sliders
  const handleResetStress = useCallback(() => {
    setStressParams({
      depositRunoffRate: 0,
      inflowLagMinutes: 0,
      foreignExchangeFreeze: false,
      instantMarginCallUSD: 0,
    });
  }, []);

  // Reset entire system to initial state
  const handleResetAll = useCallback(() => {
    handleResetStress();
    setTransactions(INITIAL_TRANSACTIONS);
  }, [handleResetStress]);

  const hasDiscretionaryQueued = transactions.some(
    (t) => t.direction === 'OUTFLOW' && t.priority === 'DISCRETIONARY' && t.status === 'QUEUED'
  );

  return (
    <div className="min-h-screen bg-canvas flex flex-col selection:bg-sage-200">
      <Header 
        onResetAll={handleResetAll} 
        onOpenAbout={() => setIsAboutOpen(true)} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Runway Alert Banner */}
        <RunwayCountdownClock
          simulation={simulation}
          onApplySafeThrottle={handleHoldAllDiscretionary}
          hasDiscretionaryQueued={hasDiscretionaryQueued}
        />

        {/* 4 Core KPI Metric Cards */}
        <KpiCards simulation={simulation} accounts={accounts} />

        {/* Multi-Currency Nostro Breakdown */}
        <NostroBalancesCard
          accounts={accounts}
          isFxFrozen={stressParams.foreignExchangeFreeze}
        />

        {/* Main Cockpit Split: Left Controls & Curve | Right Queue Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Visual Curve + Sliders */}
          <div className="lg:col-span-7 space-y-6">
            <IntradayRunwayChart
              timeline={simulation.timeline}
              timeToBreach={simulation.timeToBreach}
            />

            <StressControlPanel
              stressParams={stressParams}
              onChange={setStressParams}
              onReset={handleResetStress}
            />
          </div>

          {/* Right Column (5 cols): Payment Queue & Throttle Table */}
          <div className="lg:col-span-5 space-y-6">
            <PaymentQueueTable
              transactions={transactions}
              onToggleHold={handleToggleHold}
              onHoldAllDiscretionary={handleHoldAllDiscretionary}
              onReleaseAll={handleReleaseAll}
            />
          </div>
        </div>

        {/* Educational Domain Banner */}
        <div className="rounded-3xl bg-surface/70 border border-charcoal-200/80 p-5 text-xs text-charcoal-600 shadow-soft-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-charcoal-200/60">
            <div className="flex items-center gap-2 text-charcoal-800 font-semibold font-serif text-sm">
              <BookOpen className="w-4 h-4 text-sage-600" />
              <span>BCBS 248 & Intraday Liquidity Engineering Framework</span>
            </div>
            <button
              onClick={() => setIsAboutOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-sage-700 hover:text-sage-800 font-semibold self-start sm:self-auto"
            >
              <span>Explore Complete Learning Deck & Prompts &rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-charcoal-600">
            <div className="flex items-start gap-2">
              <Scale className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-800">Timing Asymmetry:</strong> Outflows settle instantly over RTGS (Fedwire/TARGET2), while incoming credits lag by hours. Illiquidity happens during the day even when balance-sheet solvency is sound.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-800">Daylight Overdraft Caps:</strong> Exceeding the -$250M central bank line freezes outgoing payment queues, causing counterparty clearing gridlock and regulatory breach penalties.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Cpu className="w-4 h-4 text-charcoal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-800">Tactical Throttling:</strong> Holding non-essential discretionary interbank transfers preserves scarce central bank cash to honor mandatory CLS PvP and CCP margin calls.
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-charcoal-200/80 bg-surface/50 py-4 px-6 text-center text-xs text-charcoal-500">
        LiquiShock AI &bull; Built with soft editorial design &bull; BCBS 248 Intraday Liquidity Compliance Suite
      </footer>

      {/* About & Systems Architecture Learning Deck Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};
