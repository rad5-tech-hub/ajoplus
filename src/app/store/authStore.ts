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
        try {
          await authAPI.logoutUser();
        } catch (err) {
          console.warn('[authStore.logout] logout API failed', err);
        } finally {
          set({ user: null, token: null, refreshToken: null, isAuthenticated: false, error: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'ajoplus-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);