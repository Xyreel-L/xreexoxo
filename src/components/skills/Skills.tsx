import { useState } from 'react';
import { Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { Bot, ChartColumn, CodeXml, Database, LayoutTemplate, Palette, ServerCog } from '@/components/ui/icons';
import type { LucideIcon } from '@/components/ui/icons';
import { colors, radius, sans, serif, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { skillCategories, skills } from '@/data/skills';
import type { SkillCategory } from '@/types/content';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };
type Filter = 'all' | SkillCategory;

const icons: Record<SkillCategory, LucideIcon> = {
  languages: CodeXml,
  frontend: LayoutTemplate,
  database: Database,
  analytics: ChartColumn,
  ai: Bot,
  design: Palette,
  infra: ServerCog,
};

/** Tech stack: filter tabs on top, grouped cards of technology chips below. */
export function Skills({ onMeasure }: { onMeasure: (id: string, y: number) => void }) {
  const { columns } = useBreakpoint();
  const [filter, setFilter] = useState<Filter>('all');

  const groups = skillCategories
    .map((c) => ({ ...c, items: skills.filter((s) => s.category === c.key) }))
    .filter((g) => g.items.length > 0);
  const shown = groups.filter((g) => filter === 'all' || g.key === filter);
  const basis = filter !== 'all' ? '100%' : columns === 3 ? '31.5%' : columns === 2 ? '48%' : '100%';

  return (
    <Section id="skills" onMeasure={onMeasure}>
      <SectionHeader
        id="skills"
        eyebrow="Tech Stack"
        title="Languages, frameworks, and tools I work with."
        intro={`${skills.length} technologies across ${groups.length} areas. Pick an area to focus on it.`}
      />

      <View role="tablist" aria-label="Tech stack areas" style={styles.tabs}>
        <Tab label="All" count={skills.length} active={filter === 'all'} onPress={() => setFilter('all')} />
        {groups.map((g) => (
          <Tab
            key={g.key}
            label={g.label}
            icon={icons[g.key]}
            count={g.items.length}
            active={filter === g.key}
            onPress={() => setFilter(g.key)}
          />
        ))}
      </View>

      <View style={styles.grid}>
        {shown.map((g, i) => {
          const Icon = icons[g.key];
          return (
            <Reveal
              key={`${g.key}-${filter}`}
              delay={i * 50}
              style={[styles.card, { flexBasis: basis as `${number}%` }]}
            >
              <View style={styles.cardHead}>
                <View style={styles.iconWrap}>
                  <Icon size={22} color={colors.mauve} strokeWidth={1.7} />
                </View>
                <Text style={styles.cardTitle}>{g.label}</Text>
                <Text style={styles.cardCount}>{String(g.items.length).padStart(2, '0')}</Text>
              </View>
              <View style={styles.chips}>
                {g.items.map((s) => (
                  <Chip key={s.name} label={s.name} large={filter !== 'all'} />
                ))}
              </View>
            </Reveal>
          );
        })}
      </View>
    </Section>
  );
}

function Tab({
  label,
  count,
  active,
  onPress,
  icon: Icon,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  icon?: LucideIcon;
}) {
  return (
    <Pressable
      role="tab"
      aria-selected={active}
      onPress={onPress}
      style={(s) => {
        const { hovered, focused } = s as WebState;
        return [styles.tab, hovered && !active && styles.tabHover, active && styles.tabActive, focused && styles.focused];
      }}
    >
      {Icon ? <Icon size={15} color={active ? colors.blush : colors.mauve} strokeWidth={1.9} /> : null}
      <Text style={[styles.tabText, active && { color: colors.cream }]}>{label}</Text>
      <Text style={[styles.tabCount, active && { color: colors.blush }]}>{count}</Text>
    </Pressable>
  );
}

function Chip({ label, large }: { label: string; large?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      accessible={false}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[styles.chip, large && styles.chipLarge, hover && styles.chipHover]}
    >
      <View style={[styles.chipDot, hover && styles.chipDotHover]} />
      <Text style={[styles.chipText, large && { fontSize: 16 }, hover && { color: colors.plum }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginBottom: space.xxl },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.ivory,
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '160ms',
  },
  tabHover: { borderColor: colors.mauve, backgroundColor: colors.blushTint },
  tabActive: { backgroundColor: colors.plum, borderColor: colors.plum },
  tabText: { ...sans('600'), fontSize: 13.5, color: colors.plum },
  tabCount: { ...sans('700'), fontSize: 12, color: colors.mauveDeep },
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep, outlineOffset: 2 } as object,
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
  chipLarge: { paddingHorizontal: 16, paddingVertical: 10 },
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
