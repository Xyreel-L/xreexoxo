import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';

/**
 * Scroll-triggered reveal for the web.
 *
 * Content is visible in the pre-rendered HTML (so nothing is ever hidden if
 * JavaScript is slow). After hydration, anything still below the fold is
 * hidden and then fades in when it scrolls into view.
 */
export function useInView() {
  const ref = useRef<React.ComponentRef<typeof View>>(null);
  const [state, setState] = useState<'idle' | 'hidden' | 'shown'>('idle');

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const node = ref.current as unknown as HTMLElement | null;
    if (!node || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return; // already on screen

    setState('hidden');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return { ref, hidden: state === 'hidden' };
}
