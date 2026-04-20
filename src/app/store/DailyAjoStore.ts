// src/app/store/dailyAjoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DailyAjoState {
	isActive: boolean;
	dailyAmount: number;
	totalSaved: number;
	commissionPaid: number;
	availableBalance: number;
	daysSaved: number;
	startDate: string | null;

	// Actions
	startDailyAjo: (dailyAmount: number) => void;
	addToSavings: (amount: number) => void;
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

			startDailyAjo: (amount: number) => {
				const today = new Date().toISOString();
				set({
					isActive: true,
					dailyAmount: amount,
					totalSaved: 0,
					commissionPaid: 0,
					availableBalance: 0,
					daysSaved: 0,
					startDate: today,
				});
			},

			addToSavings: (amount: number) => {
				const state = get();
				if (!state.isActive) return;

				const newTotal = state.totalSaved + amount;
				const newCommission = Math.round(newTotal * 0.05); // 5% commission
				const newBalance = newTotal - newCommission;

				set({
					totalSaved: newTotal,
					commissionPaid: newCommission,
					availableBalance: newBalance,
					daysSaved: state.daysSaved + 1,
				});
			},

			resetDailyAjo: () => {
				set({
					isActive: false,
					dailyAmount: 0,
					totalSaved: 0,
					commissionPaid: 0,
					availableBalance: 0,
					daysSaved: 0,
					startDate: null,
				});
			},
		}),
		{ name: 'daily-ajo-storage' }
	)
);