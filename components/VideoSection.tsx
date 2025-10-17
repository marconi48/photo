import React from 'react';
import { VIDEO_URL } from '../constants';

const VideoSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Our Film: The Day in Motion</h2>
        <p className="max-w-2xl mx-auto text-brand-dark/70 mb-8">
          A cinematic look back at the laughter, tears, and unforgettable moments that made our day so special.
        </p>
        <div className="aspect-w-16 aspect-h-9 max-w-4xl mx-auto shadow-2xl rounded-lg overflow-hidden bg-black">
          <video 
            controls
            // FIX: The src attribute for the video was empty, causing a compilation error. It has been set to the imported VIDEO_URL constant.
            src={VIDEO_URL}
            title="Our Film: The Day in Motion" 
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <p className="mt-6 text-sm text-brand-dark/60">
          Full Ceremony & Speeches available <a href="#" className="underline hover:text-brand-gold transition-colors">HERE</a>.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;