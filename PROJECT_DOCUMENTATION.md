# AbaGold — Full Project Documentation

## Overview

**AbaGold** is a Nigerian fintech savings and e-commerce platform built on the **Ajo model** (rotational savings). It supports three user roles — **Customer**, **Agent**, and **Admin** — each with distinct dashboards and capabilities. The app is a React 18 SPA with TypeScript, Vite, Tailwind CSS v4, Zustand, and React Query.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite 5** | Build tool and dev server |
| **Tailwind CSS v4** | Styling (utility-first, `@tailwindcss/vite` plugin) |
| **Zustand** | Client state management (auth, cart, daily Ajo, modals) |
| **React Query (TanStack Query v5)** | Server state, caching, polling |
| **React Router v7** | SPA routing with lazy-loaded routes |
| **Lucide React** | Icon library |
| **clsx + tailwind-merge** | Class merging (`cn()` utility) |

---

## Project Structure

```
ajoplus/
├── public/                    # Static assets (copied to dist/ as-is)
│   ├── favicon.png            # AbaGold logo as favicon
│   └── .htaccess              # Apache SPA rewrite rules (critical for cPanel)
├── scripts/                   # Build/utility scripts
│   ├── rebrand.cjs            # Emerald → Amber color swap (Phase 1)
│   ├── rebrand-phase2.cjs     # Text/border color context swaps (Phase 2)
│   └── fix-remaining-emerald.cjs  # Remaining emerald-800/900/950 references
├── src/
│   ├── api/                   # API layer — every backend call lives here
│   │   ├── client.ts          # Base API client: auth headers, retry, FormData
│   │   ├── auth.ts            # Login, signup, logout
│   │   ├── admin.ts           # Admin auth endpoints
│   │   ├── public.ts          # Public (no-auth) endpoints for packages & products
│   │   ├── package.ts         # Package CRUD + user packages
│   │   ├── product.ts         # Product CRUD
│   │   ├── payments.ts        # Payment submission, approval, rejection
│   │   ├── withdrawals.ts     # Withdrawal submission, approval
│   │   ├── savingPlan.ts      # Multi-savings plan CRUD
│   │   ├── registrationFee.ts # Registration fee submission + admin management
│   │   ├── ads.ts             # Advertisement CRUD
│   │   ├── customer.ts        # Customer wallet + dashboard
│   │   ├── agent.ts           # Agent referral data
│   │   ├── cart.ts / carts.ts # Cart sync
│   │   ├── categories.ts      # Package categories
│   │   ├── settings.ts        # Platform settings (bank details, commission)
│   │   ├── transactions.ts    # Transaction history
│   │   ├── wallet.ts          # Wallet operations
│   │   ├── adminProducts.ts   # Admin product transactions
│   │   ├── adminPackages.ts   # Admin package members + finalize
│   │   ├── adminSavings.ts    # Admin savings overview
│   │   └── adminUsers.ts      # Admin expired users
│   ├── app/
│   │   ├── providers.tsx      # React Query provider + devtools
│   │   ├── router/
│   │   │   ├── AppRouter.tsx          # ALL routes (public, customer, agent, admin)
│   │   │   ├── ProtectedRoute.tsx     # RBAC: checks auth + role
│   │   │   └── AdminProtectedRoute.tsx # Admin-specific auth gate
│   │   └── store/             # Zustand stores + React Query hooks
│   │       ├── authStore.ts           # User auth (customers + agents)
│   │       ├── adminAuthStore.ts      # Admin auth (separate system)
│   │       ├── CartStore.ts           # Shopping cart (persisted to localStorage)
│   │       ├── DailyAjoStore.ts       # Daily Ajo savings state
│   │       ├── PackageStore.ts        # Package queries + mutations
│   │       ├── PaymentStore.ts        # Payment queries + mutations
│   │       ├── BannerStore.ts         # Advertisement queries + mutations
│   │       ├── RegistrationFeeStore.ts # Registration fee hooks
│   │       ├── SavingPlanStore.ts     # Multi-savings plan hooks
│   │       ├── CustomerStore.ts       # Customer dashboard + wallet
│   │       ├── ModalStore.ts          # Global modal/toast state
│   │       ├── SettingsStore.ts       # Platform settings hooks
│   │       ├── TransactionStore.ts    # Transaction history hooks
│   │       ├── SavingsAdminStore.ts   # Admin savings queries
│   │       ├── WithdrawalStore.ts     # Withdrawal hooks (complete)
│   │       ├── WithdrwalStore.ts      # Withdrawal hooks (typo'd name, older)
│   │       ├── PendingPaymentStore.ts # Local pending payment tracker
│   │       └── AdminStore.ts          # Admin overview data
│   ├── components/
│   │   ├── AppErrorBoundary.tsx       # Global error boundary (catches render crashes)
│   │   ├── RouteSuspenseFallback.tsx  # Loading spinner for lazy routes
│   │   └── ui/                       # Reusable UI components
│   │       ├── Button.tsx             # Base button with variants
│   │       ├── CameraCaptureModal.tsx # Live camera capture via getUserMedia()
│   │       ├── PromotionalBanner.tsx  # Admin-managed banner ad
│   │       ├── DailyAjoSetupModal.tsx # Setup/create Ajo savings plan
│   │       ├── DailyAjoWithdrawModal.tsx # Withdraw from savings
│   │       ├── UploadReceiptModal.tsx # General receipt upload
│   │       ├── PaymentSuccess.tsx     # Payment submission success screen
│   │       ├── PaymentApprovalModal.tsx # Admin approval success modal
│   │       ├── PaymentRejectedModal.tsx # Rejection confirmation modal
│   │       ├── RejectPaymentModal.tsx # Admin reject payment with reason
│   │       ├── ReceiptPreviewModal.tsx # View receipt image
│   │       ├── GeneralModal.tsx       # Generic success/error/info modal
│   │       ├── PaymentStatusBanner.tsx # Pending/rejected payment banners
│   │       ├── PendingActivityBanner.tsx # Local pending activity tracker
│   │       ├── CategoryManagement.tsx  # Admin category CRUD
│   │       ├── CreatePackageModal.tsx  # Admin create package form
│   │       ├── CreateProductModal.tsx  # Admin create product form
│   │       └── ScrollToTop.tsx         # Scroll-to-top on route change
│   ├── features/               # Feature-based modules
│   │   ├── auth/               # Authentication (login, signup, types)
│   │   │   ├── types.ts        # User, AuthStore, SignupData interfaces
│   │   │   ├── LoginPage.tsx   # Customer/agent login with role-based routing
│   │   │   ├── SignUpPage.tsx  # 5-step wizard with camera capture
│   │   │   └── components/
│   │   │       ├── RegistrationFeeModal.tsx    # Fee payment after signup
│   │   │       ├── PendingApprovalOverlay.tsx  # Non-dismissible pending overlay
│   │   │       └── AjoSetupBlockModal.tsx      # Blocks Ajo setup until fee paid
│   │   ├── landing/            # Public marketing site
│   │   │   ├── LandingPage.tsx # Section orchestrator
│   │   │   ├── components/
│   │   │   │   ├── NavBar.tsx  # Sticky nav with scroll-shadow
│   │   │   │   ├── Footer.tsx  # Dark navy footer with links
│   │   │   │   ├── AdBanner.tsx # Old ad system (replaced by PromotionalBanner)
│   │   │   │   └── AdSlot.tsx  # Old ad slot bridge
│   │   │   ├── sections/       # Each landing page section
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── HowItWorksSection.tsx
│   │   │   │   ├── PackagesSection.tsx    # Live from public API
│   │   │   │   ├── ProductsSection.tsx    # Live from public API
│   │   │   │   ├── ReferralSection.tsx
│   │   │   │   ├── Faq.tsx
│   │   │   │   └── ... (DailyAjoSection, ChooseAjo, CtaSection, Testimonies)
│   │   │   └── types/, constants/, utils/  # Old ad system files
│   │   ├── browse/             # Public browse page
│   │   │   ├── types.ts        # PublicPackage, PublicProduct types
│   │   │   ├── BrowsePage.tsx  # Tabs: all/packages/products, search, filter, pagination
│   │   │   └── components/
│   │   │       ├── BrowseTabs.tsx  # Tab bar (All/Packages/Products)
│   │   │       └── ProductCard.tsx # Product card with stock status + add-to-cart
│   │   ├── customer/           # Customer dashboard and flows
│   │   │   ├── dashboard/
│   │   │   │   └── CustomerDashboard.tsx # Main customer dashboard
│   │   │   ├── components/
│   │   │   │   ├── AjoDailySavings.tsx    # Savings sidebar card
│   │   │   │   ├── OverviewCards.tsx      # Summary metric cards
│   │   │   │   ├── RecentTransactions.tsx
│   │   │   │   ├── CustomerNavbar.tsx
│   │   │   │   ├── UserPackageCard.tsx    # Package card with claim code display
│   │   │   │   ├── ClaimCodeSection.tsx   # Claim code copy UI
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   └── NeedHelp.tsx
│   │   │   ├── packages/
│   │   │   │   ├── MyPackages.tsx         # Sorted package list (active first, completed last)
│   │   │   │   └── PackagesDetail.tsx     # Single package detail with payment flow
│   │   │   ├── Payments/
│   │   │   │   ├── MakePayment.tsx        # Payment page (savings, cart, package)
│   │   │   │   └── components/
│   │   │   │       ├── PaymentBankDetails.tsx  # Bank account info display
│   │   │   │       └── PaymentUploadReceipt.tsx # Receipt upload form
│   │   │   └── savings/
│   │   │       └── SavingsManagement.tsx  # Multi-savings management page
│   │   ├── agent/              # Agent dashboard
│   │   │   ├── dashboard/
│   │   │   │   └── AgentDashboard.tsx     # Referrals, earnings, performance
│   │   │   └── components/
│   │   │       ├── AgentNavbar.tsx
│   │   │       ├── OverviewCards.tsx
│   │   │       ├── ReferredUsers.tsx
│   │   │       ├── ReferralCode.tsx
│   │   │       ├── EarningsBreakdown.tsx
│   │   │       ├── CommissionStructure.tsx
│   │   │       ├── PerformanceTips.tsx
│   │   │       ├── AgentSince.tsx
│   │   │       └── ReferralLink.tsx
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── dashboard/
│   │   │   │   └── AdminDashboard.tsx    # Tabbed dashboard with 8 tabs
│   │   │   ├── auth/
│   │   │   │   ├── AdminLoginPage.tsx
│   │   │   │   └── AdminSignupPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── AgentNavbar.tsx       # Shared admin navbar
│   │   │   │   ├── OverviewCards.tsx     # Admin overview metrics
│   │   │   │   ├── PackageManagement.tsx # Admin CRUD for packages
│   │   │   │   ├── ProductManagement.tsx # Admin CRUD for products
│   │   │   │   ├── PaymentApprovals.tsx  # Approve/reject payments
│   │   │   │   ├── RegistrationFeeApprovals.tsx  # Approve/reject registration fees
│   │   │   │   ├── PendingRegistrationFees.tsx   # Pending fee submissions (new API)
│   │   │   │   ├── ExpiredRegistrations.tsx      # Expired user registrations
│   │   │   │   ├── RejectRegistrationModal.tsx   # Reject with reason modal
│   │   │   │   ├── WithdrawalRequests.tsx # Approve/reject withdrawals
│   │   │   │   ├── BannerAdManager.tsx   # Promotional banner configuration
│   │   │   │   ├── PlatformSettings.tsx  # Commission rate, bank details
│   │   │   │   ├── schemas.ts, types.ts  # Admin-specific types
│   │   │   ├── packages/
│   │   │   │   └── PackageMemberList.tsx # View/finalize package members
│   │   │   ├── products/
│   │   │   │   └── ProductTransactions.tsx # View product transactions
│   │   │   └── savings/
│   │   │       └── SavingsOverview.tsx   # All savers overview
│   │   ├── savings/             # Multi-savings feature (shared)
│   │   │   ├── types.ts        # SavingsPlan interface
│   │   │   ├── api.ts          # fetchSavingsPlans with wallet merge
│   │   │   ├── utils.ts        # Monthly rollover, commission calc
│   │   │   ├── hooks/
│   │   │   │   └── useSavings.ts # Savings React Query hooks
│   │   │   └── components/
│   │   │       ├── SavingsOverview.tsx    # Portfolio + savings list
│   │   │       ├── SavingsCard.tsx        # Individual savings plan card
│   │   │       ├── SavingsList.tsx        # Grid of savings cards
│   │   │       └── SavingsSetupButton.tsx # Create new savings plan
│   │   ├── cart/               # Shopping cart & checkout
│   │   │   ├── ShoppingCart.tsx
│   │   │   └── Checkout.tsx
│   │   └── legal/
│   │       └── TermsAndConditions.tsx # Full terms page with 4 sections
│   ├── lib/
│   │   ├── utils.ts            # cn() utility
│   │   ├── currency.ts         # formatCurrency, formatDualCurrency
│   │   └── errorMonitoring.ts  # Global error capture
│   ├── assets/
│   │   ├── ABAGOLD LOGO.png
│   │   ├── dailyajo.jpg
│   │   └── react.svg
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Root component with providers + error boundary
│   ├── index.css               # Tailwind import
│   └── vite-env.d.ts
├── index.html                  # SPA entry (references /src/main.tsx)
├── vite.config.ts              # Vite config with @ alias, manual chunks
├── vercel.json                 # SPA rewrite rules for Vercel deployment
├── tsconfig.json
├── eslint.config.js
├── package.json
└── .gitignore
```

