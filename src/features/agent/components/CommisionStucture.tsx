// src/features/agent/dashboard/components/CommissionStructure.tsx
const rows = [
  { label: 'Per Referral', value: '₦2,000' },
  { label: 'Minimum Package', value: '₦50,000' },
  { label: 'Payout Threshold', value: '₦10,000' },
];

const CommissionStructure = () => {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-blue-950 mb-4 sm:mb-5 lg:mb-6">
        Commission Structure
      </h3>

      <div className="divide-y divide-amber-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center py-3 sm:py-3.5 lg:py-4 first:pt-0 last:pb-0">
            <span className="text-sm sm:text-[15px] font-medium text-slate-600">{label}</span>
            <span className="text-sm sm:text-[15px] font-semibold text-amber-700">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommissionStructure;