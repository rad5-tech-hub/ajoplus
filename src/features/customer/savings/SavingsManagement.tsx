import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PiggyBank, ArrowLeft, Search } from 'lucide-react';
import { useCreateSavingPlan } from '@/app/store/SavingPlanStore';
import { useSavingsPlans } from '@/features/savings/hooks/useSavings';
import { formatCurrency } from '@/lib/currency';
import DailyAjoWithdrawModal from '@/components/ui/DailyAjoWithdrawModal';
import SavingsDetailPanel from '@/features/savings/components/SavingsDetailPanel';

const SavingsManagement = () => {
  const navigate = useNavigate();
  const { data: plans = [], isLoading } = useSavingsPlans();
  const [showCreate, setShowCreate] = useState(false);
  const [withdrawPlanId, setWithdrawPlanId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return plans;
    return plans.filter((p: { name: string; status: string }) =>
      p.name.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q)
    );
  }, [plans, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-3xl border border-slate-100 p-6 animate-pulse h-36" />
          ))}
        </div>
      </div>
    );
  }

  const selectedPlan = plans.find((p) => p.id === withdrawPlanId);
  const detailPlan: import('@/features/savings/types').SavingsPlan | null = plans.find((p) => p.id === detailId) ?? null;

  const handleCardClick = (id: string) => setDetailId(id);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-900 bg-white border border-brand-200 rounded-2xl px-4 py-2 text-sm transition-colors mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-900">My Savings Plans</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {plans.length} plan{plans.length !== 1 ? 's' : ''} active
            </p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2.5 rounded-2xl text-sm transition-all active:scale-[0.985] cursor-pointer">
            <Plus className="w-4 h-4" /> New Plan
          </button>
        </div>

        {plans.length === 0 && !showCreate ? (
          <div className="bg-white border border-brand-200 rounded-3xl p-12 text-center">
            <div className="mx-auto w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mb-4">
              <PiggyBank className="w-8 h-8 text-brand-600" />
            </div>
            <p className="font-semibold text-brand-900 mb-1">No savings plans yet</p>
            <p className="text-slate-500 text-sm mb-6">Create your first plan to start saving daily.</p>
            <button onClick={() => setShowCreate(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-all cursor-pointer">
              Create Plan
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* ── Search Bar ── */}
            {plans.length > 0 && (
              <div className="relative">
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
            ) : filteredPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handleCardClick(plan.id)}
                className="bg-white border border-brand-200 rounded-3xl p-5 shadow-sm cursor-pointer hover:border-brand-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-brand-900">{plan.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Created {new Date(plan.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="bg-brand-100 text-brand-700 text-xs font-medium px-3 py-1 rounded-full">
                    {plan.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Daily Amount</p>
                    <p className="font-semibold text-brand-900 mt-0.5 text-sm">{formatCurrency(plan.dailyAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Saved</p>
                    <p className="font-semibold text-brand-900 mt-0.5 text-sm">{formatCurrency(plan.totalSaved)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Balance</p>
                    <p className="font-semibold text-brand-600 mt-0.5 text-sm">{formatCurrency(plan.availableBalance)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate('/dashboard/customer/payment/saving', { state: { isSavingPayment: true, total: plan.dailyAmount, savingPlanId: plan.id } }); }}
                    className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-2xl text-sm transition-all active:scale-[0.985] cursor-pointer"
                  >
                    Add to Savings
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setWithdrawPlanId(plan.id); }}
                    className="flex-1 border border-brand-600 text-brand-600 hover:bg-brand-50 font-semibold py-2.5 rounded-2xl text-sm transition-colors cursor-pointer"
                  >
                    Withdraw from Savings
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <SavingsDetailPanel
          plan={detailPlan}
          isOpen={detailId !== null}
          onClose={() => setDetailId(null)}
        />

        {showCreate && <CreatePlanInline onClose={() => setShowCreate(false)} />}

        <DailyAjoWithdrawModal
          isOpen={withdrawPlanId !== null}
          onClose={() => setWithdrawPlanId(null)}
          availableBalance={selectedPlan?.availableBalance ?? 0}
          walletId={selectedPlan?.walletId}
        />
      </div>
    </div>
  );
};

const CreatePlanInline = ({ onClose }: { onClose: () => void }) => {
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutate: createPlan, isPending } = useCreateSavingPlan();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(amount, 10);
    if (!parsed || parsed < 100) { setError('Minimum ₦100 per day'); return; }
    createPlan(
      { amount: parsed, description: desc.trim() || undefined },
      { onSuccess: () => onClose(), onError: (err: unknown) => { setError(err instanceof Error ? err.message : 'Failed to create plan'); } }
    );
  };

  return (
    <div className="mt-6 bg-white border border-brand-200 rounded-3xl p-6">
      <h3 className="font-semibold text-brand-900 mb-4">Create New Plan</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Daily Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₦</span>
            <input type="number" value={amount} min="100" onKeyDown={(e) => { if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') e.preventDefault(); }} onChange={(e) => { setAmount(e.target.value.replace(/\D/g, '')); setError(null); }}
              placeholder="500" disabled={isPending}
              className="w-full pl-9 pr-4 py-3 border border-brand-200 focus:border-brand-600 rounded-2xl focus:outline-none text-base disabled:opacity-50" />
          </div>
          <p className="text-xs text-slate-400 mt-1">Minimum ₦100/day</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Purpose <span className="text-slate-400 font-normal">(Optional)</span></label>
          <input type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g. School fees, emergency fund..." disabled={isPending}
            className="w-full px-4 py-3 border border-brand-200 focus:border-brand-600 rounded-2xl focus:outline-none text-sm disabled:opacity-50" />
        </div>
        {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-2xl px-4 py-2">{error}</p>}
        <div className="flex gap-3">
          <button type="button" onClick={onClose} disabled={isPending}
            className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3 rounded-2xl text-sm hover:bg-slate-50 disabled:opacity-50 cursor-pointer">Cancel</button>
          <button type="submit" disabled={isPending}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-2xl text-sm disabled:opacity-50 cursor-pointer">
            {isPending ? 'Creating...' : 'Create Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SavingsManagement;
