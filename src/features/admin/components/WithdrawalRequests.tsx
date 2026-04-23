// src/features/admin/dashboard/components/WithdrawalRequests.tsx
import { Check, X, Building2, Filter } from 'lucide-react';
import { useState } from 'react';
import { formatDualCurrency } from '@/lib/currency';

interface WithdrawalRequest {
  id: string;
  name: string;
  bank: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved';
  userType: 'customer' | 'agent';
}

const WithdrawalRequests = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'customer' | 'agent'>('all');

  const requests: WithdrawalRequest[] = [
    {
      id: "1",
      name: "Fatima Bello",
      bank: "GTBank - 0123456789",
      amount: 150000,
      date: "18 Mar 2026",
      status: "pending",
      userType: "customer",
    },
    {
      id: "2",
      name: "Adebayo Johnson",
      bank: "Access Bank - 9876543210",
      amount: 75000,
      date: "17 Mar 2026",
      status: "pending",
      userType: "agent",
    },
    {
      id: "3",
      name: "Oluwaseun Adeleke",
      bank: "Zenith Bank - 555666777",
      amount: 200000,
      date: "16 Mar 2026",
      status: "approved",
      userType: "agent",
    },
    {
      id: "4",
      name: "Chioma Okafor",
      bank: "First Bank - 111222333",
      amount: 120000,
      date: "16 Mar 2026",
      status: "approved",
      userType: "customer",
    },
  ];

  const filterOptions: { value: typeof selectedFilter; label: string }[] = [
    { value: 'all', label: 'All Users' },
    { value: 'customer', label: 'Customers' },
    { value: 'agent', label: 'Agents' },
  ];

  const filteredRequests = selectedFilter === 'all'
    ? requests
    : requests.filter(req => req.userType === selectedFilter);

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
        Withdrawal Requests
      </h2>
      <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base">
        Process user withdrawal requests
      </p>

      {/* Filter Section */}
      <div className="mb-8 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
          <Filter className="w-4 h-4" />
          <span>Filter:</span>
        </div>
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setSelectedFilter(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedFilter === option.value
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {filteredRequests.map((req) => (
          <div
            key={req.id}
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
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${req.userType === 'agent'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                    }`}>
                    {req.userType.charAt(0).toUpperCase() + req.userType.slice(1)}
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-slate-500 truncate flex items-center gap-1 mt-1">
                  <Building2 className="w-3 h-3 shrink-0 hidden xs:inline" />
                  {req.bank}
                </p>
              </div>
            </div>

            {/* Middle + Right: Amount/Date + Actions — row on mobile, separate cols on desktop */}
            <div className="flex items-center justify-between sm:contents gap-3">

              {/* Amount + Date */}
              <div className="text-left sm:text-right sm:mx-6 sm:flex-1">
                <p className="text-lg sm:text-xl font-bold text-emerald-600 leading-tight">
                  {formatDualCurrency(req.amount)}
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