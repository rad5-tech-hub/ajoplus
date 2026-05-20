import { useAuthStore } from '@/app/store/authStore';
import { useRegistrationFeeStatus } from '@/app/store/RegistrationFeeStore';
import AgentNavbar from '../components/AgentNavbar';
import OverviewCards from '../components/OverviewCards';
import ReferralCode from '../components/ReferralCode';
import ReferredUsers from '../components/ReferredUsers';
import AgentDownlines from '../components/AgentDownlines';
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
          <h1 className="text-4xl font-bold tracking-tight text-brand-900">Agent Dashboard</h1>
          <p className="text-slate-600 mt-1">Track your referrals and earnings</p>
        </div>

        <OverviewCards />

        <div className="grid lg:grid-cols-12 gap-8 mt-12">
          <div className="lg:col-span-8 space-y-8">
            <ReferredUsers />
            <AgentDownlines />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <ReferralCode />
            <EarningsBreakdown />
            <CommissionStructure />
            <PerformanceTips />
            <AgentSince />

            {/* Agent Terms */}
            <details className="bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 overflow-hidden">
              <summary className="px-4 py-3 font-medium text-slate-700 cursor-pointer select-none hover:bg-slate-50 transition-colors">
                Agent Terms
              </summary>
              <div className="px-4 pb-3 space-y-1.5 max-h-48 overflow-y-auto">
                <p className="flex gap-2 leading-relaxed text-xs"><span className="text-brand-500 shrink-0">•</span>Agent commission is 20% of the registration fee brought by the agent.</p>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;