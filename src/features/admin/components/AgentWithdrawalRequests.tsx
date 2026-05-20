// src/features/admin/dashboard/components/AgentWithdrawalRequests.tsx
import { useState } from 'react';
import { Inbox, Check, AlertCircle } from 'lucide-react';
import { usePendingAgentWithdrawals, useApproveAgentWithdrawal } from '@/app/store/WithdrawalStore';
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

const AgentWithdrawalRequests = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = usePendingAgentWithdrawals(page);
  const approveMutation = useApproveAgentWithdrawal();

  const withdrawals = data?.withdrawals ?? [];
  const pagination = data?.pagination;
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});
  const [errorIds, setErrorIds] = useState<Record<string, string>>({});

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
      {withdrawals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Inbox className="w-12 h-12 text-amber-300 mb-3" />
          <p className="text-slate-500 font-medium text-sm">No pending agent withdrawal requests</p>
        </div>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((w: AgentWithdrawalRequest) => {
            const isApproved = approvedIds[w.id];
            const error = errorIds[w.id];
            const isLoading = approveMutation.isPending && approveMutation.variables === w.id && !isApproved;

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
                    <button
                      onClick={() => handleApprove(w.id)}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                    >
                      {isLoading ? (
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
    </div>
  );
};

export default AgentWithdrawalRequests;
