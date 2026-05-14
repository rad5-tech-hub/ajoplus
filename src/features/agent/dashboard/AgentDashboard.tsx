import { useAuthStore } from '@/app/store/authStore';
import { useRegistrationFeeStatus } from '@/app/store/RegistrationFeeStore';
import AgentNavbar from '../components/AgentNavbar';
import OverviewCards from '../components/OverviewCards';
import ReferralCode from '../components/ReferralCode';
import ReferredUsers from '../components/ReferredUsers';
import EarningsBreakdown from '../components/EarningsBreakdown';
import PerformanceTips from '../components/PerformanceTips';
import AgentSince from '../components/AgentSince';
import CommissionStructure from '../components/CommisionStucture';
import PendingApprovalOverlay from '@/features/auth/components/PendingApprovalOverlay';

const AgentDashboard = () => {
  const { user } = useAuthStore();
  const { data: feeStatus } = useRegistrationFeeStatus();

  const feeStatusRaw = feeStatus?.user?.registrationFeeStatus;
  const needsApproval = feeStatusRaw === 'pending' || feeStatusRaw === 'rejected'
    || user?.accountStatus === 'pending';

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {needsApproval && <PendingApprovalOverlay />}

      <AgentNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-blue-950">Agent Dashboard</h1>
          <p className="text-slate-600 mt-1">Track your referrals and earnings</p>
        </div>

        <OverviewCards />

        <div className="grid lg:grid-cols-12 gap-8 mt-12">
          <div className="lg:col-span-8 space-y-8">
            <ReferredUsers />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <ReferralCode />
            <EarningsBreakdown />
            <CommissionStructure />
            <PerformanceTips />
            <AgentSince />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;