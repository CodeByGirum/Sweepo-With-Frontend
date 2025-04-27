'use client';

import ChatLoader from '@/components/workstationUi/ChatLoader';
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-20 w-full">
      <ChatLoader/>
      Analyzing...
      {/* <div className="w-12 h-12 border-4 border-gray-300 border-t-[#007185] rounded-full animate-spin"></div> */}
    </div>

  );
};

export default Loading;
