import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { renderWithProviders, seedAgentAuth } from '@/test/utils/renderWithProviders';

const BASE = 'https://ajoplus.bookbank.com.ng';

const mockTransactions = (overrides = {}) => ({
  success: true, data: {
    filter: 'all',
    summary: { total: 3, pending: 1, approved: 2, rejected: 0 },
    transactions: [
      { id: 'tx-1', userId: 'agent-123', walletId: null, withdrawalType: 'agent', amount: '500', description: 'Withdrawal', status: 'pending', rejectionReason: null, createdAt: '2026-05-19T17:05:50.000Z', updatedAt: '2026-05-19T17:05:50.000Z' },
      { id: 'tx-2', userId: 'agent-123', walletId: null, withdrawalType: 'agent', amount: '300', description: 'Old withdrawal', status: 'approved', rejectionReason: null, createdAt: '2026-04-19T17:05:50.000Z', updatedAt: '2026-04-20T17:05:50.000Z' },
      { id: 'tx-3', userId: 'agent-123', walletId: null, withdrawalType: 'agent', amount: '100', description: 'Rejected withdrawal', status: 'rejected', rejectionReason: 'Insufficient balance', createdAt: '2026-03-19T17:05:50.000Z', updatedAt: '2026-03-20T17:05:50.000Z' },
    ],
    ...overrides,
  },
});

function setupHandler(response: Record<string, unknown>) {
  server.use(
    http.get(`${BASE}/api/agents/wallet/withdrawals/transactions`, () =>
      HttpResponse.json(response)
    )
  );
}

describe('AgentTransactions component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedAgentAuth();
  });

  it('shows loading skeleton', async () => {
    server.use(
      http.get(`${BASE}/api/agents/wallet/withdrawals/transactions`, () =>
        new Promise(() => {}) // never resolves
      )
    );

    const { default: AgentTransactions } = await import('@/features/agent/components/AgentTransactions');
    renderWithProviders(<AgentTransactions />);

    // Skeleton has animate-pulse elements
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error state with retry', async () => {
    setupHandler({ success: false, message: 'Server error' });

    const { default: AgentTransactions } = await import('@/features/agent/components/AgentTransactions');
    renderWithProviders(<AgentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load transactions')).toBeTruthy();
    });
    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('shows empty state when no transactions', async () => {
    setupHandler({
      success: true, data: {
        filter: 'all',
        summary: { total: 0, pending: 0, approved: 0, rejected: 0 },
        transactions: [],
      },
    });

    const { default: AgentTransactions } = await import('@/features/agent/components/AgentTransactions');
    renderWithProviders(<AgentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('No Transactions Yet')).toBeTruthy();
    });
  });

  it('shows pending and confirmed transactions', async () => {
    setupHandler(mockTransactions());

    const { default: AgentTransactions } = await import('@/features/agent/components/AgentTransactions');
    renderWithProviders(<AgentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('3 total · 1 pending')).toBeTruthy();
    });

    expect(screen.getByText('Awaiting Approval (1)')).toBeTruthy();

    expect(screen.getByText('Pending')).toBeTruthy();
    expect(screen.getByText('Approved')).toBeTruthy();
    expect(screen.getByText('Rejected')).toBeTruthy();
  });

  it('shows correct amounts', async () => {
    setupHandler(mockTransactions());

    const { default: AgentTransactions } = await import('@/features/agent/components/AgentTransactions');
    renderWithProviders(<AgentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('-₦500')).toBeTruthy();
    });

    expect(screen.getByText('-₦300')).toBeTruthy();
    expect(screen.getByText('-₦100')).toBeTruthy();
  });

  it('shows no pending section when no pending transactions', async () => {
    setupHandler({
      success: true, data: {
        filter: 'all',
        summary: { total: 1, pending: 0, approved: 1, rejected: 0 },
        transactions: [
          { id: 'tx-2', userId: 'agent-123', walletId: null, withdrawalType: 'agent', amount: '300', description: 'Old withdrawal', status: 'approved', rejectionReason: null, createdAt: '2026-04-19T17:05:50.000Z', updatedAt: '2026-04-20T17:05:50.000Z' },
        ],
      },
    });

    const { default: AgentTransactions } = await import('@/features/agent/components/AgentTransactions');
    renderWithProviders(<AgentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('1 total')).toBeTruthy();
    });

    expect(screen.queryByText(/Awaiting Approval/)).toBeNull();
  });
});
