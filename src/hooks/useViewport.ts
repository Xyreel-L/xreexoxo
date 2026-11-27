import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

/** Size used for the pre-rendered HTML and the first (hydrating) client render. */
const SSR_VIEWPORT = { width: 1440, height: 900 };

/**
 * Like useWindowDimensions, but safe for static rendering: the server and the
 * first client render agree on SSR_VIEWPORT, then the real size takes over.
 * (React does not patch mismatched styles while hydrating, so reading the real
 * size during hydration leaves the pre-rendered desktop layout on phones.)
 */
export function useViewport() {
  const real = useWindowDimensions();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated ? real : SSR_VIEWPORT;
}
