import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as paymentAPI from '@/api/payments';
import { useModalStore } from './ModalStore';

/** React Query hook to submit a payment receipt */
export const useSubmitPayment = () => {
  const queryClient = useQueryClient();
  const { openModal } = useModalStore();

  return useMutation({
    mutationFn: (payload: paymentAPI.SubmitPaymentRequest) =>
      paymentAPI.submitPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      openModal({
        type: 'success',
        title: 'Payment Submitted',
        message: "Your receipt has been submitted for review. You'll receive approval notification within 24 hours.",
      });
    },
    onError: (error: Error) => {
      console.error('[Submit Payment Mutation Error]', error);
      openModal({
        type: 'error',
        title: 'Payment Failed',
        message: error.message || 'Failed to submit payment receipt',
      });
    },
  });
};

/** React Query hook to fetch the user's payment history */
export const useGetPayments = () =>
  useQuery({
    queryKey: ['payments'],
    queryFn: paymentAPI.getPayments,
    staleTime: 3 * 60 * 1000,
    retry: 1,
  });

/** React Query hook to fetch a specific payment detail */
export const useGetPaymentDetail = (paymentId?: string) =>
  useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => {
      if (!paymentId) throw new Error('Payment ID is required');
      return paymentAPI.getPaymentDetail(paymentId);
    },
    enabled: !!paymentId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });