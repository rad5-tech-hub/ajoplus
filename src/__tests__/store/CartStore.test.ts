import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockProduct = {
  id: 'product-123',
  title: 'Test Product',
  price: 5000,
  type: 'product' as const,
};

describe('CartStore', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    const { useCartStore } = await import('@/app/store/CartStore');
    useCartStore.setState({ items: [] });
  });

  it('initial state has empty items array', async () => {
    const { useCartStore } = await import('@/app/store/CartStore');
    const { result } = renderHook(() => useCartStore());
    expect(result.current.items).toHaveLength(0);
  });

  it('addToCart adds item to cart', async () => {
    const { useCartStore } = await import('@/app/store/CartStore');
    const { result } = renderHook(() => useCartStore());

    act(() => { result.current.addToCart(mockProduct); });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('product-123');
  });

  it('addToCart increments quantity for existing item', async () => {
    const { useCartStore } = await import('@/app/store/CartStore');
    const { result } = renderHook(() => useCartStore());

    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.addToCart(mockProduct); });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('removeFromCart removes item', async () => {
    const { useCartStore } = await import('@/app/store/CartStore');
    const { result } = renderHook(() => useCartStore());

    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.removeFromCart('product-123'); });

    expect(result.current.items).toHaveLength(0);
  });

  it('clearCart empties all items', async () => {
    const { useCartStore } = await import('@/app/store/CartStore');
    const { result } = renderHook(() => useCartStore());

    act(() => { result.current.addToCart(mockProduct); });
    act(() => { result.current.clearCart(); });

    expect(result.current.items).toHaveLength(0);
  });
});
