import { useState, useMemo } from 'react';
import { Package as PackageIcon, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserPackages } from '@/app/store/PackageStore';
import UserPackageCard from '../components/UserPackageCard';

const MyPackages = () => {
  const navigate = useNavigate();
  const { data: userPackages, isLoading, error } = useUserPackages();
  const [searchQuery, setSearchQuery] = useState('');

  const displayPackages = useMemo(() => {
    const pkgs = userPackages ?? [];
    return [...pkgs]
      .filter((p) => p.status !== 'finalised')
      .sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [userPackages]);

  const filteredPackages = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return displayPackages;
    return displayPackages.filter((p) =>
      p.package.name.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q) ||
      p.package.description?.toLowerCase().includes(q)
    );
  }, [displayPackages, searchQuery]);

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

  if (displayPackages.length === 0) {
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
      {/* ── Search Bar ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by package name or status..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
        />
      </div>
      {filteredPackages.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center">
          <p className="text-slate-400 font-medium text-sm">No packages match your search.</p>
        </div>
      ) : (
        filteredPackages.map((pkg) => (
          <UserPackageCard key={pkg.id} pkg={pkg} />
        ))
      )}
    </div>
  );
};

export default MyPackages;
