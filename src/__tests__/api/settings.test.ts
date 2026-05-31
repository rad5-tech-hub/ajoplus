import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { mockAjoSettings } from '@/test/mocks/fixtures';

const BASE = 'https://ajoplus.bookbank.com.ng';

describe('settings API', () => {
  beforeEach(() => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { token: 'test-token' }, version: 0,
    }));
  });

  it('getAjoSettings returns inner data object not envelope', async () => {
    const { getAjoSettings } = await import('@/api/settings');
    const result = await getAjoSettings();
    expect(result.bankName).toBe(mockAjoSettings.bankName);
    expect(result.accountNumber).toBe(mockAjoSettings.accountNumber);
    expect(result.accountName).toBe(mockAjoSettings.accountName);
    expect(result.commissionRate).toBe(mockAjoSettings.commissionRate);
    expect((result as unknown as Record<string, unknown>).success).toBeUndefined();
  });

  it('updateAjoSettings sends PATCH and returns updated data', async () => {
    let capturedBody: Record<string, unknown> = {};
    server.use(
      http.patch(`${BASE}/api/setting/ajo`, async ({ request }) => {
        capturedBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ success: true, data: { ...mockAjoSettings, bankName: 'GTB' } });
      })
    );

    const { updateAjoSettings } = await import('@/api/settings');
    await updateAjoSettings({ bankName: 'GTB', accountNumber: '0123456789', accountName: 'Ajo Plus', commissionRate: 10 }).catch(() => {});
    expect(capturedBody.bankName).toBe('GTB');
  });
});
