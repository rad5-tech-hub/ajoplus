import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as paymentAPI from '@/api/payments';
import { APIError } from '@/api/client';
import { useModalStore } from './ModalStore';
import { usePendingPaymentStore } from './PendingPaymentStore';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useGetPayments = () =>
  useQuery({
    queryKey: ['payments'],
    queryFn: paymentAPI.getPayments,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: smartRetry,
  });

export const useGetPendingPayments = () =>
  useQuery({
    queryKey: ['payments', 'pending'],
    queryFn: () => paymentAPI.getPendingPayments(),
    staleTime: 60 * 1000,
    gcTime: 2 * 60 * 1000,
    retry: smartRetry,
  });

export const useGetPaymentDetail = (paymentId?: string) =>
  useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentAPI.getPaymentDetail(paymentId!),
    enabled: !!paymentId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: smartRetry,
  });

export const useSubmitPayment = () => {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  return useMutation({
    mutationFn: (payload: paymentAPI.SubmitPaymentRequest) =>
      paymentAPI.submitPayment(payload),
    onSuccess: (payment) => {
      // Track locally for pending banner (never call GET /api/payment/payments for customers)
      usePendingPaymentStore.getState().addPending({
        id: payment.id,
        paymentType: payment.paymentType,
        amountPaid: payment.amountPaid,
        submittedAt: new Date().toISOString(),
      });

      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['userPackages'] });
      queryClient.invalidateQueries({ queryKey: ['customerDashboard'] });
      openModal({
        type: 'success',
        title: 'Payment Submitted',
        message: 'Your receipt is pending admin review. Your balance will update once approved.',
      });
      setTimeout(() => closeModal(), 2500);
    },
    onError: (error: Error) => {
      console.error('[Submit Payment Mutation Error]', error);
      openModal({
        type: 'error',
        title: 'Payment Failed',
        message: error.message || 'Failed to submit payment receipt',
      });
      setTimeout(() => closeModal(), 3000);
    },
  });
};

export const useGetMyRejectedPayments = () =>
  useQuery({
    queryKey: ['payments', 'me', 'rejected'],
    queryFn: paymentAPI.getMyRejectedPayments,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useGetMyApprovedPayments = () =>
  useQuery({
    queryKey: ['payments', 'me', 'approved'],
    queryFn: paymentAPI.getMyApprovedPayments,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useGetApprovedPayments = () =>
  useQuery({
    queryKey: ['payments', 'approved'],
    queryFn: paymentAPI.getApprovedPayments,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useGetRejectedPayments = () =>
  useQuery({
    queryKey: ['payments', 'rejected'],
    queryFn: paymentAPI.getRejectedPayments,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useApprovePayment = () => {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  return useMutation({
    mutationFn: (paymentId: string) => paymentAPI.approvePayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['userPackages'] });
      queryClient.invalidateQueries({ queryKey: ['payment'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['customerDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'me', 'rejected'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'me', 'approved'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'approved'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'rejected'] });
      openModal({
        type: 'success',
        title: 'Payment Approved',
        message: 'The payment has been approved successfully.',
      });
      setTimeout(() => closeModal(), 2500);
    },
    onError: (error: Error) => {
      console.error('[Approve Payment Mutation Error]', error);
      openModal({
        type: 'error',
        title: 'Approval Failed',
        message: error.message || 'Failed to approve payment. Please try again.',
      });
      setTimeout(() => closeModal(), 3000);
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      paymentId,
      rejectionReason,
    }: {
      paymentId: string;
      rejectionReason: string;
    }) => paymentAPI.rejectPayment(paymentId, { rejectionReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['userPackages'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['customerDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'overview'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'me', 'rejected'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'me', 'approved'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'approved'] });
      queryClient.invalidateQueries({ queryKey: ['payments', 'rejected'] });
    },
    onError: (error: Error) => {
      console.error('[Reject Payment Mutation Error]', error);
    },
  });
};