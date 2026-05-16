import { useRef, useState, useEffect } from 'react';
import { Camera, Loader2, X } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraCaptureModal = ({ isOpen, onClose, onCapture }: CameraCaptureModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    const start = async () => {
      setLoading(true);
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => video.play().catch(() => {});
        }
        setLoading(false);
      } catch (err: unknown) {
        if (cancelled) return;
        const msg = err instanceof DOMException
          ? err.name === 'NotAllowedError'
            ? 'Camera permission denied. Please allow camera access in your browser settings.'
            : err.name === 'NotFoundError'
              ? 'No camera found on this device.'
              : `Camera error: ${err.message}`
          : 'Could not access camera.';
        setError(msg);
        setLoading(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setPreview(canvas.toDataURL('image/jpeg', 0.8));
  };

  const handleConfirm = () => {
    if (!preview) return;
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      onCapture(file);
      onClose();
    }, 'image/jpeg', 0.8);
  };

  const handleRetake = () => setPreview(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg mx-auto shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-blue-950">Take Photo</h2>
          <button onClick={() => { if (streamRef.current) { streamRef.current.getTracks().forEach((t) => t.stop()); streamRef.current = null; } onClose(); }}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Accessing camera...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center gap-4 px-6">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                <Camera className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm text-slate-600">{error}</p>
              <button onClick={() => onClose()}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2.5 rounded-2xl text-sm transition-all cursor-pointer">
                Close
              </button>
            </div>
          )}

          {!loading && !error && !preview && (
            <div className="relative">
              <video ref={videoRef} autoPlay playsInline muted
                className="w-full h-64 object-cover rounded-2xl bg-slate-900" />
              <button onClick={handleCapture}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Capture photo">
                <div className="w-10 h-10 bg-amber-600 rounded-full" />
              </button>
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
                  className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2 rounded-2xl text-sm shadow transition-all cursor-pointer">
                  Use Photo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCaptureModal;
