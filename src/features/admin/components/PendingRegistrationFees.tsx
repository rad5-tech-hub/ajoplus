import { useState } from 'react';
import { Check, X, Eye } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { useAdminPendingFees, useAdminApprovedRejectedFees, useApproveAdminFee, useRejectAdminFee } from '@/app/store/RegistrationFeeStore';
import RejectRegistrationModal from './RejectRegistrationModal';
import ReceiptPreviewModal from '@/components/ui/ReceiptPreviewModal';

const PendingRegistrationFees = () => {
  const { data: pendingData, isLoading: pendingLoading, isError: pendingError, refetch: refetchPending } = useAdminPendingFees();
  const [historyStatus, setHistoryStatus] = useState<'approved' | 'rejected'>('approved');
  const { data: historyData, isLoading: historyLoading } = useAdminApprovedRejectedFees(historyStatus);
  const approveMutation = useApproveAdminFee();
  const rejectMutation = useRejectAdminFee();

  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState('');

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const pendingFees = pendingData?.fees ?? [];
  const historyFees = historyData?.fees ?? [];

  const isLoading = pendingLoading || historyLoading;
  const isError = pendingError;

  const handleApprove = (feeId: string) => {
    approveMutation.mutate(feeId, {
      onSuccess: () => { setSuccessMsg('Registration fee approved'); setTimeout(() => setSuccessMsg(null), 2500); },
      onError: (err: Error) => { setSuccessMsg(null); setRejectError(err.message); setTimeout(() => setRejectError(null), 3000); },
    });
  };

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    setRejectError(null);
    rejectMutation.mutate(
      { feeId: rejectTarget, reason },
      {
        onSuccess: () => { setRejectTarget(null); setSuccessMsg('Registration fee rejected'); setTimeout(() => setSuccessMsg(null), 2500); },
        onError: (err: Error) => { setRejectError(err.message); },
      }
    );
  };

  const renderFee = (fee: Record<string, unknown>) => {
  const id = fee.id as string;
  const user = fee.user as Record<string, unknown> | undefined;
  const fullName = (user?.fullName as string) || (fee.fullName as string) || '—';
  const email = (user?.email as string) || (fee.email as string) || '';
  const phone = (user?.phoneNumber as string) || '';
  const role = (user?.role as string) || 'customer';
  const amount = typeof fee.amount === 'string' ? parseFloat(fee.amount) : (fee.amount as number);
  const paymentDate = fee.paymentDate as string;
  const proofFile = fee.proofFile as string;
  const status = fee.status as string;
  const rejectionReason = fee.rejectionReason as string | null;

  return (
    <div key={id} className="bg-white border border-brand-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-slate-800 text-sm">{fullName}</p>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${role === 'agent' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'}`}>{role}</span>
          {rejectionReason && <p className="text-xs text-red-600 italic mt-1 w-full">{rejectionReason}</p>}
        </div>
        <p className="text-xs text-slate-400">{email}</p>
        {phone && <p className="text-xs text-slate-400">{phone}</p>}
        <p className="text-xs text-slate-500 mt-0.5">
          {formatCurrency(amount)} • {new Date(paymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => { setReceiptUrl(proofFile); setShowReceipt(true); }}
          className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer" title="View receipt">
          <Eye className="w-4 h-4" />
        </button>
        {activeTab === 'pending' && (
          <>
            <button onClick={() => handleApprove(id)} disabled={approveMutation.isPending}
              className="p-1.5 bg-brand-100 text-brand-600 hover:bg-brand-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer" title="Approve">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => { setRejectTarget(id); setRejectError(null); }}
              className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors cursor-pointer" title="Reject">
              <X className="w-4 h-4" />
            </button>
          </>
        )}
        {activeTab === 'history' && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
};

  return (
    <div className="space-y-4">
      {successMsg && <div className="bg-brand-50 border border-brand-200 text-brand-700 text-sm rounded-2xl px-5 py-3 font-medium">{successMsg}</div>}
      {rejectError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-3">{rejectError}</div>}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-brand-200">
        <button onClick={() => setActiveTab('pending')}
          className={`pb-2 font-medium text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'pending' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}>
          Pending {pendingFees.length > 0 && `(${pendingFees.length})`}
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`pb-2 font-medium text-sm transition-colors border-b-2 cursor-pointer ${activeTab === 'history' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500'}`}>
          History
        </button>
      </div>

      {/* History status filter */}
      {activeTab === 'history' && (
        <div className="flex gap-1.5">
          <button onClick={() => setHistoryStatus('approved')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${historyStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
            Approved
          </button>
          <button onClick={() => setHistoryStatus('rejected')}
            className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-colors cursor-pointer ${historyStatus === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
            Rejected
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-slate-100 rounded-3xl animate-pulse" />)}</div>
      ) : isError ? (
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center">
          <p className="text-red-600 font-semibold mb-3">Failed to load registration fees.</p>
          <button onClick={() => refetchPending()} className="px-5 py-2 rounded-2xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors cursor-pointer">Retry</button>
        </div>
      ) : activeTab === 'pending' ? (
        pendingFees.length === 0 ? (
          <div className="bg-white border border-brand-200 rounded-3xl p-10 text-center text-slate-500 text-sm">No pending registration fee submissions.</div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">{pendingFees.length} pending fee{pendingFees.length !== 1 ? 's' : ''}</p>
            {pendingFees.map((fee) => renderFee(fee as unknown as Record<string, unknown>))}
          </div>
        )
      ) : (
        historyFees.length === 0 ? (
          <div className="bg-white border border-brand-200 rounded-3xl p-10 text-center text-slate-500 text-sm">No {historyStatus} registration fees found.</div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-slate-500">{historyFees.length} {historyStatus} fee{historyFees.length !== 1 ? 's' : ''}</p>
            {historyFees.map((fee) => renderFee(fee as unknown as Record<string, unknown>))}
          </div>
        )
      )}

      <RejectRegistrationModal isOpen={rejectTarget !== null} onClose={() => { setRejectTarget(null); setRejectError(null); }}
        onConfirm={handleReject} isPending={rejectMutation.isPending} error={rejectError} />

      <ReceiptPreviewModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} imageUrl={receiptUrl} />
    </div>
  );
};

export default PendingRegistrationFees;
