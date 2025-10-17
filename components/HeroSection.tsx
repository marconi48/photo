
import React, { useState, useEffect } from 'react';
import { EVENT_DETAILS } from '../constants';

const HeroSection: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const highResUrl = 'https://picsum.photos/1920/1080?random=0';

  useEffect(() => {
    const img = new Image();
    img.src = highResUrl;
    img.onload = () => {
      setImageSrc(highResUrl);
    };
  }, [highResUrl]);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-white bg-brand-dark">
      {/* Background Image with lazy load and fade-in effect */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${imageSrc ? 'opacity-100' : 'opacity-0'}`}
        style={{ backgroundImage: imageSrc ? `url(${imageSrc})` : 'none' }}
        aria-hidden="true"
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 text-center animate-fade-in">
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-tight">
          {EVENT_DETAILS.name1} &amp; {EVENT_DETAILS.name2}
        </h1>
        <p className="font-sans text-lg md:text-xl mt-4 uppercase tracking-widest">
          {EVENT_DETAILS.date}
        </p>
        <a 
          href="#photo-gallery"
          className="mt-10 inline-block bg-brand-gold text-white font-semibold py-3 px-8 rounded-md hover:bg-white hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-brand-gold transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Relive the Story
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
