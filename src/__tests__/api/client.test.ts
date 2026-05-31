import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

const BASE = 'https://ajoplus.bookbank.com.ng';

describe('API Client', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('injects Authorization header when token exists', async () => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { token: 'my-test-token' }, version: 0,
    }));

    let capturedAuth = '';
    server.use(
      http.get(`${BASE}/api/test-auth`, ({ request }) => {
        capturedAuth = request.headers.get('authorization') ?? '';
        return HttpResponse.json({ success: true, data: {} });
      })
    );

    const { apiCall } = await import('@/api/client');
    await apiCall('/api/test-auth').catch(() => {});
    expect(capturedAuth).toBe('Bearer my-test-token');
  });

  it('does not inject Authorization for public auth endpoints', async () => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { token: 'my-test-token' }, version: 0,
    }));

    let capturedAuth: string | null = null;
    server.use(
      http.post(`${BASE}/api/auth/login`, ({ request }) => {
        capturedAuth = request.headers.get('authorization');
        return HttpResponse.json({ success: true, data: { user: {}, accessToken: 'x', refreshToken: 'y' } });
      })
    );

    const { loginUser } = await import('@/api/auth');
    await loginUser({ email: 'test@test.com', password: 'pass' }).catch(() => {});
    expect(capturedAuth).toBeNull();
  });

  it('does not retry on 400 error', async () => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { token: 'my-test-token' }, version: 0,
    }));

    let callCount = 0;
    server.use(
      http.get(`${BASE}/api/setting/ajo`, () => {
        callCount++;
        return HttpResponse.json({ message: 'Bad request' }, { status: 400 });
      })
    );

    const { getAjoSettings } = await import('@/api/settings');
    await getAjoSettings().catch(() => {});
    expect(callCount).toBe(1);
  });
});
