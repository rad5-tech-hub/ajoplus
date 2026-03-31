// src/features/customer/payments/components/UploadReceiptModal.tsx
import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';

interface UploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageName: string;
  recommendedAmount: string;
  onSuccess: (amount: string) => void;
}

const UploadReceiptModal = ({ 
  isOpen, 
  onClose, 
//   packageName, 
  recommendedAmount,
  onSuccess 
}: UploadReceiptModalProps) => {
  
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith('image/') || droppedFile.type === 'application/pdf')) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const removeFile = () => setFile(null);

  const handleSubmit = () => {
    if (!amount || !file) return;
    onSuccess(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b">
          <h2 className="text-2xl font-semibold text-slate-900">Upload Receipt</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Receipt Image Upload */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Receipt Image</p>
            {!file ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-emerald-400 rounded-2xl p-10 text-center transition-all cursor-pointer min-h-45
                  ${isDragging ? 'bg-emerald-50 border-emerald-600' : 'hover:border-emerald-500'}`}
              >
                <div className="mx-auto w-12 h-12 text-emerald-500 mb-4">
                  <Upload className="w-full h-full" />
                </div>
                <p className="font-medium text-slate-700">Click to upload receipt</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="border-2 border-emerald-200 bg-emerald-50 rounded-2xl p-6 text-center">
                <div className="text-emerald-600 mb-2">✓ File selected</div>
                <p className="text-sm font-medium text-slate-900 break-all">{file.name}</p>
                <button 
                  onClick={removeFile}
                  className="text-red-600 text-sm mt-4 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Amount Input */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Amount Paid</p>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="Enter amount"
              className="w-full border border-slate-200 focus:border-emerald-500 rounded-2xl px-5 py-4 text-lg focus:outline-none transition-colors"
            />
            <p className="text-xs text-slate-500 mt-2">Recommended: {recommendedAmount}</p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 border-t bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 border-2 border-slate-300 hover:bg-slate-100 font-medium py-3.5 rounded-2xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || !file}
            className={`flex-1 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              amount && file 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Upload className="w-5 h-5" />
            Submit Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadReceiptModal;