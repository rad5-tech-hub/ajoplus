import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as settingsAPI from '@/api/settings';
import { APIError } from '@/api/client';

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false;
  return failureCount < 2;
};

export const useGetAjoSettings = () =>
  useQuery({
    queryKey: ['ajoSettings'],
    queryFn: settingsAPI.getAjoSettings,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: smartRetry,
  });

export const useUpdateAjoSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: settingsAPI.UpdateSettingsRequest) =>
      settingsAPI.updateAjoSettings(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ajoSettings'] });
    },
  });
};

