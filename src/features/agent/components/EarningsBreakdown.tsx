// src/features/agent/dashboard/components/EarningsBreakdown.tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
import { getAgentDashboard } from '@/api/agent';
import DailyAjoWithdrawModal from '@/components/ui/DailyAjoWithdrawModal';

/* ── Skeleton bar ── */
const SkeletonBar = () => (
  <div className="animate-pulse">
    <div className="flex justify-between mb-2">
      <div className="h-3.5 w-20 bg-slate-200 rounded-full" />
      <div className="h-3.5 w-16 bg-slate-200 rounded-full" />
    </div>
    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="h-full w-1/2 bg-slate-200 rounded-full" />
    </div>
  </div>
);

/* ── Empty state (no earnings yet) ── */
const EmptyEarnings = () => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
      <TrendingUp className="w-7 h-7 text-emerald-400" />
    </div>
    <p className="font-semibold text-slate-800 text-sm mb-1">No earnings yet</p>
    <p className="text-xs text-slate-400 max-w-55 leading-relaxed">
      Start referring customers and your earnings will appear here.
    </p>
  </div>
);

const EarningsBreakdown = () => {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['agentDashboard'],
    queryFn: getAgentDashboard,
    staleTime: 5 * 60 * 500,
  });

  const breakdown = data?.earningsBreakdown ?? { thisMonth: 0, lastMonth: 0 };
  const totalEarnings = data?.stats.totalEarnings ?? 0;
  const hasEarnings = totalEarnings > 0;

  // Scale bars relative to all-time max so they're always proportional
  const max = Math.max(breakdown.thisMonth, breakdown.lastMonth, totalEarnings, 1);
  const bars = [
    { label: 'This Month', amount: breakdown.thisMonth, pct: (breakdown.thisMonth / max) * 100 },
    { label: 'Last Month', amount: breakdown.lastMonth, pct: (breakdown.lastMonth / max) * 100 },
    { label: 'All Time', amount: totalEarnings, pct: 100 },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-6">
        Earnings Breakdown
      </h3>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => <SkeletonBar key={i} />)}
        </div>
      ) : !hasEarnings ? (
        <EmptyEarnings />
      ) : (
        <div className="space-y-6">
          {bars.map(({ label, amount, pct }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500">{label}</span>
                <span className="font-semibold text-slate-900">
                  ₦{amount.toLocaleString()}
                </span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsWithdrawOpen(true)}
        disabled={isLoading || !hasEarnings}
        className="w-full mt-10 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none text-white font-semibold py-4 rounded-2xl text-base transition-all"
      >
        Request Withdrawal
      </button>

      <DailyAjoWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </div>
  );
};

export default EarningsBreakdown;