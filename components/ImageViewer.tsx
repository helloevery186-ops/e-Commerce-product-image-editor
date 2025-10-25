import React from 'react';
import { DownloadIcon } from './icons';

interface ImageViewerProps {
  title: string;
  imageUrl: string;
  isDownloadable?: boolean;
  downloadFilename?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ title, imageUrl, isDownloadable = false, downloadFilename }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;

    let finalFilename = 'edited-product-image.png';
    if (downloadFilename) {
        const lastDot = downloadFilename.lastIndexOf('.');
        const baseName = lastDot > -1 ? downloadFilename.substring(0, lastDot) : downloadFilename;
        finalFilename = `${baseName}.png`;
    }
    link.download = finalFilename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {isDownloadable && (
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 transition-colors text-sm font-semibold"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Download</span>
          </button>
        )}
      </div>
      <div className="flex-grow flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden aspect-square">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};