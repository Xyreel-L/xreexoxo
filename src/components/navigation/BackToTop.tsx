import { Pressable, PressableStateCallbackType, StyleSheet } from 'react-native';
import { ArrowUp } from '@/components/ui/icons';
import { colors, radius, shadow } from '@/theme/tokens';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };

export function BackToTop({ visible, onPress }: { visible: boolean; onPress: () => void }) {
  return (
    <Pressable
      role="button"
      accessibilityLabel="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onPress={onPress}
      style={(s) => {
        const { hovered, focused } = s as WebState;
        return [
          styles.btn,
          !visible && styles.hidden,
          hovered && styles.hover,
          focused && styles.focused,
        ];
      }}
    >
      <ArrowUp size={20} color={colors.cream} strokeWidth={2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'fixed' as 'absolute',
    right: 24,
    bottom: 24,
    zIndex: 40,
    width: 50,
    height: 50,
    borderRadius: radius.pill,
    backgroundColor: colors.mauve,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transitionProperty: 'opacity, transform, background-color',
    transitionDuration: '250ms',
    ...shadow.lifted,
  },
  hidden: { opacity: 0, transform: [{ translateY: 16 }], pointerEvents: 'none' },
  hover: { backgroundColor: colors.mauveDeep, transform: [{ translateY: -3 }] },
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.plum, outlineOffset: 3 } as object,
});
