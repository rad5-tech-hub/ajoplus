import { useModalStore } from '@/app/store/ModalStore';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const Modal = () => {
  const { isOpen, type, message, closeModal } = useModalStore();

  // Auto hide after 5 seconds (optional but recommended)
  useEffect(() => {
    if (isOpen && closeModal) {
      const timer = setTimeout(closeModal, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  const colorStyles = {
    success: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    error: 'bg-red-100 border-red-200 text-red-800',
    info: 'bg-blue-100 border-blue-200 text-blue-800',
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md md:w-[380px]">
      <div
        className={`text-sm px-4 md:px-6 py-3 md:py-4 rounded-2xl flex items-center gap-3 shadow-xl border ${colorStyles[type || 'info']}`}
      >
        <span className="text-xl flex-shrink-0">{icons[type || 'info']}</span>

        <p className="flex-1 font-medium pr-2">{message}</p>

        <button
          onClick={closeModal}
          className="ml-auto text-current opacity-70 hover:opacity-100 p-1 -mr-1 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Modal;