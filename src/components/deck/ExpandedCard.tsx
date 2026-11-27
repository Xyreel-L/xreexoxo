import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  PressableStateCallbackType,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import { ChevronLeft, ChevronRight, X } from '@/components/ui/icons';
import { colors, sans, serif } from '@/theme/tokens';
import { CompactSection } from '@/components/ui/SectionContext';
import { DECK } from './cards';
import type { CardRect } from './DeckHero';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };
type Phase = 'from' | 'open' | 'closing';

const DURATION = 520;

/**
 * Popup for one deck card. It grows out of the card's spot in the fan (keeping
 * its tilt) into a centred modal over a dimmed backdrop; closing reverses it.
 */
export function ExpandedCard({
  id,
  from,
  onClose,
  onSwitch,
}: {
  id: string;
  from?: CardRect;
  onClose: () => void;
  onSwitch: (id: string) => void;
}) {
  const { width: vw, height: vh } = useWindowDimensions();
  const [phase, setPhase] = useState<Phase>(from ? 'from' : 'open');
  const [showContent, setShowContent] = useState(!from);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const index = DECK.findIndex((c) => c.id === id);
  const card = DECK[index]!;
  const prev = DECK[(index - 1 + DECK.length) % DECK.length]!;
  const next = DECK[(index + 1) % DECK.length]!;

  // Modal size: roomy on desktop, nearly full on phones.
  const isMobile = vw < 640;
  const mw = isMobile ? vw - 20 : Math.min(vw - 96, 1080);
  const mh = isMobile ? vh - 40 : Math.min(vh - 80, 860);
  const target = { left: (vw - mw) / 2, top: (vh - mh) / 2, width: mw, height: mh };

  useEffect(() => {
    if (!from) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPhase('open'));
    });
    const t = setTimeout(() => setShowContent(true), DURATION * 0.75);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [id]);

  const close = () => {
    if (phase === 'closing') return;
    setShowContent(false);
    setPhase('closing');
    setTimeout(onClose, from ? DURATION : 220);
  };

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      // Certificate/project dialogs inside handle their own keys.
      if (document.querySelectorAll('[aria-modal="true"]').length > 1) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') onSwitch(next.id);
      if (e.key === 'ArrowLeft') onSwitch(prev.id);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  });

  const atCard = phase !== 'open' && from;
  const frame: ViewStyle = atCard
    ? { ...from, borderRadius: 20, transform: [{ rotate: `${from.angle}deg` }] }
    : { ...target, borderRadius: isMobile ? 22 : 30, transform: [{ rotate: '0deg' }] };
  // 'angle' is not a style key
  delete (frame as Record<string, unknown>).angle;

  const Content = card.Content;
  const backdropVisible = phase === 'open';

  return (
    <>
      <Pressable
        accessibilityLabel="Close"
        onPress={close}
        style={[styles.backdrop, { opacity: backdropVisible ? 1 : 0 }]}
      />
      <View
        role="dialog"
        aria-modal
        aria-label={card.title}
        style={[styles.frame, frame, { backgroundColor: showContent ? colors.ivory : card.bg }, !from && popIn]}
      >
        {!showContent && from ? (
          <View style={[StyleSheet.absoluteFill, styles.fade, { opacity: phase === 'open' ? 0 : 1 }]}>
            <View style={{ width: from.width, height: from.height, alignSelf: 'center', top: '50%', marginTop: -from.height / 2 }}>
              <card.Face w={from.width} />
            </View>
          </View>
        ) : null}

        {showContent ? (
          <View style={[styles.inner, contentIn]}>
            <View style={styles.bar}>
              <View style={styles.barLeft}>
                <BarButton label={`Previous: ${prev.title}`} onPress={() => onSwitch(prev.id)}>
                  <ChevronLeft size={20} color={colors.plum} strokeWidth={1.8} />
                </BarButton>
                <BarButton label={`Next: ${next.title}`} onPress={() => onSwitch(next.id)}>
                  <ChevronRight size={20} color={colors.plum} strokeWidth={1.8} />
                </BarButton>
              </View>
              <View style={styles.barCenter}>
                <Text style={styles.barIndex}>
                  {String(index + 1).padStart(2, '0')} / {String(DECK.length).padStart(2, '0')}
                </Text>
                <Text style={styles.barTitle} numberOfLines={1}>
                  {card.title}
                </Text>
              </View>
              <View style={[styles.barLeft, { justifyContent: 'flex-end' }]}>
                <BarButton label="Close" onPress={close}>
                  <X size={20} color={colors.plum} strokeWidth={1.8} />
                </BarButton>
              </View>
            </View>

            <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
              <CompactSection.Provider value={true}>
                <Content key={id} />
              </CompactSection.Provider>
            </ScrollView>
          </View>
        ) : null}
      </View>
    </>
  );
}

function BarButton({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={(s) => {
        const { hovered, focused } = s as WebState;
        return [styles.barBtn, hovered && styles.barBtnHover, focused && styles.barBtnFocus];
      }}
    >
      {children}
    </Pressable>
  );
}

const contentIn = {
  animationKeyframes: [
    { from: { opacity: 0, transform: [{ translateY: 14 }] }, to: { opacity: 1, transform: [{ translateY: 0 }] } },
  ],
  animationDuration: '380ms',
  animationFillMode: 'both',
  animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
} as object as ViewStyle;

const popIn = {
  animationKeyframes: [
    { from: { opacity: 0, transform: [{ scale: 0.94 }] }, to: { opacity: 1, transform: [{ scale: 1 }] } },
  ],
  animationDuration: '320ms',
  animationFillMode: 'both',
} as object as ViewStyle;

const styles = StyleSheet.create({
  backdrop: {
    position: 'fixed' as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
    backgroundColor: 'rgba(64, 51, 58, 0.55)',
    backdropFilter: 'blur(3px)',
    transitionProperty: 'opacity',
    transitionDuration: `${DURATION}ms`,
    cursor: 'default',
  },
  frame: {
    position: 'fixed' as 'absolute',
    zIndex: 100,
    overflow: 'hidden',
    transitionProperty: 'left, top, width, height, border-radius, transform, background-color',
    transitionDuration: `${DURATION}ms`,
    transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.25, 1)',
    shadowColor: '#2A1F25',
    shadowOpacity: 0.35,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 24 },
  },
  fade: { transitionProperty: 'opacity', transitionDuration: '300ms' },
  inner: { flex: 1 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.cream,
  },
  barLeft: { flexDirection: 'row', gap: 8, width: 96 },
  barCenter: { flex: 1, alignItems: 'center' },
  barIndex: { ...sans('700'), fontSize: 11, letterSpacing: 1.6, color: colors.mauveDeep },
  barTitle: { ...serif('500'), fontSize: 22, color: colors.plum },
  barBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, transform',
    transitionDuration: '160ms',
  },
  barBtnHover: { backgroundColor: colors.white, borderColor: colors.mauve, transform: [{ translateY: -1 }] },
  barBtnFocus: { borderColor: colors.mauve, backgroundColor: colors.white },
});
