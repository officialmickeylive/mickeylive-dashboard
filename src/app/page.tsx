'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Basic redirect for now, middleware will handle this properly in Phase 1.3
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg">
      <div className="text-neon-cyan animate-pulse">Initializing System...</div>
    </div>
  );
}
