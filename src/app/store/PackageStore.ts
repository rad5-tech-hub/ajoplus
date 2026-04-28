// src/app/store/PackageStore.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as packageAPI from '@/api/package';
import { useModalStore } from './ModalStore';

export type { UserPackage } from '@/api/package';

/**
 * Hook to fetch all packages joined by the current user
 * Uses React Query for automatic caching and refetching
 */
export const useUserPackages = () => {
  return useQuery({
    queryKey: ['userPackages'],
    queryFn: packageAPI.getUserPackages,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
  });
};

/**
 * Hook to fetch all available packages for browsing
 */
export const useAvailablePackages = () => {
  return useQuery({
    queryKey: ['availablePackages'],
    queryFn: packageAPI.getAvailablePackages,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to fetch a specific package by ID
 */
export const usePackageById = (packageId: string) => {
  return useQuery({
    queryKey: ['package', packageId],
    queryFn: () => packageAPI.getPackageById(packageId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Hook to join a package
 */
export const useJoinPackage = () => {
  const queryClient = useQueryClient();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  return useMutation({
    mutationFn: (packageId: string) => packageAPI.joinPackage(packageId),
    onSuccess: () => {
      // Invalidate user packages query to refetch
      queryClient.invalidateQueries({ queryKey: ['userPackages'] });
      openModal({
        type: 'success',
        title: 'Success!',
        message: 'Package joined successfully. Redirecting...',
      });
      setTimeout(() => closeModal(), 2500);
    },
    onError: (error) => {
      openModal({
        type: 'error',
        title: 'Failed to Join Package',
        message: error instanceof Error ? error.message : 'Please try again',
      });
      setTimeout(() => closeModal(), 3000);
    },
  });
};

/**
 * Hook to create a new package (Admin only)
 */
export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  return useMutation({
    mutationFn: (data: Parameters<typeof packageAPI.createPackage>[0]) =>
      packageAPI.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availablePackages'] });
      openModal({
        type: 'success',
        title: 'Package Created!',
        message: 'New package has been created successfully.',
      });
      setTimeout(() => closeModal(), 2500);
    },
    onError: (error) => {
      openModal({
        type: 'error',
        title: 'Failed to Create Package',
        message: error instanceof Error ? error.message : 'Please try again',
      });
      setTimeout(() => closeModal(), 3000);
    },
  });
};

