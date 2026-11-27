import { useRef } from 'react';
import { Pressable, PressableStateCallbackType, StyleSheet, Text, View, ViewStyle, useWindowDimensions } from 'react-native';
import Svg, { Text as SvgText } from 'react-native-svg';
import { colors, sans, serif, shadow } from '@/theme/tokens';
import { profile } from '@/data/profile';
import { initials } from '@/utils/text';
import { CENTER_ID, DECK, type DeckCard } from './cards';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };

export type CardRect = { left: number; top: number; width: number; height: number; angle: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Decorative marks: [x%, y%, kind, size, delay(ms)] — 'p' = plus, 's' = star. */
const MARKS: [number, number, 'p' | 's', number, number][] = [
  [4, 6, 'p', 30, 0],
  [30, 4, 's', 22, 400],
  [52, 9, 'p', 22, 900],
  [74, 5, 'p', 30, 200],
  [94, 14, 's', 26, 1300],
  [2, 38, 's', 20, 700],
  [97, 40, 'p', 26, 1100],
  [12, 58, 'p', 22, 1500],
  [88, 60, 's', 22, 300],
  [6, 82, 's', 26, 1000],
  [22, 92, 'p', 20, 600],
  [80, 90, 'p', 26, 1700],
  [95, 78, 's', 18, 500],
  [42, 70, 's', 14, 1200],
  [60, 64, 'p', 16, 800],
];

export function DeckHero({ onOpen }: { onOpen: (id: string, from?: CardRect) => void }) {
  const { width: vw, height: vh } = useWindowDimensions();
  const W = Math.min(vw, 1400);
  const isMobile = vw < 640;

  const nameParts = profile.fullName.toUpperCase().split(' ');
  const first = nameParts.slice(0, -1).join(' ');
  const last = nameParts.slice(-1)[0] ?? '';

  // Name: one line on desktop, two lines on phones.
  const titleSize = isMobile ? clamp(W * 0.2, 48, 110) : clamp(Math.min(W * 0.085, vh * 0.15), 64, 150);
  const side = isMobile ? 20 : 48;

  // Fan geometry — sized from both width and height so it fills the screen.
  const cardW = isMobile ? clamp(W * 0.23, 90, 140) : clamp(Math.min(W * 0.15, vh * 0.25), 140, 230);
  const cardH = cardW * 1.4;
  const step = isMobile ? 18 : 18; // degrees between neighbouring cards
  // Radius chosen so neighbours overlap only slightly (keeps card text uncovered).
  const spacing = cardW * (isMobile ? 0.8 : 0.92);
  const R = spacing / (2 * Math.sin((step / 2) * (Math.PI / 180)));
  const centerIndex = DECK.findIndex((c) => c.id === CENTER_ID);
  const fanHeight = R + cardH * 0.62 + 70;
  const ringR = R * 0.55;

  const refs = useRef<Record<string, unknown>>({});

  const open = (card: DeckCard, angle: number) => {
    const el = refs.current[card.id] as HTMLElement | undefined;
    if (el && typeof el.getBoundingClientRect === 'function') {
      const b = el.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const cy = b.top + b.height / 2;
      onOpen(card.id, { left: cx - cardW / 2, top: cy - cardH / 2, width: cardW, height: cardH, angle });
    } else {
      onOpen(card.id);
    }
  };

  const echoWidth = Math.min(W - side * 2, titleSize * (isMobile ? 5 : 9.5));

  return (
    <View style={styles.wrap} nativeID="home">
      {/* plus + star field */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none" aria-hidden>
        {MARKS.filter((_, i) => !isMobile || i % 2 === 0).map(([x, y, kind, size, delay], i) => (
          <Text
            key={i}
            style={[
              kind === 'p' ? styles.plus : styles.star,
              { left: `${x}%`, top: `${y}%`, fontSize: size * (isMobile ? 0.8 : 1), lineHeight: size },
              twinkle(delay, kind === 's'),
            ]}
          >
            {kind === 'p' ? '+' : '✦'}
          </Text>
        ))}
      </View>

      {/* ---------- Title block ---------- */}
      <View style={[styles.titleBlock, { paddingHorizontal: side, paddingTop: isMobile ? 28 : 44 }]}>
        <View style={styles.topRow}>
          <Text style={[styles.welcome, { fontSize: isMobile ? 13 : 18, lineHeight: isMobile ? 18 : 24 }]}>
            WELCOME TO{'\n'}MY PORTFOLIO
          </Text>
          <View style={styles.monogram}>
            <Text style={styles.monogramText}>{initials(profile.fullName)}</Text>
          </View>
        </View>

        <View style={[styles.titleStage, { height: titleSize * (isMobile ? 2.6 : 1.7) }]}>
          <View
            style={[
              styles.block,
              blockAnim,
              {
                width: clamp(W * 0.13, 64, 180),
                height: titleSize * (isMobile ? 2.9 : 2.1),
                top: -titleSize * 0.4,
              },
            ]}
          />
          {/* outlined echo, drifting */}
          <View style={[styles.echo, echoAnim, { top: titleSize * 0.02 }]} aria-hidden>
            <Svg width={echoWidth} height={titleSize * (isMobile ? 2.2 : 1.15)}>
              {(isMobile ? [first, last] : [`${first} ${last}`]).map((line, i) => (
                <SvgText
                  key={i}
                  x="50%"
                  y={titleSize * (0.9 + i * 1.02)}
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
          <Text
            role="heading"
            aria-level={1}
            style={[
              styles.title,
              titleAnim,
              { fontSize: titleSize, lineHeight: titleSize * 1.02, top: titleSize * 0.36 },
            ]}
          >
            {isMobile ? `${first}\n${last}` : `${first} ${last}`}
          </Text>
          {!isMobile ? (
            <>
              <Text style={[styles.tri, { left: 0, top: titleSize * 0.72 }]}>▶</Text>
              <Text style={[styles.tri, { right: 0, top: titleSize * 0.72 }]}>◀</Text>
            </>
          ) : null}
        </View>
      </View>

      {/* ---------- Fan ---------- */}
      <View style={[styles.fan, { height: fanHeight }]}>
        <View
          style={[
            styles.ringWrap,
            { width: ringR * 2, height: ringR * 2, left: '50%', marginLeft: -ringR, top: fanHeight - ringR },
          ]}
          aria-hidden
        >
          <View style={[styles.ringDashed, { borderRadius: ringR }]} />
          <View style={[StyleSheet.absoluteFill, spinAnim]}>
            <RingText radius={ringR - 20} />
          </View>
        </View>

        <Pressable
          onPress={() => onOpen(CENTER_ID)}
          accessibilityLabel="Open About Me"
          role="button"
          style={[styles.me, { top: fanHeight - ringR * 0.42 }]}
        >
          <Text style={styles.meArrow}>▲</Text>
          <Text style={styles.meText}>ME</Text>
        </Pressable>

        {DECK.map((card, i) => {
          const offset = i - centerIndex;
          const angle = offset * step;
          const rad = (angle * Math.PI) / 180;
          const x = R * Math.sin(rad);
          const y = -R * Math.cos(rad);
          const base: ViewStyle = {
            width: cardW,
            height: cardH,
            left: '50%',
            marginLeft: x - cardW / 2,
            top: fanHeight + y - cardH / 2,
            backgroundColor: card.bg,
            zIndex: 20 - Math.abs(offset),
          };
          const deal = {
            animationKeyframes: [
              {
                from: { opacity: 0, transform: [{ translateY: 260 }, { rotate: '0deg' }, { scale: 0.85 }] },
                to: { opacity: 1, transform: [{ translateY: 0 }, { rotate: `${angle}deg` }, { scale: 1 }] },
              },
            ],
            animationDuration: '900ms',
            animationDelay: `${250 + Math.abs(offset) * 110}ms`,
            animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
            animationFillMode: 'backwards',
          } as object as ViewStyle;

          return (
            <Pressable
              key={card.id}
              ref={(el) => {
                refs.current[card.id] = el;
              }}
              role="button"
              accessibilityLabel={`Open ${card.title}`}
              onPress={() => open(card, angle)}
              style={(s) => {
                const { hovered, focused, pressed } = s as WebState;
                const lift = hovered || focused;
                return [
                  styles.card,
                  base,
                  deal,
                  {
                    transform: [
                      { translateY: lift ? -36 : 0 },
                      { rotate: `${lift ? angle * 0.55 : angle}deg` },
                      { scale: pressed ? 0.97 : lift ? 1.06 : 1 },
                    ],
                  },
                  lift && { zIndex: 40 },
                  focused && styles.cardFocus,
                ];
              }}
            >
              <card.Face w={cardW} />
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.hint}>{isMobile ? 'Tap a card to open it' : 'Pick a card to open it'}</Text>
    </View>
  );
}

function RingText({ radius }: { radius: number }) {
  const name = profile.fullName.toUpperCase();
  const chars = [...`PORTFOLIO · ${name} · PORTFOLIO · ${name} · `];
  const stepDeg = 360 / chars.length;
  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      {chars.map((ch, i) => (
        <Text key={i} style={[styles.ringChar, { transform: [{ rotate: `${i * stepDeg}deg` }, { translateY: -radius }] }]}>
          {ch}
        </Text>
      ))}
    </View>
  );
}

const twinkle = (delay: number, star: boolean) =>
  ({
    animationKeyframes: [
      star
        ? {
            '0%': { opacity: 0.35, transform: [{ scale: 0.8 }, { rotate: '0deg' }] },
            '50%': { opacity: 1, transform: [{ scale: 1.15 }, { rotate: '20deg' }] },
            '100%': { opacity: 0.35, transform: [{ scale: 0.8 }, { rotate: '0deg' }] },
          }
        : {
            '0%': { opacity: 0.55, transform: [{ rotate: '0deg' }] },
            '50%': { opacity: 1, transform: [{ rotate: '90deg' }] },
            '100%': { opacity: 0.55, transform: [{ rotate: '0deg' }] },
          },
    ],
    animationDuration: star ? '3.2s' : '6s',
    animationDelay: `${delay}ms`,
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  }) as object as ViewStyle;

const blockAnim = {
  animationKeyframes: [{ from: { transform: [{ scaleY: 0 }] }, to: { transform: [{ scaleY: 1 }] } }],
  animationDuration: '900ms',
  animationTimingFunction: 'cubic-bezier(0.7, 0, 0.2, 1)',
  animationFillMode: 'both',
} as object as ViewStyle;

const titleAnim = {
  animationKeyframes: [
    { from: { opacity: 0, transform: [{ translateY: 30 }] }, to: { opacity: 1, transform: [{ translateY: 0 }] } },
  ],
  animationDuration: '800ms',
  animationDelay: '300ms',
  animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
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
  animationDuration: '40s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
} as object as ViewStyle;

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.cream, overflow: 'hidden', flexGrow: 1 },
  plus: { position: 'absolute', color: colors.rose, ...sans('500') },
  star: { position: 'absolute', color: colors.mauve },
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
  titleStage: { alignItems: 'center', justifyContent: 'flex-start', marginTop: 12 },
  block: { position: 'absolute', backgroundColor: colors.rose, alignSelf: 'center', transformOrigin: 'top' } as object,
  echo: { position: 'absolute', alignSelf: 'center', alignItems: 'center' },
  title: { ...serif('600'), position: 'absolute', color: colors.plum, letterSpacing: 1, textAlign: 'center' },
  tri: { position: 'absolute', fontSize: 16, color: colors.plum },
  fan: { width: '100%', overflow: 'hidden' },
  ringWrap: { position: 'absolute' },
  ringDashed: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
  } as object,
  ringChar: { ...sans('700'), position: 'absolute', fontSize: 13, color: colors.plumSoft },
  me: { position: 'absolute', left: '50%', marginLeft: -30, width: 60, alignItems: 'center', zIndex: 30 },
  meArrow: { fontSize: 12, color: colors.plum },
  meText: { ...sans('700'), fontSize: 19, letterSpacing: 2, color: colors.plum },
  card: {
    position: 'absolute',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(64,51,58,0.08)',
    cursor: 'pointer',
    transformOrigin: 'center bottom',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '380ms',
    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
    ...shadow.lifted,
  } as object,
  cardFocus: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep, outlineOffset: 4 } as object,
  hint: { ...sans('600'), fontSize: 13, letterSpacing: 1.2, color: colors.plumSoft, textAlign: 'center', paddingVertical: 24 },
});
