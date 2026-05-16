import { Package as PackageIcon, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserPackages } from '@/app/store/PackageStore';
import UserPackageCard from '../components/UserPackageCard';

const MyPackages = () => {
  const navigate = useNavigate();
  const { data: userPackages, isLoading, error } = useUserPackages();

  const sortedPackages = [...(userPackages ?? [])].sort((a, b) => {
    const order = { active: 0, pending: 1, completed: 2, inactive: 3, suspended: 4 };
    const statusDiff = (order[a.status] ?? 1) - (order[b.status] ?? 1);
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-brand-200 rounded-3xl p-6 animate-pulse">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-200 rounded-full w-1/3" />
                <div className="h-4 bg-slate-100 rounded-full w-2/3" />
              </div>
              <div className="h-6 bg-slate-200 rounded-full w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-3xl p-8 text-center">
        <p className="text-red-600 mb-4">Failed to load packages</p>
        <button
          onClick={() => window.location.reload()}
          className="text-red-600 underline text-sm hover:text-red-700 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  if (sortedPackages.length === 0) {
    return (
      <div className="bg-white border border-brand-200 rounded-3xl p-12 text-center">
        <div className="mx-auto w-20 h-20 bg-brand-100 rounded-3xl flex items-center justify-center mb-6">
          <PackageIcon className="w-10 h-10 text-brand-600" />
        </div>
        <h3 className="text-2xl font-semibold text-brand-900 mb-3">No Active Packages Yet</h3>
        <p className="text-slate-600 max-w-sm mx-auto mb-8 leading-relaxed">
          Browse and join exciting Ajo packages to start saving towards your goals — phones, laptops, appliances, and more.
        </p>
        <button
          onClick={() => navigate('/browse')}
          className="inline-flex cursor-pointer items-center gap-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all active:scale-[0.985]"
        >
          Join a Package
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedPackages.map((pkg) => (
        <UserPackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
};

export default MyPackages;
