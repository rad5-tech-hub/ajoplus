import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package as PackageIcon, History } from 'lucide-react';
import { useUserPackages } from '@/app/store/PackageStore';
import UserPackageCard from '../components/UserPackageCard';
import Navbar from '../components/CustomerNavbar';

const PastPackages = () => {
  const navigate = useNavigate();
  const { data: userPackages, isLoading, error } = useUserPackages();

  const pastPackages = useMemo(() => {
    const pkgs = userPackages ?? [];
    return pkgs
      .filter((p) => p.status === 'finalised')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [userPackages]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-brand-200 rounded-3xl p-6 animate-pulse">
              <div className="h-5 bg-slate-200 rounded-full w-1/3" />
              <div className="h-4 bg-slate-100 rounded-full w-2/3 mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white border border-red-200 rounded-3xl p-8 text-center">
            <p className="text-red-600 mb-4">Failed to load packages</p>
            <button onClick={() => window.location.reload()} className="text-red-600 underline text-sm cursor-pointer">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/dashboard/customer')}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-900 bg-white border border-brand-200 rounded-2xl px-4 py-2 text-sm transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center">
            <History className="w-5 h-5 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-900">Past Packages</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {pastPackages.length} completed package{pastPackages.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {pastPackages.length === 0 ? (
          <div className="bg-white border border-brand-200 rounded-3xl p-12 text-center">
            <div className="mx-auto w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
              <PackageIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-brand-900 mb-3">No Past Packages Yet</h3>
            <p className="text-slate-600 max-w-sm mx-auto mb-8 leading-relaxed">
              Completed and finalised packages will appear here.
            </p>
            <button
              onClick={() => navigate('/browse')}
              className="inline-flex cursor-pointer items-center gap-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all active:scale-[0.985]"
            >
              Browse Packages <PackageIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pastPackages.map((pkg) => (
              <UserPackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PastPackages;
