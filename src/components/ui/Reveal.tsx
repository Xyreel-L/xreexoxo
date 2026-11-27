import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleProp, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Subtle fade-and-rise entrance.
 *
 * Web: a pure CSS animation, so it plays straight from the pre-rendered HTML
 * and never depends on JavaScript loading (no blank hero on slow connections).
 * Reduced-motion users get no animation (see +html.tsx).
 * Native: Animated API.
 */
export function Reveal(props: Props) {
  return Platform.OS === 'web' ? <WebReveal {...props} /> : <NativeReveal {...props} />;
}

function WebReveal({ children, delay = 0, style }: Props) {
  const anim = {
    animationKeyframes: [
      {
        from: { opacity: 0, transform: [{ translateY: 18 }] },
        to: { opacity: 1, transform: [{ translateY: 0 }] },
      },
    ],
    animationDuration: '700ms',
    animationDelay: `${delay}ms`,
    animationTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
    animationFillMode: 'both',
  } as object as ViewStyle;
  return <View style={[anim, style]}>{children}</View>;
}

function NativeReveal({ children, delay = 0, style }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 700,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [delay, progress]);

  return (
    <Animated.View
      style={[
        {
          opacity: progress,
          transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}
