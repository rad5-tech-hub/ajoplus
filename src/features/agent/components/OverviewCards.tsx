// src/features/agent/dashboard/components/OverviewCards.tsx
import { Users, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

const cards = [
  {
    label: 'Total Referrals',
    sub: "Users you've referred",
    value: '12',
    trend: '↑ 12.5%',
    icon: Users,
  },
  {
    label: 'Total Earnings',
    sub: 'All-time commission',
    value: '₦48,000',
    trend: '↑ 8.3%',
    icon: DollarSign,
  },
  {
    label: 'Earnings Per Referral',
    sub: 'Average commission',
    value: '₦4,000',
    trend: null,
    icon: TrendingUp,
  },
  {
    label: 'Total Transactions',
    sub: 'Packages bought by referrals',
    value: '9',
    trend: null,
    icon: CheckCircle,
  },
];

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {cards.map(({ label, sub, value, trend, icon: Icon }) => (
        <div
          key={label}
          className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border border-slate-200/50 shadow-md flex flex-col gap-4"
        >
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">{label}</p>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">{sub}</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-emerald-600" />
            </div>
          </div>

          <div>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-none">
              {value}
            </p>
            {trend && (
              <p className="text-emerald-600 text-xs sm:text-sm font-medium mt-1.5">{trend}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;