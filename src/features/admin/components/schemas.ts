// src/features/settings/schemas.ts
import { z } from 'zod';

export const updateProfileSchema = z.object({
	firstName: z.string().min(2, "First name must be at least 2 characters"),
	lastName: z.string().min(2, "Last name must be at least 2 characters"),
	phone: z.string().regex(/^\+234[0-9]{10}$/, "Phone must be in format +234XXXXXXXXXX"),
	dateOfBirth: z.string().optional(),
	address: z.string().optional(),
	gender: z.enum(['male', 'female', 'other']).optional(),
});

export const changePasswordSchema = z.object({
	currentPassword: z.string().min(8, "Current password is required"),
	newPassword: z.string()
		.min(8, "Password must be at least 8 characters")
		.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
		.regex(/[0-9]/, "Password must contain at least one number"),
	confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"],
});

export const bankDetailsSchema = z.object({
	bankName: z.string().min(3, "Bank name is required"),
	accountNumber: z.string().length(10, "Account number must be 10 digits"),
	accountName: z.string().min(3, "Account name is required"),
	bankCode: z.string().optional(),
});

export const ajoPlatformSchema = z.object({
	commissionRate: z.number().min(0).max(15),
	bankName: z.string().min(3),
	accountNumber: z.string().length(10),
	accountName: z.string().min(3),
});

export const notificationPreferencesSchema = z.object({
	emailNotifications: z.boolean(),
	smsNotifications: z.boolean(),
	pushNotifications: z.boolean(),
	ajoUpdates: z.boolean(),
	paymentReminders: z.boolean(),
	securityAlerts: z.boolean(),
});