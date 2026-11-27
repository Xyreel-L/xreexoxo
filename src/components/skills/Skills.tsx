import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bot, ChartColumn, CodeXml, Database, LayoutTemplate, Palette, ServerCog } from '@/components/ui/icons';
import type { LucideIcon } from '@/components/ui/icons';
import { colors, radius, sans, serif, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { skillCategories, skills } from '@/data/skills';
import type { SkillCategory } from '@/types/content';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

const icons: Record<SkillCategory, LucideIcon> = {
  languages: CodeXml,
  frontend: LayoutTemplate,
  database: Database,
  analytics: ChartColumn,
  ai: Bot,
  design: Palette,
  infra: ServerCog,
};

/** Tech stack: every group shown at once as cards of technology chips. */
export function Skills({ onMeasure }: { onMeasure?: (id: string, y: number) => void }) {
  const { columns } = useBreakpoint();
  const groups = skillCategories
    .map((c) => ({ ...c, items: skills.filter((s) => s.category === c.key) }))
    .filter((g) => g.items.length > 0);
  const basis = columns === 3 ? '31.5%' : columns === 2 ? '48%' : '100%';

  return (
    <Section id="skills" onMeasure={onMeasure}>
      <SectionHeader
        id="skills"
        eyebrow="Tech Stack"
        title="Languages, frameworks, and tools I work with."
        intro={`${skills.length} technologies across ${groups.length} areas.`}
      />

      <View style={styles.grid}>
        {groups.map((g, i) => {
          const Icon = icons[g.key];
          return (
            <Reveal key={g.key} delay={i * 60} style={[styles.card, { flexBasis: basis as `${number}%` }]}>
              <View style={styles.cardHead}>
                <View style={styles.iconWrap}>
                  <Icon size={22} color={colors.mauve} strokeWidth={1.7} />
                </View>
                <Text style={styles.cardTitle}>{g.label}</Text>
                <Text style={styles.cardCount}>{String(g.items.length).padStart(2, '0')}</Text>
              </View>
              <View style={styles.chips}>
                {g.items.map((s) => (
                  <Chip key={s.name} label={s.name} />
                ))}
              </View>
            </Reveal>
          );
        })}
      </View>
    </Section>
  );
}

function Chip({ label }: { label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      accessible={false}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[styles.chip, hover && styles.chipHover]}
    >
      <View style={[styles.chipDot, hover && styles.chipDotHover]} />
      <Text style={[styles.chipText, hover && { color: colors.plum }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xl },
  card: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.xl,
    gap: space.lg,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.blushTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { ...serif('500'), fontSize: 21, lineHeight: 26, color: colors.plum, flex: 1, letterSpacing: -0.2 },
  cardCount: { ...serif('500'), fontSize: 14, color: colors.plumSoft },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.line,
    transitionProperty: 'background-color, border-color, transform',
    transitionDuration: '160ms',
  },
  chipHover: { backgroundColor: colors.white, borderColor: colors.rose, transform: [{ translateY: -2 }] },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.blush,
    transitionProperty: 'background-color',
    transitionDuration: '160ms',
  },
  chipDotHover: { backgroundColor: colors.mauve },
  chipText: { ...sans('600'), fontSize: 14, color: colors.plumSoft },
});
