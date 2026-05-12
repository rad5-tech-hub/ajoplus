export interface SaverRecord {
	userId: string;
	fullName: string;
	email: string;
	phoneNumber: string;
	dailyAmount: number;
	totalSaved: number;
	availableBalance: number;
	commissionPaid: number;
	daysSaved: number;
	planCreatedAt: string;
}

export interface SavingsOverviewResponse {
	summary: {
		totalSavers: number;
		totalCommission: number;
		totalPayable: number;
		totalSaved: number;
	};
	savers: SaverRecord[];
}

// interface ApiResponse<T> {
// 	success: boolean;
// 	statusCode: number;
// 	message: string;
// 	data: T;
// }

const MOCK_SAVINGS: SavingsOverviewResponse = {
	summary: {
		totalSavers: 2,
		totalCommission: 2000,
		totalPayable: 2000,
		totalSaved: 4000,
	},
	savers: [
		{
			userId: '9a337e33-4d4d-4020-addb-a02d0b52920f',
			fullName: 'John Doe',
			email: 'johndoe2@gmail.com',
			phoneNumber: '08012345678',
			dailyAmount: 1000,
			totalSaved: 2000,
			availableBalance: 1000,
			commissionPaid: 1000,
			daysSaved: 2,
			planCreatedAt: '2026-05-01T15:00:25.000Z',
		},
		{
			userId: 'f3aaf30c-c06c-4604-8d58-af194db37d45',
			fullName: 'Jane Smith',
			email: 'johndoe1@gmail.com',
			phoneNumber: '08098765432',
			dailyAmount: 500,
			totalSaved: 2000,
			availableBalance: 1000,
			commissionPaid: 1000,
			daysSaved: 4,
			planCreatedAt: '2026-04-28T10:00:00.000Z',
		},
	],
};

export const getSavingsOverview = async (): Promise<SavingsOverviewResponse> => {
	// TODO: replace mock with real endpoint when backend is ready
	// const response = await apiCall<ApiResponse<SavingsOverviewResponse>>(
	//   '/api/admin/savings/overview'
	// );
	// if (!response.success) throw new Error(response.message);
	// return response.data;

	await new Promise((resolve) => setTimeout(resolve, 600));
	return MOCK_SAVINGS;
};
