// src/features/admin/dashboard/AdminDashboard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AgentNavbar from '../components/AgentNavbar';
import OverviewCards from '../components/OverviewCards';
import PackageManagement from '../components/PackageManagement';
import ProductManagement from '../components/ProductManagement';
import PaymentApprovals from '../components/PaymentApprovals';
import WithdrawalRequests from '../components/WithdrawalRequests';
import PlatformSettings from '../components/PlatformSettings';
import ExpiredRegistrations from '../components/ExpiredRegistrations';
import BannerAdManager from '../components/BannerAdManager';

type Tab = 'packages' | 'products' | 'approvals' | 'expiredRegs' | 'banner' | 'withdrawals' | 'settings';

const TABS: { key: Tab; label: string; shortLabel: string }[] = [
  { key: 'packages', label: 'Package Management', shortLabel: 'Packages' },
  { key: 'products', label: 'Product Management', shortLabel: 'Products' },
  { key: 'approvals', label: 'Payment Approvals', shortLabel: 'Approvals' },
  { key: 'expiredRegs', label: 'Expired Registrations', shortLabel: 'Expired' },
  { key: 'banner', label: 'Promotional Banner', shortLabel: 'Banner' },
  { key: 'withdrawals', label: 'Withdrawals', shortLabel: 'Withdrawals' },
  { key: 'settings', label: 'Settings', shortLabel: 'Settings' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('packages');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AgentNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

        {/* Header */}
        <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-4 mb-7 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-900 leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">
              Manage platform operations and user activities
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/admin/savings')}
              className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              Savings Overview
            </button>
            <p className="text-xs sm:text-sm text-slate-500 xs:text-right xs:shrink-0">
              Last updated <span className="font-medium">11:59 AM</span>
            </p>
          </div>
        </div>

        {/* Overview Cards */}
        <OverviewCards />

        {/* Tabs */}
        <div className="mt-8 sm:mt-12 mb-6 sm:mb-10">
          {/* Scrollable tab strip */}
          <div className="flex border-b border-brand-200 overflow-x-auto scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
            {TABS.map(({ key, label, shortLabel }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`pb-3 sm:pb-4 px-4 sm:px-8 font-medium whitespace-nowrap transition-colors border-b-2 text-sm sm:text-base shrink-0 ${activeTab === key
                  ? 'border-brand-600 text-brand-600'
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
          {activeTab === 'packages' && <PackageManagement />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'approvals' && <PaymentApprovals />}
          {activeTab === 'expiredRegs' && <ExpiredRegistrations />}
          {activeTab === 'banner' && <BannerAdManager />}
          {activeTab === 'withdrawals' && <WithdrawalRequests />}
          {activeTab === 'settings' && <PlatformSettings />}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;