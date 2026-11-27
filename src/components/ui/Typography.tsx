import { StyleSheet, Text, TextProps } from 'react-native';
import { colors, sans, serif } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type Props = TextProps & { children: React.ReactNode };

export function Display({ style, ...rest }: Props) {
  const { isMobile, isTablet } = useBreakpoint();
  const size = isMobile ? 44 : isTablet ? 58 : 72;
  return (
    <Text
      role="heading"
      aria-level={1}
      style={[styles.display, { fontSize: size, lineHeight: size * 1.04 }, style]}
      {...rest}
    />
  );
}

export function H2({ style, ...rest }: Props) {
  const { isMobile } = useBreakpoint();
  const size = isMobile ? 34 : 46;
  return (
    <Text
      role="heading"
      aria-level={2}
      style={[styles.h2, { fontSize: size, lineHeight: size * 1.1 }, style]}
      {...rest}
    />
  );
}

export function H3({ style, ...rest }: Props) {
  return <Text role="heading" aria-level={3} style={[styles.h3, style]} {...rest} />;
}

export function Eyebrow({ style, ...rest }: Props) {
  return <Text style={[styles.eyebrow, style]} {...rest} />;
}

export function Body({ style, ...rest }: Props) {
  return <Text style={[styles.body, style]} {...rest} />;
}

export function Small({ style, ...rest }: Props) {
  return <Text style={[styles.small, style]} {...rest} />;
}

const styles = StyleSheet.create({
  display: {
    ...serif('500'),
    color: colors.plum,
    letterSpacing: -1.5,
  },
  h2: {
    ...serif('500'),
    color: colors.plum,
    letterSpacing: -0.8,
  },
  h3: {
    ...sans('700'),
    color: colors.plum,
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: -0.2,
  },
  eyebrow: {
    ...sans('700'),
    color: colors.mauveDeep,
    fontSize: 12,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  body: {
    ...sans('400'),
    color: colors.plumSoft,
    fontSize: 16,
    lineHeight: 27,
  },
  small: {
    ...sans('500'),
    color: colors.plumSoft,
    fontSize: 13.5,
    lineHeight: 20,
  },
});
