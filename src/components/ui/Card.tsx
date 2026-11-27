import { Pressable, PressableStateCallbackType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '@/theme/tokens';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
};

/** Ivory surface. Becomes an interactive, hover-lifting card when onPress is set. */
export function Card({ children, style, onPress, accessibilityLabel }: Props) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable
      role="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={(state) => {
        const { hovered, focused, pressed } = state as WebState;
        return [
          styles.card,
          styles.interactive,
          hovered && styles.hovered,
          focused && styles.focused,
          pressed && styles.pressed,
          style,
        ];
      }}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  interactive: {
    cursor: 'pointer',
    transitionProperty: 'transform, box-shadow, border-color',
    transitionDuration: '220ms',
    transitionTimingFunction: 'cubic-bezier(.2,.7,.3,1)',
  },
  hovered: {
    ...shadow.lifted,
    borderColor: colors.blush,
    transform: [{ translateY: -4 }],
  },
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep, outlineOffset: 3 } as object,
  pressed: { transform: [{ scale: 0.99 }] },
});
