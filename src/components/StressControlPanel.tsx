import React from 'react';
import { Sliders, Flame, Clock3, Lock, RotateCcw, Zap } from 'lucide-react';
import { StressParameters } from '../types/liquidity';

interface StressControlPanelProps {
  stressParams: StressParameters;
  onChange: (params: StressParameters) => void;
  onReset: () => void;
}

export const StressControlPanel: React.FC<StressControlPanelProps> = ({
  stressParams,
  onChange,
  onReset,
}) => {
  const handleRunoffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...stressParams, depositRunoffRate: Number(e.target.value) });
  };

  const handleLagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...stressParams, inflowLagMinutes: Number(e.target.value) });
  };

  const handleFxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...stressParams, foreignExchangeFreeze: e.target.checked });
  };

  const applyPreset = (preset: 'deposit-run' | 'cls-gridlock' | 'margin-squeeze') => {
    if (preset === 'deposit-run') {
      onChange({
        depositRunoffRate: 45,
        inflowLagMinutes: 60,
        foreignExchangeFreeze: false,
        instantMarginCallUSD: 0,
      });
    } else if (preset === 'cls-gridlock') {
      onChange({
        depositRunoffRate: 15,
        inflowLagMinutes: 180,
        foreignExchangeFreeze: true,
        instantMarginCallUSD: 0,
      });
    } else if (preset === 'margin-squeeze') {
      onChange({
        depositRunoffRate: 25,
        inflowLagMinutes: 45,
        foreignExchangeFreeze: false,
        instantMarginCallUSD: 50_000_000,
      });
    }
  };

  return (
    <div className="editorial-card p-5 md:p-6 transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-charcoal-100 text-charcoal-800 flex items-center justify-center">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-charcoal-900">
              Stress Scenario Injector
            </h3>
            <p className="text-xs text-charcoal-500">
              Dynamic parametric shock controls for ALCO & intraday liquidity models
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-charcoal-600 hover:text-charcoal-900 hover:bg-surface transition-colors"
          title="Reset sliders to 0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Rapid Fire Drill Presets */}
      <div className="mt-4 pt-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-ochre-600" />
            Crisis Fire Drill Presets
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => applyPreset('deposit-run')}
            className="px-2.5 py-2 rounded-2xl bg-canvas hover:bg-surface border border-charcoal-200 hover:border-charcoal-300 text-left transition-all shadow-soft-xs group"
          >
            <span className="block text-xs font-semibold text-charcoal-800 group-hover:text-charcoal-900">
              2023 Digital Run
            </span>
            <span className="block text-[11px] text-charcoal-500 mt-0.5">
              45% Runoff &bull; 60m Lag
            </span>
          </button>

          <button
            onClick={() => applyPreset('cls-gridlock')}
            className="px-2.5 py-2 rounded-2xl bg-canvas hover:bg-surface border border-charcoal-200 hover:border-charcoal-300 text-left transition-all shadow-soft-xs group"
          >
            <span className="block text-xs font-semibold text-charcoal-800 group-hover:text-charcoal-900">
              CLS Gridlock
            </span>
            <span className="block text-[11px] text-charcoal-500 mt-0.5">
              180m Lag &bull; FX Trapped
            </span>
          </button>

          <button
            onClick={() => applyPreset('margin-squeeze')}
            className="px-2.5 py-2 rounded-2xl bg-canvas hover:bg-surface border border-charcoal-200 hover:border-charcoal-300 text-left transition-all shadow-soft-xs group"
          >
            <span className="block text-xs font-semibold text-charcoal-800 group-hover:text-charcoal-900">
              Margin Squeeze
            </span>
            <span className="block text-[11px] text-charcoal-500 mt-0.5">
              +$50M CCP Call
            </span>
          </button>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="mt-5 space-y-5">
        {/* Slider 1: Deposit Runoff */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-charcoal-800 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-terracotta-600" />
              Deposit Runoff Accelerator
            </label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-lg bg-terracotta-50 text-terracotta-800 border border-terracotta-200/60">
              +{stressParams.depositRunoffRate}% Outflows
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={stressParams.depositRunoffRate}
            onChange={handleRunoffChange}
            className="w-full slider-terracotta cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-charcoal-400 mt-1 font-mono">
            <span>0% (Normal Operations)</span>
            <span>50% (Severe Bank Run)</span>
            <span>100% (Total Wholesale Run)</span>
          </div>
        </div>

        {/* Slider 2: Counterparty Lag */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-charcoal-800 flex items-center gap-1.5">
              <Clock3 className="w-3.5 h-3.5 text-ochre-600" />
              Counterparty Settlement Lag
            </label>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-lg bg-ochre-50 text-ochre-800 border border-ochre-200/60">
              +{stressParams.inflowLagMinutes} Mins Delay
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="240"
            step="15"
            value={stressParams.inflowLagMinutes}
            onChange={handleLagChange}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-charcoal-400 mt-1 font-mono">
            <span>0 min (On-Time Receipts)</span>
            <span>120 min (2h European Lag)</span>
            <span>240 min (4h Critical Delay)</span>
          </div>
        </div>

        {/* Toggle: Nostro FX Market Freeze */}
        <div className="pt-2 border-t border-charcoal-100 flex items-center justify-between">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-charcoal-800 block">
                Nostro FX Liquidity Freeze
              </span>
              <span className="text-[11px] text-charcoal-500 block leading-tight">
                Locks offshore EUR (€120M), GBP (£60M) and JPY (¥8B) due to regional time-zone cut-offs.
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer ml-3 shrink-0">
            <input
              type="checkbox"
              checked={stressParams.foreignExchangeFreeze}
              onChange={handleFxToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-charcoal-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-terracotta-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
