import { Download } from 'lucide-react';

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptId: string;
}

const ReceiptPreviewModal = ({ isOpen, onClose, receiptId }: ReceiptPreviewModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden">
        <div className="p-5 md:p-6 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg md:text-xl">Receipt Preview</h3>
          <button 
            onClick={onClose} 
            className="text-3xl leading-none text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        </div>
        
        <div className="p-8 md:p-12 bg-slate-50 flex flex-col items-center">
          <div className="text-6xl md:text-7xl mb-6">📄</div>
          <p className="font-medium text-slate-800 text-lg">Payment Receipt</p>
          <p className="text-xs text-slate-500 mt-1">/receipt-{receiptId}.jpg</p>
        </div>

        <div className="p-5 md:p-6 flex gap-3 border-t">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 border border-slate-300 rounded-2xl font-medium hover:bg-slate-50 text-base"
          >
            Close
          </button>
          <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 text-base">
            <Download className="w-5 h-5" /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPreviewModal;