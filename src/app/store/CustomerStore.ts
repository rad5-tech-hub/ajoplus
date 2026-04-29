import { useQuery } from '@tanstack/react-query';
import * as customerAPI from '@/api/customer';

export const useCustomerDashboard = () => {
  return useQuery({
    queryKey: ['customerDashboard'],
    queryFn: customerAPI.getCustomerDashboard,
    staleTime: 60 * 1000, // 1 minute
    retry: 2,
  });
};

export const useCustomerWallet = () => {
  return useQuery({
    queryKey: ['customerWallet'],
    queryFn: customerAPI.getCustomerWallet,
    staleTime: 30 * 1000,
    retry: 2,
  });
};

export default { useCustomerDashboard, useCustomerWallet };
