'use client';

import { useEffect, useState } from 'react';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') return;
  const { worker } = await import('@/shared/api/msw/worker');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

interface MSWProviderProps {
  children: React.ReactNode;
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [mswReady, setMswReady] = useState(
    process.env.NODE_ENV !== 'development'
  );

  useEffect(() => {
    enableMocking().then(() => setMswReady(true));
  }, []);

  if (!mswReady) return null;
  return <>{children}</>;
}
