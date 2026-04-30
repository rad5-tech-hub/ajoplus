// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.ajoplus.com';

export class APIError extends Error {
	constructor(
		public status: number,
		public data: unknown,
		message: string
	) {
		super(message);
		this.name = 'APIError';
	}
}

// Endpoints that must never receive an Authorization header
const PUBLIC_ENDPOINTS = [
	'/api/auth/login',
	'/api/auth/signup',
	'/api/auth/refresh',
];

// Status codes that will never succeed on retry — fail fast instead
const PERMANENT_ERROR_STATUSES = new Set([400, 401, 403, 404, 422]);

/**
 * Base API client with auth, retry, and consistent response handling
 * Optimized for AjoPlus (3G networks + reliability)
 */
export async function apiCall<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

	const isPublic = PUBLIC_ENDPOINTS.some((p) => endpoint.startsWith(p));
	const token = isPublic ? null : getAuthToken();

	// ✅ Fix: detect FormData body and let the browser set Content-Type automatically.
	// When fetch receives a FormData body it generates the correct
	// "multipart/form-data; boundary=..." header on its own.
	// If we hard-code "application/json" here (even as a default that gets
	// "overridden" with undefined later) the resulting header object still
	// contains the key and the server rejects the upload with 400.
	const isFormData = options.body instanceof FormData;

	const headers: Record<string, string> = {
		// Only set JSON content-type for non-FormData requests
		...(!isFormData && { 'Content-Type': 'application/json' }),
		...(token && { Authorization: `Bearer ${token}` }),
		// Spread caller-supplied headers last so they can override defaults.
		// Explicitly exclude Content-Type from caller headers for FormData —
		// any value here (including undefined) would break the multipart boundary.
		...(!isFormData && (options.headers as Record<string, string>)),
	};

	// For FormData, only forward non-Content-Type headers from the caller
	if (isFormData && options.headers) {
		const callerHeaders = options.headers as Record<string, string>;
		Object.entries(callerHeaders).forEach(([key, value]) => {
			if (key.toLowerCase() !== 'content-type' && value !== undefined) {
				headers[key] = value;
			}
		});
	}

	const makeRequest = async (): Promise<T> => {
		const response = await fetch(url, { ...options, headers });

		let rawData: unknown;
		try {
			rawData = await response.json();
		} catch {
			rawData = null;
		}

		if (!response.ok) {
			const errorData = rawData as Record<string, unknown> | null;
			throw new APIError(
				response.status,
				rawData,
				(errorData?.message as string | undefined) || `API Error: ${response.status}`
			);
		}

		return rawData as T;
	};

	const isGet = (options.method || 'GET').toUpperCase() === 'GET';
	return isGet ? retryApiCall(makeRequest, 3) : makeRequest();
}

/**
 * Get authorization token from Zustand persisted storage
 * Checks both customer/agent auth and admin auth
 */
export function getAuthToken(): string | null {
	try {
		const auth = localStorage.getItem('ajoplus-auth-storage');
		if (auth) {
			const parsed = JSON.parse(auth);
			const token = parsed.state?.token;
			if (token) return token;
		}

		const adminAuth = localStorage.getItem('ajoplus-admin-auth-storage');
		if (adminAuth) {
			const parsed = JSON.parse(adminAuth);
			const token = parsed.state?.token;
			if (token) return token;
		}
	} catch (error) {
		console.error('Failed to retrieve auth token', error);
	}
	return null;
}

/**
 * Retry logic with exponential backoff — critical for low-end devices & 3G
 * Skips retry entirely for permanent errors (401, 403, 404 etc.) since
 * these will never resolve on their own and only spam the console
 */
export async function retryApiCall<T>(
	fn: () => Promise<T>,
	maxRetries = 3
): Promise<T> {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			if (error instanceof APIError && PERMANENT_ERROR_STATUSES.has(error.status)) {
				throw error;
			}

			if (attempt === maxRetries - 1) throw error;

			// Exponential backoff: 1s → 2s → 4s
			const delay = Math.pow(2, attempt) * 1000;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
	throw new Error('Max retries exceeded');
};

export interface WithdrawalRequest {
	amount: number;
	description?: string;
}

export interface WithdrawalResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: {
		withdrawal: {
			id: string;
			userId: string;
			walletId: string;
			amount: number;
			description?: string;
			status: 'pending' | 'approved' | 'rejected';
			createdAt: string;
			updatedAt: string;
		};
		wallet: {
			id: string;
			availableBalance: number;
		};
	};
}

export const walletApi = {
	createWithdrawal: async (payload: WithdrawalRequest): Promise<WithdrawalResponse> => {
		return await apiCall<WithdrawalResponse>('/api/customer/wallet/withdrawals', {
			method: 'POST',
			body: JSON.stringify(payload),
		});
	},
};

export default { apiCall, getAuthToken, retryApiCall, walletApi, APIError };