import React from 'react';
import { STORY_MOMENTS } from '../constants';
import type { StoryMoment } from '../types';

const StoryCard: React.FC<{ moment: StoryMoment; index: number }> = ({ moment, index }) => {
  return (
    <div
      className="flex-shrink-0 w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/4 snap-center p-3 animate-fade-in-up"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both' }}
    >
      <div className="group bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden h-full flex flex-col">
        <img 
          src={moment.imageUrl} 
          alt={`Story moment ${moment.id}`} 
          className="w-full h-80 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" 
          loading="lazy"
        />
        <div className="p-4 flex-grow">
          <p className="text-brand-dark/80 text-sm font-light leading-relaxed">{moment.caption}</p>
        </div>
      </div>
    </div>
  );
};


const StoryCarousel: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-light">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Moments We Will Cherish Forever</h2>
        <p className="max-w-2xl mx-auto text-brand-dark/70 mb-12">
          A few highlights from our story, told through the moments that took our breath away.
        </p>
      </div>
      <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-3">
        {/* Add padding div for snapping at the start */}
        <div className="flex-shrink-0 w-1/12 sm:w-1/6"></div>
        {STORY_MOMENTS.map((moment, index) => (
          <StoryCard key={moment.id} moment={moment} index={index} />
        ))}
        {/* Add padding div for snapping at the end */}
        <div className="flex-shrink-0 w-1/12 sm:w-1/6"></div>
      </div>
    </section>
  );
};

export default StoryCarousel;