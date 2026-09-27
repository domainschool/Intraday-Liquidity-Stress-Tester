import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  PauseCircle, 
  PlayCircle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { PaymentTransaction, PaymentPriority } from '../types/liquidity';

interface PaymentQueueTableProps {
  transactions: PaymentTransaction[];
  onToggleHold: (transactionId: string) => void;
  onHoldAllDiscretionary: () => void;
  onReleaseAll: () => void;
}

function formatUSD(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `$${(abs / 1_000).toFixed(0)}k`;
  return `$${amount.toLocaleString()}`;
}

export const PaymentQueueTable: React.FC<PaymentQueueTableProps> = ({
  transactions,
  onToggleHold,
  onHoldAllDiscretionary,
  onReleaseAll,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'OUTFLOWS' | 'HELD' | 'CRITICAL' | 'DISCRETIONARY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered dataset
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search matching
      const matchesSearch = 
        tx.counterparty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.currency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filter === 'OUTFLOWS') return tx.direction === 'OUTFLOW' && tx.status !== 'HELD';
      if (filter === 'HELD') return tx.status === 'HELD';
      if (filter === 'CRITICAL') return tx.priority === 'CRITICAL';
      if (filter === 'DISCRETIONARY') return tx.priority === 'DISCRETIONARY';
      return true;
    });
  }, [transactions, filter, searchQuery]);

  // Metric counts
  const discretionaryCount = transactions.filter(
    (t) => t.direction === 'OUTFLOW' && t.priority === 'DISCRETIONARY' && t.status === 'QUEUED'
  ).length;

  const totalHeldUSD = transactions
    .filter((t) => t.status === 'HELD')
    .reduce((sum, t) => sum + t.amountUSD, 0);

  const getPriorityBadge = (priority: PaymentPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-terracotta-100 text-terracotta-800 border border-terracotta-200">
            Critical
          </span>
        );
      case 'STANDARD':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Standard
          </span>
        );
      case 'DISCRETIONARY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-ochre-100 text-ochre-800 border border-ochre-200">
            Discretionary
          </span>
        );
    }
  };

  return (
    <div className="editorial-card p-5 md:p-6 transition-all">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-charcoal-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg md:text-xl font-serif font-semibold text-charcoal-900">
              Active Payment Queue & Settlement Throttle
            </h3>
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-surface border border-charcoal-200 text-charcoal-600">
              {transactions.length} Wires
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Real-time RTGS, TARGET2, CHAPS, and CLS settlement orders scheduled across operating day
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {discretionaryCount > 0 && (
            <button
              onClick={onHoldAllDiscretionary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ochre-50 hover:bg-ochre-100 text-ochre-800 border border-ochre-200/80 text-xs font-medium transition-colors shadow-soft-xs"
              title="Hold all discretionary interbank transfers to preserve liquidity"
            >
              <PauseCircle className="w-3.5 h-3.5 text-ochre-600" />
              <span>Hold All Discretionary ({discretionaryCount})</span>
            </button>
          )}

          {totalHeldUSD > 0 && (
            <button
              onClick={onReleaseAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-50 hover:bg-sage-100 text-sage-800 border border-sage-200/80 text-xs font-medium transition-colors shadow-soft-xs"
              title="Release all held transactions back into active settlement"
            >
              <PlayCircle className="w-3.5 h-3.5 text-sage-600" />
              <span>Release All ({formatUSD(totalHeldUSD)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'OUTFLOWS', 'HELD', 'CRITICAL', 'DISCRETIONARY'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-charcoal-800 text-white shadow-soft-xs'
                  : 'bg-surface hover:bg-charcoal-100 text-charcoal-600 border border-charcoal-200/60'
              }`}
            >
              {tab === 'ALL' && 'All Wires'}
              {tab === 'OUTFLOWS' && 'Queued Outflows'}
              {tab === 'HELD' && `Held (${formatUSD(totalHeldUSD)})`}
              {tab === 'CRITICAL' && 'Critical (CLS/Margin)'}
              {tab === 'DISCRETIONARY' && 'Discretionary'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search counterparty, CCY..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-canvas border border-charcoal-200 text-xs text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-1 focus:ring-charcoal-400"
          />
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto rounded-2xl border border-charcoal-200/70">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-surface/90 border-b border-charcoal-200/70 text-charcoal-600 font-semibold">
              <th className="py-2.5 px-3.5">Status</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Counterparty & Purpose</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3 text-right">Amount (USD)</th>
              <th className="py-2.5 px-3.5 text-center">Throttle Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-100 font-sans">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-charcoal-400">
                  No payment transactions match the selected filter.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const isHeld = tx.status === 'HELD';
                const isSettled = tx.status === 'SETTLED';
                const isOutflow = tx.direction === 'OUTFLOW';

                return (
                  <tr
                    key={tx.id}
                    className={`transition-colors hover:bg-surface/50 ${
                      isHeld ? 'bg-ochre-50/40 text-charcoal-500' : ''
                    }`}
                  >
                    {/* Status Badge */}
                    <td className="py-2.5 px-3.5 whitespace-nowrap">
                      {isSettled && (
                        <span className="inline-flex items-center gap-1 text-sage-700 font-medium font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Settled
                        </span>
                      )}
                      {tx.status === 'QUEUED' && (
                        <span className="inline-flex items-center gap-1 text-slate-700 font-medium font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Queued
                        </span>
                      )}
                      {isHeld && (
                        <span className="inline-flex items-center gap-1 text-ochre-800 font-semibold font-mono text-[11px]">
                          <PauseCircle className="w-3.5 h-3.5 text-ochre-600" />
                          HELD
                        </span>
                      )}
                    </td>

                    {/* Time */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-charcoal-700">
                      {tx.timestamp.substring(0, 5)}
                    </td>

                    {/* Counterparty & Purpose */}
                    <td className="py-2.5 px-3 max-w-[240px]">
                      <div className="font-medium text-charcoal-900 truncate">
                        {tx.counterparty}
                      </div>
                      <div className="text-[11px] text-charcoal-500 truncate">
                        {tx.description || tx.category}
                      </div>
                    </td>

                    {/* Direction / Category */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isOutflow ? (
                          <ArrowUpRight className="w-3.5 h-3.5 text-terracotta-600" />
                        ) : (
                          <ArrowDownLeft className="w-3.5 h-3.5 text-sage-600" />
                        )}
                        <span className={`font-mono font-medium ${isOutflow ? 'text-terracotta-700' : 'text-sage-700'}`}>
                          {tx.direction}
                        </span>
                      </div>
                      <span className="text-[10px] text-charcoal-400 font-mono">
                        {tx.network || 'Fedwire'}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {getPriorityBadge(tx.priority)}
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono">
                      <div className={`font-semibold ${
                        isOutflow ? (isHeld ? 'text-charcoal-400 line-through' : 'text-terracotta-700') : 'text-sage-800'
                      }`}>
                        {isOutflow ? '-' : '+'}{formatUSD(tx.amountUSD)}
                      </div>
                      {tx.currency !== 'USD' && (
                        <div className="text-[10px] text-charcoal-400">
                          {tx.amount.toLocaleString()} {tx.currency}
                        </div>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                      {isSettled ? (
                        <span className="text-[11px] text-charcoal-400 italic">Executed</span>
                      ) : isOutflow ? (
                        <button
                          onClick={() => onToggleHold(tx.id)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                            isHeld
                              ? 'bg-sage-100 hover:bg-sage-200 text-sage-800 border border-sage-200'
                              : 'bg-canvas hover:bg-surface text-charcoal-700 hover:text-charcoal-900 border border-charcoal-200 shadow-soft-xs'
                          }`}
                        >
                          {isHeld ? 'Release' : 'Hold Wire'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-charcoal-400">Inbound</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
