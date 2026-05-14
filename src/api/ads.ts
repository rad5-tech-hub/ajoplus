import { apiCall } from './client';

export interface Advert {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  background: string;
  imageUrl: string;
  imagePublicId: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertsResponse {
  meta: { page: number; limit: number; total: number; totalPages: number };
  ads: Advert[];
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const getActiveAdvert = async (): Promise<Advert | null> => {
  try {
    const response = await apiCall<ApiResponse<AdvertsResponse>>('/api/ads/advert');
    if (!response.success) return null;
    const active = (response.data.ads ?? []).find(
      (ad) => ad.isActive
    );
    return active ?? null;
  } catch {
    return null;
  }
};

export const getAllAdverts = async (): Promise<AdvertsResponse> => {
  const response = await apiCall<ApiResponse<AdvertsResponse>>('/api/ads/advert');
  if (!response.success) throw new Error(response.message || 'Failed to fetch adverts');
  return response.data;
};

export const createAdvert = async (data: Partial<Advert>, imageFile?: File): Promise<Advert> => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.subtitle) formData.append('subtitle', data.subtitle);
  if (data.buttonText) formData.append('buttonText', data.buttonText);
  if (data.buttonLink) formData.append('buttonLink', data.buttonLink);
  if (data.background) formData.append('background', data.background);
  if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
  if (data.startDate) formData.append('startDate', data.startDate);
  if (data.endDate) formData.append('endDate', data.endDate);
  if (imageFile) formData.append('bannerImage', imageFile);

  const response = await apiCall<ApiResponse<Advert>>('/api/ads/advert', {
    method: 'POST',
    body: formData,
  });
  if (!response.success) throw new Error(response.message || 'Failed to create advert');
  return response.data;
};

export const updateAdvert = async (id: string, data: Partial<Advert>, imageFile?: File): Promise<Advert> => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.subtitle) formData.append('subtitle', data.subtitle);
  if (data.buttonText) formData.append('buttonText', data.buttonText);
  if (data.buttonLink) formData.append('buttonLink', data.buttonLink);
  if (data.background) formData.append('background', data.background);
  if (data.isActive !== undefined) formData.append('isActive', String(data.isActive));
  if (data.startDate) formData.append('startDate', data.startDate);
  if (data.endDate) formData.append('endDate', data.endDate);
  if (imageFile) formData.append('bannerImage', imageFile);

  const response = await apiCall<ApiResponse<Advert>>(`/api/ads/advert/${id}`, {
    method: 'PATCH',
    body: formData,
  });
  if (!response.success) throw new Error(response.message || 'Failed to update advert');
  return response.data;
};
