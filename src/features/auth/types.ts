// src/features/auth/types.ts

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;       // API returns `phoneNumber`, not `phone`
  role: 'customer' | 'agent' | 'admin';
  agentId?: string;          // Only present for agents
  accountStatus: 'active' | 'inactive' | 'suspended';
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

// Mirrors the `data` envelope from the API
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;   // store refresh token for renewal
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}