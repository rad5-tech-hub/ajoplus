import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { renderWithProviders, createTestQueryClient } from '@/test/utils/renderWithProviders';
import { QueryClientProvider } from '@tanstack/react-query';

const BASE = 'https://ajoplus.bookbank.com.ng';

describe('withdrawal flows', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('PaymentStatusBanner', () => {
    it('renders nothing when no pending withdrawals', async () => {
      const { default: PaymentStatusBanner } = await import('@/components/ui/PaymentStatusBanner');
      const { container } = renderWithProviders(<PaymentStatusBanner />);
      expect(container.firstChild).toBeNull();
    });

    it('shows pending withdrawal when store has items', async () => {
      const { useWithdrawalStore } = await import('@/app/store/WithdrawalStore');
      useWithdrawalStore.setState({
        pending: [{
          id: 'w-1', userId: 'user-1', walletId: 'wallet-1', amount: 500, description: 'For transport',
          status: 'pending', rejectionReason: null, createdAt: '2026-05-13T08:32:31.000Z', updatedAt: '2026-05-13T08:36:26.000Z',
        }],
      });

      const { default: PaymentStatusBanner } = await import('@/components/ui/PaymentStatusBanner');
      renderWithProviders(<PaymentStatusBanner />);

      expect(screen.getByText('Withdrawal request pending')).toBeTruthy();
      expect(screen.getByText(/₦500/)).toBeTruthy();
    });

    it('dismiss button removes withdrawal from store', async () => {
      const { useWithdrawalStore } = await import('@/app/store/WithdrawalStore');
      useWithdrawalStore.setState({
        pending: [{
          id: 'w-1', userId: 'user-1', walletId: 'wallet-1', amount: 500, description: '',
          status: 'pending', rejectionReason: null, createdAt: '2026-05-13T08:32:31.000Z', updatedAt: '2026-05-13T08:36:26.000Z',
        }],
      });

      const { default: PaymentStatusBanner } = await import('@/components/ui/PaymentStatusBanner');
      renderWithProviders(<PaymentStatusBanner />);

      const dismissBtn = screen.getByRole('button');
      fireEvent.click(dismissBtn);

      expect(useWithdrawalStore.getState().pending).toHaveLength(0);
    });

    it('shows description text when provided', async () => {
      const { useWithdrawalStore } = await import('@/app/store/WithdrawalStore');
      useWithdrawalStore.setState({
        pending: [{
          id: 'w-1', userId: 'user-1', walletId: 'wallet-1', amount: 500, description: 'School fees',
          status: 'pending', rejectionReason: null, createdAt: '2026-05-13T08:32:31.000Z', updatedAt: '2026-05-13T08:36:26.000Z',
        }],
      });

      const { default: PaymentStatusBanner } = await import('@/components/ui/PaymentStatusBanner');
      renderWithProviders(<PaymentStatusBanner />);

      expect(screen.getByText(/"School fees"/)).toBeTruthy();
    });
  });

  describe('AgentWithdrawModal', () => {
    it('renders nothing when isOpen is false', async () => {
      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      const { container } = render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={false} onClose={() => {}} availableBalance={500} />
        </QueryClientProvider>
      );
      expect(container.firstChild).toBeNull();
    });

    it('shows available balance when open', async () => {
      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={true} onClose={() => {}} availableBalance={500} />
        </QueryClientProvider>
      );

      expect(screen.getByText('Available Balance')).toBeTruthy();
      expect(screen.getByText('₦500')).toBeTruthy();
    });

    it('submit button disabled when amount < 100', async () => {
      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={true} onClose={() => {}} availableBalance={500} />
        </QueryClientProvider>
      );

      const input = screen.getByPlaceholderText('0');
      fireEvent.change(input, { target: { value: '50' } });

      const submitBtn = screen.getByRole('button', { name: /withdraw/i });
      expect(submitBtn).toBeDisabled();
    });

    it('shows exceeded error when amount > availableBalance', async () => {
      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={true} onClose={() => {}} availableBalance={500} />
        </QueryClientProvider>
      );

      const input = screen.getByPlaceholderText('0');
      fireEvent.change(input, { target: { value: '600' } });

      expect(screen.getByText('Amount exceeds your available balance')).toBeTruthy();

      const submitBtn = screen.getByRole('button', { name: /withdraw/i });
      expect(submitBtn).toBeDisabled();
    });

    it('submit button enabled when valid amount', async () => {
      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={true} onClose={() => {}} availableBalance={500} />
        </QueryClientProvider>
      );

      const input = screen.getByPlaceholderText('0');
      fireEvent.change(input, { target: { value: '200' } });

      const submitBtn = screen.getByRole('button', { name: /withdraw/i });
      expect(submitBtn).not.toBeDisabled();
    });

    it('Use Max button sets amount to availableBalance', async () => {
      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={true} onClose={() => {}} availableBalance={500} />
        </QueryClientProvider>
      );

      fireEvent.click(screen.getByText('Use Max'));

      const input = screen.getByPlaceholderText('0') as HTMLInputElement;
      expect(input.value).toBe('500');
    });

    it('shows success state after submission', async () => {
      server.use(
        http.post(`${BASE}/api/agents/wallet/withdrawals`, () =>
          HttpResponse.json({
            success: true, statusCode: 201, data: {
              withdrawal: { id: 'w-1', amount: 200, status: 'pending' },
              availableBalance: 300, totalAvailable: 300,
            },
          })
        )
      );

      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={true} onClose={() => {}} availableBalance={500} />
        </QueryClientProvider>
      );

      const input = screen.getByPlaceholderText('0');
      fireEvent.change(input, { target: { value: '200' } });
      fireEvent.click(screen.getByRole('button', { name: /withdraw/i }));

      await waitFor(() => {
        expect(screen.getByText('Withdrawal Submitted!')).toBeTruthy();
      });

      expect(screen.getByText(/₦200/)).toBeTruthy();
    });

    it('shows error message on API failure', async () => {
      server.use(
        http.post(`${BASE}/api/agents/wallet/withdrawals`, () =>
          HttpResponse.json({ success: false, message: 'Insufficient balance' }, { status: 400 })
        )
      );

      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={true} onClose={() => {}} availableBalance={500} />
        </QueryClientProvider>
      );

      const input = screen.getByPlaceholderText('0');
      fireEvent.change(input, { target: { value: '200' } });
      fireEvent.click(screen.getByRole('button', { name: /withdraw/i }));

      await waitFor(() => {
        expect(screen.getByText('Insufficient balance')).toBeTruthy();
      });
    });

    it('calls onClose when Done button clicked after success', async () => {
      server.use(
        http.post(`${BASE}/api/agents/wallet/withdrawals`, () =>
          HttpResponse.json({
            success: true, statusCode: 201, data: {
              withdrawal: { id: 'w-1', amount: 200, status: 'pending' },
              availableBalance: 300, totalAvailable: 300,
            },
          })
        )
      );

      let closed = false;
      const { default: AgentWithdrawModal } = await import('@/components/ui/AgentWithdrawModal');
      const qc = createTestQueryClient();
      render(
        <QueryClientProvider client={qc}>
          <AgentWithdrawModal isOpen={true} onClose={() => { closed = true; }} availableBalance={500} />
        </QueryClientProvider>
      );

      fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '200' } });
      fireEvent.click(screen.getByRole('button', { name: /withdraw/i }));

      await waitFor(() => {
        expect(screen.getByText('Withdrawal Submitted!')).toBeTruthy();
      });

      fireEvent.click(screen.getByText('Done'));
      expect(closed).toBe(true);
    });
  });
});
