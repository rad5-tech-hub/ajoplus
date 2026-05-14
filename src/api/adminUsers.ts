import { apiCall } from './client';

export interface ExpiredUser {
  id: string;
  fullName: string;
  email: string;
  accountStatus: string;
  registrationFeeStatus: string;
  registrationExpiryDate: string;
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

export const getExpiredUsers = async (page = 1, limit = 10): Promise<ExpiredUsersResponse> => {
  const response = await apiCall<ApiResponse<ExpiredUsersResponse>>(
    `/api/admin/users/expiries?page=${page}&limit=${limit}`
  );
  if (!response.success) throw new Error(response.message || 'Failed to fetch expired users');
  return response.data;
};
