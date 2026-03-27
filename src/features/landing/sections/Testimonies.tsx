import React from "react";

// Avatar icon — dual-person outline in green, on mint background
const AvatarIcon: React.FC = () => (
  <div className="w-11 h-11 rounded-full bg-[#dcfce7] flex items-center justify-center flex-shrink-0">
    <svg
      width="26"
      height="22"
      viewBox="0 0 30 24"
      fill="none"
      stroke="#16a34a"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* front person */}
      <circle cx="11" cy="7" r="3.5" />
      <path d="M3 22c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      {/* back person */}
      <circle cx="20" cy="7" r="3.5" />
      <path d="M20 15c2.8 0 5.5 1.6 7 4.5" />
    </svg>
  </div>
);

// Five outline stars — exactly as shown (no fill, thin stroke)
const StarRating: React.FC = () => (
  <div className="flex items-center gap-1 mb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1e293b"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ))}
  </div>
);

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-7 py-7 flex flex-col justify-between">
    {/* Stars */}
    <div>
      <StarRating />
      {/* Quote */}
      <p className="text-[14.5px] text-gray-500 leading-relaxed italic mb-7">
        {quote}
      </p>
    </div>

    {/* Author */}
    <div className="flex items-center gap-3">
      <AvatarIcon />
      <div>
        <p className="text-[15px] font-bold text-[#0f2d3d] leading-tight">{name}</p>
        <p className="text-[13px] text-gray-400 mt-0.5">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials: TestimonialCardProps[] = [
  {
    quote:
      '"AjoPlus helped me save for my laptop without stress. The weekly contributions fit my budget perfectly!"',
    name: "Chioma Okafor",
    role: "Small Business Owner",
  },
  {
    quote:
      '"I love the Ajo savings feature. Small daily savings add up quickly. Highly recommended!"',
    name: "Emeka Nwosu",
    role: "Teacher",
  },
  {
    quote:
      '"The structured packages make it easy to achieve my savings goals. Great platform!"',
    name: "Fatima Bello",
    role: "Student",
  },
];

const Testimonies: React.FC = () => {
  return (
    <section id="testimonials" className="w-full bg-[#f3f4f6] px-4 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[34px] sm:text-[40px] font-extrabold text-[#0f2d3d] leading-tight mb-3">
            What Our Users Say
          </h2>
          <p className="text-gray-400 text-[15px]">
            Real stories from real savers
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonies;