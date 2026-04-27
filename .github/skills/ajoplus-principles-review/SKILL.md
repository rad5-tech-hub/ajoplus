---
name: ajoplus-principles-review
description: "**WORKFLOW SKILL** — Code review checklist for AjoPlus non-negotiable principles. USE WHEN: reviewing PRs, validating architecture decisions, checking performance optimizations, ensuring Figma fidelity, catching reliability issues. VALIDATES: route-level code splitting, error handling, API layer separation, bundle size, design system compliance, type safety. FOR: Pre-merge validation, architectural reviews, catching anti-patterns before they reach main branch."
---

# AjoPlus Principles Review Checklist

This skill helps validate that code changes honor all 4 non-negotiable AjoPlus principles before merging.

## When to Use This Skill

- **Reviewing pull requests** for architecture compliance
- **Validating new features** against principles
- **Catching anti-patterns** before they reach production
- **Performance audits** for 3G/low-end device support
- **Design system validation** for pixel-perfect Figma alignment
- **Reliability checks** for error handling and type safety

---

## 🚀 Principle 1: Blazing Speed & Efficiency

### Code Splitting ✅
- [ ] New dashboard routes use `React.lazy()` + `Suspense` in [AppRouter.tsx](src/app/router/AppRouter.tsx)
- [ ] No direct imports of dashboard components (should be lazy-loaded)
- [ ] RouteSuspenseFallback loader displays during chunk download

**Example of correct pattern:**
```typescript
const CustomerDashboard = lazy(() => import('@/features/customer/dashboard/CustomerDashboard'));
// Wrapped in Suspense with fallback
<Suspense fallback={<RouteSuspenseFallback />}>
  <CustomerDashboard />
</Suspense>
```

### Bundle Size 📦
- [ ] `npm run build` produces **gzipped JS < 250KB** total
- [ ] No unnecessary dependencies added
- [ ] Tree-shaking enabled (Vite default)
- [ ] Used `npm run preview` to test production build

### Image Optimization 🖼️
- [ ] Images are WebP format with PNG fallback
- [ ] All images compressed to < 50KB
- [ ] No inline SVGs > 2KB (should be sprite or component)
- [ ] Lazy-loaded images use `loading="lazy"` attribute

### API Optimization 🔗
- [ ] Multiple API calls are batched (not N+1 queries)
- [ ] React Query `staleTime` configured appropriately (default 5min is good)
- [ ] No `staleTime: 0` forcing refetch on every mount
- [ ] Pagination implemented for large lists

### Network Testing 📡
- [ ] Tested on **DevTools Slow 3G** (not just desktop)
- [ ] Page loads under 5s on 3G
- [ ] All critical features work on low-end Android (Moto G emulation)
- [ ] No layout shift during lazy loading

### Anti-Patterns to Reject ❌
- ❌ All routes imported directly (no code splitting)
- ❌ Inline large images or uncompressed assets
- ❌ `staleTime: 0` in React Query config
- ❌ Fonts without `font-display: swap`
- ❌ Only tested on desktop DevTools

---

## 🎨 Principle 2: Pixel-Perfect Fidelity

### Design System Compliance ✅
- [ ] Only Tailwind utilities used (no custom CSS)
- [ ] Color palette matches design system:
  - Primary: `emerald-600` (#059669)
  - Text: `slate-900`, `slate-700`, `slate-500`
  - Borders: `slate-200` (#e2e8f0)
  - Status: `red-600`, `amber-500`, `green-600`, `blue-600`

### Typography Hierarchy 📝
- [ ] Page titles: `text-3xl font-bold`
- [ ] Section headings: `text-xl font-semibold`
- [ ] Subsections: `text-lg font-medium`
- [ ] Body text: `text-base` (primary), `text-sm` (secondary)
- [ ] Line height: `leading-6` for readable body

### Spacing & Layout 📐
- [ ] Padding: `px-4 py-3` standard (consistent)
- [ ] Gap between lists: `gap-4`
- [ ] Gap between sections: `gap-6`
- [ ] Page padding: `px-4 py-8` (mobile), `px-6 py-10` (desktop)
- [ ] No arbitrary spacing values (use Tailwind scale)

### Buttons & Interactive Elements 🔘
- [ ] Primary buttons: `rounded-2xl` or `rounded-3xl`
- [ ] Hover state: `hover:bg-emerald-700`
- [ ] Active state: `active:scale-95`
- [ ] Disabled state: `opacity-50 pointer-events-none`
- [ ] Transitions: `transition-all duration-200`

### Micro-interactions ✨
- [ ] Forms have focus ring: `focus:ring-2 focus:ring-emerald-500`
- [ ] Modals fade in: `opacity-0` → `opacity-100`, 200ms
- [ ] Tooltips slide in from above, 150ms ease-out
- [ ] Loading spinner smooth: `animate-spin`

### Figma Comparison 🎯
- [ ] Used Chrome DevTools Design Mode to pixel-compare
- [ ] Colors match Figma tokens exactly
- [ ] Spacing/alignment matches mockup ±2px
- [ ] Hover/active states implemented as shown in Figma

### Anti-Patterns to Reject ❌
- ❌ Hardcoded hex colors (use `emerald-*`, `slate-*`)
- ❌ Custom CSS outside Tailwind (breaks design system)
- ❌ Inconsistent spacing (should use `px-4`, `gap-4` scale)
- ❌ No hover/focus states
- ❌ Did not compare to Figma before shipping

---

## 🔒 Principle 3: Rock-Solid Reliability

### Error Handling ✅
- [ ] Global error boundary wraps app in [App.tsx](src/App.tsx)
- [ ] All async operations wrapped in try/catch
- [ ] User-facing error messages are clear (not technical jargon)
- [ ] Validation happens before API submission
- [ ] Graceful fallbacks for failed optional data loads

### Error Monitoring 📊
- [ ] Error monitoring initialized in [main.tsx](src/main.tsx)
- [ ] Production errors logged to backend (or Sentry/LogRocket)
- [ ] Error context includes userId, page, action for tracking
- [ ] Error UI allows user to retry or go home

### Type Safety 🛡️
- [ ] All components have typed props (`ComponentProps` interface)
- [ ] No `any` types (use proper interfaces)
- [ ] Store actions typed with proper return types
- [ ] API responses typed in `features/<feature>/types.ts`
- [ ] Form handlers typed: `(e: React.FormEvent) => void`
- [ ] Event handlers typed: `(e: React.MouseEvent<HTMLButtonElement>) => void`

### Console Cleanliness 🧹
- [ ] No console errors or warnings
- [ ] Used optional chaining: `user?.email` not `user.email`
- [ ] Data validation before render: `if (!user) return null`
- [ ] No suppressed errors (never `.catch(() => null)`)
- [ ] ESLint passes: `npm run lint`
- [ ] TypeScript passes: `tsc --noEmit`

### Modal & User Feedback 💬
- [ ] Success messages auto-close after 2-3 seconds
- [ ] Error messages stay visible until user dismisses
- [ ] Toast notifications don't block content
- [ ] Modal feedback is clear and actionable

### Testing Checklist ✓
- [ ] Ran `npm run lint` (no ESLint errors)
- [ ] Ran `tsc --noEmit` (full type check)
- [ ] Ran `npm run build` (production build succeeds)
- [ ] Tested on 3G network (sees loading states, no crashes)
- [ ] Tested error scenarios (offline, API failure, validation)

### Anti-Patterns to Reject ❌
- ❌ No global error boundary
- ❌ Async code without try/catch
- ❌ Generic error messages ("Error", "Failed")
- ❌ Using `any` type anywhere
- ❌ Console errors or warnings
- ❌ Only tested on happy path (no error scenarios)

---

## 📐 Principle 4: Scalable & Maintainable Architecture

### Component Organization ✅
- [ ] Components under 300 lines (split if larger)
- [ ] Feature dashboards split into smaller sub-components
- [ ] Feature-specific components in `features/<feature>/components/`
- [ ] Reusable UI components in `src/components/ui/`
- [ ] No monolithic files (e.g., no 500+ line components)

### API Layer Separation 🔌
- [ ] API calls extracted to `src/api/` (not hardcoded in stores)
- [ ] Each domain has dedicated API module (`auth.ts`, `payments.ts`, etc.)
- [ ] Store imports from `src/api/`, not defining API inline
- [ ] Backend URL configurable via environment variable
- [ ] Easy to swap mock API for real endpoints

### State Management 💾
- [ ] Zustand stores use `create<StoreName>()(persist(...))`
- [ ] Domain-driven organization (auth, cart, payments domains)
- [ ] Actions are typed with return types
- [ ] No direct state mutations (use setters)
- [ ] Persist middleware used for localStorage sync

### File Structure 📁
- [ ] Feature folders complete: `components/`, `dashboard/`, `types.ts`
- [ ] Type definitions co-located: `features/<feature>/types.ts`
- [ ] Constants extracted: `features/<feature>/constants.ts`
- [ ] Utils in `src/lib/` (not scattered)
- [ ] No `misc/` or `utils/` catch-all folders

### Naming Conventions 📝
- [ ] Components: PascalCase (`CustomerDashboard.tsx`)
- [ ] Utilities/functions: camelCase (`formatCurrency()`)
- [ ] Stores: `use<Name>` (`useAuthStore()`)
- [ ] Interfaces: PascalCase (`ComponentProps`, `AuthStore`)
- [ ] Files: PascalCase (components), camelCase (utils)

### Code Reusability 🔄
- [ ] Repeated logic extracted to hooks or utilities
- [ ] Shared components used across features
- [ ] Modal patterns consistent (via `useModalStore`)
- [ ] Form validation centralized (not duplicated)
- [ ] Colors/spacing use design tokens (not arbitrary)

### Feature Completeness ✓
```
src/features/newFeature/
├── components/        ✓ Feature-specific reusable components
├── dashboard/         ✓ Feature main page
├── hooks/             ✓ Feature-specific hooks (if complex)
├── types.ts           ✓ TypeScript interfaces
└── constants.ts       ✓ Feature constants (if needed)
```

### Protected Routes & RBAC 🔐
- [ ] New protected routes wrapped in `<ProtectedRoute requiredRoles={[...]}>`
- [ ] Role check in [ProtectedRoute.tsx](src/app/router/ProtectedRoute.tsx)
- [ ] Unauthorized access handled gracefully
- [ ] Auth state persisted via Zustand

### Anti-Patterns to Reject ❌
- ❌ Components over 300 lines
- ❌ API calls hardcoded in stores
- ❌ Repeated logic (copy-paste code)
- ❌ Monolithic files (e.g., Dashboard.tsx with 500 lines)
- ❌ State management scattered across components
- ❌ No feature folder structure

---

## 🎯 Pre-Merge Validation Checklist

Before approving a PR, verify ALL of the following:

### Performance ⚡
- [ ] Route code-splitting implemented (if new dashboard)
- [ ] Bundle size check: `npm run build` < 250KB gzipped
- [ ] Tested on 3G network (DevTools Slow 3G)
- [ ] No images over 50KB uncompressed
- [ ] No unnecessary API calls

### Design 🎨
- [ ] Colors use design system (`emerald-*`, `slate-*`)
- [ ] Spacing consistent (`px-4`, `gap-4` scale)
- [ ] Typography hierarchy correct (sizes, weights)
- [ ] Micro-interactions smooth (transitions, hover states)
- [ ] Figma comparison shows pixel-perfect match

### Reliability 🔒
- [ ] No console errors or warnings
- [ ] Type safety: `tsc --noEmit` passes
- [ ] Error handling: try/catch on async operations
- [ ] Error messages are user-friendly (not technical)
- [ ] Global error boundary catches render errors

### Architecture 📐
- [ ] Components under 300 lines
- [ ] API layer separated (`src/api/`)
- [ ] Feature folders complete
- [ ] No code duplication
- [ ] Naming conventions followed
- [ ] Protected routes properly gated

### Testing ✓
```bash
npm run lint              # Pass
tsc --noEmit              # Pass
npm run build             # Success
npm run preview           # No build artifacts
# Test on 3G + low-end device
```

---

## 🚨 Critical Issues (Auto-Reject)

Reject PRs that have:
1. ❌ **No global error boundary** handling render crashes
2. ❌ **All routes imported directly** (no code splitting on dashboards)
3. ❌ **API layer mixed with stores** (hardcoded mock API in Zustand)
4. ❌ **Console errors** (`npm run lint` fails)
5. ❌ **Type errors** (`tsc --noEmit` fails)
6. ❌ **No error handling** on async operations
7. ❌ **Components over 300 lines** without justification
8. ❌ **Design system violations** (hardcoded colors, inconsistent spacing)
9. ❌ **Only tested on desktop** (no 3G/low-end device testing)
10. ❌ **No Figma comparison** (design fidelity unverified)

---

## 📚 Related Documentation

- [AGENTS.md](AGENTS.md) — Non-negotiable principles (source of truth)
- [AppRouter.tsx](src/app/router/AppRouter.tsx) — Route-level code splitting pattern
- [AppErrorBoundary.tsx](src/components/AppErrorBoundary.tsx) — Global error handling
- [src/api/](src/api/) — API layer organization
- [errorMonitoring.ts](src/lib/errorMonitoring.ts) — Error logging setup

---

## 💡 Quick Reference

| Principle | Key Files | Critical Checks |
|-----------|-----------|-----------------|
| **Speed** | [AppRouter.tsx](src/app/router/AppRouter.tsx) | Code splitting, bundle size, 3G tested |
| **Fidelity** | [tailwind.config.ts](tailwind.config.ts), design system | Colors exact, spacing consistent, Figma match |
| **Reliability** | [AppErrorBoundary.tsx](src/components/AppErrorBoundary.tsx), error handling | No console errors, type-safe, error messages clear |
| **Scalability** | [API layer](src/api/), feature folders | Components < 300 lines, API separated, RBAC gated |
