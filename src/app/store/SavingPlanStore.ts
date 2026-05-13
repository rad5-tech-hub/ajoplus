import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as savingPlanAPI from '@/api/savingPlan';
import { APIError } from '@/api/client';
import { useDailyAjoStore } from './DailyAjoStore';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useGetSavingPlans = () =>
  useQuery({
    queryKey: ['savingPlans'],
    queryFn: savingPlanAPI.getSavingPlans,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useCreateSavingPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: savingPlanAPI.SetupSavingPlanRequest) =>
      savingPlanAPI.createSavingPlan(payload),
    onSuccess: (plan) => {
      const current = useDailyAjoStore.getState();
      useDailyAjoStore.getState().syncFromWallet({
        dailyAmount: plan.amount,
        totalSaved: current.totalSaved,
        commissionPaid: current.commissionPaid,
        availableBalance: current.availableBalance,
        daysSaved: current.daysSaved,
        hasActivePlans: true,
      });
      qc.invalidateQueries({ queryKey: ['savingPlans'] });
      qc.refetchQueries({ queryKey: ['wallet'] });
      qc.invalidateQueries({ queryKey: ['customerDashboard'] });
    },
  });
};
