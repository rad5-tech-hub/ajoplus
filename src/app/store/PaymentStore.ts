import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as paymentAPI from '@/api/payments';
import { APIError } from '@/api/client';
import { useModalStore } from './ModalStore';

// ─── Shared retry predicate (mirrors PackageStore) ────────────────────────────
// Never retry 4xx errors — they are permanent. Only retry network failures.
const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Payment history for the current user */
export const useGetPayments = () =>
  useQuery({
    queryKey: ['payments'],
    queryFn: paymentAPI.getPayments,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: smartRetry,
  });

/** All pending payments — admin use */
export const useGetPendingPayments = () =>
  useQuery({
    queryKey: ['payments', 'pending'],
    queryFn: paymentAPI.getPendingPayments,
    staleTime: 60 * 1000, // 1 min — approvals change frequently
    gcTime: 2 * 60 * 1000,
    retry: smartRetry,
  });

/** Single payment detail */
export const useGetPaymentDetail = (paymentId?: string) =>
  useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => paymentAPI.getPaymentDetail(paymentId!),
    enabled: !!paymentId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: smartRetry,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Submit a payment receipt for review */
export const useSubmitPayment = () => {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  return useMutation({
    mutationFn: (payload: paymentAPI.SubmitPaymentRequest) =>
      paymentAPI.submitPayment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      openModal({
        type: 'success',
        title: 'Payment Submitted',
        message: "Your receipt has been submitted for review. You'll receive an approval notification within 24 hours.",
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

/** Approve a payment — admin only */
export const useApprovePayment = () => {
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useModalStore();

  return useMutation({
    mutationFn: (paymentId: string) => paymentAPI.approvePayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
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

/** Reject a payment with a reason — admin only */
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
      // Invalidate both lists so any view reflects the new status immediately
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: Error) => {
      console.error('[Reject Payment Mutation Error]', error);
    },
  });
};