import { useEffect } from 'react';
import { Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { useRegistrationFeeStatus } from '@/app/store/RegistrationFeeStore';
import { useAuthStore } from '@/app/store/authStore';

const PendingApprovalOverlay = () => {
  const { user } = useAuthStore();
  const { data, isError, refetch, isFetching } = useRegistrationFeeStatus();

  const status = data?.user?.registrationFeeStatus;
  const isBlocking = status === 'pending' || status === 'rejected';

  useEffect(() => {
    if (!isBlocking) return;
    const interval = setInterval(() => refetch(), 30_000);
    return () => clearInterval(interval);
  }, [isBlocking, refetch]);

  if (user?.role !== 'agent') return null;
  if (!isBlocking) return null;

  const fee = data?.latestFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md mx-4 shadow-2xl p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-brand-600" />
        </div>

        <h2 className="text-xl font-bold text-brand-900 mb-2">
          {status === 'rejected' ? 'Payment Rejected' : 'Payment Pending Approval'}
        </h2>

        <p className="text-slate-500 text-sm mb-6">
          {status === 'rejected'
            ? 'Your registration fee payment was not approved. Please contact support to resubmit.'
            : 'Your registration fee payment is pending admin approval. You will be notified once it is approved. You cannot access your dashboard until then.'}
        </p>

        {fee?.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700 mb-4 text-left">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Reason:</p>
                <p>{fee.rejectionReason}</p>
              </div>
            </div>
          </div>
        )}

        {fee && status !== 'rejected' && (
          <div className="bg-slate-50 border border-brand-200 rounded-2xl p-4 text-left text-sm space-y-2 mb-6">
            <p className="text-slate-500">Submitted on: <span className="font-medium text-slate-700">{new Date(fee.createdAt).toLocaleDateString()}</span></p>
            <p className="text-slate-500">Amount: <span className="font-medium text-slate-700">₦{fee.amount.toLocaleString()}</span></p>
            {fee.proofFile && (
              <a href={fee.proofFile} target="_blank" rel="noopener noreferrer"
                className="text-brand-600 hover:text-brand-700 underline font-medium inline-block">
                View Receipt
              </a>
            )}
          </div>
        )}

        <div className="bg-slate-50 border border-brand-200 rounded-2xl p-4 text-sm text-slate-600 mb-6">
          <p className="font-medium text-slate-700 mb-1">Need help?</p>
          <p>Contact support at <span className="text-brand-600 font-medium">support@abagold.com</span></p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold py-3 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Checking...' : 'Refresh Status'}
        </button>

        {isError && (
          <p className="text-xs text-red-500 mt-3">Could not check status. Try again.</p>
        )}
      </div>
    </div>
  );
};

export default PendingApprovalOverlay;
