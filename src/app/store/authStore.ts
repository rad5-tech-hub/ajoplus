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
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authAPI.loginUser(credentials);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          set({ error: getErrorMessage(err, 'Invalid credentials'), isLoading: false });
          throw err;
        }
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authAPI.signupUser(data);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          set({ error: getErrorMessage(err, 'Failed to create account'), isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        authAPI.logoutUser().catch(console.warn);
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'ajoplus-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);