import React from 'react';
import { Bot } from 'lucide-react';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Bot className="w-16 h-16 text-purple-400 mb-4 mx-auto animate-pulse" />
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Warthog v16
        </h1>
        <p className="text-gray-400">Initializing trading systems...</p>
        <div className="mt-4 w-48 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div className="w-full h-full bg-purple-500 rounded-full animate-load"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
