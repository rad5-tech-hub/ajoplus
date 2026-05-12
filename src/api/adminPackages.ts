export type MemberStatus = 'active' | 'completed' | 'finalised' | 'suspended' | 'inactive';

export interface PackageMember {
	id: string;
	userId: string;
	status: MemberStatus;
	totalPaid: number;
	remainingBalance: number;
	progress: number;
	installmentAmount: string;
	nextPaymentDate: string;
	startDate: string;
	user: {
		id: string;
		fullName: string;
		email: string;
		phoneNumber: string;
	};
}

export interface PackageMembersResponse {
	package: {
		id: string;
		name: string;
		totalPrice: string;
		duration: number;
		paymentFrequency: string;
	};
	totalRevenue: number;
	memberCount: number;
	members: PackageMember[];
}

// 	interface ApiResponse<T> {
// success: boolean;
// statusCode: number;
// message: string;
// data: T;
// }

const MOCK_MEMBERS: PackageMembersResponse = {
	package: {
		id: '3ad96406-e370-45ca-a6ff-8cf510384846',
		name: 'Special Food Package',
		totalPrice: '350000.00',
		duration: 12,
		paymentFrequency: 'daily',
	},
	totalRevenue: 5832.66,
	memberCount: 3,
	members: [
		{
			id: 'ad814bb4-4dfe-40d1-bd3a-97222b1aae9c',
			userId: '9a337e33-4d4d-4020-addb-a02d0b52920f',
			status: 'active',
			totalPaid: 1944.44,
			remainingBalance: 348055.56,
			progress: 1,
			installmentAmount: '972.22',
			nextPaymentDate: '2026-04-25T21:24:30.000Z',
			startDate: '2026-04-22T23:19:23.000Z',
			user: {
				id: '9a337e33-4d4d-4020-addb-a02d0b52920f',
				fullName: 'John Doe',
				email: 'johndoe2@gmail.com',
				phoneNumber: '08012345678',
			},
		},
		{
			id: 'bd925cc5-5efe-51e2-b93f-5ce307b63bdc',
			userId: 'f3aaf30c-c06c-4604-8d58-af194db37d45',
			status: 'completed',
			totalPaid: 3888.22,
			remainingBalance: 0,
			progress: 100,
			installmentAmount: '972.22',
			nextPaymentDate: '2026-05-10T00:00:00.000Z',
			startDate: '2026-04-01T00:00:00.000Z',
			user: {
				id: 'f3aaf30c-c06c-4604-8d58-af194db37d45',
				fullName: 'Jane Smith',
				email: 'johndoe1@gmail.com',
				phoneNumber: '08098765432',
			},
		},
		{
			id: 'f3b219db-3cf5-44f2-b603-0a5b4c72c08e',
			userId: 'e113c5cf-887f-4c7d-8ff2-bff1aadc6bd5',
			status: 'suspended',
			totalPaid: 972.22,
			remainingBalance: 349027.78,
			progress: 0,
			installmentAmount: '972.22',
			nextPaymentDate: '2026-05-02T00:00:00.000Z',
			startDate: '2026-04-30T00:00:00.000Z',
			user: {
				id: 'e113c5cf-887f-4c7d-8ff2-bff1aadc6bd5',
				fullName: 'Samuel Ade',
				email: 'samuel@example.com',
				phoneNumber: '08045612378',
			},
		},
	],
};

export const getPackageMembers = async (
	packageId: string
): Promise<PackageMembersResponse> => {
	// TODO: replace mock with real endpoint when backend is ready
	// const response = await apiCall<ApiResponse<PackageMembersResponse>>(
	//   `/api/admin/packages/${packageId}/members`
	// );
	// if (!response.success) throw new Error(response.message);
	// return response.data;

	await new Promise((resolve) => setTimeout(resolve, 600));
	return {
		...MOCK_MEMBERS,
		package: { ...MOCK_MEMBERS.package, id: packageId },
	};
};

export const updateMemberStatus = async (
	packageId: string,
	userPackageId: string,
	body: { status: MemberStatus }
): Promise<{ id: string; status: MemberStatus }> => {
	void packageId;
	// TODO: replace mock with real endpoint when backend is ready
	// const response = await apiCall<ApiResponse<{ id: string; status: MemberStatus }>>(
	//   `/api/admin/packages/${packageId}/members/${userPackageId}/status`,
	//   { method: 'PATCH', body: JSON.stringify(body) }
	// );
	// if (!response.success) throw new Error(response.message);
	// return response.data;

	await new Promise((resolve) => setTimeout(resolve, 400));
	return { id: userPackageId, status: body.status };
};
