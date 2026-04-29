import { apiCall } from './client';

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: string;
  quantityInStock: number;
  stockStatus: string;
  description?: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: { id: string; name: string };
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const getProducts = async (
  page = 1,
  limit = 10
): Promise<ProductsResponse> => {
  try {
    const resp = await apiCall<{
      success: boolean;
      statusCode: number;
      message: string;
      data: ProductsResponse;
    }>(`/api/product/products?page=${page}&limit=${limit}`);

    if (!resp?.success) throw new Error(resp?.message || 'Failed to fetch products');
    return resp.data;
  } catch (error) {
    console.error('[Get Products Error]', error);
    throw error;
  }
};

export default { getProducts };

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const resp = await apiCall<{ success: boolean; statusCode: number; message: string; data: Product }>(
      `/api/product/products/${id}`
    );
    if (!resp?.success) throw new Error(resp?.message || 'Failed to fetch product');
    return resp.data;
  } catch (error) {
    console.error('[Get Product Error]', error);
    throw error;
  }
};

export const createProduct = async (payload: FormData | Record<string, unknown>): Promise<Product> => {
  // if payload is FormData, send without JSON content-type
  const isForm = payload instanceof FormData;
  const response = await apiCall<{ success: boolean; statusCode: number; message: string; data: Product }>(
    '/api/product/products',
    {
      method: 'POST',
      body: isForm ? (payload as FormData) : JSON.stringify(payload),
      headers: isForm ? { 'Content-Type': undefined } : undefined,
    }
  );
  if (!response?.success) throw new Error(response?.message || 'Failed to create product');
  return response.data;
};

export const updateProduct = async (id: string, payload: FormData | Record<string, unknown>): Promise<Product> => {
  const isForm = payload instanceof FormData;
  const response = await apiCall<{ success: boolean; statusCode: number; message: string; data: Product }>(
    `/api/product/products/${id}`,
    {
      method: 'PATCH',
      body: isForm ? (payload as FormData) : JSON.stringify(payload),
      headers: isForm ? { 'Content-Type': undefined } : undefined,
    }
  );
  if (!response?.success) throw new Error(response?.message || 'Failed to update product');
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiCall<{ success: boolean }>(`/api/product/products/${id}`, { method: 'DELETE' });
};
