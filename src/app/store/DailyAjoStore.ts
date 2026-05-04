import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { walletApi, type WithdrawalRequest } from '@/api/wallet';

interface DailyAjoState {
  isActive: boolean;
  dailyAmount: number;
  totalSaved: number;
  commissionPaid: number;
  availableBalance: number;
  daysSaved: number;
  startDate: string | null;
  isLoading: boolean;
  error: string | null;

  startDailyAjo: (dailyAmount: number) => void;
  addToSavings: (amount: number) => void;
  withdraw: (payload: WithdrawalRequest) => Promise<{ success: boolean; message?: string }>;
  clearError: () => void;
  resetDailyAjo: () => void;

  // ✅ Add these two — they exist in the implementation but were missing from the interface
  syncFromWallet: (wallet: {
    dailyAmount: number;
    totalSaved: number;
    commissionPaid: number;
    availableBalance: number;
    daysSaved: number;
  }) => void;
  clearForLogout: () => Promise<void>;
}

export const useDailyAjoStore = create<DailyAjoState>()(
	persist(
		(set, get) => ({
			isActive: false,
			dailyAmount: 0,
			totalSaved: 0,
			commissionPaid: 0,
			availableBalance: 0,
			daysSaved: 0,
			startDate: null,
			isLoading: false,
			error: null,

			startDailyAjo: (amount: number) => {
				if (amount <= 0) return;
				set({
					isActive: true,
					dailyAmount: amount,
					totalSaved: 0,
					commissionPaid: 0,
					availableBalance: 0,
					daysSaved: 0,
					startDate: new Date().toISOString(),
					error: null,
				});
			},

			addToSavings: (amount: number) => {
				const state = get();
				if (!state.isActive || amount <= 0) return;
				const newTotal = state.totalSaved + amount;
				const newCommission = Math.round(newTotal * 0.05);
				const newBalance = newTotal - newCommission;
				set({
					totalSaved: newTotal,
					commissionPaid: newCommission,
					availableBalance: newBalance,
					daysSaved: state.daysSaved + 1,
				});
			},

			withdraw: async (payload: WithdrawalRequest) => {
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
					const response = await walletApi.createWithdrawal(payload);

					// Do NOT update availableBalance here — request is pending admin approval.
					// The customerWallet query refetch will reflect the accurate server balance.
					set({ isLoading: false });

					return {
						success: true,
						message: response.message || 'Withdrawal request submitted successfully',
					};
				} catch (err: unknown) {
					const errorMessage =
						(err as { message?: string })?.message ||
						'Failed to process withdrawal. Please try again.';
					set({ error: errorMessage, isLoading: false });
					throw new Error(errorMessage);
				}
			},

			clearError: () => set({ error: null }),

			syncFromWallet: (wallet: {
				dailyAmount: number;
				totalSaved: number;
				commissionPaid: number;
				availableBalance: number;
				daysSaved: number;
			}) =>
				set({
					isActive: wallet.dailyAmount > 0,
					dailyAmount: wallet.dailyAmount,
					totalSaved: wallet.totalSaved,
					commissionPaid: wallet.commissionPaid,
					availableBalance: wallet.availableBalance,
					daysSaved: wallet.daysSaved,
				}),

			clearForLogout: async () => {
				set({
					isActive: false,
					dailyAmount: 0,
					totalSaved: 0,
					commissionPaid: 0,
					availableBalance: 0,
					daysSaved: 0,
					startDate: null,
					isLoading: false,
					error: null,
				});

				// Lazy imports to avoid circular dependencies
				const { useWithdrawalStore } = await import('./WithdrawalStore');
				const { usePendingPaymentStore } = await import('./PendingPaymentStore');

				useWithdrawalStore.getState().clearAll();
				usePendingPaymentStore.getState().clearAll();
			},

			resetDailyAjo: () =>
				set({
					isActive: false,
					dailyAmount: 0,
					totalSaved: 0,
					commissionPaid: 0,
					availableBalance: 0,
					daysSaved: 0,
					startDate: null,
					isLoading: false,
					error: null,
				}),
		}),
		{
			name: 'daily-ajo-storage',
			partialize: () => ({}), // persist nothing — all values from server on login
		}
	)
);