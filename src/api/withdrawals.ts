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
	walletId: string;
	description?: string;
}

// Alias so WithdrawalStore can import WithdrawalRequest without any changes outside this file
export type WithdrawalRequest = SubmitWithdrawalRequest;

export interface SubmitWithdrawalResponse {
	withdrawal: Withdrawal;
	wallet: WalletSnapshot;
}

export const requestWithdrawal = async (
	body: WithdrawalRequest
): Promise<SubmitWithdrawalResponse> => {
	const res = await apiCall<{ data: SubmitWithdrawalResponse }>('/api/customer/wallet/withdrawals', {
		method: 'POST',
		body: JSON.stringify(body),
	});
	return res.data;
};

// Kept for backward compatibility in case it is used elsewhere
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
	amount: string; // admin endpoint returns string
	user: AdminWithdrawalUser;
	wallet: AdminWithdrawalWallet;
}

export interface AdminWithdrawalsResponse {
	withdrawals: AdminWithdrawal[];
	count: number;
}

export const getAdminWithdrawals = async (): Promise<AdminWithdrawalsResponse> => {
	const res = await apiCall<{ data: AdminWithdrawalsResponse }>('/api/admin/withdrawals/pending');
	return res.data;
};

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

// ── Customer Withdrawal History ─────────────────────────────────────────────

export interface CustomerWithdrawalsResponse {
	count: number;
	withdrawals: Withdrawal[];
}

/** Customer: their own rejected withdrawals */
export const getMyRejectedWithdrawals = async (): Promise<CustomerWithdrawalsResponse> => {
	try {
		const res = await apiCall<{ data: CustomerWithdrawalsResponse }>(
			'/api/customer/wallet/withdrawals/rejected'
		);
		return res.data;
	} catch (error) {
		console.error('[Get My Rejected Withdrawals Error]', error);
		throw error;
	}
};

/** Customer: their own approved withdrawals */
export const getMyApprovedWithdrawals = async (): Promise<CustomerWithdrawalsResponse> => {
	try {
		const res = await apiCall<{ data: CustomerWithdrawalsResponse }>(
			'/api/customer/wallet/withdrawals/approved'
		);
		return res.data;
	} catch (error) {
		console.error('[Get My Approved Withdrawals Error]', error);
		throw error;
	}
};

// ── Admin Withdrawal History ────────────────────────────────────────────────

export const getAdminApprovedWithdrawals = async (): Promise<AdminWithdrawalsResponse> => {
	const res = await apiCall<{ data: AdminWithdrawalsResponse }>(
		'/api/admin/withdrawals/approved'
	);
	return res.data;
};

export const getAdminRejectedWithdrawals = async (): Promise<AdminWithdrawalsResponse> => {
	const res = await apiCall<{ data: AdminWithdrawalsResponse }>(
		'/api/admin/withdrawals/rejected'
	);
	return res.data;
};