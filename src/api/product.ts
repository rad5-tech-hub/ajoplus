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

// ─── Shared response wrapper ──────────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

// ─── API functions ────────────────────────────────────────────────────────────

export const getProducts = async (page = 1, limit = 10): Promise<ProductsResponse> => {
  try {
    const resp = await apiCall<ApiResponse<ProductsResponse>>(
      `/api/product/products?page=${page}&limit=${limit}`
    );
    if (!resp?.success) throw new Error(resp?.message || 'Failed to fetch products');
    return resp.data;
  } catch (error) {
    console.error('[Get Products Error]', error);
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const resp = await apiCall<ApiResponse<Product>>(`/api/product/products/${id}`);
    if (!resp?.success) throw new Error(resp?.message || 'Failed to fetch product');
    return resp.data;
  } catch (error) {
    console.error('[Get Product Error]', error);
    throw error;
  }
};

export const createProduct = async (
  payload: FormData | Record<string, unknown>
): Promise<Product> => {
  try {
    const isForm = payload instanceof FormData;
    // When sending FormData, omit Content-Type so the browser sets
    // multipart/form-data with the correct boundary automatically.
    const options = isForm
      ? { method: 'POST', body: payload }
      : { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } as HeadersInit };

    const response = await apiCall<ApiResponse<Product>>('/api/product/products', options);
    if (!response?.success) throw new Error(response?.message || 'Failed to create product');
    return response.data;
  } catch (error) {
    console.error('[Create Product Error]', error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  payload: FormData | Record<string, unknown>
): Promise<Product> => {
  try {
    const isForm = payload instanceof FormData;
    const options = isForm
      ? { method: 'PATCH', body: payload }
      : { method: 'PATCH', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } as HeadersInit };

    const response = await apiCall<ApiResponse<Product>>(`/api/product/products/${id}`, options);
    if (!response?.success) throw new Error(response?.message || 'Failed to update product');
    return response.data;
  } catch (error) {
    console.error('[Update Product Error]', error);
    throw error;
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await apiCall<{ success: boolean }>(`/api/product/products/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('[Delete Product Error]', error);
    throw error;
  }
};

export default { getProducts };