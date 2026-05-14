import { useMemo, useState } from 'react';
import { useSavingsPlans } from '../hooks/useSavings';
import SavingsList from './SavingsList';
import SavingsSetupButton from './SavingsSetupButton';
import DailyAjoWithdrawModal from '@/components/ui/DailyAjoWithdrawModal';

interface SavingsOverviewProps {
  onOpenSetupModal: () => void;
}

const SavingsOverview = ({ onOpenSetupModal }: SavingsOverviewProps) => {
  const { data: plans, isLoading, isError, error, refetch } = useSavingsPlans();
  const [withdrawPlanId, setWithdrawPlanId] = useState<string | null>(null);

  const currentPlan = useMemo(
    () => plans?.find((p) => p.id === withdrawPlanId),
    [plans, withdrawPlanId]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-950">Savings Plans</h2>
        <SavingsSetupButton onClick={onOpenSetupModal} />
      </div>

      {isError && !isLoading && (
        <div className="rounded-3xl bg-white border border-red-200 p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">Failed to load savings plans.</p>
          <p className="text-slate-500 text-sm mb-4">{error instanceof Error ? error.message : 'Please try again.'}</p>
          <button
            onClick={() => refetch()}
            className="px-5 py-2 rounded-2xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!isError && (
        <SavingsList
          plans={plans ?? []}
          isLoading={isLoading}
          onSetupClick={onOpenSetupModal}
          onWithdraw={setWithdrawPlanId}
        />
      )}

      <DailyAjoWithdrawModal
        isOpen={withdrawPlanId !== null}
        onClose={() => setWithdrawPlanId(null)}
        availableBalance={currentPlan?.availableBalance ?? 0}
      />
    </div>
  );
};

export default SavingsOverview;
