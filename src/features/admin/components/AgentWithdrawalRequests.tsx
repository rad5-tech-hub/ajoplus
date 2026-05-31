// src/features/admin/dashboard/components/AgentWithdrawalRequests.tsx
import { useState, useRef, useEffect, useMemo } from 'react';
import { Inbox, Check, X, AlertCircle, Search } from 'lucide-react';
import { usePendingAgentWithdrawals, useApproveAgentWithdrawal, useRejectAgentWithdrawal } from '@/app/store/WithdrawalStore';
import { formatCurrency } from '@/lib/currency';
import type { AgentWithdrawalRequest } from '@/api/withdrawals';

function getInitials(name: string) {
  return name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const RejectModal = ({ withdrawal, onConfirm, onClose, isPending }: {
  withdrawal: AgentWithdrawalRequest;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isPending: boolean;
}) => {
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
          <button onClick={onClose} className="p-1.5 -ml-1.5 cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-semibold text-brand-900">Reject Withdrawal</h2>
          <div className="w-8" />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm">
            <p className="text-slate-700">
              Rejecting <span className="font-semibold">{withdrawal.agent.fullName}</span>'s withdrawal of{' '}
              <span className="font-semibold text-red-600">{formatCurrency(withdrawal.amount)}</span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Rejection Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Insufficient balance, invalid details..."
              className="w-full px-4 py-3 border border-brand-200 rounded-2xl focus:outline-none focus:border-red-400 h-24 resize-none text-sm leading-relaxed"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-brand-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer">
              Cancel
            </button>
            <button onClick={() => onConfirm(reason)} disabled={!reason.trim() || isPending} className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isPending ? 'Rejecting…' : 'Confirm Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentWithdrawalRequests = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, isError, refetch } = usePendingAgentWithdrawals(page);
  const approveMutation = useApproveAgentWithdrawal();
  const rejectMutation = useRejectAgentWithdrawal();

  const withdrawals = useMemo(() => data?.withdrawals ?? [], [data]);
  const pagination = data?.pagination;
  const filteredWithdrawals = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return withdrawals;
    return withdrawals.filter((w: AgentWithdrawalRequest) =>
      w.agent.fullName.toLowerCase().includes(q) ||
      w.agent.email.toLowerCase().includes(q)
    );
  }, [withdrawals, searchQuery]);
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});
  const [rejectedIds, setRejectedIds] = useState<Record<string, boolean>>({});
  const [errorIds, setErrorIds] = useState<Record<string, string>>({});
  const [rejectTarget, setRejectTarget] = useState<AgentWithdrawalRequest | null>(null);

  const handleApprove = (id: string) => {
    approveMutation.mutate(id, {
      onSuccess: () => {
        setApprovedIds((prev) => ({ ...prev, [id]: true }));
        setErrorIds((prev) => { const next = { ...prev }; delete next[id]; return next; });
      },
      onError: () => {
        setErrorIds((prev) => ({ ...prev, [id]: 'Approval failed. Please try again.' }));
      },
    });
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    rejectMutation.mutate(
      { id: rejectTarget.id, reason },
      {
        onSuccess: () => {
          setRejectedIds((prev) => ({ ...prev, [rejectTarget.id]: true }));
          setRejectTarget(null);
        },
        onError: () => {
          setErrorIds((prev) => ({ ...prev, [rejectTarget.id]: 'Rejection failed. Please try again.' }));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-28 w-full" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
        <p className="text-amber-700 font-medium mb-3">Failed to load withdrawal requests.</p>
        <button onClick={() => refetch()} className="px-5 py-2 rounded-2xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Search Bar ── */}
      {withdrawals.length > 0 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by agent name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
          />
        </div>
      )}

      {withdrawals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Inbox className="w-12 h-12 text-amber-300 mb-3" />
          <p className="text-slate-500 font-medium text-sm">No pending agent withdrawal requests</p>
        </div>
      ) : filteredWithdrawals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <p className="text-slate-400 font-medium text-sm">No withdrawals match your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWithdrawals.map((w: AgentWithdrawalRequest) => {
            const isApproved = approvedIds[w.id];
            const isRejected = rejectedIds[w.id];
            const error = errorIds[w.id];
            const isApproving = approveMutation.isPending && approveMutation.variables === w.id && !isApproved && !isRejected;
            const isRejecting = rejectMutation.isPending && rejectMutation.variables?.id === w.id && !isRejected;

            if (isApproved) {
              return (
                <div key={w.id} className="bg-white rounded-2xl border border-green-200 shadow-sm p-5">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <p className="text-green-700 font-semibold text-sm">Approved ✓</p>
                  </div>
                </div>
              );
            }

            if (isRejected) {
              return (
                <div key={w.id} className="bg-white rounded-2xl border border-red-200 shadow-sm p-5">
                  <div className="flex items-center gap-3">
                    <X className="w-5 h-5 text-red-600" />
                    <p className="text-red-700 font-semibold text-sm">Rejected ✗</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={w.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-amber-200 hover:shadow-md transition-all duration-200"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {getInitials(w.agent.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{w.agent.fullName}</p>
                      <p className="text-xs text-slate-400 truncate">
                        {w.agent.email} {w.agent.phoneNumber ? `• ${w.agent.phoneNumber}` : ''}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {w.agent.bankName && w.agent.accountNumber
                          ? `${w.agent.bankName} — ${w.agent.accountNumber}`
                          : <span className="italic">—</span>}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 shrink-0">
                    PENDING
                  </span>
                </div>

                {/* Details row */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-700">
                      <span className="text-slate-500">Amount:</span>{' '}
                      <span className="font-semibold">{formatCurrency(w.amount)}</span>
                    </p>
                    {w.description && (
                      <p className="text-slate-500 text-xs">
                        <span className="text-slate-500 font-medium">Description:</span> "{w.description}"
                      </p>
                    )}
                    <p className="text-xs text-slate-400">
                      Requested: {formatDate(w.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(w.id)}
                        disabled={isApproving || isRejecting}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                      >
                        {isApproving ? (
                          <>
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Approving…
                          </>
                        ) : (
                          <><Check className="w-4 h-4" /> Approve</>
                        )}
                      </button>
                      <button
                        onClick={() => setRejectTarget(w)}
                        disabled={isApproving || isRejecting}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                    {error && (
                      <p className="text-red-600 text-xs">{error}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border border-brand-200 rounded-2xl px-5 py-3">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPreviousPage}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                pagination.hasPreviousPage
                  ? 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
                  : 'bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNextPage}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                pagination.hasNextPage
                  ? 'bg-white border border-amber-200 text-amber-700 hover:bg-amber-50'
                  : 'bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          </div>
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
    </div>
  );
};

export default AgentWithdrawalRequests;
