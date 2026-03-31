// src/features/landing/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/app/store/CartStore';

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
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-[#16a34a] rounded-xl flex items-center justify-center text-white font-extrabold text-[15px] leading-none select-none">
              A+
            </div>
            <span className="font-bold text-[19px] tracking-tight text-[#0f2d3d]">
              AjoPlus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7 text-[14px] font-medium text-slate-500">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleAnchor(e, href)}
                className="hover:text-[#0f2d3d] transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Desktop Right Side: Cart + Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Cart Icon with Count */}
            <Link 
              to="/cart" 
              className="relative p-3 text-slate-600 hover:text-emerald-600 transition-colors rounded-xl hover:bg-slate-100 group"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-medium min-w-4.5 h-4.5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            <Link
              to="/login"
              className="px-5 py-2 text-[14px] font-medium text-slate-600 hover:text-[#0f2d3d] transition-colors duration-150 rounded-xl"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.97] text-white text-[14px] font-semibold rounded-xl transition-all duration-150"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile: Cart + Login + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            
            {/* Mobile Cart */}
            <Link 
              to="/cart" 
              className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Login Button */}
            <Link
              to="/login"
              className="px-4 py-1.5 text-[13px] font-medium text-slate-600 hover:text-[#0f2d3d] transition-colors"
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
                className="px-4 py-4 text-[15px] font-medium text-slate-600 hover:text-[#0f2d3d] hover:bg-gray-50 rounded-2xl transition-colors"
              >
                {label}
              </a>
            ))}

            <div className="h-px bg-gray-100 my-4" />

            {/* Cart Link in Mobile Menu */}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-4 text-[15px] font-medium text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Cart 
              {cartCount > 0 && (
                <span className="ml-auto bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full">
                  {cartCount} items
                </span>
              )}
            </Link>

            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="mt-2 w-full text-center px-5 py-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-[15px] font-semibold rounded-2xl transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;