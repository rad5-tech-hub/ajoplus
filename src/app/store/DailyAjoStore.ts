// src/app/store/dailyAjoStore.ts
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

	// Actions
	startDailyAjo: (dailyAmount: number) => void;
	addToSavings: (amount: number) => void;
	withdraw: (payload: WithdrawalRequest) => Promise<{ success: boolean; message?: string }>;
	clearError: () => void;
	resetDailyAjo: () => void;
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

				const today = new Date().toISOString();
				set({
					isActive: true,
					dailyAmount: amount,
					totalSaved: 0,
					commissionPaid: 0,
					availableBalance: 0,
					daysSaved: 0,
					startDate: today,
					error: null,
				});
			},

			addToSavings: (amount: number) => {
				const state = get();
				if (!state.isActive || amount <= 0) return;

				const newTotal = state.totalSaved + amount;
				const newCommission = Math.round(newTotal * 0.05); // 5% commission (can be made dynamic later)
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

				// Client-side validations
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

					// Update local balance from server response
					const newAvailableBalance = response.data.wallet.availableBalance;

					set({
						availableBalance: newAvailableBalance,
						isLoading: false,
					});

					return {
						success: true,
						message: response.message || 'Withdrawal request submitted successfully',
					};
				} catch (err: unknown) {
					const errorMessage = (err as { message?: string })?.message || 'Failed to process withdrawal. Please try again.';

					set({
						error: errorMessage,
						isLoading: false,
					});

					throw new Error(errorMessage);
				}
			},

			clearError: () => set({ error: null }),

			resetDailyAjo: () => {
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
			},
		}),
		{
			name: 'daily-ajo-storage',
			// Only persist these fields (avoid persisting loading/error states)
			partialize: (state) => ({
				isActive: state.isActive,
				dailyAmount: state.dailyAmount,
				totalSaved: state.totalSaved,
				commissionPaid: state.commissionPaid,
				availableBalance: state.availableBalance,
				daysSaved: state.daysSaved,
				startDate: state.startDate,
			}),
		}
	)
);