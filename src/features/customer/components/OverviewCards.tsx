// src/features/customer/dashboard/components/OverviewCards.tsx
import { PiggyBank, Clock, DollarSign, Package, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OverviewCards = () => {
  const navigate = useNavigate();

  // TODO: Replace with real data from Zustand / React Query later
  const totalSaved = 0;
  const pendingPayments = 0;
  const availableBalance = 0;
  const activePackages = 0;

  const isEmpty = totalSaved === 0 && pendingPayments === 0 && availableBalance === 0 && activePackages === 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Saved */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-md flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Total Saved</p>
              <p className="text-xs text-slate-400 mt-1">All contributions combined</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <PiggyBank className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-2xl sm:text-3xl font-semibold text-slate-900">
              ₦{totalSaved.toLocaleString()}
            </p>
            {isEmpty ? (
              <p className="text-slate-400 text-sm mt-1">No savings yet</p>
            ) : (
              <p className="text-emerald-600 text-sm font-medium mt-1">↑ 12.5%</p>
            )}
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-md flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Pending Payments</p>
              <p className="text-xs text-slate-400 mt-1">Awaiting admin approval</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{pendingPayments}</p>
            {isEmpty && <p className="text-slate-400 text-sm mt-1">No pending payments</p>}
          </div>
        </div>

        {/* Available Balance */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-md flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Available Balance</p>
              <p className="text-xs text-slate-400 mt-1">Ready to withdraw</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">
              ₦{availableBalance.toLocaleString()}
            </p>
            {isEmpty && <p className="text-slate-400 text-sm mt-1">Nothing available yet</p>}
          </div>
        </div>

        {/* Active Packages */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/50 shadow-md flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500">Active Packages</p>
              <p className="text-xs text-slate-400 mt-1">Currently contributing to</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-auto pt-6">
            <p className="text-2xl sm:text-3xl font-bold text-slate-900">{activePackages}</p>
            {isEmpty && <p className="text-slate-400 text-sm mt-1">No active packages</p>}
          </div>
        </div>
      </div>

      {/* Global Empty State Message */}
      {isEmpty && (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center mb-5">
            <TrendingUp className="w-9 h-9 text-emerald-600" />
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-2">Get Started with Savings</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            Join Ajo packages, start daily savings, or add products to your cart to see your financial overview here.
          </p>

          <button
            onClick={() => navigate('/browse')}
            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all active:scale-[0.985]"
          >
            Browse Packages & Products
            <Package className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OverviewCards;