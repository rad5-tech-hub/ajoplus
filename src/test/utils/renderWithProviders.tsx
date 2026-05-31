import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { ReactNode } from 'react';
import { mockUser } from '../mocks/fixtures';

interface RenderConfig extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps;
}

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactNode,
  config: RenderConfig = {}
) {
  const queryClient = createTestQueryClient();
  const { routerProps, ...renderOptions } = config;

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter {...routerProps}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }), queryClient };
}

export function seedCustomerAuth() {
  window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
    state: { user: mockUser, token: 'test-token', refreshToken: 'test-refresh', isAuthenticated: true },
    version: 0,
  }));
}

export function seedAgentAuth() {
  const agentUser = { ...mockUser, id: 'agent-123', role: 'agent', email: 'adebayo@example.com' };
  window.localStorage.setItem('AbaGold-auth-storage', JSON.stringify({
    state: { user: agentUser, token: 'test-token', refreshToken: 'test-refresh', isAuthenticated: true },
    version: 0,
  }));
}

export function seedAdminAuth() {
  window.localStorage.setItem('AbaGold-admin-auth-storage', JSON.stringify({
    state: { admin: { id: 'admin-1', email: 'admin@test.com' }, token: 'admin-token', isAuthenticated: true },
    version: 0,
  }));
}

export function clearAuth() {
  window.localStorage.clear();
}
