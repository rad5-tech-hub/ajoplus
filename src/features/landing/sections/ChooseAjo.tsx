import React from "react";

// SVG Icons — exact matches to the screenshot
const ShieldIcon = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="52"
    height="52"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const PeopleIcon = () => (
  <svg
    width="56"
    height="52"
    viewBox="0 0 28 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Front person */}
    <circle cx="11" cy="7" r="3.5" />
    <path d="M3 21c0-4 3.6-7 8-7s8 3 8 7" />
    {/* Back person (partially visible, offset right) */}
    <circle cx="19" cy="7" r="3.5" />
    <path d="M19 14c2.5 0 5 1.5 6 4" />
  </svg>
);

const BadgeCheckIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#16a34a"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="7 12.5 10.5 16 17 9" />
  </svg>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlighted?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  highlighted = false,
}) => (
  <div
    className={[
      "flex flex-col items-center text-center px-8 py-10 bg-white rounded-2xl transition-shadow duration-200",
      highlighted
        ? "border border-gray-200 shadow-md"
        : "border border-gray-200 shadow-sm",
    ].join(" ")}
  >
    {/* Icon */}
    <div className="mb-5 flex items-center justify-center">{icon}</div>

    {/* Title */}
    <h3 className="text-[17px] font-bold text-[#0f2d3d] mb-3 leading-snug">
      {title}
    </h3>

    {/* Description */}
    <p className="text-[14.5px] text-gray-500 leading-relaxed max-w-[220px]">
      {description}
    </p>
  </div>
);

interface TrustBadgeProps {
  label: string;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({ label }) => (
  <div className="flex items-center gap-2">
    <BadgeCheckIcon />
    <span className="text-[15px] font-semibold text-[#0f2d3d]">{label}</span>
  </div>
);

const WhyChooseAjoPlus: React.FC = () => {
  return (
    <section className="w-full bg-[#f3f4f6] px-4 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[34px] sm:text-[40px] font-extrabold text-[#0f2d3d] leading-tight mb-3">
            Why Choose AjoPlus?
          </h2>
          <p className="text-gray-500 text-[15.5px]">
            Trusted by over 1,200 Nigerians
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          <FeatureCard
            icon={<ShieldIcon />}
            title="Secure & Safe"
            description="Bank-level security with insured accounts. Your money is always protected."
          />
          <FeatureCard
            icon={<ClockIcon />}
            title="Flexible Terms"
            description="Choose contribution frequencies that match your income cycle."
            highlighted
          />
          <FeatureCard
            icon={<PeopleIcon />}
            title="Trusted Community"
            description="Join over 1,200 Nigerians already saving and achieving their goals."
          />
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <TrustBadge label="SSL Encrypted" />
          <TrustBadge label="Licensed Platform" />
          <TrustBadge label="24/7 Support" />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseAjoPlus;