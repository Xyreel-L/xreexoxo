import { gallery } from '@/data/gallery';

const ALL_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'projects', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
] as const;

export type SectionId = (typeof ALL_ITEMS)[number]['id'];

/** Sections shown in the menu. Gallery appears only once it has photos. */
export const NAV_ITEMS = ALL_ITEMS.filter((i) => i.id !== 'gallery' || gallery.length > 0);
