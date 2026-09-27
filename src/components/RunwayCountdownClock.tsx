import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon } from 'lucide-react';
import { SimulationResult } from '../types/liquidity';

interface RunwayCountdownClockProps {
  simulation: SimulationResult;
  onApplySafeThrottle?: () => void;
  hasDiscretionaryQueued?: boolean;
}

function formatUSD(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000_000) return `$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  return `$${amount.toLocaleString()}`;
}

export const RunwayCountdownClock: React.FC<RunwayCountdownClockProps> = ({
  simulation,
  onApplySafeThrottle,
  hasDiscretionaryQueued,
}) => {
  const { isBreached, timeToBreach, minutesToBreach, peakIntradayDeficitUSD } = simulation;

  if (isBreached && timeToBreach) {
    const deficitBeyondCap = Math.abs(peakIntradayDeficitUSD) - 250_000_000;

    return (
      <div className="rounded-3xl bg-terracotta-50 border border-terracotta-200/80 p-5 md:p-6 shadow-soft-md transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-terracotta-500 text-white flex items-center justify-center shrink-0 shadow-soft-sm">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-terracotta-200 text-terracotta-800">
                  Critical Breach Alert
                </span>
                <span className="text-xs text-terracotta-700 font-mono">
                  Fedwire RTGS Risk
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-serif font-semibold text-terracotta-900 mt-1">
                Daylight Overdraft Limit Breached at {timeToBreach} EST
              </h2>
              <p className="text-xs md:text-sm text-terracotta-700 mt-0.5">
                Estimated Runway: <strong className="font-semibold text-terracotta-900">{minutesToBreach} Minutes</strong> until central bank credit cap is exceeded. Peak shortfall: <strong className="font-semibold">{formatUSD(deficitBeyondCap)}</strong> beyond cap.
              </p>
            </div>
          </div>

          {hasDiscretionaryQueued && onApplySafeThrottle && (
            <button
              onClick={onApplySafeThrottle}
              className="self-start md:self-center px-4 py-2.5 rounded-2xl bg-terracotta-700 hover:bg-terracotta-800 text-white text-xs font-semibold shadow-soft-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Auto-Hold Discretionary Wires</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-sage-50/90 border border-sage-200/80 p-4 md:p-5 shadow-soft-xs transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-sage-500 text-white flex items-center justify-center shrink-0 shadow-soft-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-serif font-semibold text-sage-900">
              Liquidity Buffer Secure
            </h2>
            <p className="text-xs md:text-sm text-sage-700">
              All payment queues fully covered through the 17:00 EST settlement cut-off. Daylight buffer remaining: <strong className="font-semibold text-sage-900">{formatUSD(simulation.peakIntradayDeficitUSD + 250_000_000)}</strong>.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sage-100/80 text-sage-800 text-xs font-mono font-medium">
          <span>Buffer: +{formatUSD(simulation.projectedEodBalanceUSD)}</span>
        </div>
      </div>
    </div>
  );
};
