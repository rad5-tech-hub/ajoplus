import { apiCall } from './client';

export interface AjoSettings {
  id: string;
  commissionRate: number;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  commissionRate?: number;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const getAjoSettings = async (): Promise<AjoSettings> => {
  try {
    const response = await apiCall<ApiResponse<AjoSettings>>('/api/setting/ajo');
    if (!response.success) throw new Error(response.message || 'Failed to fetch settings');
    return response.data;
  } catch (error) {
    console.error('[Get Settings Error]', error);
    throw error;
  }
};

export const updateAjoSettings = async (
  payload: UpdateSettingsRequest
): Promise<AjoSettings> => {
  try {
    const response = await apiCall<ApiResponse<AjoSettings>>('/api/setting/ajo', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    if (!response.success) throw new Error(response.message || 'Failed to update settings');
    return response.data;
  } catch (error) {
    console.error('[Update Settings Error]', error);
    throw error;
  }
};