import { apiCall } from './client';

export interface SaverRecord {
	id: string;
	userId: string;
	name: string;
	email: string;
	phoneNumber: string;
	dailyAmount: number;
	totalSaved: number;
	payable: number;
	commission: number;
	daysSaved: number;
	status: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface SavingsOverviewResponse {
	summary: {
		totalSavers: number;
		totalSaved: number;
		totalCommission: number;
		totalPayable: number;
	};
	savers: SaverRecord[];
}

interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data: T;
}

export const getSavingsOverview = async (): Promise<SavingsOverviewResponse> => {
	const response = await apiCall<ApiResponse<SavingsOverviewResponse>>(
		'/api/admin/saving-plans/overview'
	);
	if (!response.success) throw new Error(response.message || 'Failed to fetch savings overview');
	return response.data;
};
