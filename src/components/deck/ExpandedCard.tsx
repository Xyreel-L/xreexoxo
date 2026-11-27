import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, PressableStateCallbackType, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ArrowLeft, ChevronLeft, ChevronRight } from '@/components/ui/icons';
import { colors, sans, serif, shadow } from '@/theme/tokens';
import { DECK } from './cards';
import type { CardRect } from './DeckHero';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };
type Phase = 'from' | 'open' | 'closing';

const DURATION = 560;

/**
 * Full-screen view of one deck card. It grows out of the card's position in the
 * fan (keeping its tilt), then the chapter content fades in. Closing reverses it.
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
  const [phase, setPhase] = useState<Phase>(from ? 'from' : 'open');
  const [showContent, setShowContent] = useState(!from);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  const index = DECK.findIndex((c) => c.id === id);
  const card = DECK[index]!;
  const prev = DECK[(index - 1 + DECK.length) % DECK.length]!;
  const next = DECK[(index + 1) % DECK.length]!;

  // Grow from the card on mount.
  useEffect(() => {
    if (!from) return;
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setPhase('open'));
    });
    const t = setTimeout(() => setShowContent(true), DURATION * 0.7);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switching chapters: jump back to the top.
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [id]);

  const close = () => {
    if (!from) return onClose();
    setShowContent(false);
    setPhase('closing');
    setTimeout(onClose, DURATION);
  };

  // Escape closes, arrow keys switch chapter; lock page scroll while open.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      // Let open dialogs (certificate/project modals) handle their own keys.
      if (document.querySelector('[aria-modal="true"]')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') onSwitch(next.id);
      if (e.key === 'ArrowLeft') onSwitch(prev.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const atCard = phase !== 'open' && from;
  const frame: ViewStyle = atCard
    ? {
        left: from.left,
        top: from.top,
        width: from.width,
        height: from.height,
        borderRadius: 18,
        transform: [{ rotate: `${from.angle}deg` }],
      }
    : ({ left: 0, top: 0, width: '100vw', height: '100vh', borderRadius: 0, transform: [{ rotate: '0deg' }] } as object as ViewStyle);

  const Content = card.Content;

  return (
    <View
      role="dialog"
      aria-label={card.title}
      style={[styles.frame, frame, { backgroundColor: showContent ? colors.cream : card.bg }]}
    >
      {/* Card face while it is flying */}
      {!showContent && from ? (
        <View style={[StyleSheet.absoluteFill, { opacity: phase === 'open' ? 0 : 1 }, styles.fade]}>
          <View style={{ width: from.width, height: from.height, alignSelf: 'center', top: '50%', marginTop: -from.height / 2 }}>
            <card.Face w={from.width} />
          </View>
        </View>
      ) : null}

      {showContent ? (
        <View style={[styles.inner, contentIn]}>
          <View style={styles.bar}>
            <BarButton label="Back to cards" onPress={close} wide>
              <ArrowLeft size={20} color={colors.plum} strokeWidth={1.8} />
            </BarButton>
            <View style={styles.barCenter}>
              <Text style={styles.barIndex}>
                {String(index + 1).padStart(2, '0')} / {String(DECK.length).padStart(2, '0')}
              </Text>
              <Text style={styles.barTitle} numberOfLines={1}>
                {card.title}
              </Text>
            </View>
            <View style={styles.barRight}>
              <BarButton label={`Previous: ${prev.title}`} onPress={() => onSwitch(prev.id)}>
                <ChevronLeft size={20} color={colors.plum} strokeWidth={1.8} />
              </BarButton>
              <BarButton label={`Next: ${next.title}`} onPress={() => onSwitch(next.id)}>
                <ChevronRight size={20} color={colors.plum} strokeWidth={1.8} />
              </BarButton>
            </View>
          </View>

          <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <Content key={id} />
            <Pressable onPress={() => onSwitch(next.id)} style={styles.nextChapter} role="button">
              {(s) => {
                const { hovered } = s as WebState;
                return (
                  <>
                    <Text style={styles.nextLabel}>NEXT CARD</Text>
                    <Text style={[styles.nextTitle, hovered && { color: colors.mauve }]}>{next.title} →</Text>
                  </>
                );
              }}
            </Pressable>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

function BarButton({
  label,
  onPress,
  children,
  wide,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={(s) => {
        const { hovered, focused } = s as WebState;
        return [
          styles.barBtn,
          wide && { width: 56, height: 56, borderRadius: 16 },
          hovered && styles.barBtnHover,
          focused && styles.focused,
        ];
      }}
    >
      {children}
    </Pressable>
  );
}

const contentIn = {
  animationKeyframes: [{ from: { opacity: 0, transform: [{ translateY: 16 }] }, to: { opacity: 1, transform: [{ translateY: 0 }] } }],
  animationDuration: '420ms',
  animationFillMode: 'both',
  animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
} as object as ViewStyle;

const styles = StyleSheet.create({
  frame: {
    position: 'fixed' as 'absolute',
    zIndex: 100,
    overflow: 'hidden',
    transitionProperty: 'left, top, width, height, border-radius, transform, background-color',
    transitionDuration: `${DURATION}ms`,
    transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.25, 1)',
    ...shadow.lifted,
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
    backgroundColor: 'rgba(247, 237, 227, 0.96)',
  },
  barCenter: { flex: 1, alignItems: 'center' },
  barIndex: { ...sans('700'), fontSize: 11, letterSpacing: 1.6, color: colors.mauveDeep },
  barTitle: { ...serif('500'), fontSize: 22, color: colors.plum },
  barRight: { flexDirection: 'row', gap: 8 },
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
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep, outlineOffset: 2 } as object,
  nextChapter: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 56,
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    cursor: 'pointer',
  },
  nextLabel: { ...sans('700'), fontSize: 11.5, letterSpacing: 2, color: colors.mauveDeep },
  nextTitle: {
    ...serif('500'),
    fontSize: 36,
    color: colors.plum,
    transitionProperty: 'color',
    transitionDuration: '160ms',
  },
});
