"use client"
import React, { useRef, useState } from 'react';
import { Button } from './ui/button';

interface BackgroundUploadProps {
  onBackgroundSet?: (imageUrl: string) => void;
  className?: string;
}

const BackgroundUpload: React.FC<BackgroundUploadProps> = ({ 
  onBackgroundSet, 
  className = "" 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<string | null>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert file to base64 for persistent storage
      const base64Url = await convertToBase64(file);
      
      // Apply the background
      applyBackground(base64Url);
      
      // Store in localStorage for persistence (now as base64)
      localStorage.setItem('customBackground', base64Url);
      
      // Call the callback if provided
      onBackgroundSet?.(base64Url);
      
      setCurrentBackground(base64Url);
    } catch (error) {
      console.error('Error setting background:', error);
      alert('Error setting background image');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const applyBackground = (imageUrl: string) => {
    // Apply background to the main content area, not the entire body
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    if (mainContent) {
      mainContent.style.backgroundImage = `url(${imageUrl})`;
      mainContent.style.backgroundSize = 'cover';
      mainContent.style.backgroundPosition = 'center';
      mainContent.style.backgroundRepeat = 'no-repeat';
      mainContent.style.backgroundAttachment = 'fixed';
    }
  };

  const removeBackground = () => {
    const mainContent = document.querySelector('.main-content') as HTMLElement;
    if (mainContent) {
      mainContent.style.backgroundImage = '';
      mainContent.style.backgroundSize = '';
      mainContent.style.backgroundPosition = '';
      mainContent.style.backgroundRepeat = '';
      mainContent.style.backgroundAttachment = '';
    }
    
    localStorage.removeItem('customBackground');
    setCurrentBackground(null);
  };

  // Load saved background on component mount
  React.useEffect(() => {
    const savedBackground = localStorage.getItem('customBackground');
    if (savedBackground) {
      setCurrentBackground(savedBackground);
      applyBackground(savedBackground);
    }
  }, []);

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        onClick={handleFileSelect}
        disabled={isUploading}
        variant="outline"
        className="flex items-center gap-2"
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Uploading...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {currentBackground ? 'Change Background' : 'Set Background'}
          </>
        )}
      </Button>

      {currentBackground && (
        <Button
          onClick={removeBackground}
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Remove
        </Button>
      )}
    </div>
  );
};

export default BackgroundUpload;
