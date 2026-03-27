// src/features/customer/dashboard/components/CustomerNavbar.tsx
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, User, Menu, X, LayoutDashboard, UserCog, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/app/store/authStore';

const NAV_LINKS = [
  { label: 'Dashboard', to: '/dashboard/customer', icon: LayoutDashboard },
  { label: 'Agent',     to: '/dashboard/customer',  icon: UserCog },
  { label: 'Admin',     to: '#',                   icon: ShieldCheck },
];

const CustomerNavbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // First name only for tight spaces
  const firstName = user?.fullName?.split(' ')[0] ?? 'User';

  return (
    <>
      <nav
        className={[
          'bg-white border-b border-slate-100 sticky top-0 z-50 transition-shadow duration-200',
          scrolled ? 'shadow-sm' : '',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">

          {/* ── Logo ── */}
          <Link to="/dashboard/customer" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg leading-none select-none">
              A+
            </div>
            <span className="font-bold text-[18px] sm:text-[20px] tracking-tight text-slate-900 hidden xs:block">
              AjoPlus
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={label}
                  to={to}
                  className={[
                    'transition-colors duration-150',
                    active
                      ? 'text-emerald-600 font-semibold'
                      : 'text-slate-500 hover:text-slate-900',
                  ].join(' ')}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Right side: user chip + logout + hamburger ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* User chip — full name on md+, first name on sm, icon-only on xs */}
            <div className="bg-emerald-50 text-emerald-700 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 text-xs sm:text-sm font-medium cursor-default select-none">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              {/* Show first name only on small; full name on md+ */}
              <span className="hidden sm:block md:hidden">{firstName}</span>
              <span className="hidden md:block">{user?.fullName}</span>
            </div>

            {/* Logout — icon + label on md+, icon-only on mobile */}
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-150 text-xs sm:text-sm font-medium cursor-pointer"
              aria-label="Logout"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:block">Logout</span>
            </button>

            {/* Hamburger — md and below */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 transition-colors duration-150"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      <div className={['fixed inset-0 z-40 md:hidden transition-all duration-300', menuOpen ? 'pointer-events-auto' : 'pointer-events-none'].join(' ')}>
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          className={['absolute inset-0 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300', menuOpen ? 'opacity-100' : 'opacity-0'].join(' ')}
        />

        {/* Slide-down panel */}
        <div
          className={[
            'absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg',
            'transition-transform duration-300 ease-in-out',
            menuOpen ? 'translate-y-0' : '-translate-y-full',
          ].join(' ')}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-150',
                    active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}

            <div className="h-px bg-slate-100 my-2" />

            {/* Logout row in drawer */}
            <button
              onClick={() => { setMenuOpen(false); logout(); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-150 w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerNavbar;