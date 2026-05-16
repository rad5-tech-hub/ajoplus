import { useNavigate } from 'react-router-dom';
import { PiggyBank, Settings } from 'lucide-react';
import { useGetSavingPlans } from '@/app/store/SavingPlanStore';

interface AjoDailySavingsProps {
  onOpenDailyModal: () => void;
}

const AjoDailySavings = ({ onOpenDailyModal }: AjoDailySavingsProps) => {
  const navigate = useNavigate();
  const { data: plans = [] } = useGetSavingPlans();

  const hasPlans = plans.length > 0;

  if (!hasPlans) {
    return (
      <div className="bg-white border border-amber-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-amber-600 text-sm font-medium">Ajo Daily Savings</p>
          <span className="text-2xl">🐷</span>
        </div>
        <div className="text-center py-5">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-3">
            <PiggyBank className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="font-semibold text-blue-950 text-base mb-1">No Active Daily Ajo Yet</h3>
          <p className="text-slate-500 text-sm max-w-65 mx-auto leading-snug">
            Start saving daily and build your emergency fund with just ₦500 per day.
          </p>
          <button
            onClick={onOpenDailyModal}
            className="cursor-pointer mt-5 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.985]"
          >
            Start Saving Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-amber-200 rounded-3xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-amber-600 text-sm font-medium">Ajo Daily Savings</p>
        <span className="text-2xl">🐷</span>
      </div>
      <div className="text-center py-4">
        <div className="mx-auto w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-3">
          <PiggyBank className="w-7 h-7 text-amber-600" />
        </div>
        <p className="text-sm text-slate-500 mb-4">
          {plans.length} saving plan{plans.length !== 1 ? 's' : ''} active
        </p>
        <button
          onClick={() => navigate('/dashboard/customer/savings')}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-2xl text-sm transition-all active:scale-[0.985] cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          Manage Saving Plans
        </button>
      </div>
    </div>
  );
};

export default AjoDailySavings;
