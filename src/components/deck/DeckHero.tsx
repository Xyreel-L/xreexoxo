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

export function DeckHero({ onOpen }: { onOpen: (id: string, from?: CardRect) => void }) {
  const { width: vw, height: vh } = useWindowDimensions();
  const W = Math.min(vw, 1280);
  const isMobile = vw < 640;

  // ---- title sizing (also bounded by viewport height so the fan stays on screen)
  const titleSize = clamp(Math.min(W * 0.135, vh * 0.15), 52, 176);
  const side = isMobile ? 20 : 48;

  // ---- fan geometry
  const cardW = isMobile ? clamp(W * 0.26, 96, 150) : clamp(Math.min(W * 0.15, vh * 0.2), 120, 200);
  const cardH = cardW * 1.4;
  const R = cardH * (isMobile ? 1.55 : 1.45); // distance from pivot to card centre
  const step = isMobile ? 16 : 18; // degrees between cards
  const centerIndex = DECK.findIndex((c) => c.id === CENTER_ID);
  const fanHeight = R + cardH * 0.62 + 64;
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

  return (
    <View style={styles.wrap} nativeID="home">
      {/* ---------- Title block ---------- */}
      <View style={[styles.titleBlock, { paddingHorizontal: side, paddingTop: isMobile ? 28 : 40 }]}>
        <View style={styles.topRow}>
          <Text style={[styles.welcome, { fontSize: isMobile ? 13 : 17 }]}>
            WELCOME{'\n'}TO MY
          </Text>
          <View style={styles.monogram}>
            <Text style={styles.monogramText}>{initials(profile.fullName)}</Text>
          </View>
        </View>

        <View style={[styles.titleStage, { height: titleSize * 1.6 }]}>
          {/* rose block behind the word */}
          <View
            style={[
              styles.block,
              blockAnim,
              { width: clamp(W * 0.15, 70, 190), height: titleSize * 2.05, top: -titleSize * 0.45 },
            ]}
          />
          {/* outlined echo, drifting */}
          <View style={[styles.echo, echoAnim, { top: titleSize * 0.05 }]} aria-hidden>
            <Svg width={Math.min(W - side * 2, titleSize * 6.2)} height={titleSize * 1.1}>
              <SvgText
                x="50%"
                y={titleSize * 0.9}
                textAnchor="middle"
                fontSize={titleSize}
                fontFamily="Fraunces, Georgia, serif"
                fontWeight="600"
                fill="none"
                stroke={colors.mauve}
                strokeWidth={1.2}
                letterSpacing={2}
              >
                PORTFOLIO
              </SvgText>
            </Svg>
          </View>
          <Text
            role="heading"
            aria-level={1}
            style={[styles.title, titleAnim, { fontSize: titleSize, lineHeight: titleSize * 1.05, top: titleSize * 0.42 }]}
          >
            PORTFOLIO
          </Text>
          <Text style={[styles.tri, { left: 0, top: titleSize * 0.78 }]}>▶</Text>
          <Text style={[styles.tri, { right: 0, top: titleSize * 0.78 }]}>◀</Text>
        </View>

        <View style={[styles.labels, isMobile && { flexDirection: 'column', gap: 6, alignItems: 'center' }]}>
          <Text style={styles.label}>{profile.fullName.toUpperCase()}</Text>
          {profile.availableForOjt ? (
            <View style={styles.ojt}>
              <View style={styles.pulseWrap}>
                <View style={[styles.pulse, pulseAnim]} />
                <View style={styles.dot} />
              </View>
              <Text style={styles.ojtText}>Open to OJT</Text>
            </View>
          ) : null}
          <Text style={styles.label}>IT STUDENT · ASPIRING DEVELOPER</Text>
        </View>

        {/* crosshair marks */}
        {!isMobile
          ? [
              [0.03, 0.08],
              [0.36, 0.08],
              [0.64, 0.08],
              [0.97, 0.08],
              [0.03, 0.93],
              [0.36, 0.93],
              [0.64, 0.93],
              [0.97, 0.93],
            ].map(([x, y], i) => (
              <Text key={i} style={[styles.plus, { left: `${x! * 100}%`, top: `${y! * 100}%` }]} aria-hidden>
                +
              </Text>
            ))
          : null}
      </View>

      {/* ---------- Fan ---------- */}
      <View style={[styles.fan, { height: fanHeight }]}>
        {/* rotating ring */}
        <View
          style={[
            styles.ringWrap,
            { width: ringR * 2, height: ringR * 2, left: '50%', marginLeft: -ringR, top: fanHeight - ringR },
          ]}
          aria-hidden
        >
          <View style={[styles.ringDashed, { borderRadius: ringR }]} />
          <View style={[StyleSheet.absoluteFill, spinAnim]}>
            <RingText radius={ringR - 18} />
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
          const y = -R * Math.cos(rad); // relative to pivot (bottom centre)
          const left = x - cardW / 2;
          const top = fanHeight + y - cardH / 2;
          const base: ViewStyle = {
            width: cardW,
            height: cardH,
            left: '50%',
            marginLeft: left,
            top,
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
                      { translateY: lift ? -34 : 0 },
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

      <Text style={styles.hint}>{isMobile ? 'Tap a card to open it' : 'Pick a card — each one opens a chapter'}</Text>
    </View>
  );
}

function RingText({ radius }: { radius: number }) {
  const text = `PORTFOLIO · ${profile.fullName.toUpperCase()} · PORTFOLIO · ${profile.fullName.toUpperCase()} · `;
  const chars = [...text];
  const stepDeg = 360 / chars.length;
  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
      {chars.map((ch, i) => (
        <Text
          key={i}
          style={[
            styles.ringChar,
            { transform: [{ rotate: `${i * stepDeg}deg` }, { translateY: -radius }] },
          ]}
        >
          {ch}
        </Text>
      ))}
    </View>
  );
}

