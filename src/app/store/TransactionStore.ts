import { useQuery } from '@tanstack/react-query';
import * as transactionAPI from '@/api/transactions';
import { APIError } from '@/api/client';

const smartRetry = (failureCount: number, error: unknown): boolean => {
	if (error instanceof APIError) return false;
	return failureCount < 2;
};

export const useGetTransactions = () =>
	useQuery({
		queryKey: ['transactions'],
		queryFn: transactionAPI.getTransactions,
		staleTime: 2 * 60 * 1000,
		gcTime: 5 * 60 * 1000,
		refetchOnWindowFocus: true,
		retry: smartRetry,
	});