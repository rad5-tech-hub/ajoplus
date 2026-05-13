import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { submitWithdrawal, type SubmitWithdrawalRequest } from '@/api/withdrawals';

interface DailyAjoState {
	isActive: boolean;
	dailyAmount: number;
	totalSaved: number;
	commissionPaid: number;
	availableBalance: number;
	daysSaved: number;
	isLoading: boolean;
	error: string | null;

	withdraw: (payload: SubmitWithdrawalRequest) => Promise<{ success: boolean; message?: string }>;
	clearError: () => void;
	resetDailyAjo: () => void;

	syncFromWallet: (wallet: {
		dailyAmount: number;
		totalSaved: number;
		commissionPaid: number;
		availableBalance: number;
		daysSaved: number;
		hasActivePlans?: boolean;
	}) => void;
	clearForLogout: () => Promise<void>;
}

const INITIAL_STATE = {
	isActive: false,
	dailyAmount: 0,
	totalSaved: 0,
	commissionPaid: 0,
	availableBalance: 0,
	daysSaved: 0,
	isLoading: false,
	error: null,
};

export const useDailyAjoStore = create<DailyAjoState>()(
	persist(
		(set, get) => ({
			isActive: false,
			dailyAmount: 0,
			totalSaved: 0,
			commissionPaid: 0,
			availableBalance: 0,
			daysSaved: 0,
			isLoading: false,
			error: null,

			withdraw: async (payload: SubmitWithdrawalRequest) => {
				const { amount } = payload;
				const state = get();

				if (amount < 100) {
					set({ error: 'Minimum withdrawal amount is ₦100' });
					return { success: false, message: 'Minimum withdrawal amount is ₦100' };
				}
				if (amount > state.availableBalance) {
					set({ error: 'Insufficient available balance' });
					return { success: false, message: 'Insufficient available balance' };
				}
				if (!state.isActive) {
					set({ error: 'No active Daily Ajo savings plan' });
					return { success: false, message: 'No active Daily Ajo savings plan' };
				}

				set({ isLoading: true, error: null });

				try {
					await submitWithdrawal(payload);

					set({ isLoading: false });

					return {
						success: true,
						message: 'Withdrawal request submitted successfully',
					};
				} catch (err: unknown) {
					const message =
						(err as { message?: string })?.message ||
						'Failed to process withdrawal. Please try again.';
					set({ error: message, isLoading: false });
					throw new Error(message);
				}
			},

			clearError: () => set({ error: null }),

			syncFromWallet: (wallet: {
				dailyAmount: number;
				totalSaved: number;
				commissionPaid: number;
				availableBalance: number;
				daysSaved: number;
				hasActivePlans?: boolean;
			}) =>
				set({
					isActive: wallet.dailyAmount > 0 || wallet.hasActivePlans === true,
					dailyAmount: wallet.dailyAmount,
					totalSaved: wallet.totalSaved,
					commissionPaid: wallet.commissionPaid,
					availableBalance: wallet.availableBalance,
					daysSaved: wallet.daysSaved,
				}),

			clearForLogout: async () => {
				set(INITIAL_STATE);

				// Lazy imports to avoid circular dependencies
				const { useWithdrawalStore } = await import('./WithdrawalStore');
				const { usePendingPaymentStore } = await import('./PendingPaymentStore');

				useWithdrawalStore.getState().clearAll();
				usePendingPaymentStore.getState().clearAll();
			},

			resetDailyAjo: () => set(INITIAL_STATE),
		}),
		{
			name: 'daily-ajo-storage',
			partialize: () => ({}), // persist nothing — all values from server on login
		}
	)
);