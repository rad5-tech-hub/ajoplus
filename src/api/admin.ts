// src/api/admin.ts
import { apiCall } from './client';
import { AdminOverview } from '@/features/admin/types';

export interface AdminUser {
	id: string;
	fullName: string;
	email: string;
	role: 'admin';
	createdAt: string;
}

export interface AdminLoginCredentials {
	email: string;
	password: string;
}

export interface AdminRegisterData {
	fullName: string;
	email: string;
	password: string;
	role: 'admin';
}

interface AdminLoginResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: {
		token: string;
		admin: {
			id: string;
			email: string;
			role: 'admin';
		};
	};
}

interface AdminRegisterResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: AdminUser;
}

interface AdminOverviewResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: AdminOverview;
}

export const registerAdmin = async (data: AdminRegisterData): Promise<AdminUser> => {
	try {
		const response = await apiCall<AdminRegisterResponse>('/api/admin/register-admin', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: { Authorization: '' },
		});

		if (!response.success) throw new Error(response.message || 'Admin registration failed');

		return response.data;
	} catch (error) {
		console.error('[Admin Registration Error]', error);
		throw error;
	}
};

export const loginAdmin = async (
	credentials: AdminLoginCredentials
): Promise<{ admin: { id: string; email: string; role: 'admin' }; token: string }> => {
	try {
		const response = await apiCall<AdminLoginResponse>('/api/admin/login-admin', {
			method: 'POST',
			body: JSON.stringify(credentials),
			headers: { Authorization: '' }, // Ensure no token is sent for login
		});

		if (!response.success) throw new Error(response.message || 'Admin login failed');

		return { admin: response.data.admin, token: response.data.token };
	} catch (error) {
		console.error('[Admin Login Error]', error);
		throw error;
	}
};

export const logoutAdmin = async (): Promise<void> => {
	try {
		// Optionally call backend logout endpoint if needed
	} catch (error) {
		console.warn('[Admin Logout Error]', error);
	}
};

/**
 * Fetch admin dashboard overview stats
 */
export const fetchAdminOverview = async (): Promise<AdminOverview> => {
	try {
		const response = await apiCall<AdminOverviewResponse>('/api/admin/dashboard');

		if (!response.success) throw new Error(response.message || 'Failed to load admin overview');

		return response.data;
	} catch (error) {
		console.error('[Admin Overview Error]', error);
		throw error;
	}
};