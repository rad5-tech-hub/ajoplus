import { useQuery } from '@tanstack/react-query';
import * as customerAPI from '@/api/customer';
import { useDailyAjoStore } from './DailyAjoStore';
import { APIError } from '@/api/client';
import { getSavingPlans } from '@/api/savingPlan';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useCustomerDashboard = () => {
  return useQuery({
    queryKey: ['customerDashboard'],
    queryFn: customerAPI.getCustomerDashboard,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });
};

export const useCustomerWallet = () => {
  const syncFromWallet = useDailyAjoStore((s) => s.syncFromWallet);

  return useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const [walletData, plans] = await Promise.all([
        customerAPI.getCustomerWallet(),
        getSavingPlans(),
      ]);

      const wallets = walletData.wallets ?? [];
      const hasActivePlans = plans.length > 0 || wallets.length > 0;

      const aggregated = {
        dailyAmount: wallets.reduce((s, w) => s + w.dailyAmount, 0),
        totalSaved: wallets.reduce((s, w) => s + w.totalSaved, 0),
        commissionPaid: wallets.reduce((s, w) => s + w.commissionPaid, 0),
        availableBalance: wallets.reduce((s, w) => s + w.availableBalance, 0),
        daysSaved: wallets.length > 0 ? Math.max(...wallets.map((w) => w.daysSaved), 0) : 0,
      };

      syncFromWallet({
        dailyAmount: aggregated.dailyAmount > 0 ? aggregated.dailyAmount : plans.reduce((s, p) => s + p.amount, 0),
        totalSaved: aggregated.totalSaved,
        commissionPaid: aggregated.commissionPaid,
        availableBalance: aggregated.availableBalance,
        daysSaved: aggregated.daysSaved,
        hasActivePlans,
      });

      return { ...aggregated, wallets, totalBalance: walletData.totalBalance, plans };
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });
};

export default { useCustomerDashboard, useCustomerWallet };
