// src/features/customer/dashboard/components/AjoDailySavings.tsx
import { useState } from 'react';
import { PiggyBank } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDailyAjoStore } from '@/app/store/DailyAjoStore';
import DailyAjoWithdrawModal from '@/components/ui/DailyAjoWithdrawModal';

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

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const navigate = useNavigate();

  const showActiveStateForDev = false;
  const isCurrentlyActive = showActiveStateForDev || isActive;

  // Empty State
  if (!isCurrentlyActive) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-emerald-600 text-sm font-medium">Ajo Daily Savings</p>
          <span className="text-2xl">🐷</span>
        </div>

        <div className="text-center py-5">
          <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
            <PiggyBank className="w-7 h-7 text-emerald-600" />
          </div>

          <h3 className="font-semibold text-slate-900 text-base mb-1">No Active Daily Ajo Yet</h3>
          <p className="text-slate-500 text-sm max-w-[260px] mx-auto leading-snug">
            Start saving daily and build your emergency fund with just ₦500 per day.
          </p>

          <button
            onClick={onOpenDailyModal}
            className="cursor-pointer mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.985]"
          >
            Start Saving Now
          </button>
        </div>

        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-3 border-t border-slate-200 text-center">
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Switch to Active State (Dev)
            </button>
          </div>
        )} */}
      </div>
    );
  }

  // Active Daily Ajo Card
  return (
    <>
      <div className="bg-emerald-600 text-white rounded-3xl p-5 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-emerald-200 text-xs font-medium">Ajo Daily Savings</p>
          <span className="text-2xl">🐷</span>
        </div>

        {/* Daily Amount */}
        <div className="mb-4">
          <p className="text-emerald-100 text-xs font-medium">Daily Amount</p>
          <p className="text-2xl font-bold mt-0.5">₦{dailyAmount.toLocaleString()}</p>
        </div>

        {/* First Info Box */}
        <div className="bg-emerald-50/20 border border-emerald-100/30 py-3 px-4 rounded-2xl mb-3">
          <div className="space-y-2.5">
            <div>
              <p className="text-emerald-100 text-xs">Total Saved</p>
              <p className="text-base font-semibold text-white">₦{totalSaved.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-xs">Commission Paid (5%)</p>
              <p className="text-base font-semibold text-red-300">-₦{commissionPaid.toLocaleString()}</p>
            </div>
            <div className="pt-2 border-t border-emerald-100/40">
              <p className="text-emerald-100 text-xs">Available Balance</p>
              <p className="text-lg font-bold text-white">₦{availableBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Second Info Box */}
        <div className="bg-emerald-50/20 border border-emerald-100/30 py-3 px-4 rounded-2xl mb-4">
          <div className="space-y-2.5">
            <div>
              <p className="text-emerald-100 text-xs">You've saved for</p>
              <p className="text-sm font-medium text-white">{daysSaved} days</p>
            </div>
            <div>
              <p className="text-emerald-100 text-xs">Next commission deduction</p>
              <p className="text-sm font-medium text-white">In 30 days</p>
            </div>
            <div>
              <p className="text-emerald-100 text-xs">Monthly summary</p>
              <p className="text-sm font-medium text-white">₦{(dailyAmount * 30).toLocaleString()}/month</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="w-full cursor-pointer bg-white text-emerald-700 font-semibold py-3 rounded-2xl hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-sm"
          >
            Withdraw Balance
          </button>
          <button
            onClick={() => navigate('/dashboard/customer/payment/')}
            className="w-full cursor-pointer bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 rounded-2xl transition-all text-sm"
          >
            Add to Savings
          </button>
        </div>

        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-3 border-t border-white/20 text-center">
            <button
              onClick={() => {
                useDailyAjoStore.getState().resetDailyAjo();
                window.location.reload();
              }}
              className="text-xs text-emerald-200 hover:text-white underline"
            >
              Switch to Empty State (Dev)
            </button>
          </div>
        )} */}
      </div>

      {/* Withdraw Modal */}
      <DailyAjoWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </>
  );
};

export default AjoDailySavings;