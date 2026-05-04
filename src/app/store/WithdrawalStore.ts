import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as withdrawalAPI from '@/api/withdrawals';
import type { Withdrawal, SubmitWithdrawalResponse } from '@/api/withdrawals';

// ─── Zustand — local pending withdrawal tracker ───────────────────────────────
// No GET /api/customer/wallet/withdrawals endpoint exists yet.
// We persist pending withdrawals locally and clear them on wallet sync.

interface WithdrawalStore {
	pending: Withdrawal[];
	addPending: (withdrawal: Withdrawal) => void;
	removePending: (id: string) => void;
	clearAll: () => void;
}

export const useWithdrawalStore = create<WithdrawalStore>()(
	persist(
		(set) => ({
			pending: [],
			addPending: (withdrawal) =>
				set((state) => ({
					pending: [withdrawal, ...state.pending.filter((w) => w.id !== withdrawal.id)],
				})),
			removePending: (id) =>
				set((state) => ({
					pending: state.pending.filter((w) => w.id !== id),
				})),
			clearAll: () => set({ pending: [] }),
		}),
		{ name: 'ajoplus-withdrawals' }
	)
);

// ─── React Query hooks ────────────────────────────────────────────────────────

export const useSubmitWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: withdrawalAPI.WithdrawalRequest) =>
			withdrawalAPI.requestWithdrawal(body),
		onSuccess: (response: SubmitWithdrawalResponse) => {
			// requestWithdrawal now returns SubmitWithdrawalResponse directly (apiCall unwraps .data)
			useWithdrawalStore.getState().addPending(response.withdrawal);
			qc.invalidateQueries({ queryKey: ['wallet'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
		},
	});
};

export const useGetAdminWithdrawals = () =>
	useQuery({
		queryKey: ['admin', 'withdrawals'],
		queryFn: withdrawalAPI.getAdminWithdrawals,
		staleTime: 60 * 1000,
		refetchOnWindowFocus: true,
		retry: false,
	});

export const useApproveWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => withdrawalAPI.approveWithdrawal(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
			qc.invalidateQueries({ queryKey: ['admin', 'overview'] });
		},
	});
};

export const useRejectWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, reason }: { id: string; reason: string }) =>
			withdrawalAPI.rejectWithdrawal(id, { rejectionReason: reason }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
			qc.invalidateQueries({ queryKey: ['wallet'] });
			qc.invalidateQueries({ queryKey: ['customerDashboard'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
			qc.invalidateQueries({ queryKey: ['admin', 'overview'] });
		},
	});
};