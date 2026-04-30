// src/api/package.ts
import { apiCall } from './client';
import type { Category } from './categories'; // ← type-only, never re-exported here

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PackageItem {
	itemName: string;
	quantity: string;
}

export interface CreatePackageRequest {
	name: string;
	categoryId: string;
	totalPrice: number;
	duration: number; // in months
	paymentFrequency: 'daily' | 'weekly' | 'monthly';
	description: string;
	items: PackageItem[];
}

export interface Package {
	id: string;
	name: string;
	categoryId: string;
	category?: Category;
	totalPrice: number | string;
	duration: number;
	paymentFrequency: 'daily' | 'weekly' | 'monthly';
	description: string;
	items?: PackageItem[];
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

export interface UserPackage {
	id: string;
	userId: string;
	packageId: string;
	duration: number;
	installmentAmount: string;
	totalPaid: string;
	paymentFrequency: 'daily' | 'weekly' | 'monthly';
	nextPaymentDate: string;
	status: 'active' | 'inactive' | 'completed' | 'suspended';
	startDate: string;
	createdAt: string;
	updatedAt: string;
	package: Package & { category: Category };
	remainingBalance: number;
	progress: number;
	progressLabel: string;
}

// ─── Shared response wrapper ──────────────────────────────────────────────────

interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data: T;
}

// ─── API functions ────────────────────────────────────────────────────────────

/** Create a new package (Admin only) */
export const createPackage = async (data: CreatePackageRequest): Promise<Package> => {
	try {
		const response = await apiCall<ApiResponse<Package>>('/api/package/packages', {
			method: 'POST',
			body: JSON.stringify(data),
		});
		if (!response.success) throw new Error(response.message || 'Failed to create package');
		return response.data;
	} catch (error) {
		console.error('[Create Package Error]', error);
		throw error;
	}
};

/** Join a package as a customer */
export const joinPackage = async (packageId: string): Promise<void> => {
	try {
		const response = await apiCall<ApiResponse<null>>('/api/package/join', {
			method: 'POST',
			body: JSON.stringify({ packageId }),
		});
		if (!response.success) throw new Error(response.message || 'Failed to join package');
	} catch (error) {
		console.error('[Join Package Error]', error);
		throw error;
	}
};

/** Get all packages joined by the current user */
export const getUserPackages = async (): Promise<UserPackage[]> => {
	try {
		const response = await apiCall<ApiResponse<UserPackage[]>>('/api/package/user-packages');
		if (!response.success) throw new Error(response.message || 'Failed to fetch user packages');
		if (!Array.isArray(response.data)) throw new Error('Invalid response format: expected array');
		return response.data;
	} catch (error) {
		console.error('[Get User Packages Error]', error);
		throw error;
	}
};

/** Get all available packages (for browsing) */
export const getAvailablePackages = async (): Promise<Package[]> => {
	try {
		const response = await apiCall<ApiResponse<Package[]>>('/api/package/packages');
		if (!response.success) throw new Error(response.message || 'Failed to fetch packages');
		if (!Array.isArray(response.data)) throw new Error('Invalid response format: expected array');
		return response.data;
	} catch (error) {
		console.error('[Get Available Packages Error]', error);
		throw error;
	}
};

/** Get a specific package by ID */
export const getPackageById = async (packageId: string): Promise<Package> => {
	try {
		const response = await apiCall<ApiResponse<Package>>(`/api/package/packages/${packageId}`);
		if (!response.success) throw new Error(response.message || 'Failed to fetch package');
		return response.data;
	} catch (error) {
		console.error('[Get Package Error]', error);
		throw error;
	}
};

/** Update an existing package (Admin) */
export const updatePackage = async (
	packageId: string,
	data: Partial<CreatePackageRequest>
): Promise<Package> => {
	try {
		const response = await apiCall<ApiResponse<Package>>(`/api/package/packages/${packageId}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
		if (!response.success) throw new Error(response.message || 'Failed to update package');
		return response.data;
	} catch (error) {
		console.error('[Update Package Error]', error);
		throw error;
	}
};

/** Delete a package (Admin) */
export const deletePackage = async (packageId: string): Promise<void> => {
	try {
		await apiCall<{ success: boolean }>(`/api/package/packages/${packageId}`, {
			method: 'DELETE',
		});
	} catch (error) {
		console.error('[Delete Package Error]', error);
		throw error;
	}
};