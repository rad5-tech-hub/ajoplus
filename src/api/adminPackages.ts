import { apiCall } from './client';

export type MemberStatus = 'active' | 'completed' | 'finalized' | 'suspended' | 'inactive';

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

export interface FinalizePackageResponse {
	userPackage: {
		id: string;
		userId: string;
		packageId: string;
		status: string;
		totalPaid: string;
		nextPaymentDate: string;
		installmentAmount: string;
		paymentFrequency: string;
		claimCode: string;
		claimIssuedAt: string;
		packageName: string;
		user: {
			id: string;
			fullName: string;
			email: string;
			phoneNumber: string;
		};
	};
}

interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data: T;
}

export const getPackageMembers = async (
	packageId: string
): Promise<PackageMembersResponse> => {
	const response = await apiCall<ApiResponse<PackageMembersResponse>>(
		`/api/admin/packages/${packageId}/members`
	);
	if (!response.success) throw new Error(response.message || 'Failed to fetch package members');
	return response.data;
};

export const finalizePackage = async (
	userPackageId: string
): Promise<FinalizePackageResponse> => {
	const response = await apiCall<ApiResponse<FinalizePackageResponse>>(
		`/api/admin/packages/${userPackageId}/finalize`,
		{ method: 'PATCH' }
	);
	if (!response.success) throw new Error(response.message || 'Failed to finalize package');
	return response.data;
};
