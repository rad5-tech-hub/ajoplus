// src/features/landing/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, MessageCircle, Mail, Phone, X } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';
import abaGoldLogo from '@/assets/ABAGOLD LOGO.png';

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Packages', href: '#packages' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const location = useLocation();

  // Cart functionality
  const { getCount } = useCartStore();
  const cartCount = getCount();

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Add shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Smooth-scroll to section and close mobile menu
  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={[
          'sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100',
          'transition-shadow duration-200',
          scrolled ? 'shadow-sm' : '',
        ].join(' ')}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 shrink-0 focus:outline-none cursor-pointer"
            aria-label="Go to top"
          >
            <img src={abaGoldLogo} alt="ABAGOLD Logo" className="h-9 w-auto border border-gray-300 rounded-lg" />
            <span className="font-bold text-[19px] tracking-tight text-brand-900">
              AbaGold
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7 text-[14px] font-medium text-slate-500">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchor(e, href)}
                className="hover:text-brand-900 transition-colors duration-150"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => setShowContact(true)}
              className="hover:text-brand-900 transition-colors duration-150 cursor-pointer"
            >
              Contact
            </button>
          </div>

          {/* Desktop Right Side: Cart + Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">

            {/* Cart Icon with Count */}
            <Link
              to="/cart"
              className="relative p-3 text-slate-600 hover:text-brand-600 transition-colors rounded-xl hover:bg-brand-50 group"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-medium min-w-4.5 h-4.5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            <Link
              to="/login"
              className="px-5 py-2 text-[14px] font-medium text-slate-600 hover:text-brand-900 transition-colors duration-150 rounded-xl"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 active:scale-[0.97] text-white text-[14px] font-semibold rounded-xl transition-all duration-150"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile: Cart + Login + Hamburger */}
          <div className="flex md:hidden items-center gap-3">

            {/* Mobile Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-600 hover:text-brand-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login Button */}
            <Link
              to="/login"
              className="px-4 py-1.5 text-[13px] font-medium text-slate-600 hover:text-brand-900 transition-colors"
            >
              Login
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-gray-100 transition-colors duration-150"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={[
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          menuOpen ? 'pointer-events-auto' : 'pointer-events-none',
        ].join(' ')}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={[
            'absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300',
            menuOpen ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        />

        {/* Drawer Panel */}
        <div
          className={[
            'absolute top-16 left-0 right-0 bg-white border-b border-gray-100 shadow-xl',
            'transition-transform duration-300 ease-in-out',
            menuOpen ? 'translate-y-0' : '-translate-y-full',
          ].join(' ')}
        >
          <div className="px-5 py-6 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchor(e, href)}
                className="px-4 py-4 text-[15px] font-medium text-slate-600 hover:text-brand-900 hover:bg-brand-50 rounded-2xl transition-colors"
              >
                {label}
              </a>
            ))}
            <button
              onClick={() => { setShowContact(true); setMenuOpen(false); }}
              className="px-4 py-4 text-[15px] font-medium text-slate-600 hover:text-brand-900 hover:bg-brand-50 rounded-2xl transition-colors text-left w-full cursor-pointer"
            >
              Contact
            </button>

            <div className="h-px bg-gray-100 my-4" />

            {/* Cart Link in Mobile Menu */}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-4 text-[15px] font-medium text-slate-600 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart
              {cartCount > 0 && (
                <span className="ml-auto bg-brand-600 text-white text-xs px-2.5 py-0.5 rounded-full">
                  {cartCount} items
                </span>
              )}
            </Link>

            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="mt-2 w-full text-center px-5 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-[15px] font-semibold rounded-2xl transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm mx-auto shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-brand-900">Get in Touch</h2>
              <button
                onClick={() => setShowContact(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium hover:bg-green-100 transition-all">
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <a href="mailto:"
                className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-medium hover:bg-blue-100 transition-all">
                <Mail className="w-5 h-5" />
                Send an Email
              </a>
              <a href="tel:"
                className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 font-medium hover:bg-amber-100 transition-all">
                <Phone className="w-5 h-5" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;