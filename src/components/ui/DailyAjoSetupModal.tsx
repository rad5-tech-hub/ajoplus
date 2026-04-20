// src/features/customer/dashboard/components/DailyAjoSetupModal.tsx
import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useDailyAjoStore } from '@/app/store/DailyAjoStore';
import { useModalStore } from '@/app/store/ModalStore';

interface DailyAjoSetupModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const DailyAjoSetupModal = ({ isOpen, onClose }: DailyAjoSetupModalProps) => {
	const [dailyAmount, setDailyAmount] = useState<string>('');
	const [description, setDescription] = useState<string>('');

	const startDailyAjo = useDailyAjoStore((state) => state.startDailyAjo);
	const openModal = useModalStore((state) => state.openModal);

	const modalRef = useRef<HTMLDivElement>(null);

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen, onClose]);

	// Reset form when opened
	useEffect(() => {
		if (isOpen) {
			setDailyAmount('');
			setDescription('');
		}
	}, [isOpen]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const amount = parseInt(dailyAmount);
		if (!amount || amount < 100) return;

		startDailyAjo(amount);

		openModal({
			type: 'success',
			title: 'Daily Ajo Activated!',
			message: `You are now saving ₦${amount.toLocaleString()} daily. The company takes 5% monthly commission.`,
		});

		setTimeout(() => {
			useModalStore.getState().closeModal();
			onClose();
		}, 2500);
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto">
			<div
				ref={modalRef}
				className="bg-white rounded-3xl w-full max-w-lg mx-auto shadow-2xl transition-all duration-300 my-auto"
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
					<button
						onClick={onClose}
						className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
						aria-label="Close"
					>
						<X className="w-6 h-6" />
					</button>

					<h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
						Start Daily Ajo
					</h2>

					<div className="w-10" />
				</div>

				{/* Content - More compact and centered */}
				<div className="p-6 sm:p-8">
					<p className="text-slate-600 text-base sm:text-lg leading-relaxed text-center mb-8">
						How much would you like to save daily?
						The company charges a <span className="font-medium text-emerald-700">5% monthly service fee</span>.
					</p>

					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Daily Amount */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Daily Savings Amount
							</label>
							<div className="relative">
								<span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">₦</span>
								<input
									type="number"
									value={dailyAmount}
									onChange={(e) => setDailyAmount(e.target.value)}
									placeholder="500"
									className="w-full pl-12 pr-6 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 text-lg font-medium placeholder:text-slate-400"
									min="100"
									required
								/>
							</div>
							<p className="text-xs text-slate-500 mt-1.5 pl-1">Minimum ₦100 per day</p>
						</div>

						{/* Description */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Purpose / Description <span className="text-slate-400">(Optional)</span>
							</label>
							<textarea
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Saving for school fees, business capital, or emergency fund..."
								className="w-full px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 h-24 sm:h-28 resize-y text-base leading-relaxed"
							/>
						</div>

						{/* Example Note */}
						<div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-sm">
							<p className="text-emerald-700 font-medium mb-1">Example:</p>
							<p className="text-slate-600">
								Saving ₦500 daily = ₦15,000/month → ₦750 commission → You get ₦14,250
							</p>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] text-white font-semibold py-4 rounded-2xl text-base sm:text-lg transition-all duration-200"
						>
							Start Saving Daily
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default DailyAjoSetupModal;