import { User, AuthTokens, LoginCredentials, SignupData } from '@/features/auth/types';
import { apiCall } from './client';

interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuthTokens & { user: User };
}

interface SignupResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AuthTokens & { user: User };
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<{ user: User; token: string; refreshToken: string }> {
  const json = await apiCall<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!json?.success) throw new Error(json?.message || 'Login failed');

  return {
    user: json.data.user,
    token: json.data.accessToken,
    refreshToken: json.data.refreshToken,
  };
}

export async function signupUser(
  data: SignupData
): Promise<{ user: User; token: string; refreshToken: string }> {
  const json = await apiCall<SignupResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phone,
      accountNumber: data.accountNumber,
      bankName: data.bankName,
      role: data.accountType,
      password: data.password,
      confirmPassword: data.password,
      referralCode: data.referralCode,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!json?.success) throw new Error(json?.message || 'Signup failed');

  return {
    user: json.data.user,
    token: json.data.accessToken,
    refreshToken: json.data.refreshToken,
  };
}

export async function logoutUser(): Promise<void> {
  try {
    const resp = await apiCall<{ success: boolean; message?: string; data: null }>(
      '/api/auth/logout',
      { method: 'POST' }
    );

    if (!resp?.success) throw new Error(resp?.message || 'Logout failed');
  } catch (error) {
    console.warn('[logoutUser] error', error);
    throw error;
  }
}

export default { loginUser, signupUser, logoutUser };
