// src/features/admin/dashboard/AdminDashboard.tsx
import { useState } from 'react';
import AgentNavbar from '../components/AgentNavbar';
import OverviewCards from '../components/OverviewCards';
import PackageManagement from '../components/PackageManagement';
import ProductManagement from '../components/ProductManagement';
import PaymentApprovals from '../components/PaymentApprovals';
import WithdrawalRequests from '../components/WithdrawalRequests';
import PlatformSettings from '../components/PlatformSettings';

type Tab = 'packages' | 'products' | 'approvals' | 'withdrawals' | 'settings';

const TABS: { key: Tab; label: string; shortLabel: string }[] = [
  { key: 'packages',    label: 'Package Management', shortLabel: 'Packages'   },
  { key: 'products',    label: 'Product Management', shortLabel: 'Products'   },
  { key: 'approvals',   label: 'Payment Approvals',  shortLabel: 'Approvals'  },
  { key: 'withdrawals', label: 'Withdrawals',         shortLabel: 'Withdrawals'},
  { key: 'settings',    label: 'Settings',            shortLabel: 'Settings'   },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('packages');

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AgentNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-4 mb-7 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Manage platform operations and user activities
            </p>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 xs:text-right xs:shrink-0 xs:mt-1">
            Last updated <span className="font-medium">11:59 AM</span>
          </p>
        </div>

        {/* Overview Cards */}
        <OverviewCards />

        {/* Tabs */}
        <div className="mt-8 sm:mt-12 mb-6 sm:mb-10">
          {/* Scrollable tab strip */}
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
            {TABS.map(({ key, label, shortLabel }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 sm:pb-4 px-4 sm:px-8 font-medium whitespace-nowrap transition-colors border-b-2 text-sm sm:text-base shrink-0 ${
                  activeTab === key
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {/* Show short label on small screens, full label on sm+ */}
                <span className="sm:hidden">{shortLabel}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'packages'    && <PackageManagement />}
          {activeTab === 'products'    && <ProductManagement />}
          {activeTab === 'approvals'   && <PaymentApprovals />}
          {activeTab === 'withdrawals' && <WithdrawalRequests />}
          {activeTab === 'settings'    && <PlatformSettings />}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;