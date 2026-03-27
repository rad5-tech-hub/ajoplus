// src/features/customer/dashboard/components/AjoDailySavings.tsx
const AjoDailySavings = () => {
  return (
    <div className="bg-[#19ad45] text-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-emerald-200 text-sm font-medium">Ajo Daily Savings</p>
        </div>
        <div className="text-3xl sm:text-4xl">🐷</div>
      </div>

      {/* Daily Amount */}
      <div className="mb-8">
        <p className="text-emerald-100 text-sm font-medium">Daily Amount</p>
        <p className="text-3xl sm:text-4xl font-bold mt-1">₦500</p>
      </div>

      {/* First Info Box - Total Saved / Commission / Balance */}
      <div className="bg-emerald-50/20 border border-emerald-100/30 py-5 px-4 sm:px-6 rounded-2xl flex flex-col sm:flex-row justify-between gap-6 mb-8">
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-emerald-100 text-sm">Total Saved</p>
            <p className="text-lg sm:text-xl font-semibold text-white">₦75,000</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Commission Paid (5%)</p>
            <p className="text-lg sm:text-xl font-semibold text-red-300">-₦3,750</p>
          </div>
          <div className="pt-3 border-t border-emerald-100/40">
            <p className="text-emerald-100 text-sm">Available Balance</p>
            <p className="text-xl sm:text-2xl font-bold text-white">₦71,250</p>
          </div>
        </div>

        {/* Vertical divider for larger screens */}
        <div className="hidden sm:block w-px bg-emerald-100/30 self-stretch" />
      </div>

      {/* Second Info Box - Days / Next Commission / Monthly */}
      <div className="bg-emerald-50/20 border border-emerald-100/30 py-5 px-4 sm:px-6 rounded-2xl flex flex-col sm:flex-row justify-between gap-6 mb-10">
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-emerald-100 text-sm">You've saved for</p>
            <p className="text-lg font-medium text-white">150 days</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Next commission deduction</p>
            <p className="text-lg font-medium text-white">In 30 days</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">Monthly summary</p>
            <p className="text-lg font-medium text-white">₦15,000/month</p>
          </div>
        </div>

        {/* Vertical divider for larger screens */}
        <div className="hidden sm:block w-px bg-emerald-100/30 self-stretch" />
      </div>

      {/* Withdraw Button */}
      <button className="w-full bg-white text-emerald-700 font-semibold py-4 rounded-2xl hover:bg-emerald-50 active:bg-emerald-100 transition-colors text-base sm:text-lg">
        Withdraw Balance
      </button>
    </div>
  );
};

export default AjoDailySavings;