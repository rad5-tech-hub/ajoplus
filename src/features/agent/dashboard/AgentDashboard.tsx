// src/features/agent/dashboard/AgentDashboard.tsx
import AgentNavbar from '../components/AgentNavbar';
import OverviewCards from '../components/OverviewCards';
// import ReferralLink from '../components/ReferralLink';
import ReferralCode from '../components/ReferralCode';
import ReferredUsers from '../components/ReferredUsers';
import EarningsBreakdown from '../components/EarningsBreakdown';
import PerformanceTips from '../components/PerformanceTips';
import AgentSince from '../components/AgentSince';
import CommissionStructure from '../components/CommisionStucture';

const AgentDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AgentNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Agent Dashboard</h1>
          <p className="text-slate-600 mt-1">Track your referrals and earnings</p>
        </div>

        {/* Overview Cards */}
        <OverviewCards />

        <div className="grid lg:grid-cols-12 gap-8 mt-12">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* <ReferralLink /> */}
            <ReferredUsers />
          </div>

          {/* Right Column */}
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