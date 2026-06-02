import { useAuthStore } from '@/app/store/authStore';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { History } from 'lucide-react';
import Navbar from '../components/CustomerNavbar';
import OverviewCards from '../components/OverviewCards';
import MyPackages from '../packages/MyPackages';
import AjoDailySavings from '../components/AjoDailySavings';
import RecentTransactions from '../components/RecentTransactions';
import NeedHelp from '../components/NeedHelp';
import PaymentStatusBanner from '@/components/ui/PaymentStatusBanner';
import DailyAjoSetupModal from '@/components/ui/DailyAjoSetupModal';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [showDailyAjoModal, setShowDailyAjoModal] = useState(false);

  const openDailyAjoFromParam = searchParams.get('openDailyAjo') === 'true';
  const showDailyAjo = showDailyAjoModal || openDailyAjoFromParam;

  const handleOpenAjoSetup = () => setShowDailyAjoModal(true);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DailyAjoSetupModal
        isOpen={showDailyAjo}
        onClose={() => setShowDailyAjoModal(false)}
      />

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-xl md:text-4xl font-bold tracking-tight text-brand-900">
              Welcome back, {user?.fullName?.split(' ')[0]}!
            </h1>
            <p className="text-slate-600 mt-1">Here's your financial overview</p>
          </div>
          <div className="text-right text-sm text-slate-500">
            Last updated <span className="text-sm">09:29 AM</span>
          </div>
        </div>

        <OverviewCards />

        <div className="grid lg:grid-cols-11 gap-8 mt-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-2xl font-semibold text-brand-900">My Packages</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard/customer/past-packages')}
                  className="px-4 py-2 border-2 cursor-pointer border-slate-300 text-slate-700 rounded-2xl hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <History className="w-4 h-4" /> View Past Packages
                </button>
                <a href="/browse"
                  className="px-4 py-2 border-2 cursor-pointer border-brand-600 text-brand-600 rounded-2xl hover:bg-brand-50 transition-colors text-sm font-medium">
                  View All
                </a>
              </div>
            </div>
            <MyPackages />
          </div>

          <div className="lg:col-span-4 space-y-9">
            <AjoDailySavings onOpenDailyModal={handleOpenAjoSetup} />
            <NeedHelp />
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-brand-900">Recent Transactions</h2>
          </div>
          <PaymentStatusBanner />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;