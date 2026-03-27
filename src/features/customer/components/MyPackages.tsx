// src/features/customer/dashboard/components/MyPackages.tsx
import { Calendar } from 'lucide-react';

const MyPackages = () => {
  const packages = [
    {
      title: "Smart Phone Package",
      subtitle: "Save weekly and get the latest smartphone",
      status: "Active",
      totalPaid: "₦97,500",
      remaining: "₦52,500",
      progress: 65,
      duration: "6 months",
      nextDue: "2 Apr 2026",
      amount: "₦150,000",
      frequency: "Weekly",
    },
    {
      title: "Smart Phone Package",
      subtitle: "Save weekly and get the latest smartphone",
      status: "Active",
      totalPaid: "₦97,500",
      remaining: "₦52,500",
      progress: 65,
      duration: "6 months",
      nextDue: "2 Apr 2026",
      amount: "₦150,000",
      frequency: "Weekly",
    },
    {
      title: "Smart Phone Package",
      subtitle: "Save weekly and get the latest smartphone",
      status: "Active",
      totalPaid: "₦97,500",
      remaining: "₦52,500",
      progress: 65,
      duration: "6 months",
      nextDue: "2 Apr 2026",
      amount: "₦150,000",
      frequency: "Weekly",
    },
    {
      title: "Laptop Pro Package",
      subtitle: "Perfect for professionals and students",
      status: "Active",
      totalPaid: "₦150,000",
      remaining: "₦350,000",
      progress: 100,
      duration: "12 months",
      nextDue: "2 Apr 2026",
      amount: "₦500,000",
      frequency: "Monthly",
    },
    {
      title: "Laptop Pro Package",
      subtitle: "Perfect for professionals and students",
      status: "Active",
      totalPaid: "₦150,000",
      remaining: "₦350,000",
      progress: 45,
      duration: "12 months",
      nextDue: "2 Apr 2026",
      amount: "₦500,000",
      frequency: "Monthly",
    },
  ];

  return (
    <div className="space-y-6">
      {packages.map((pkg, index) => (
        <div key={index} className="bg-white border border-slate-300 shadow-lg rounded-3xl p-6 hover:border-emerald-200 transition-colors">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0"> {/* Added for better text wrapping control */}
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-md md:text-lg font-semibold text-slate-900">{pkg.title}</h3>
                
                {/* Improved Active badge for small screens */}
                <span className="inline-flex items-center px-3 py-1 mb-1 md:mb-0 bg-blue-100 border border-blue-200 text-blue-700 text-xs font-medium rounded-2xl whitespace-nowrap shrink-0">
                  <span className="w-2 h-2 bg-blue-700 rounded-full mr-1.5 "></span>
                  Active
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-1 line-clamp-2">{pkg.subtitle}</p>
            </div>

            <div className="text-right shrink-0 ml-4">
              <p className="text-xl font-bold text-emerald-600">{pkg.amount}</p>
              <p className="text-xs text-slate-500">{pkg.frequency}</p>
            </div>
          </div>

          <div className="flex justify-around mb-6 bg-gray-100 p-4 rounded-lg">
            <div>
              <p className="text-xs text-slate-500">Total Paid</p>
              <p className="font-semibold text-slate-900 mt-1">{pkg.totalPaid}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Remaining</p>
              <p className="font-semibold text-red-600 mt-1">{pkg.remaining}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Progress</p>
              <p className="font-semibold text-emerald-600 mt-1">{pkg.progress}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all"
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