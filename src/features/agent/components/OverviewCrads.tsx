// src/features/agent/dashboard/components/OverviewCards.tsx
import { Users, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Referrals */}
      <div className="bg-white p-6 rounded-3xl border  border-slate-200/50 shadow-md">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-slate-500">Total Referrals</p>
            <p className="text-xs text-slate-400">Users you've referred</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-4xl font-bold text-slate-900">12</p>
          <p className="text-emerald-600 text-sm font-medium mt-1">↑ 12.5%</p>
        </div>
      </div>

      {/* Total Earnings */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/50 shadow-md ">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-slate-500">Total Earnings</p>
            <p className="text-xs text-slate-400">All-time commission</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-4xl font-bold text-slate-900">₦48,000</p>
          <p className="text-emerald-600 text-sm font-medium mt-1">↑ 8.3%</p>
        </div>
      </div>

      {/* Earnings Per Referral */}
      <div className="bg-white p-6 rounded-3xl border  border-slate-200/50 shadow-md">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-slate-500">Earnings Per Referral</p>
            <p className="text-xs text-slate-400">Average commission</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-4xl font-bold text-slate-900">₦4,000</p>
        </div>
      </div>

      {/* Total Transactions */}
      <div className="bg-white p-6 rounded-3xl border  border-slate-200/50 shadow-md">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-slate-500">Total Transactions</p>
            <p className="text-xs text-slate-400">Packages bought by referrals</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-6">
          <p className="text-4xl font-bold text-slate-900">9</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;