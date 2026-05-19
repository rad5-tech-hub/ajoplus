// src/features/customer/dashboard/components/NeedHelp.tsx
import { ContactOptions } from '@/components/ui/ContactOptions';

const NeedHelp = () => {
  return (
    <div className="bg-brand-50 border border-brand-100 shadow-lg rounded-3xl p-6">
      <h3 className="font-semibold text-brand-900 mb-2">Need Help?</h3>
      <p className="text-sm text-slate-600 mb-6">
        Our support team is here to assist you 24/7
      </p>
      <ContactOptions />
    </div>
  );
};

export default NeedHelp;