const kf = (frames: object[]) => frames;

const blockAnim = {
  animationKeyframes: kf([{ from: { transform: [{ scaleY: 0 }] }, to: { transform: [{ scaleY: 1 }] } }]),
  animationDuration: '900ms',
  animationTimingFunction: 'cubic-bezier(0.7, 0, 0.2, 1)',
  animationFillMode: 'both',
} as object as ViewStyle;

const titleAnim = {
  animationKeyframes: kf([
    { from: { opacity: 0, transform: [{ translateY: 30 }] }, to: { opacity: 1, transform: [{ translateY: 0 }] } },
  ]),
  animationDuration: '800ms',
  animationDelay: '300ms',
  animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
  animationFillMode: 'both',
} as object as ViewStyle;

const echoAnim = {
  animationKeyframes: kf([
    {
      '0%': { transform: [{ translateX: -18 }, { skewX: '-8deg' }] },
      '50%': { transform: [{ translateX: 18 }, { skewX: '8deg' }] },
      '100%': { transform: [{ translateX: -18 }, { skewX: '-8deg' }] },
    },
  ]),
  animationDuration: '6s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-in-out',
} as object as ViewStyle;

const spinAnim = {
  animationKeyframes: kf([{ from: { transform: [{ rotate: '0deg' }] }, to: { transform: [{ rotate: '360deg' }] } }]),
  animationDuration: '40s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
} as object as ViewStyle;

const pulseAnim = {
  animationKeyframes: kf([
    { '0%': { opacity: 0.55, transform: [{ scale: 1 }] }, '100%': { opacity: 0, transform: [{ scale: 2.6 }] } },
  ]),
  animationDuration: '1.8s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-out',
} as object as ViewStyle;

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.cream, overflow: 'hidden', minHeight: '100%' as unknown as number },
  titleBlock: { width: '100%', maxWidth: 1280, alignSelf: 'center' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 3 },
  welcome: { ...sans('700'), color: colors.plum, letterSpacing: 1.5, lineHeight: 20 },
  monogram: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: { ...serif('600'), fontSize: 15, color: colors.plum },
  titleStage: { alignItems: 'center', justifyContent: 'flex-start' },
  block: { position: 'absolute', backgroundColor: colors.rose, alignSelf: 'center', transformOrigin: 'top' } as object,
  echo: { position: 'absolute', alignSelf: 'center', alignItems: 'center' },
  title: { ...serif('600'), position: 'absolute', color: colors.plum, letterSpacing: 2, textAlign: 'center' },
  tri: { position: 'absolute', fontSize: 14, color: colors.plum },
  labels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  label: { ...sans('700'), fontSize: 11.5, letterSpacing: 1.8, color: colors.plumSoft },
  ojt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.ivory,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  ojtText: { ...sans('600'), fontSize: 12, color: colors.plum },
  pulseWrap: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mauve },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mauve },
  plus: { position: 'absolute', fontSize: 16, color: colors.lineStrong, ...sans('500') },
  fan: { width: '100%', marginTop: 8, overflow: 'hidden' },
  ringWrap: { position: 'absolute' },
  ringDashed: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
  } as object,
  ringChar: { ...sans('700'), position: 'absolute', fontSize: 12, letterSpacing: 0, color: colors.plumSoft },
  me: { position: 'absolute', left: '50%', marginLeft: -30, width: 60, alignItems: 'center', zIndex: 30 },
  meArrow: { fontSize: 12, color: colors.plum },
  meText: { ...sans('700'), fontSize: 18, letterSpacing: 2, color: colors.plum },
  card: {
    position: 'absolute',
    borderRadius: 18,
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
  hint: { ...sans('600'), fontSize: 12.5, letterSpacing: 1.2, color: colors.plumSoft, textAlign: 'center', paddingVertical: 28 },
});