---

## Routing Architecture

```
PUBLIC (no auth):
  /                          → LandingPage (lazy)
  /login                     → LoginPage (lazy)
  /signup                    → SignUpPage (lazy)
  /admin/login               → AdminLoginPage (lazy)
  /admin/signup              → AdminSignupPage (lazy)
  /browse                    → BrowsePage (lazy)
  /terms                     → TermsAndConditions (lazy)
  /unauthorized              → Static text
  *                          → 404 text

PROTECTED — Customer (role: customer):
  /dashboard/customer              → CustomerDashboard (lazy)
  /dashboard/customer/savings      → SavingsManagement (lazy)
  /dashboard/customer/package/:id  → PackagesDetail (lazy)
  /dashboard/customer/payment/:id  → MakePayment (lazy)
  /dashboard/customer/payment/     → MakePayment (lazy)

PROTECTED — Agent (role: agent):
  /dashboard/agent                 → AgentDashboard (lazy)

PROTECTED — Admin (separate auth):
  /dashboard/admin                      → AdminDashboard (lazy)
  /dashboard/admin/packages/:id/members → PackageMemberList (lazy)
  /dashboard/admin/products/:id/transactions → ProductTransactions (lazy)
  /dashboard/admin/savings              → SavingsOverview (lazy)

PROTECTED — Customer + Agent (shared):
  /cart            → ShoppingCart (lazy)
  /checkout        → Checkout (lazy)
  /payment/success → PaymentSuccess (lazy)
```

