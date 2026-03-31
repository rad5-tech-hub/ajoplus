// src/features/customer/dashboard/CustomerDashboard.tsx
import { useAuthStore } from '@/app/store/authStore';
import Navbar from '../components/CustomerNavbar';
import OverviewCards from '../components/OverviewCards';
import MyPackages from '../packages/MyPackages';
import AjoDailySavings from '../components/AjoDailySavings';
import RecentTransactions from '../components/RecentTransactions';
import QuickActions from '../components/QuickActions';
import NeedHelp from '../components/NeedHelp';

const CustomerDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-xl md:text-4xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.fullName.split(' ')[0]}!
            </h1>
            <p className="text-slate-600 mt-1">Here's your financial overview</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            Last updated <span className="text-sm">09:29 AM</span>
          </div>
        </div>

        {/* Overview Cards */}
        <OverviewCards />

        <div className="grid lg:grid-cols-11 gap-8 mt-10">
          {/* Left Column - My Packages */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">My Packages</h2>
              <button className="px-4 py-2 border-2 cursor-pointer border-emerald-600 text-emerald-600 rounded-2xl hover:bg-emerald-50 transition-colors text-sm font-medium">
                View All
              </button>
            </div>
            <MyPackages />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-9">
            <AjoDailySavings />
            <QuickActions />
            <NeedHelp />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-slate-900">Recent Transactions</h2>
            <button className="px-6 py-2 border cursor-pointer border-emerald-600 text-emerald-600 rounded-2xl hover:bg-emerald-50 transition-colors text-sm font-medium">
              View All
            </button>
          </div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;