import React from 'react';
import { Globe2, ShieldAlert } from 'lucide-react';
import { Account } from '../types/liquidity';

interface NostroBalancesCardProps {
  accounts: Account[];
  isFxFrozen: boolean;
}

function formatAmount(val: number, ccy: string): string {
  if (ccy === 'JPY') {
    return `¥${(val / 1_000_000_000).toFixed(1)}B`;
  }
  if (ccy === 'EUR') {
    return `€${(val / 1_000_000).toFixed(1)}M`;
  }
  if (ccy === 'GBP') {
    return `£${(val / 1_000_000).toFixed(1)}M`;
  }
  return `$${(val / 1_000_000).toFixed(1)}M`;
}

function formatUSD(val: number): string {
  return `$${(val / 1_000_000).toFixed(1)}M`;
}

export const NostroBalancesCard: React.FC<NostroBalancesCardProps> = ({
  accounts,
  isFxFrozen,
}) => {
  return (
    <div className="editorial-card p-5 md:p-6 transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-semibold text-charcoal-900">
              Multi-Currency Nostro & Fed Reserves
            </h3>
            <p className="text-xs text-charcoal-500">
              Consolidated settlement ledger normalized to Base USD
            </p>
          </div>
        </div>

        {isFxFrozen && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            Nostro Sweeps Frozen
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {accounts.map((acc) => {
          const isTrapped = isFxFrozen && acc.type !== 'CENTRAL_BANK';
          const balanceUSD = acc.openingBalance * acc.fxRateToBaseUSD;

          return (
            <div
              key={acc.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isTrapped
                  ? 'bg-terracotta-50/50 border-terracotta-200/70 text-charcoal-600'
                  : 'bg-canvas border-charcoal-200/70 shadow-soft-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-surface border border-charcoal-200/70 text-charcoal-700">
                  {acc.currency}
                </span>
                {acc.type === 'CENTRAL_BANK' ? (
                  <span className="text-[10px] text-sage-700 font-medium">Federal Reserve</span>
                ) : (
                  <span className={`text-[10px] ${isTrapped ? 'text-terracotta-600 font-semibold' : 'text-charcoal-400'}`}>
                    {isTrapped ? 'Locked' : `FX: ${acc.fxRateToBaseUSD}`}
                  </span>
                )}
              </div>

              <div className="mt-2">
                <div className="text-sm font-semibold text-charcoal-900 truncate">
                  {acc.name.split('(')[0]}
                </div>
                <div className="text-[11px] text-charcoal-500 truncate">
                  {acc.institutionLocation}
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-charcoal-100/80 flex items-baseline justify-between">
                <span className="font-serif font-semibold text-charcoal-900 text-base">
                  {formatAmount(acc.openingBalance, acc.currency)}
                </span>
                <span className="text-xs font-mono text-charcoal-500">
                  ≈ {formatUSD(balanceUSD)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