All dashboard routes are **lazy-loaded** via `React.lazy()` + `Suspense` for optimal 3G performance. The `RouteSuspenseFallback` component shows a full-page spinner animation while chunks download.

---

## Authentication System

**Two completely separate auth systems:**
1. **Regular users** (customers + agents) → `useAuthStore()` → localStorage key `AbaGold-auth-storage`
2. **Admins** → `useAdminAuthStore()` → localStorage key `AbaGold-admin-auth-storage`

### User Model (`src/features/auth/types.ts`)
```typescript
interface User {
  id: string; fullName: string; email: string; phoneNumber: string;
  role: 'customer' | 'agent' | 'admin';
  agentId?: string;
  accountStatus: 'pending' | 'active' | 'inactive' | 'suspended';
  registrationFeeStatus?: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  renewalDate?: string;
}
```

### Auth Flow
1. **Signup**: 5-step wizard (Personal Info → Address → Bank Details → Account Setup → Security). After account creation, both customers and agents see the `RegistrationFeeModal` to submit proof of ₦1,000 fee payment
2. **Login**: After successful auth, user is routed to their role-based dashboard via `ROLE_ROUTES` mapping
3. **Logout**: Clears 7 localStorage keys + React Query cache

### Role-Based Access Control
- `ProtectedRoute` wraps customer/agent routes with `requiredRoles` prop
- `AdminProtectedRoute` wraps admin routes using the separate `useAdminAuthStore`
- Both were previously broken (hooks in try/catch — now fixed)

