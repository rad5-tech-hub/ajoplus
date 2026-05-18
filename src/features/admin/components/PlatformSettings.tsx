import { useState, useEffect } from 'react';
import { useGetAjoSettings, useUpdateAjoSettings } from '@/app/store/SettingsStore';
import { useModalStore } from '@/app/store/ModalStore';
import { Loader2 } from 'lucide-react';

const PlatformSettings = () => {
	const { data: settings, isLoading: settingsLoading } = useGetAjoSettings();
	const { mutate: updateSettings, isPending: updatePending } = useUpdateAjoSettings();
	const { openModal, closeModal } = useModalStore();

	const [bankName, setBankName] = useState('');
	const [accountNumber, setAccountNumber] = useState('');
	const [accountName, setAccountName] = useState('');

	// Populate form when settings load
	useEffect(() => {
		if (settings) {
			setBankName(settings.bankName ?? '');
			setAccountNumber(settings.accountNumber ?? '');
			setAccountName(settings.accountName ?? '');
		}
	}, [settings]);

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
				<Loader2 className="w-6 h-6 animate-spin text-brand-600" />
			</div>
		);
	}

	return (
		<div className="space-y-4 sm:space-y-6 lg:space-y-8">
			{/* Bank Account Details */}
			<div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
				<h3 className="text-xl sm:text-2xl font-semibold text-brand-900 mb-5 sm:mb-8">
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
							className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-brand-200 rounded-xl sm:rounded-2xl focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm sm:text-base transition-colors disabled:opacity-50"
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
							className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-brand-200 rounded-xl sm:rounded-2xl focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm sm:text-base transition-colors disabled:opacity-50"
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
							className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-brand-200 rounded-xl sm:rounded-2xl focus:border-brand-600 focus:ring-2 focus:ring-brand-100 outline-none text-sm sm:text-base transition-colors disabled:opacity-50"
						/>
					</div>
				</div>

				<button
					onClick={handleUpdateBankDetails}
					disabled={updatePending}
					className="mt-6 sm:mt-10 cursor-pointer bg-brand-600 hover:bg-brand-700 disabled:opacity-50 active:scale-95 transition-all text-white px-6 sm:px-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base w-full sm:w-auto flex items-center justify-center gap-2"
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