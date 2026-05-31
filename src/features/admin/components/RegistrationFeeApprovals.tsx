import { useState, useMemo } from 'react';
import { Check, X, Eye, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import {
  useAdminPendingRegistrationFees,
  useAdminApprovedRegistrationFees,
  useAdminRejectedRegistrationFees,
  useApproveRegistrationFee,
  useRejectRegistrationFee,
} from '@/app/store/RegistrationFeeStore';
import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';
import type { AdminPendingFee } from '@/api/registrationFee';

type TabValue = 'pending' | 'history';

const RegistrationFeeApprovals = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');

  const { data: pendingData, isLoading: pendingLoading } = useAdminPendingRegistrationFees();
  const { data: approvedData, isLoading: approvedLoading } = useAdminApprovedRegistrationFees();
  const { data: rejectedData, isLoading: rejectedLoading } = useAdminRejectedRegistrationFees();

  const approveMutation = useApproveRegistrationFee();
  const rejectMutation = useRejectRegistrationFee();

  const pending = useMemo(() => pendingData?.fees ?? [], [pendingData]);
  const history = useMemo(() => [
    ...(approvedData?.fees ?? []),
    ...(rejectedData?.fees ?? []),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [approvedData, rejectedData]);

  const filteredPending = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return pending;
    return pending.filter((f) =>
      f.user.fullName.toLowerCase().includes(q) ||
      f.user.email.toLowerCase().includes(q)
    );
  }, [pending, searchQuery]);

  const filteredHistory = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return history;
    return history.filter((f) =>
      f.user.fullName.toLowerCase().includes(q) ||
      f.user.email.toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  const handleApprove = (id: string) => {
    approveMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    if (!rejectReason.trim()) return;
    rejectMutation.mutate({ id, reason: rejectReason.trim() });
    setRejectId(null);
    setRejectReason('');
  };

  const renderTable = (fees: AdminPendingFee[], isHistory: boolean) => (
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
          {fees.map((fee) => (
            <tr key={fee.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="py-5 px-5 font-medium text-brand-900">{fee.user.fullName}</td>
              <td className="py-5 px-5 text-slate-500 text-sm">{fee.user.email}</td>
              <td className="py-5 px-5 text-brand-600 font-semibold">{formatCurrency(Number(fee.amount))}</td>
              <td className="py-5 px-5 text-slate-500 text-sm">
                {new Date(fee.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="py-5 px-5">
                <button onClick={() => { setReceiptUrl(fee.proofFile); setShowReceipt(true); }}
                  className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-xs underline cursor-pointer">
                  <Eye className="w-3 h-3" /> View
                </button>
              </td>
              <td className="py-5 px-5">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
                  ${fee.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                  ${fee.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                  ${fee.status === 'pending' ? 'bg-brand-100 text-brand-700' : ''}
                `}>
                  {fee.status}
                </span>
              </td>
              {!isHistory && (
                <td className="py-5 px-5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(fee.id)}
                      disabled={approveMutation.isPending}
                      className="p-2 bg-brand-100 text-brand-600 hover:bg-brand-200 rounded-xl transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRejectId(rejectId === fee.id ? null : fee.id)}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {rejectId === fee.id && (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Rejection reason..."
                        className="flex-1 px-3 py-1.5 border border-brand-200 rounded-xl text-xs focus:outline-none focus:border-red-400"
                      />
                      <button
                        onClick={() => handleReject(fee.id)}
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
      {fees.length === 0 && (
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

      {/* ── Search Bar ── */}
      {((activeTab === 'pending' && pending.length > 0) || (activeTab === 'history' && history.length > 0)) && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
          />
        </div>
      )}

      {activeTab === 'pending' && (
        pendingLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-3xl animate-pulse" />)}</div>
        ) : (
          renderTable(filteredPending, false)
        )
      )}

      {activeTab === 'history' && (
        approvedLoading || rejectedLoading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-3xl animate-pulse" />)}</div>
        ) : (
          renderTable(filteredHistory, true)
        )
      )}
      <ReceiptPreviewModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} imageUrl={receiptUrl} />
    </div>
  );
};

export default RegistrationFeeApprovals;
