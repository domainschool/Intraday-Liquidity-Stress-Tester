import React from 'react';
import { Building2, ShieldCheck, Clock, RefreshCw, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onResetAll?: () => void;
  onOpenAbout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetAll, onOpenAbout }) => {
  return (
    <header className="border-b border-charcoal-200/80 bg-surface/80 backdrop-blur-md sticky top-0 z-30 py-4 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-charcoal-800 text-canvas flex items-center justify-center shadow-soft-sm">
            <Building2 className="w-5 h-5 text-sage-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-serif font-medium text-charcoal-900 tracking-tight">
                LiquiShock AI
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-800 border border-sage-200/70">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
                BCBS 248 Active
              </span>
            </div>
            <p className="text-xs text-charcoal-500 font-normal">
              Horizon Continental Bank &bull; Intraday Treasury Desk &bull; NY / Fedwire Master Ledger
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-canvas border border-charcoal-200/70 shadow-soft-xs text-xs text-charcoal-700">
            <Clock className="w-3.5 h-3.5 text-charcoal-500" />
            <span className="font-medium hidden sm:inline">Operating Window:</span>
            <span className="font-mono text-charcoal-800 font-semibold">08:00 – 17:00 EST</span>
          </div>

          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sage-50 hover:bg-sage-100 border border-sage-200/80 text-xs font-semibold text-sage-800 transition-colors shadow-soft-xs"
              title="Open Learning Deck, System Architecture & Vibe Prompts"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sage-600" />
              <span>About & System Architecture</span>
            </button>
          )}

          {onResetAll && (
            <button
              onClick={onResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-canvas hover:bg-surface border border-charcoal-200 hover:border-charcoal-300 text-xs font-medium text-charcoal-700 hover:text-charcoal-900 transition-colors shadow-soft-xs"
              title="Reset all stress parameters and payment queues to baseline"
            >
              <RefreshCw className="w-3.5 h-3.5 text-charcoal-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
