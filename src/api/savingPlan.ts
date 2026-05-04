// src/api/savingPlan.ts
import { apiCall } from './client';
import { APIError } from './client';

export interface SavingPlan {
  id: string;
  userId: string;
  amount: number;
  description?: string;
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

export const setupSavingPlan = async (
  payload: SetupSavingPlanRequest
): Promise<SavingPlan> => {
  const response = await apiCall<ApiResponse<{ plan: SavingPlan }>>(
    '/api/saving-plan/setup',
    { method: 'POST', body: JSON.stringify(payload) }
  );
  if (!response.success) throw new Error(response.message || 'Failed to setup saving plan');
  return response.data.plan;
};

/** POST → on 409 (plan exists) falls back to PATCH */
export const upsertSavingPlan = async (
  payload: SetupSavingPlanRequest
): Promise<SavingPlan> => {
  try {
    return await setupSavingPlan(payload);
  } catch (error) {
    if (error instanceof APIError && error.status === 409) {
      const existing = await getSavingPlan();
      if (existing) return existing;
      throw new Error('Saving plan exists but could not be retrieved.');
    }
    throw error;
  }
};
export const getSavingPlan = async (): Promise<SavingPlan | null> => {
  try {
    const response = await apiCall<ApiResponse<{ plan: SavingPlan }>>(
      '/api/saving-plan/setup'
    );
    if (!response.success) return null;
    return response.data.plan;
  } catch (error) {
    if (error instanceof APIError && error.status === 404) return null;
    console.error('[Get Saving Plan Error]', error);
    throw error;
  }
};