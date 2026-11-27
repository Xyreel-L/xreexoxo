import { Platform, TextStyle } from 'react-native';

export const colors = {
  rose: '#D99BAA', // primary accent
  blush: '#EBC5CB', // secondary accent
  cream: '#F7EDE3', // page background
  ivory: '#FFF9F4', // cards / surfaces
  mauve: '#B8798C', // buttons, links, highlights
  plum: '#40333A', // headings + body text

  // derived
  mauveDeep: '#9A5F72', // AA-contrast text on cream/ivory for links & labels
  plumSoft: '#6B5A62', // secondary text (AA on cream)
  line: '#E6D3CB', // hairline borders
  lineStrong: '#D9BFB6',
  blushTint: '#F4DDE0',
  overlay: 'rgba(64, 51, 58, 0.55)',
  white: '#FFFFFF',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 72,
  giant: 112,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
  pill: 999,
} as const;

export const layout = {
  maxWidth: 1160,
  navHeight: 68,
} as const;

/**
 * Web loads the families from Google Fonts in +html.tsx and picks weights with
 * fontWeight. Native uses the files loaded by expo-font in _layout.tsx.
 */
const isWeb = Platform.OS === 'web';

type Weight = '400' | '500' | '600' | '700';

const nativeSans: Record<Weight, string> = {
  '400': 'Manrope_400Regular',
  '500': 'Manrope_500Medium',
  '600': 'Manrope_600SemiBold',
  '700': 'Manrope_700Bold',
};
const nativeSerif: Record<Weight, string> = {
  '400': 'Fraunces_400Regular',
  '500': 'Fraunces_500Medium',
  '600': 'Fraunces_600SemiBold',
  '700': 'Fraunces_700Bold',
};

export function sans(weight: Weight = '400'): TextStyle {
  return isWeb
    ? { fontFamily: 'Manrope, "Segoe UI", system-ui, sans-serif', fontWeight: weight }
    : { fontFamily: nativeSans[weight] };
}

export function serif(weight: Weight = '500'): TextStyle {
  return isWeb
    ? { fontFamily: 'Fraunces, Georgia, "Times New Roman", serif', fontWeight: weight }
    : { fontFamily: nativeSerif[weight] };
}

export const shadow = {
  soft: {
    shadowColor: '#7A4E5C',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  lifted: {
    shadowColor: '#7A4E5C',
    shadowOpacity: 0.16,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 16 },
    elevation: 6,
  },
} as const;
