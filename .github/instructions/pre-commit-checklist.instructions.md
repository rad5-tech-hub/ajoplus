---
name: ajoplus-pre-commit-checklist
description: "Quick pre-commit checklist for AjoPlus non-negotiable principles. Run before pushing any branch. Validates code splitting, error handling, bundle size, design compliance, type safety in under 1 minute. Use when: preparing to commit, validating before PR, catching issues early."
applyTo: "src/**/*.tsx,src/**/*.ts"
---

# AjoPlus Pre-Commit Checklist

Quick validation before committing code. Run these checks locally to catch issues early.

## 🚦 Run These Commands (2 min)

```bash
# 1. Lint & type check
npm run lint
tsc --noEmit

# 2. Build production bundle
npm run build

# 3. Check bundle size
# Output shows gzipped size - should be < 250KB

# 4. Preview build (test locally)
npm run preview
# Visit http://localhost:4173
# Test on DevTools Slow 3G
```

## ✅ File-Specific Checks

### New/Modified Route Components
- [ ] Uses `React.lazy()` + `Suspense` in AppRouter.tsx
- [ ] Has `RouteSuspenseFallback` loader
- [ ] No direct import (should be lazy-loaded)

### New/Modified API Calls
- [ ] Exported from `src/api/` module (not hardcoded in store)
- [ ] Has proper error handling (try/catch)
- [ ] Uses `retryApiCall()` for resilience
- [ ] Typed response with interface

### New/Modified UI Components
- [ ] Uses Tailwind utilities only (no custom CSS)
- [ ] Primary color: `emerald-*`
- [ ] Secondary color: `slate-*`
- [ ] Has hover/active/focus states
- [ ] Under 300 lines (split if larger)

### New/Modified Store
- [ ] Uses Zustand `create<Name>()(persist(...))`
- [ ] Actions are typed with return types
- [ ] API calls imported from `src/api/`
- [ ] Error handling in try/catch
- [ ] No state mutations (use setters)

### New/Modified Error Handling
- [ ] Wrapped async in try/catch
- [ ] User-friendly error messages
- [ ] Error logged via `captureError()`
- [ ] Graceful fallback for failures

## 🎯 Design System Quick Check

**Colors** (Run in browser console):
```javascript
// Check if colors use design tokens
// ✅ emerald-600, emerald-500, slate-900, slate-200
// ❌ #059669, #374151, rgb(15, 23, 42) [hardcoded]
```

**Spacing** (Visual check):
- [ ] Buttons/inputs: `px-4 py-3`
- [ ] List gaps: `gap-4`
- [ ] Section gaps: `gap-6`
- [ ] Page padding: `px-4 py-8` or `px-6 py-10`

**Typography** (Visual check):
- [ ] Page title: Large, bold (`text-3xl font-bold`)
- [ ] Section heading: Medium, semi-bold (`text-xl font-semibold`)
- [ ] Body text: Regular size (`text-base`)
- [ ] Secondary text: Small (`text-sm`)

## ⚡ Performance Quick Check

**Bundle Size** (After `npm run build`):
```
✅ < 250KB gzipped
⚠️ 250-300KB: Review what was added
❌ > 300KB: Something is wrong, investigate
```

**3G Test** (DevTools Network):
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Hard refresh page
4. [ ] Page visible in < 5 seconds
5. [ ] All interactions work smoothly

## 🛡️ Type & Lint Check

```bash
npm run lint
# ✅ No errors or warnings
# ❌ Fix all issues before committing
```

```bash
tsc --noEmit
# ✅ No type errors
# ❌ Add missing types
```

## 📋 Commit Message Template

```
[FEAT|FIX|REFACTOR] <description>

# Principles Checklist:
- [x] ⚡ Performance: Code-split routes, tested 3G
- [x] 🎨 Fidelity: Design system colors/spacing, Figma match
- [x] 🔒 Reliability: Error handling, type-safe, no console errors
- [x] 📐 Scalable: Components < 300 lines, API layer separated

# Changes:
- ...

# Testing:
- Tested on [3G/Desktop/Mobile]
- [Error scenarios tested/N/A]
```

## ⏰ Estimated Time

- Lint/Type: 10 seconds
- Build: 30 seconds
- 3G Test: 1 minute
- **Total: ~2 minutes**

If any check fails, fix before pushing to PR.

## 🚨 Don't Commit If

- ❌ `npm run lint` fails
- ❌ `tsc --noEmit` has errors
- ❌ `npm run build` fails
- ❌ Console has errors/warnings
- ❌ Not tested on 3G
- ❌ Colors don't match design system
- ❌ Async code without try/catch
- ❌ Components over 300 lines (unjustified)
- ❌ API hardcoded in store

---

## 📚 Need Help?

- Questions? See [AGENTS.md](../../../AGENTS.md) non-negotiable principles
- Design system? Check [Design System & Figma Integration](../../../AGENTS.md#-design-system--figma-integration)
- Performance? See [Performance Optimization](../../../AGENTS.md#-performance-optimization-3glow-end-device-critical)
- Reliability? See [Reliability & Error Handling](../../../AGENTS.md#-reliability--error-handling)
- Architecture? See [Scalable Architecture Guidelines](../../../AGENTS.md#-scalable-architecture-guidelines)

---

Good luck! 🚀
