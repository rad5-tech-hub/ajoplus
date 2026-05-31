import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

const BASE = 'https://ajoplus.bookbank.com.ng';

describe('withdrawals API', () => {
  beforeEach(() => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { token: 'test-token' }, version: 0,
    }));
  });

  it('submitAgentWithdrawal sends only amount and description — no walletId', async () => {
    let capturedBody: Record<string, unknown> = {};
    server.use(
      http.post(`${BASE}/api/agents/wallet/withdrawals`, async ({ request }) => {
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ success: true, statusCode: 201, data: {} });
      })
    );

    const { submitAgentWithdrawal } = await import('@/api/agent');
    await submitAgentWithdrawal({ amount: 300, description: 'For food' }).catch(() => {});

    expect(capturedBody.amount).toBe(300);
    expect(capturedBody.description).toBe('For food');
    expect(capturedBody.walletId).toBeUndefined();
  });

  it('approveAgentWithdrawal sends PATCH to correct URL with no body', async () => {
    let capturedMethod = '';
    let capturedBody: unknown = undefined;
    server.use(
      http.patch(`${BASE}/api/admin/agent-withdrawals/:id/approve`, async ({ request }) => {
        capturedMethod = request.method;
        try { capturedBody = await request.json(); } catch { capturedBody = undefined; }
        return HttpResponse.json({ success: true, data: { withdrawal: { id: 'x', amount: 300, status: 'success', approvedAt: '2026-05-19T17:34:10.000Z' } } });
      })
    );

    const { approveAgentWithdrawal } = await import('@/api/withdrawals');
    await approveAgentWithdrawal('agent-withdrawal-123');

    expect(capturedMethod).toBe('PATCH');
    expect(capturedBody).toBeUndefined();
  });

  it('fetchMyPendingWithdrawals calls correct customer endpoint', async () => {
    let called = false;
    server.use(
      http.get(`${BASE}/api/customer/wallet/withdrawals/pending`, () => {
        called = true;
        return HttpResponse.json({ success: true, data: { count: 0, withdrawals: [] } });
      })
    );

    const { fetchMyPendingWithdrawals } = await import('@/api/withdrawals');
    await fetchMyPendingWithdrawals();
    expect(called).toBe(true);
  });
});
