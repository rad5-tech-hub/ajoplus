import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as withdrawalAPI from '@/api/withdrawals';

export const useSubmitWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: withdrawalAPI.SubmitWithdrawalRequest) =>
			withdrawalAPI.submitWithdrawal(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['wallet'] });
			qc.invalidateQueries({ queryKey: ['customerWallet'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
		},
	});
};

export const useGetAdminWithdrawals = () =>
	useQuery({
		queryKey: ['admin', 'withdrawals'],
		queryFn: () => withdrawalAPI.getAdminWithdrawals(),
		staleTime: 60 * 1000,
		refetchOnWindowFocus: true,
		retry: false,
	});

export const useApproveWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => withdrawalAPI.approveWithdrawal(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
			qc.invalidateQueries({ queryKey: ['admin', 'overview'] });
		},
	});
};

export const useRejectWithdrawal = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, reason }: { id: string; reason: string }) =>
			withdrawalAPI.rejectWithdrawal(id, { rejectionReason: reason }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ['admin', 'withdrawals'] });
			qc.invalidateQueries({ queryKey: ['wallet'] });
			qc.invalidateQueries({ queryKey: ['customerWallet'] });
			qc.invalidateQueries({ queryKey: ['transactions'] });
			qc.invalidateQueries({ queryKey: ['admin', 'overview'] });
		},
	});
};