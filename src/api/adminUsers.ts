import { apiCall } from './client';

export interface ExpiredUser {
  id: string;
  fullName: string;
  email: string;
  accountStatus: string;
  registrationFeeStatus: string;
  registrationExpiryDate: string;
  role?: 'customer' | 'agent';
}

export interface ExpiredUsersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  withinDays: number;
}

export interface ExpiredUsersResponse {
  meta: ExpiredUsersMeta;
  users: ExpiredUser[];
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  imageUrl?: string | null;
  accountName?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  address?: string | null;
  role: 'customer' | 'agent';
  accountStatus: string;
  registrationFeeStatus: string;
  registrationExpiryDate: string | null;
  daysRemaining?: number | null;
  userStatus?: string | null;
  referralCode?: string | null;
  referredByAgentCode?: string | null;
  referredBy?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AdminUsersMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  meta: AdminUsersMeta;
  users: AdminUser[];
}

export const getAdminUsers = async (page = 1, limit = 10): Promise<AdminUsersResponse> => {
  const response = await apiCall<ApiResponse<AdminUsersResponse>>(
    `/api/admin/users?page=${page}&limit=${limit}`
  );
  if (!response.success) throw new Error(response.message || 'Failed to fetch users');
  return response.data;
};

export const getExpiredUsers = async (page = 1, limit = 10): Promise<ExpiredUsersResponse> => {
  const response = await apiCall<ApiResponse<ExpiredUsersResponse>>(
    `/api/admin/users/expiries?page=${page}&limit=${limit}`
  );
  if (!response.success) throw new Error(response.message || 'Failed to fetch expired users');
  return response.data;
};
