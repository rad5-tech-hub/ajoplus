// src/features/agent/dashboard/components/AgentDownlines.tsx
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { getAgentDashboard, fetchAgentDownline, type AgentDownlineCustomer } from '@/api/agent';

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  inactive: 'bg-slate-100 text-slate-500',
  suspended: 'bg-red-100 text-red-600',
};

const CustomerCard = ({ customer }: { customer: AgentDownlineCustomer }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200 p-4">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm shrink-0">
          {getInitials(customer.fullName)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm truncate">{customer.fullName}</p>
          <p className="text-xs text-slate-400 truncate">{customer.email}</p>
          {customer.phoneNumber && (
            <p className="text-xs text-slate-400 truncate mt-0.5">{customer.phoneNumber}</p>
          )}
        </div>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize shrink-0 ${statusStyles[customer.accountStatus] || 'bg-slate-100 text-slate-500'}`}>
        {customer.accountStatus}
      </span>
    </div>

    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
      <p className="text-xs text-slate-500">
        <span className="font-medium text-slate-600">Bank:</span>{' '}
        {customer.bankName && customer.accountNumber
          ? `${customer.bankName} — ${customer.accountNumber}`
          : <span className="italic text-slate-400">—</span>}
      </p>
      <p className="text-xs text-slate-500">
        <span className="font-medium text-slate-600">Joined:</span>{' '}
        {formatDate(customer.createdAt)}
      </p>
    </div>
  </div>
);

const AgentDownlines = () => {
  const { data: dashboard } = useQuery({
    queryKey: ['agentDashboard'],
    queryFn: getAgentDashboard,
    staleTime: 5 * 60 * 1000,
  });

  const referralCode = dashboard?.referral?.code;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['agentDownline', referralCode],
    queryFn: () => fetchAgentDownline(referralCode!),
    enabled: !!referralCode,
    staleTime: 60_000,
  });

  const totalCustomers = data?.totalCustomers ?? 0;
  const customers = data?.customers ?? [];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-5 sm:mb-6 lg:mb-8">
        <div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-blue-950">My Downlines</h3>
          {!isLoading && !isError && (
            <p className="text-slate-500 text-sm mt-1">
              {totalCustomers} customer{totalCustomers !== 1 ? 's' : ''} referred
            </p>
          )}
        </div>
        {!isLoading && !isError && (
          <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full shrink-0">
            {totalCustomers}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-100 animate-pulse rounded-2xl h-32" />
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center">
          <p className="text-red-600 font-semibold mb-3">Failed to load downlines.</p>
          <button onClick={() => refetch()} className="px-5 py-2 rounded-2xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors cursor-pointer">
            Retry
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Users className="w-12 h-12 text-amber-300 mb-3" />
          <p className="text-slate-500 font-medium">No downlines yet</p>
          <p className="text-slate-400 text-sm mt-1 max-w-xs">
            Customers who sign up with your referral code will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentDownlines;
