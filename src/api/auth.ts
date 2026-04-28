// src/api/auth.ts
import { User, AuthTokens, LoginCredentials, SignupData } from '@/features/auth/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

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
	const response = await fetch(`${BASE_URL}/api/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			email: credentials.email,
			password: credentials.password,
		}),
	});

	const json: LoginResponse = await response.json();

	if (!response.ok || !json.success) {
		throw new Error(json.message ?? 'Login failed');
	}

	return {
		user: json.data.user,
		token: json.data.accessToken,
		refreshToken: json.data.refreshToken,
	};
}

export async function signupUser(
	data: SignupData
): Promise<{ user: User; token: string; refreshToken: string }> {
	const response = await fetch(`${BASE_URL}/api/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
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
	});

	const json: SignupResponse = await response.json();

	if (!response.ok || !json.success) {
		throw new Error(json.message ?? 'Signup failed');
	}

	return {
		user: json.data.user,
		token: json.data.accessToken,
		refreshToken: json.data.refreshToken,
	};
}

export async function logoutUser(): Promise<void> {
	const response = await fetch(`${BASE_URL}/api/auth/logout`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	});

	if (!response.ok) {
		throw new Error('Logout request failed');
	}
}