import { apiCall } from './client';

export type MemberStatus = 'active' | 'completed' | 'finalized' | 'suspended' | 'inactive';

export interface PackageMember {
	id: string;
	userId: string;
	status: MemberStatus;
	totalPaid: number;
	remainingAmount: number;
	progressPercent: number;
	progressLabel: string;
	installmentAmount: number;
	nextPaymentDate: string;
	startedAt: string;
	claimCode: string | null;
	claimIssuedAt: string | null;
	user: {
		id: string;
		fullName: string;
		email: string;
		phoneNumber: string;
		imageUrl: string | null;
		accountName: string | null;
		bankName: string | null;
		accountNumber: string | null;
		address: string | null;
		role: string;
		accountStatus: string;
		registrationFeeStatus: string;
		createdAt: string;
	};
}

export interface PackageMembersResponse {
	package: {
		id: string;
		name: string;
		totalPrice: string;
		totalAmountPaidByAllMembers: number;
		packageProgressPercent: number;
		packageProgressLabel: string;
	};
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
