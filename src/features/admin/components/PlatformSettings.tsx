const PlatformSettings = () => {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">

      {/* Ajo Commission Rate */}
      <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-5 sm:mb-6">
          <div className="w-8 h-8 bg-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 text-base">
            ⚙️
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">Ajo Commission Rate</h3>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 mb-5 sm:mb-6">
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            defaultValue="5"
            className="flex-1 accent-emerald-600 h-2"
          />
          <span className="text-3xl sm:text-4xl font-bold text-emerald-600 shrink-0 w-16 text-right">
            5%
          </span>
        </div>

        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          This is the commission deducted from Ajo savings. Current rate applies to all new and existing users.
        </p>

        <button className="mt-6 sm:mt-8 cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white px-6 sm:px-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base w-full sm:w-auto">
          Save Changes
        </button>
      </div>

      {/* Bank Account Details */}
      <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-5 sm:mb-8">
          Bank Account Details
        </h3>

        <div className="space-y-4 sm:space-y-6">
          {[
            { label: 'Bank Name', placeholder: 'Enter bank name' },
            { label: 'Account Number', placeholder: 'Enter account number' },
            { label: 'Account Name', placeholder: 'Enter account name' },
          ].map(({ label, placeholder }) => (
            <div key={label}>
              <label className="block text-xs sm:text-sm text-slate-600 mb-1.5 sm:mb-2 font-medium">
                {label}
              </label>
              <input
                type="text"
                placeholder={placeholder}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 border border-slate-200 rounded-xl sm:rounded-2xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none text-sm sm:text-base transition-colors"
              />
            </div>
          ))}
        </div>

        <button className="mt-6 sm:mt-10 cursor-pointer bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white px-6 sm:px-10 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base w-full sm:w-auto">
          Update Bank Details
        </button>
      </div>
    </div>
  );
};

export default PlatformSettings;