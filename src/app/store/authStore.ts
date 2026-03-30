// src/app/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import { useMutation } from '@tanstack/react-query';
import { AuthStore, LoginCredentials, SignupData, User } from '@/features/auth/types';

// Simulated API calls (replace with real axios/fetch later)
const api = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock successful login
    return {
      user: {
        id: 'user_123',
        fullName: 'Test User',
        email: credentials.email,
        phone: '+2348034567890',
        role: credentials.email.includes('admin') ? 'admin' : 
              credentials.email.includes('agent') ? 'agent' : 'customer',
        createdAt: new Date().toISOString(),
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  },

  signup: async (data: SignupData): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      user: {
        id: 'new_user_' + Date.now(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.accountType as 'customer' | 'agent',
        createdAt: new Date().toISOString(),
      },
      token: 'mock_jwt_token_' + Date.now(),
    };
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, ) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await api.login(credentials);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || 'Invalid credentials',
            isLoading: false,
          });
          throw err;
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await api.signup(data);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: err.message || 'Failed to create account',
            isLoading: false,
          });
          throw err;
        }
      },

      logout: () => {
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