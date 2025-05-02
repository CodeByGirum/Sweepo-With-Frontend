'use client';

import React from 'react';
import Loading from '@/components/Loading';

const LoadingPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
};

export default LoadingPage;
