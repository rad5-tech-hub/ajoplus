import { apiCall } from './client';

export interface BannerAd {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  backgroundColor: string;
  textColor: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const getBanner = async (): Promise<BannerAd | null> => {
  try {
    const response = await apiCall<ApiResponse<{ banner: BannerAd }>>('/api/banner');
    if (!response.success) return null;
    return response.data.banner;
  } catch {
    return null;
  }
};

export const updateBanner = async (data: Partial<BannerAd>): Promise<BannerAd> => {
  const response = await apiCall<ApiResponse<{ banner: BannerAd }>>('/api/banner', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!response.success) throw new Error(response.message || 'Failed to update banner');
  return response.data.banner;
};

export const uploadBannerImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiCall<ApiResponse<{ imageUrl: string }>>('/api/banner/upload', {
    method: 'POST',
    body: formData,
  });
  if (!response.success) throw new Error(response.message || 'Failed to upload image');
  return response.data.imageUrl;
};
