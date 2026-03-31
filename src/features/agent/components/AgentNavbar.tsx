// src/features/customer/dashboard/components/CustomerNavbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Menu, X, LayoutDashboard, UserCog, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '@/app/store/authStore';
import { useCartStore } from '@/app/store/CartStore';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard/customer', icon: LayoutDashboard },
  { label: 'Browse', to: '/browse', icon: null },
  { label: 'Agent', to: '/dashboard/agent', icon: UserCog },
  { label: 'Admin', to: '/dashboard/admin', icon: ShieldCheck },
];

const AgentNavbar = () => {
  const { user, logout } = useAuthStore();
  const { getCount } = useCartStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartCount = getCount();
  const firstName = user?.fullName?.split(' ')[0] ?? 'User';

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/browse') {
      return location.pathname.startsWith('/browse');
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav
        className={`bg-white border-b border-slate-100 sticky top-0 z-50 transition-shadow duration-200 ${
          scrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/dashboard/customer" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg leading-none">
              A+
            </div>
            <span className="font-bold text-[18px] sm:text-[20px] tracking-tight text-slate-900 hidden xs:block">
              AjoPlus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`transition-colors duration-150 ${
                  isActive(to)
                    ? 'text-emerald-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">

            {/* Cart Icon with Live Count */}
            <Link 
              to="/browse" 
              className="relative p-2.5 text-slate-600 hover:text-emerald-600 transition-colors rounded-xl hover:bg-slate-100"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-medium w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile Chip */}
            <div className="bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-sm font-medium cursor-default select-none">
              <User className="w-4 h-4 shrink-0" />
              <span className="hidden md:block">{user?.fullName}</span>
              <span className="hidden sm:block md:hidden">{firstName}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Logout</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Drawer Content */}
        <div
          className={`absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-xl transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="px-5 py-6 flex flex-col gap-2">
            {NAV_LINKS.map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] font-medium transition-all ${
                  isActive(to)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {label}
              </Link>
            ))}

            <div className="h-px bg-slate-100 my-4" />

            {/* Logout in Drawer */}
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl text-[15px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgentNavbar;