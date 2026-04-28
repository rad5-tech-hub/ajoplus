import { apiCall } from './client';

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

/**
 * Register a new admin account
 * Private endpoint - only authorized admins can create new admins
 */
export const registerAdmin = async (data: AdminRegisterData): Promise<AdminUser> => {
	try {
		const response = await apiCall<AdminRegisterResponse>('/api/admin/register-admin', {
			method: 'POST',
			body: JSON.stringify(data),
		});

		if (!response.success) {
			throw new Error(response.message || 'Admin registration failed');
		}

		return response.data;
	} catch (error) {
		console.error('[Admin Registration Error]', error);
		throw error;
	}
};

/**
 * Login admin
 * Separate from customer/agent login
 */
export const loginAdmin = async (
	credentials: AdminLoginCredentials
): Promise<{ admin: { id: string; email: string; role: 'admin' }; token: string }> => {
	try {
		const response = await apiCall<AdminLoginResponse>('/api/admin/login-admin', {
			method: 'POST',
			body: JSON.stringify(credentials),
		});

		if (!response.success) {
			throw new Error(response.message || 'Admin login failed');
		}

		return {
			admin: response.data.admin,
			token: response.data.token,
		};
	} catch (error) {
		console.error('[Admin Login Error]', error);
		throw error;
	}
};

/**
 * Logout admin
 */
export const logoutAdmin = async (): Promise<void> => {
	try {
		// Optionally call backend logout endpoint if needed
		// For now, frontend just clears tokens
	} catch (error) {
		console.warn('[Admin Logout Error]', error);
	}
};
