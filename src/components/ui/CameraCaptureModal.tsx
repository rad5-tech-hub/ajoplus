import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Loader2, X } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

const CameraCaptureModal = ({ isOpen, onClose, onCapture }: CameraCaptureModalProps) => {
  const webcamRef = useRef<Webcam>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamReady, setStreamReady] = useState(false);

  const handleCapture = useCallback(() => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;
    setPreview(screenshot);
    setStreamReady(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!preview) return;
    try {
      const res = await fetch(preview);
      const blob = await res.blob();
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      onCapture(file);
      onClose();
    } catch {
      setError('Failed to process image. Please try again.');
    }
  }, [preview, onCapture, onClose]);

  const handleRetake = () => {
    setPreview(null);
  };

  const handleUserMediaError = () => {
    setError('Camera permission denied. Please allow camera access in your browser settings.');
    setStreamReady(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg mx-auto shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-brand-900">Take Photo</h2>
          <button onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {error && (
            <div className="flex flex-col items-center justify-center h-64 text-center gap-4 px-6">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                <Camera className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm text-slate-600">{error}</p>
              <button onClick={onClose}
                className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer">
                Close
              </button>
            </div>
          )}

          {!error && !preview && (
            <div className="relative">
              {!streamReady && (
                <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3 bg-slate-900 rounded-2xl">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-sm">Accessing camera...</p>
                </div>
              )}
              <Webcam
                ref={webcamRef}
                videoConstraints={videoConstraints}
                screenshotFormat="image/jpeg"
                mirrored={true}
                playsInline
                muted
                onUserMedia={() => setStreamReady(true)}
                onUserMediaError={handleUserMediaError}
                className={`w-full h-64 object-cover rounded-2xl bg-slate-900 ${streamReady ? '' : 'hidden'}`}
              />
              {streamReady && (
                <button onClick={handleCapture}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Capture photo">
                  <div className="w-10 h-10 bg-brand-600 rounded-full" />
                </button>
              )}
            </div>
          )}

          {preview && (
            <div className="relative">
              <img src={preview} alt="Captured preview" className="w-full h-64 object-cover rounded-2xl bg-slate-100" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <button onClick={handleRetake}
                  className="bg-white text-slate-700 font-medium px-4 py-2 rounded-2xl text-sm shadow hover:bg-slate-50 transition-all cursor-pointer">
                  Retake
                </button>
                <button onClick={handleConfirm}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2 rounded-2xl text-sm shadow transition-all cursor-pointer">
                  Use Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureModal;
