import React from 'react';
import { Landmark, TrendingDown, ShieldAlert, Percent } from 'lucide-react';
import { SimulationResult, Account } from '../types/liquidity';

interface KpiCardsProps {
  simulation: SimulationResult;
  accounts: Account[];
}

function formatUSD(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) {
    return `${amount < 0 ? '-' : ''}$${(abs / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `${amount < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${amount < 0 ? '-' : ''}$${(abs / 1_000).toFixed(0)}k`;
  }
  return `$${amount.toLocaleString()}`;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ simulation, accounts }) => {
  const totalOpeningUSD = accounts.reduce(
    (sum, acc) => sum + acc.openingBalance * acc.fxRateToBaseUSD,
    0
  );

  const daylightBufferRemaining = simulation.peakIntradayDeficitUSD + 250_000_000;
  const isOverdraftBreached = simulation.peakIntradayDeficitUSD < -250_000_000;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Opening Consolidated Liquidity */}
      <div className="editorial-card p-5 transition-all hover:shadow-soft-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal-500">
            Consolidated Opening Cash
          </span>
          <div className="w-8 h-8 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-serif font-semibold text-charcoal-900">
            {formatUSD(totalOpeningUSD)}
          </span>
          <span className="text-xs text-charcoal-500 font-mono">USD Base</span>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
          <span>Fed USD ($500M) + 3 Nostros</span>
          <span className="text-sage-700 font-medium font-mono">4 Currencies</span>
        </div>
      </div>

      {/* 2. Projected Stressed EOD Balance */}
      <div className="editorial-card p-5 transition-all hover:shadow-soft-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal-500">
            Projected EOD Balance
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            simulation.projectedEodBalanceUSD >= 0 
              ? 'bg-sage-50 text-sage-600' 
              : 'bg-terracotta-50 text-terracotta-600'
          }`}>
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-2xl md:text-3xl font-serif font-semibold ${
            simulation.projectedEodBalanceUSD >= 0 ? 'text-charcoal-900' : 'text-terracotta-700'
          }`}>
            {formatUSD(simulation.projectedEodBalanceUSD)}
          </span>
          <span className="text-xs text-charcoal-500 font-mono">@ 17:00</span>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
          <span>Baseline: {formatUSD(simulation.baselineEodBalanceUSD)}</span>
          <span className={`font-medium font-mono ${
            simulation.projectedEodBalanceUSD - simulation.baselineEodBalanceUSD < 0
              ? 'text-terracotta-600'
              : 'text-sage-700'
          }`}>
            {formatUSD(simulation.projectedEodBalanceUSD - simulation.baselineEodBalanceUSD)}
          </span>
        </div>
      </div>

      {/* 3. Daylight Overdraft Capacity */}
      <div className="editorial-card p-5 transition-all hover:shadow-soft-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal-500">
            Daylight Overdraft Headroom
          </span>
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isOverdraftBreached ? 'bg-terracotta-100 text-terracotta-700' : 'bg-slate-100 text-slate-700'
          }`}>
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`text-2xl md:text-3xl font-serif font-semibold ${
            isOverdraftBreached ? 'text-terracotta-700' : 'text-charcoal-900'
          }`}>
            {isOverdraftBreached ? 'EXHAUSTED' : formatUSD(daylightBufferRemaining)}
          </span>
          <span className="text-xs text-charcoal-500 font-mono">/ $250M</span>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
          <span>Min Deficit: {formatUSD(simulation.peakIntradayDeficitUSD)}</span>
          <span className="text-charcoal-700 font-medium font-mono">@{simulation.peakDeficitTime}</span>
        </div>
      </div>

      {/* 4. BCBS 248 Throughput */}
      <div className="editorial-card p-5 transition-all hover:shadow-soft-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-charcoal-500">
            BCBS 248 Throughput (13:00)
          </span>
          <div className="w-8 h-8 rounded-xl bg-ochre-50 text-ochre-600 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-serif font-semibold text-charcoal-900">
            {simulation.bcbsMetrics.metricD_settledBy1300Pct.toFixed(1)}%
          </span>
          <span className="text-xs text-charcoal-500 font-mono">Target: 60%</span>
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-charcoal-100 flex items-center justify-between text-xs text-charcoal-500">
          <span>11:00 ({simulation.bcbsMetrics.metricD_settledBy1100Pct.toFixed(0)}%)</span>
          <span className={`font-medium ${
            simulation.bcbsMetrics.metricD_settledBy1300Pct >= 60 ? 'text-sage-700' : 'text-ochre-700'
          }`}>
            {simulation.bcbsMetrics.metricD_settledBy1300Pct >= 60 ? 'Compliant' : 'Warning'}
          </span>
        </div>
      </div>
    </div>
  );
};
