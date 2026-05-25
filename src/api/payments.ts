import { apiCall } from './client';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PaymentType = 'package' | 'product' | 'saving';
export type PaymentStatus = 'pending' | 'pending_approval' | 'approved' | 'rejected';

export interface CartItemPayload {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemType: 'product' | 'package';
  quantity: number;
}

export interface RejectPaymentRequest {
  rejectionReason: string;
}

export interface SubmitPaymentRequest {
  receipt: File;
  amountPaid: string;
  userPackageId?: string;           // For package payments
  savingPlanId?: string;           // For saving payments
  cartId?: string;
  paymentType?: PaymentType;
  product?: string;
}
export interface Payment {
  id: string;
  status: PaymentStatus;
  userId: string;
  userPackageId: string | null;
  productId: string | null;
  cartId?: string | null;
  savingPlanId?: string | null;
  amountPaid: string;
  expectedAmount: string;
  receiptUrl: string;
  paymentType: PaymentType;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
  user: {
    id: string;
    fullName: string;
    email?: string;
  };
}


export interface PendingPayment extends Payment {
  user: { id: string; fullName: string; email: string; phoneNumber: string };
  userPackage?: unknown;
}


export interface PendingPaymentsResponse {
  summary: { total: number; byType: { package: number; product: number; saving: number } };
  payments: PendingPayment[];
}

// ─── Shared response wrapper ──────────────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Submit payment receipt for verification.
 * Sends FormData — Content-Type is intentionally omitted so fetch sets
 * the correct multipart/form-data boundary automatically.
 */
export const submitPayment = async (payload: SubmitPaymentRequest): Promise<Payment> => {
  try {
    const formData = new FormData();
    formData.append('amountPaid', payload.amountPaid);
    if (payload.userPackageId) formData.append('userPackageId', payload.userPackageId);
    formData.append('receipt', payload.receipt);

    if (payload.savingPlanId) formData.append('savingPlanId', payload.savingPlanId);
    if (payload.cartId) formData.append('cartId', payload.cartId);
    if (payload.paymentType) formData.append('paymentType', payload.paymentType);
    if (payload.product) formData.append('product', payload.product);

    const response = await apiCall<ApiResponse<{ payment: Payment }>>('/api/payment/manual-payment', {
      method: 'POST',
      body: formData,
      // No Content-Type header → browser sets correct multipart boundary
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to submit payment');
    }

    return response.data.payment;
  } catch (error) {
    console.error('[Submit Payment Error]', error);
    throw error; // Let React Query / global boundary handle
  }
};

/** Get all payments for the current user */
export const getPayments = async (): Promise<Payment[]> => {
  try {
    const response = await apiCall<ApiResponse<Payment[]>>('/api/payment/payments');
    if (!response.success) throw new Error(response.message || 'Failed to fetch payments');
    if (!Array.isArray(response.data)) throw new Error('Invalid response format: expected array');
    return response.data;
  } catch (error) {
    console.error('[Get Payments Error]', error);
    throw error;
  }
};

/** Get all pending payments (admin) */
export const getPendingPayments = async (paymentType?: string): Promise<PendingPaymentsResponse> => {
  try {
    const url = paymentType
      ? `/api/payment/payments/pending?paymentType=${paymentType}`
      : '/api/payment/payments/pending';
    const response = await apiCall<ApiResponse<PendingPaymentsResponse>>(url);
    if (!response.success) throw new Error(response.message || 'Failed to fetch pending payments');
    return response.data;
  } catch (error) {
    console.error('[Get Pending Payments Error]', error);
    throw error;
  }
};

/** Get a specific payment by ID */
export const getPaymentDetail = async (paymentId: string): Promise<Payment> => {
  try {
    const response = await apiCall<ApiResponse<Payment>>(`/api/payment/payment/${paymentId}`);
    if (!response.success) throw new Error(response.message || 'Failed to fetch payment detail');
    return response.data;
  } catch (error) {
    console.error('[Get Payment Detail Error]', error);
    throw error;
  }
};

/** Approve a payment (admin) */
export const approvePayment = async (paymentId: string): Promise<Payment> => {
  try {
    const response = await apiCall<ApiResponse<{ payment: Payment }>>(
      `/api/payment/payment/${paymentId}/approve`,
      { method: 'PATCH' }
    );
    if (!response.success) throw new Error(response.message || 'Failed to approve payment');
    return response.data.payment;
  } catch (error) {
    console.error('[Approve Payment Error]', error);
    throw error;
  }
};

/** Reject a payment with a reason (admin) */
export const rejectPayment = async (
  paymentId: string,
  data: RejectPaymentRequest
): Promise<Payment> => {
  try {
    const response = await apiCall<ApiResponse<{ payment: Payment }>>(
      `/api/payment/payment/${paymentId}/reject`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
    if (!response.success) throw new Error(response.message || 'Failed to reject payment');
    return response.data.payment;
  } catch (error) {
    console.error('[Reject Payment Error]', error);
    throw error;
  }
};

/** Customer: get their own rejected payments */
export const getMyRejectedPayments = async (): Promise<PendingPaymentsResponse> => {
  try {
    const response = await apiCall<ApiResponse<PendingPaymentsResponse>>(
      '/api/payment/payments/me/rejected'
    );
    if (!response.success) throw new Error(response.message || 'Failed to fetch rejected payments');
    return response.data;
  } catch (error) {
    console.error('[Get My Rejected Payments Error]', error);
    throw error;
  }
};

/** Customer: get their own approved payments */
export const getMyApprovedPayments = async (): Promise<PendingPaymentsResponse> => {
  try {
    const response = await apiCall<ApiResponse<PendingPaymentsResponse>>(
      '/api/payment/payments/me/approved'
    );
    if (!response.success) throw new Error(response.message || 'Failed to fetch approved payments');
    return response.data;
  } catch (error) {
    console.error('[Get My Approved Payments Error]', error);
    throw error;
  }
};

/** Customer: get their own pending payments */
export const fetchMyPendingPayments = async (): Promise<PendingPaymentsResponse> => {
  try {
    const response = await apiCall<ApiResponse<PendingPaymentsResponse>>(
      '/api/payment/payments/me/pending'
    );
    if (!response.success) throw new Error(response.message || 'Failed to fetch pending payments');
    return response.data;
  } catch (error) {
    console.error('[Fetch My Pending Payments Error]', error);
    throw error;
  }
};

/** Admin: all approved payments */
export const getApprovedPayments = async (): Promise<PendingPaymentsResponse> => {
  try {
    const response = await apiCall<ApiResponse<PendingPaymentsResponse>>(
      '/api/payment/payments/approved'
    );
    if (!response.success) throw new Error(response.message || 'Failed to fetch approved payments');
    return response.data;
  } catch (error) {
    console.error('[Get Approved Payments Error]', error);
    throw error;
  }
};

/** Admin: all rejected payments */
export const getRejectedPayments = async (): Promise<PendingPaymentsResponse> => {
  try {
    const response = await apiCall<ApiResponse<PendingPaymentsResponse>>(
      '/api/payment/payments/rejected'
    );
    if (!response.success) throw new Error(response.message || 'Failed to fetch rejected payments');
    return response.data;
  } catch (error) {
    console.error('[Get Rejected Payments Error]', error);
    throw error;
  }
};