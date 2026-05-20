// src/features/admin/dashboard/components/WithdrawalRequests.tsx
import { useState, useRef, useEffect, useMemo } from 'react';
import { Check, X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  useGetAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
} from '@/app/store/WithdrwalStore';
import { useGetAdminApprovedWithdrawals, useRejectedWithdrawals } from '@/app/store/WithdrawalStore';
import { formatCurrency } from '@/lib/currency';
import DateRangeFilter, { type DateRange } from '@/components/ui/DateRangeFilter';
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
  const [withdrawalTab, setWithdrawalTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [withdrawalDateRange, setWithdrawalDateRange] = useState<DateRange>({ from: null, to: null });
  const [rejectedDateRange, setRejectedDateRange] = useState<DateRange>({ from: null, to: null });

  const { data, isLoading, isError, isFetching, refetch } = useGetAdminWithdrawals();
  const { data: approvedWd, isLoading: approvedWdLoading } = useGetAdminApprovedWithdrawals();
  const { data: rejectedWd, isLoading: rejectedWdLoading } = useRejectedWithdrawals();
  const approveMutation = useApproveWithdrawal();
  const rejectMutation = useRejectWithdrawal();

  const withdrawals = data?.withdrawals ?? [];

  const filteredApprovedWithdrawals = useMemo(() => {
    let items = approvedWd?.withdrawals ?? [];
    if (withdrawalDateRange.from)
      items = items.filter((w) => new Date(w.createdAt) >= withdrawalDateRange.from!);
    if (withdrawalDateRange.to)
      items = items.filter((w) => new Date(w.createdAt) <= withdrawalDateRange.to!);
    return items;
  }, [approvedWd, withdrawalDateRange]);

  const filteredRejectedWithdrawals = useMemo(() => {
    let items = rejectedWd?.withdrawals ?? [];
    if (rejectedDateRange.from)
      items = items.filter((w) => new Date(w.createdAt) >= rejectedDateRange.from!);
    if (rejectedDateRange.to)
      items = items.filter((w) => new Date(w.createdAt) <= rejectedDateRange.to!);
    return items;
  }, [rejectedWd, rejectedDateRange]);

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
            {withdrawalTab === 'pending'
              ? `${data?.count ?? 0} pending requests`
              : withdrawalTab === 'approved'
              ? `${approvedWd?.count ?? 0} approved`
              : `${rejectedWd?.count ?? 0} rejected`
            }
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-2.5 rounded-2xl border border-brand-200 text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-4">
        <button onClick={() => setWithdrawalTab('pending')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            withdrawalTab === 'pending' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}>
          Pending
        </button>
        <button onClick={() => setWithdrawalTab('approved')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            withdrawalTab === 'approved' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}>
          Approved
        </button>
        <button onClick={() => setWithdrawalTab('rejected')}
          className={`pb-2 text-sm font-medium transition-colors border-b-2 cursor-pointer ${
            withdrawalTab === 'rejected' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}>
          Rejected
        </button>
      </div>

      {withdrawalTab === 'pending' ? (
        <>
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
        </>
      ) : withdrawalTab === 'approved' ? (
        <>
          <DateRangeFilter onChange={setWithdrawalDateRange} resultCount={filteredApprovedWithdrawals.length} />

          {approvedWdLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-2xl w-full" />)}
            </div>
          ) : filteredApprovedWithdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CheckCircle2 className="w-12 h-12 text-amber-300 mb-3" />
              <p className="text-slate-700 font-medium text-sm">No approved withdrawals found</p>
              <p className="text-slate-400 text-xs mt-1">Try a different date range.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredApprovedWithdrawals.map((w) => (
                <div key={w.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-green-400 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {w.user.imageUrl ? (
                        <img src={w.user.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-sm font-semibold shrink-0 shadow-sm">
                          {(w.user.fullName || '?')[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm truncate">{w.user.fullName}</p>
                        <p className="text-xs text-slate-400 truncate">
                          {w.user.email}
                          {w.user.phoneNumber ? ` • ${w.user.phoneNumber}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 shrink-0">
                      APPROVED
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Amount:</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(parseFloat(w.amount))}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Wallet Balance:</span>
                      <span className="font-medium text-slate-700">{formatCurrency(parseFloat(w.wallet.availableBalance))}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Commission Paid:</span>
                      <span className="font-medium text-slate-700">{formatCurrency(parseFloat(w.wallet.commissionPaid))}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-medium text-slate-700">
                        {new Date(w.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(w.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {w.description && (
                    <p className="mt-3 text-xs text-slate-500 italic">"{w.description}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <DateRangeFilter onChange={setRejectedDateRange} resultCount={filteredRejectedWithdrawals.length} />

          {rejectedWdLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-2xl w-full" />)}
            </div>
          ) : filteredRejectedWithdrawals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-red-300 mb-3" />
              <p className="text-slate-700 font-medium text-sm">No rejected withdrawals found</p>
              <p className="text-slate-400 text-xs mt-1">Try a different date range.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRejectedWithdrawals.map((w) => (
                <div key={w.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 border-l-red-400 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-slate-400">User ID: {w.userId}</p>
                      <p className="font-semibold text-slate-800 text-sm mt-1">{formatCurrency(parseFloat(w.amount))}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600 shrink-0">
                      REJECTED
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Amount:</span>
                      <span className="font-semibold text-slate-800">{formatCurrency(parseFloat(w.amount))}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Wallet Balance:</span>
                      <span className="font-medium text-slate-700">{formatCurrency(parseFloat(w.wallet.availableBalance))}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Commission Paid:</span>
                      <span className="font-medium text-slate-700">{formatCurrency(parseFloat(w.wallet.commissionPaid))}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">Date:</span>
                      <span className="font-medium text-slate-700">
                        {new Date(w.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })} • {new Date(w.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {w.description && (
                    <p className="mt-3 text-xs text-slate-500 italic">"{w.description}"</p>
                  )}

                  <div className="mt-3 bg-red-50 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Rejection Reason</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      {w.rejectionReason || <span className="italic text-slate-400">No reason provided</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
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