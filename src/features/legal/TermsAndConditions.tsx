import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Package, Users, FileText } from 'lucide-react';

const Section = ({ icon: Icon, title, children }: { icon: typeof Shield; title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-brand-200 rounded-3xl p-6 sm:p-8 shadow-sm">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-brand-600" />
      </div>
      <h2 className="text-xl font-bold text-brand-900">{title}</h2>
    </div>
    {children}
  </div>
);

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b border-brand-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-900 transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-100 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-900">Terms and Conditions</h1>
              <p className="text-slate-500 text-sm mt-0.5">Last updated: May 2026</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Ajo Terms */}
        <Section icon={Shield} title="Ajo Terms &amp; Conditions">
          <ul className="space-y-3">
            {[
              'Global daily contribution has a monthly charge of 3.1% which is equivalent to the person\'s daily contribution amount.',
              'An annual registration fee of N1,000 applies.',
              'In global daily contributions, a withdrawal notice of 2-3 working days must be given before withdrawals will be successful.',
              'For those on global daily contributions, you are free to request for your money anytime you want but the withdrawal process will take effect on or before 3 working days of your request.',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                <span className="text-brand-500 font-bold mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Package Terms */}
        <Section icon={Package} title="Package Contribution Terms">
          <ul className="space-y-3">
            {[
              'For global food contribution, food items you contributed will get to you on or before 30 days of completion.',
              'No refund of money is accepted on global food contribution.',
              'The N1,000 registration fee is based on each package.',
              'The N1,000 registration fee is added to each package price.',
              'One is allowed to register multiple packages.',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                <span className="text-brand-500 font-bold mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Agent Terms */}
        <Section icon={Users} title="Agent Terms">
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm text-slate-600 leading-relaxed">
              <span className="text-brand-500 font-bold mt-0.5 shrink-0">•</span>
              Agent commission is 20% of the registration fee brought by the agent.
            </li>
          </ul>
        </Section>

        {/* General Terms */}
        <Section icon={FileText} title="General Terms &amp; Conditions">
          <ul className="space-y-3">
            {[
              'Global daily contribution has a monthly charge of 3.1% which is equivalent to the person\'s daily contribution amount.',
              'An annual registration fee of N1,000 applies.',
              'Agent commission is 20% of the registration fee brought by the agent.',
              'In global daily contributions, a withdrawal notice of 2-3 working days must be given before withdrawals will be successful.',
              'For global food contribution, food items you contributed will get to you on or before 30 days of completion.',
              'A well detailed address of yours must be submitted while filling the registration form.',
              'No refund of money is accepted on global food contribution.',
              'For those on global daily contributions, you are free to request for your money anytime you want but the withdrawal process will take effect on or before 3 working days of your request.',
              'The N1,000 registration fee is based on each package.',
              'One is allowed to register multiple packages.',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                <span className="text-brand-500 font-bold mt-0.5 shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Contact */}
        <div className="bg-brand-50 border border-brand-100 rounded-3xl p-6 sm:p-8 text-center">
          <h2 className="text-lg font-bold text-brand-900 mb-2">Questions?</h2>
          <p className="text-sm text-slate-600 mb-4">
            If you have any questions about these terms, please contact us.
          </p>
          <a
            href="mailto:support@abagold.com"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-all active:scale-[0.985]"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
