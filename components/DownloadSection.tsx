
import React, { useState } from 'react';
import { DOWNLOAD_URL } from '../constants';

const DownloadSection: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    // Simulate a download process for 2.5 seconds
    setTimeout(() => {
      setIsLoading(false);
      
      // In a real app, you might trigger the download programmatically
      // For this example, we'll create a temporary link and click it.
      const link = document.createElement('a');
      link.href = DOWNLOAD_URL;
      link.setAttribute('download', 'everlasting-moments-album.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2500);
  };

  return (
    <section className="py-16 md:py-24 bg-brand-dark text-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Take Your Memories With You</h2>
        <p className="max-w-xl mx-auto text-white/80 mb-10">
          Click the button below to download a single ZIP file containing all the high-resolution photos and video files from our special day.
        </p>
        <a 
          href={DOWNLOAD_URL}
          download
          onClick={handleDownloadClick}
          className={`inline-flex items-center justify-center bg-brand-gold text-white font-bold text-lg py-4 px-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-gold transition-all duration-300 ease-in-out ${
            isLoading 
              ? 'opacity-70 cursor-not-allowed' 
              : 'hover:bg-white hover:text-brand-dark transform hover:scale-105'
          }`}
          aria-disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </>
          ) : (
            'DOWNLOAD ALL FILES (ZIP)'
          )}
        </a>
      </div>
      <footer className="text-center mt-16 text-xs text-white/40">
        <p>This site is private and protected by client password.</p>
      </footer>
    </section>
  );
};

export default DownloadSection;
