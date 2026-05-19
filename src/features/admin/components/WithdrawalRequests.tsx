// src/features/admin/dashboard/components/WithdrawalRequests.tsx
import { useState, useRef, useEffect } from 'react';
import { Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import {
  useGetAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
} from '@/app/store/WithdrwalStore';
import { formatCurrency } from '@/lib/currency';
import type { AdminWithdrawal } from '@/api/withdrawals';

// ── Reject Reason Modal ───────────────────────────────────────────────────────

interface RejectModalProps {
  withdrawal: AdminWithdrawal;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isPending: boolean;
}

const RejectModal = ({ withdrawal, onConfirm, onClose, isPending }: RejectModalProps) => {
  const [reason, setReason] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div ref={ref} className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1.5 cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-brand-900">Reject Withdrawal</h2>
          <div className="w-8" />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm">
            <p className="text-slate-700">
              Rejecting <span className="font-semibold">{withdrawal.user.fullName}</span>'s withdrawal of{' '}
              <span className="font-semibold text-red-600">
                {formatCurrency(parseFloat(withdrawal.amount))}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Rejection Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Insufficient balance, invalid account details..."
              className="w-full px-4 py-3 border border-brand-200 rounded-2xl focus:outline-none focus:border-red-400 h-24 resize-none text-sm leading-relaxed"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-brand-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(reason)}
              disabled={!reason.trim() || isPending}
              className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Rejecting…' : 'Confirm Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const WithdrawalRequests = () => {
  const [rejectTarget, setRejectTarget] = useState<AdminWithdrawal | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useGetAdminWithdrawals();
  const approveMutation = useApproveWithdrawal();
  const rejectMutation = useRejectWithdrawal();

  const withdrawals = data?.withdrawals ?? [];

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    rejectMutation.mutate(
      { id: rejectTarget.id, reason },
      { onSuccess: () => setRejectTarget(null) }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-40" />
                <div className="h-3 bg-slate-200 rounded w-56" />
              </div>
              <div className="h-6 bg-slate-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-medium mb-3">Failed to load withdrawal requests</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2 bg-red-600 text-white rounded-2xl text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between mb-1 sm:mb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900">Withdrawal Requests</h2>
          <p className="text-slate-600 mt-1 text-sm sm:text-base">
            {data?.count ?? 0} pending requests
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2.5 rounded-2xl border border-brand-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {withdrawals.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center">
          <p className="text-slate-500 text-sm">No pending withdrawal requests</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {withdrawals.map((w) => {
            return (
              <div
                key={w.id}
                className="bg-white border border-brand-100 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {w.user.imageUrl ? (
                    <img src={w.user.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0">
                      {(w.user.fullName || '?')[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{w.user.fullName}</p>
                    {(w.user.bankName || w.user.accountNumber) && (
                      <p className="text-xs text-slate-500 truncate">
                        {[w.user.bankName, w.user.accountNumber, w.user.accountName].filter(Boolean).join(' • ') || '—'}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">{formatCurrency(parseFloat(w.amount))} • {new Date(w.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    {w.description && <p className="text-xs text-slate-400 mt-0.5 truncate">"{w.description}"</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {w.status === 'pending' ? (
                    <>
                      <button onClick={() => handleApprove(w.id)} disabled={approveMutation.isPending}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 disabled:opacity-60 cursor-pointer whitespace-nowrap">
                        <Check className="w-3.5 h-3.5 inline mr-1" />Approve
                      </button>
                      <button onClick={() => setRejectTarget(w)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 cursor-pointer whitespace-nowrap">
                        <X className="w-3.5 h-3.5 inline mr-1" />Reject
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-medium ${w.status === 'approved' ? 'bg-brand-100 text-brand-700' : 'bg-red-100 text-red-700'}`}>
                      {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          withdrawal={rejectTarget}
          onConfirm={handleRejectConfirm}
          onClose={() => setRejectTarget(null)}
          isPending={rejectMutation.isPending}
        />
      )}
    </>
  );
};

export default WithdrawalRequests;