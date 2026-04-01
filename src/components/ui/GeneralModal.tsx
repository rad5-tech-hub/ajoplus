import { useModalStore } from '@/app/store/ModalStore';

const Modal = () => {
  const { isOpen, type, message } = useModalStore();

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
    <div className="w-[60%] md:w-[25%] fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className={` text-sm px-3 md:px-6 py-1 md:py-3 rounded-2xl flex items-center gap-4 shadow-lg border ${colorStyles[type || 'info']}`}
      >
        <span className=''>{icons[type || 'info']}</span>
        {message}
      </div>
    </div>
  );
};

export default Modal;