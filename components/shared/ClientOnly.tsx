'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

/**
 * Component that only renders children on the client side
 * Prevents SSR hydration issues with Web3 components
 */
export function ClientOnly({ children, fallback = null, errorFallback }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{fallback}</>;
  }

  return <ErrorBoundary fallback={errorFallback || fallback}>{children}</ErrorBoundary>;
}
