import { apiCall } from './client';

export type TransactionStatus = 'success' | 'pending' | 'failed';
export type TransactionTitle = 'withdrawal' | 'package' | 'saving' | 'product';

export interface Transaction {
	id: string;
	userId: string;
	title: TransactionTitle;
	amount: string;
	status: TransactionStatus;
	createdAt: string;
	updatedAt: string;
}

export interface TransactionsResponse {
	transactions: Transaction[];
	count: number;
}

interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data: T;
}

export const getTransactions = async (): Promise<TransactionsResponse> => {
	try {
		const response = await apiCall<ApiResponse<TransactionsResponse>>('/api/transactions');
		if (!response.success) throw new Error(response.message || 'Failed to fetch transactions');
		return response.data;
	} catch (error) {
		console.error('[Get Transactions Error]', error);
		throw error;
	}
};