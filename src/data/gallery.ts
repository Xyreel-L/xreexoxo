import type { GalleryPhoto } from '@/types/content';

/**
 * ✏️ Photo gallery. The section (and its menu link) appears automatically
 * once this list has at least one photo.
 *
 * 1. Put compressed photos in src/assets/gallery/ (≈1600px wide, under ~400 KB).
 * 2. Add an entry, e.g.
 *    {
 *      id: 'formal',
 *      image: require('@/assets/gallery/formal.jpg'),
 *      alt: 'Formal portrait of Xyreel Laguras',
 *      caption: 'Formal portrait',
 *      orientation: 'portrait',
 *    },
 */
export const gallery: GalleryPhoto[] = [];