---

## API Layer

### Base Client (`src/api/client.ts`)
- **`apiCall<T>(endpoint, options)`**: Generic typed API caller
- Auto-injects `Authorization: Bearer <token>` header from Zustand persisted storage
- **Public endpoints** (`/api/auth/login`, `/api/auth/signup`, `/api/auth/refresh`) never receive auth headers
- **FormData detection**: Automatically skips `Content-Type` header for multipart uploads (lets browser set boundary)
- GET requests get **exponential backoff retry** (1s → 2s → 4s, max 3 attempts)
- 4xx errors (400, 401, 403, 404, 422) never retried — fail immediately
- **Token source**: checks `AbaGold-auth-storage` first, falls back to `AbaGold-admin-auth-storage`

### Public API (No Auth Required)
Used by landing page and browse page. These use **direct `fetch()` calls** instead of `apiCall()` to avoid auth header injection entirely:
- `GET /api/package/public` → `fetchPublicPackages()`
- `GET /api/product/public?page=N` → `fetchPublicProducts(page)`

### Important: Token Retrieval Edge Case
If a user is logged into BOTH regular and admin accounts, `getAuthToken()` returns the regular user's token first. Admin API calls on the admin dashboard correctly use the admin token because `AdminProtectedRoute` gates access, but the `apiCall()` function doesn't differentiate — it returns whichever token it finds first. The `useAdminAuthStore` has its own `getAuthToken`-like logic in its API calls (`admin.ts`).

