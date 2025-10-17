
import React from 'react';
import HeroSection from './HeroSection';
import VideoSection from './VideoSection';
import StoryCarousel from './StoryCarousel';
import PhotoGallery from './PhotoGallery';
import DownloadSection from './DownloadSection';

const AlbumPage: React.FC = () => {
  return (
    <main>
      <HeroSection />
      <VideoSection />
      <StoryCarousel />
      <PhotoGallery />
      <DownloadSection />
    </main>
  );
};

export default AlbumPage;
