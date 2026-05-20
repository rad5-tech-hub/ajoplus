import { useQuery } from '@tanstack/react-query';
import { fetchAdminOverview } from '@/api/admin';
import { getAdminUsers } from '@/api/adminUsers';

export function useAdminOverview() {
	return useQuery({
		queryKey: ['admin', 'overview'],
		queryFn: fetchAdminOverview,
		staleTime: 2 * 60 * 1000,
		refetchOnWindowFocus: true,
	});
}

export function useAdminUsers(page = 1, limit = 10) {
	return useQuery({
		queryKey: ['admin', 'users', page, limit],
		queryFn: () => getAdminUsers(page, limit),
		staleTime: 60 * 1000,
		refetchOnWindowFocus: true,
	});
}