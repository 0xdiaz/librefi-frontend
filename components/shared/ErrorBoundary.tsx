'use client';

import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/shared/Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when specified props change
    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some((resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey);

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      window.clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
      });
    }, 0);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-[400px] flex items-center justify-center p-6'>
          <div className='max-w-md w-full text-center space-y-6'>
            <div className='flex justify-center'>
              <div className='rounded-full bg-red-100 dark:bg-red-900/30 p-3'>
                <AlertTriangle className='h-8 w-8 text-red-600 dark:text-red-400' />
              </div>
            </div>

            <div className='space-y-2'>
              <h2 className='text-xl font-semibold text-foreground'>Something went wrong</h2>
              <p className='text-sm text-muted-foreground'>
                An unexpected error occurred. Please try refreshing the page or go back to the homepage.
              </p>
            </div>

            {/* Show error details in development */}
            {this.props.showDetails && this.state.error && process.env.NODE_ENV === 'development' && (
              <div className='text-left bg-muted p-4 rounded-lg border'>
                <details className='text-xs'>
                  <summary className='cursor-pointer font-medium mb-2'>Error Details</summary>
                  <div className='space-y-2'>
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className='whitespace-pre-wrap overflow-auto text-xs mt-1'>{this.state.error.stack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Button onClick={this.resetErrorBoundary} variant='default' size='sm' className='gap-2'>
                <RefreshCw className='h-4 w-4' />
                Try Again
              </Button>
              <Button onClick={() => (window.location.href = '/')} variant='outline' size='sm' className='gap-2'>
                <Home className='h-4 w-4' />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for manually triggering error boundary
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}
