// src/api/withdrawals.ts
import { apiCall } from './client';

// ── Shared ──────────────────────────────────────────────────────────────────

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected';

export interface Withdrawal {
	id: string;
	userId: string;
	walletId: string;
	amount: number;
	description: string;
	status: WithdrawalStatus;
	rejectionReason: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface WalletSnapshot {
	id: string;
	availableBalance: number;
}

// ── Customer ──────────────────────────────────────────────────────────────────

export interface SubmitWithdrawalRequest {
	amount: number;
	description?: string;
}

export interface SubmitWithdrawalResponse {
	withdrawal: Withdrawal;
	wallet: WalletSnapshot;
}

export const submitWithdrawal = async (
	body: SubmitWithdrawalRequest
): Promise<SubmitWithdrawalResponse> => {
	const res = await apiCall<{ data: SubmitWithdrawalResponse }>('/api/customer/wallet/withdrawals', {
		method: 'POST',
		body: JSON.stringify(body),
	});
	return res.data;
};

// ── Admin ─────────────────────────────────────────────────────────────────────
// src/api/withdrawals.ts — updated interfaces + function

export interface AdminWithdrawalUser {
	id: string;
	fullName: string;
	email: string;
	phoneNumber: string;
}

export interface AdminWithdrawalWallet {
	id: string;
	availableBalance: string;
	commissionPaid: string;
}
export interface AdminWithdrawal extends Omit<Withdrawal, 'amount'> {
	amount: string;   // admin endpoint returns string
	user: AdminWithdrawalUser;
	wallet: AdminWithdrawalWallet;
}


export const getAdminWithdrawals = async (): Promise<AdminWithdrawalsResponse> => {
	const res = await apiCall<{ data: AdminWithdrawalsResponse }>('/api/admin/withdrawals/pending');
	return res.data;
};

export interface AdminWithdrawalsResponse {
	withdrawals: AdminWithdrawal[];
	count: number;
}

export interface ApproveWithdrawalResponse {
	withdrawal: Withdrawal;
	wallet: WalletSnapshot;
}

export interface RejectWithdrawalRequest {
	rejectionReason: string;
}

export interface RejectWithdrawalResponse {
	withdrawal: Withdrawal;
	wallet: WalletSnapshot;
}

export const approveWithdrawal = async (id: string): Promise<ApproveWithdrawalResponse> => {
	const res = await apiCall<{ data: ApproveWithdrawalResponse }>(
		`/api/admin/withdrawals/${id}/approve`,
		{ method: 'PATCH' }
	);
	return res.data;
};

export const rejectWithdrawal = async (
	id: string,
	body: RejectWithdrawalRequest
): Promise<RejectWithdrawalResponse> => {
	const res = await apiCall<{ data: RejectWithdrawalResponse }>(
		`/api/admin/withdrawals/${id}/reject`,
		{ method: 'PATCH', body: JSON.stringify(body) }
	);
	return res.data;
};