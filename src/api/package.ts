import { apiCall } from './client';

/**
 * Package API Types
 */

// Add to existing imports/exports in src/api/package.ts

export interface Category {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export const getCategories = async (): Promise<Category[]> => {
	try {
		const response = await apiCall<{
			success: boolean;
			statusCode: number;
			message: string;
			data: Category[];
		}>('/api/category/categories');

		if (!response.success) throw new Error(response.message || 'Failed to fetch categories');
		if (!Array.isArray(response.data)) throw new Error('Invalid response format: expected array');

		return response.data;
	} catch (error) {
		console.error('[Get Categories Error]', error);
		throw error;
	}
};

export interface PackageItem {
	itemName: string;
	quantity: string;
}

export interface CreatePackageRequest {
	name: string;
	categoryId: string; // UUID of the category
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
	category?: { id: string; name: string };  // ← included in GET responses
	totalPrice: number | string;
	duration: number;
	paymentFrequency: 'daily' | 'weekly' | 'monthly';
	description: string;
	items?: PackageItem[];                     // ← included in GET responses
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
	package: Package & {
		category: {
			id: string;
			name: string;
		};
	};
	remainingBalance: number;
	progress: number;
	progressLabel: string;
}

/**
 * Create a new package (Admin only)
 */
export const createPackage = async (data: CreatePackageRequest): Promise<Package> => {
	try {
		const response = await apiCall<{
			success: boolean;
			statusCode: number;
			message: string;
			data: Package;
		}>('/api/package/packages', {
			method: 'POST',
			body: JSON.stringify(data),
		});

		if (!response.success) {
			throw new Error(response.message || 'Failed to create package');
		}

		return response.data;
	} catch (error) {
		console.error('[Create Package Error]', error);
		throw error;
	}
};

/**
 * Join a package as a customer
 */
export const joinPackage = async (packageId: string): Promise<void> => {
	try {
		const response = await apiCall<{
			success: boolean;
			statusCode: number;
			message: string;
		}>('/api/package/join', {
			method: 'POST',
			body: JSON.stringify({ packageId }),
		});

		if (!response.success) {
			throw new Error(response.message || 'Failed to join package');
		}
	} catch (error) {
		console.error('[Join Package Error]', error);
		throw error;
	}
};

/**
 * Get all packages joined by the current user
 */
export const getUserPackages = async (): Promise<UserPackage[]> => {
	try {
		const response = await apiCall<{
			success: boolean;
			statusCode: number;
			message: string;
			data: UserPackage[];
		}>('/api/package/user-packages');

		if (!response.success) {
			throw new Error(response.message || 'Failed to fetch user packages');
		}

		if (!Array.isArray(response.data)) {
			throw new Error('Invalid response format: expected array');
		}

		return response.data;
	} catch (error) {
		console.error('[Get User Packages Error]', error);
		throw error;
	}
};

/**
 * Get all available packages (for browsing)
 * Note: This endpoint might need to be added to the backend
 */
export const getAvailablePackages = async (): Promise<Package[]> => {
	try {
		const response = await apiCall<{
			success: boolean;
			statusCode: number;
			message: string;
			data: Package[];
		}>('/api/package/packages');

		if (!response.success) {
			throw new Error(response.message || 'Failed to fetch packages');
		}

		if (!Array.isArray(response.data)) {
			throw new Error('Invalid response format: expected array');
		}

		return response.data;
	} catch (error) {
		console.error('[Get Available Packages Error]', error);
		throw error;
	}
};

/**
 * Get a specific package by ID
 */
export const getPackageById = async (packageId: string): Promise<Package> => {
	try {
		const response = await apiCall<{
			success: boolean;
			statusCode: number;
			message: string;
			data: Package;
		}>(`/api/package/packages/${packageId}`);

		if (!response.success) {
			throw new Error(response.message || 'Failed to fetch package');
		}

		return response.data;
	} catch (error) {
		console.error('[Get Package Error]', error);
		throw error;
	}
};

/**
 * Update an existing package (Admin)
 */
export const updatePackage = async (
	packageId: string,
	data: Partial<CreatePackageRequest>
): Promise<Package> => {
	try {
		const response = await apiCall<{
			success: boolean;
			statusCode: number;
			message: string;
			data: Package;
		}>(`/api/package/packages/${packageId}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
		});

		if (!response.success) {
			throw new Error(response.message || 'Failed to update package');
		}

		return response.data;
	} catch (error) {
		console.error('[Update Package Error]', error);
		throw error;
	}
};

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
