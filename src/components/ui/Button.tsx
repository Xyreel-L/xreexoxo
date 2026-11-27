import { Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from '@/components/ui/icons';
import { colors, radius, sans } from '@/theme/tokens';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  accessibilityHint?: string;
  size?: 'md' | 'sm';
  href?: string;
};

// react-native-web adds `hovered` and `focused` to the Pressable state.
type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'left',
  disabled,
  accessibilityHint,
  size = 'md',
}: Props) {
  const fg = variant === 'primary' ? colors.white : colors.plum;
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      aria-disabled={disabled}
      disabled={disabled}
      onPress={onPress}
      style={(state) => {
        const { pressed, hovered, focused } = state as WebState;
        return [
          styles.base,
          size === 'sm' && styles.sm,
          styles[variant],
          hovered && !disabled && hoverStyles[variant],
          focused && styles.focused,
          pressed && !disabled && styles.pressed,
          disabled && styles.disabled,
        ];
      }}
    >
      <View style={styles.inner}>
        {Icon && iconPosition === 'left' ? <Icon size={size === 'sm' ? 16 : 18} color={fg} strokeWidth={1.8} /> : null}
        <Text style={[styles.label, size === 'sm' && styles.labelSm, { color: fg }]}>{label}</Text>
        {Icon && iconPosition === 'right' ? <Icon size={size === 'sm' ? 16 : 18} color={fg} strokeWidth={1.8} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
    transitionProperty: 'background-color, border-color, transform, box-shadow',
    transitionDuration: '180ms',
    cursor: 'pointer',
  },
  sm: { paddingHorizontal: 16, paddingVertical: 9 },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { ...sans('600'), fontSize: 15, letterSpacing: 0.1 },
  labelSm: { fontSize: 13.5 },
  primary: { backgroundColor: colors.mauve, borderColor: colors.mauve },
  secondary: { backgroundColor: colors.ivory, borderColor: colors.lineStrong },
  ghost: { backgroundColor: 'transparent' },
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep, outlineOffset: 3 } as object,
  pressed: { transform: [{ scale: 0.97 }] },
  disabled: { opacity: 0.45 },
});

const hoverStyles = StyleSheet.create({
  primary: { backgroundColor: colors.mauveDeep, borderColor: colors.mauveDeep, transform: [{ translateY: -1 }] },
  secondary: { borderColor: colors.mauve, backgroundColor: colors.white, transform: [{ translateY: -1 }] },
  ghost: { backgroundColor: colors.blushTint },
});
