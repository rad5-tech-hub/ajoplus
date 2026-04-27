import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isProduction: boolean;
}

/**
 * Global Error Boundary for AjoPlus
 * Catches render errors and displays a user-friendly error page
 * In production, errors are logged to external monitoring service
 */
export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isProduction: import.meta.env.PROD,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error tracking service in production
    this.logError(error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // TODO: Send to Sentry, LogRocket, or your error tracking service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
    // For now, log to console in development
    if (!this.state.isProduction) {
      console.error('💥 App Error:', errorData);
    }

    // In a real app, send to your backend:
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorData) });
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Optionally reload the page to reset app state
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-3">
              Oops! Something went wrong
            </h1>

            {/* Error Description */}
            <p className="text-slate-600 text-center mb-6">
              We encountered an unexpected error. Our team has been notified and is working on a fix.
            </p>

            {/* Error Details (Development Only) */}
            {!this.state.isProduction && this.state.error && (
              <div className="bg-slate-50 rounded-lg p-4 mb-6 max-h-32 overflow-auto">
                <p className="text-xs font-mono text-slate-700">
                  <span className="font-semibold">Error:</span> {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-2xl font-medium hover:bg-emerald-700 transition-colors active:scale-95"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full px-4 py-3 bg-slate-200 text-slate-900 rounded-2xl font-medium hover:bg-slate-300 transition-colors active:scale-95"
              >
                Go Home
              </button>
            </div>

            {/* Support Info */}
            <p className="text-xs text-slate-500 text-center mt-6">
              Error ID: {Date.now()}
              {this.state.isProduction && (
                <br />
              )}
              Contact support if this persists.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
