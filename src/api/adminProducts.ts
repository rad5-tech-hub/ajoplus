export type ProductTransactionStatus = 'approved' | 'rejected' | 'pending';

export interface ProductTransaction {
	id: string;
	amountPaid: string;
	status: ProductTransactionStatus;
	paymentType: string;
	createdAt: string;
	user: {
		id: string;
		fullName: string;
		email: string;
	};
}

export interface ProductTransactionsResponse {
	product: { id: string; name: string; price: string };
	totalRevenue: number;
	transactionCount: number;
	transactions: ProductTransaction[];
}

// interface ApiResponse<T> {
// 	success: boolean;
// 	statusCode: number;
// 	message: string;
// 	data: T;
// }

const MOCK_TRANSACTIONS: ProductTransactionsResponse = {
	product: {
		id: 'e61cbe1a-0fb1-4c3d-9029-c179261755c7',
		name: 'Samsung Galaxy S24',
		price: '5000.00',
	},
	totalRevenue: 15000,
	transactionCount: 3,
	transactions: [
		{
			id: 'd8b648d5-1',
			amountPaid: '5000.00',
			status: 'approved',
			paymentType: 'product',
			createdAt: '2026-04-23T09:57:34.000Z',
			user: {
				id: '9a337e33-4d4d-4020-addb-a02d0b52920f',
				fullName: 'John Doe',
				email: 'johndoe2@gmail.com',
			},
		},
		{
			id: 'd8b648d5-2',
			amountPaid: '5000.00',
			status: 'approved',
			paymentType: 'product',
			createdAt: '2026-04-22T14:20:00.000Z',
			user: {
				id: 'f3aaf30c-c06c-4604-8d58-af194db37d45',
				fullName: 'Jane Smith',
				email: 'johndoe1@gmail.com',
			},
		},
		{
			id: 'd8b648d5-3',
			amountPaid: '5000.00',
			status: 'approved',
			paymentType: 'product',
			createdAt: '2026-04-21T11:10:00.000Z',
			user: {
				id: 'e113c5cf-887f-4c7d-8ff2-bff1aadc6bd5',
				fullName: 'Bob Johnson',
				email: 'bob@example.com',
			},
		},
	],
};

export const getProductTransactions = async (
	productId: string
): Promise<ProductTransactionsResponse> => {
	// TODO: replace mock with real endpoint when backend is ready
	// const response = await apiCall<ApiResponse<ProductTransactionsResponse>>(
	//   `/api/admin/products/${productId}/transactions`
	// );
	// if (!response.success) throw new Error(response.message);
	// return response.data;

	await new Promise((resolve) => setTimeout(resolve, 600));
	return {
		...MOCK_TRANSACTIONS,
		product: { ...MOCK_TRANSACTIONS.product, id: productId },
	};
};
