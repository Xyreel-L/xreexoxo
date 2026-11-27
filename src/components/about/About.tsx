import { StyleSheet, Text, View } from 'react-native';
import { GraduationCap, MapPin, Target, Lightbulb } from '@/components/ui/icons';
import { colors, radius, sans, serif, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { profile } from '@/data/profile';
import { useSurface } from '@/theme/surface';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Body, Small } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { Tag } from '@/components/ui/Tag';

export function About({ onMeasure }: { onMeasure?: (id: string, y: number) => void }) {
  const { isDesktop } = useBreakpoint();
  const [lead, ...rest] = profile.biography;
  const surface = useSurface();

  return (
    <Section id="about" tone="ivory" onMeasure={onMeasure}>
      <SectionHeader id="about" eyebrow="About Me" />

      <View style={[styles.grid, isDesktop && { flexDirection: 'row' }]}>
        <View style={[styles.bio, isDesktop && { flex: 1.25 }]}>
          {lead ? <Text style={[styles.lead, { color: surface.ink }]}>{lead}</Text> : null}
          {rest.map((p, i) => (
            <Body key={i} style={styles.paragraph}>
              {p}
            </Body>
          ))}
        </View>

        <Card style={[styles.facts, isDesktop && { flex: 1 }]}>
          <Fact icon={<GraduationCap size={20} color={colors.mauve} strokeWidth={1.7} />} label="Education">
            <Text style={styles.factValue}>{profile.degreeProgram}</Text>
            <Small>
              {profile.university}
              {profile.yearLevel ? ` · ${profile.yearLevel}` : ''}
            </Small>
          </Fact>

          {profile.location ? (
            <Fact icon={<MapPin size={20} color={colors.mauve} strokeWidth={1.7} />} label="Based in">
              <Text style={styles.factValue}>{profile.location}</Text>
            </Fact>
          ) : null}

          <Fact icon={<Lightbulb size={20} color={colors.mauve} strokeWidth={1.7} />} label="Technical interests">
            <View style={styles.tags}>
              {profile.technicalInterests.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </View>
          </Fact>

          <Fact icon={<Target size={20} color={colors.mauve} strokeWidth={1.7} />} label="Career direction" last>
            <View style={styles.tags}>
              {profile.careerInterests.map((t) => (
                <Tag key={t} label={t} tone="outline" />
              ))}
            </View>
          </Fact>
        </Card>
      </View>
    </Section>
  );
}

function Fact({
  icon,
  label,
  children,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.fact, !last && styles.factBorder]}>
      <View style={styles.factIcon}>{icon}</View>
      <View style={{ flex: 1, gap: 6 }}>
        <Text style={styles.factLabel}>{label}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: space.xxxl, alignItems: 'flex-start' },
  bio: { gap: space.xl },
  lead: { ...serif('400'), fontSize: 24, lineHeight: 36, color: colors.plum, letterSpacing: -0.3 },
  paragraph: { fontSize: 17, lineHeight: 29 },
  facts: { padding: space.xl, width: '100%', backgroundColor: colors.cream },
  fact: { flexDirection: 'row', gap: space.lg, paddingVertical: space.lg },
  factBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  factIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  factLabel: { ...sans('700'), fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.mauveDeep },
  factValue: { ...sans('600'), fontSize: 16, color: colors.plum, lineHeight: 23 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
});
