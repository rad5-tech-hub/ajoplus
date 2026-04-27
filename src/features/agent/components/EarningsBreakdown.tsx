// src/features/agent/dashboard/components/EarningsBreakdown.tsx
import { useState } from 'react';
import DailyAjoWithdrawModal from '@/components/ui/DailyAjoWithdrawModal';
const bars = [
  { label: 'This Month', amount: '₦12,000', pct: 65  },
  { label: 'Last Month',  amount: '₦16,000', pct: 85  },
  { label: 'All Time',    amount: '₦48,000', pct: 100 },
];


const EarningsBreakdown = () => {
  

const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
      <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-900 mb-5 sm:mb-6 lg:mb-8">
        Earnings Breakdown
      </h3>

      <div className="space-y-5 sm:space-y-6 lg:space-y-8">
        {bars.map(({ label, amount, pct }) => (
          <div key={label}>
            <div className="flex justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
              <span className="text-slate-500">{label}</span>
              <span className="font-semibold text-slate-900">{amount}</span>
            </div>
            <div className="h-2 sm:h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => setIsWithdrawOpen(true)} className=" cursor-pointer w-full mt-7 sm:mt-8 lg:mt-10 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
                         py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl
                         text-sm sm:text-[15px] transition-all">
        Request Withdrawal
      </button>
         {/* Withdraw Modal */}
      <DailyAjoWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
      />
    </div>
  );
};

export default EarningsBreakdown;