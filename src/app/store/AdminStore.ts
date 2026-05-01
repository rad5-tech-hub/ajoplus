import { useQuery } from '@tanstack/react-query';
import { fetchAdminOverview } from '@/api/admin';

export function useAdminOverview() {
	return useQuery({
		queryKey: ['admin', 'overview'],
		queryFn: fetchAdminOverview,
		staleTime: 2 * 60 * 1000,
		refetchOnWindowFocus: true,
	});
}