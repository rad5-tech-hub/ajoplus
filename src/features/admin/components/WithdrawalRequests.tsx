// src/features/admin/dashboard/components/WithdrawalRequests.tsx
import { Check, X, Building2 } from 'lucide-react';

const WithdrawalRequests = () => {
  const requests = [
    {
      name: "Fatima Bello",
      bank: "GTBank - 0123456789",
      amount: "₦150,000",
      date: "18 Mar 2026",
      status: "pending",
    },
    {
      name: "Adebayo Johnson",
      bank: "Access Bank - 9876543210",
      amount: "₦75,000",
      date: "17 Mar 2026",
      status: "pending",
    },
    {
      name: "Oluwaseun Adeleke",
      bank: "Zenith Bank - 555666777",
      amount: "₦200,000",
      date: "16 Mar 2026",
      status: "approved",
    },
    {
      name: "Oluwaseun Adeleke",
      bank: "Zenith Bank - 555666777",
      amount: "₦200,000",
      date: "16 Mar 2026",
      status: "approved",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
        Withdrawal Requests
      </h2>
      <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Process user withdrawal requests
      </p>

      <div className="space-y-3 sm:space-y-4">
        {requests.map((req, index) => (
          <div
            key={index}
            className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 sm:justify-between"
          >
            {/* Left: Avatar + Name/Bank */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 sm:flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-lg sm:text-xl">
                👤
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                  {req.name}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3 shrink-0 hidden xs:inline" />
                  {req.bank}
                </p>
              </div>
            </div>

            {/* Middle + Right: Amount/Date + Actions — row on mobile, separate cols on desktop */}
            <div className="flex items-center justify-between sm:contents gap-3">

              {/* Amount + Date */}
              <div className="text-left sm:text-right sm:mx-6 sm:flex-1">
                <p className="text-xl sm:text-2xl font-bold text-emerald-600 leading-tight">
                  {req.amount}
                </p>
                <p className="text-xs text-slate-500">{req.date}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {req.status === 'pending' ? (
                  <>
                    <button className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium whitespace-nowrap">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="hidden xs:inline sm:inline">Approve</span>
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium whitespace-nowrap">
                      <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                      <span className="hidden xs:inline sm:inline">Reject</span>
                    </button>
                  </>
                ) : (
                  <span className="px-4 sm:px-6 py-2 bg-emerald-100 text-emerald-700 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap">
                    Approved
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WithdrawalRequests;