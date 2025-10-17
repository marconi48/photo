import type { StoryMoment, GalleryPhoto, PhotoCategory } from './types';

export const CORRECT_PASSWORD = 'password123';

export const EVENT_DETAILS = {
  name1: 'Olivia',
  name2: 'James',
  date: 'October 26, 2024',
};

export const VIDEO_URL = 'https://videogam.net/videos/intro_promo.mp4';

export const DOWNLOAD_URL = '#';

export const STORY_MOMENTS: StoryMoment[] = [
  {
    id: 1,
    imageUrl: 'https://picsum.photos/800/1200?random=1',
    caption: 'The first look. A moment of pure anticipation and overwhelming joy captured forever.',
  },
  {
    id: 2,
    imageUrl: 'https://picsum.photos/800/1200?random=2',
    caption: 'Vows exchanged under the golden sun, promising a lifetime of adventure together.',
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/800/1200?random=3',
    caption: 'That just-married feeling. The walk back down the aisle was a blur of smiles and cheers.',
  },
  {
    id: 4,
    imageUrl: 'https://picsum.photos/800/1200?random=4',
    caption: 'Dancing under the stars, surrounded by everyone we love. A perfect end to a perfect day.',
  },
   {
    id: 5,
    imageUrl: 'https://picsum.photos/800/1200?random=5',
    caption: 'Cutting the cake, a sweet beginning to our new chapter as husband and wife.',
  },
];

export const PHOTO_CATEGORIES: PhotoCategory[] = ['All', 'Ceremony', 'Reception', 'Portraits'];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  { id: 1, imageUrl: 'https://picsum.photos/600/800?random=11', category: 'Portraits', alt: 'Bride and groom portrait' },
  { id: 2, imageUrl: 'https://picsum.photos/800/600?random=12', category: 'Ceremony', alt: 'Wedding ceremony vows' },
  { id: 3, imageUrl: 'https://picsum.photos/800/600?random=13', category: 'Reception', alt: 'Wedding reception dancing' },
  { id: 4, imageUrl: 'https://picsum.photos/600/800?random=14', category: 'Portraits', alt: 'Groom looking at bride' },
  { id: 5, imageUrl: 'https://picsum.photos/800/600?random=15', category: 'Ceremony', alt: 'Walking down the aisle' },
  { id: 6, imageUrl: 'https://picsum.photos/800/600?random=16', category: 'Reception', alt: 'Wedding cake cutting' },
  { id: 7, imageUrl: 'https://picsum.photos/800/600?random=17', category: 'Ceremony', alt: 'Guests at the ceremony' },
  { id: 8, imageUrl: 'https://picsum.photos/600/800?random=18', category: 'Portraits', alt: 'Bride smiling' },
  { id: 9, imageUrl: 'https://picsum.photos/800/600?random=19', category: 'Reception', alt: 'Toasting at the reception' },
  { id: 10, imageUrl: 'https://picsum.photos/600/800?random=20', category: 'Portraits', alt: 'Couple embracing' },
  { id: 11, imageUrl: 'https://picsum.photos/800/600?random=21', category: 'Ceremony', alt: 'Ring exchange' },
  { id: 12, imageUrl: 'https://picsum.photos/800/600?random=22', category: 'Reception', alt: 'First dance' },
];