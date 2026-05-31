import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { renderWithProviders, seedCustomerAuth } from '@/test/utils/renderWithProviders';

const BASE = 'https://ajoplus.bookbank.com.ng';

function setupHandlers(overrides: {
  transactions?: { count: number; transactions: unknown[] };
  pendingPayments?: { summary: unknown; payments: unknown[] };
  pendingWithdrawals?: { count: number; withdrawals: unknown[] };
} = {}) {
  const {
    transactions = { count: 2, transactions: [
      { id: 't-1', userId: 'user-1', title: 'package', amount: '5000', status: 'success', createdAt: '2026-05-13T10:00:00.000Z', updatedAt: '2026-05-13T10:00:00.000Z' },
      { id: 't-2', userId: 'user-1', title: 'withdrawal', amount: '2000', status: 'failed', createdAt: '2026-05-12T10:00:00.000Z', updatedAt: '2026-05-12T10:00:00.000Z' },
    ] },
    pendingPayments = { summary: { total: 0, byType: { package: 0, product: 0, saving: 0 } }, payments: [] },
    pendingWithdrawals = { count: 0, withdrawals: [] },
  } = overrides;

  server.use(
    http.get(`${BASE}/api/transactions`, () =>
      HttpResponse.json({ success: true, data: transactions })
    ),
    http.get(`${BASE}/api/payment/payments/me/pending`, () =>
      HttpResponse.json({ success: true, data: pendingPayments })
    ),
    http.get(`${BASE}/api/customer/wallet/withdrawals/pending`, () =>
      HttpResponse.json({ success: true, data: pendingWithdrawals })
    ),
  );
}

describe('RecentTransactions component', () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedCustomerAuth();
  });

  it('shows loading skeleton', async () => {
    server.use(
      http.get(`${BASE}/api/transactions`, () => new Promise(() => {})),
      http.get(`${BASE}/api/payment/payments/me/pending`, () => new Promise(() => {})),
      http.get(`${BASE}/api/customer/wallet/withdrawals/pending`, () => new Promise(() => {})),
    );

    const { default: RecentTransactions } = await import('@/features/customer/components/RecentTransactions');
    renderWithProviders(<RecentTransactions />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows error state with retry', async () => {
    server.use(
      http.get(`${BASE}/api/transactions`, () =>
        HttpResponse.json({ success: false, message: 'Server error' }, { status: 422 })
      ),
      http.get(`${BASE}/api/payment/payments/me/pending`, () =>
        HttpResponse.json({ success: true, data: { summary: { total: 0, byType: { package: 0, product: 0, saving: 0 } }, payments: [] } })
      ),
      http.get(`${BASE}/api/customer/wallet/withdrawals/pending`, () =>
        HttpResponse.json({ success: true, data: { count: 0, withdrawals: [] } })
      ),
    );

    const { default: RecentTransactions } = await import('@/features/customer/components/RecentTransactions');
    renderWithProviders(<RecentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load transactions')).toBeTruthy();
    });
    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('shows empty state with browse button', async () => {
    setupHandlers({
      transactions: { count: 0, transactions: [] },
    });

    const { default: RecentTransactions } = await import('@/features/customer/components/RecentTransactions');
    renderWithProviders(<RecentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('No Transactions Yet')).toBeTruthy();
    });

    expect(screen.getByText('Browse Packages')).toBeTruthy();
  });

  it('shows confirmed transactions list', async () => {
    setupHandlers();

    const { default: RecentTransactions } = await import('@/features/customer/components/RecentTransactions');
    renderWithProviders(<RecentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('2 total')).toBeTruthy();
    });

    expect(screen.getByText('Package Payment')).toBeTruthy();
    expect(screen.getByText('Withdrawal')).toBeTruthy();

    expect(screen.getByText('Success')).toBeTruthy();
    expect(screen.getByText('Rejected')).toBeTruthy();
  });

  it('shows pending section when pending items exist', async () => {
    setupHandlers({
      pendingPayments: {
        summary: { total: 1, byType: { package: 1, product: 0, saving: 0 } },
        payments: [{
          id: 'pp-1', userId: 'user-1', userPackageId: null, productId: null,
          savingPlanId: null, amountPaid: '3000', expectedAmount: '3000',
          paymentType: 'package', receiptUrl: 'test.jpg',
          rejectionReason: null, status: 'pending',
          createdAt: '2026-05-14T10:00:00.000Z', updatedAt: '2026-05-14T10:00:00.000Z',
          user: { id: 'user-1', fullName: 'John Doe', email: 'john@example.com', phoneNumber: '08012345678' },
        }],
      },
    });

    const { default: RecentTransactions } = await import('@/features/customer/components/RecentTransactions');
    renderWithProviders(<RecentTransactions />);

    await waitFor(() => {
      expect(screen.getByText(/Awaiting Approval \(1\)/)).toBeTruthy();
    });

    expect(screen.getByText('Pending')).toBeTruthy();
  });

  it('shows correct credit/debit icons and colors', async () => {
    setupHandlers();

    const { default: RecentTransactions } = await import('@/features/customer/components/RecentTransactions');
    renderWithProviders(<RecentTransactions />);

    await waitFor(() => {
      expect(screen.getByText('Package Payment')).toBeTruthy();
    });

    // Credit (package, saving, product) should have + sign
    expect(screen.getByText('+₦5,000')).toBeTruthy();

    // Debit (withdrawal) should have - sign
    expect(screen.getByText('-₦2,000')).toBeTruthy();
  });

  it('shows pending withdrawals section', async () => {
    setupHandlers({
      pendingWithdrawals: {
        count: 1,
        withdrawals: [{
          id: 'pw-1', userId: 'user-1', walletId: 'wallet-1', withdrawalType: 'wallet',
          amount: '1500', description: 'Cash out', status: 'pending',
          rejectionReason: null, createdAt: '2026-05-15T08:00:00.000Z', updatedAt: '2026-05-15T08:00:00.000Z',
          wallet: { id: 'wallet-1', savingPlanId: 'plan-1', availableBalance: '10000', commissionPaid: '500' },
        }],
      },
    });

    const { default: RecentTransactions } = await import('@/features/customer/components/RecentTransactions');
    renderWithProviders(<RecentTransactions />);

    await waitFor(() => {
      expect(screen.getByText(/Awaiting Approval \(1\)/)).toBeTruthy();
    });

    expect(screen.getAllByText('Withdrawal')).toHaveLength(2);
  });
});
