
import React from 'react';
import { CameraIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="bg-indigo-600 p-2 rounded-lg mr-3">
          <CameraIcon className="w-6 h-6 text-white" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">AI Product Photo Studio</h1>
            <p className="text-sm text-gray-500">Generate professional e-commerce images in seconds</p>
        </div>
      </div>
    </header>
  );
};
