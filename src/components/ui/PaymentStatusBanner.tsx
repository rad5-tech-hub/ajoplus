import { Clock, X } from 'lucide-react';
import { useWithdrawalStore } from '@/app/store/WithdrawalStore';
import { formatCurrency } from '@/lib/currency';

const PaymentStatusBanner = () => {
	const pendingWithdrawals = useWithdrawalStore((s) => s.pending);
	const removePendingW = useWithdrawalStore((s) => s.removePending);

	if (pendingWithdrawals.length === 0) return null;

	return (
		<div className="space-y-3 mb-6">
			{/* Pending withdrawals — local Zustand */}
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
