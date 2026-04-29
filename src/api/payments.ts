import { apiCall } from './client';

export type PaymentType = 'package' | 'cart';

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
  expectedAmount: string;
  paymentType: PaymentType;
  packageId?: string;
  cartItems?: string; // JSON stringified CartItemPayload[]
}

export interface PaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    paymentId: string;
    status: 'pending_approval' | 'approved' | 'rejected';
    amountPaid: string;
    createdAt: string;
  };
}

/**
 * Submit payment receipt for verification
 * Uploads receipt image/PDF and payment details for manual approval
 */
export const submitPayment = async (payload: SubmitPaymentRequest): Promise<PaymentResponse> => {
  try {
    const formData = new FormData();
    formData.append('receipt', payload.receipt);
    formData.append('amountPaid', payload.amountPaid);
    formData.append('expectedAmount', payload.expectedAmount);
    formData.append('paymentType', payload.paymentType);

    if (payload.packageId) {
      formData.append('packageId', payload.packageId);
    }
    if (payload.cartItems) {
      formData.append('cartItems', payload.cartItems);
    }

    const response = await apiCall<PaymentResponse>('/api/payments/submit', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type; fetch will set it automatically with boundary
      } as HeadersInit,
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to submit payment receipt');
    }

    return response;
  } catch (error) {
    console.error('[Submit Payment Error]', error);
    throw error;
  }
};

/**
 * Get payment history for the user
 */
export interface GetPaymentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    payments: Array<{
      paymentId: string;
      amountPaid: string;
      type: PaymentType;
      status: 'pending_approval' | 'approved' | 'rejected';
      receipt: string;
      createdAt: string;
      approvedAt?: string;
    }>;
    totalAmount: string;
  };
}

export const getPayments = async (): Promise<GetPaymentsResponse> => {
  try {
    const response = await apiCall<GetPaymentsResponse>('/api/payments');

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch payments');
    }

    return response;
  } catch (error) {
    console.error('[Get Payments Error]', error);
    throw error;
  }
};

/**
 * Get a specific payment by ID
 */
export interface GetPaymentDetailResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    paymentId: string;
    amountPaid: string;
    expectedAmount: string;
    type: PaymentType;
    status: 'pending_approval' | 'approved' | 'rejected';
    receipt: string;
    rejectionReason?: string;
    createdAt: string;
    approvedAt?: string;
  };
}

export const getPaymentDetail = async (paymentId: string): Promise<GetPaymentDetailResponse> => {
  try {
    const response = await apiCall<GetPaymentDetailResponse>(`/api/payments/${paymentId}`);

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch payment detail');
    }

    return response;
  } catch (error) {
    console.error('[Get Payment Detail Error]', error);
    throw error;
  }
};