import { Clock, RefreshCw, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAgentTransactions } from '@/app/store/WithdrawalStore';
import { formatCurrency } from '@/lib/currency';
import type { AgentTransaction } from '@/api/withdrawals';

const STATUS_META: Record<string, { dot: string; badge: string; label: string }> = {
  approved: {
    dot: 'bg-brand-600',
    badge: 'bg-brand-100 text-brand-700 border-brand-200',
    label: 'Approved',
  },
  pending: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    label: 'Pending',
  },
  rejected: {
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200',
    label: 'Rejected',
  },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const TransactionRow = ({ tx }: { tx: AgentTransaction }) => {
  const status = STATUS_META[tx.status] ?? STATUS_META.pending;
  const amount = parseFloat(tx.amount);

  if (Number.isNaN(amount)) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-slate-100 last:border-b-0 gap-3 sm:gap-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-lg bg-red-100 text-red-500">
          ↓
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
            Commission Withdrawal
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.createdAt)}</p>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-2 shrink-0">
        <p className="font-bold text-base sm:text-lg text-red-500">
          -{formatCurrency(amount, 'NGN')}
        </p>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${status.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>
    </div>
  );
};

const AgentTransactions = () => {
  const { data, isLoading, error, refetch, isFetching } = useAgentTransactions();
  const [searchQuery, setSearchQuery] = useState('');

  const allTransactions = useMemo(() => data?.transactions ?? [], [data]);

  const pendingItems = useMemo(
    () => allTransactions.filter((t) => t.status === 'pending'),
    [allTransactions]
  );

  const confirmedTransactions = useMemo(
    () => allTransactions.filter((t) => t.status !== 'pending'),
    [allTransactions]
  );

  const summary = data?.summary;

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return { pending: pendingItems, confirmed: confirmedTransactions };
    const filterFn = (tx: AgentTransaction) =>
      tx.status.toLowerCase().includes(q) ||
      tx.amount.toString().includes(q);
    return {
      pending: pendingItems.filter(filterFn),
      confirmed: confirmedTransactions.filter(filterFn),
    };
  }, [pendingItems, confirmedTransactions, searchQuery]);

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white border border-brand-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-200 rounded-full w-1/3 animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-100 animate-pulse">
            <div className="w-10 h-10 bg-slate-200 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded-full w-1/3" />
              <div className="h-3 bg-slate-100 rounded-full w-1/4" />
            </div>
            <div className="space-y-2 items-end flex flex-col">
              <div className="h-5 bg-slate-200 rounded-full w-20" />
              <div className="h-4 bg-slate-100 rounded-full w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-white border border-red-100 rounded-3xl p-8 text-center shadow-sm">
        <p className="text-red-600 font-medium mb-2">Failed to load transactions</p>
        <p className="text-slate-400 text-sm mb-5">Check your connection and try again.</p>
        <button
          onClick={() => refetch()}
          className="text-brand-600 underline text-sm hover:text-brand-700 font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  const showPendingSection = pendingItems.length > 0;

  // ── Empty / Transactions list ──────────────────────────────────────────────
  return (
    <div className="bg-white border border-brand-200 rounded-3xl shadow-sm p-5 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold text-brand-900 text-base sm:text-lg">Transactions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {showPendingSection
              ? `${summary?.total ?? allTransactions.length} total · ${pendingItems.length} pending`
              : `${summary?.total ?? allTransactions.length} total`
            }
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-brand-600 disabled:opacity-40 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {allTransactions.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
            <Clock className="w-9 h-9 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-brand-900 mb-3">No Transactions Yet</h3>
          <p className="text-slate-500 max-w-xs mx-auto mb-8 leading-relaxed text-sm">
            Your commission withdrawal transactions will appear here once you start earning.
          </p>
        </div>
      ) : (
        <>
      {/* ── Search Bar ── */}
      <div className="relative mt-4 mb-3">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by status or amount..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
        />
      </div>

      {filteredItems.pending.length === 0 && filteredItems.confirmed.length === 0 && searchQuery.trim() ? (
        <div className="py-12 text-center">
          <p className="text-slate-400 font-medium text-sm">No transactions match your search.</p>
        </div>
      ) : (
        <>
      {showPendingSection && filteredItems.pending.length > 0 && (
        <>
          <div className="flex items-center gap-2 mt-6 mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-600">
              Awaiting Approval ({filteredItems.pending.length})
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredItems.pending.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </>
      )}

      {filteredItems.confirmed.length > 0 && (
        <div className="divide-y divide-slate-100">
          {filteredItems.confirmed.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
        </>
      )}
        </>
      )}
    </div>
  );
};

export default AgentTransactions;
