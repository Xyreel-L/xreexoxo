import { Pressable, PressableStateCallbackType, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme/tokens';
import { openUrl } from '@/utils/links';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };

export function IconLink({
  url,
  label,
  children,
  inverted,
}: {
  url: string;
  label: string;
  children: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <Pressable
      role="link"
      accessibilityLabel={label}
      onPress={() => openUrl(url)}
      style={(s) => {
        const { hovered, focused, pressed } = s as WebState;
        return [
          styles.base,
          inverted && styles.inverted,
          hovered && (inverted ? styles.invertedHover : styles.hover),
          focused && styles.focused,
          pressed && { transform: [{ scale: 0.94 }] },
        ];
      }}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, transform',
    transitionDuration: '180ms',
  },
  hover: { borderColor: colors.mauve, backgroundColor: colors.blushTint, transform: [{ translateY: -2 }] },
  inverted: { backgroundColor: 'transparent', borderColor: 'rgba(235,197,203,0.35)' },
  invertedHover: { borderColor: colors.rose, backgroundColor: 'rgba(235,197,203,0.12)', transform: [{ translateY: -2 }] },
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep, outlineOffset: 3 } as object,
});
