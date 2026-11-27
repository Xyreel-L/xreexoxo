import { useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useViewport } from '@/hooks/useViewport';
import Svg, { Text as SvgText } from 'react-native-svg';
import { colors, sans, serif, shadow } from '@/theme/tokens';
import { profile } from '@/data/profile';
import { initials } from '@/utils/text';
import { AnimatedName } from './AnimatedName';
import { CENTER_ID, DECK, type DeckCard } from './cards';

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

const SPEED = 7; // degrees per second around the orbit

export function DeckHero({ onOpen, paused }: { onOpen: (id: string, from?: CardRect) => void; paused: boolean }) {
  const { width: vw, height: vh } = useViewport();
  const W = Math.min(vw, 1400);
  const isMobile = vw < 640;

  const name = profile.fullName.toUpperCase();
  const parts = name.split(' ');
  const lines = isMobile ? [parts.slice(0, -1).join(' '), parts.slice(-1)[0] ?? ''] : [name];
  const titleSize = isMobile ? clamp(W * 0.17, 44, 100) : clamp(Math.min(W * 0.085, vh * 0.14), 60, 140);
  const side = isMobile ? 20 : 48;

  // ---- orbit geometry
  const cardW = isMobile ? clamp(W * 0.22, 84, 120) : clamp(Math.min(W * 0.14, vh * 0.23), 130, 215);
  const cardH = cardW * 1.4;
  const Rx = isMobile ? W * 0.36 : Math.min(W * 0.34, 500);
  const Ry = Rx * (isMobile ? 0.5 : 0.27);
  const hubR = isMobile ? 48 : 82;
  const hubY = Ry + cardH * 0.4 + 30;
  const orbitH = hubY + Ry + cardH * 0.56 + 40;
  const n = DECK.length;
  const startIndex = DECK.findIndex((c) => c.id === CENTER_ID);

  const refs = useRef<Record<string, HTMLElement | null>>({});
  const hovered = useRef<string | null>(null);
  const base = useRef(90); // degrees; 90° = front-centre
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  /** Position of card i for a given base angle. */
  const place = (i: number, baseDeg: number, lift = false) => {
    const theta = ((baseDeg + (i - startIndex) * (360 / n)) * Math.PI) / 180;
    const x = Rx * Math.cos(theta);
    const y = Ry * Math.sin(theta);
    const depth = (Math.sin(theta) + 1) / 2; // 0 back … 1 front
    const scale = (0.68 + 0.36 * depth) * (lift ? 1.08 : 1);
    const rot = lift ? 0 : -Math.cos(theta) * 9;
    return {
      x,
      y: y - (lift ? 18 : 0),
      scale,
      rot,
      z: lift ? 200 : Math.round(depth * 100),
      shade: 0.55 + 0.45 * depth,
    };
  };

  // Animation loop: writes transforms straight to the DOM (no React re-render per frame).
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let last = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (!reduce && !pausedRef.current && !hovered.current) base.current = (base.current + SPEED * dt) % 360;
      DECK.forEach((c, i) => {
        const el = refs.current[c.id];
        if (!el) return;
        const p = place(i, base.current, hovered.current === c.id);
        el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${p.scale}) rotate(${p.rot}deg)`;
        el.style.zIndex = String(p.z);
        el.style.filter = `brightness(${0.85 + 0.15 * p.shade})`;
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Rx, Ry, n]);

  const open = (card: DeckCard, i: number) => {
    const el = refs.current[card.id];
    const p = place(i, base.current, true);
    if (el && typeof el.getBoundingClientRect === 'function') {
      const b = el.getBoundingClientRect();
      const w = cardW * p.scale;
      const h = cardH * p.scale;
      onOpen(card.id, { left: b.left + b.width / 2 - w / 2, top: b.top + b.height / 2 - h / 2, width: w, height: h, angle: 0 });
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
          <View
            style={[
              styles.block,
              blockAnim,
              { width: clamp(W * 0.13, 60, 170), height: titleSize * (lines.length * 1.04 + 0.95), top: -titleSize * 0.3 },
            ]}
          />
          <View style={[styles.echo, echoAnim]} aria-hidden>
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

      {/* ---------- Orbit ---------- */}
      <View style={[styles.orbit, { height: orbitH }]}>
        <View
          aria-hidden
          style={[
            styles.path,
            { width: Rx * 2, height: Ry * 2, borderRadius: Rx, left: '50%', marginLeft: -Rx, top: hubY - Ry },
          ]}
        />

        <Pressable
          onPress={() => onOpen(CENTER_ID)}
          accessibilityLabel="Open About Me"
          role="button"
          style={[styles.hub, { width: hubR * 2, height: hubR * 2, marginLeft: -hubR, top: hubY - hubR }]}
        >
          <View style={[styles.hubRing, { borderRadius: hubR }]} />
          <View style={[StyleSheet.absoluteFill, spinAnim]}>
            <RingText radius={hubR - 14} small={isMobile} />
          </View>
          <Text style={styles.meArrow}>▲</Text>
          <Text style={[styles.meText, isMobile && { fontSize: 15 }]}>ME</Text>
        </Pressable>

        {DECK.map((card, i) => {
          const p = place(i, 90);
          const initial: ViewStyle = {
            width: cardW,
            height: cardH,
            left: '50%',
            marginLeft: -cardW / 2,
            top: hubY - cardH / 2,
            zIndex: p.z,
            transform: [{ translateX: p.x }, { translateY: p.y }, { scale: p.scale }, { rotate: `${p.rot}deg` }],
          };
          return (
            <Pressable
              key={card.id}
              ref={(el) => {
                refs.current[card.id] = el as unknown as HTMLElement | null;
              }}
              role="button"
              accessibilityLabel={`Open ${card.title}`}
              onHoverIn={() => (hovered.current = card.id)}
              onHoverOut={() => (hovered.current = null)}
              onFocus={() => (hovered.current = card.id)}
              onBlur={() => (hovered.current = null)}
              onPress={() => open(card, i)}
              style={[styles.slot, initial]}
            >
              <View style={[styles.card, { backgroundColor: card.bg }, dealIn(i)]}>
                <card.Face w={cardW} />
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>{isMobile ? 'Tap a card to open it' : 'Hover to pause · click a card to open it'}</Text>
    </View>
  );
}

function RingText({ radius, small }: { radius: number; small?: boolean }) {
  const chars = [...'PORTFOLIO · PORTFOLIO · '];
  const stepDeg = 360 / chars.length;
  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      {chars.map((ch, i) => (
        <Text
          key={i}
          style={[
            styles.ringChar,
            small && { fontSize: 9 },
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

const blockAnim = {
  animationKeyframes: [{ from: { transform: [{ scaleY: 0 }] }, to: { transform: [{ scaleY: 1 }] } }],
  animationDuration: '900ms',
  animationTimingFunction: 'cubic-bezier(0.7, 0, 0.2, 1)',
  animationFillMode: 'both',
} as object as ViewStyle;

const echoAnim = {
  animationKeyframes: [
    {
      '0%': { transform: [{ translateX: -16 }, { skewX: '-7deg' }] },
      '50%': { transform: [{ translateX: 16 }, { skewX: '7deg' }] },
      '100%': { transform: [{ translateX: -16 }, { skewX: '-7deg' }] },
    },
  ],
  animationDuration: '6s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
} as object as ViewStyle;

const spinAnim = {
  animationKeyframes: [{ from: { transform: [{ rotate: '0deg' }] }, to: { transform: [{ rotate: '360deg' }] } }],
  animationDuration: '18s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
} as object as ViewStyle;

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.cream, overflow: 'hidden', flexGrow: 1 },
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
  block: { position: 'absolute', backgroundColor: colors.rose, alignSelf: 'center', transformOrigin: 'top' } as object,
  echo: { position: 'absolute', alignSelf: 'center', top: 0 },
  nameWrap: { position: 'absolute', left: 0, right: 0 },
  tri: { position: 'absolute', fontSize: 16, color: colors.plum },
  orbit: { width: '100%' },
  path: { position: 'absolute', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.lineStrong, opacity: 0.8 },
  hub: { position: 'absolute', left: '50%', alignItems: 'center', justifyContent: 'center', zIndex: 50, cursor: 'pointer' },
  hubRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.mauve,
    backgroundColor: 'rgba(255, 249, 244, 0.85)',
  } as object,
  ringChar: { ...sans('700'), position: 'absolute', fontSize: 11, color: colors.plumSoft },
  meArrow: { fontSize: 11, color: colors.plum },
  meText: { ...sans('700'), fontSize: 19, letterSpacing: 2, color: colors.plum },
  slot: { position: 'absolute', cursor: 'pointer', transformOrigin: 'center' } as object,
  card: {
    ...StyleSheet.absoluteFill,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(64,51,58,0.08)',
    ...shadow.lifted,
  } as object,
  hint: { ...sans('600'), fontSize: 13, letterSpacing: 1.2, color: colors.plumSoft, textAlign: 'center', paddingVertical: 24 },
});
