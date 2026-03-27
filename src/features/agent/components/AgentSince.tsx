// src/features/agent/dashboard/components/AgentSince.tsx
import { Calendar } from 'lucide-react';

const AgentSince = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-8">
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-emerald-600" />
        <div>
          <p className="text-sm text-slate-500">Agent Since</p>
          <p className="font-semibold text-slate-900">15 Aug 2025</p>
        </div>
      </div>
    </div>
  );
};

export default AgentSince;