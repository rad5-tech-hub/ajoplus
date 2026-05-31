import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

const BASE = 'https://ajoplus.bookbank.com.ng';

describe('approval flows', () => {
  beforeEach(() => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { token: 'test-token' }, version: 0,
    }));
  });

  it('approvePayment sends bare PATCH — no body, no query params', async () => {
    let capturedMethod = '';
    let capturedBody: unknown = undefined;
    let capturedUrl = '';
    server.use(
      http.patch(`${BASE}/api/payment/payment/:id/approve`, async ({ request }) => {
        capturedMethod = request.method;
        capturedUrl = request.url;
        try { capturedBody = await request.json(); } catch { capturedBody = undefined; }
        return HttpResponse.json({ success: true, data: { payment: { id: 'p-1', status: 'approved' } } });
      })
    );

    const { approvePayment } = await import('@/api/payments');
    const result = await approvePayment('payment-123');

    expect(capturedMethod).toBe('PATCH');
    expect(capturedBody).toBeUndefined();
    expect(capturedUrl).toContain('/api/payment/payment/payment-123/approve');
    expect(result.status).toBe('approved');
  });

  it('rejectPayment sends PATCH with rejectionReason body', async () => {
    let capturedBody: unknown = undefined;
    server.use(
      http.patch(`${BASE}/api/payment/payment/:id/reject`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({ success: true, data: { payment: { id: 'p-1', status: 'rejected', rejectionReason: 'Bad receipt' } } });
      })
    );

    const { rejectPayment } = await import('@/api/payments');
    const result = await rejectPayment('payment-123', { rejectionReason: 'Bad receipt' });

    expect(capturedBody).toEqual({ rejectionReason: 'Bad receipt' });
    expect(result.status).toBe('rejected');
    expect(result.rejectionReason).toBe('Bad receipt');
  });

  it('approvePayment with non-existent id throws', async () => {
    server.use(
      http.patch(`${BASE}/api/payment/payment/nonexistent/approve`, () =>
        HttpResponse.json({ success: false, message: 'Payment not found' }, { status: 404 })
      )
    );

    const { approvePayment } = await import('@/api/payments');
    await expect(approvePayment('nonexistent')).rejects.toThrow('Payment not found');
  });

  it('rejectPayment with missing reason throws', async () => {
    server.use(
      http.patch(`${BASE}/api/payment/payment/:id/reject`, () =>
        HttpResponse.json({ success: false, message: 'Rejection reason is required' }, { status: 400 })
      )
    );

    const { rejectPayment } = await import('@/api/payments');
    await expect(rejectPayment('payment-123', { rejectionReason: '' })).rejects.toThrow();
  });
});
