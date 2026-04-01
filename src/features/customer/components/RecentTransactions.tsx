// src/features/customer/dashboard/components/RecentTransactions.tsx
const RecentTransactions = () => {
  const transactions = [
    { type: "Smart Phone Package", date: "15 Mar 2026", amount: "+₦25,000", status: "approved" },
    { type: "Ajo Daily Savings", date: "14 Mar 2026", amount: "+₦500", status: "approved" },
    { type: "Laptop Pro Package", date: "10 Mar 2026", amount: "+₦41,667", status: "pending" },
    { type: "Withdrawal", date: "5 Mar 2026", amount: "-₦50,000", status: "approved" },
    { type: "Ajo Daily Savings", date: "13 Mar 2026", amount: "+₦500", status: "approved" },
  ];

  return (
    <div className="bg-white border border-slate-300 rounded-3xl shadow-lg p-5 sm:p-6 w-full lg:w-[63%]">
      {transactions.map((tx, index) => (
        <div 
          key={index} 
          className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-b border-slate-300 last:border-b-0 gap-4 sm:gap-0"
        >
          {/* Left Section: Icon + Details */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              tx.amount.startsWith('+') ? 'bg-emerald-100' : 'bg-red-100'
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
            <p className={`font-semibold text-lg sm:text-xl ${
              tx.amount.startsWith('+') ? 'text-emerald-700' : 'text-red-600'
            }`}>
              {tx.amount}
            </p>
            
            {/* Status Badge - Improved for small screens */}
            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-2xl mt-2 sm:mt-1 whitespace-nowrap ${
              tx.status === 'approved' 
                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                tx.status === 'approved' ? 'bg-emerald-700' : 'bg-yellow-600'
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