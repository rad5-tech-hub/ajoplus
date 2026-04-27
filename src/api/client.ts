/**
 * API Configuration & Utilities
 * Centralized API client for all backend communication
 */

// Base API URL - environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ajoplus.com';

export class APIError extends Error {
  constructor(
    public status: number,
    public data: any,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Generic fetch wrapper with error handling
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(
      response.status,
      data,
      data.message || `API Error: ${response.status}`
    );
  }

  return data;
}

/**
 * Get authorization token from localStorage
 */
export function getAuthToken(): string | null {
  try {
    const auth = localStorage.getItem('ajoplus-auth-storage');
    if (auth) {
      const { state } = JSON.parse(auth);
      return state?.token || null;
    }
  } catch (error) {
    console.error('Failed to retrieve auth token', error);
  }
  return null;
}

/**
 * Add auth token to request headers
 */
export function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Retry logic for failed requests (max 3 attempts with exponential backoff)
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
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

export default {
  apiCall,
  getAuthHeaders,
  getAuthToken,
  retryApiCall,
  APIError,
};
