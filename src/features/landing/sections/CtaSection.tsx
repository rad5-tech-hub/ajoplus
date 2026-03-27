import React from "react";

const ReadyToStartSaving: React.FC = () => {
  return (
    <section className="w-full bg-[#0d1f35] px-4 py-20 sm:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-[28px] sm:text-[34px] font-extrabold text-white leading-tight mb-4">
          Ready to Start Saving?
        </h2>
        <p className="text-[15px] text-blue-200/70 leading-relaxed mb-10 max-w-md mx-auto">
          Join thousands of Nigerians who are achieving their financial goals with AjoPlus.
        </p>
        <button className="bg-[#16a34a] cursor-pointer hover:bg-[#15803d] active:bg-[#166534] text-white text-[15px] font-semibold px-10 py-4 rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400">
          Get Started Free
        </button>
      </div>
    </section>
  );
};

export default ReadyToStartSaving;