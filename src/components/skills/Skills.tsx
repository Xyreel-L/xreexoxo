import { useState } from 'react';
import { Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { BrainCircuit, ChartColumn, Code, Cpu, Database, Network, Wrench } from '@/components/ui/icons';
import type { LucideIcon } from '@/components/ui/icons';
import { colors, radius, sans, serif, shadow, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { skillCategories, skills } from '@/data/skills';
import type { SkillCategory } from '@/types/content';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Small } from '@/components/ui/Typography';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };

const icons: Record<SkillCategory, LucideIcon> = {
  programming: Code,
  database: Database,
  networking: Network,
  data_analytics: ChartColumn,
  ai: BrainCircuit,
  systems: Cpu,
  tools: Wrench,
};

/** Interactive explorer: pick an area on the left, see its skills on the right. */
export function Skills({ onMeasure }: { onMeasure: (id: string, y: number) => void }) {
  const { isDesktop, isMobile } = useBreakpoint();
  const groups = skillCategories
    .map((c) => ({ ...c, items: skills.filter((s) => s.category === c.key) }))
    .filter((g) => g.items.length > 0);
  const [activeKey, setActiveKey] = useState<SkillCategory | undefined>(groups[0]?.key);
  const active = groups.find((g) => g.key === activeKey) ?? groups[0];

  if (!active) return null;
  const ActiveIcon = icons[active.key];

  return (
    <Section id="skills" onMeasure={onMeasure}>
      <SectionHeader
        id="skills"
        eyebrow="Technical Skills"
        title="A toolkit shaped by coursework, certification, and projects."
        intro="Choose an area to explore. Every item here is something I have used hands-on — no inflated percentages."
      />

      <View style={[styles.layout, isDesktop && { flexDirection: 'row' }]}>
        <View
          role="tablist"
          aria-label="Skill areas"
          style={[styles.tabs, isDesktop ? styles.tabsColumn : styles.tabsRow]}
        >
          {groups.map((g, i) => {
            const Icon = icons[g.key];
            const selected = g.key === active.key;
            return (
              <Pressable
                key={g.key}
                role="tab"
                aria-selected={selected}
                onPress={() => setActiveKey(g.key)}
                style={(s) => {
                  const { hovered, focused } = s as WebState;
                  return [
                    styles.tab,
                    isDesktop ? styles.tabWide : styles.tabCompact,
                    hovered && !selected && styles.tabHover,
                    selected && styles.tabActive,
                    focused && styles.focused,
                  ];
                }}
              >
                <Icon size={18} color={selected ? colors.cream : colors.mauve} strokeWidth={1.8} />
                {isMobile && !selected ? null : (
                  <Text style={[styles.tabText, selected && styles.tabTextActive]} numberOfLines={2}>
                    {isDesktop ? g.label : g.label.split(' ')[0]}
                  </Text>
                )}
                {isDesktop ? (
                  <Text style={[styles.tabCount, selected && { color: colors.blush }]}>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.panel, isDesktop && { flex: 1 }]}>
          <Reveal key={active.key} style={{ gap: space.xl }}>
            <View style={styles.panelHead}>
              <View style={styles.panelIcon}>
                <ActiveIcon size={26} color={colors.mauve} strokeWidth={1.6} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.panelTitle}>{active.label}</Text>
                <Small>
                  {active.items.length} {active.items.length === 1 ? 'skill' : 'skills'}
                </Small>
              </View>
            </View>

            <View style={styles.skillGrid}>
              {active.items.map((s) => (
                <SkillTile key={s.name} name={s.name} description={s.description} level={s.level} />
              ))}
            </View>
          </Reveal>
        </View>
      </View>
    </Section>
  );
}

function SkillTile({ name, description, level }: { name: string; description: string; level?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      accessible={false}
      style={[styles.tile, hover && styles.tileHover]}
    >
      <View style={styles.tileHead}>
        <View style={[styles.tileDot, hover && { backgroundColor: colors.mauve, transform: [{ scale: 1.3 }] }]} />
        <Text style={styles.tileName}>{name}</Text>
        {level ? <Text style={styles.level}>{level}</Text> : null}
      </View>
      <Small>{description}</Small>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  layout: { gap: space.xl, alignItems: 'flex-start' },
  tabs: { gap: space.sm },
  tabsColumn: { width: 340 },
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.ivory,
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color, transform',
    transitionDuration: '180ms',
  },
  tabWide: { paddingHorizontal: space.lg, paddingVertical: 14 },
  tabCompact: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.pill },
  tabHover: { borderColor: colors.blush, backgroundColor: colors.white, transform: [{ translateX: 3 }] },
  tabActive: { backgroundColor: colors.plum, borderColor: colors.plum },
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep, outlineOffset: 2 } as object,
  tabText: { ...sans('600'), fontSize: 14.5, color: colors.plum, flexShrink: 1 },
  tabTextActive: { color: colors.cream },
  tabCount: { ...serif('500'), fontSize: 13, color: colors.plumSoft, marginLeft: 'auto' },
  panel: {
    width: '100%',
    backgroundColor: colors.ivory,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.xxl,
    minHeight: 320,
    ...shadow.soft,
  },
  panelHead: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  panelIcon: {
    width: 58,
    height: 58,
    borderRadius: radius.lg,
    backgroundColor: colors.blushTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelTitle: { ...serif('500'), fontSize: 26, lineHeight: 32, color: colors.plum, letterSpacing: -0.3 },
  skillGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.lg },
  tile: {
    flexGrow: 1,
    flexBasis: 240,
    gap: 6,
    padding: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: 'transparent',
    transitionProperty: 'border-color, transform, background-color',
    transitionDuration: '180ms',
  },
  tileHover: { borderColor: colors.blush, backgroundColor: colors.white, transform: [{ translateY: -2 }] },
  tileHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  tileDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.rose,
    transitionProperty: 'background-color, transform',
    transitionDuration: '180ms',
  },
  tileName: { ...sans('700'), fontSize: 15.5, color: colors.plum, flex: 1 },
  level: { ...sans('600'), fontSize: 11.5, color: colors.mauveDeep, letterSpacing: 0.4 },
});
