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
  data: {
    id: string;
    email: string;
    role: string;
    fullName: string;
  };
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<{ user: User; token: string; refreshToken: string }> {
  const json = await apiCall<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: credentials.email, password: credentials.password }),
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
  data: SignupData,
): Promise<{ user: User; token: string; refreshToken: string }> {
  const body = new FormData();
  body.append('fullName', data.fullName);
  body.append('email', data.email);
  body.append('phoneNumber', data.phone);
  body.append('password', data.password);
  body.append('confirmPassword', data.confirmPassword);
  body.append('role', data.accountType);
  body.append('bankName', data.bankName);
  body.append('accountNumber', data.accountNumber);
  body.append('accountName', data.accountName);
  body.append('address', data.address);
  body.append('image', data.profileImage);
  if (data.referralCode) body.append('referredByAgentCode', data.referralCode);

  // Do NOT set Content-Type — the browser sets it with the correct boundary
  const json = await apiCall<SignupResponse>('/api/auth/register', {
    method: 'POST',
    body,
  });

  if (!json?.success) throw new Error(json?.message || 'Signup failed');

  // Registration returns user only; obtain tokens via login
  return loginUser({ email: data.email, password: data.password });
}

export async function logoutUser(): Promise<void> {
  try {
    const resp = await apiCall<{ success: boolean; message?: string; data: null }>(
      '/api/auth/logout',
      { method: 'POST' },
    );
    if (!resp?.success) throw new Error(resp?.message || 'Logout failed');
  } catch (error) {
    console.warn('[logoutUser] error', error);
    throw error;
  }
}

export default { loginUser, signupUser, logoutUser };