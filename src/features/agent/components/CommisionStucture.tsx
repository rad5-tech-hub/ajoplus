// src/features/agent/dashboard/components/CommissionStructure.tsx

const CommissionStructure = () => {
  return (
    <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Commission Structure</h3>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-semibold">Per Referral</span>
          <span className="font-semibold text-emerald-700">₦4,000</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-semibold">Minimum Package</span>
          <span className="font-semibold text-emerald-700">₦50,000</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-semibold">Payout Threshold</span>
          <span className="font-semibold text-emerald-700">₦10,000</span>
        </div>
      </div>
    </div>
  );
};

export default CommissionStructure;