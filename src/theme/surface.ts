import { createContext, useContext } from 'react';
import { colors } from './tokens';

/**
 * Text colours for whatever background a section sits on. Popups take the
 * colour of their card, so headings and body text switch palette to stay
 * readable; light inner panels (cards, chips, dialogs) reset to LIGHT.
 */
export type Surface = {
  bg?: string;
  ink: string; // headings
  soft: string; // body text
  accent: string; // eyebrows, small labels
  rule: string; // the short line before eyebrows
};

export const LIGHT: Surface = {
  ink: colors.plum,
  soft: colors.plumSoft,
  accent: colors.mauveDeep,
  rule: colors.mauve,
};

/** Rose / blush backgrounds: keep dark text, but stronger than on cream. */
export const TINTED: Surface = {
  ink: colors.plum,
  soft: '#47363F',
  accent: colors.plum,
  rule: colors.plum,
};

/** Plum backgrounds: light text. */
export const DARK: Surface = {
  ink: colors.cream,
  soft: colors.blush,
  accent: colors.rose,
  rule: colors.rose,
};

export const SurfaceContext = createContext<Surface>(LIGHT);

export const useSurface = () => useContext(SurfaceContext);
