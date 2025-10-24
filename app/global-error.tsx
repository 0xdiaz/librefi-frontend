'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className='min-h-screen flex items-center justify-center p-6'>
          <div className='max-w-md text-center space-y-4'>
            <h2 className='text-xl font-semibold'>Something went wrong!</h2>
            <p className='text-muted-foreground'>An unexpected error occurred. Please try again.</p>
            <button
              onClick={reset}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
