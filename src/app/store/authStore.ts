// src/app/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, LoginCredentials, SignupData } from '@/features/auth/types';
import * as authAPI from '@/api/auth';

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return fallback;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token, refreshToken } = await authAPI.loginUser(credentials);
          set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          set({ error: getErrorMessage(err, 'Invalid credentials'), isLoading: false });
          throw err;
        }
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token, refreshToken } = await authAPI.signupUser(data);
          set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          set({ error: getErrorMessage(err, 'Failed to create account'), isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        // Clear all persisted stores with correct keys
        const STORAGE_KEYS = [
          'AbaGold-auth-storage',
          'AbaGold-admin-auth-storage',
          'AbaGold-cart',
          'daily-ajo-storage',
          'AbaGold-withdrawals',
          'AbaGold-pending-payments',
          'AbaGold-migration-v3',
        ];
        STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

        // Clear all stores + React Query cache
        const { useDailyAjoStore } = await import('@/app/store/DailyAjoStore');
        const { useCartStore } = await import('@/app/store/CartStore');
        const { QueryClient } = await import('@tanstack/react-query');

        await useDailyAjoStore.getState().clearForLogout();
        useCartStore.getState().clearCart?.();
        useCartStore.setState?.({ cartId: undefined });

        // Clear React Query cache to prevent stale data for next user
        try {
          new QueryClient().clear();
        } catch {
          // Ignore if QueryClient not available
        }

        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: null });

        // Call API in background (don't await)
        authAPI.logoutUser().catch((err) => {
          console.warn('[authStore.logout] logout API failed', err);
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'AbaGold-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);