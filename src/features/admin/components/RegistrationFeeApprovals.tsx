import { useState } from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import {
  useAdminPendingRegistrationFees,
  useAdminApprovedRegistrationFees,
  useAdminRejectedRegistrationFees,
  useApproveRegistrationFee,
  useRejectRegistrationFee,
} from '@/app/store/RegistrationFeeStore';
import type { RegistrationFeeSubmission } from '@/api/registrationFee';

type TabValue = 'pending' | 'history';

const RegistrationFeeApprovals = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const { data: pendingData, isLoading: pendingLoading } = useAdminPendingRegistrationFees();
  const { data: approvedData, isLoading: approvedLoading } = useAdminApprovedRegistrationFees();
  const { data: rejectedData, isLoading: rejectedLoading } = useAdminRejectedRegistrationFees();

  const approveMutation = useApproveRegistrationFee();
  const rejectMutation = useRejectRegistrationFee();

  const pending = pendingData?.submissions ?? [];
  const history = [
    ...(approvedData?.submissions ?? []),
    ...(rejectedData?.submissions ?? []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    rejectMutation.mutate({ id, reason: rejectReason.trim() });
    setRejectId(null);
    setRejectReason('');
  };

  const renderTable = (submissions: RegistrationFeeSubmission[], isHistory: boolean) => (
    <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="py-4 px-5 text-sm font-semibold text-slate-500">Name</th>
            <th className="py-4 px-5 text-sm font-semibold text-slate-500">Email</th>
            <th className="py-4 px-5 text-sm font-semibold text-slate-500">Amount</th>
            <th className="py-4 px-5 text-sm font-semibold text-slate-500">Date</th>
            <th className="py-4 px-5 text-sm font-semibold text-slate-500">Receipt</th>
            <th className="py-4 px-5 text-sm font-semibold text-slate-500">Status</th>
            {!isHistory && <th className="py-4 px-5 text-sm font-semibold text-slate-500">Action</th>}
          </tr>
        </thead>
        <tbody>
          {submissions.map((sub) => (
            <tr key={sub.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-5 px-5 font-medium text-brand-900">{sub.fullName}</td>
              <td className="py-5 px-5 text-slate-500 text-sm">{sub.email}</td>
              <td className="py-5 px-5 text-brand-600 font-semibold">{formatCurrency(sub.amount)}</td>
              <td className="py-5 px-5 text-slate-500 text-sm">
                {new Date(sub.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="py-5 px-5">
                <a href={sub.proofUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-xs underline">
                  <ExternalLink className="w-3 h-3" /> View
                </a>
              </td>
              <td className="py-5 px-5">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                  ${sub.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                  ${sub.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                  ${sub.status === 'pending' ? 'bg-brand-100 text-brand-700' : ''}
                `}>
                  {sub.status}
                </span>
              </td>
              {!isHistory && (
                <td className="py-5 px-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(sub.id)}
                      disabled={approveMutation.isPending}
                      className="p-2 bg-brand-100 text-brand-600 hover:bg-brand-200 rounded-xl transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRejectId(rejectId === sub.id ? null : sub.id)}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {rejectId === sub.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Rejection reason..."
                        className="flex-1 px-3 py-1.5 border border-brand-200 rounded-xl text-xs focus:outline-none focus:border-red-400"
                      />
                      <button
                        onClick={() => handleReject(sub.id)}
                        disabled={!rejectReason.trim() || rejectMutation.isPending}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-xl font-medium hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {submissions.length === 0 && (
        <div className="p-10 text-center text-slate-500 text-sm">No submissions found.</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-brand-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'pending' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
            }`}
        >
          Pending {pending.length > 0 && <span className="ml-1.5 px-2 py-0.5 bg-brand-100 text-brand-700 rounded-full text-xs">{pending.length}</span>}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'
            }`}
        >
          History
        </button>
      </div>

      {activeTab === 'pending' && (
        pendingLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-3xl animate-pulse" />)}</div>
        ) : (
          renderTable(pending, false)
        )
      )}

      {activeTab === 'history' && (
        approvedLoading || rejectedLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-3xl animate-pulse" />)}</div>
        ) : (
          renderTable(history, true)
        )
      )}
    </div>
  );
};

export default RegistrationFeeApprovals;
