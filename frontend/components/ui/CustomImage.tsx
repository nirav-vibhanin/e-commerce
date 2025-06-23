'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CustomImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function CustomImage({ src, alt, className = '' }: CustomImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Always use the default image if src is not valid
  const defaultImage = '/assets/images/image2.jpg';
  const imageSrc = src && typeof src === 'string' && src.trim() !== '' ? src : defaultImage;

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`${isLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'} transition-all duration-300 object-cover`}
        onLoad={handleLoad}
        onError={() => {
          setIsLoading(false);
          // If the main image fails, force use of default image
          const img = document.querySelector(`img[alt="${alt}"]`) as HTMLImageElement;
          if (img) {
            img.src = defaultImage;
          }
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-400 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 