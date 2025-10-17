import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { GalleryPhoto } from '../types';

interface LightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ photos, currentIndex, onClose, onNext, onPrev }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [swipeToCloseOffset, setSwipeToCloseOffset] = useState(0);
  const [isSnappingBack, setIsSnappingBack] = useState(false);

  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const panStartRef = useRef({ x: 0, y: 0 });
  const initialPinchDistRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipeDirection = useRef<'horizontal' | 'vertical' | null>(null);
  
  const currentPhoto = photos[currentIndex];

  const resetTransform = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsPanning(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      resetTransform();
    }, 300);
  }, [onClose, resetTransform]);

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    resetTransform();
    setIsImageVisible(false);
    setTimeout(() => {
      if (direction === 'next') {
        onNext();
      } else {
        onPrev();
      }
      setIsImageVisible(true);
    }, 150);
  }, [onNext, onPrev, resetTransform]);

  useEffect(() => {
    const fadeInTimer = setTimeout(() => setIsVisible(true), 10);
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (scale === 1) { // Only allow arrow nav when not zoomed
        if (e.key === 'ArrowRight') handleNavigation('next');
        if (e.key === 'ArrowLeft') handleNavigation('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(fadeInTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [handleClose, handleNavigation, scale]);
  
  const clampPosition = useCallback((pos: {x: number, y: number}, currentScale: number) => {
    if (!imageWrapperRef.current || currentScale <= 1) return { x: 0, y: 0 };
    
    const imgElement = imageWrapperRef.current.querySelector('img');
    const containerRect = imageWrapperRef.current.getBoundingClientRect();
    if (!imgElement) return pos;

    const imgWidth = imgElement.offsetWidth * currentScale;
    const imgHeight = imgElement.offsetHeight * currentScale;

    const overpanX = (imgWidth - containerRect.width) / 2;
    const overpanY = (imgHeight - containerRect.height) / 2;

    const maxX = Math.max(0, overpanX);
    const minX = -maxX;
    const maxY = Math.max(0, overpanY);
    const minY = -maxY;

    return {
      x: Math.max(minX, Math.min(maxX, pos.x)),
      y: Math.max(minY, Math.min(maxY, pos.y)),
    };
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomIntensity = 0.1;
    const direction = e.deltaY < 0 ? 1 : -1;
    const newScale = Math.max(1, Math.min(scale + direction * zoomIntensity * scale, 4));
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newPosition = {
        x: position.x + (mouseX - position.x) * (1 - newScale / scale),
        y: position.y + (mouseY - position.y) * (1 - newScale / scale),
    };

    setScale(newScale);
    setPosition(clampPosition(newPosition, newScale));
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1 || e.button !== 0) return;
    e.preventDefault();
    setIsPanning(true);
    panStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    e.preventDefault();
    const newPos = { x: e.clientX - panStartRef.current.x, y: e.clientY - panStartRef.current.y };
    setPosition(clampPosition(newPos, scale));
  };

  const handleMouseUpOrLeave = () => setIsPanning(false);
  
  const getTouchDistance = (touches: React.TouchList) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) { // Pinch
      initialPinchDistRef.current = getTouchDistance(e.touches);
    } else if (e.touches.length === 1 && scale > 1) { // Pan
      setIsPanning(true);
      panStartRef.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
    } else if (e.touches.length === 1 && scale === 1) { // Swipe (nav or close)
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      swipeDirection.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current > 0) { // Pinching
      const currentDist = getTouchDistance(e.touches);
      const ratio = currentDist / initialPinchDistRef.current;
      const newScale = Math.max(1, Math.min(scale * ratio, 4));
      setScale(newScale);
    } else if (isPanning && e.touches.length === 1) { // Panning
      const newPos = { x: e.touches[0].clientX - panStartRef.current.x, y: e.touches[0].clientY - panStartRef.current.y };
      setPosition(clampPosition(newPos, scale));
    } else if (touchStartRef.current && scale === 1 && e.touches.length === 1) { // Swiping
      const deltaX = e.touches[0].clientX - touchStartRef.current.x;
      const deltaY = e.touches[0].clientY - touchStartRef.current.y;

      if (swipeDirection.current === null && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
        swipeDirection.current = Math.abs(deltaY) > Math.abs(deltaX) ? 'vertical' : 'horizontal';
      }

      if (swipeDirection.current === 'vertical' && deltaY > 0) {
        e.preventDefault();
        setSwipeToCloseOffset(deltaY);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPanning(false);
    initialPinchDistRef.current = 0;
    
    if (swipeDirection.current === 'vertical') {
      if (swipeToCloseOffset > 100) {
        handleClose();
      } else {
        setIsSnappingBack(true);
        setSwipeToCloseOffset(0);
      }
    } else if (swipeDirection.current === 'horizontal' && touchStartRef.current) {
      const touchEndX = e.changedTouches[0].clientX;
      const deltaX = touchEndX - touchStartRef.current.x;
      if (Math.abs(deltaX) > 50) {
        handleNavigation(deltaX < 0 ? 'next' : 'prev');
      }
    }
    
    touchStartRef.current = null;
    swipeDirection.current = null;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const newScale = direction === 'in' ? Math.min(scale * 1.5, 4) : Math.max(scale / 1.5, 1);
    setScale(newScale);
    setPosition(clampPosition(position, newScale));
  };

  if (!currentPhoto) return null;
  
  const imageStyles: React.CSSProperties = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
    transition: isPanning ? 'none' : 'transform 0.1s ease-out',
    touchAction: 'none'
  };

  const wrapperStyles: React.CSSProperties = {
    transform: `translateY(${swipeToCloseOffset}px)`,
    transition: swipeDirection.current === 'vertical' ? 'none' : isSnappingBack ? 'transform 0.3s ease-out' : 'transform 0.3s ease-in-out, scale 0.3s ease-in-out',
    scale: isVisible ? '1' : '0.95',
  };
  
  const backdropBgAlpha = 0.8 * Math.max(0.4, 1 - swipeToCloseOffset / 500);

  return (
    <div 
      className={`group fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundColor: `rgba(0, 0, 0, ${backdropBgAlpha})` }}
      onClick={(e) => e.target === e.currentTarget && swipeToCloseOffset === 0 && handleClose()}
      role="dialog" aria-modal="true" aria-label="Image viewer"
    >
      {/* Zoom Controls */}
      <div className="absolute top-4 left-4 z-[51] flex items-center gap-1 bg-black/20 p-1 rounded-lg text-white">
        <button onClick={() => handleZoom('in')} aria-label="Zoom in" className="p-2 hover:text-brand-gold transition-colors disabled:opacity-50" disabled={scale >= 4}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
        </button>
        <button onClick={() => handleZoom('out')} aria-label="Zoom out" className="p-2 hover:text-brand-gold transition-colors disabled:opacity-50" disabled={scale <= 1}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>
        </button>
        {scale > 1 && (
          <button onClick={resetTransform} aria-label="Reset zoom" className="p-2 hover:text-brand-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 1v-4m0 0h-4m4 0l-5 5" /></svg>
          </button>
        )}
      </div>

      {/* Close Button */}
      <button onClick={handleClose} className="absolute top-4 right-4 text-white text-4xl hover:text-brand-gold transition-colors z-[51]" aria-label="Close image view">&times;</button>
      
      {/* Prev Button */}
      <button onClick={() => handleNavigation('prev')} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/20 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-black/40 transition-all duration-300 disabled:opacity-0" aria-label="Previous image" disabled={scale > 1}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      
      {/* Next Button */}
      <button onClick={() => handleNavigation('next')} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/20 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-black/40 transition-all duration-300 disabled:opacity-0" aria-label="Next image" disabled={scale > 1}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>
      
      {/* Image Wrapper */}
      <div 
        ref={imageWrapperRef}
        className={`relative max-w-4xl max-h-[90vh] w-full p-4 overflow-hidden`}
        style={{ ...wrapperStyles, cursor: scale > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTransitionEnd={() => setIsSnappingBack(false)}
      >
        {!isImageVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-white/30 border-t-brand-gold" role="status" aria-label="Loading image"></div>
          </div>
        )}
        <img 
          key={currentPhoto.id}
          src={currentPhoto.imageUrl} 
          alt={currentPhoto.alt}
          className={`w-full h-full object-contain rounded-lg shadow-2xl transition-opacity duration-300 ease-in-out ${isImageVisible ? 'opacity-100' : 'opacity-0'}`}
          style={imageStyles}
        />
      </div>

      {/* Visual indicators for keyboard shortcuts */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm font-sans tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      >
        Use&nbsp;
        <kbd className="font-sans border border-white/50 rounded-md px-2 py-1 text-xs mx-0.5 bg-black/20">←</kbd>
        &nbsp;
        <kbd className="font-sans border border-white/50 rounded-md px-2 py-1 text-xs mx-0.5 bg-black/20">→</kbd>
        &nbsp;to navigate, and&nbsp;
        <kbd className="font-sans border border-white/50 rounded-md px-2 py-1 text-xs mx-0.5 bg-black/20">ESC</kbd>
        &nbsp;to close.
      </div>
    </div>
  );
};

export default Lightbox;