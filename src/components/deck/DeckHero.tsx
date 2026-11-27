import { useEffect, useRef } from 'react';
import { Platform, Pressable, PressableStateCallbackType, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useViewport } from '@/hooks/useViewport';
import Svg, { Text as SvgText } from 'react-native-svg';
import { colors, sans, serif, shadow } from '@/theme/tokens';
import { profile } from '@/data/profile';
import { initials } from '@/utils/text';
import { AnimatedName } from './AnimatedName';
import { CENTER_ID, DECK, type DeckCard } from './cards';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };

export type CardRect = { left: number; top: number; width: number; height: number; angle: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Deterministic star/plus field: varied sizes, spread over the whole hero. */
const MARKS = (() => {
  let seed = 7;
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: 42 }, (_, i) => {
    const star = i % 3 !== 0;
    return {
      x: 2 + rand() * 96,
      y: 2 + rand() * 94,
      star,
      size: star ? 7 + Math.round(rand() * 26) : 14 + Math.round(rand() * 18),
      delay: Math.round(rand() * 3000),
      dur: 2400 + Math.round(rand() * 2600),
    };
  });
})();

const SPEED = 9; // degrees per second the wheel turns
const RING_SPEED = 24; // degrees per second for the PORTFOLIO text in the hub

export function DeckHero({ onOpen, paused }: { onOpen: (id: string, from?: CardRect) => void; paused: boolean }) {
  const { width: vw, height: vh } = useViewport();
  const W = Math.min(vw, 1400);
  const isMobile = vw < 640;

  const name = profile.fullName.toUpperCase();
  const parts = name.split(' ');
  const lines = isMobile ? [parts.slice(0, -1).join(' '), parts.slice(-1)[0] ?? ''] : [name];
  const titleSize = isMobile ? clamp(W * 0.17, 44, 100) : clamp(Math.min(W * 0.085, vh * 0.14), 60, 140);
  const side = isMobile ? 20 : 48;

  // ---- wheel geometry: cards sit on a circle tilted outward, and the whole
  // wheel spins flat around the hub like a loading spinner.
  const cardW = isMobile ? clamp(Math.min(W * 0.34, vh * 0.2), 100, 160) : clamp(Math.min(W * 0.17, vh * 0.27), 160, 250);
  const cardH = cardW * 1.4;
  const STEP = 36; // degrees between neighbouring cards (10 cards around the ring)
  const COPIES = Math.round(360 / STEP / DECK.length); // repeat the deck all the way round
  const spacing = cardW * (isMobile ? 0.8 : 0.92);
  const R = spacing / (2 * Math.sin(((STEP / 2) * Math.PI) / 180));
  // Big hub filling the inside of the card ring; only its top half shows, as the footer.
  const hubR = Math.max(40, R - cardH / 2 - (isMobile ? 18 : 30)); // fixed gap between hub and cards
  const topPad = isMobile ? 40 : 70;
  const pivotY = topPad + cardH / 2 + R; // hub centre, from the top of the wheel area
  const wheelH = pivotY; // clip at the hub's centre so it reads as a half circle
  const startIndex = DECK.findIndex((c) => c.id === CENTER_ID);
  const slots = Array.from({ length: DECK.length * COPIES }, (_, j) => ({
    j,
    card: DECK[j % DECK.length]!,
    angle: (j - startIndex) * STEP,
    primary: j < DECK.length,
  }));

  const wheelRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Record<number, HTMLElement | null>>({});
  const hovered = useRef(false);
  const spin = useRef(0);
  const ringRef = useRef<HTMLElement | null>(null);
  const ringSpin = useRef(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // One transform per frame on the wheel element; React does not re-render.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min(100, now - last) / 1000;
      last = now;
      if (!reduce && !pausedRef.current && !hovered.current) spin.current = (spin.current - SPEED * dt) % 360;
      if (wheelRef.current) wheelRef.current.style.transform = `rotate(${spin.current}deg)`;
      // The PORTFOLIO text inside the hub always turns, the other way round.
      if (!reduce) ringSpin.current = (ringSpin.current + RING_SPEED * dt) % 360;
      if (ringRef.current) ringRef.current.style.transform = `rotate(${ringSpin.current}deg)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const open = (card: DeckCard, j: number, angle: number) => {
    const el = cardRefs.current[j];
    const tilt = ((((angle + spin.current) % 360) + 540) % 360) - 180;
    if (el && typeof el.getBoundingClientRect === 'function') {
      const b = el.getBoundingClientRect();
      onOpen(card.id, {
        left: b.left + b.width / 2 - cardW / 2,
        top: b.top + b.height / 2 - cardH / 2,
        width: cardW,
        height: cardH,
        angle: tilt,
      });
    } else {
      onOpen(card.id);
    }
  };

  const echoWidth = Math.min(W - side * 2, titleSize * (isMobile ? 5.2 : 9.8));

  return (
    <View style={styles.wrap} nativeID="home">
      {/* star + plus field */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
        {MARKS.filter((_, i) => !isMobile || i % 2 === 0).map((m, i) => (
          <Text
            key={i}
            style={[
              m.star ? styles.star : styles.plus,
              {
                left: `${m.x}%`,
                top: `${m.y}%`,
                fontSize: m.size * (isMobile ? 0.75 : 1),
                lineHeight: m.size,
                color: m.star ? (i % 2 ? colors.mauve : colors.rose) : colors.rose,
              },
              twinkle(m.delay, m.dur, m.star),
            ]}
          >
            {m.star ? '✦' : '+'}
          </Text>
        ))}
      </View>

      {/* ---------- Title ---------- */}
      <View style={[styles.titleBlock, { paddingHorizontal: side, paddingTop: isMobile ? 24 : 40 }]}>
        <View style={styles.topRow}>
          <Text style={[styles.welcome, { fontSize: isMobile ? 13 : 18, lineHeight: isMobile ? 18 : 24 }]}>
            WELCOME TO{'\n'}MY PORTFOLIO
          </Text>
          <View style={styles.monogram}>
            <Text style={styles.monogramText}>{initials(profile.fullName)}</Text>
          </View>
        </View>

        <View style={[styles.titleStage, { height: titleSize * lines.length * 1.04 + titleSize * 0.55 }]}>
          <View style={styles.echo} aria-hidden>
            <Svg width={echoWidth} height={titleSize * lines.length * 1.04 + 10}>
              {lines.map((line, i) => (
                <SvgText
                  key={i}
                  x="50%"
                  y={titleSize * (0.84 + i * 1.04)}
                  textAnchor="middle"
                  fontSize={titleSize}
                  fontFamily="Fraunces, Georgia, serif"
                  fontWeight="600"
                  fill="none"
                  stroke={colors.mauve}
                  strokeWidth={1.2}
                  letterSpacing={1}
                >
                  {line}
                </SvgText>
              ))}
            </Svg>
          </View>
          <View style={[styles.nameWrap, { top: titleSize * 0.3 }]}>
            <AnimatedName lines={lines} size={titleSize} />
          </View>
          {!isMobile ? (
            <>
              <Text style={[styles.tri, { left: 0, top: titleSize * 0.65 }]}>▶</Text>
              <Text style={[styles.tri, { right: 0, top: titleSize * 0.65 }]}>◀</Text>
            </>
          ) : null}
        </View>
      </View>

      {/* ---------- Wheel + footer (centred in the space left under the name) ---------- */}
      <View style={styles.lower}>
      <View style={[styles.wheelArea, { height: wheelH }]}>
        <View
          ref={(el) => {
            wheelRef.current = el as unknown as HTMLElement | null;
          }}
          style={[styles.wheel, { top: pivotY }]}
        >
          {slots.map(({ j, card, angle, primary }) => (
            <Pressable
              key={j}
              ref={(el) => {
                cardRefs.current[j] = el as unknown as HTMLElement | null;
              }}
              role="button"
              accessibilityLabel={`Open ${card.title}`}
              aria-hidden={!primary}
              tabIndex={primary ? 0 : -1}
              onHoverIn={() => (hovered.current = true)}
              onHoverOut={() => (hovered.current = false)}
              onFocus={() => (hovered.current = true)}
              onBlur={() => (hovered.current = false)}
              onPress={() => open(card, j, angle)}
              style={(s) => {
                const { hovered: h, focused, pressed } = s as WebState;
                const lift = h || focused;
                const slot: ViewStyle = {
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  zIndex: lift ? 50 : 1,
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateY: -R - (lift ? 30 : 0) },
                    { scale: pressed ? 0.97 : lift ? 1.06 : 1 },
                  ],
                };
                return [styles.slot, slot];
              }}
            >
              <View style={[styles.card, { backgroundColor: card.bg }, primary ? dealIn(j) : null]}>
                <card.Face w={cardW} />
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => onOpen(CENTER_ID)}
          accessibilityLabel="Open About Me"
          role="button"
          style={[styles.hub, { width: hubR * 2, height: hubR * 2, marginLeft: -hubR, top: pivotY - hubR }]}
        >
          <View style={[styles.hubRing, { borderRadius: hubR }]} />
          <View
            ref={(el) => {
              ringRef.current = el as unknown as HTMLElement | null;
            }}
            style={StyleSheet.absoluteFill}
          >
            <RingText radius={hubR - (isMobile ? 16 : 24)} small={isMobile} />
          </View>
          <View style={[styles.meWrap, { top: hubR * 0.42 }]}>
            <Text style={styles.meArrow}>▲</Text>
            <Text style={[styles.meText, isMobile && { fontSize: 20 }]}>ME</Text>
          </View>
        </Pressable>
      </View>

      <Text style={[styles.hint, isMobile && { paddingVertical: 14 }]}>xreexoxo {new Date().getFullYear()}</Text>
      </View>
    </View>
  );
}

function RingText({ radius, small }: { radius: number; small?: boolean }) {
  const chars = [...'PORTFOLIO · '.repeat(Math.max(2, Math.round(radius / 45)))];
  const stepDeg = 360 / chars.length;
  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      {chars.map((ch, i) => (
        <Text
          key={i}
          style={[
            styles.ringChar,
            small && { fontSize: 12 },
            { transform: [{ rotate: `${i * stepDeg}deg` }, { translateY: -radius }] },
          ]}
        >
          {ch}
        </Text>
      ))}
    </View>
  );
}

const twinkle = (delay: number, dur: number, star: boolean) =>
  ({
    animationKeyframes: [
      star
        ? {
            '0%': { opacity: 0.25, transform: [{ scale: 0.7 }, { rotate: '0deg' }] },
            '50%': { opacity: 1, transform: [{ scale: 1.15 }, { rotate: '25deg' }] },
            '100%': { opacity: 0.25, transform: [{ scale: 0.7 }, { rotate: '0deg' }] },
          }
        : {
            '0%': { opacity: 0.45, transform: [{ rotate: '0deg' }] },
            '50%': { opacity: 1, transform: [{ rotate: '90deg' }] },
            '100%': { opacity: 0.45, transform: [{ rotate: '0deg' }] },
          },
    ],
    animationDuration: `${dur}ms`,
    animationDelay: `${delay}ms`,
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  }) as object as ViewStyle;

const dealIn = (i: number) =>
  ({
    animationKeyframes: [
      {
        from: { opacity: 0, transform: [{ translateY: 120 }, { scale: 0.6 }] },
        to: { opacity: 1, transform: [{ translateY: 0 }, { scale: 1 }] },
      },
    ],
    animationDuration: '800ms',
    animationDelay: `${400 + i * 120}ms`,
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
    animationFillMode: 'backwards',
  }) as object as ViewStyle;

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.cream, overflow: 'hidden', flexGrow: 1 },
  lower: { flexGrow: 1, justifyContent: 'flex-end' },
  plus: { position: 'absolute', ...sans('500') },
  star: { position: 'absolute' },
  titleBlock: { width: '100%', maxWidth: 1400, alignSelf: 'center' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 3 },
  welcome: { ...sans('700'), color: colors.plum, letterSpacing: 1.8 },
  monogram: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: { ...serif('600'), fontSize: 16, color: colors.plum },
  titleStage: { alignItems: 'center', marginTop: 12 },
  echo: { position: 'absolute', alignSelf: 'center', top: 0 },
  nameWrap: { position: 'absolute', left: 0, right: 0 },
  tri: { position: 'absolute', fontSize: 16, color: colors.plum },
  wheelArea: { width: '100%', overflow: 'hidden' },
  wheel: { position: 'absolute', left: '50%', width: 0, height: 0 },
  hub: { position: 'absolute', left: '50%', alignItems: 'center', justifyContent: 'center', zIndex: 50, cursor: 'pointer' },
  hubRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.mauve,
    backgroundColor: 'rgba(255, 249, 244, 0.85)',
  } as object,
  ringChar: { ...sans('700'), position: 'absolute', fontSize: 17, color: colors.plumSoft },
  meWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  meArrow: { fontSize: 12, color: colors.plum },
  meText: { ...sans('700'), fontSize: 30, letterSpacing: 3, color: colors.plum },
  slot: {
    position: 'absolute',
    left: 0,
    top: 0,
    cursor: 'pointer',
    transitionProperty: 'transform',
    transitionDuration: '320ms',
    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
  } as object,
  card: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(64,51,58,0.08)',
    // soft drop shadow that travels with each card as the wheel turns
    shadowColor: '#5A3A47',
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
  } as object,
  hint: { ...sans('600'), fontSize: 13, letterSpacing: 1.2, color: colors.plumSoft, textAlign: 'center', paddingVertical: 24 },
});
