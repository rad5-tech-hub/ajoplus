// src/features/customer/dashboard/components/NeedHelp.tsx
const NeedHelp = () => {
  return (
    <div className="bg-emerald-50 border border-emerald-100 shadow-lg rounded-3xl p-6">
      <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
      <p className="text-sm text-slate-600 mb-6">
        Our support team is here to assist you 24/7
      </p>
      <button className="w-full cursor-pointer border border-emerald-600 text-emerald-600 font-semibold py-3.5 rounded-2xl hover:bg-white transition-all">
        Contact Support
      </button>
    </div>
  );
};

export default NeedHelp;