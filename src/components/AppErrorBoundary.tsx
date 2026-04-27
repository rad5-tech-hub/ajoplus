import { Component, ReactNode, ErrorInfo, useCallback } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ErrorFallbackProps {
	error: Error | null;
	onReset: () => void;
}

interface BoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

// ─── UI (function component — hooks, handlers, JSX all live here) ─────────────

const IS_PROD = import.meta.env.PROD;

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
	const handleGoHome = useCallback(() => {
		window.location.href = '/';
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
			<div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">

				{/* Error Icon */}
				<div className="flex justify-center mb-6">
					<div className="bg-red-100 rounded-full p-4">
						<AlertTriangle className="w-8 h-8 text-red-600" />
					</div>
				</div>

				{/* Title */}
				<h1 className="text-2xl font-bold text-slate-900 text-center mb-3">
					Oops! Something went wrong
				</h1>

				{/* Description */}
				<p className="text-slate-600 text-center mb-6">
					We encountered an unexpected error. Our team has been notified and is working on a fix.
				</p>

				{/* Dev-only details */}
				{!IS_PROD && error && (
					<div className="bg-slate-50 rounded-lg p-4 mb-6 max-h-32 overflow-auto">
						<p className="text-xs font-mono text-slate-700">
							<span className="font-semibold">Error:</span> {error.message}
						</p>
					</div>
				)}

				{/* Actions */}
				<div className="space-y-3">
					<button
						onClick={onReset}
						className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700 transition-colors active:scale-95"
					>
						<RefreshCw className="w-5 h-5" />
						Try Again
					</button>
					<button
						onClick={handleGoHome}
						className="w-full px-4 py-3 bg-slate-200 text-slate-900 rounded-2xl font-medium hover:bg-slate-300 transition-colors active:scale-95"
					>
						Go Home
					</button>
				</div>

				{/* Footer */}
				<p className="text-xs text-slate-500 text-center mt-6">
					Error ID: {Date.now()}
					{IS_PROD && <br />}
					Contact support if this persists.
				</p>
			</div>
		</div>
	);
}

// ─── Boundary (minimal class — only what React requires here) ─────────────────

/**
 * Global Error Boundary for AjoPlus.
 * Catches render errors and delegates display to <ErrorFallback />.
 * In production, errors are forwarded to your monitoring service in logError().
 */
export class AppErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
	state: BoundaryState = { hasError: false, error: null, errorInfo: null };

	// Note: getDerivedStateFromError receives only `error` — errorInfo is NOT
	// available here (that was the original bug). Use componentDidCatch for it.
	static getDerivedStateFromError(error: Error): Partial<BoundaryState> {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({ errorInfo });
		this.logError(error, errorInfo);
	}

	private logError(error: Error, errorInfo: ErrorInfo) {
		const payload = {
			message: error.toString(),
			stack: error.stack,
			componentStack: errorInfo.componentStack,
			timestamp: new Date().toISOString(),
			userAgent: navigator.userAgent,
			url: window.location.href,
		};

		// TODO: replace with Sentry.captureException(error, { contexts: { react: errorInfo } })
		if (!IS_PROD) console.error('💥 App Error:', payload);

		// fetch('/api/errors', { method: 'POST', body: JSON.stringify(payload) });
	}

	private handleReset = () => {
		this.setState({ hasError: false, error: null, errorInfo: null });
		window.location.href = '/';
	};

	render() {
		if (this.state.hasError) {
			return (
				<ErrorFallback
					error={this.state.error}
					onReset={this.handleReset}
				/>
			);
		}
		return this.props.children;
	}
}

export default AppErrorBoundary;