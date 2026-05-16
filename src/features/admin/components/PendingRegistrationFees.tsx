import { useState } from 'react';
import { Check, X, ExternalLink, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { useAdminPendingFees, useApproveAdminFee, useRejectAdminFee } from '@/app/store/RegistrationFeeStore';
import RejectRegistrationModal from './RejectRegistrationModal';

const PendingRegistrationFees = () => {
  const { data, isLoading, isError, refetch } = useAdminPendingFees();
  const approveMutation = useApproveAdminFee();
  const rejectMutation = useRejectAdminFee();

  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fees = data?.fees ?? [];

  const handleApprove = (feeId: string) => {
    approveMutation.mutate(feeId, {
      onSuccess: () => {
        setSuccessMsg('Registration fee approved');
        setTimeout(() => setSuccessMsg(null), 2500);
      },
      onError: (err: Error) => {
        setSuccessMsg(null);
        setRejectError(err.message);
        setTimeout(() => setRejectError(null), 3000);
      },
    });
  };

  const handleReject = (reason: string) => {
    if (!rejectTarget) return;
    setRejectError(null);
    rejectMutation.mutate(
      { feeId: rejectTarget, reason },
      {
        onSuccess: () => {
          setRejectTarget(null);
          setSuccessMsg('Registration fee rejected');
          setTimeout(() => setSuccessMsg(null), 2500);
        },
        onError: (err: Error) => {
          setRejectError(err.message);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-slate-100 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-8 text-center">
        <p className="text-red-600 font-semibold mb-3">Failed to load pending fees.</p>
        <button onClick={() => refetch()} className="px-5 py-2 rounded-2xl bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {successMsg && (
        <div className="bg-brand-50 border border-brand-200 text-brand-700 text-sm rounded-2xl px-5 py-3 font-medium">
          {successMsg}
        </div>
      )}

      {rejectError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl px-5 py-3">
          {rejectError}
        </div>
      )}

      {fees.length === 0 ? (
        <div className="bg-white border border-brand-200 rounded-3xl p-10 text-center text-slate-500 text-sm">
          No pending registration fee submissions.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-4 px-5 text-sm font-semibold text-slate-500">User</th>
                <th className="py-4 px-5 text-sm font-semibold text-slate-500">Amount</th>
                <th className="py-4 px-5 text-sm font-semibold text-slate-500">Date</th>
                <th className="py-4 px-5 text-sm font-semibold text-slate-500">Receipt</th>
                <th className="py-4 px-5 text-sm font-semibold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-5 px-5">
                    <p className="font-medium text-brand-900">{fee.fullName || '—'}</p>
                    <p className="text-xs text-slate-400">{fee.email || ''}</p>
                  </td>
                  <td className="py-5 px-5 font-semibold text-brand-600">{formatCurrency(fee.amount)}</td>
                  <td className="py-5 px-5 text-slate-500 text-sm">
                    {new Date(fee.paymentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-5 px-5">
                    <a
                      href={fee.proofFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-xs underline cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" /> View
                    </a>
                  </td>
                  <td className="py-5 px-5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(fee.id)}
                        disabled={approveMutation.isPending}
                        className="p-2 bg-brand-100 text-brand-600 hover:bg-brand-200 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                        title="Approve"
                      >
                        {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => { setRejectTarget(fee.id); setRejectError(null); }}
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-xl transition-colors cursor-pointer"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RejectRegistrationModal
        isOpen={rejectTarget !== null}
        onClose={() => { setRejectTarget(null); setRejectError(null); }}
        onConfirm={handleReject}
        isPending={rejectMutation.isPending}
        error={rejectError}
      />
    </div>
  );
};

export default PendingRegistrationFees;
