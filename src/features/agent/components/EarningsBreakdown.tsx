// src/features/agent/dashboard/components/EarningsBreakdown.tsx
const EarningsBreakdown = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8">
      <h3 className="text-2xl font-semibold text-slate-900 mb-8">Earnings Breakdown</h3>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">This Month</span>
            <span className="font-semibold">₦12,000</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[65%] bg-emerald-600 rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Last Month</span>
            <span className="font-semibold">₦16,000</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-emerald-600 rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">All Time</span>
            <span className="font-semibold">₦48,000</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-full bg-emerald-600 rounded-full" />
          </div>
        </div>
      </div>

      <button className="w-full mt-10 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl transition-all">
        Request Withdrawal
      </button>
    </div>
  );
};

export default EarningsBreakdown;