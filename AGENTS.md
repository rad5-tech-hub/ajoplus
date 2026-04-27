# AjoPlus Agent Instructions

**Project**: AjoPlus — A fintech savings & referral platform built on the Ajo (African savings) model.

---

## 🎯 Non-Negotiable Principles

Every decision, optimization, and feature must honor these four core principles:

1. **🚀 Blazing Speed & Efficiency** — Works flawlessly on 2G/3G networks and low-end Android devices. Lazy-load features, code-split by route, compress assets, minimize JS bundles.
2. **🎨 Pixel-Perfect Fidelity** — Matches Figma designs exactly: colors, spacing, typography, hover states, animations. When Figma exists, it's the source of truth.
3. **🔒 Rock-Solid Reliability** — Zero random bugs, zero console errors, production-ready from day one. Global error boundaries, proper error messaging, graceful degradation.
4. **📐 Scalable & Maintainable Architecture** — Component-based structure that grows without refactoring. Clear separation of concerns, reusable components, no monolithic files.

**If a change violates ANY of these principles, reject it.** Discuss trade-offs with team before proceeding.

---

## Quick Start

**Build & Run**:
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run lint         # Check ESLint + type errors
npm run format       # Format code with Prettier
```

**Stack**: React 18 + TypeScript + Vite + Tailwind CSS v4 + Zustand + React Query + React Router v7

---

## Project Domain & Features

### User Roles
- **Customer**: Browse & purchase Ajo packages, make payments, track savings
- **Agent**: Track referrals, earn commissions, view earnings breakdown
- **Admin**: Approve payments, manage platform settings, handle withdrawals

### Core Features
1. **Ajo Packages**: Savings plans (food, fashion, electronics, events)
2. **Daily Ajo**: Recurring daily savings subscriptions
3. **E-commerce**: Browse products, shopping cart, checkout
4. **Payments**: Receipt upload → Admin approval flow
5. **Referral System**: Agent commissions based on referred customers
6. **Dashboards**: Role-specific analytics & management pages

---

## Architecture & Organization

### Feature-Based Structure
```
src/features/
├── landing/          → Public marketing site (10+ sections, navbar)
├── auth/             → Login/signup with role selection
├── browse/           → Product & package catalog
├── cart/             → Shopping cart management
├── customer/         → Customer dashboard, packages, payments
├── agent/            → Agent dashboard, referrals, earnings
├── admin/            → Admin dashboard, approvals, settings
```

### State Management (Zustand)
All stores use the `create<Interface>()(persist(...))` pattern:

- **`authStore.ts`**: User auth state, token, isAuthenticated (persisted to localStorage)
- **`CartStore.ts`**: Cart items, add/remove/clear operations (persisted)
- **`ModalStore.ts`**: Global modal/toast state (isOpen, type, title, message, callbacks)

**Access Pattern**:
```typescript
import { useAuthStore } from '@/app/store/authStore';
const { user, token, isAuthenticated, login, logout } = useAuthStore();
```

### Routing & Protected Routes
- **Public routes**: `/`, `/login`, `/signup`, `/browse`
- **Protected routes**: `/dashboard/*` (gated by `<ProtectedRoute>`)
- **Role-based RBAC**: `ProtectedRoute` component validates user roles before rendering
- **Route-level code splitting**: All routes use `React.lazy()` + `Suspense` for optimal 3G performance (9/9 implemented)

See [AppRouter.tsx](src/app/router/AppRouter.tsx) and [RouteSuspenseFallback.tsx](src/components/RouteSuspenseFallback.tsx).

### API Layer (NEW - IMPLEMENTED)
Centralized API module for all backend communication at [src/api/](src/api/):
- [client.ts](src/api/client.ts) — Base API client, auth headers, retry logic
- [auth.ts](src/api/auth.ts) — Authentication endpoints
- All stores import from `src/api/` (not hardcoding mock APIs)

Pattern: Easy backend integration—just update `src/api/` endpoints, no store changes needed.

---

## Development Conventions

### Naming Patterns
| Item | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `CustomerDashboard.tsx`, `PaymentModal.tsx` |
| Store hooks | `use<Name>` | `useAuthStore()`, `useCartStore()` |
| Files | PascalCase (components), camelCase (utils) | `Button.tsx`, `utils.ts` |
| Functions | camelCase | `addToCart()`, `validateEmail()` |
| Interfaces/Types | PascalCase | `AuthStore`, `ButtonProps` |

### Directory Layout
```
src/
├── app/
│   ├── providers.tsx      → React Query + Router config
│   ├── router/            → Routing logic
│   └── store/             → Zustand stores
├── components/
│   └── ui/                → Reusable UI components
├── features/
│   ├── <feature>/
│   │   ├── components/    → Feature-specific components
│   │   ├── dashboard/     → Feature dashboard pages
│   │   ├── sections/      → Landing page sections
│   │   └── types.ts       → Feature-specific types
├── lib/
│   └── utils.ts           → Utilities (cn function)
└── assets/                → Images, fonts, etc.
```

### TypeScript Best Practices
- **Interfaces for complex objects**: `interface ComponentProps extends HTMLAttributes<...>`
- **Generic stores**: `create<StoreName>()(persist(...))`
- **Props naming**: `ComponentName + Props` suffix
- **Colocate types**: Define feature types in `features/<feature>/types.ts`

### Styling with Tailwind CSS v4
- **Color scheme**: Emerald green (`emerald-600`, `emerald-500`) for primary, `slate-*` for text/borders
- **Spacing**: `px-4 py-3` for standard padding
- **Buttons**: `rounded-2xl` or `rounded-3xl`
- **Borders**: `border border-slate-200`
- **Conditional classes**: Use `cn()` function from [lib/utils.ts](src/lib/utils.ts)

**Example**:
```typescript
import { cn } from '@/lib/utils';

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700',
        className
      )}
      {...props}
    />
  );
}
```

### Component Organization
- **Feature components**: Split dashboards into smaller components (`OverviewCards`, `RecentTransactions`)
- **UI components**: Generic, reusable components in `src/components/ui/`
- **Modal pattern**: Use `useModalStore` for notifications; close after 2-3 seconds
- **Form pattern**: Controlled inputs with `useState`; validation in handlers

### Modal & Notification Pattern
```typescript
import { useModalStore } from '@/app/store/ModalStore';

const handleAction = () => {
  // Do something
  const { openModal, closeModal } = useModalStore.getState();
  openModal({ 
    type: 'success', 
    title: 'Success', 
    message: 'Action completed' 
  });
  setTimeout(() => closeModal(), 2500); // Auto-close
};
```

---

## Key Pages & Workflows

### Customer Workflow
1. **Browse** (`/browse`): View products/packages
2. **Add to Cart**: Select items, see cart summary
3. **Checkout**: Review cart items
4. **Payment** (`/dashboard/customer/payment/:id`): Upload receipt, submit for approval
5. **Dashboard** (`/dashboard/customer`): View packages, transactions, savings

### Agent Workflow
1. **Dashboard** (`/dashboard/agent`): View referral code, earnings, referred users
2. **Commission Structure**: See how referral bonuses work
3. **Referral Link**: Share link to earn commissions on customer signups

### Admin Workflow
1. **Dashboard** (`/dashboard/admin`): Payment approvals, withdrawal requests
2. **Approvals**: Approve/reject payment receipts
3. **Settings**: Configure platform parameters

---

## Common Tasks for Agents

### Adding a New Page
1. Create feature folder: `src/features/<feature>/`
2. Add page component: `src/features/<feature>/dashboard/FeaturePage.tsx`
3. Add route in [AppRouter.tsx](src/app/router/AppRouter.tsx)
4. Wrap protected routes with `<ProtectedRoute requiredRoles={['role']}>`

### Creating a Modal
1. Add component to `src/components/ui/` or feature folder
2. Accept `isOpen` and `onClose` props
3. Use `useModalStore` to check if this modal should open
4. Example: [PaymentApprovalModal.tsx](src/components/ui/PaymentApprovalModal.tsx)

### Adding State
1. Create store in `src/app/store/<StoreName>.ts` using Zustand
2. Export hooks: `export const useStoreName = ...`
3. Import in components: `const { state, action } = useStoreName()`
4. Add `persist` middleware for localStorage persistence

### Styling a Component
1. Use Tailwind utility classes directly in JSX
2. For conditional classes, use `cn()` from [lib/utils.ts](src/lib/utils.ts)
3. Follow color scheme: `emerald-*` for primary, `slate-*` for secondary
4. Ensure responsive: test at `sm` (640px), `md` (768px), `lg` (1024px)

### Handling Protected Routes
```typescript
import { ProtectedRoute } from '@/app/router/ProtectedRoute';

// In AppRouter.tsx
<Route
  path="/dashboard/customer/*"
  element={<ProtectedRoute requiredRoles={['customer']} />}
>
  <Route path="" element={<CustomerDashboard />} />
</Route>
```

---

## Libraries & Icons

### Core Dependencies
- **React 18**: UI framework
- **React Router v7**: Routing & navigation
- **Zustand**: State management
- **React Query**: Server state & caching (configured in [providers.tsx](src/app/providers.tsx))
- **Tailwind CSS v4**: Styling with `@tailwindcss/vite` plugin

### Utilities
- **Lucide React**: Icon library (`import { Icon } from 'lucide-react'`)
- **clsx + tailwind-merge**: Class merging utility (`cn()` function)

**Icon Examples**:
```typescript
import { ShoppingCart, Clock, Calendar, X, Plus, ChevronRight } from 'lucide-react';

<ShoppingCart className="w-6 h-6" />
```

---

## Common Patterns & Gotchas

### Auth Flow
1. User logs in → `authStore.login()` sets user, token, isAuthenticated
2. Token persisted to localStorage via Zustand persist
3. Protected routes redirect to `/login` if not authenticated
4. On app reload, auth state restored from localStorage

### Modal Management
- Always use `useModalStore.getState()` for imperative calls outside render
- Close modals after 2-3 seconds for better UX
- Use `type` prop to distinguish modal kinds (success, error, info, etc.)

### Data Fetching
- Use React Query hooks for server state (configured in providers)
- Default settings: `retry: 2`, `staleTime: 5min`, `gcTime: 10min`
- Replace mock APIs in stores with real endpoints via React Query

### Component Splitting
- Dashboards should be split into reusable components
- Keep component files under 300 lines for readability
- Feature-specific components go in `features/<feature>/components/`

### Responsive Design
- Mobile-first approach: base styles apply to all screens
- Use `sm:`, `md:`, `lg:` prefixes for breakpoints
- Test all pages across breakpoints using DevTools
- **REQUIRED**: Test on 3G network throttling (DevTools → Network → "Slow 3G") before shipping

---

## Type Safety Checklist

✅ All components have typed props  
✅ Store actions are typed with proper return types  
✅ API responses are typed (define in `features/<feature>/types.ts`)  
✅ Form handlers are properly typed: `(e: React.FormEvent) => void`  
✅ Event handlers typed: `(e: React.MouseEvent<HTMLButtonElement>) => void`  

---

---

## ⚡ Performance Optimization (3G/Low-End Device Critical)

### ✅ Route-Level Code Splitting (IMPLEMENTED)
All 9 dashboard routes lazy-loaded via `React.lazy()` + `Suspense`. See [AppRouter.tsx](src/app/router/AppRouter.tsx):
- Import with `lazy()`
- Wrap in `<Suspense fallback={<RouteSuspenseFallback />}>`
- Loading UI shown during chunk download: [RouteSuspenseFallback.tsx](src/components/RouteSuspenseFallback.tsx)

### Must-Do Checklist
- ✅ **Route-level code splitting**: Use `React.lazy()` + `Suspense` for each dashboard route
  ```typescript
  const CustomerDashboard = React.lazy(() => import('@/features/customer/dashboard/CustomerDashboard'));
  ```
- ✅ **Image optimization**: Use WebP with fallback PNG; compress to <50KB per image
- ✅ **Bundle size**: Keep total gzipped JS <250KB (check via `npm run build`)
- ✅ **API optimization**: Batch requests, use `staleTime` to minimize refetches
- ✅ **CSS optimization**: Tailwind removes unused classes in production; verify via build output

### Performance Tips

1. **Memoization**: Use `React.memo()` for expensive components; profile before applying
2. **Query Caching**: React Query caches by default; adjust `staleTime` for data freshness (default 5min is good)
3. **Code Splitting**: Route-based code splitting via `React.lazy()` + `Suspense` for every dashboard
4. **Bundle Analysis**: Run `npm run build && npm run preview` to audit bundle size
5. **Network**: Test on DevTools Slow 3G before every PR; emulate low-end Android (e.g., Moto G)
6. **CSS-in-JS**: Avoid runtime CSS generation; use Tailwind utilities only

### Anti-Patterns (Never Do)
- ❌ Import entire feature modules without code splitting
- ❌ Inline large images or uncompressed assets
- ❌ Use `staleTime: 0` (forces refetch on every mount)
- ❌ Add fonts without `font-display: swap` (blocks rendering)
- ❌ Bundle third-party libraries without tree-shaking
- ❌ Trust desktop DevTools alone; always test on 3G + low-end device

---

---

## 🎨 Design System & Figma Integration

### Color Palette (Authoritative)
- **Primary**: `emerald-600` (#059669), `emerald-500` (#10b981), `emerald-700` (#047857)
- **Text**: `slate-900` (#0f172a) for headings, `slate-700` (#374151) for body, `slate-500` (#64748b) for secondary
- **Borders**: `slate-200` (#e2e8f0)
- **Backgrounds**: `white` for cards, `slate-50` (#f8fafc) for page backgrounds
- **Status**: `red-600` (errors), `amber-500` (warnings), `green-600` (success), `blue-600` (info)

### Typography System
- **Headings**: Use semantic HTML `<h1>` through `<h3>` with Tailwind size classes
  - `text-3xl font-bold` for page titles
  - `text-xl font-semibold` for section headings
  - `text-lg font-medium` for subsections
- **Body**: `text-base` (16px) for primary text, `text-sm` (14px) for secondary
- **Line height**: `leading-6` for readable body text

### Component Variants
All components should support variants (size, color, state). Document via Storybook when feasible:
```typescript
interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';           // sm: px-2 py-1, md: px-4 py-3, lg: px-6 py-4
  variant?: 'primary' | 'secondary';   // primary: emerald-600, secondary: slate-200
  disabled?: boolean;                   // opacity-50, pointer-events-none
}
```

### Spacing Scale
- Use Tailwind spacing: `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-6` (24px), `p-8` (32px)
- Consistent gap between components: `gap-4` for lists, `gap-6` for sections
- Page padding: `px-4 py-8` (mobile), `px-6 py-10` (desktop)

### Micro-interactions
- **Buttons**: `hover:bg-emerald-700 active:scale-95 transition-all duration-200`
- **Modals**: Fade in/out with `opacity-0` → `opacity-100`, 200ms transition
- **Forms**: Focus rings: `focus:ring-2 focus:ring-emerald-500`
- **Tooltips/Popovers**: Slide in from above, 150ms ease-out

### Figma Workflow
1. **Before coding**: Export Figma token specs (colors, spacing, typography) to `tailwind.config.ts`
2. **During development**: Use browser DevTools to compare pixels (Design Mode in Chrome DevTools)
3. **After shipping**: Update Figma with actual component state (hover, active, disabled)

---

## 🔒 Reliability & Error Handling

### ✅ Global Error Boundary (IMPLEMENTED)
[AppErrorBoundary.tsx](src/components/AppErrorBoundary.tsx) catches all render crashes:
- Wraps entire app in [App.tsx](src/App.tsx)
- Displays user-friendly error page with retry button
- Logs errors to backend (Sentry/LogRocket ready to activate)
- Shows stack trace in development, clean UI in production
- Zero white screens of death ✅

### ✅ Error Monitoring (IMPLEMENTED)
[errorMonitoring.ts](src/lib/errorMonitoring.ts) initialized on app startup in [main.tsx](src/main.tsx):

```typescript
// Auto-captured:
- Uncaught exceptions + unhandled promise rejections
- Global error context (userId, page, action, metadata)
- Error severity levels (info, warning, error, critical)

// Usage:
import { captureError, captureWarning, setErrorUser } from '@/lib/errorMonitoring';
captureError(error, { action: 'submitPayment', userId });
setErrorUser(userId, email); // Called after login
```

Status: ✅ Ready for production. Uncomment Sentry/LogRocket init when credentials available.
Create [AppErrorBoundary.tsx](src/components/AppErrorBoundary.tsx) to wrap the app:
```typescript
class AppErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service (Sentry, LogRocket, etc.)
    console.error('App crashed:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

### Error Handling Patterns
1. **Try/Catch in async handlers**: Wrap API calls, state updates, and async operations
   ```typescript
   const handlePayment = async () => {
     try {
       const result = await submitPayment(formData);
       useModalStore.getState().openModal({ type: 'success', title: 'Payment submitted', message: '...' });
     } catch (error) {
       useModalStore.getState().openModal({ type: 'error', title: 'Payment failed', message: error.message || 'Please try again' });
     }
   };
   ```
2. **Validation before submission**: Always validate user input before sending to API
3. **Graceful fallbacks**: Show placeholder content instead of crashing if optional data fails to load
4. **Error logging**: Send errors to external service (Sentry, LogRocket) for production monitoring

### Console Error Prevention
- ✅ Use React Query for server state (handles loading/error states)
- ✅ Type all props; let TypeScript catch type mismatches
- ✅ Use optional chaining: `user?.email` not `user.email`
- ✅ Validate data shape before rendering: `if (!user) return null`
- ❌ Never suppress errors with `.catch(() => null)` without logging
- ❌ Don't use `any` type; define proper interfaces
- ❌ Don't mutate store state directly; use setters

### Testing for Reliability
```bash
npm run lint              # Catch type & style issues
tsc --noEmit              # Full type check before building
npm run build             # Verify production build succeeds
```

---

## 📐 Scalable Architecture Guidelines

### API Layer Extraction (IMPORTANT)
Current stores have mock APIs hardcoded. Extract to `src/api/` for easy backend swap:
```typescript
// src/api/auth.ts
export const loginUser = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
};

// In authStore.ts
const login = async (email: string, password: string) => {
  try {
    const user = await loginUser(email, password);
    set({ user, isAuthenticated: true });
  } catch (error) {
    throw error;
  }
};
```

### Domain-Driven State
Organize stores by domain, not by UI layer:
```
src/app/store/
├── auth/              # Authentication domain
│   ├── authStore.ts
│   └── authTypes.ts
├── cart/              # Shopping cart domain
│   ├── CartStore.ts
│   └── cartTypes.ts
├── payments/          # Payment processing domain
│   ├── PaymentStore.ts
│   └── paymentTypes.ts
└── common/            # Shared modals, notifications
    └── ModalStore.ts
```

### Component File Size Limit
- ✅ Keep components under 300 lines
- ✅ Split large dashboards into smaller, reusable sub-components
- ✅ Move complex logic to hooks or utility functions
- ❌ Don't create 500+ line component files

### Feature Folder Completeness
Every feature should have:
```
src/features/customer/
├── components/        # Feature-specific reusable components
├── dashboard/         # Feature main page
├── hooks/             # Feature-specific hooks (if complex)
├── types.ts           # TypeScript interfaces
└── constants.ts       # Feature constants (if needed)
```

---

## Debugging & Logs

- **React Query DevTools**: Included in `providers.tsx`; toggle with `Ctrl+Alt+Q`
- **Zustand Store Inspection**: Logs in browser DevTools → Application → localStorage
- **ESLint Warnings**: Run `npm run lint` to catch issues early
- **Type Errors**: Run `tsc` to check TypeScript errors before building
- **Network Throttling**: Always test with DevTools Slow 3G before shipping

---

## File Templates

### New Feature Page
```typescript
import { useAuthStore } from '@/app/store/authStore';

export function FeaturePage() {
  const { user } = useAuthStore();

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Feature Name</h1>
      {/* Content */}
    </div>
  );
}

export default FeaturePage;
```

### New Zustand Store
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  value: string;
  setValue: (v: string) => void;
}

export const useMyStore = create<StoreState>()(
  persist(
    (set) => ({
      value: '',
      setValue: (v) => set({ value: v }),
    }),
    { name: 'my-store' }
  )
);
```

---

---

## Questions or Issues?

- Check [README.md](README.md) for general setup
- Review existing features in `src/features/` for patterns
- Run `npm run lint` to catch style issues
- Use TypeScript compiler: `tsc --noEmit` for type checking
- **Always verify**: 3G performance, Figma fidelity, error handling, code organization before PR
