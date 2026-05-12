import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './index.css';
import { initializeErrorMonitoring } from './lib/errorMonitoring';

// Initialize error monitoring before app starts
initializeErrorMonitoring();

// One-time migration: clear stale localStorage from old builds
const MIGRATION_KEY = 'AbaGold-migration-v3';
if (!localStorage.getItem(MIGRATION_KEY)) {
  ['daily-ajo-storage', 'AbaGold-withdrawals', 'AbaGold-pending-payments', 'AbaGold-cart']
    .forEach((key) => localStorage.removeItem(key));
  localStorage.setItem(MIGRATION_KEY, '1');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);