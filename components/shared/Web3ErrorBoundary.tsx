'use client';

import React, { ReactNode } from 'react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Button } from '@/components/shared/Button';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface Web3ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  showRetry?: boolean;
}

function Web3ErrorFallback({
  error,
  resetErrorBoundary,
  showRetry = true,
}: {
  error?: Error;
  resetErrorBoundary: () => void;
  showRetry?: boolean;
}) {
  const isNetworkError =
    error?.message?.includes('network') || error?.message?.includes('provider') || error?.message?.includes('RPC');

  const isWalletError =
    error?.message?.includes('wallet') || error?.message?.includes('MetaMask') || error?.message?.includes('connector');

  const getErrorIcon = () => {
    if (isNetworkError) return <WifiOff className='h-6 w-6 text-orange-500' />;
    if (isWalletError) return <Wifi className='h-6 w-6 text-blue-500' />;
    return <AlertTriangle className='h-6 w-6 text-red-500' />;
  };

  const getErrorTitle = () => {
    if (isNetworkError) return 'Network Connection Issue';
    if (isWalletError) return 'Wallet Connection Issue';
    return 'Web3 Service Unavailable';
  };

  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Unable to connect to the blockchain network. Please check your internet connection and try again.';
    }
    if (isWalletError) {
      return 'There was an issue with your wallet connection. Please reconnect your wallet.';
    }
    return 'Web3 functionality is temporarily unavailable. Please refresh the page or try again later.';
  };

  return (
    <div className='flex flex-col items-center justify-center p-6 space-y-4 bg-card border rounded-lg'>
      <div className='flex justify-center'>
        <div className='rounded-full bg-muted p-3'>{getErrorIcon()}</div>
      </div>

      <div className='text-center space-y-2'>
        <h3 className='font-semibold text-foreground'>{getErrorTitle()}</h3>
        <p className='text-sm text-muted-foreground max-w-md'>{getErrorMessage()}</p>
      </div>

      {showRetry && (
        <div className='flex gap-2'>
          <Button onClick={resetErrorBoundary} variant='default' size='sm'>
            Try Again
          </Button>
          {isWalletError && (
            <Button onClick={() => window.location.reload()} variant='outline' size='sm'>
              Refresh Page
            </Button>
          )}
        </div>
      )}

      {process.env.NODE_ENV === 'development' && error && (
        <details className='text-xs text-muted-foreground max-w-md'>
          <summary className='cursor-pointer'>Debug Info</summary>
          <pre className='mt-2 p-2 bg-muted rounded text-xs overflow-auto'>{error.message}</pre>
        </details>
      )}
    </div>
  );
}

export function Web3ErrorBoundary({ children, fallback, showRetry = true }: Web3ErrorBoundaryProps) {
  if (fallback) {
    return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
  }

  return (
    <ErrorBoundary
      fallback={<Web3ErrorFallback resetErrorBoundary={() => {}} showRetry={showRetry} />}
      onError={(error, errorInfo) => {
        // Log Web3-specific errors
        console.error('Web3 Error:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          isNetworkError: error.message?.includes('network'),
          isWalletError: error.message?.includes('wallet'),
        });
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// HOC for Web3 components
export function withWeb3ErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Web3ErrorBoundaryProps, 'children'>,
) {
  const WrappedComponent = (props: P) => (
    <Web3ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </Web3ErrorBoundary>
  );

  WrappedComponent.displayName = `withWeb3ErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
