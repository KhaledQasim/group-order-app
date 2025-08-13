'use client';

import { Suspense } from 'react';
import GroupOrderApp from '@/components/GroupOrderApp';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-2">🍕</div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GroupOrderApp />
    </Suspense>
  );
}
