// src/features/customer/dashboard/components/RecentTransactions.tsx
import { ArrowUpDown, Clock } from 'lucide-react';

const RecentTransactions = () => {
  const transactions: { type: string; date: string; amount: string; status: string }[] = [
  ];

  // Empty State
  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
          <Clock className="w-9 h-9 text-slate-400" />
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          No Transactions Yet
        </h3>
        <p className="text-slate-600 max-w-xs mx-auto mb-8 leading-relaxed">
          Your recent savings, payments, and withdrawals will appear here once you start using AjoPlus.
        </p>

        <button
          onClick={() => window.location.href = '/browse'}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-all active:scale-[0.985]"
        >
          Browse Packages
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Transactions List (unchanged structure)
  return (
    <div className="bg-white border border-slate-300 rounded-3xl shadow-lg p-5 sm:p-6 w-full lg:w-[63%]">
      {transactions.map((tx, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-slate-300 last:border-b-0 gap-4 sm:gap-0"
        >
          {/* Left Section: Icon + Details */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 ${tx.amount.startsWith('+') ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
              <span className="text-lg sm:text-xl">
                {tx.amount.startsWith('+') ? '↑' : '↓'}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-700 text-base sm:text-lg truncate">{tx.type}</p>
              <p className="text-xs sm:text-sm text-slate-500">{tx.date}</p>
            </div>
          </div>

          {/* Right Section: Amount + Status */}
          <div className="flex flex-col items-end sm:items-end text-right shrink-0">
            <p className={`font-semibold text-lg sm:text-xl ${tx.amount.startsWith('+') ? 'text-emerald-700' : 'text-red-600'
              }`}>
              {tx.amount}
            </p>

            {/* Status Badge */}
            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-2xl mt-2 sm:mt-1 whitespace-nowrap ${tx.status === 'approved'
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
              }`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${tx.status === 'approved' ? 'bg-emerald-700' : 'bg-yellow-600'
                }`}></span>
              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTransactions;