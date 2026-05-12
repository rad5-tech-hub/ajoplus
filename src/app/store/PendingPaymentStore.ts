import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PaymentType } from '@/api/payments';

export interface PendingPaymentEntry {
  id: string;
  paymentType: PaymentType;
  amountPaid: string;
  submittedAt: string;
}

interface PendingPaymentStore {
  pending: PendingPaymentEntry[];
  addPending: (entry: PendingPaymentEntry) => void;
  removePending: (id: string) => void;
  clearAll: () => void;
}

export const usePendingPaymentStore = create<PendingPaymentStore>()(
  persist(
    (set) => ({
      pending: [],
      addPending: (entry) =>
        set((state) => ({
          pending: [entry, ...state.pending.filter((p) => p.id !== entry.id)],
        })),
      removePending: (id) =>
        set((state) => ({
          pending: state.pending.filter((p) => p.id !== id),
        })),
      clearAll: () => set({ pending: [] }),
    }),
    { name: 'AbaGold-pending-payments' }
  )
);