import { apiCall } from './client';

export interface ReferredUser {
	id: string;
	fullName: string;
	email: string;
	joinedAt: string;
	packages: number;
	earnings: number;
}

export interface AgentDashboardData {
	stats: {
		totalReferrals: number;
		totalEarnings: number;
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