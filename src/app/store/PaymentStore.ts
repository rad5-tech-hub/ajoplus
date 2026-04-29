import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as paymentAPI from '@/api/payments';
import { useModalStore } from './ModalStore';

/**
 * React Query hook to submit payment receipt
 * Handles file upload with proper error/success handling
 */
export const useSubmitPayment = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();

  return useMutation({
    mutationFn: (payload: paymentAPI.SubmitPaymentRequest) =>
      paymentAPI.submitPayment(payload),
    onSuccess: (data) => {
      // Invalidate payments list to fetch updated history
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      
      // Show success notification
      openModal({
        type: 'success',
        title: 'Payment Submitted',
        message: 'Your receipt has been submitted for review. You\'ll receive approval notification within 24 hours.',
      });
    },
    onError: (error) => {
      console.error('[Submit Payment Mutation Error]', error);
      openModal({
        type: 'error',
        title: 'Payment Failed',
        message: error instanceof Error ? error.message : 'Failed to submit payment receipt',
      });
    },
  });
};

/**
 * React Query hook to fetch user's payment history
 */
export const useGetPayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentAPI.getPayments,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 1,
    enabled: true, // Automatically fetch on mount if authenticated
  });
};

/**
 * React Query hook to fetch specific payment detail
 */
export const useGetPaymentDetail = (paymentId?: string) => {
  return useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => {
      if (!paymentId) throw new Error('Payment ID is required');
      return paymentAPI.getPaymentDetail(paymentId);
    },
    enabled: !!paymentId, // Only fetch if paymentId exists
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};
