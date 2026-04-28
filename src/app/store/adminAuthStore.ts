// src/app/store/adminAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as adminAPI from '@/api/admin';

export interface AdminAuthStore {
	admin: { id: string; email: string; role: 'admin' } | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	login: (email: string, password: string) => Promise<void>;
	register: (fullName: string, email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	clearError: () => void;
}

function getErrorMessage(err: unknown, fallback: string): string {
	if (err instanceof Error) return err.message;
	if (typeof err === 'string') return err;
	return fallback;
}

export const useAdminAuthStore = create<AdminAuthStore>()(
	persist(
		(set) => ({
			admin: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,

			login: async (email: string, password: string) => {
				set({ isLoading: true, error: null });
				try {
					const { admin, token } = await adminAPI.loginAdmin({ email, password });
					set({
						admin,
						token,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (err: unknown) {
					set({
						error: getErrorMessage(err, 'Invalid admin credentials'),
						isLoading: false,
					});
					throw err;
				}
			},

			register: async (fullName: string, email: string, password: string) => {
				set({ isLoading: true, error: null });
				try {
					await adminAPI.registerAdmin({
						fullName,
						email,
						password,
						role: 'admin',
					});
					// After successful registration, auto-login
					await adminAPI.loginAdmin({ email, password });
					set({ isLoading: false });
				} catch (err: unknown) {
					set({
						error: getErrorMessage(err, 'Failed to create admin account'),
						isLoading: false,
					});
					throw err;
				}
			},

			logout: async () => {
				await adminAPI.logoutAdmin().catch(console.warn);
				set({
					admin: null,
					token: null,
					isAuthenticated: false,
					error: null,
				});
			},

			clearError: () => set({ error: null }),
		}),
		{
			name: 'ajoplus-admin-auth-storage',
			partialize: (state) => ({
				admin: state.admin,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);
