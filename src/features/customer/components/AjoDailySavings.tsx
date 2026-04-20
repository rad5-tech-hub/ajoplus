// src/features/customer/dashboard/components/AjoDailySavings.tsx
import { PiggyBank, } from 'lucide-react';
import { useDailyAjoStore } from '@/app/store/DailyAjoStore';

interface AjoDailySavingsProps {
  onOpenDailyModal: () => void;
}

const AjoDailySavings = ({ onOpenDailyModal }: AjoDailySavingsProps) => {
  const {
    isActive,
    dailyAmount,
    totalSaved,
    commissionPaid,
    availableBalance,
    daysSaved,
  } = useDailyAjoStore();

  // === DEVELOPMENT TOGGLE ===
  // Set this to `true`  → shows Active Card
  // Set this to `false` → shows Empty State
  const showActiveStateForDev = false;   // ← Change this while developing

  // Use real state OR dev override
  const isCurrentlyActive = showActiveStateForDev || isActive;

  // Empty State
  if (!isCurrentlyActive) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-600 text-sm font-medium">Ajo Daily Savings</p>
          </div>
          <div className="text-3xl">🐷</div>
        </div>

        <div className="text-center py-10">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
            <PiggyBank className="w-9 h-9 text-emerald-600" />
          </div>

          <h3 className="font-semibold text-slate-900 text-xl mb-2">No Active Daily Ajo Yet</h3>
          <p className="text-slate-600 max-w-65 mx-auto leading-relaxed">
            Start saving daily and build your emergency fund with just ₦500 per day.
          </p>

          <button
            onClick={onOpenDailyModal}
            className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.985]"
          >
            Start Saving Now
          </button>
        </div>

        {/* Dev Helper - Visible only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Switch to Active State (Dev)
            </button>
          </div>
        )}
      </div>
    );
  }

  // Active Daily Ajo Card
  return (
    <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-emerald-200 text-sm font-medium">Ajo Daily Savings</p>
        </div>
        <div className="text-3xl sm:text-4xl">🐷</div>
      </div>

      {/* Daily Amount */}
      <div className="mb-8">
        <p className="text-emerald-100 text-sm font-medium">Daily Amount</p>
        <p className="text-3xl sm:text-4xl font-bold mt-1">₦{dailyAmount.toLocaleString()}</p>
      </div>

      {/* First Info Box */}
      <div className="bg-emerald-50/20 border border-emerald-100/30 py-5 px-4 sm:px-6 rounded-2xl flex flex-col sm:flex-row justify-between gap-6 mb-8">
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-emerald-100 text-sm">Total Saved</p>
            <p className="text-lg sm:text-xl font-semibold text-white">₦{totalSaved.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Commission Paid (5%)</p>
            <p className="text-lg sm:text-xl font-semibold text-red-300">-₦{commissionPaid.toLocaleString()}</p>
          </div>
          <div className="pt-3 border-t border-emerald-100/40">
            <p className="text-emerald-100 text-sm">Available Balance</p>
            <p className="text-xl sm:text-2xl font-bold text-white">₦{availableBalance.toLocaleString()}</p>
          </div>
        </div>

        <div className="hidden sm:block w-px bg-emerald-100/30 self-stretch" />
      </div>

      {/* Second Info Box */}
      <div className="bg-emerald-50/20 border border-emerald-100/30 py-5 px-4 sm:px-6 rounded-2xl flex flex-col sm:flex-row justify-between gap-6 mb-10">
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-emerald-100 text-sm">You've saved for</p>
            <p className="text-lg font-medium text-white">{daysSaved} days</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Next commission deduction</p>
            <p className="text-lg font-medium text-white">In 30 days</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Monthly summary</p>
            <p className="text-lg font-medium text-white">₦{(dailyAmount * 30).toLocaleString()}/month</p>
          </div>
        </div>

        <div className="hidden sm:block w-px bg-emerald-100/30 self-stretch" />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="flex-1 bg-white text-emerald-700 font-semibold py-4 rounded-2xl hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-base sm:text-lg">
          Withdraw Balance
        </button>

        <button
          className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-4 rounded-2xl transition-all text-base sm:text-lg"
        >
          Add to Savings
        </button>
      </div>

      {/* Dev Helper */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 pt-4 border-t border-white/20 text-center">
          <button
            onClick={() => {
              // Reset to empty state for testing
              useDailyAjoStore.getState().resetDailyAjo();
              window.location.reload();
            }}
            className="text-xs text-emerald-200 hover:text-white underline"
          >
            Switch to Empty State (Dev)
          </button>
        </div>
      )}
    </div>
  );
};

export default AjoDailySavings;