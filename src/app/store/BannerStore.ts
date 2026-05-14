import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as bannerAPI from '@/api/banner';
import { APIError } from '@/api/client';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useBanner = () =>
  useQuery({
    queryKey: ['banner'],
    queryFn: bannerAPI.getBanner,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: smartRetry,
  });

export const useUpdateBanner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<bannerAPI.BannerAd>) => bannerAPI.updateBanner(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banner'] });
    },
  });
};

export const useUploadBannerImage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => bannerAPI.uploadBannerImage(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['banner'] });
    },
  });
};
