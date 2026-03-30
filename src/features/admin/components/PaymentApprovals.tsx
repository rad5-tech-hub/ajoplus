// src/features/admin/dashboard/components/PaymentApprovals.tsx
import { Eye, Download, Check, X } from 'lucide-react';

const approvals = [
  {
    name: "Chioma Okafor",
    package: "Smart Phone Package",
    amount: "₦25,000",
    date: "18 Mar 2026",
    id: "1",
    status: "pending",
  },
  {
    name: "Emeka Nwosu",
    package: "Laptop Pro Package",
    amount: "₦41,667",
    date: "18 Mar 2026",
    id: "2",
    status: "pending",
  },
  {
    name: "Blessing Eze",
    package: "Home Appliance Bundle",
    amount: "₦33,333",
    date: "17 Mar 2026",
    id: "3",
    status: "pending",
  },
];

const PaymentApprovals = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Payment Approvals</h2>
        <p className="text-slate-600 mt-1 text-sm sm:text-base">
          Review and approve customer payment receipts
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {approvals.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col lg:grid lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8"
          >

            {/* ── Left: User Info ── */}
            <div className="lg:col-span-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg shrink-0">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-base sm:text-xl text-slate-900 leading-tight">
                    {item.name}
                  </p>
                  <span className="inline-block px-2.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full mt-1">
                    pending
                  </span>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-600/5 rounded-xl text-sm">
                <div>
                  <p className="text-slate-500 mb-0.5 text-xs sm:text-sm">Package Name</p>
                  <p className="font-medium text-slate-900 text-sm leading-snug">{item.package}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5 text-xs sm:text-sm">Payment Amount</p>
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600 leading-tight">{item.amount}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5 text-xs sm:text-sm">Submitted Date</p>
                  <p className="font-medium text-slate-900 text-sm">{item.date}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-0.5 text-xs sm:text-sm">Payment ID</p>
                  <p className="font-medium text-slate-900 text-sm">#{item.id}</p>
                </div>
              </div>
            </div>

            {/* ── Center: Receipt Preview ── */}
            <div className="lg:col-span-5">
              <p className="text-slate-500 text-sm mb-2 sm:mb-3">Receipt Preview</p>
              <div className="bg-slate-100 border border-slate-200 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center py-8 sm:py-10 px-4 h-75 min-h-[180px] sm:min-h-[220px]">
                <div className="w-10 h-14 sm:w-12 sm:h-16 bg-white rounded shadow-sm flex items-center justify-center mb-3 sm:mb-4 text-xl sm:text-2xl">
                  📄
                </div>
                <p className="font-medium text-slate-700 text-sm sm:text-base">Payment Receipt</p>
                <p className="text-xs text-slate-500 mt-1">/receipt-{item.id}.jpg</p>
                <button className="mt-4 sm:mt-6 px-4 sm:px-5 py-2 bg-white text-emerald-600 border border-emerald-200 rounded-full text-xs sm:text-sm flex items-center gap-2 hover:bg-emerald-50 transition-colors cursor-pointer">
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Click to view full size
                </button>
              </div>
            </div>

            {/* ── Right: Actions ── */}
            <div className="lg:col-span-3 flex flex-col gap-2 sm:gap-3">
              {/* Secondary actions */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
                <button className="border border-emerald-600 text-emerald-600 font-medium py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors cursor-pointer text-sm">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>View Receipt</span>
                </button>
                <button className="border border-emerald-600 text-emerald-600 font-medium py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors cursor-pointer text-sm">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>Download</span>
                </button>
              </div>

              {/* Primary actions */}
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3 lg:mt-auto lg:pt-4">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-sm sm:text-base">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>Approve</span>
                </button>
                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer text-sm sm:text-base">
                  <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentApprovals;