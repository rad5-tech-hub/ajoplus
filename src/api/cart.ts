import { apiCall } from './client';

export interface CartItem {
  id: string;
  cartId: string;
  itemId: string;
  type: 'product' | 'package';
  quantity: number;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  itemId: string;
  type: 'product' | 'package';
  quantity: number;
  price: number;
}

export interface AddToCartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    cartId: string;
    item: CartItem;
  };
}

export interface GetCartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    items: CartItem[];
    totalAmount: number;
  };
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface UpdateCartItemResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CartItem;
}

export interface RemoveFromCartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}

/**
 * Add an item to the user's cart
 */
export const addToCart = async (payload: AddToCartRequest): Promise<AddToCartResponse> => {
  try {
    const response = await apiCall<AddToCartResponse>('/api/cart/cart', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.success) {
      throw new Error(response.message || 'Failed to add item to cart');
    }

    return response;
  } catch (error) {
    console.error('[Add to Cart Error]', error);
    throw error;
  }
};

/**
 * Get the user's cart (all items and total)
 */
export const getCart = async (): Promise<GetCartResponse> => {
  try {
    const response = await apiCall<GetCartResponse>('/api/cart/cart');

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch cart');
    }

    return response;
  } catch (error) {
    console.error('[Get Cart Error]', error);
    throw error;
  }
};

/**
 * Update quantity of a cart item
 */
export const updateCartItem = async (
  itemId: string,
  payload: UpdateCartItemRequest
): Promise<UpdateCartItemResponse> => {
  try {
    const response = await apiCall<UpdateCartItemResponse>(
      `/api/cart/cart/${itemId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to update cart item');
    }

    return response;
  } catch (error) {
    console.error('[Update Cart Item Error]', error);
    throw error;
  }
};

/**
 * Remove an item from the cart
 */
export const removeFromCart = async (itemId: string): Promise<RemoveFromCartResponse> => {
  try {
    const response = await apiCall<RemoveFromCartResponse>(
      `/api/cart/cart/${itemId}`,
      { method: 'DELETE' }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to remove item from cart');
    }

    return response;
  } catch (error) {
    console.error('[Remove from Cart Error]', error);
    throw error;
  }
};

/**
 * Clear the entire cart
 */
export const clearCart = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await apiCall<{ success: boolean; message: string }>(
      '/api/cart/cart',
      { method: 'DELETE' }
    );

    if (!response.success) {
      throw new Error(response.message || 'Failed to clear cart');
    }

    return response;
  } catch (error) {
    console.error('[Clear Cart Error]', error);
    throw error;
  }
};
