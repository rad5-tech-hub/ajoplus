import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as savingPlanAPI from '@/api/savingPlan';
import { APIError } from '@/api/client';
import { useDailyAjoStore } from './DailyAjoStore';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useGetSavingPlan = () =>
  useQuery({
    queryKey: ['savingPlan'],
    queryFn: savingPlanAPI.getSavingPlan,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useSetupSavingPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: savingPlanAPI.SetupSavingPlanRequest) =>
      savingPlanAPI.upsertSavingPlan(payload),
    onSuccess: (plan) => {
      // Only update dailyAmount — never overwrite real balance fields with zeros
      const current = useDailyAjoStore.getState();
      useDailyAjoStore.getState().syncFromWallet({
        dailyAmount: plan.amount,
        totalSaved: current.totalSaved,
        commissionPaid: current.commissionPaid,
        availableBalance: current.availableBalance,
        daysSaved: current.daysSaved,
      });

      qc.invalidateQueries({ queryKey: ['savingPlan'] });
      qc.invalidateQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['customerDashboard'] });
    },
  });
};