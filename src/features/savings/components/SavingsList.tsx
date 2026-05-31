import { useState, useMemo } from 'react';
import { PiggyBank, Search } from 'lucide-react';
import SavingsCard from './SavingsCard';
import type { SavingsPlan } from '../types';

interface SavingsListProps {
  plans: SavingsPlan[];
  isLoading: boolean;
  onSetupClick: () => void;
  onWithdraw: (planId: string) => void;
}

const SavingsList = ({ plans, isLoading, onSetupClick, onWithdraw }: SavingsListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return plans;
    return plans.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    );
  }, [plans, searchQuery]);
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-brand-200 rounded-3xl p-5 shadow-sm animate-pulse">
          <div className="h-48 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="bg-white border border-brand-200 rounded-3xl p-6 shadow-sm">
        <div className="text-center py-6">
          <div className="mx-auto w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-4">
            <PiggyBank className="w-7 h-7 text-brand-600" />
          </div>
          <h3 className="font-semibold text-brand-900 text-base mb-1">No Active Savings Plans</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-snug mb-5">
            Start saving daily and build your emergency fund with just ₦500 per day.
          </p>
          <button
            onClick={onSetupClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-2xl text-sm transition-all active:scale-[0.985] cursor-pointer"
          >
            <PiggyBank className="w-4 h-4" />
            Start Saving Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Search Bar ── */}
      {plans.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by plan name or status..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
          />
        </div>
      )}
      {filteredPlans.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center">
          <p className="text-slate-400 font-medium text-sm">No savings plans match your search.</p>
        </div>
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlans.map((plan) => (
          <SavingsCard key={plan.id} plan={plan} onWithdraw={onWithdraw} />
        ))}
      </div>
      )}
    </div>
  );
};

export default SavingsList;
