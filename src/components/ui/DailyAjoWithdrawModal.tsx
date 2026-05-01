// src/components/ui/DailyAjoWithdrawModal.tsx
import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useModalStore } from '@/app/store/ModalStore';
import { useSubmitWithdrawal } from '@/app/store/WithdrwalStore';

interface DailyAjoWithdrawModalProps {
	isOpen: boolean;
	onClose: () => void;
	availableBalance: number;
}

const DailyAjoWithdrawModal = ({ isOpen, onClose, availableBalance }: DailyAjoWithdrawModalProps) => {
	const [amount, setAmount] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [isSuccess, setIsSuccess] = useState(false);
	const [submittedAmount, setSubmittedAmount] = useState(0);

	const openModal = useModalStore((state) => state.openModal);
	const { mutate: submitWithdrawal, isPending } = useSubmitWithdrawal();

	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				if (!isPending) handleClose();
			}
		};
		if (isOpen) document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, isPending]);

	useEffect(() => {
		if (isOpen) {
			setAmount('');
			setDescription('');
			setIsSuccess(false);
			setSubmittedAmount(0);
		}
	}, [isOpen]);

	const handleClose = () => {
		setIsSuccess(false);
		onClose();
	};

	const parsedAmount = parseInt(amount) || 0;
	const isExceeding = parsedAmount > availableBalance;
	const isValid = parsedAmount >= 100 && !isExceeding;

	const handleWithdraw = (e: React.FormEvent) => {
		e.preventDefault();
		if (!isValid || isPending) return;

		submitWithdrawal(
			{ amount: parsedAmount, description: description.trim() || undefined },
			{
				onSuccess: () => {
					setSubmittedAmount(parsedAmount);
					setIsSuccess(true);
				},
				onError: () => {
					openModal({
						type: 'error',
						title: 'Withdrawal Failed',
						message: 'Something went wrong. Please try again.',
					});
				},
			}
		);
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
						onClick={handleClose}
						disabled={isPending}
						className="p-1.5 -ml-1.5 cursor-pointer text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
						aria-label="Close"
					>
						<X className="w-5 h-5" />
					</button>
					<h2 className="text-lg font-semibold text-slate-900">
						{isSuccess ? 'Withdrawal Requested' : 'Withdraw Balance'}
					</h2>
					<div className="w-8" />
				</div>

				{/* Content */}
				<div className="px-5 py-4 sm:px-7">
					{isSuccess ? (
						/* ── Success State ── */
						<div className="flex flex-col items-center text-center py-6">
							<div className="relative mb-5">
								<div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
									<CheckCircle className="w-10 h-10 text-emerald-600" />
								</div>
								<span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full animate-ping opacity-60" />
							</div>

							<h3 className="text-xl font-bold text-slate-900 mb-1">Withdrawal Initiated!</h3>
							<p className="text-slate-500 text-sm mb-5 max-w-xs leading-relaxed">
								Your request for{' '}
								<span className="font-semibold text-slate-700">
									₦{submittedAmount.toLocaleString()}
								</span>{' '}
								has been submitted and will be processed within 24 hours.
							</p>

							{/* Timeline */}
							<div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 mb-6 text-left space-y-3">
								{[
									{ label: 'Request received', done: true },
									{ label: 'Admin review', done: false },
									{ label: 'Sent to your bank', done: false },
								].map(({ label, done }) => (
									<div key={label} className="flex items-center gap-3">
										<div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
											{done && (
												<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
													<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
												</svg>
											)}
										</div>
										<span className={`text-sm ${done ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
											{label}
										</span>
									</div>
								))}
							</div>

							<button
								onClick={handleClose}
								className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] text-white font-semibold py-3 rounded-2xl text-sm transition-all"
							>
								Done
							</button>
						</div>
					) : (
						/* ── Form State ── */
						<>
							<div className="flex items-center justify-center mb-4">
								<div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2 text-center">
									<p className="text-xs text-emerald-600 font-medium">Available Balance</p>
									<p className="text-xl font-bold text-emerald-700">₦{availableBalance.toLocaleString()}</p>
								</div>
							</div>

							<form onSubmit={handleWithdraw} className="space-y-3.5">
								<div>
									<div className="flex items-center justify-between mb-1.5">
										<label className="text-sm font-medium text-slate-700">Withdrawal Amount</label>
										<button
											type="button"
											onClick={handleUseMax}
											disabled={isPending}
											className="cursor-pointer text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
											disabled={isPending}
											className={`w-full pl-9 pr-5 py-3 border rounded-2xl focus:outline-none text-base font-medium placeholder:text-slate-400 transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed ${isExceeding
												? 'border-red-400 focus:border-red-500 bg-red-50'
												: 'border-slate-200 focus:border-emerald-600'
												}`}
											min="100"
											required
										/>
									</div>
									{isExceeding ? (
										<p className="text-xs text-red-500 mt-1 pl-1">Amount exceeds your available balance</p>
									) : (
										<p className="text-xs text-slate-400 mt-1 pl-1">Minimum ₦100 withdrawal</p>
									)}
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-700 mb-1.5">
										Description <span className="text-slate-400 font-normal">(Optional)</span>
									</label>
									<textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="e.g. Paying school fees, business expenses..."
										disabled={isPending}
										className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 h-20 resize-none text-sm leading-relaxed disabled:bg-slate-50 disabled:cursor-not-allowed"
									/>
								</div>

								<div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm">
									<span className="text-slate-700 font-medium">Note: </span>
									<span className="text-slate-500">Withdrawals are processed within 24 hours to your linked bank account.</span>
								</div>

								<button
									type="submit"
									disabled={!isValid || isPending}
									className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-semibold py-3 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2"
								>
									{isPending ? (
										<>
											<svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
											</svg>
											Processing…
										</>
									) : (
										`Withdraw ₦${parsedAmount > 0 ? parsedAmount.toLocaleString() : '—'}`
									)}
								</button>
							</form>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default DailyAjoWithdrawModal;