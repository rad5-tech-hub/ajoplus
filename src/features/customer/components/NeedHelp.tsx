// src/features/customer/dashboard/components/NeedHelp.tsx
const NeedHelp = () => {
  return (
    <div className="bg-amber-50 border border-amber-100 shadow-lg rounded-3xl p-6">
      <h3 className="font-semibold text-blue-950 mb-2">Need Help?</h3>
      <p className="text-sm text-slate-600 mb-6">
        Our support team is here to assist you 24/7
      </p>
      <button className="w-full cursor-pointer border border-amber-600 text-amber-600 font-semibold py-3.5 rounded-2xl hover:bg-white transition-all">
        Contact Support
      </button>
    </div>
  );
};

export default NeedHelp;