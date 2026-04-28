// src/features/admin/components/OverviewCards.tsx
import { Users, DollarSign, AlertCircle, Package } from 'lucide-react';
import { useAdminOverview } from '@/app/store/AdminStore';
import type { LucideIcon } from 'lucide-react';

interface CardConfig {
  label: string;
  sub: string;
  value: string;
  change: string | null;
  icon: LucideIcon;
}

function buildCards(data: {
  totalUsers: number;
  totalRevenue: number;
  pendingApprovals: number;
  activePackages: number;
  userGrowthPercent: number;
  revenueGrowthPercent: number;
}): CardConfig[] {
  return [
    {
      label: 'Total Users',
      sub: 'Platform members',
      value: data.totalUsers.toLocaleString(),
      change: data.userGrowthPercent > 0 ? `↑ ${data.userGrowthPercent}%` : null,
      icon: Users,
    },
    {
      label: 'Total Revenue',
      sub: 'All-time earnings',
      value: `₦${data.totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`,
      change: data.revenueGrowthPercent > 0 ? `↑ ${data.revenueGrowthPercent}%` : null,
      icon: DollarSign,
    },
    {
      label: 'Pending Approvals',
      sub: 'Requires action',
      value: data.pendingApprovals.toLocaleString(),
      change: null,
      icon: AlertCircle,
    },
    {
      label: 'Active Packages',
      sub: 'Available for users',
      value: data.activePackages.toLocaleString(),
      change: null,
      icon: Package,
    },
  ];
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/50 shadow-md animate-pulse">
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-2 flex-1">
          <div className="h-3 bg-slate-200 rounded-full w-2/3" />
          <div className="h-2.5 bg-slate-100 rounded-full w-1/2 hidden sm:block" />
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 rounded-xl sm:rounded-2xl shrink-0" />
      </div>
      <div className="mt-4 sm:mt-6 space-y-2">
        <div className="h-7 bg-slate-200 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function StatCard({ label, sub, value, change, icon: Icon }: CardConfig) {
  return (
    <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/50 shadow-md">
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-snug truncate">
            {label}
          </p>
          <p className="text-xs text-slate-400 hidden sm:block">{sub}</p>
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
        </div>
      </div>
      <div className="mt-4 sm:mt-6">
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight truncate">
          {value}
        </p>
        {change && (
          <p className="text-emerald-600 text-xs sm:text-sm font-medium mt-1">{change}</p>
        )}
      </div>
    </div>
  );
}

// ─── Overview Cards ───────────────────────────────────────────────────────────

const OverviewCards = () => {
  const { data, isLoading, error, refetch } = useAdminOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-6 text-center">
        <p className="text-red-600 text-sm mb-3">Failed to load overview stats</p>
        <button
          onClick={() => refetch()}
          className="text-sm text-red-600 underline hover:text-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {buildCards(data).map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
};

export default OverviewCards;