---

## State Management

### Zustand Stores (Client State)

| Store | Key Fields | Persisted? |
|---|---|---|
| `authStore` | user, token, refreshToken, isAuthenticated | ✅ `AbaGold-auth-storage` |
| `adminAuthStore` | admin, token, isAuthenticated | ✅ `AbaGold-admin-auth-storage` |
| `CartStore` | items[], cartId, addToCart, removeFromCart, clearCart | ✅ `AbaGold-cart` |
| `DailyAjoStore` | isActive, dailyAmount, totalSaved, commissionPaid, availableBalance, daysSaved | ⚠️ `partialize: () => ({})` (nothing persists) |
| `ModalStore` | isOpen, type, title, message, openModal, closeModal | ❌ |
| `PendingPaymentStore` | pending[] | ❌ |
| `WithdrawalStore` | pending[] | ❌ |

### React Query Hooks (Server State)

Key query keys and their stale times:

| Query Key | Hook | staleTime | Purpose |
|---|---|---|---|
| `['userPackages']` | `useUserPackages` | 60s | User's joined packages |
| `['availablePackages']` | `useAvailablePackages` | 10min | Browse packages (admin API) |
| `['publicPackages']` | React Query in PackagesSection | 5min | Landing page packages |
| `['publicProducts', page]` | React Query in ProductsSection | 5min | Landing page products |
| `['wallet']` | `useCustomerWallet` | 60s | Customer wallet + savings plans |
| `['savingPlans']` | `useGetSavingPlans` | 60s | Multi-saving plans list |
| `['savings', 'plans']` | `useSavingsPlans` | 60s | Savings plans (merged with wallet data) |
| `['registrationFee', 'status']` | `useRegistrationFeeStatus` | 30s + refetchInterval:30s | Fee status polling |
| `['payments']` | `useGetPayments` | 3min | User's payments |
| `['ads', 'active']` | `useActiveAdvert` | 5min | Active promotional banner |
| `['customerDashboard']` | `useCustomerDashboard` | 60s | Dashboard summary |
| `['banner']` | `useBanner` | 5min | Old banner config |
| `['product', id]` | React Query | 5min | Single product detail |

### `smartRetry` Pattern
Every React Query hook uses a shared `smartRetry` predicate:
```typescript
const smartRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof APIError) return false; // 4xx/5xx — never retry
  return failureCount < 2;                     // network errors — up to 2 retries
};
```

---

## Color System (Post-Rebrand)

The project was rebranded from **emerald green** to **amber gold + navy blue** to match the AbaGold logo:

