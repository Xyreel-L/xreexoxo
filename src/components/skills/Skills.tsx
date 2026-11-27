import { StyleSheet, Text, View } from 'react-native';
import { BrainCircuit, ChartColumn, Code, Cpu, Database, Network, Wrench } from '@/components/ui/icons';
import type { LucideIcon } from '@/components/ui/icons';
import { colors, radius, sans, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { skillCategories, skills } from '@/data/skills';
import type { SkillCategory } from '@/types/content';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { H3, Small } from '@/components/ui/Typography';

const icons: Record<SkillCategory, LucideIcon> = {
  programming: Code,
  database: Database,
  networking: Network,
  data_analytics: ChartColumn,
  ai: BrainCircuit,
  systems: Cpu,
  tools: Wrench,
};

export function Skills({ onMeasure }: { onMeasure: (id: string, y: number) => void }) {
  const { columns } = useBreakpoint();
  const groups = skillCategories
    .map((c) => ({ ...c, items: skills.filter((s) => s.category === c.key) }))
    .filter((g) => g.items.length > 0);

  const basis = columns === 3 ? '31.5%' : columns === 2 ? '48%' : '100%';

  return (
    <Section id="skills" onMeasure={onMeasure}>
      <SectionHeader
        id="skills"
        eyebrow="Technical Skills"
        title="A toolkit shaped by coursework, certification, and projects."
        intro="Grouped by area. Every item here is something I have used hands-on — no inflated percentages."
      />

      <View style={styles.grid}>
        {groups.map((g) => {
          const Icon = icons[g.key];
          return (
            <Card key={g.key} style={[styles.card, { flexBasis: basis }]}>
              <View style={styles.cardHead}>
                <View style={styles.iconWrap}>
                  <Icon size={22} color={colors.mauve} strokeWidth={1.7} />
                </View>
                <H3 style={{ flex: 1 }}>{g.label}</H3>
              </View>
              <View style={styles.list}>
                {g.items.map((s) => (
                  <View key={s.name} style={styles.item}>
                    <View style={styles.itemHead}>
                      <Text style={styles.itemName}>{s.name}</Text>
                      {s.level ? <Text style={styles.level}>{s.level}</Text> : null}
                    </View>
                    <Small>{s.description}</Small>
                  </View>
                ))}
              </View>
            </Card>
          );
        })}
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xl },
  card: { padding: space.xl, gap: space.lg, flexGrow: 0, flexShrink: 1 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: space.md, marginBottom: space.lg },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.blushTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { gap: space.lg },
  item: { gap: 3, paddingLeft: space.md, borderLeftWidth: 2, borderLeftColor: colors.blush },
  itemHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  itemName: { ...sans('700'), fontSize: 15, color: colors.plum },
  level: { ...sans('600'), fontSize: 11.5, color: colors.mauveDeep, letterSpacing: 0.4 },
});
