import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { GraduationCap } from '@/components/ui/icons';
import { colors, radius, sans, serif, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { education } from '@/data/education';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Body, Small } from '@/components/ui/Typography';

export function Education({ onMeasure }: { onMeasure: (id: string, y: number) => void }) {
  const { isMobile } = useBreakpoint();
  return (
    <Section id="education" tone="ivory" onMeasure={onMeasure}>
      <SectionHeader id="education" eyebrow="Education" title="Where I am learning." />

      <View style={styles.timeline}>
        {education.map((e, i) => (
          <View key={e.id} style={styles.row}>
            <View style={styles.rail}>
              <View style={styles.node}>
                {e.logo ? (
                  <Image source={e.logo} style={styles.logo} contentFit="contain" alt={`${e.institution} logo`} />
                ) : (
                  <GraduationCap size={22} color={colors.mauve} strokeWidth={1.6} />
                )}
              </View>
              {i < education.length - 1 ? <View style={styles.line} /> : null}
            </View>

            <View style={[styles.card, isMobile && { padding: space.xl }]}>
              {e.period ? <Text style={styles.period}>{e.period}</Text> : null}
              <Text style={styles.institution}>{e.institution}</Text>
              {e.degree ? <Text style={styles.degree}>{e.degree}</Text> : null}
              {e.description ? <Body style={{ marginTop: space.sm }}>{e.description}</Body> : null}
            </View>
          </View>
        ))}
        {education.length === 0 ? <Small>Education details coming soon.</Small> : null}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  timeline: { maxWidth: 820 },
  row: { flexDirection: 'row', gap: space.xl },
  rail: { alignItems: 'center', width: 56 },
  node: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.blush,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: { width: 40, height: 40 },
  line: { flex: 1, width: 1.5, backgroundColor: colors.blush, marginVertical: space.sm },
  card: {
    flex: 1,
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.xxl,
    marginBottom: space.xl,
    gap: 4,
  },
  period: { ...sans('700'), fontSize: 12, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.mauveDeep },
  institution: { ...serif('500'), fontSize: 26, lineHeight: 32, color: colors.plum, letterSpacing: -0.3 },
  degree: { ...sans('600'), fontSize: 16, lineHeight: 24, color: colors.plumSoft },
});
