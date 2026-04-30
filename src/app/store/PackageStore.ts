// src/app/store/PackageStore.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as packageAPI from '@/api/package';
import * as categoriesAPI from '@/api/categories'; // ← Category & getCategories live here
import { useModalStore } from './ModalStore';

// Re-export types consumed by feature modules
export type { UserPackage } from '@/api/package';
export type { Category } from '@/api/categories';

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useUserPackages = () =>
  useQuery({
    queryKey: ['userPackages'],
    queryFn: packageAPI.getUserPackages,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

export const useAvailablePackages = () =>
  useQuery({
    queryKey: ['availablePackages'],
    queryFn: packageAPI.getAvailablePackages,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });

export const usePackageById = (packageId: string) =>
  useQuery({
    queryKey: ['package', packageId],
    queryFn: () => packageAPI.getPackageById(packageId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

/** Categories are owned by ./categories — route through categoriesAPI */
export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getCategories,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useJoinPackage = () => {
  const queryClient = useQueryClient();
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);

  return useMutation({
    mutationFn: (packageId: string) => packageAPI.joinPackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPackages'] });
      openModal({ type: 'success', title: 'Success!', message: 'Package joined successfully. Redirecting...' });
      setTimeout(() => closeModal(), 2500);
    },
    onError: (error: Error) => {
      openModal({ type: 'error', title: 'Failed to Join Package', message: error.message || 'Please try again' });
      setTimeout(() => closeModal(), 3000);
    },
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);

  return useMutation({
    mutationFn: (data: Parameters<typeof packageAPI.createPackage>[0]) =>
      packageAPI.createPackage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availablePackages'] });
      openModal({ type: 'success', title: 'Package Created!', message: 'New package has been created successfully.' });
      setTimeout(() => closeModal(), 2500);
    },
    onError: (error: Error) => {
      openModal({ type: 'error', title: 'Failed to Create Package', message: error.message || 'Please try again' });
      setTimeout(() => closeModal(), 3000);
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);

  return useMutation({
    mutationFn: ({ packageId, data }: { packageId: string; data: Partial<packageAPI.CreatePackageRequest> }) =>
      packageAPI.updatePackage(packageId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availablePackages'] });
      queryClient.invalidateQueries({ queryKey: ['package'] });
      openModal({ type: 'success', title: 'Package Updated', message: 'Package updated successfully.' });
      setTimeout(() => closeModal(), 2500);
    },
    onError: (error: Error) => {
      openModal({ type: 'error', title: 'Update Failed', message: error.message || 'Please try again' });
      setTimeout(() => closeModal(), 3000);
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  const openModal = useModalStore((s) => s.openModal);
  const closeModal = useModalStore((s) => s.closeModal);

  return useMutation({
    mutationFn: (packageId: string) => packageAPI.deletePackage(packageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availablePackages'] });
      openModal({ type: 'success', title: 'Deleted', message: 'Package deleted successfully.' });
      setTimeout(() => closeModal(), 2500);
    },
    onError: (error: Error) => {
      openModal({ type: 'error', title: 'Delete Failed', message: error.message || 'Please try again' });
      setTimeout(() => closeModal(), 3000);
    },
  });
};