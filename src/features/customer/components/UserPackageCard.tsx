import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import ClaimCodeSection from './ClaimCodeSection';
import type { UserPackage } from '@/api/package';

interface UserPackageCardProps {
  pkg: UserPackage;
}

const UserPackageCard = ({ pkg }: UserPackageCardProps) => {
  const navigate = useNavigate();

  const totalPaid = formatCurrency(parseFloat(pkg.totalPaid));
  const remaining = formatCurrency(pkg.remainingBalance);
  const amount = formatCurrency(parseFloat(String(pkg.package.totalPrice)));
  const nextDue = new Date(pkg.nextPaymentDate).toLocaleDateString('en-GB');
  const isFinalised = pkg.status === 'completed';

  return (
    <div
      onClick={() => navigate(`/dashboard/customer/package/${pkg.packageId}`)}
      className={`bg-white border shadow-sm rounded-3xl p-6 transition-all duration-200
        ${isFinalised
          ? 'border-slate-200 opacity-60 cursor-pointer hover:shadow-md hover:border-slate-300'
          : 'border-brand-200 hover:shadow-md hover:border-brand-200 cursor-pointer group'
        }`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className={`text-lg font-semibold transition-colors
              ${isFinalised ? 'text-slate-500' : 'text-brand-900 group-hover:text-brand-700'}`}>
              {pkg.package.name}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-2xl whitespace-nowrap
              ${pkg.status === 'active'
                ? 'bg-blue-100 border border-blue-200 text-blue-700'
                : pkg.status === 'completed'
                  ? 'bg-slate-200 border border-slate-300 text-slate-500'
                  : 'bg-slate-100 border border-brand-200 text-slate-600'
              }`}
            >
              {pkg.status === 'active' && <span className="w-2 h-2 bg-blue-700 rounded-full mr-1.5" />}
              {pkg.status === 'completed' && <span className="w-2 h-2 bg-slate-400 rounded-full mr-1.5" />}
              {pkg.status === 'completed' ? 'Finalised' : pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">{pkg.package.description}</p>
        </div>
        <div className="text-right shrink-0 ml-4 flex items-center gap-2">
          <div>
            <p className={`text-2xl font-bold ${isFinalised ? 'text-slate-400' : 'text-brand-600'}`}>{amount}</p>
            <p className="text-xs text-slate-400">{pkg.paymentFrequency}</p>
          </div>
          {!isFinalised && (
            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 transition-colors" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl">
        <div>
          <p className="text-xs text-slate-400">Total Paid</p>
          <p className={`font-semibold mt-1 ${isFinalised ? 'text-slate-500' : 'text-brand-900'}`}>{totalPaid}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Remaining</p>
          <p className={`font-semibold mt-1 ${isFinalised ? 'text-slate-400' : pkg.remainingBalance === 0 ? 'text-brand-600' : 'text-red-600'}`}>
            {remaining}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Progress</p>
          <p className={`font-semibold mt-1 ${isFinalised ? 'text-slate-500' : 'text-brand-600'}`}>{pkg.progress}%</p>
        </div>
      </div>

      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full rounded-full transition-all duration-300 ${isFinalised ? 'bg-slate-300' : 'bg-brand-600'}`}
          style={{ width: `${pkg.progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{pkg.duration} months</span>
        </div>
        <div>Next due: {nextDue}</div>
      </div>

      {pkg.status === 'completed' && pkg.claimCode && (
        <ClaimCodeSection
          claimCode={pkg.claimCode}
          claimIssuedAt={pkg.claimIssuedAt!}
        />
      )}
    </div>
  );
};

export default UserPackageCard;
