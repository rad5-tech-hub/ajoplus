import { getCustomerWallet } from '@/api/customer';
import { getSavingPlans } from '@/api/savingPlan';
import type { SavingsPlan } from './types';

export async function fetchSavingsPlans(): Promise<SavingsPlan[]> {
  const [walletData, apiPlans] = await Promise.all([
    getCustomerWallet().catch(() => null),
    getSavingPlans(),
  ]);

  const wallets = walletData?.wallets ?? [];
  const walletMap = new Map(wallets.map((w) => [w.savingPlanId, w]));

  if (!walletData && !apiPlans.length) return [];

  // Wallets exist but no plans returned (e.g. plan metadata deleted)
  if (!apiPlans.length && wallets.length > 0) {
    return wallets.map((w) => ({
      id: w.savingPlanId,
      userId: w.userId,
      name: 'Savings Plan',
      dailyAmount: w.dailyAmount,
      totalSaved: w.totalSaved,
      commission: w.commissionPaid,
      availableBalance: w.availableBalance,
      daysSaved: w.daysSaved,
      status: 'active' as const,
      createdAt: '',
      updatedAt: '',
      daysUntilCommission: w.daysUntilCommissionDeduction,
    }));
  }

  // Merge plan metadata with wallet data by savingPlanId
  return apiPlans.map((apiPlan) => {
    const w = walletMap.get(apiPlan.id);
    return {
      id: apiPlan.id,
      userId: apiPlan.userId,
      name: apiPlan.description || 'Savings Plan',
      description: apiPlan.description ?? undefined,
      dailyAmount: w?.dailyAmount ?? apiPlan.amount,
      totalSaved: w?.totalSaved ?? 0,
      commission: w?.commissionPaid ?? apiPlan.commissionAmount,
      availableBalance: w?.availableBalance ?? 0,
      daysSaved: w?.daysSaved ?? 0,
      status: 'active' as const,
      createdAt: apiPlan.createdAt,
      updatedAt: apiPlan.updatedAt,
      daysUntilCommission: w?.daysUntilCommissionDeduction ?? 30,
    };
  });
}

export interface SetupSavingsPayload {
  amount: number;
  description?: string;
}

export interface SavingsPaymentPayload {
  amountPaid: string;
  savingsId: string;
  receipt: File;
}

export interface SavingsWithdrawalPayload {
  amount: number;
  description?: string;
}
