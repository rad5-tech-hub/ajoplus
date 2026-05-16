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
  cartId?: string;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCount: () => number;
  getTotal: () => number;
  syncCart: (items: CartItem[], cartId?: string) => void; // ← accept cartId
  setCartId: (cartId: string) => void;                   // ← new action
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
      syncCart: (items: CartItem[], cartId?: string) =>
        set({ items, ...(cartId && { cartId }) }),

      setCartId: (cartId: string) => set({ cartId }),
      getCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'AbaGold-cart' }
  )
);

/**
 * React Query hook to fetch user's cart from server
 */
export const useGetCart = () => {
  const syncCart = useCartStore((state) => state.syncCart);

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await cartAPI.getCart();
      const items = response.data.items ?? [];
      const cartId = items[0]?.cartId;

      syncCart(
        items.map((item) => ({
          id: item.id,          // ✅ cart row id — used for PATCH/DELETE
          itemId: item.itemId,  // product/package id — for display/reference
          cartId: item.cartId,
          type: item.type,
          quantity: item.quantity,
          price: parseFloat(item.price),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        cartId
      );
      return response;
    },
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};


export const useCartId = () => useCartStore((state) => state.cartId);


/**
 * React Query hook to add item to cart
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const setCartId = useCartStore((state) => state.setCartId);

  return useMutation({
    mutationFn: (payload: cartAPI.AddToCartRequest) => cartAPI.addToCart(payload),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
    },
    onSuccess: (response) => {
      if (response.data.cartId) {
        setCartId(response.data.cartId);
      }
    },
    onSettled: () => {
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
    },
    onSettled: () => {
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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
    },
    onSettled: () => {
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
  const cartId = useCartStore((state) => state.cartId);

  return useMutation({
    mutationFn: () => {
      if (!cartId) throw new Error('No cart ID available');
      return cartAPI.clearCart(cartId);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['cart'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Failed to clear cart:', error);
    },
  });
};