| Role | Class | Hex (approx) |
|---|---|---|
| Primary buttons / CTAs | `bg-amber-600` | `#d97706` |
| Button hover | `bg-amber-700` | `#b45309` |
| Page headings | `text-blue-950` | `#172554` |
| Borders | `border-amber-200` | `#fde68a` |
| Light backgrounds | `bg-amber-50` | `#fffbeb` |
| Status success | `bg-green-100 text-green-700` | unchanged |
| Status error | `bg-red-100 text-red-600` | unchanged |
| Status warning | `bg-yellow-100 text-yellow-700` | unchanged |
| Text body | `text-slate-700` | unchanged |
| Text secondary | `text-slate-500` | unchanged |
| Card backgrounds | `bg-white` | unchanged |

The rebrand was applied via 3 scripts (`scripts/rebrand*.cjs`) that performed word-boundary regex replacements across all 75+ `.tsx`/`.ts` files.

---

## Savings System (Multi-Savings)

### How It Works
- Users can create **multiple independent savings plans** via `POST /api/saving-plan/setup`
- Each plan has its own `id`, `amount` (daily), `installmentAmount`, `commissionAmount`, and `description`
- The `GET /api/customer/wallet` endpoint now returns a **wallets array** — each wallet linked to a plan via `savingPlanId`:
  ```typescript
  { totalBalance, wallets: [{ id, savingPlanId, dailyAmount, totalSaved, ... }] }
  ```
- The `fetchSavingsPlans()` function in `features/savings/api.ts` **merges** plan metadata (from `GET /api/saving-plan/setup`) with wallet data (from `GET /api/customer/wallet`) by matching `savingPlanId` → `plan.id`
- The dashboard sidebar (`AjoDailySavings`) shows **aggregate** data across all plans
- The management page (`/dashboard/customer/savings`) shows each plan as an individual card

### Payment for Savings
- Uses `POST /api/payment/manual-payment` with `paymentType: 'saving'` and `savingPlanId` field
- The `savingPlanId` is passed through route state from the savings card's "Add to Savings" button

### Withdrawals for Savings
- Uses `POST /api/customer/wallet/withdrawals` with `{ amount, walletId, description }`
- `walletId` is the wallet's ID (from `savingPlanId` → wallet lookup), NOT the saving plan ID
- Each savings plan has its own wallet with unique `walletId`

---

## Registration Fee System

### Flow
1. **After signup**: Both agents and customers see `RegistrationFeeModal` to submit ₦1,000 fee proof
2. **On completion**: User is redirected to `/login`
3. **Post-login**: `GET /api/registration-fee/me/status` is polled every 30 seconds
4. **Agents**: See `PendingApprovalOverlay` — non-dismissible full-screen modal blocks the entire dashboard until `status === 'approved'`
5. **Customers**: See `AjoSetupBlockModal` — dismissible modal that only blocks Ajo setup, not the full dashboard

### Admin Management
- **"Registration Fees" tab** in Admin Dashboard: approve/reject pending fee submissions with reason
- **"Expired Registrations" tab**: paginated list of users whose fee has expired (> 1 year)

---

## Package System

### Package Statuses
| Status | Meaning | Customer View |
|---|---|---|
| `active` | Ongoing payments | Shows progress bar, payment CTA |
| `completed` | Fully paid | Shows claim code section, sorted to bottom |
| `suspended` | Payments halted | Shows inactive state |
| `inactive` | Not started | Shows join CTA |

### Claim Codes
When a package reaches `status === 'completed'` and `claimCode` is present, the `ClaimCodeSection` renders below the card with:
- Monospace claim code pill with copy button (2s "Copied ✓" feedback)
- Issued date
- Completed packages are sorted to the **bottom** of the list (active/pending first)

### Sorting Logic (`MyPackages.tsx`)
```typescript
const order = { active: 0, pending: 1, completed: 2, inactive: 3, suspended: 4 };
// ... then by createdAt descending within each group
```

---

## Advertisement System

### Real Endpoints (wired May 2026)
- `GET /api/ads/advert` → Returns all ads with pagination meta
- `POST /api/ads/advert` → Create ad (FormData: title, subtitle, buttonText, buttonLink, background, isActive, startDate, endDate, bannerImage)
- `PATCH /api/ads/advert/:id` → Update ad (FormData, partial)

