import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { mockUser } from '@/test/mocks/fixtures';

describe('authStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initial state: user is null and isAuthenticated is false', async () => {
    const { useAuthStore } = await import('@/app/store/authStore');
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('logout clears user and token from state', async () => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { user: mockUser, token: 'test-token', refreshToken: 'test-refresh', isAuthenticated: true },
      version: 0,
    }));

    const { useAuthStore } = await import('@/app/store/authStore');
    const { result } = renderHook(() => useAuthStore());

    act(() => { result.current.logout(); });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeFalsy();
  });

  it('logout removes auth key from localStorage', async () => {
    window.localStorage.setItem('AbaGold-auth-storage', 'test');
    const { useAuthStore } = await import('@/app/store/authStore');
    const { result } = renderHook(() => useAuthStore());

    act(() => { result.current.logout(); });

    expect(window.localStorage.getItem('AbaGold-auth-storage')).toBeNull();
  });
});
