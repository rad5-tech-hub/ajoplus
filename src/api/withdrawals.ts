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
	imageUrl?: string | null;
	bankName?: string | null;
	accountNumber?: string | null;
	accountName?: string | null;
	role?: string;
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

// ── Customer Pending Withdrawals ────────────────────────────────────────────────

export interface MyPendingWithdrawalWallet {
	id: string;
	savingPlanId: string;
	availableBalance: string;
	commissionPaid: string;
}

export interface MyPendingWithdrawal {
	id: string;
	userId: string;
	walletId: string;
	withdrawalType: string;
	amount: string;
	description: string;
	status: 'pending';
	rejectionReason: string | null;
	createdAt: string;
	updatedAt: string;
	wallet: MyPendingWithdrawalWallet;
}

export interface MyPendingWithdrawalsResponse {
	count: number;
	withdrawals: MyPendingWithdrawal[];
}

/** Customer: get their own pending withdrawals */
export const fetchMyPendingWithdrawals = async (): Promise<MyPendingWithdrawalsResponse> => {
	try {
		const res = await apiCall<{ data: MyPendingWithdrawalsResponse }>(
			'/api/customer/wallet/withdrawals/pending'
		);
		return res.data;
	} catch (error) {
		console.error('[Fetch My Pending Withdrawals Error]', error);
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

/** Rejected withdrawal — no user object, just userId */
export interface RejectedWithdrawalWallet {
	id: string;
	savingPlanId: string;
	availableBalance: string;
	commissionPaid: string;
}

export interface RejectedWithdrawal {
	id: string;
	userId: string;
	walletId: string;
	withdrawalType: string;
	amount: string;
	description: string;
	status: 'rejected';
	rejectionReason: string | null;
	createdAt: string;
	updatedAt: string;
	wallet: RejectedWithdrawalWallet;
}

export interface RejectedWithdrawalsResponse {
	count: number;
	withdrawals: RejectedWithdrawal[];
}

export const fetchRejectedWithdrawals = async (): Promise<RejectedWithdrawalsResponse> => {
	const res = await apiCall<{ data: RejectedWithdrawalsResponse }>(
		'/api/admin/withdrawals/rejected'
	);
	return res.data;
};

// ── Admin: Agent Withdrawals ──────────────────────────────────────────────────

export interface AgentWithdrawalRequest {
	id: string;
	agentId: string;
	agent: {
		id: string;
		fullName: string;
		email: string;
		phoneNumber: string;
		bankName: string | null;
		accountNumber: string | null;
	};
	amount: number;
	description: string;
	status: 'pending' | 'success' | 'rejected';
	createdAt: string;
}

export interface PendingAgentWithdrawalsResponse {
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
	withdrawals: AgentWithdrawalRequest[];
}

export async function fetchPendingAgentWithdrawals(page = 1): Promise<PendingAgentWithdrawalsResponse> {
	const res = await apiCall<{ data: PendingAgentWithdrawalsResponse }>(
		`/api/admin/agent-withdrawals/pending?page=${page}&limit=20`
	);
	return res.data;
}

export async function rejectAgentWithdrawal(
	withdrawalId: string,
	body: { rejectionReason: string }
) {
	const res = await apiCall<{
		data: { withdrawal: { id: string; status: string; rejectionReason: string } }
	}>(
		`/api/admin/agent-withdrawals/${withdrawalId}/reject`,
		{ method: 'PATCH', body: JSON.stringify(body) }
	);
	return res.data;
}

export async function approveAgentWithdrawal(withdrawalId: string) {
	const res = await apiCall<{
		data: { withdrawal: { id: string; amount: number; status: string; approvedAt: string } }
	}>(
		`/api/admin/agent-withdrawals/${withdrawalId}/approve`,
		{ method: 'PATCH' }
	);
	return res.data;
}