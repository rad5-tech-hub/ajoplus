import { ArrowUpDown, Clock, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useGetTransactions } from '@/app/store/TransactionStore';
import { useMyPendingPayments } from '@/app/store/PaymentStore';
import { useMyPendingWithdrawals } from '@/app/store/WithdrawalStore';
import { formatCurrency } from '@/lib/currency';
import type { Transaction, TransactionTitle, TransactionStatus } from '@/api/transactions';

const TITLE_LABELS: Record<string, string> = {
  withdrawal: 'Withdrawal',
  package: 'Package Payment',
  saving: 'Daily Savings',
  product: 'Product Purchase',
};

const STATUS_META: Record<string, { dot: string; badge: string; label: string }> = {
  success: {
    dot: 'bg-brand-600',
    badge: 'bg-brand-100 text-brand-700 border-brand-200',
    label: 'Success',
  },
  pending: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    label: 'Pending',
  },
  failed: {
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200',
    label: 'Rejected',
  },
};

const isCredit = (title: string) => title === 'saving' || title === 'package' || title === 'product';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const TransactionRow = ({ tx }: { tx: Transaction }) => {
  const credit = isCredit(tx.title);
  const status = STATUS_META[tx.status] ?? STATUS_META.pending;
  const amount = parseFloat(tx.amount);

  if (Number.isNaN(amount)) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-slate-100 last:border-b-0 gap-3 sm:gap-0">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-lg
          ${credit ? 'bg-brand-100 text-brand-600' : 'bg-red-100 text-red-500'}`}>
          {credit ? '↑' : '↓'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
            {TITLE_LABELS[tx.title] ?? tx.title}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(tx.createdAt)}</p>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-end gap-2 shrink-0">
        <p className={`font-bold text-base sm:text-lg ${credit ? 'text-brand-600' : 'text-red-500'}`}>
          {credit ? '+' : '-'}{formatCurrency(amount, 'NGN')}
        </p>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${status.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>
    </div>
  );
};

const RecentTransactions = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch, isFetching } = useGetTransactions();
  const { data: pendingPaymentsData, isLoading: paymentsLoading } = useMyPendingPayments();
  const { data: pendingWithdrawalsData, isLoading: withdrawalsLoading } = useMyPendingWithdrawals();

  const transactions = useMemo(() => data?.transactions ?? [], [data]);

  const pendingItems = useMemo(() => {
    const payments: Transaction[] = (pendingPaymentsData?.payments ?? []).map((p) => ({
      id: p.id,
      userId: p.userId,
      title: p.paymentType as TransactionTitle,
      amount: p.amountPaid,
      status: 'pending' as TransactionStatus,
      createdAt: p.createdAt ?? p.updatedAt ?? '',
      updatedAt: p.updatedAt ?? p.createdAt ?? '',
    }));

    const withdrawals: Transaction[] = (pendingWithdrawalsData?.withdrawals ?? []).map((w) => ({
      id: w.id,
      userId: w.userId,
      title: 'withdrawal' as TransactionTitle,
      amount: w.amount,
      status: 'pending' as TransactionStatus,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));

    return [...payments, ...withdrawals].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [pendingPaymentsData, pendingWithdrawalsData]);

  const pendingIds = useMemo(() => new Set(pendingItems.map((t) => t.id)), [pendingItems]);

  const confirmedTransactions = useMemo(
    () => transactions.filter((t) => t.status !== 'pending' && !pendingIds.has(t.id)),
    [transactions, pendingIds]
  );

  const isLoadingPending = paymentsLoading || withdrawalsLoading;

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading && !pendingItems.length) {
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
  if (error && !pendingItems.length) {
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

  // ── Empty state (only when no pending AND no history) ──────────────────────
  if (confirmedTransactions.length === 0 && pendingItems.length === 0 && !isLoadingPending) {
    return (
      <div className="bg-white border border-brand-200 rounded-3xl p-12 text-center shadow-sm">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
          <Clock className="w-9 h-9 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-brand-900 mb-3">No Transactions Yet</h3>
        <p className="text-slate-500 max-w-xs mx-auto mb-8 leading-relaxed text-sm">
          Your savings, payments, and withdrawals will appear here once you start using AbaGold.
        </p>
        <button
          onClick={() => navigate('/browse')}
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all active:scale-[0.985]"
        >
          Browse Packages
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const showPendingSection = pendingItems.length > 0;

  // ── Transactions list ──────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-brand-200 rounded-3xl shadow-sm p-5 sm:p-6 w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold text-brand-900 text-base sm:text-lg">Recent Transactions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {showPendingSection
              ? `${(data?.count ?? 0) + pendingItems.length} total · ${pendingItems.length} pending`
              : `${data?.count ?? 0} total`
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

      {showPendingSection && (
        <>
          <div className="flex items-center gap-2 mt-6 mb-3">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-600">
              Awaiting Approval ({pendingItems.length})
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingItems.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </>
      )}

      {confirmedTransactions.length > 0 && (
        <div className="divide-y divide-slate-100">
          {confirmedTransactions.map((tx) => (
            <TransactionRow key={tx.id} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;
