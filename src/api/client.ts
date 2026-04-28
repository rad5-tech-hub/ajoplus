// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ajoplus.com';

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

/**
 * Base API client with auth, retry, and consistent response handling
 * Optimized for AjoPlus (3G networks + reliability)
 */
export async function apiCall<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

	const token = getAuthToken();
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	};

	const makeRequest = async (): Promise<T> => {
		const response = await fetch(url, {
			...options,
			headers,
		});

		let rawData: unknown;
		try {
			rawData = await response.json();
		} catch {
			rawData = null;
		}

		// Handle non-OK responses
		if (!response.ok) {
			const errorData = rawData as Record<string, unknown> | null;
			throw new APIError(
				response.status,
				rawData,
				(errorData?.message as string | undefined) || `API Error: ${response.status}`
			);
		}

		// IMPORTANT: Return the FULL response object (not just .data)
		// This matches your actual API structure: { success, statusCode, message, data }
		return rawData as T;
	};

	// Retry only GET requests (safe for 3G flaky networks)
	const isGet = (options.method || 'GET').toUpperCase() === 'GET';
	return isGet ? retryApiCall(makeRequest, 3) : makeRequest();
}

/**
 * Get authorization token from Zustand persisted storage
 */
export function getAuthToken(): string | null {
	try {
		const auth = localStorage.getItem('ajoplus-auth-storage');
		if (auth) {
			const parsed = JSON.parse(auth);
			return parsed.state?.token || null;
		}
	} catch (error) {
		console.error('Failed to retrieve auth token', error);
	}
	return null;
}

/**
 * Retry logic with exponential backoff — critical for low-end devices & 3G
 */
export async function retryApiCall<T>(
	fn: () => Promise<T>,
	maxRetries = 3
): Promise<T> {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			if (attempt === maxRetries - 1) throw error;

			// Exponential backoff: 1s → 2s → 4s
			const delay = Math.pow(2, attempt) * 1000;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
	throw new Error('Max retries exceeded');
}

export default {
	apiCall,
	getAuthToken,
	retryApiCall,
	APIError,
};