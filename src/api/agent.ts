import { apiCall } from './client';

export interface ReferredUser {
	id: string;
	fullName: string;
	email: string;
	joinedAt: string;
	packages: number;
	earnings: number;
	commissions: number;
	packageCommissions: number;
	savingCommissions: number;
	pendingEarnings: number;
}

export interface AgentDashboardData {
	agent: {
		id: string;
		fullName: string;
		referralCode: string;
		createdAt: string;
	};
	stats: {
		totalReferrals: number;
		totalEarnings: number;
		commissionPaid: number;
		totalWithdrawn: number;
		pendingWithdrawalAmount: number;
		availableBalance: number;
		pendingEarnings: number;
		totalCommission: number;
		packageEarnings: number;
		savingEarnings: number;
		earningsPerReferral: number;
		totalTransactions: number;
	};
	referral: {
		code: string;
		link: string;
	};
	earningsBreakdown: {
		thisMonth: number;
		lastMonth: number;
	};
	referredUsers: ReferredUser[];
	createdAt?: string; // Agent account creation date (ISO format)
}

export const getAgentDashboard = async (): Promise<AgentDashboardData> => {
	try {
		const response = await apiCall<{
			success: boolean;
			statusCode: number;
			message: string;
			data: AgentDashboardData;
		}>('/api/agents/dashboard');

		// Validate response structure
		if (!response || typeof response !== 'object') {
			throw new Error('Invalid API response: not an object');
		}

		if (!('data' in response)) {
			throw new Error('Invalid API response: missing data field');
		}

		// Extract the inner "data" to match what your UI components expect
		const data = response.data as AgentDashboardData;

		// Validate required fields
		if (!data.stats || !data.referral || !data.earningsBreakdown || !Array.isArray(data.referredUsers)) {
			throw new Error('Invalid data structure: missing required fields');
		}

		return data;
	} catch (error) {
		// Log detailed error for debugging
		console.error('[AgentDashboard API Error]', {
			error: error instanceof Error ? error.message : String(error),
			timestamp: new Date().toISOString(),
		});
		throw error;
	}
};

// ── Agent Downline ────────────────────────────────────────────────────────────

export interface AgentDownlineCustomer {
	id: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	bankName: string | null;
	accountNumber: string | null;
	accountStatus: 'pending' | 'active' | 'inactive' | 'suspended';
	createdAt: string;
}

export interface AgentDownlineResponse {
	agent: { id: string; fullName: string; referralCode: string };
	totalCustomers: number;
	customers: AgentDownlineCustomer[];
}

export async function fetchAgentDownline(referralCode: string): Promise<AgentDownlineResponse> {
	const response = await apiCall<{
		success: boolean;
		statusCode: number;
		data: AgentDownlineResponse;
	}>(`/api/agents/${referralCode}/downline`);
	return response.data;
}

// ── Agent Withdrawal ───────────────────────────────────────────────────────────

export interface AgentWithdrawalPayload {
	amount: number;
	description: string;
}

export interface AgentWithdrawalResult {
	withdrawal: {
		id: string;
		userId: string;
		walletId: null;
		withdrawalType: string;
		amount: number;
		description: string;
		status: string;
		updatedAt: string;
		createdAt: string;
	};
	availableBalance: number;
	totalAvailable: number;
}

export async function submitAgentWithdrawal(
	payload: AgentWithdrawalPayload
): Promise<AgentWithdrawalResult> {
	return apiCall<AgentWithdrawalResult>(
		'/api/agents/wallet/withdrawals',
		{ method: 'POST', body: JSON.stringify(payload) }
	);
}