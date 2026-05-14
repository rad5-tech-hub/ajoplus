// src/app/store/adminAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as adminAPI from '@/api/admin';

export interface AdminAuthStore {
	admin: { id: string; fullName: string; email: string; role: 'admin' } | null;
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
						admin: {
							id: admin.id,
							fullName: admin.fullName ?? email.split('@')[0], // fallback to email prefix
							email: admin.email,
							role: admin.role,
						},
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
					const { admin, token } = await adminAPI.loginAdmin({ email, password });
					set({
						admin: {
							id: admin.id,
							fullName, // preserve fullName from registration
							email: admin.email,
							role: admin.role,
						},
						token,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (err: unknown) {
					set({
						error: getErrorMessage(err, 'Failed to create admin account'),
						isLoading: false,
					});
					throw err;
				}
			},

			logout: async () => {
				// Clear all persisted stores with correct keys
				const STORAGE_KEYS = [
					'AbaGold-admin-auth-storage',
					'AbaGold-auth-storage',
					'AbaGold-cart',
					'daily-ajo-storage',
					'AbaGold-withdrawals',
					'AbaGold-pending-payments',
					'AbaGold-migration-v3',
				];
				STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

				set({
					admin: null,
					token: null,
					isAuthenticated: false,
					error: null,
				});

				// Call API in background (don't await)
				adminAPI.logoutAdmin().catch((err) => {
					console.warn('[adminAuthStore.logout] logout API failed', err);
				});

				// Force navigation to admin login — store change alone won't
				// trigger re-render in AdminProtectedRoute because the app
				// may already be on an admin page that doesn't re-check.
				window.location.href = '/admin/login';
			},

			clearError: () => set({ error: null }),
		}),
		{
			name: 'AbaGold-admin-auth-storage',
			partialize: (state) => ({
				admin: state.admin,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);
