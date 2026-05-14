import { useState, useEffect } from 'react';
import { useGetAjoSettings, useUpdateAjoSettings } from '@/app/store/SettingsStore';
import { useModalStore } from '@/app/store/ModalStore';
import { Loader2 } from 'lucide-react';

const PlatformSettings = () => {
	const { data: settings, isLoading: settingsLoading } = useGetAjoSettings();
	const { mutate: updateSettings, isPending: updatePending } = useUpdateAjoSettings();
	const { openModal, closeModal } = useModalStore();

	// Form state for commission rate
	const [commissionRate, setCommissionRate] = useState(5);
	const [bankName, setBankName] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [accountName, setAccountName] = useState('');

	// Populate form when settings load
	useEffect(() => {
		if (settings) {
			const numericCommissionRate = Number(settings.commissionRate ?? 5);
			setCommissionRate(Number.isFinite(numericCommissionRate) ? numericCommissionRate : 5);
			setBankName(settings.bankName ?? '');
			setAccountNumber(settings.accountNumber ?? '');
			setAccountName(settings.accountName ?? '');
		}
	}, [settings]);

	const handleSaveCommissionRate = () => {
		updateSettings(
			{ commissionRate },
			{
				onSuccess: () => {
					openModal({
						type: 'success',
						title: 'Success',
						message: `Commission rate updated to ${commissionRate}%`,
					});
					setTimeout(() => closeModal(), 2500);
				},
				onError: (error: Error) => {
					openModal({
						type: 'error',
						title: 'Error',
						message: error.message || 'Failed to update commission rate. Please try again.',
					});
					setTimeout(() => closeModal(), 3000);
				},
			}
		);
	};

	const handleUpdateBankDetails = () => {
		updateSettings(
			{ bankName, accountNumber, accountName },
			{
				onSuccess: () => {
					openModal({
						type: 'success',
						title: 'Success',
						message: 'Bank details updated successfully',
					});
					setTimeout(() => closeModal(), 2500);
				},
				onError: (error: Error) => {
					openModal({
						type: 'error',
						title: 'Error',
						message: error.message || 'Failed to update bank details. Please try again.',
					});
					setTimeout(() => closeModal(), 3000);
				},
			}
		);
	};

	if (settingsLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="w-6 h-6 animate-spin text-amber-600" />
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6 lg:space-y-8">
			{/* Ajo Commission Rate */}
			<div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
				<div className="flex items-center gap-3 mb-5 sm:mb-6">
					<div className="w-8 h-8 bg-amber-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-base">
						⚙️
					</div>
					<h3 className="text-xl sm:text-2xl font-semibold text-blue-950">Ajo Commission Rate</h3>
				</div>

				<div className="flex items-center gap-4 sm:gap-8 mb-5 sm:mb-6">
					<input
						type="range"
						min="0"
						max="10"
						step="0.5"
						value={commissionRate}
						onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
						disabled={updatePending}
						className="flex-1 accent-amber-600 h-2 disabled:opacity-50"
					/>
					<span className="text-3xl sm:text-4xl font-bold text-amber-600 shrink-0 w-16 text-right">
						{commissionRate.toFixed(1)}%
					</span>
				</div>

				<p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
					This is the commission deducted from Ajo savings. Current rate applies to all new and existing
					users.
				</p>

				<button
					onClick={handleSaveCommissionRate}
					disabled={updatePending}
					className="mt-6 sm:mt-8 cursor-pointer bg-amber-600 hover:bg-amber-700 disabled:opacity-50 active:scale-95 transition-all text-white px-6 sm:px-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
				>
					{updatePending ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							Saving...
						</>
					) : (
						'Save Changes'
					)}
				</button>
			</div>

			{/* Bank Account Details */}
			<div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
				<h3 className="text-xl sm:text-2xl font-semibold text-blue-950 mb-5 sm:mb-8">
					Bank Account Details
				</h3>

				<div className="space-y-4 sm:space-y-6">
					<div>
						<label className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium">
							Bank Name
						</label>
						<input
							type="text"
							placeholder="Enter bank name"
							value={bankName}
							onChange={(e) => setBankName(e.target.value)}
							disabled={updatePending}
							className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-amber-200 rounded-xl sm:rounded-2xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm sm:text-base transition-colors disabled:opacity-50"
						/>
					</div>
					<div>
						<label className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium">
							Account Number
						</label>
						<input
							type="text"
							placeholder="Enter account number"
							value={accountNumber}
							onChange={(e) => setAccountNumber(e.target.value)}
							disabled={updatePending}
							className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-amber-200 rounded-xl sm:rounded-2xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm sm:text-base transition-colors disabled:opacity-50"
						/>
					</div>
					<div>
						<label className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium">
							Account Name
						</label>
						<input
							type="text"
							placeholder="Enter account name"
							value={accountName}
							onChange={(e) => setAccountName(e.target.value)}
							disabled={updatePending}
							className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-amber-200 rounded-xl sm:rounded-2xl focus:border-amber-600 focus:ring-2 focus:ring-amber-100 outline-none text-sm sm:text-base transition-colors disabled:opacity-50"
						/>
					</div>
				</div>

				<button
					onClick={handleUpdateBankDetails}
					disabled={updatePending}
					className="mt-6 sm:mt-10 cursor-pointer bg-amber-600 hover:bg-amber-700 disabled:opacity-50 active:scale-95 transition-all text-white px-6 sm:px-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
				>
					{updatePending ? (
						<>
							<Loader2 className="w-4 h-4 animate-spin" />
							Updating...
						</>
					) : (
						'Update Bank Details'
					)}
				</button>
			</div>
		</div>
	);
};

export default PlatformSettings;