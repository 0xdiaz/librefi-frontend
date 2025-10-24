import '@/lib/polyfills'; // Must be first import for SSR compatibility
import { Inter } from 'next/font/google';
import '@rainbow-me/rainbowkit/styles.css';
import Script from 'next/script';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RootProvider } from '@/providers/RootProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LibreFi',
  description: 'Permissionless margin trading platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Script src='/wallet-protection.js' strategy='beforeInteractive' />
        <ErrorBoundary showDetails={true}>
          <RootProvider>
            <div className='min-h-screen flex flex-col bg-background'>
              <ErrorBoundary
                fallback={
                  <div className='bg-destructive/10 border-destructive/20 border p-4 text-center'>
                    <p className='text-sm text-destructive'>Header failed to load</p>
                  </div>
                }
              >
                <Header />
              </ErrorBoundary>
              <main className='flex-1'>
                <ErrorBoundary showDetails={true}>{children}</ErrorBoundary>
                <NotificationProvider />
              </main>
              <ErrorBoundary
                fallback={
                  <div className='bg-muted/50 border-t p-4 text-center'>
                    <p className='text-sm text-muted-foreground'>Footer unavailable</p>
                  </div>
                }
              >
                <Footer />
              </ErrorBoundary>
            </div>
          </RootProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
