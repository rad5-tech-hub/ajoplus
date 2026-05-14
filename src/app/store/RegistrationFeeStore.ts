import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as registrationFeeAPI from '@/api/registrationFee';
import * as adminUsersAPI from '@/api/adminUsers';
import { APIError } from '@/api/client';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useRegistrationFeeStatus = () =>
  useQuery({
    queryKey: ['registrationFee', 'status'],
    queryFn: registrationFeeAPI.getRegistrationFeeStatus,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useSubmitRegistrationFee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentDate, proofFile }: { paymentDate: string; proofFile: File }) =>
      registrationFeeAPI.submitRegistrationFee(paymentDate, proofFile),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrationFee', 'status'] });
    },
  });
};

export const useSubmitRenewal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentDate, proofFile }: { paymentDate: string; proofFile: File }) =>
      registrationFeeAPI.submitRenewal(paymentDate, proofFile),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['registrationFee', 'status'] });
    },
  });
};

export const useAdminPendingRegistrationFees = () =>
  useQuery({
    queryKey: ['admin', 'registrationFees', 'pending'],
    queryFn: registrationFeeAPI.getAdminPendingRegistrationFees,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useAdminApprovedRegistrationFees = () =>
  useQuery({
    queryKey: ['admin', 'registrationFees', 'approved'],
    queryFn: registrationFeeAPI.getAdminApprovedRegistrationFees,
    staleTime: 60 * 1000,
    retry: smartRetry,
  });

export const useAdminRejectedRegistrationFees = () =>
  useQuery({
    queryKey: ['admin', 'registrationFees', 'rejected'],
    queryFn: registrationFeeAPI.getAdminRejectedRegistrationFees,
    staleTime: 60 * 1000,
    retry: smartRetry,
  });

// ── Admin Fee Management (new endpoints) ─────────────────────────────

export const useAdminPendingFees = () =>
  useQuery({
    queryKey: ['admin', 'registrationFees', 'newPending'],
    queryFn: registrationFeeAPI.getAdminPendingFees,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useApproveAdminFee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (feeId: string) => registrationFeeAPI.approveAdminFee(feeId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'registrationFees', 'newPending'] });
    },
  });
};

export const useRejectAdminFee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ feeId, reason }: { feeId: string; reason: string }) =>
      registrationFeeAPI.rejectAdminFee(feeId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'registrationFees', 'newPending'] });
    },
  });
};

export const useExpiredUsers = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ['admin', 'users', 'expiries', page, limit],
    queryFn: () => adminUsersAPI.getExpiredUsers(page, limit),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useApproveRegistrationFee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => registrationFeeAPI.approveRegistrationFee(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'registrationFees'] });
      qc.invalidateQueries({ queryKey: ['registrationFee', 'status'] });
    },
  });
};

export const useRejectRegistrationFee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      registrationFeeAPI.rejectRegistrationFee(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'registrationFees'] });
      qc.invalidateQueries({ queryKey: ['registrationFee', 'status'] });
    },
  });
};
