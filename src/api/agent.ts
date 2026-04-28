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
	const response = await apiCall<{
		success: boolean;
		statusCode: number;
		message: string;
		data: AgentDashboardData;
	}>('/api/agents/dashboard');

	// Extract the inner "data" to match what your UI components expect
	return response.data;
};