# AjoPlus Agent Instructions

**Project**: AjoPlus — A fintech savings & referral platform built on the Ajo (African savings) model.

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

See [AppRouter.tsx](src/app/router/AppRouter.tsx) for routing structure.

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

---

## Type Safety Checklist

✅ All components have typed props  
✅ Store actions are typed with proper return types  
✅ API responses are typed (define in `features/<feature>/types.ts`)  
✅ Form handlers are properly typed: `(e: React.FormEvent) => void`  
✅ Event handlers typed: `(e: React.MouseEvent<HTMLButtonElement>) => void`  

---

## Performance Tips

1. **Memoization**: Use `React.memo()` for expensive components
2. **Query Caching**: React Query caches by default; adjust `staleTime` for data freshness
3. **Code Splitting**: Route-based code splitting via React Router lazy loading
4. **Bundle**: Vite tree-shakes unused code; check `npm run build` output

---

## Debugging & Logs

- **React Query DevTools**: Included in `providers.tsx`; toggle with `Ctrl+Alt+Q`
- **Zustand Store Inspection**: Logs in browser DevTools → Application → localStorage
- **ESLint Warnings**: Run `npm run lint` to catch issues early
- **Type Errors**: Run `tsc` to check TypeScript errors before building

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

## Questions or Issues?

- Check [README.md](README.md) for general setup
- Review existing features in `src/features/` for patterns
- Run `npm run lint` to catch style issues
- Use TypeScript compiler: `tsc --noEmit` for type checking

Blazing speed & efficiency (even on 2G/3G and low-end Android devices).
Pixel-perfect fidelity to provided Figma designs when available (exact colors, spacing, typography, micro-interactions).
Rock-solid reliability (zero random bugs, zero console errors, production-ready from day one).
Scalability & maintainability (professional component-based architecture that can grow without refactoring).
