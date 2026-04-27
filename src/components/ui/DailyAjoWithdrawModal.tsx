// src/features/customer/dashboard/components/DailyAjoWithdrawModal.tsx
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useDailyAjoStore } from '@/app/store/DailyAjoStore';
import { useModalStore } from '@/app/store/ModalStore';

interface DailyAjoWithdrawModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const DailyAjoWithdrawModal = ({ isOpen, onClose }: DailyAjoWithdrawModalProps) => {
	const [amount, setAmount] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	const { availableBalance } = useDailyAjoStore();
	const openModal = useModalStore((state) => state.openModal);

	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				onClose();
			}
		};
		if (isOpen) document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			setAmount('');
			setDescription('');
		}
	}, [isOpen]);

	const parsedAmount = parseInt(amount) || 0;
	const isExceeding = parsedAmount > availableBalance;
	const isValid = parsedAmount >= 100 && !isExceeding;

	const handleWithdraw = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isValid) return;

		// TODO: wire to store withdraw action
		// useDailyAjoStore.getState().withdraw(parsedAmount);

		openModal({
			type: 'success',
			title: 'Withdrawal Initiated!',
			message: `₦${parsedAmount.toLocaleString()} will be sent to your linked account within 24 hours.`,
		});

		setTimeout(() => {
			useModalStore.getState().closeModal();
			onClose();
		}, 1200);
	};

	const handleUseMax = () => setAmount(String(availableBalance));

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
			<div
				ref={modalRef}
				className="bg-white rounded-3xl w-full max-w-2xl mx-auto shadow-2xl transition-all duration-300 my-auto"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
					<button
						onClick={onClose}
						className="p-1.5 -ml-1.5 cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
						aria-label="Close"
					>
						<X className="w-5 h-5" />
					</button>

					<h2 className="text-lg font-semibold text-slate-900">Withdraw Balance</h2>

					<div className="w-8" />
				</div>

				{/* Content */}
				<div className="px-5 py-4 sm:px-7">
					{/* Available Balance Chip */}
					<div className="flex items-center justify-center mb-4">
						<div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2 text-center">
							<p className="text-xs text-emerald-600 font-medium">Available Balance</p>
							<p className="text-xl font-bold text-emerald-700">₦{availableBalance.toLocaleString()}</p>
						</div>
					</div>

					<form onSubmit={handleWithdraw} className="space-y-3.5">
						{/* Amount */}
						<div>
							<div className="flex items-center justify-between mb-1.5">
								<label className="text-sm font-medium text-slate-700">Withdrawal Amount</label>
								<button
									type="button"
									onClick={handleUseMax}
									className="cursor-pointer text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
								>
									Use Max
								</button>
							</div>
							<div className="relative">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₦</span>
								<input
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder="0"
									className={`w-full pl-9 pr-5 py-3 border rounded-2xl focus:outline-none text-base font-medium placeholder:text-slate-400 transition-colors ${
										isExceeding
											? 'border-red-400 focus:border-red-500 bg-red-50'
											: 'border-slate-200 focus:border-emerald-600'
									}`}
									min="100"
									required
								/>
							</div>

							{/* Inline feedback */}
							{isExceeding ? (
								<p className="text-xs text-red-500 mt-1 pl-1">Amount exceeds your available balance</p>
							) : (
								<p className="text-xs text-slate-400 mt-1 pl-1">Minimum ₦100 withdrawal</p>
							)}
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">
								Description <span className="text-slate-400 font-normal">(Optional)</span>
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="e.g. Paying school fees, business expenses..."
								className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 h-20 resize-none text-sm leading-relaxed"
							/>
						</div>

						{/* Info Note */}
						<div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm">
							<span className="text-slate-700 font-medium">Note: </span>
							<span className="text-slate-500">Withdrawals are processed within 24 hours to your linked bank account.</span>
						</div>

						{/* Submit */}
						<button
							type="submit"
							disabled={!isValid}
							className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-semibold py-3 rounded-2xl text-sm transition-all duration-200"
						>
							Withdraw ₦{parsedAmount > 0 ? parsedAmount.toLocaleString() : '—'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default DailyAjoWithdrawModal;