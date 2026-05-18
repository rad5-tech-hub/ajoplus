import { apiCall } from './client';

export interface RegistrationFeeStatus {
  user: {
    id: string;
    fullName: string;
    email: string;
    accountStatus: string;
    registrationFeeStatus: 'pending' | 'approved' | 'rejected';
    registrationExpiryDate: string | null;
    daysRemaining: number;
  };
  latestFee: {
    id: string;
    amount: number;
    paymentDate: string;
    proofFile: string;
    status: 'pending' | 'approved' | 'rejected';
    rejectionReason: string | null;
    createdAt: string;
  } | null;
}

export interface RegistrationFeeSubmission {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  amount: number;
  proofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  paymentDate: string;
  createdAt: string;
}

export interface AdminRegistrationFeesResponse {
  submissions: RegistrationFeeSubmission[];
  count: number;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ── Admin Fee Management (new endpoints) ─────────────────────────────

export interface AdminPendingFee {
  id: string;
  userId: string;
  fullName?: string;
  email?: string;
  amount: number;
  paymentDate: string;
  proofFile: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: string;
}

export interface AdminPendingFeesResponse {
  count: number;
  fees: AdminPendingFee[];
}

export interface AdminFeeActionResponse {
  registrationFee: AdminPendingFee;
  user: {
    id: string;
    fullName: string;
    email: string;
    accountStatus: string;
    registrationFeeStatus: string;
  };
}

export interface RegistrationFeeUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'customer' | 'agent';
  accountStatus: 'pending' | 'active' | 'inactive' | 'suspended';
  registrationFeeStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
}

export interface RegistrationFeeRecord {
  id: string;
  userId: string;
  amount: string;
  paymentDate: string;
  proofFile: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  user: RegistrationFeeUser;
}

export interface ApprovedRejectedResponse {
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    recordsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  fees: RegistrationFeeRecord[];
}

export const getAdminApprovedRejectedFees = async (status?: 'approved' | 'rejected'): Promise<ApprovedRejectedResponse> => {
  const url = status
    ? `/api/registration-fee/admin/approved-rejected?status=${status}`
    : '/api/registration-fee/admin/approved-rejected';
  const response = await apiCall<ApiResponse<ApprovedRejectedResponse>>(url);
  if (!response.success) throw new Error(response.message || 'Failed to fetch fees');
  return response.data;
};

export const getAdminPendingFees = async (): Promise<AdminPendingFeesResponse> => {
  const response = await apiCall<ApiResponse<AdminPendingFeesResponse>>(
    '/api/registration-fee/admin/pending'
  );
  if (!response.success) throw new Error(response.message || 'Failed to fetch pending fees');
  return response.data;
};

export const approveAdminFee = async (feeId: string): Promise<AdminFeeActionResponse> => {
  const response = await apiCall<ApiResponse<AdminFeeActionResponse>>(
    `/api/registration-fee/admin/${feeId}/approve`,
    { method: 'PATCH' }
  );
  if (!response.success) throw new Error(response.message || 'Failed to approve fee');
  return response.data;
};

export const rejectAdminFee = async (feeId: string, rejectionReason: string): Promise<AdminFeeActionResponse> => {
  const response = await apiCall<ApiResponse<AdminFeeActionResponse>>(
    `/api/registration-fee/admin/${feeId}/reject`,
    { method: 'PATCH', body: JSON.stringify({ rejectionReason }) }
  );
  if (!response.success) throw new Error(response.message || 'Failed to reject fee');
  return response.data;
};

export const submitRegistrationFee = async (
  paymentDate: string,
  proofFile: File
): Promise<RegistrationFeeSubmission> => {
  const formData = new FormData();
  formData.append('paymentDate', paymentDate);
  formData.append('proofFile', proofFile);

  const response = await apiCall<ApiResponse<{ submission: RegistrationFeeSubmission }>>(
    '/api/registration-fee/me/submit',
    { method: 'POST', body: formData }
  );
  if (!response.success) throw new Error(response.message || 'Failed to submit registration fee');
  return response.data.submission;
};

export const getRegistrationFeeStatus = async (): Promise<RegistrationFeeStatus> => {
  const response = await apiCall<ApiResponse<RegistrationFeeStatus>>(
    '/api/registration-fee/me/status'
  );
  if (!response.success) throw new Error(response.message || 'Failed to fetch status');
  return response.data;
};

export const submitRenewal = async (
  paymentDate: string,
  proofFile: File
): Promise<RegistrationFeeSubmission> => {
  const formData = new FormData();
  formData.append('paymentDate', paymentDate);
  formData.append('proofFile', proofFile);

  const response = await apiCall<ApiResponse<{ submission: RegistrationFeeSubmission }>>(
    '/api/auth/renewal',
    { method: 'POST', body: formData }
  );
  if (!response.success) throw new Error(response.message || 'Failed to submit renewal');
  return response.data.submission;
};

export const getAdminPendingRegistrationFees = async (): Promise<AdminRegistrationFeesResponse> => {
  const response = await apiCall<ApiResponse<AdminRegistrationFeesResponse>>(
    '/api/admin/registration-fees/pending'
  );
  if (!response.success) throw new Error(response.message || 'Failed to fetch pending fees');
  return response.data;
};

export const getAdminApprovedRegistrationFees = async (): Promise<AdminRegistrationFeesResponse> => {
  const response = await apiCall<ApiResponse<AdminRegistrationFeesResponse>>(
    '/api/admin/registration-fees/approved'
  );
  if (!response.success) throw new Error(response.message || 'Failed to fetch approved fees');
  return response.data;
};

export const getAdminRejectedRegistrationFees = async (): Promise<AdminRegistrationFeesResponse> => {
  const response = await apiCall<ApiResponse<AdminRegistrationFeesResponse>>(
    '/api/admin/registration-fees/rejected'
  );
  if (!response.success) throw new Error(response.message || 'Failed to fetch rejected fees');
  return response.data;
};

export const approveRegistrationFee = async (id: string): Promise<RegistrationFeeSubmission> => {
  const response = await apiCall<ApiResponse<{ submission: RegistrationFeeSubmission }>>(
    `/api/admin/registration-fees/${id}/approve`,
    { method: 'PATCH' }
  );
  if (!response.success) throw new Error(response.message || 'Failed to approve fee');
  return response.data.submission;
};

export const rejectRegistrationFee = async (
  id: string,
  rejectionReason: string
): Promise<RegistrationFeeSubmission> => {
  const response = await apiCall<ApiResponse<{ submission: RegistrationFeeSubmission }>>(
    `/api/admin/registration-fees/${id}/reject`,
    { method: 'PATCH', body: JSON.stringify({ rejectionReason }) }
  );
  if (!response.success) throw new Error(response.message || 'Failed to reject fee');
  return response.data.submission;
};
