// src/app/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as cartAPI from '@/api/cart';

interface CartItem {
  id: string;
  title?: string;
  price: number;
  image?: string;
  type: 'package' | 'product';
  quantity: number;
  itemId?: string;
  cartId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCount: () => number;
  getTotal: () => number;
  syncCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity < 1
              ? state.items.filter((item) => item.id !== id)
              : state.items.map((item) =>
                  item.id === id ? { ...item, quantity } : item
                ),
        })),
      clearCart: () => set({ items: [] }),
      syncCart: (items: CartItem[]) => set({ items }),
      getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'ajoplus-cart' }
  )
);

/**
 * React Query hook to fetch user's cart from server
 */
export const useGetCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartAPI.getCart,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};

/**
 * React Query hook to add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: cartAPI.AddToCartRequest) => cartAPI.addToCart(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Failed to add item to cart:', error);
    },
  });
};

/**
 * React Query hook to update cart item quantity
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartAPI.updateCartItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Failed to update cart item:', error);
    },
  });
};

/**
 * React Query hook to remove item from cart
 */
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartAPI.removeFromCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Failed to remove item from cart:', error);
    },
  });
};

/**
 * React Query hook to clear the cart
 */
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartAPI.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Failed to clear cart:', error);
    },
  });
};