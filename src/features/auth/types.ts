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
// Add / update only the SignupData interface; keep everything else unchanged
export interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  accountNumber: string;
  bankName: string;
  accountName: string;
  address: string;
  profileImage: File;
  accountType: 'customer' | 'agent';
  referralCode?: string;
}
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