### Frontend
- **Landing page**: `PromotionalBanner` component reads the first active ad and renders it as a full-width gradient banner
- **Admin panel**: `BannerAdManager` component in "Promotional Banner" tab — create/edit ads with live preview
- `background` field supports `linear-gradient(...)` CSS values
- `buttonText` / `buttonLink` render as a CTA button on the banner

---

## Withdrawal System

### Customer Side
- `DailyAjoWithdrawModal` — accepts `walletId` prop, sends `POST /api/customer/wallet/withdrawals`
- Minimum ₦100 withdrawal, cannot exceed `availableBalance`
- Pending withdrawals shown in `PaymentStatusBanner`

### Admin Side
- `WithdrawalRequests` component in Admin Dashboard → "Withdrawals" tab
- Approve/reject with reason
- History tabs for approved/rejected

---

## Key Technical Details

### TypeScript Interfaces to Be Aware Of

**`UserPackage`** (in `api/package.ts`):
```typescript
interface UserPackage {
  id: string; userId: string; packageId: string; duration: number;
  installmentAmount: string; totalPaid: string;
  paymentFrequency: 'daily' | 'weekly' | 'monthly';
  nextPaymentDate: string; status: 'active' | 'inactive' | 'completed' | 'suspended';
  startDate: string; createdAt: string; updatedAt: string;
  package: Package & { category: Category | null };
  remainingBalance: number; progress: number; progressLabel: string;
  claimCode: string | null; claimIssuedAt: string | null;
}
```

**`Package.category`** — Can be a **string** ("Food & Groceries") OR a **Category object** `{ id, name }` depending on the endpoint. Use `getPackageCategoryName(pkg)` helper.

**`PublicPackage`** (in `api/public.ts`): Has `category: { id: string; name: string } | null` — always an object or null.

**`Advert`** (in `api/ads.ts`): Has `background: string` — the CSS gradient value like `"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"`. Used inline via `style={{ background: ad.background }}`.

### Known Duplicate Files
- `WithdrawalStore.ts` vs `WithdrwalStore.ts` (typo) — both exist with slightly different hooks. `WithdrwalStore.ts` has the simpler hooks used by `DailyAjoWithdrawModal`.
- `api/cart.ts` vs `api/carts.ts` — both exist. `CartStore.ts` imports from `carts.ts`.

### React Query Manual Chunks (in vite.config.ts)
```typescript
manualChunks: {
  vendor: ['react', 'react-dom', 'react-router-dom'],
  query: ['@tanstack/react-query'],
}
```
All other routes are automatically code-split by `React.lazy()`.

### SPA Deployment
- **Vercel**: `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- **cPanel/Apache**: `public/.htaccess` with mod_rewrite + `ErrorDocument 404 /index.html` fallback
- The `.htaccess` is placed in `public/` so Vite copies it to `dist/` during build

---

## Current Known Issues

1. **Duplicate withdrawal stores**: `WithdrawalStore.ts` (complete) and `WithdrwalStore.ts` (typo, simpler). `DailyAjoWithdrawModal` imports from the typo'd one.
2. **Duplicate cart API files**: `api/cart.ts` and `api/carts.ts` — both exist, `CartStore` imports from `carts.ts`.
3. **useBanner / useActiveAdvert**: Both `BannerStore` and individual components may reference the old `useBanner` hook from the pre-ads era. The new system uses `useActiveAdvert` from the same store file.
4. **Missing public API key in env**: The `public.ts` API file uses `import.meta.env.VITE_API_BASE_URL` which needs to be set in the deployment environment.
5. **Per-plan wallet amounts**: Individual savings plan cards show `totalSaved: 0` and `availableBalance: 0` when a plan is newly created with no approved payments yet. The backend's per-plan wallet reflects pending amounts correctly after admin approval.
6. **Old ad system files**: `AdBanner.tsx`, `AdSlot.tsx`, `adConfig.ts`, `adTypes.ts` still exist in `landing/` but are no longer imported. They can be removed.

---

## Quick Start

```bash
npm install                    # Install dependencies
npm run dev                    # Dev server at http://localhost:5173
npm run build                  # Production build to dist/
npm run lint                   # ESLint check
npx tsc --noEmit               # TypeScript type check
```

## Environment Variables

```
VITE_API_BASE_URL=https://api.yourapp.com  # Backend base URL
```
