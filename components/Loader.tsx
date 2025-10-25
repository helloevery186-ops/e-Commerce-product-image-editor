
import React from 'react';
import { SpinnerIcon } from './icons';

export const Loader: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
      <SpinnerIcon className="w-12 h-12 text-indigo-600" />
      <p className="mt-4 text-lg font-semibold text-gray-700">Generating your image...</p>
      <p className="text-sm text-gray-500">This may take a few moments.</p>
    </div>
  );
};
