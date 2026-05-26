// src/features/customer/dashboard/components/OverviewCards.tsx
import { PiggyBank, Clock, Coins, Package } from 'lucide-react';
import { useCustomerDashboard } from '@/app/store/CustomerStore';
import { formatCurrency } from '@/lib/currency';

const OverviewCards = () => {
  const { data, isLoading } = useCustomerDashboard();

  const summary = data?.summary;
  const totalSaved = summary?.totalSaved ?? 0;
  const pendingPayments = summary?.pendingPayments ?? 0;
  const availableBalance = summary?.availableBalance ?? 0;
  const activePackages = summary?.activePackages ?? 0;

  const isEmpty = !isLoading && totalSaved === 0 && pendingPayments === 0 && availableBalance === 0 && activePackages === 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Saved */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-200/50 shadow-md flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Total Saved</p>
              <p className="text-xs text-slate-400 mt-1">All contributions combined</p>
            </div>
            <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center shrink-0">
              <PiggyBank className="w-5 h-5 text-brand-600" />
            </div>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-2xl sm:text-3xl font-semibold text-brand-900">
              {formatCurrency(totalSaved)}
            </p>
            {isEmpty ? (
              <p className="text-slate-400 text-sm mt-1">No savings yet</p>
            ) : (
              <p className="text-brand-600 text-sm font-medium mt-1">↑ 12.5%</p>
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-200/50 shadow-md flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Pending Payments</p>
              <p className="text-xs text-slate-400 mt-1">Awaiting admin approval</p>
            </div>
            <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-brand-600" />
            </div>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-2xl sm:text-3xl font-bold text-brand-900">{pendingPayments}</p>
            {isEmpty && <p className="text-slate-400 text-sm mt-1">No pending payments</p>}
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-200/50 shadow-md flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Available Balance</p>
              <p className="text-xs text-slate-400 mt-1">Ready to withdraw</p>
            </div>
            <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5 text-brand-600" />
            </div>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-2xl sm:text-3xl font-bold text-brand-900">
              {formatCurrency(availableBalance)}
            </p>
            {isEmpty && <p className="text-slate-400 text-sm mt-1">Nothing available yet</p>}
          </div>
        </div>

        {/* Active Packages */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-brand-200/50 shadow-md flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Active Packages</p>
              <p className="text-xs text-slate-400 mt-1">Currently contributing to</p>
            </div>
            <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-brand-600" />
            </div>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-2xl sm:text-3xl font-bold text-brand-900">{activePackages}</p>
            {isEmpty && <p className="text-slate-400 text-sm mt-1">No active packages</p>}
          </div>
        </div>
      </div>


    </div>
  );
};

export default OverviewCards;