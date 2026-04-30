// src/features/settings/api.ts
import { apiCall } from '@/api/client';
import type {
	AjoPlatformSettings,
	UserProfile,
	NotificationPreferences,
	BankDetails,
	UpdateProfileRequest,
	ChangePasswordRequest,
	UpdateAjoSettingsRequest,
} from '@/features/admin/components/types';

export const settingsApi = {
	// ==================== PLATFORM (ADMIN) ====================
	getAjoSettings: async () =>
		apiCall<{ success: boolean; data: AjoPlatformSettings }>('/api/setting/ajo'),

	updateAjoSettings: async (data: UpdateAjoSettingsRequest) =>
		apiCall<{ success: boolean; message: string; data: AjoPlatformSettings }>(
			'/api/setting/ajo',
			{ method: 'PATCH', body: JSON.stringify(data) }
		),

	// ==================== USER PROFILE ====================
	getUserProfile: async () =>
		apiCall<{ success: boolean; data: UserProfile }>('/api/user/profile'),

	updateUserProfile: async (data: UpdateProfileRequest) =>
		apiCall<{ success: boolean; message: string; data: UserProfile }>(
			'/api/user/profile',
			{ method: 'PATCH', body: JSON.stringify(data) }
		),

	// ==================== SECURITY ====================
	changePassword: async (data: ChangePasswordRequest) =>
		apiCall<{ success: boolean; message: string }>(
			'/api/user/change-password',
			{ method: 'POST', body: JSON.stringify(data) }
		),

	// ==================== NOTIFICATIONS ====================
	getNotificationPreferences: async () =>
		apiCall<{ success: boolean; data: NotificationPreferences }>(
			'/api/user/notifications/preferences'
		),

	updateNotificationPreferences: async (data: Partial<NotificationPreferences>) =>
		apiCall<{ success: boolean; message: string; data: NotificationPreferences }>(
			'/api/user/notifications/preferences',
			{ method: 'PATCH', body: JSON.stringify(data) }
		),

	// ==================== BANK DETAILS ====================
	getBankDetails: async () =>
		apiCall<{ success: boolean; data: BankDetails }>('/api/user/bank-details'),

	updateBankDetails: async (data: BankDetails) =>
		apiCall<{ success: boolean; message: string; data: BankDetails }>(
			'/api/user/bank-details',
			{ method: 'PATCH', body: JSON.stringify(data) }
		),
};