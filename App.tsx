import React, { useState, useCallback } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { ImageViewer } from './components/ImageViewer';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { editProductImage } from './services/geminiService';
import { ImageFile } from './types';

// State for each image being processed
interface ImageProcessingState {
  id: string; // Unique identifier for the list key
  original: ImageFile;
  editedUrl: string | null;
  status: 'processing' | 'done' | 'error';
  errorMessage: string | null;
}

const App: React.FC = () => {
  const [processedImages, setProcessedImages] = useState<ImageProcessingState[]>([]);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error('Failed to read file as base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });

  const handleImageUpload = useCallback(async (files: File[]) => {
    const initialImages: ImageProcessingState[] = files.map(file => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      original: {
        file,
        previewUrl: URL.createObjectURL(file),
      },
      editedUrl: null,
      status: 'processing',
      errorMessage: null,
    }));

    setProcessedImages(initialImages);

    // Process each image and update state as it completes for a better UX
    initialImages.forEach(async (imageState) => {
      try {
        const base64Data = await fileToBase64(imageState.original.file);
        const resultBase64 = await editProductImage(base64Data, imageState.original.file.type);
        const editedUrl = `data:image/png;base64,${resultBase64}`;

        setProcessedImages(currentImages =>
          currentImages.map(img =>
            img.id === imageState.id ? { ...img, status: 'done', editedUrl } : img
          )
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setProcessedImages(currentImages =>
          currentImages.map(img =>
            img.id === imageState.id ? { ...img, status: 'error', errorMessage } : img
          )
        );
      }
    });
  }, []);
  
  const resetState = () => {
    // Revoke object URLs to prevent memory leaks
    processedImages.forEach(img => URL.revokeObjectURL(img.original.previewUrl));
    setProcessedImages([]);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {processedImages.length === 0 ? (
            <ImageUpload onImageUpload={handleImageUpload} />
          ) : (
            <div className="space-y-12">
              {processedImages.map((image) => (
                <div key={image.id} className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                  <h2 className="text-md font-semibold text-gray-700 mb-4 truncate" title={image.original.file.name}>
                    {image.original.file.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <ImageViewer title="Original Image" imageUrl={image.original.previewUrl} />
                    <div className="relative">
                      {image.status === 'processing' && <Loader />}
                      {image.status === 'done' && image.editedUrl && (
                        <ImageViewer
                          title="Edited Image"
                          imageUrl={image.editedUrl}
                          isDownloadable={true}
                          downloadFilename={image.original.file.name}
                        />
                      )}
                      {image.status === 'error' && (
                        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex flex-col h-full">
                          <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-bold text-red-600">Processing Failed</h3>
                          </div>
                          <div className="flex-grow flex items-center justify-center bg-red-50 text-red-700 rounded-lg overflow-hidden aspect-square p-4">
                            <p className="text-center text-sm">{image.errorMessage}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
    
              <div className="text-center mt-8">
                <button
                    onClick={resetState}
                    className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 shadow-lg"
                >
                    Process Another Batch
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;