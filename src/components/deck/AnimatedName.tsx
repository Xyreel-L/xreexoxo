import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, serif } from '@/theme/tokens';

/**
 * The headline name, letter by letter: letters rise in one after another, then
 * drift in a slow wave. Hovering a letter lifts it and tints it rose.
 */
export function AnimatedName({ lines, size }: { lines: string[]; size: number }) {
  let n = 0;
  return (
    <View role="heading" aria-level={1} aria-label={lines.join(' ')} style={styles.wrap}>
      {lines.map((line, li) => (
        <View key={li} style={styles.line}>
          {[...line].map((ch, ci) => {
            const i = n++;
            return ch === ' ' ? (
              <View key={ci} style={{ width: size * 0.32 }} />
            ) : (
              <Letter key={ci} ch={ch} index={i} size={size} />
            );
          })}
        </View>
      ))}
    </View>
  );
}

function Letter({ ch, index, size }: { ch: string; index: number; size: number }) {
  const [hover, setHover] = useState(false);
  const enter = 300 + index * 55;
  const anim = {
    animationKeyframes: [
      {
        from: { opacity: 0, transform: [{ translateY: size * 0.5 }, { rotate: '-8deg' }] },
        to: { opacity: 1, transform: [{ translateY: 0 }, { rotate: '0deg' }] },
      },
      {
        '0%': { transform: [{ translateY: 0 }] },
        '50%': { transform: [{ translateY: -size * 0.045 }] },
        '100%': { transform: [{ translateY: 0 }] },
      },
    ],
    animationDuration: `700ms, 3.6s`,
    animationDelay: `${enter}ms, ${enter + 700 + index * 120}ms`,
    animationIterationCount: '1, infinite',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1), ease-in-out',
    animationFillMode: 'both, none',
  } as object as ViewStyle;

  return (
    <Pressable accessible={false} onHoverIn={() => setHover(true)} onHoverOut={() => setHover(false)} style={anim}>
      <Text
        aria-hidden
        style={[
          styles.letter,
          { fontSize: size, lineHeight: size * 1.02 },
          hover && { color: colors.mauve, transform: [{ translateY: -size * 0.12 }, { rotate: '-4deg' }] },
        ]}
      >
        {ch}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  line: { flexDirection: 'row', justifyContent: 'center' },
  letter: {
    ...serif('600'),
    color: colors.plum,
    letterSpacing: 1,
    transitionProperty: 'color, transform',
    transitionDuration: '220ms',
    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
  },
});
