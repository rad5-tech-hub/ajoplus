import { PiggyBank } from 'lucide-react';
import SavingsCard from './SavingsCard';
import type { SavingsPlan } from '../types';

interface SavingsListProps {
  plans: SavingsPlan[];
  isLoading: boolean;
  onSetupClick: () => void;
  onWithdraw: (planId: string) => void;
}

const SavingsList = ({ plans, isLoading, onSetupClick, onWithdraw }: SavingsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm animate-pulse">
          <div className="h-48 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="text-center py-6">
          <div className="mx-auto w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
            <PiggyBank className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-slate-900 text-base mb-1">No Active Savings Plans</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-snug mb-5">
            Start saving daily and build your emergency fund with just ₦500 per day.
          </p>
          <button
            onClick={onSetupClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl text-sm transition-all active:scale-[0.985]"
          >
            <PiggyBank className="w-4 h-4" />
            Start Saving Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {plans.map((plan) => (
        <SavingsCard key={plan.id} plan={plan} onWithdraw={onWithdraw} />
      ))}
    </div>
  );
};

export default SavingsList;
