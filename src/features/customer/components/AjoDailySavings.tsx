import { useState } from 'react';
import { PiggyBank, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDailyAjoStore } from '@/app/store/DailyAjoStore';
import DailyAjoWithdrawModal from '@/components/ui/DailyAjoWithdrawModal';
import { useCustomerWallet } from '@/app/store/CustomerStore';
import { useGetSavingPlans } from '@/app/store/SavingPlanStore';

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

  const { data: wallet } = useCustomerWallet();
  const { data: plans = [] } = useGetSavingPlans();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const navigate = useNavigate();

  const showActiveStateForDev = false;
  const isCurrentlyActive = showActiveStateForDev || isActive;
  const planCount = plans.length;
  const isMultiPlan = planCount > 1;

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
          <p className="text-slate-500 text-sm max-w-65 mx-auto leading-snug">
            Start saving daily and build your emergency fund with just ₦500 per day.
          </p>

          <button
            onClick={onOpenDailyModal}
            className="cursor-pointer mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.985]"
          >
            Start Saving Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-emerald-600 text-white rounded-3xl p-5 w-full">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-emerald-200 text-xs font-medium">Ajo Daily Savings</p>
            {isMultiPlan && (
              <p className="text-emerald-300 text-xs mt-0.5">{planCount} active plans</p>
            )}
          </div>
          <span className="text-2xl">🐷</span>
        </div>

        <div className="mb-4">
          <p className="text-emerald-100 text-xs font-medium">
            {isMultiPlan ? 'Total Daily Amount' : 'Daily Amount'}
          </p>
          <p className="text-2xl font-bold mt-0.5">₦{(wallet?.dailyAmount ?? dailyAmount).toLocaleString()}</p>
        </div>

        <div className="bg-emerald-50/20 border border-emerald-100/30 py-3 px-4 rounded-2xl mb-3">
          <div className="space-y-2.5">
            <div>
              <p className="text-emerald-100 text-xs">Total Saved</p>
              <p className="text-base font-semibold text-white">₦{(wallet?.totalSaved ?? totalSaved).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-emerald-100 text-xs">Commission Paid (5%)</p>
              <p className="text-base font-semibold text-red-300">-₦{(wallet?.commissionPaid ?? commissionPaid).toLocaleString()}</p>
            </div>
            <div className="pt-2 border-t border-emerald-100/40">
              <p className="text-emerald-100 text-xs">Available Balance</p>
              <p className="text-lg font-bold text-white">₦{(wallet?.availableBalance ?? availableBalance).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50/20 border border-emerald-100/30 py-3 px-4 rounded-2xl mb-4">
          <div className="space-y-2.5">
            <div>
              <p className="text-emerald-100 text-xs">You've saved for</p>
              <p className="text-sm font-medium text-white">{wallet?.daysSaved ?? daysSaved} days</p>
            </div>
            <div>
              <p className="text-emerald-100 text-xs">Next commission deduction</p>
              <p className="text-sm font-medium text-white">In 30 days</p>
            </div>
            <div>
              <p className="text-emerald-100 text-xs">Monthly summary</p>
              <p className="text-sm font-medium text-white">₦{((wallet?.dailyAmount ?? dailyAmount) * 30).toLocaleString()}/month</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="w-full cursor-pointer bg-white text-emerald-700 font-semibold py-3 rounded-2xl hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-sm"
          >
            Withdraw Balance
          </button>
          <button
            onClick={() => navigate('/dashboard/customer/payment/saving', {
              state: {
                isSavingPayment: true,
                total: wallet?.dailyAmount ?? dailyAmount,
              },
            })}
            className="w-full cursor-pointer bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 rounded-2xl transition-all text-sm"
          >
            Add to Savings
          </button>
          <button
            onClick={() => navigate('/dashboard/customer/savings')}
            className="w-full cursor-pointer bg-white/10 hover:bg-white/20 border border-white/30 text-white/70 hover:text-white font-semibold py-2.5 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            Manage Savings Plans
          </button>
        </div>
      </div>

      <DailyAjoWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={wallet?.availableBalance ?? availableBalance}
      />
    </>
  );
};

export default AjoDailySavings;