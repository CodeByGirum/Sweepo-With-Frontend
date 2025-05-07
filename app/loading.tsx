'use client';

import Loading from '@/components/Loading';

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#121212] bg-opacity-80 z-50">
      <Loading />
    </div>
  );
} 