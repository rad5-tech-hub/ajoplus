// src/features/customer/dashboard/components/OverviewCards.tsx
import { PiggyBank, Clock, DollarSign, Package } from 'lucide-react';

const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Total Saved */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-md flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500">Total Saved</p>
            <p className="text-xs text-slate-400 mt-1">All contributions combined</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <PiggyBank className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-auto pt-6">
          <p className="text-2xl sm:text-3xl font-semibold text-slate-900">₦572,500</p>
          <p className="text-emerald-600 text-sm font-medium mt-1">↑ 12.5%</p>
        </div>
      </div>

      {/* Pending Payments */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-md flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500">Pending Payments</p>
            <p className="text-xs text-slate-400 mt-1">Awaiting admin approval</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-auto pt-6">
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">1</p>
        </div>
      </div>

      {/* Available Balance */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-md flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500">Available Balance</p>
            <p className="text-xs text-slate-400 mt-1">Ready to withdraw</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-auto pt-6">
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">₦71,250</p>
        </div>
      </div>

      {/* Active Packages */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-md flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-slate-500">Active Packages</p>
            <p className="text-xs text-slate-400 mt-1">Currently contributing to</p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        <div className="mt-auto pt-6">
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">2</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;