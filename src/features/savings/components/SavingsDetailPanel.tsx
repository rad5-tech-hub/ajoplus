import { X } from 'lucide-react';
import { calculateMonthlySummary, daysUntilNextMonth } from '@/features/savings/utils';
import type { SavingsPlan } from '@/features/savings/types';

interface SavingsDetailPanelProps {
  plan: SavingsPlan | null;
  isOpen: boolean;
  onClose: () => void;
}

const SavingsDetailPanel = ({ plan, isOpen, onClose }: SavingsDetailPanelProps) => {
  if (!isOpen || !plan) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-200">
          <h2 className="text-lg font-semibold text-blue-950 truncate">{plan.name}</h2>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-20 px-6 py-6 space-y-6">
          <div className="bg-amber-600 text-white rounded-2xl p-5">
            <p className="text-amber-100 text-xs font-medium">Daily Amount</p>
            <p className="text-2xl font-bold mt-1">₦{plan.dailyAmount.toLocaleString()}</p>
            <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                <p className="text-amber-100 text-xs">Total Saved</p>
                <p className="text-lg font-bold mt-0.5">₦{plan.totalSaved.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-amber-100 text-xs">Balance</p>
                <p className="text-lg font-bold mt-0.5">₦{plan.availableBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
            {[
              { label: 'Days Saved', value: `${plan.daysSaved} days` },
              { label: 'Commission Paid', value: `₦${plan.commission.toLocaleString()}` },
              { label: 'Next Commission', value: `In ${daysUntilNextMonth()} days` },
              { label: 'Monthly Summary', value: `₦${calculateMonthlySummary(plan.dailyAmount).toLocaleString()}/month` },
              { label: 'Days Until Renewal', value: `${plan.daysUntilCommission} days` },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-slate-500">{label}</span>
                <span className="font-medium text-blue-950">{value}</span>
              </div>
            ))}
          </div>

          {plan.description && (
            <div className="bg-white border border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-medium text-blue-950 mb-1">Description</p>
              <p className="text-sm text-slate-600">{plan.description}</p>
            </div>
          )}

          <div className="bg-white border border-amber-200 rounded-2xl p-4">
            <p className="text-sm font-medium text-blue-950 mb-1">Created</p>
            <p className="text-sm text-slate-500">
              {new Date(plan.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SavingsDetailPanel;
