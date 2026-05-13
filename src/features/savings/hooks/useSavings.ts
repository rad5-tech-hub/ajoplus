import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as savingsAPI from '../api';
import * as paymentsAPI from '@/api/payments';
import { submitWithdrawal } from '@/api/withdrawals';
import { APIError } from '@/api/client';
import { useModalStore } from '@/app/store/ModalStore';
import type { SavingsPlan } from '../types';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useSavingsPlans = () =>
  useQuery({
    queryKey: ['savings', 'plans'],
    queryFn: savingsAPI.fetchSavingsPlans,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useSavingsPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: savingsAPI.SavingsPaymentPayload) =>
      paymentsAPI.submitPayment({
        receipt: payload.receipt,
        amountPaid: payload.amountPaid,
        userPackageId: payload.savingsId,
        paymentType: 'saving',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings', 'plans'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['customerDashboard'] });
      qc.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useSavingsWithdrawal = () => {
  const qc = useQueryClient();
  const openModal = useModalStore((s) => s.openModal);
  return useMutation({
    mutationFn: (payload: savingsAPI.SavingsWithdrawalPayload) =>
      submitWithdrawal(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['savings', 'plans'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['customerDashboard'] });
    },
    onError: (error: Error) => {
      openModal({
        type: 'error',
        title: 'Withdrawal Failed',
        message: error.message || 'Something went wrong. Please try again.',
      });
    },
  });
};

export function usePortfolio(plans: SavingsPlan[] | undefined) {
  if (!plans || plans.length === 0) {
    return { totalSaved: 0, totalCommission: 0, totalPayable: 0, activePlans: 0 };
  }
  return {
    totalSaved: plans.reduce((sum, p) => sum + p.totalSaved, 0),
    totalCommission: plans.reduce((sum, p) => sum + p.commission, 0),
    totalPayable: plans.reduce((sum, p) => sum + p.availableBalance, 0),
    activePlans: plans.filter((p) => p.status === 'active').length,
  };
}
