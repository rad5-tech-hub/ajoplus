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
                ₦{parseFloat(withdrawal.amount).toLocaleString()}
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
            const isApprovingThis = approveMutation.isPending && approveMutation.variables === w.id;

            return (
              <div
                key={w.id}
                className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between"
              >
                {/* Left */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 sm:flex-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-lg">
                    👤
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-brand-900 text-sm sm:text-base truncate">
                      {w.user.fullName}
                    </p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {w.user.email}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-500 truncate flex items-center gap-1 mt-1">
                      📞 {w.user.phoneNumber}
                    </p>
                    {w.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                        "{w.description}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount + Date + Actions */}
                <div className="flex items-center justify-between sm:contents gap-3">
                  <div className="text-left sm:text-right sm:mx-6 sm:flex-1">
                    <p className="text-lg sm:text-xl font-bold text-brand-600 leading-tight">
                      {formatCurrency(parseFloat(w.amount))}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(w.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {w.status === 'rejected' && w.rejectionReason && (
                      <p className="text-xs text-red-500 mt-0.5">
                        Reason: {w.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {w.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApprove(w.id)}
                          disabled={isApprovingThis}
                          className="bg-brand-600 hover:bg-brand-700 active:scale-95 transition-all text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-1.5 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          <Check className="w-4 h-4 shrink-0" />
                          <span className="hidden xs:inline">
                            {isApprovingThis ? 'Approving…' : 'Approve'}
                          </span>
                        </button>
                        <button
                          onClick={() => setRejectTarget(w)}
                          className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-1.5 text-sm font-medium whitespace-nowrap"
                        >
                          <X className="w-4 h-4 shrink-0" />
                          <span className="hidden xs:inline">Reject</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap ${w.status === 'approved'
                          ? 'bg-brand-100 text-brand-700'
                          : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </span>
                    )}
                  </div>
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