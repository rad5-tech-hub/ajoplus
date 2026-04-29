import { apiCall } from './client';

interface WalletResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    wallet: {
      id: string;
      userId: string;
      dailyAmount: number;
      totalSaved: number;
      commissionPaid: number;
      availableBalance: number;
      daysSaved: number;
      commissionType: string;
      monthlySummary: number;
      nextCommissionDeductionDate: string;
      daysUntilCommissionDeduction: number;
    };
  };
}

export async function getCustomerWallet() {
  const resp = await apiCall<WalletResponse>('/api/customer/wallet');
  if (!resp?.success) throw new Error(resp?.message || 'Failed to fetch wallet');
  return resp.data.wallet;
}

interface CustomerDashboardResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    customer: {
      id: string;
      fullName: string;
      email: string;
    };
    summary: {
      totalSaved: number;
      pendingPayments: number;
      availableBalance: number;
      activePackages: number;
      commissionRate: number;
      commissionPaid: number;
    };
    myPackages: unknown[];
    savingsCard: unknown | null;
    updatedAt: string;
  };
}

export async function getCustomerDashboard() {
  const resp = await apiCall<CustomerDashboardResponse>('/api/customer/dashboard');
  if (!resp?.success) throw new Error(resp?.message || 'Failed to fetch customer dashboard');
  return resp.data;
}

export default { getCustomerWallet, getCustomerDashboard };
