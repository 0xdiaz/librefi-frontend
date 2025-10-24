'use client';

import React, { useState } from 'react';
import { Button } from '@/components/shared/Button';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { Web3ErrorBoundary } from '@/components/shared/Web3ErrorBoundary';

// Component that throws errors for testing
function ErrorThrowingComponent({ errorType }: { errorType: string }) {
  const throwError = () => {
    switch (errorType) {
      case 'general':
        throw new Error('Test general error for error boundary');
      case 'network':
        throw new Error('network connection failed - RPC error');
      case 'wallet':
        throw new Error('wallet connection failed - MetaMask error');
      default:
        throw new Error('Unknown error type');
    }
  };

  // Throw error on render
  throwError();
  return null;
}

// Safe component for testing
function SafeComponent() {
  return (
    <div className='p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg'>
      <p className='text-green-700 dark:text-green-400'>✅ This component is working correctly!</p>
    </div>
  );
}

export function ErrorBoundaryTest() {
  const [errorType, setErrorType] = useState<string | null>(null);
  const [showSafe, setShowSafe] = useState(true);

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className='p-4 bg-muted rounded-lg'>
        <p className='text-sm text-muted-foreground'>Error boundary testing is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6 bg-card border rounded-lg'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>Error Boundary Testing</h3>
        <p className='text-sm text-muted-foreground'>
          Test different types of errors to verify error boundaries are working correctly.
        </p>
      </div>

      <div className='space-y-4'>
        <div className='flex flex-wrap gap-2'>
          <Button onClick={() => setErrorType('general')} variant='destructive' size='sm'>
            Test General Error
          </Button>
          <Button onClick={() => setErrorType('network')} variant='destructive' size='sm'>
            Test Network Error
          </Button>
          <Button onClick={() => setErrorType('wallet')} variant='destructive' size='sm'>
            Test Wallet Error
          </Button>
          <Button onClick={() => setErrorType(null)} variant='outline' size='sm'>
            Reset
          </Button>
          <Button onClick={() => setShowSafe(!showSafe)} variant='ghost' size='sm'>
            Toggle Safe Component
          </Button>
        </div>

        {/* Test General Error Boundary */}
        <div>
          <h4 className='font-medium mb-2'>General Error Boundary:</h4>
          <ErrorBoundary showDetails={true}>
            {errorType === 'general' ? (
              <ErrorThrowingComponent errorType='general' />
            ) : showSafe ? (
              <SafeComponent />
            ) : (
              <div className='p-4 bg-muted rounded-lg'>
                <p className='text-sm text-muted-foreground'>Component hidden</p>
              </div>
            )}
          </ErrorBoundary>
        </div>

        {/* Test Web3 Error Boundary */}
        <div>
          <h4 className='font-medium mb-2'>Web3 Error Boundary:</h4>
          <Web3ErrorBoundary>
            {errorType === 'network' || errorType === 'wallet' ? (
              <ErrorThrowingComponent errorType={errorType} />
            ) : showSafe ? (
              <SafeComponent />
            ) : (
              <div className='p-4 bg-muted rounded-lg'>
                <p className='text-sm text-muted-foreground'>Component hidden</p>
              </div>
            )}
          </Web3ErrorBoundary>
        </div>
      </div>

      <div className='text-xs text-muted-foreground space-y-1'>
        <p>
          • <strong>General Error:</strong> Tests the main ErrorBoundary component
        </p>
        <p>
          • <strong>Network Error:</strong> Tests Web3ErrorBoundary with network-related error
        </p>
        <p>
          • <strong>Wallet Error:</strong> Tests Web3ErrorBoundary with wallet-related error
        </p>
        <p>
          • <strong>Reset:</strong> Clears all errors and shows safe components
        </p>
      </div>
    </div>
  );
}
