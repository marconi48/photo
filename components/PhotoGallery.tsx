import React, { useState, useMemo } from 'react';
import { GALLERY_PHOTOS, PHOTO_CATEGORIES } from '../constants';
import type { GalleryPhoto, PhotoCategory } from '../types';
import Lightbox from './Lightbox';
import PhotoItem from './PhotoItem';

const PhotoGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<PhotoCategory>('All');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const filteredPhotos = useMemo(() => {
    if (activeFilter === 'All') {
      return GALLERY_PHOTOS;
    }
    return GALLERY_PHOTOS.filter(photo => photo.category === activeFilter);
  }, [activeFilter]);

  const handleCloseLightbox = () => {
    setSelectedImageIndex(null);
  };

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prevIndex) => 
      prevIndex === null ? 0 : (prevIndex + 1) % filteredPhotos.length
    );
  };
  
  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prevIndex) => 
      prevIndex === null ? 0 : (prevIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  };

  return (
    <>
      <section id="photo-gallery" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">Complete Photo Album</h2>
          <p className="max-w-2xl mx-auto text-brand-dark/70 mb-8">
            Browse through our collection of memories. Click on any photo to see it in full view.
          </p>

          <div className="flex justify-center space-x-2 md:space-x-4 mb-12">
            {PHOTO_CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 md:px-6 text-sm md:text-base rounded-full transition-colors duration-300 ${
                  activeFilter === category 
                    ? 'bg-brand-gold text-white' 
                    : 'bg-gray-200 text-brand-dark hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPhotos.map((photo, index) => (
              <PhotoItem 
                key={photo.id} 
                photo={photo} 
                onClick={() => setSelectedImageIndex(index)} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {selectedImageIndex !== null && (
        <Lightbox 
          photos={filteredPhotos}
          currentIndex={selectedImageIndex}
          onClose={handleCloseLightbox}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
    </>
  );
};

export default PhotoGallery;