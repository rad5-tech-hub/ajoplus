// src/features/admin/types.ts

export interface AdminOverview {
	totalUsers: number;
	totalRevenue: number;
	pendingApprovals: number;
	activePackages: number;
	userGrowthPercent: number;   // e.g. 15.2
	revenueGrowthPercent: number; // e.g. 8.7
}