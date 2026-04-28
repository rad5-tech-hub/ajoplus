// src/api/categories.ts
import { apiCall } from './client';

export interface Category {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export const getCategories = async (): Promise<Category[]> => {
	const response = await apiCall<{ success: boolean; data: Category[] }>(
		'/api/category/categories'
	);
	return response.data;
};

export const createCategory = async (payload: {
	name: string;
	description: string;
}): Promise<Category> => {
	const response = await apiCall<{ success: boolean; data: Category }>(
		'/api/category/categories',
		{
			method: 'POST',
			body: JSON.stringify(payload),
		}
	);
	return response.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
	await apiCall<{ success: boolean }>(`/api/category/categories/${id}`, {
		method: 'DELETE',
	});
};