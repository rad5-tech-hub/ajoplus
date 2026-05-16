const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.AbaGold.com';

export interface PublicPackageItem {
  id: string;
  itemName: string;
  quantity: string;
}

export interface PublicPackage {
  id: string;
  name: string;
  totalPrice: string;
  duration: number;
  paymentFrequency: 'daily' | 'weekly' | 'monthly';
  description: string;
  category: { id: string; name: string } | null;
  items: PublicPackageItem[];
}

export interface PublicProduct {
  id: string;
  name: string;
  price: string;
  dollarPrice?: string | null;
  quantityInStock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  description: string;
  imageUrl: string;
  category: { id: string; name: string };
}

export interface ProductsResponse {
  products: PublicProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const fetchPublicPackages = async (): Promise<PublicPackage[]> => {
  const res = await fetch(`${API_BASE_URL}/api/package/public`);
  if (!res.ok) throw new Error('Failed to fetch packages');
  const json: ApiResponse<PublicPackage[]> = await res.json();
  return json.data;
};

export const fetchPublicProducts = async (page = 1): Promise<ProductsResponse> => {
  const res = await fetch(`${API_BASE_URL}/api/product/public?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const json: ApiResponse<ProductsResponse> = await res.json();
  return json.data;
};
