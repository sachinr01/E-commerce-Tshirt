'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global app error:', error);
  }, [error]);

  return (
    <div className="err-page">
      <div className="err-inner">
        <h2>Something went wrong</h2>
        <p>We could not load this page right now. Please try again.</p>
        <div className="err-actions">
          <button onClick={reset} className="err-btn-primary">Try again</button>
          <Link href="/" className="err-btn-secondary">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
