import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { colors, layout, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { Body, Eyebrow, H2 } from './Typography';

export function Container({ style, ...rest }: ViewProps) {
  const { isMobile } = useBreakpoint();
  return (
    <View
      style={[styles.container, { paddingHorizontal: isMobile ? space.xl - 4 : space.xxl }, style]}
      {...rest}
    />
  );
}

type SectionProps = ViewProps & {
  id: string;
  tone?: 'cream' | 'ivory' | 'plum';
  onMeasure?: (id: string, y: number) => void;
};

export function Section({ id, tone = 'cream', onMeasure, style, children, ...rest }: SectionProps) {
  const { isMobile } = useBreakpoint();
  const bg: ViewStyle = {
    backgroundColor: tone === 'ivory' ? colors.ivory : tone === 'plum' ? colors.plum : colors.cream,
  };
  return (
    <View
      nativeID={id}
      role="region"
      aria-labelledby={`${id}-title`}
      onLayout={(e) => onMeasure?.(id, e.nativeEvent.layout.y)}
      style={[{ paddingVertical: isMobile ? space.huge : space.giant }, bg, style]}
      {...rest}
    >
      <Container>{children}</Container>
    </View>
  );
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  intro,
  align = 'left',
  inverted,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  inverted?: boolean;
}) {
  const center = align === 'center';
  return (
    <View style={[styles.header, center && { alignItems: 'center' }]}>
      <View style={[styles.eyebrowRow, center && { justifyContent: 'center' }]}>
        <View style={[styles.rule, inverted && { backgroundColor: colors.rose }]} />
        <Eyebrow style={inverted ? { color: colors.blush } : undefined}>{eyebrow}</Eyebrow>
      </View>
      <H2
        nativeID={`${id}-title`}
        style={[center && { textAlign: 'center' }, inverted && { color: colors.cream }]}
      >
        {title}
      </H2>
      {intro ? (
        <Body
          style={[
            styles.intro,
            center && { textAlign: 'center' },
            inverted && { color: colors.blush },
          ]}
        >
          {intro}
        </Body>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
  },
  header: { gap: space.lg, marginBottom: space.xxxl, maxWidth: 720 },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  rule: { width: 28, height: 1.5, backgroundColor: colors.mauve },
  intro: { fontSize: 17, lineHeight: 29 },
});
