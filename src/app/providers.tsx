import { QueryClient } from '@tanstack/react-query';
import { APIError } from '@/api/client';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Don't retry permanent errors — 401/403/404 will never resolve on retry
			retry: (failureCount, error) => {
				if (error instanceof APIError && [400, 401, 403, 404, 422].includes(error.status)) {
					return false;
				}
				return failureCount < 2;
			},
			staleTime: 5 * 60 * 1000,
			gcTime: 30 * 60 * 1000,
		},
	},
});