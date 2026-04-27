/**
 * Authentication API
 * Handles all auth-related API calls
 */

import { apiCall, retryApiCall } from './client';
import { LoginCredentials, SignupData, User } from '@/features/auth/types';

export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Login with email and password
 * @param credentials - Email and password
 * @returns User and auth token
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  return retryApiCall(
    () => apiCall<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    3
  );
}

/**
 * Sign up new user
 * @param data - Full name, email, phone, password, account type
 * @returns New user and auth token
 */
export async function signupUser(data: SignupData): Promise<AuthResponse> {
  return retryApiCall(
    () => apiCall<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    3
  );
}

/**
 * Verify auth token (check if user is still logged in)
 * @returns Current user info
 */
export async function verifyToken(): Promise<User> {
  return apiCall<User>('/auth/verify', {
    method: 'GET',
  });
}

/**
 * Logout (optional - mainly for notifying backend)
 */
export async function logoutUser(): Promise<void> {
  try {
    await apiCall('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Logout can fail gracefully - just clear local state
    console.warn('Logout API call failed, but clearing local auth state', error);
  }
}

/**
 * Request password reset
 * @param email - User email
 */
export async function requestPasswordReset(email: string): Promise<void> {
  return apiCall('/auth/password-reset-request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export default {
  loginUser,
  signupUser,
  verifyToken,
  logoutUser,
  requestPasswordReset,
};
