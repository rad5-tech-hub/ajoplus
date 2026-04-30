// // src/features/settings/types.ts

// // ═══════════════════════════════════════════════════════════════════
// // PLATFORM / ADMIN SETTINGS TYPES
// // ═══════════════════════════════════════════════════════════════════

// export interface AjoSettings {
// 	id: string;
// 	commissionRate: number;
// 	bankName: string;
// 	accountNumber: string;
// 	accountName: string;
// 	createdAt: string;
// 	updatedAt: string;
// }

// export interface UpdateAjoSettingsRequest {
// 	commissionRate?: number;
// 	bankName?: string;
// 	accountNumber?: string;
// 	accountName?: string;
// }

// interface AjoSettingsResponse {
// 	success: boolean;
// 	statusCode: number;
// 	message: string;
// 	data: AjoSettings;
// }

// // ═══════════════════════════════════════════════════════════════════
// // USER PROFILE TYPES
// // ═══════════════════════════════════════════════════════════════════

// export interface UserProfile {
// 	id: string;
// 	fullName: string;
// 	email: string;
// 	phoneNumber: string;
// 	role: 'customer' | 'agent' | 'admin';
// 	agentId?: string;
// 	accountStatus: 'active' | 'inactive' | 'suspended';
// 	createdAt: string;
// 	updatedAt: string;
// }

// export interface UpdateProfileRequest {
// 	fullName?: string;
// 	email?: string;
// 	phoneNumber?: string;
// }

// interface UserProfileResponse {
// 	success: boolean;
// 	statusCode: number;
// 	message: string;
// 	data: UserProfile;
// }

// // ═══════════════════════════════════════════════════════════════════
// // BANK DETAILS TYPES
// // ═══════════════════════════════════════════════════════════════════

// export interface BankDetails {
// 	id: string;
// 	bankName: string;
// 	accountNumber: string;
// 	accountName: string;
// 	accountType: string;
// 	userId: string;
// 	createdAt: string;
// 	updatedAt: string;
// }

// export interface UpdateBankDetailsRequest {
// 	bankName?: string;
// 	accountNumber?: string;
// 	accountName?: string;
// 	accountType?: string;
// }

// interface BankDetailsResponse {
// 	success: boolean;
// 	statusCode: number;
// 	message: string;
// 	data: BankDetails;
// }

// // ═══════════════════════════════════════════════════════════════════
// // SECURITY / CHANGE PASSWORD TYPES
// // ═══════════════════════════════════════════════════════════════════

// export interface ChangePasswordRequest {
// 	currentPassword: string;
// 	newPassword: string;
// 	confirmPassword: string;
// }

// interface ChangePasswordResponse {
// 	success: boolean;
// 	statusCode: number;
// 	message: string;
// 	data: null;
// }

// // ═══════════════════════════════════════════════════════════════════
// // NOTIFICATION PREFERENCES TYPES
// // ═══════════════════════════════════════════════════════════════════

// export interface NotificationPreferences {
// 	emailNotifications: boolean;
// 	smsNotifications: boolean;
// 	pushNotifications: boolean;
// 	transactionAlerts: boolean;
// 	marketingEmails: boolean;
// 	securityAlerts: boolean;
// }

// export interface UpdateNotificationPreferencesRequest {
// 	emailNotifications?: boolean;
// 	smsNotifications?: boolean;
// 	pushNotifications?: boolean;
// 	transactionAlerts?: boolean;
// 	marketingEmails?: boolean;
// 	securityAlerts?: boolean;
// }

// interface NotificationPreferencesResponse {
// 	success: boolean;
// 	statusCode: number;
// 	message: string;
// 	data: NotificationPreferences;
// }

// // ═══════════════════════════════════════════════════════════════════
// // SETTINGS STORE TYPES
// // ═══════════════════════════════════════════════════════════════════

// export interface SettingsState {
// 	// Platform settings
// 	ajoSettings: AjoSettings | null;
// 	ajoSettingsLoading: boolean;
// 	ajoSettingsError: string | null;

// 	// User profile
// 	userProfile: UserProfile | null;
// 	profileLoading: boolean;
// 	profileError: string | null;

// 	// Bank details
// 	bankDetails: BankDetails | null;
// 	bankDetailsLoading: boolean;
// 	bankDetailsError: string | null;

// 	// Notification preferences
// 	notificationPreferences: NotificationPreferences | null;
// 	notificationsLoading: boolean;
// 	notificationsError: string | null;

// 	// General
// 	updateLoading: boolean;
// 	updateError: string | null;
// 	updateSuccess: boolean;
// }

// export interface SettingsStore extends SettingsState {
// 	// Platform settings actions
// 	fetchAjoSettings: () => Promise<void>;
// 	updateAjoSettings: (data: UpdateAjoSettingsRequest) => Promise<void>;

// 	// User profile actions
// 	fetchUserProfile: () => Promise<void>;
// 	updateUserProfile: (data: UpdateProfileRequest) => Promise<void>;

// 	// Bank details actions
// 	fetchUserBankDetails: () => Promise<void>;
// 	updateUserBankDetails: (data: UpdateBankDetailsRequest) => Promise<void>;

// 	// Security actions
// 	changePassword: (data: ChangePasswordRequest) => Promise<void>;

// 	// Notification actions
// 	fetchNotificationPreferences: () => Promise<void>;
// 	updateNotificationPreferences: (data: UpdateNotificationPreferencesRequest) => Promise<void>;

// 	// Utility actions
// 	clearError: () => void;
// 	clearUpdateSuccess: () => void;
// 	reset: () => void;
// }
