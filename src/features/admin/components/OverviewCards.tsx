// src/features/admin/dashboard/components/OverviewCards.tsx
import { Users, DollarSign, AlertCircle, Package } from 'lucide-react';

const cards = [
  {
    label: 'Total Users',
    sub: 'Platform members',
    value: '1,247',
    change: '↑ 15.2%',
    icon: Users,
  },
  {
    label: 'Total Revenue',
    sub: 'All-time earnings',
    value: '₦45,678,900',
    change: '↑ 8.7%',
    icon: DollarSign,
  },
  {
    label: 'Pending Approvals',
    sub: 'Requires action',
    value: '23',
    change: null,
    icon: AlertCircle,
  },
  {
    label: 'Active Packages',
    sub: 'Available for users',
    value: '156',
    change: null,
    icon: Package,
  },
];

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {cards.map(({ label, sub, value, change, icon: Icon }) => (
        <div
          key={label}
          className="bg-white p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border  border-slate-200/50 shadow-md"
        >
          {/* Top row */}
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

          {/* Bottom: value + change */}
          <div className="mt-4 sm:mt-6">
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight truncate">
              {value}
            </p>
            {change && (
              <p className="text-emerald-600 text-xs sm:text-sm font-medium mt-1">{change}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;