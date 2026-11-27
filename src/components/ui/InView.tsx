import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useInView } from '@/hooks/useInView';

/** Fades and lifts its children in the first time they scroll into view (web). */
export function InView({
  children,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
}) {
  const { ref, hidden } = useInView();
  return (
    <View
      ref={ref}
      style={[styles.base, { transitionDelay: `${delay}ms` } as ViewStyle, hidden && styles.hidden, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    transitionProperty: 'opacity, transform',
    transitionDuration: '700ms',
    transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  },
  hidden: { opacity: 0, transform: [{ translateY: 28 }] },
});
