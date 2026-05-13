import { apiCall } from './client';

export interface ProductTransaction {
	id: string;
	userId: string;
	user: {
		id: string;
		fullName: string;
		email: string;
	};
	amount: number;
	date: string;
	status: 'pending' | 'approved' | 'rejected';
	receiptUrl: string;
}

export interface ProductTransactionsResponse {
	product: {
		id: string;
		name: string;
	};
	totalRevenue: number;
	transactionCount: number;
	transactions: ProductTransaction[];
}

interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data: T;
}

export const getProductTransactions = async (
	productId: string
): Promise<ProductTransactionsResponse> => {
	const response = await apiCall<ApiResponse<ProductTransactionsResponse>>(
		`/api/admin/products/${productId}/transactions`
	);
	if (!response.success) throw new Error(response.message || 'Failed to fetch product transactions');
	return response.data;
};
