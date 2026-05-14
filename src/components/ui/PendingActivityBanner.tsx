import { Clock, X } from 'lucide-react';
import { useWithdrawalStore } from '@/app/store/WithdrawalStore';
import { usePendingPaymentStore } from '@/app/store/PendingPaymentStore';
import { formatCurrency } from '@/lib/currency';

const PAYMENT_TYPE_LABELS: Record<string, string> = {
  package: 'Package payment',
  product: 'Cart payment',
  saving: 'Savings deposit',
};

const PendingActivityBanner = () => {
  const pendingWithdrawals = useWithdrawalStore((s) => s.pending);
  const pendingPayments = usePendingPaymentStore((s) => s.pending);
  const removePendingW = useWithdrawalStore((s) => s.removePending);
  const removePendingP = usePendingPaymentStore((s) => s.removePending);

  const hasActivity =
    pendingPayments.length > 0 || pendingWithdrawals.length > 0;

  if (!hasActivity) return null;

  return (
    <div className="space-y-3 mb-6">

      {/* Pending payment submissions */}
      {pendingPayments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3.5 text-sm"
        >
          <Clock className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-yellow-800">
              {PAYMENT_TYPE_LABELS[payment.paymentType] ?? 'Payment'} pending review
            </p>
            <p className="text-yellow-700 text-xs mt-0.5">
              ₦{parseFloat(payment.amountPaid).toLocaleString()} submitted —
              your balance will update once an admin approves it.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full">
              Pending
            </span>
            <button
              onClick={() => removePendingP(payment.id)}
              className="text-yellow-400 cursor-pointer hover:text-yellow-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}

      {/* Pending withdrawals */}
      {pendingWithdrawals.map((withdrawal) => (
        <div
          key={withdrawal.id}
          className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3.5 text-sm"
        >
          <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-blue-800">Withdrawal request pending</p>
            <p className="text-blue-700 text-xs mt-0.5">
              {formatCurrency(Number(withdrawal.amount), 'NGN')} deducted from your
              balance and awaiting admin approval.
              {withdrawal.description && ` "${withdrawal.description}"`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full whitespace-nowrap">
              In review
            </span>
            <button
              onClick={() => removePendingW(withdrawal.id)}
              className="text-blue-400 cursor-pointer hover:text-blue-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}

    </div>
  );
};

export default PendingActivityBanner;