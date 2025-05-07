'use client';

import React from 'react';
import Loading from '@/components/Loading';

export default function LoadingPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121212] text-white">
      <Loading />
    </div>
  );
}
