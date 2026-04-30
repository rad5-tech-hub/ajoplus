// src/features/settings/types.ts
export interface AjoPlatformSettings {
	id: string;
	commissionRate: number;
	bankName: string;
	accountNumber: string;
	accountName: string;
	createdAt: string;
	updatedAt: string;
}

export interface UserProfile {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	avatar?: string;
	dateOfBirth?: string;
	gender?: 'male' | 'female' | 'other';
	address?: string;
	kycStatus: 'pending' | 'verified' | 'rejected';
}

export interface NotificationPreferences {
	emailNotifications: boolean;
	smsNotifications: boolean;
	pushNotifications: boolean;
	ajoUpdates: boolean;
	paymentReminders: boolean;
	securityAlerts: boolean;
}

export interface BankDetails {
	bankName: string;
	accountNumber: string;
	accountName: string;
	bankCode?: string;
	isVerified?: boolean;
}

export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export type UpdateProfileRequest = Partial<Omit<UserProfile, 'id' | 'email' | 'kycStatus'>>;
export type UpdateAjoSettingsRequest = Partial<Omit<AjoPlatformSettings, 'id' | 'createdAt' | 'updatedAt'>>;