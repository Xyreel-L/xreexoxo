import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

/** Size used for the pre-rendered HTML and the first (hydrating) client render. */
const SSR_VIEWPORT = { width: 1440, height: 900 };

/** True once the app has hydrated in the browser. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/**
 * Like useWindowDimensions, but safe for static rendering: the server and the
 * first client render agree on SSR_VIEWPORT, then the real size takes over.
 */
export function useViewport() {
  const real = useWindowDimensions();
  return useHydrated() ? real : SSR_VIEWPORT;
}
