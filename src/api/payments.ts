import { apiCall } from './client';

// ─── Types ───────────────────────────────────────────────────────────────────

export type PaymentType = 'package' | 'cart' | 'saving';
export type PaymentStatus = 'pending' | 'pending_approval' | 'approved' | 'rejected';

export interface CartItemPayload {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemType: 'product' | 'package';
  quantity: number;
}

export interface SubmitPaymentRequest {
  receipt: File;
  amountPaid: string;
  userPackageId: string;           // Required per new endpoint
  cardId?: string;                 // Optional (from Postman)
  paymentType?: PaymentType;       // Optional
  product?: string;                // Optional
  // Legacy fields (kept for compatibility if used elsewhere)
  expectedAmount?: string;
  packageId?: string;
  cartItems?: string;
}
export interface Payment {
  id: string;
  status: PaymentStatus;
  userId: string;
  userPackageId: string | null;
  productId: string | null;
  amountPaid: string;
  expectedAmount: string;
  receiptUrl: string;
  paymentType: PaymentType;
  rejectionReason?: string;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
}

export interface RejectPaymentRequest {
  rejectionReason: string;
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
    formData.append('userPackageId', payload.userPackageId);
    formData.append('receipt', payload.receipt);

    if (payload.cardId) formData.append('cardId', payload.cardId);
    if (payload.paymentType) formData.append('paymentType', payload.paymentType);
    if (payload.product) formData.append('product', payload.product);

    // Legacy support if needed by other flows
    if (payload.expectedAmount) formData.append('expectedAmount', payload.expectedAmount);
    if (payload.packageId) formData.append('packageId', payload.packageId);
    if (payload.cartItems) formData.append('cartItems', payload.cartItems);

    const response = await apiCall<ApiResponse<Payment>>('/api/payment/manual-payment', {
      method: 'POST',
      body: formData,
      // No Content-Type header → browser sets correct multipart boundary
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to submit payment');
    }

    return response.data;
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
export const getPendingPayments = async (): Promise<Payment[]> => {
  try {
    const response = await apiCall<ApiResponse<Payment[]>>('/api/payment/payments/pending');
    if (!response.success) throw new Error(response.message || 'Failed to fetch pending payments');
    if (!Array.isArray(response.data)) throw new Error('Invalid response format: expected array');
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