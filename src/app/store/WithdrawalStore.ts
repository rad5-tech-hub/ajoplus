import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as withdrawalAPI from '@/api/withdrawals';
import { APIError } from '@/api/client';
import type { Withdrawal } from '@/api/withdrawals';

// ─── Smart retry logic ──────────────────────────────────────────────────────

const smartRetry = (failureCount: number, error: unknown): boolean => {
	if (error instanceof APIError) return false;
	return failureCount < 2;
};

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
		{ name: 'AbaGold-withdrawals' }
	)
);

// ─── React Query hooks ────────────────────────────────────────────────────────

export const useSubmitWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: withdrawalAPI.WithdrawalRequest) =>
			withdrawalAPI.requestWithdrawal(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['myPendingWithdrawals'] });
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
		retry: smartRetry,
	});

/** Customer: their own rejected withdrawals from server */
export const useGetMyRejectedWithdrawals = () =>
	useQuery({
		queryKey: ['withdrawals', 'me', 'rejected'],
		queryFn: withdrawalAPI.getMyRejectedWithdrawals,
		staleTime: 60 * 1000,
		refetchOnWindowFocus: true,
		retry: smartRetry,
	});

/** Customer: their own approved withdrawals from server */
export const useGetMyApprovedWithdrawals = () =>
	useQuery({
		queryKey: ['withdrawals', 'me', 'approved'],
		queryFn: withdrawalAPI.getMyApprovedWithdrawals,
		staleTime: 60 * 1000,
		refetchOnWindowFocus: true,
		retry: smartRetry,
	});

export const useMyPendingWithdrawals = () =>
	useQuery({
		queryKey: ['myPendingWithdrawals'],
		queryFn: withdrawalAPI.fetchMyPendingWithdrawals,
		staleTime: 30_000,
		refetchInterval: 30_000,
		retry: smartRetry,
	});

/** Admin: approved withdrawals history */
export const useGetAdminApprovedWithdrawals = () =>
	useQuery({
		queryKey: ['admin', 'withdrawals', 'approved'],
		queryFn: withdrawalAPI.getAdminApprovedWithdrawals,
		staleTime: 60 * 1000,
		refetchOnWindowFocus: true,
		retry: smartRetry,
	});

/** Admin: rejected withdrawals history */
export const useRejectedWithdrawals = () =>
	useQuery({
		queryKey: ['withdrawals', 'rejected'],
		queryFn: withdrawalAPI.fetchRejectedWithdrawals,
		staleTime: 60 * 1000,
		refetchOnWindowFocus: true,
		retry: smartRetry,
	});

export const useApproveWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => withdrawalAPI.approveWithdrawal(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['myPendingWithdrawals'] });
			qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
			qc.invalidateQueries({ queryKey: ['admin', 'withdrawals', 'approved'] });
			qc.invalidateQueries({ queryKey: ['withdrawals', 'me', 'approved'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
			qc.invalidateQueries({ queryKey: ['admin', 'overview'] });
			qc.invalidateQueries({ queryKey: ['wallet'] });
		},
	});
};

export const useRejectWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, reason }: { id: string; reason: string }) =>
			withdrawalAPI.rejectWithdrawal(id, { rejectionReason: reason }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['myPendingWithdrawals'] });
			qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
			qc.invalidateQueries({ queryKey: ['admin', 'withdrawals', 'rejected'] });
			qc.invalidateQueries({ queryKey: ['withdrawals', 'me', 'rejected'] });
			qc.invalidateQueries({ queryKey: ['wallet'] });
			qc.invalidateQueries({ queryKey: ['customerDashboard'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
			qc.invalidateQueries({ queryKey: ['admin', 'overview'] });
		},
	});
};

// ── Admin: Agent Withdrawals ──────────────────────────────────────────────────

export const usePendingAgentWithdrawals = (page: number) =>
	useQuery({
		queryKey: ['agentWithdrawals', 'pending', page],
		queryFn: () => withdrawalAPI.fetchPendingAgentWithdrawals(page),
		staleTime: 30_000,
		retry: smartRetry,
	});

export const useApproveAgentWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (withdrawalId: string) => withdrawalAPI.approveAgentWithdrawal(withdrawalId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['agentWithdrawals'] });
			qc.invalidateQueries({ queryKey: ['admin', 'overview'] });
		},
		onError: (error) => {
			console.error('[Approve Agent Withdrawal Error]', error);
		},
	});
};

export const useRejectAgentWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, reason }: { id: string; reason: string }) =>
			withdrawalAPI.rejectAgentWithdrawal(id, { rejectionReason: reason }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['agentWithdrawals'] });
			qc.invalidateQueries({ queryKey: ['admin', 'overview'] });
		},
	});
};

// ─── Agent Transactions ──────────────────────────────────────────────────────

export const useAgentTransactions = (status?: 'pending' | 'approved' | 'rejected') =>
	useQuery({
		queryKey: ['agentTransactions', status],
		queryFn: () => withdrawalAPI.getAgentTransactions(status),
		staleTime: 5 * 60 * 1000,
		retry: smartRetry,
	});