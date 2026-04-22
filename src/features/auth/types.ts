// src/features/auth/types.ts

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'customer' | 'agent' | 'admin';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  accountNumber: string;
  bankName: string;
  accountType: 'customer' | 'agent';
  password: string;
  referralCode?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}