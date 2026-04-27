/**
 * Error Monitoring & Logging
 * Centralized error tracking for production monitoring
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
	Info = 'info',
	Warning = 'warning',
	Error = 'error',
	Critical = 'critical',
}

/**
 * Error context for tracking
 */
export interface ErrorContext {
	userId?: string;
	userEmail?: string;
	page?: string;
	action?: string;
	metadata?: Record<string, unknown>;
	tags?: Record<string, string>;
}

/**
 * Initialize error monitoring services
 * Call this once on app startup
 */
export function initializeErrorMonitoring() {
	if (import.meta.env.PROD) {
		// Initialize Sentry for error tracking
		initSentry();

		// Initialize LogRocket for session replay
		// initLogRocket();
	}

	// Global error handler
	window.addEventListener('error', (event) => {
		captureError(event.error, {
			action: 'Uncaught Error',
		});
	});

	// Unhandled promise rejection handler
	window.addEventListener('unhandledrejection', (event) => {
		captureError(event.reason, {
			action: 'Unhandled Promise Rejection',
		});
	});
}

/**
 * Initialize Sentry for error tracking
 * Requires: npm install @sentry/react @sentry/tracing
 */
function initSentry() {
	// TODO: Uncomment and configure when Sentry is ready
	// import * as Sentry from '@sentry/react';
	// Sentry.init({
	//   dsn: import.meta.env.VITE_SENTRY_DSN,
	//   environment: import.meta.env.MODE,
	//   integrations: [
	//     new Sentry.Replay({
	//       maskAllText: true,
	//       blockAllMedia: true,
	//     }),
	//   ],
	//   tracesSampleRate: 0.1,
	//   replaysSessionSampleRate: 0.1,
	//   replaysOnErrorSampleRate: 1.0,
	// });
}

/**
 * Initialize LogRocket for session replay
 * Requires: npm install logrocket
 */
// function initLogRocket() {
// TODO: Uncomment and configure when LogRocket is ready
// import LogRocket from 'logrocket';
// LogRocket.init(import.meta.env.VITE_LOGROCKET_ID!);
// }

/**
 * Capture error and send to monitoring service
 */
export function captureError(
	error: Error | string,
	context?: ErrorContext,
	severity: ErrorSeverity = ErrorSeverity.Error
) {
	const errorData = {
		message: typeof error === 'string' ? error : error.message,
		stack: typeof error === 'string' ? undefined : error.stack,
		severity,
		context,
		timestamp: new Date().toISOString(),
		userAgent: navigator.userAgent,
		url: window.location.href,
	};

	if (import.meta.env.PROD) {
		// Send to Sentry
		// import * as Sentry from '@sentry/react';
		// Sentry.captureException(error, { contexts: { custom: context } });

		// Send to LogRocket
		// import LogRocket from 'logrocket';
		// LogRocket.captureException(error);

		// Send to custom backend
		sendToBackend('/api/errors', errorData).catch(console.warn);
	}

	// Log to console in development
	if (import.meta.env.DEV) {
		console.error('🚨 Error captured:', errorData);
	}
}

/**
 * Capture warning message
 */
export function captureWarning(message: string, context?: ErrorContext) {
	captureError(message, context, ErrorSeverity.Warning);
}

/**
 * Capture info message
 */
export function captureInfo(message: string, context?: ErrorContext) {
	captureError(message, context, ErrorSeverity.Info);
}

/**
 * Set user context for error tracking
 */
// export function setErrorUser(userId: string, email?: string) {
if (import.meta.env.PROD) {
	// import * as Sentry from '@sentry/react';
	// Sentry.setUser({ id: userId, email });

	// import LogRocket from 'logrocket';
	// LogRocket.identify(userId, { email });
}
// }

/**
 * Add breadcrumb for tracking user actions
 */
export function addBreadcrumb(message: string, metadata?: Record<string, unknown>) {
	if (import.meta.env.PROD) {
		// import * as Sentry from '@sentry/react';
		// Sentry.captureMessage(message, 'info');

		// import LogRocket from 'logrocket';
		// LogRocket.log(message, metadata);
	}

	if (import.meta.env.DEV) {
		console.log(`📍 ${message}`, metadata);
	}
}

/**
 * Send error data to backend
 */
async function sendToBackend(
	endpoint: string,
	data: Record<string, unknown>
): Promise<void> {
	try {
		await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data),
		});
	} catch (error) {
		console.error('Failed to send error to backend:', error);
	}
}

export default {
	initializeErrorMonitoring,
	captureError,
	captureWarning,
	captureInfo,
	// setErrorUser,
	addBreadcrumb,
	ErrorSeverity,
};
