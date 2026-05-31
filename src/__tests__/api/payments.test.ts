import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

const BASE = 'https://ajoplus.bookbank.com.ng';

describe('payments API', () => {
  beforeEach(() => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { token: 'test-token' }, version: 0,
    }));
  });

  it('approvePayment sends PATCH to correct endpoint', async () => {
    let capturedMethod = '';
    server.use(
      http.patch(`${BASE}/api/payment/payment/:id/approve`, ({ request }) => {
        capturedMethod = request.method;
        return HttpResponse.json({ success: true, data: { payment: { id: 'payment-123', status: 'approved' } } });
      })
    );

    const { approvePayment } = await import('@/api/payments');
    const result = await approvePayment('payment-123');
    expect(capturedMethod).toBe('PATCH');
    expect(result.status).toBe('approved');
  });

  it('rejectPayment sends JSON body with rejectionReason', async () => {
    let capturedBody: Record<string, unknown> = {};
    server.use(
      http.patch(`${BASE}/api/payment/payment/:id/reject`, async ({ request }) => {
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ success: true, data: { payment: {} } });
      })
    );

    const { rejectPayment } = await import('@/api/payments');
    await rejectPayment('payment-123', { rejectionReason: 'Amount does not match' }).catch(() => {});

    expect(capturedBody.rejectionReason).toBe('Amount does not match');
  });

  it('fetchMyPendingPayments calls correct endpoint', async () => {
    let called = false;
    server.use(
      http.get(`${BASE}/api/payment/payments/me/pending`, () => {
        called = true;
        return HttpResponse.json({ success: true, data: { summary: { total: 0, byType: { package: 0, product: 0, saving: 0 } }, payments: [] } });
      })
    );

    const { fetchMyPendingPayments } = await import('@/api/payments');
    await fetchMyPendingPayments();
    expect(called).toBe(true);
  });
});
