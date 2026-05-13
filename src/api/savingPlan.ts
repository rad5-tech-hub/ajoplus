import { apiCall } from './client';

export interface SavingPlan {
  id: string;
  userId: string;
  amount: number;
  installmentAmount: number;
  commissionAmount: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SetupSavingPlanRequest {
  amount: number;
  description?: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const getSavingPlans = async (): Promise<SavingPlan[]> => {
  try {
    const response = await apiCall<ApiResponse<{ plans: SavingPlan[] }>>(
      '/api/saving-plan/setup'
    );
    if (!response.success) return [];
    return response.data.plans ?? [];
  } catch (error) {
    console.error('[Get Saving Plans Error]', error);
    return [];
  }
};

export const createSavingPlan = async (
  payload: SetupSavingPlanRequest
): Promise<SavingPlan> => {
  try {
    const response = await apiCall<ApiResponse<{ plan: SavingPlan }>>(
      '/api/saving-plan/setup',
      { method: 'POST', body: JSON.stringify(payload) }
    );
    if (!response.success) throw new Error(response.message || 'Failed to create saving plan');
    return response.data.plan;
  } catch (error) {
    console.error('[Create Saving Plan Error]', error);
    throw error;
  }
};
