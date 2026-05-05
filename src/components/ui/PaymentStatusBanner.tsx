import { Clock, AlertCircle, X } from 'lucide-react';
import { useGetMyRejectedPayments } from '@/app/store/PaymentStore';
import { useWithdrawalStore, useGetMyRejectedWithdrawals } from '@/app/store/WithdrawalStore';
import { formatCurrency } from '@/lib/currency';

const PAYMENT_TYPE_LABELS: Record<string, string> = {
	package: 'Package payment',
	product: 'Cart payment',
	saving: 'Savings deposit',
};

const PaymentStatusBanner = () => {
	const { data: rejectedData, isLoading: rejectedLoading } = useGetMyRejectedPayments();
	const { data: rejectedWithdrawalsData, isLoading: withdrawalsLoading } = useGetMyRejectedWithdrawals();
	const pendingWithdrawals = useWithdrawalStore((s) => s.pending);
	const removePendingW = useWithdrawalStore((s) => s.removePending);

	const rejectedPayments = rejectedData?.payments ?? [];
	const rejectedWithdrawals = rejectedWithdrawalsData?.withdrawals ?? [];

	const hasActivity =
		rejectedPayments.length > 0 || rejectedWithdrawals.length > 0 || pendingWithdrawals.length > 0;
	if (rejectedLoading || withdrawalsLoading || !hasActivity) return null;

	return (
		<div className="space-y-3 mb-6">
			{/* Rejected payments — server data, actionable */}
			{rejectedPayments.map((payment) => (
				<div
					key={payment.id}
					className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5 text-sm"
				>
					<AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
					<div className="flex-1 min-w-0">
						<p className="font-medium text-red-700">
							{PAYMENT_TYPE_LABELS[payment.paymentType] ?? 'Payment'} was rejected
						</p>
						<p className="text-red-600 text-xs mt-0.5">
							₦{parseFloat(payment.amountPaid).toLocaleString()} —{' '}
							{payment.rejectionReason
								? `Reason: ${payment.rejectionReason}`
								: 'Please resubmit with a valid receipt.'}
						</p>
					</div>
					<span className="shrink-0 text-xs font-medium bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full">
						Rejected
					</span>
				</div>
			))}

			{/* Rejected withdrawals — server data */}
			{rejectedWithdrawals.map((withdrawal) => (
				<div
					key={withdrawal.id}
					className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5 text-sm"
				>
					<AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
					<div className="flex-1 min-w-0">
						<p className="font-medium text-red-700">Withdrawal request was rejected</p>
						<p className="text-red-600 text-xs mt-0.5">
							{formatCurrency(Number(withdrawal.amount), 'NGN')} —{' '}
							{withdrawal.rejectionReason
								? `Reason: ${withdrawal.rejectionReason}`
								: 'Please try again with updated details.'}
						</p>
					</div>
					<span className="shrink-0 text-xs font-medium bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded-full">
						Rejected
					</span>
				</div>
			))}

			{/* Pending withdrawals — local Zustand (no API endpoint exists) */}
			{pendingWithdrawals.map((withdrawal) => (
				<div
					key={withdrawal.id}
					className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3.5 text-sm"
				>
					<Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
					<div className="flex-1 min-w-0">
						<p className="font-medium text-blue-800">Withdrawal request pending</p>
						<p className="text-blue-700 text-xs mt-0.5">
							{formatCurrency(Number(withdrawal.amount), 'NGN')} deducted, awaiting admin approval.
							{withdrawal.description && ` "${withdrawal.description}"`}
						</p>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<span className="text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
							In review
						</span>
						<button
							onClick={() => removePendingW(withdrawal.id)}
							className="text-blue-400 hover:text-blue-600 transition-colors"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default PaymentStatusBanner;
