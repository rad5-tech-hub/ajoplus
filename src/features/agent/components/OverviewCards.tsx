// src/features/agent/dashboard/components/OverviewCards.tsx
import { Users, DollarSign, TrendingUp, CheckCircle, Clock, Award, Package, PiggyBank, Receipt } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAgentDashboard } from '@/api/agent';
import { formatCurrency } from '@/lib/currency';

const OverviewCards = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['agentDashboard'],
    queryFn: getAgentDashboard,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const stats = data?.stats ?? {
    totalReferrals: 0,
    totalEarnings: 0,
    commissionPaid: 0,
    pendingEarnings: 0,
    totalCommission: 0,
    packageEarnings: 0,
    savingEarnings: 0,
    earningsPerReferral: 0,
    totalTransactions: 0,
  };

  const cards = [
    { label: 'Total Referrals', sub: "Users you've referred", value: stats.totalReferrals.toLocaleString(), icon: Users },
    { label: 'Total Earnings', sub: 'All-time commission', value: formatCurrency(stats.totalEarnings), icon: DollarSign },
    { label: 'Commission Paid', sub: 'Total commission paid out', value: formatCurrency(stats.commissionPaid), icon: Receipt },
    { label: 'Pending Earnings', sub: 'Awaiting approval', value: formatCurrency(stats.pendingEarnings), icon: Clock },
    { label: 'Total Commission', sub: 'Gross commission earned', value: formatCurrency(stats.totalCommission), icon: Award },
    { label: 'Package Earnings', sub: 'From package referrals', value: formatCurrency(stats.packageEarnings), icon: Package },
    { label: 'Savings Earnings', sub: 'From savings referrals', value: formatCurrency(stats.savingEarnings), icon: PiggyBank },
    { label: 'Earnings Per Referral', sub: 'Average commission', value: formatCurrency(stats.earningsPerReferral), icon: TrendingUp },
    { label: 'Total Transactions', sub: 'Packages bought by referrals', value: stats.totalTransactions.toLocaleString(), icon: CheckCircle },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {cards.map(({ label, sub, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-brand-200/50 shadow-md flex flex-col gap-4"
        >
          {/* Header row */}
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">{label}</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">{sub}</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-brand-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-brand-600" />
            </div>
          </div>

          {/* Value / skeleton */}
          {isLoading ? (
            <div className="h-9 sm:h-10 lg:h-12 w-3/4 bg-slate-200 rounded-xl animate-pulse" />
          ) : (
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-900 leading-none">
              {value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;