// src/features/agent/components/AgentSince.tsx
import { Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAgentDashboard } from '@/api/agent';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const AgentSince = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['agentDashboard'],
    queryFn: getAgentDashboard,
    staleTime: 5 * 60 * 1000,
  });

  // Fallback: use earliest referral date if createdAt not available
  const createdAt = data?.createdAt || data?.referredUsers?.[data.referredUsers.length - 1]?.joinedAt;
  const displayDate = createdAt ? formatDate(createdAt) : 'N/A';

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-slate-200 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-16 bg-slate-200 rounded-full" />
            <div className="h-4 w-32 bg-slate-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-slate-400" />
          <div>
            <p className="text-sm text-slate-500">Agent Since</p>
            <p className="font-semibold text-slate-400">Unable to load</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8">
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-emerald-600" />
        <div>
          <p className="text-sm text-slate-500">Agent Since</p>
          <p className="font-semibold text-slate-900">{displayDate}</p>
        </div>
      </div>
    </div>
  );
};

export default AgentSince;