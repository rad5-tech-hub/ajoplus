// src/features/landing/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const TwitterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2 4 12 13 22 4" />
  </svg>
);

const SocialButton: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <button
    aria-label={label}
    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200 focus:outline-none"
  >
    {children}
  </button>
);

// Shared smooth-scroll handler for anchor links
const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const target = document.querySelector(href);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Quick Links — How It Works / Packages / FAQ scroll to their IDs; Login routes
const QUICK_LINKS: { label: string; href: string; isAnchor: boolean }[] = [
  { label: 'How It Works', href: '#how-it-works', isAnchor: true  },
  { label: 'Packages',     href: '#packages',     isAnchor: true  },
  { label: 'FAQ',          href: '#faq',          isAnchor: true  },
  { label: 'Login',        href: '/login',        isAnchor: false },
];

// Legal links — plain # for now, swap with real routes/pages when ready
const LEGAL_LINKS: { label: string; href: string }[] = [
  { label: 'Terms of Service', href: '#' },
  { label: 'Privacy Policy',   href: '#' },
  { label: 'Cookie Policy',    href: '#' },
  { label: 'Contact Us',       href: '#' },
];

const linkCls = 'text-[13.5px] text-blue-200/55 hover:text-white transition-colors duration-200';

const Footer: React.FC = () => (
  <footer
    className="w-full bg-[#0d1f35] mt-14"
    style={{
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}
  >
    <div className="max-w-5xl mx-auto px-6 pt-14 pb-6">

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">

        {/* Brand col — spans 2 on lg */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#16a34a] flex items-center justify-center shrink-0">
              <span className="text-white font-extrabold text-[15px] leading-none select-none">A+</span>
            </div>
            <span className="text-white font-bold text-[18px]">AjoPlus</span>
          </div>
          <p className="text-[13.5px] text-blue-200/55 leading-relaxed max-w-65 mb-6">
            Save smart and contribute easily with Nigeria's leading digital Ajo and structured savings platform.
          </p>
          <div className="flex items-center gap-2.5">
            <SocialButton label="Facebook"><FacebookIcon /></SocialButton>
            <SocialButton label="Twitter"><TwitterIcon /></SocialButton>
            <SocialButton label="Instagram"><InstagramIcon /></SocialButton>
            <SocialButton label="Email"><MailIcon /></SocialButton>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-[14.5px] mb-5">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            {QUICK_LINKS.map(({ label, href, isAnchor }) => (
              <li key={label}>
                {isAnchor ? (
                  <a
                    href={href}
                    onClick={(e) => handleAnchor(e, href)}
                    className={linkCls}
                  >
                    {label}
                  </a>
                ) : (
                  <Link to={href} className={linkCls}>
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-bold text-[14.5px] mb-5">Legal</h4>
          <ul className="flex flex-col gap-3">
            {LEGAL_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className={linkCls}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Bottom bar */}
      <div className="pt-5 text-center">
        <p className="text-[13px] text-blue-200/40">
          © 2026 AjoPlus. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;