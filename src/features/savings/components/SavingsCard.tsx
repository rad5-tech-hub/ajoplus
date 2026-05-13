import { memo } from 'react';
import { PiggyBank } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateMonthlySummary, daysUntilNextMonth } from '../utils';
import type { SavingsPlan } from '../types';

interface SavingsCardProps {
  plan: SavingsPlan;
  onWithdraw: (planId: string) => void;
}

const SavingsCard = memo(({ plan, onWithdraw }: SavingsCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-emerald-600 text-white rounded-3xl p-5 w-full shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <PiggyBank className="w-4 h-4 text-white" />
          </div>
          <p className="text-emerald-200 text-xs font-medium truncate max-w-[180px]">{plan.name}</p>
        </div>
        <span className="text-xl shrink-0">🐷</span>
      </div>

      <div className="mb-4">
        <p className="text-emerald-100 text-xs font-medium">Daily Amount</p>
        <p className="text-2xl font-bold mt-0.5">₦{plan.dailyAmount.toLocaleString()}</p>
      </div>

      <div className="bg-white/10 border border-white/20 py-3 px-4 rounded-2xl mb-3">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <p className="text-emerald-100 text-xs">Total Saved</p>
            <p className="text-sm font-semibold text-white">₦{plan.totalSaved.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-emerald-100 text-xs">Commission (5%)</p>
            <p className="text-sm font-semibold text-red-300">-₦{plan.commission.toLocaleString()}</p>
          </div>
          <div className="pt-2 border-t border-white/20 flex justify-between items-center">
            <p className="text-emerald-100 text-xs">Available Balance</p>
            <p className="text-base font-bold text-white">₦{plan.availableBalance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 border border-white/20 py-3 px-4 rounded-2xl mb-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-emerald-100 text-xs">Days saved</p>
            <p className="text-sm font-medium text-white">{plan.daysSaved} days</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-emerald-100 text-xs">Next commission</p>
            <p className="text-sm font-medium text-white">In {daysUntilNextMonth()} days</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-emerald-100 text-xs">Monthly summary</p>
            <p className="text-sm font-medium text-white">₦{calculateMonthlySummary(plan.dailyAmount).toLocaleString()}/month</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => onWithdraw(plan.id)}
          className="w-full cursor-pointer bg-white text-emerald-700 font-semibold py-3 rounded-2xl hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-sm"
        >
          Withdraw Balance
        </button>
        <button
          onClick={() => navigate('/dashboard/customer/payment/saving', {
            state: { isSavingPayment: true, savingsId: plan.id, total: plan.dailyAmount },
          })}
          className="w-full cursor-pointer bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 rounded-2xl transition-all text-sm"
        >
          Add to Savings
        </button>
      </div>
    </div>
  );
});

SavingsCard.displayName = 'SavingsCard';

export default SavingsCard;
