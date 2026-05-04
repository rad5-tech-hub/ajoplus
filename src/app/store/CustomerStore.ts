// src/app/store/CustomerStore.ts
import { useQuery } from '@tanstack/react-query';
import * as customerAPI from '@/api/customer';
import { useDailyAjoStore } from './DailyAjoStore';
import { APIError } from '@/api/client';
import { getSavingPlan } from '@/api/savingPlan';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useCustomerDashboard = () => {
  return useQuery({
    queryKey: ['customerDashboard'],
    queryFn: customerAPI.getCustomerDashboard,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });
};

export const useCustomerWallet = () => {
  const syncFromWallet = useDailyAjoStore((s) => s.syncFromWallet);

  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      // Parallel fetch — plan fills gap when wallet.dailyAmount hasn't caught up
      const [wallet, plan] = await Promise.all([
        customerAPI.getCustomerWallet(),
        getSavingPlan().catch(() => null),
      ]);

      const dailyAmount = wallet.dailyAmount > 0
        ? wallet.dailyAmount
        : (plan?.amount ?? 0);

      syncFromWallet({
        dailyAmount,
        totalSaved: wallet.totalSaved ?? 0,
        commissionPaid: wallet.commissionPaid ?? 0,
        availableBalance: wallet.availableBalance ?? 0,
        daysSaved: wallet.daysSaved ?? 0,
      });

      return { ...wallet, dailyAmount };
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });
};

export default { useCustomerDashboard, useCustomerWallet };
