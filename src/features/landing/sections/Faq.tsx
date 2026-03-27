import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is AjoPlus?",
    answer:
      "AjoPlus is a digital savings platform that combines traditional Ajo (contribution) savings with structured package savings to help you achieve your financial goals.",
  },
  {
    question: "How does the Ajo savings work?",
    answer:
      "You set a daily amount you want to save, and we collect it automatically. A small commission (5%) is deducted for management. You can withdraw anytime after 30 days.",
  },
  {
    question: "What happens if I miss a payment?",
    answer:
      "We understand life happens! You have a grace period of 7 days to make up missed payments. After that, your package may be paused until payments are up to date.",
  },
  {
    question: "How do I become an agent?",
    answer:
      "Simply sign up and share your unique referral link. You earn ₦4,000 for every person who joins and buys a package through your link.",
  },
  {
    question: "Is my money safe?",
    answer:
      "Yes! We use bank-level security and your savings are held in secure, insured accounts. We are also regulated by relevant financial authorities.",
  },
  {
    question: "Can I withdraw my savings early?",
    answer:
      "For Ajo savings, you can withdraw after 30 days. For package savings, early withdrawal may attract a small penalty fee depending on the terms.",
  },
];

// Chevron icon
const ChevronIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform duration-300 flex-shrink-0 text-gray-400 ${
      open ? "rotate-180" : "rotate-0"
    }`}
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const FAQAccordionItem: React.FC<{
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ item, isOpen, onToggle }) => (
  <div
    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md"
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between text-left px-7 py-6 gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
      aria-expanded={isOpen}
    >
      <span
        className={`text-[15.5px] font-bold leading-snug transition-colors duration-200 ${
          isOpen ? "text-[#16a34a]" : "text-[#0f2d3d]"
        }`}
      >
        {item.question}
      </span>
      <ChevronIcon open={isOpen} />
    </button>

    {/* Animated answer panel */}
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <p className="px-7 pb-6 text-[14px] text-gray-400 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  </div>
);

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="w-full bg-[#f3f4f6] px-4 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-[34px] sm:text-[40px] font-extrabold text-[#0f2d3d] leading-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-[15px]">
            Everything you need to know about AjoPlus
          </p>
        </div>

        {/* Accordion list */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <FAQAccordionItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;