import { useWindowDimensions } from 'react-native';

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    /** Columns for card grids */
    columns: width >= 1024 ? 3 : width >= 640 ? 2 : 1,
  };
}
