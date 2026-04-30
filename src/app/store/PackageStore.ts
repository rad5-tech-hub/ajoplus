// src/app/store/PackageStore.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as packageAPI from '@/api/package';
import * as categoriesAPI from '@/api/categories';
import { APIError } from '@/api/client';
import { useModalStore } from './ModalStore';

export type { UserPackage } from '@/api/package';
export type { Category } from '@/api/categories';

// ─── Shared retry predicate ───────────────────────────────────────────────────
//
// client.ts's retryApiCall already throws immediately on 4xx/5xx (PERMANENT_ERROR_STATUSES).
// Without this guard React Query would re-invoke the entire queryFn — and therefore
// re-issue the network request — for every retry attempt, causing the 3× 404 pattern.
// With this predicate, React Query only retries genuine network/timeout failures.

const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false; // 4xx / 5xx — never retry, fail fast
  return failureCount < 2;                     // network errors — up to 2 retries
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useUserPackages = () =>
  useQuery({
    queryKey: ['userPackages'],
    queryFn: packageAPI.getUserPackages,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: smartRetry,
  });

export const useAvailablePackages = () =>
  useQuery({
    queryKey: ['availablePackages'],
    queryFn: packageAPI.getAvailablePackages,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: smartRetry,
  });

export const usePackageById = (packageId: string | undefined) =>
  useQuery({
    queryKey: ['package', packageId],
    queryFn: () => packageAPI.getPackageById(packageId!),
    // Never fire when packageId is empty/undefined — avoids spurious 404s
    enabled: !!packageId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: smartRetry,
  });

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getCategories,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: smartRetry,
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
    onSuccess: (_, { packageId }) => {
      // Invalidate both the list and the specific cached package so detail
      // pages immediately reflect the updated data after an admin edit.
      queryClient.invalidateQueries({ queryKey: ['availablePackages'] });
      queryClient.invalidateQueries({ queryKey: ['package', packageId] });
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