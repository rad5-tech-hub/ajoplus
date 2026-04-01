import { create } from 'zustand';

type ModalType = 'success' | 'error' | 'info' | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message: string;

  openModal: (data: {
    type?: ModalType;
    title: string;
    message: string;
  }) => void;

  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  title: '',
  message: '',

  openModal: ({ type = 'success', title, message }) =>
    set({
      isOpen: true,
      type,
      title,
      message,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      type: null,
      title: '',
      message: '',
    }),
}));