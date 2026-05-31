import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

const BASE = 'https://ajoplus.bookbank.com.ng';

const mockDashboardData = {
  agent: {
    id: 'agent-123',
    fullName: 'Adebayo Oluwaseun',
    referralCode: 'AGENT-ADEBAYO-8417',
    createdAt: '2026-04-19T04:25:29.000Z',
  },
  stats: {
    totalReferrals: 11,
    totalEarnings: 400,
    commissionPaid: 400,
    totalWithdrawn: 300,
    pendingWithdrawalAmount: 0,
    availableBalance: 100,
    pendingEarnings: 1600,
    totalCommission: 2000,
    packageEarnings: 400,
    savingEarnings: 0,
    earningsPerReferral: 36.36,
    totalTransactions: 1,
  },
  referral: {
    code: 'AGENT-ADEBAYO-8417',
    link: 'https://ajoplus.com/ref/AGENT-ADEBAYO-8417',
  },
  earningsBreakdown: { thisMonth: 400, lastMonth: 0 },
  referredUsers: [],
};

describe('agent dashboard regression', () => {
  beforeEach(() => {
    window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
      state: { token: 'test-token' }, version: 0,
    }));
  });

  it('getAgentDashboard returns availableBalance in stats', async () => {
    const { getAgentDashboard } = await import('@/api/agent');
    const data = await getAgentDashboard();

    expect(data.stats.availableBalance).toBe(100);
    expect(data.stats.totalEarnings).toBe(400);
    expect(data.stats.totalWithdrawn).toBe(300);
    expect(data.stats.pendingWithdrawalAmount).toBe(0);
  });

  it('getAgentDashboard availableBalance is used for withdrawal max — not totalEarnings', async () => {
    const { getAgentDashboard } = await import('@/api/agent');
    const data = await getAgentDashboard();

    const availableBalance = data.stats.availableBalance;
    const totalEarnings = data.stats.totalEarnings;

    expect(availableBalance).toBe(100);
    expect(totalEarnings).toBe(400);
    expect(availableBalance).not.toBe(totalEarnings);
  });

  it('getAgentDashboard handles zero available balance', async () => {
    server.use(
      http.get(`${BASE}/api/agents/dashboard`, () =>
        HttpResponse.json({
          success: true,
          data: { ...mockDashboardData, stats: { ...mockDashboardData.stats, availableBalance: 0, totalEarnings: 0 } },
        })
      )
    );

    const { getAgentDashboard } = await import('@/api/agent');
    const data = await getAgentDashboard();

    expect(data.stats.availableBalance).toBe(0);
    expect(data.stats.earningsPerReferral).toBe(36.36);
  });

  it('useAgentTransactions fetches from correct endpoint', async () => {
    const { http, HttpResponse } = await import('msw');
    let capturedUrl = '';
    server.use(
      http.get(`${BASE}/api/agents/wallet/withdrawals/transactions`, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({
          success: true, data: {
            filter: 'all',
            summary: { total: 2, pending: 1, approved: 1, rejected: 0 },
            transactions: [
              { id: 'tx-1', userId: 'agent-123', walletId: null, withdrawalType: 'agent', amount: '300', description: 'Withdrawal', status: 'pending', rejectionReason: null, createdAt: '2026-05-19T17:05:50.000Z', updatedAt: '2026-05-19T17:05:50.000Z' },
              { id: 'tx-2', userId: 'agent-123', walletId: null, withdrawalType: 'agent', amount: '200', description: 'Old withdrawal', status: 'approved', rejectionReason: null, createdAt: '2026-04-19T17:05:50.000Z', updatedAt: '2026-04-20T17:05:50.000Z' },
            ],
          },
        });
      })
    );

    const { getAgentTransactions } = await import('@/api/withdrawals');
    const result = await getAgentTransactions();

    expect(capturedUrl).toContain('/api/agents/wallet/withdrawals/transactions');
    expect(result.transactions).toHaveLength(2);
    expect(result.summary.total).toBe(2);
    expect(result.summary.pending).toBe(1);
  });

  it('getAgentTransactions filters by status', async () => {
    let capturedUrl = '';
    server.use(
      http.get(`${BASE}/api/agents/wallet/withdrawals/transactions`, ({ request }) => {
        capturedUrl = request.url;
        return HttpResponse.json({
          success: true, data: {
            filter: 'pending',
            summary: { total: 1, pending: 1, approved: 0, rejected: 0 },
            transactions: [
              { id: 'tx-1', userId: 'agent-123', walletId: null, withdrawalType: 'agent', amount: '300', description: 'Withdrawal', status: 'pending', rejectionReason: null, createdAt: '2026-05-19T17:05:50.000Z', updatedAt: '2026-05-19T17:05:50.000Z' },
            ],
          },
        });
      })
    );

    const { getAgentTransactions } = await import('@/api/withdrawals');
    const result = await getAgentTransactions('pending');

    expect(capturedUrl).toContain('status=pending');
    expect(result.transactions).toHaveLength(1);
    expect(result.transactions[0].status).toBe('pending');
  });

  it('submitAgentWithdrawal returns withdrawal and availableBalance', async () => {
    server.use(
      http.post(`${BASE}/api/agents/wallet/withdrawals`, () =>
        HttpResponse.json({
          withdrawal: {
            id: 'w-1', userId: 'agent-123', walletId: null, withdrawalType: 'agent',
            amount: 100, description: 'Test withdrawal', status: 'pending',
            updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(),
          },
          availableBalance: 100,
          totalAvailable: 400,
        })
      )
    );

    const { submitAgentWithdrawal } = await import('@/api/agent');
    const result = await submitAgentWithdrawal({ amount: 100, description: 'Test withdrawal' });

    expect(result.withdrawal.status).toBe('pending');
    expect(result.availableBalance).toBe(100);
    expect(result.totalAvailable).toBe(400);
  });
});
