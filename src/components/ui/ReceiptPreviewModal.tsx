import { Download, X } from 'lucide-react';

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptId?: string;
  imageUrl?: string;
}

const ReceiptPreviewModal = ({ isOpen, onClose, receiptId, imageUrl }: ReceiptPreviewModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-200 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <h3 className="font-semibold text-brand-900">Receipt Preview</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-slate-50 flex items-center justify-center min-h-[300px]">
          {imageUrl ? (
            <img src={imageUrl} alt="Payment receipt"
              className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-3">📄</div>
              <p className="font-medium text-slate-700">Payment Receipt</p>
              {receiptId && <p className="text-xs text-slate-400 mt-1">/receipt-{receiptId}.jpg</p>}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex gap-3 shrink-0">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-slate-300 rounded-2xl font-medium text-sm hover:bg-slate-50 transition-colors cursor-pointer">
            Close
          </button>
          {imageUrl && (
            <a href={imageUrl} download
              className="flex-1 py-2.5 bg-brand-600 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-700 transition-colors cursor-pointer">
              <Download className="w-4 h-4" /> Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreviewModal;
