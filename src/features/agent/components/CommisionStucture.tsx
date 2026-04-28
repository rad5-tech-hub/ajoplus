// src/features/agent/dashboard/components/CommissionStructure.tsx
const rows = [
  { label: 'Per Referral', value: '₦2,000' },
  { label: 'Minimum Package', value: '₦50,000' },
  { label: 'Payout Threshold', value: '₦10,000' },
];

const CommissionStructure = () => {
  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 mb-4 sm:mb-5 lg:mb-6">
        Commission Structure
      </h3>

      <div className="divide-y divide-emerald-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-3 sm:py-3.5 lg:py-4 first:pt-0 last:pb-0">
            <span className="text-sm sm:text-[15px] font-medium text-slate-600">{label}</span>
            <span className="text-sm sm:text-[15px] font-semibold text-emerald-700">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommissionStructure;