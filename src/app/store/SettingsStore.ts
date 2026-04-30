// // src/app/store/SettingsStore.ts
// import { create } from 'zustand';
// import {
// 	SettingsStore,
// 	UpdateAjoSettingsRequest,
// 	UpdateProfileRequest,
// 	UpdateBankDetailsRequest,
// 	ChangePasswordRequest,
// 	UpdateNotificationPreferencesRequest
// } from '@/features/settings/types';
// import * as settingsAPI from '@/api/settings';

// function getErrorMessage(err: unknown, fallback: string): string {
// 	if (err instanceof Error) return err.message;
// 	if (typeof err === 'string') return err;
// 	return fallback;
// }

// const initialState = {
// 	// Platform settings
// 	ajoSettings: null,
// 	ajoSettingsLoading: false,
// 	ajoSettingsError: null,

// 	// User profile
// 	userProfile: null,
// 	profileLoading: false,
// 	profileError: null,

// 	// Bank details
// 	bankDetails: null,
// 	bankDetailsLoading: false,
// 	bankDetailsError: null,

// 	// Notification preferences
// 	notificationPreferences: null,
// 	notificationsLoading: false,
// 	notificationsError: null,

// 	// General
// 	updateLoading: false,
// 	updateError: null,
// 	updateSuccess: false,
// };

// export const useSettingsStore = create<SettingsStore>()((set) => ({
// 	...initialState,

// 	// ═══════════════════════════════════════════════════════════════════
// 	// PLATFORM SETTINGS ACTIONS
// 	// ═══════════════════════════════════════════════════════════════════

// 	fetchAjoSettings: async () => {
// 		set({ ajoSettingsLoading: true, ajoSettingsError: null });
// 		try {
// 			const ajoSettings = await settingsAPI.getAjoSettings();
// 			set({ ajoSettings, ajoSettingsLoading: false });
// 		} catch (err: unknown) {
// 			set({
// 				ajoSettingsError: getErrorMessage(err, 'Failed to load platform settings'),
// 				ajoSettingsLoading: false,
// 			});
// 		}
// 	},

// 	updateAjoSettings: async (data: UpdateAjoSettingsRequest) => {
// 		set({ updateLoading: true, updateError: null, updateSuccess: false });
// 		try {
// 			const ajoSettings = await settingsAPI.updateAjoSettings(data);
// 			set({ ajoSettings, updateLoading: false, updateSuccess: true });
// 		} catch (err: unknown) {
// 			set({
// 				updateError: getErrorMessage(err, 'Failed to update platform settings'),
// 				updateLoading: false,
// 			});
// 			throw err;
// 		}
// 	},

// 	// ═══════════════════════════════════════════════════════════════════
// 	// USER PROFILE ACTIONS
// 	// ═══════════════════════════════════════════════════════════════════

// 	fetchUserProfile: async () => {
// 		set({ profileLoading: true, profileError: null });
// 		try {
// 			const userProfile = await settingsAPI.getUserProfile();
// 			set({ userProfile, profileLoading: false });
// 		} catch (err: unknown) {
// 			set({
// 				profileError: getErrorMessage(err, 'Failed to load profile'),
// 				profileLoading: false,
// 			});
// 		}
// 	},

// 	updateUserProfile: async (data: UpdateProfileRequest) => {
// 		set({ updateLoading: true, updateError: null, updateSuccess: false });
// 		try {
// 			const userProfile = await settingsAPI.updateUserProfile(data);
// 			set({ userProfile, updateLoading: false, updateSuccess: true });
// 		} catch (err: unknown) {
// 			set({
// 				updateError: getErrorMessage(err, 'Failed to update profile'),
// 				updateLoading: false,
// 			});
// 			throw err;
// 		}
// 	},

// 	// ═══════════════════════════════════════════════════════════════════
// 	// BANK DETAILS ACTIONS
// 	// ═══════════════════════════════════════════════════════════════════

// 	fetchUserBankDetails: async () => {
// 		set({ bankDetailsLoading: true, bankDetailsError: null });
// 		try {
// 			const bankDetails = await settingsAPI.getUserBankDetails();
// 			set({ bankDetails, bankDetailsLoading: false });
// 		} catch (err: unknown) {
// 			set({
// 				bankDetailsError: getErrorMessage(err, 'Failed to load bank details'),
// 				bankDetailsLoading: false,
// 			});
// 		}
// 	},

// 	updateUserBankDetails: async (data: UpdateBankDetailsRequest) => {
// 		set({ updateLoading: true, updateError: null, updateSuccess: false });
// 		try {
// 			const bankDetails = await settingsAPI.updateUserBankDetails(data);
// 			set({ bankDetails, updateLoading: false, updateSuccess: true });
// 		} catch (err: unknown) {
// 			set({
// 				updateError: getErrorMessage(err, 'Failed to update bank details'),
// 				updateLoading: false,
// 			});
// 			throw err;
// 		}
// 	},

// 	// ═══════════════════════════════════════════════════════════════════
// 	// SECURITY ACTIONS
// 	// ═══════════════════════════════════════════════════════════════════

// 	changePassword: async (data: ChangePasswordRequest) => {
// 		set({ updateLoading: true, updateError: null, updateSuccess: false });
// 		try {
// 			await settingsAPI.changePassword(data);
// 			set({ updateLoading: false, updateSuccess: true });
// 		} catch (err: unknown) {
// 			set({
// 				updateError: getErrorMessage(err, 'Failed to change password'),
// 				updateLoading: false,
// 			});
// 			throw err;
// 		}
// 	},

// 	// ═══════════════════════════════════════════════════════════════════
// 	// NOTIFICATION PREFERENCES ACTIONS
// 	// ═══════════════════════════════════════════════════════════════════

// 	fetchNotificationPreferences: async () => {
// 		set({ notificationsLoading: true, notificationsError: null });
// 		try {
// 			const notificationPreferences = await settingsAPI.getNotificationPreferences();
// 			set({ notificationPreferences, notificationsLoading: false });
// 		} catch (err: unknown) {
// 			set({
// 				notificationsError: getErrorMessage(err, 'Failed to load notification preferences'),
// 				notificationsLoading: false,
// 			});
// 		}
// 	},

// 	updateNotificationPreferences: async (data: UpdateNotificationPreferencesRequest) => {
// 		set({ updateLoading: true, updateError: null, updateSuccess: false });
// 		try {
// 			const notificationPreferences = await settingsAPI.updateNotificationPreferences(data);
// 			set({ notificationPreferences, updateLoading: false, updateSuccess: true });
// 		} catch (err: unknown) {
// 			set({
// 				updateError: getErrorMessage(err, 'Failed to update notification preferences'),
// 				updateLoading: false,
// 			});
// 			throw err;
// 		}
// 	},

// 	// ═══════════════════════════════════════════════════════════════════
// 	// UTILITY ACTIONS
// 	// ═══════════════════════════════════════════════════════════════════

// 	clearError: () => {
// 		set({
// 			ajoSettingsError: null,
// 			profileError: null,
// 			bankDetailsError: null,
// 			notificationsError: null,
// 			updateError: null,
// 		});
// 	},

// 	clearUpdateSuccess: () => {
// 		set({ updateSuccess: false });
// 	},

// 	reset: () => {
// 		set(initialState);
// 	},
// }));
