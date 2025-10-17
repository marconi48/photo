
export interface StoryMoment {
  id: number;
  imageUrl: string;
  caption: string;
}

export type PhotoCategory = 'All' | 'Ceremony' | 'Reception' | 'Portraits';

export interface GalleryPhoto {
  id: number;
  imageUrl: string;
  category: PhotoCategory;
  alt: string;
}
