import React, { useState, useMemo, useRef, useEffect } from 'react';
import type { GalleryPhoto } from '../types';

interface PhotoItemProps {
  photo: GalleryPhoto;
  onClick: () => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fallback for browsers that don't support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Observe only once
        }
      },
      {
        // Load the image when it's 200px away from the bottom of the viewport
        rootMargin: '0px 0px 200px 0px',
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const aspectRatio = useMemo(() => {
    try {
      // Parses aspect ratio from picsum.photos URL format, e.g., https://picsum.photos/600/800
      const parts = photo.imageUrl.split('/');
      const width = parseInt(parts[parts.length - 2]);
      const height = parseInt(parts[parts.length - 1]);
      if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        return `${width} / ${height}`;
      }
    } catch (e) {
      // Fails silently and falls back to default
    }
    return '1 / 1'; // Default to a square aspect ratio if parsing fails
  }, [photo.imageUrl]);
  
  const lowResUrl = useMemo(() => {
    try {
      const urlParts = photo.imageUrl.split('?');
      const baseUrl = urlParts[0];
      const query = urlParts.length > 1 ? `?${urlParts[1]}` : '';

      const pathParts = baseUrl.split('/');
      const width = parseInt(pathParts[pathParts.length - 2]);
      const height = parseInt(pathParts[pathParts.length - 1]);

      if (!isNaN(width) && !isNaN(height)) {
        const lowResWidth = Math.max(20, Math.round(width / 20));
        const lowResHeight = Math.max(20, Math.round(height / 20));
        return `https://picsum.photos/${lowResWidth}/${lowResHeight}${query}`;
      }
    } catch (e) {
      console.error("Failed to parse image URL for blur-up effect:", e);
    }
    return ''; // Fallback
  }, [photo.imageUrl]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={containerRef}
      role="button"
      aria-label={`View image: ${photo.alt}`}
      tabIndex={0}
      className="group cursor-pointer overflow-hidden rounded-lg relative bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold"
      style={{ aspectRatio }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {/* Low-resolution, blurred placeholder. */}
      {isInView && lowResUrl && (
        <img
          src={lowResUrl}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Loading Spinner Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity duration-300 ${
          isInView && !isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div 
          className="w-8 h-8 rounded-full animate-spin border-4 border-solid border-white/50 border-t-brand-gold" 
          role="status" 
          aria-label="Loading image"
        ></div>
      </div>

      {/* High-resolution image. */}
      <img
        src={isInView ? photo.imageUrl : ''}
        alt={photo.alt}
        className={`absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 ease-in-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default PhotoItem;