import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adsAPI from '@/api/ads';
import { APIError } from '@/api/client';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useActiveAdvert = () =>
  useQuery({
    queryKey: ['ads', 'active'],
    queryFn: adsAPI.getActiveAdvert,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useAllAdverts = () =>
  useQuery({
    queryKey: ['ads', 'all'],
    queryFn: adsAPI.getAllAdverts,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useCreateAdvert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, imageFile }: { data: Partial<adsAPI.Advert>; imageFile?: File }) =>
      adsAPI.createAdvert(data, imageFile),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ads'] });
    },
  });
};

export const useUpdateAdvert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFile }: { id: string; data: Partial<adsAPI.Advert>; imageFile?: File }) =>
      adsAPI.updateAdvert(id, data, imageFile),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ads'] });
    },
  });
};
