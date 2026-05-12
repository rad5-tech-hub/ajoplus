import { useQuery } from '@tanstack/react-query';
import * as adminProductAPI from '@/api/adminProducts';
import * as adminSavingsAPI from '@/api/adminSavings';
import { APIError } from '@/api/client';

const smartRetry = (failureCount: number, error: unknown): boolean => {
	if (error instanceof APIError) return false;
	return failureCount < 2;
};

export const useGetSavingsOverview = () =>
	useQuery({
		queryKey: ['admin', 'savings', 'overview'],
		queryFn: adminSavingsAPI.getSavingsOverview,
		staleTime: 60 * 1000,
		refetchOnWindowFocus: true,
		retry: smartRetry,
	});

export const useGetProductTransactions = (productId: string) =>
	useQuery({
		queryKey: ['admin', 'product', productId, 'transactions'],
		queryFn: () => adminProductAPI.getProductTransactions(productId),
		enabled: !!productId,
		staleTime: 60 * 1000,
		retry: smartRetry,
	});
