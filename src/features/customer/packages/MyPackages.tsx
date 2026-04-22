// src/features/customer/dashboard/components/MyPackages.tsx
import { Calendar, ChevronRight, Package as PackageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePackageStore } from '@/app/store/PackageStore';

interface Package {
  id: string;
  title: string;
  subtitle: string;
  status: 'Active' | 'Completed';
  totalPaid: string;
  remaining: string;
  progress: number;
  duration: string;
  nextDue: string;
  amount: string;
  frequency: string;
}

const MyPackages = () => {
  const navigate = useNavigate();
  const joinedPackages = usePackageStore((state) => state.getPackages());

  // Transform JoinedPackage to Package format for display
  const packages: Package[] = joinedPackages.map((pkg) => ({
    id: pkg.id,
    title: pkg.title,
    subtitle: pkg.description,
    status: pkg.status,
    totalPaid: pkg.totalPaid,
    remaining: pkg.remaining,
    progress: pkg.progress,
    duration: pkg.duration,
    nextDue: pkg.nextDue,
    amount: `₦${pkg.price.toLocaleString()}`,
    frequency: pkg.frequency,
  }));

  const handlePackageClick = (packageId: string) => {
    navigate(`/dashboard/customer/package/${packageId}`);
  };

  const handleJoinPackage = () => {
    navigate('/browse');
  };

  // Empty State
  if (packages.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
        <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6">
          <PackageIcon className="w-10 h-10 text-emerald-600" />
        </div>

        <h3 className="text-2xl font-semibold text-slate-900 mb-3">
          No Active Packages Yet
        </h3>
        <p className="text-slate-600 max-w-sm mx-auto mb-8 leading-relaxed">
          Browse and join exciting Ajo packages to start saving towards your goals — phones, laptops, appliances, and more.
        </p>

        <button
          onClick={handleJoinPackage}
          className="inline-flex cursor-pointer items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all active:scale-[0.985]"
        >
          Join a Package
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Active Packages List
  return (
    <div className="space-y-6">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          onClick={() => handlePackageClick(pkg.id)}
          className="bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 rounded-3xl p-6 cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {pkg.title}
                </h3>

                {pkg.status === 'Active' ? (
                  <span className="inline-flex items-center px-3 py-1 bg-blue-100 border border-blue-200 text-blue-700 text-xs font-medium rounded-2xl whitespace-nowrap">
                    <span className="w-2 h-2 bg-blue-700 rounded-full mr-1.5"></span>
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-2xl whitespace-nowrap">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full mr-1.5"></span>
                    Completed
                  </span>
                )}
              </div>
              <p className="text-slate-600 text-sm mt-1 line-clamp-2">{pkg.subtitle}</p>
            </div>

            <div className="text-right shrink-0 ml-4 flex items-center gap-2">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{pkg.amount}</p>
                <p className="text-xs text-slate-500">{pkg.frequency}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl">
            <div>
              <p className="text-xs text-slate-500">Total Paid</p>
              <p className="font-semibold text-slate-900 mt-1">{pkg.totalPaid}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Remaining</p>
              <p className={`font-semibold mt-1 ${pkg.remaining === "₦0" ? "text-emerald-600" : "text-red-600"}`}>
                {pkg.remaining}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Progress</p>
              <p className="font-semibold text-emerald-600 mt-1">{pkg.progress}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${pkg.progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{pkg.duration}</span>
            </div>
            <div>Next due: {pkg.nextDue}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyPackages;