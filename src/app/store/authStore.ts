// src/app/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, LoginCredentials, SignupData, User } from '@/features/auth/types';
import * as authAPI from '@/api/auth';

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
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          const errorMessage = err.message || 'Invalid credentials';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw err;
        }
      },

      signup: async (data: SignupData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authAPI.signupUser(data);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          const errorMessage = err.message || 'Failed to create account';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw err;
        }
      },

      logout: async () => {
        // Notify backend of logout (non-blocking)
        authAPI.logoutUser().catch(console.warn);
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'ajoplus-auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);