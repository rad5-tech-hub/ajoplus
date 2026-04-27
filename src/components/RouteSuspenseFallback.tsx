import { Loader } from 'lucide-react';

/**
 * Loading fallback for lazy-loaded route components
 * Shows a spinner while the chunk is being downloaded
 * Optimized for 3G/low-end devices
 */
export function RouteSuspenseFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-emerald-100 rounded-full p-4">
          <Loader className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
        <p className="text-slate-600 font-medium">Loading...</p>
        <p className="text-slate-500 text-sm">Please wait while we prepare your page</p>
      </div>
    </div>
  );
}

export default RouteSuspenseFallback;
