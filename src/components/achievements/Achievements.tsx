import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  PressableStateCallbackType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  ExternalLink,
  Globe,
  GraduationCap,
  Search,
  X,
  ZoomIn,
  ZoomOut,
} from '@/components/ui/icons';
import type { LucideIcon } from '@/components/ui/icons';
import { colors, radius, sans, serif, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { achievementCategories, achievements } from '@/data/achievements';
import type { Achievement, AchievementCategory } from '@/types/content';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { Body, Eyebrow, H3, Small } from '@/components/ui/Typography';
import { openUrl } from '@/utils/links';

type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };
type Filter = 'all' | AchievementCategory;

const categoryIcon: Record<AchievementCategory, LucideIcon> = {
  national_certification: BadgeCheck,
  certification_exam: ClipboardCheck,
  international_exam: Globe,
  training: GraduationCap,
};

const categoryOf = (key: AchievementCategory) => achievementCategories.find((c) => c.key === key)!;

export function Achievements({ onMeasure }: { onMeasure?: (id: string, y: number) => void }) {
  const { columns } = useBreakpoint();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Achievement | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: achievements.length };
    for (const a of achievements) c[a.category] = (c[a.category] ?? 0) + 1;
    return c;
  }, []);

  // Grouped by issuer, in the order defined in data/achievements.ts; newest first inside a group.
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return achievementCategories
      .filter((c) => filter === 'all' || c.key === filter)
      .map((c) => ({
        ...c,
        items: achievements
          .filter((a) => a.category === c.key)
          .filter(
            (a) =>
              !q ||
              a.title.toLowerCase().includes(q) ||
              (a.organization ?? '').toLowerCase().includes(q) ||
              c.issuer.toLowerCase().includes(q),
          )
          .sort((a, b) => b.year - a.year),
      }))
      .filter((g) => g.items.length > 0);
  }, [filter, query]);

  const basis = columns === 3 ? '31.5%' : columns === 2 ? '48%' : '100%';
  const resultCount = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <Section id="achievements" tone="ivory" onMeasure={onMeasure}>
      <SectionHeader
        id="achievements"
        eyebrow="Achievements & Certifications"
        title="Proof of continuous learning."
        intro="A national qualification, international IT examinations, and Cisco Networking Academy training. Select any card for details."
      />

      <View style={styles.toolbar}>
        <View style={styles.filters} role="tablist" aria-label="Filter achievements">
          <FilterChip label="All" count={counts.all!} active={filter === 'all'} onPress={() => setFilter('all')} />
          {achievementCategories.map((c) => (
            <FilterChip
              key={c.key}
              label={c.short}
              count={counts[c.key] ?? 0}
              active={filter === c.key}
              onPress={() => setFilter(c.key)}
            />
          ))}
        </View>
        <View style={styles.search}>
          <Search size={18} color={colors.plumSoft} strokeWidth={1.8} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search achievements"
            placeholderTextColor={colors.plumSoft}
            accessibilityLabel="Search achievements by name or organization"
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} accessibilityLabel="Clear search" role="button" hitSlop={8}>
              <X size={16} color={colors.plumSoft} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {query ? (
        <Small style={{ marginBottom: space.lg }} aria-live="polite">
          {resultCount} {resultCount === 1 ? 'result' : 'results'} for “{query}”
        </Small>
      ) : null}

      {groups.length === 0 ? (
        <View style={styles.empty}>
          <Search size={28} color={colors.rose} strokeWidth={1.5} />
          <H3>No matching achievements</H3>
          <Small>Try another keyword or category.</Small>
          <Button
            label="Reset filters"
            variant="secondary"
            size="sm"
            onPress={() => {
              setQuery('');
              setFilter('all');
            }}
          />
        </View>
      ) : (
        <View style={{ gap: space.huge }}>
          {groups.map((g, gi) => {
            const Icon = categoryIcon[g.key];
            return (
              <Reveal key={`${g.key}-${filter}`} delay={gi * 60} style={{ gap: space.xl }}>
                <View style={styles.groupHead}>
                  <View style={styles.groupIcon}>
                    <Icon size={22} color={colors.mauve} strokeWidth={1.6} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Eyebrow>{g.kind}</Eyebrow>
                    <Text style={styles.groupIssuer}>{g.issuer}</Text>
                  </View>
                  <Text style={styles.groupCount}>
                    {g.items.length} {g.items.length === 1 ? 'record' : 'records'}
                  </Text>
                </View>
                {g.note ? <Small style={styles.groupNote}>{g.note}</Small> : null}
                <View style={styles.grid}>
                  {g.items.map((a) => (
                    <AchievementCard key={a.id} item={a} basis={basis} onPress={() => setSelected(a)} />
                  ))}
                </View>
              </Reveal>
            );
          })}
        </View>
      )}

      <AchievementDetail item={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

function FilterChip({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="tab"
      aria-selected={active}
      onPress={onPress}
      style={(s) => {
        const { hovered, focused } = s as WebState;
        return [styles.chip, hovered && !active && styles.chipHover, active && styles.chipActive, focused && styles.focused];
      }}
    >
      <Text style={[styles.chipText, active && { color: colors.cream }]}>{label}</Text>
      <Text style={[styles.chipCount, active && { color: colors.blush }]}>{count}</Text>
    </Pressable>
  );
}

function CertificateVisual({ item, height }: { item: Achievement; height: number }) {
  const Icon = categoryIcon[item.category];
  if (item.certificate) {
    return (
      <Image
        source={item.certificate}
        style={{ width: '100%', height }}
        contentFit="cover"
        contentPosition="top"
        alt={`Certificate: ${item.title}`}
        transition={200}
      />
    );
  }
  return (
    <View style={[styles.placeholder, { height }]}>
      <View style={styles.placeholderRing}>
        <Icon size={26} color={colors.mauve} strokeWidth={1.5} />
      </View>
      <Text style={styles.placeholderText}>Certificate preview coming soon</Text>
    </View>
  );
}

function AchievementCard({ item, basis, onPress }: { item: Achievement; basis: string; onPress: () => void }) {
  const cat = categoryOf(item.category);
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${item.title}, ${cat.issuer}, ${item.year}. View details`}
      style={[styles.card, { flexBasis: basis as `${number}%` }]}
    >
      <CertificateVisual item={item} height={140} />
      <View style={styles.cardBody}>
        <View style={styles.cardMeta}>
          <Eyebrow style={styles.cardCategory}>{item.credentialType ?? cat.short}</Eyebrow>
          <Text style={styles.cardYear}>{item.year}</Text>
        </View>
        <H3 numberOfLines={3}>{item.title}</H3>
        {item.organization ? <Small numberOfLines={2}>{item.organization}</Small> : null}
        <View style={styles.cardFooter}>
          {item.result ? <Tag label={item.result} tone="plum" /> : <View />}
          <View style={styles.viewDetails}>
            <Text style={styles.viewDetailsText}>View Details</Text>
            <ArrowRight size={15} color={colors.mauveDeep} strokeWidth={2} />
          </View>
        </View>
      </View>
    </Card>
  );
}

function AchievementDetail({ item, onClose }: { item: Achievement | null; onClose: () => void }) {
  const [zoomOpen, setZoomOpen] = useState(false);
  const cat = item ? categoryOf(item.category) : null;
  return (
    <>
      <Sheet visible={!!item} onClose={onClose} label={item?.title ?? 'Achievement details'}>
        {item && cat ? (
          <View style={{ gap: space.xl }}>
            <View style={{ gap: space.md }}>
              <Eyebrow>
                {cat.issuer} · {cat.kind}
              </Eyebrow>
              <Text style={styles.detailTitle}>{item.title}</Text>
            </View>

            <View style={styles.detailFacts}>
              <DetailFact label="Organization" value={item.organization ?? cat.issuer} />
              <DetailFact label="Year" value={String(item.year)} />
              {item.credentialType ? <DetailFact label="Type" value={item.credentialType} /> : null}
              {item.result ? <DetailFact label="Result" value={item.result} /> : null}
            </View>

            {item.description ? <Body>{item.description}</Body> : null}
            {cat.note ? <Small>{cat.note}</Small> : null}

            <View style={styles.detailPreview}>
              {item.certificate ? (
                <Pressable onPress={() => setZoomOpen(true)} accessibilityLabel="Open certificate in full screen" role="button">
                  <Image
                    source={item.certificate}
                    style={{ width: '100%', aspectRatio: 1.414 }}
                    contentFit="contain"
                    alt={`Certificate: ${item.title}`}
                  />
                  <View style={styles.zoomHint}>
                    <ZoomIn size={16} color={colors.cream} />
                    <Text style={styles.zoomHintText}>View full screen</Text>
                  </View>
                </Pressable>
              ) : (
                <CertificateVisual item={item} height={200} />
              )}
            </View>

            {item.verificationUrl ? (
              <Button
                label="Verify credential"
                icon={ExternalLink}
                variant="secondary"
                onPress={() => openUrl(item.verificationUrl!)}
              />
            ) : null}
          </View>
        ) : null}
      </Sheet>
      {item?.certificate ? <ZoomViewer visible={zoomOpen} onClose={() => setZoomOpen(false)} item={item} /> : null}
    </>
  );
}

function ZoomViewer({ visible, onClose, item }: { visible: boolean; onClose: () => void; item: Achievement }) {
  const { width, height } = useWindowDimensions();
  const [zoomed, setZoomed] = useState(false);
  const w = zoomed ? width * 2 : width;
  const h = zoomed ? height * 2 : height;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.zoomBackdrop}>
        <ScrollView horizontal={zoomed} contentContainerStyle={{ minWidth: width }}>
          <ScrollView contentContainerStyle={{ minHeight: height, alignItems: 'center', justifyContent: 'center' }}>
            <Pressable onPress={() => setZoomed((z) => !z)} accessibilityLabel={zoomed ? 'Zoom out' : 'Zoom in'}>
              <Image
                source={item.certificate}
                style={{ width: w - 32, height: h - 96 }}
                contentFit="contain"
                alt={`Certificate: ${item.title}`}
              />
            </Pressable>
          </ScrollView>
        </ScrollView>
        <View style={styles.zoomControls}>
          <Pressable
            onPress={() => setZoomed((z) => !z)}
            style={styles.zoomBtn}
            accessibilityLabel={zoomed ? 'Zoom out' : 'Zoom in'}
            role="button"
          >
            {zoomed ? <ZoomOut size={20} color={colors.cream} /> : <ZoomIn size={20} color={colors.cream} />}
          </Pressable>
          <Pressable
            onPress={() => {
              setZoomed(false);
              onClose();
            }}
            style={styles.zoomBtn}
            accessibilityLabel="Close full screen"
            role="button"
          >
            <X size={20} color={colors.cream} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function DetailFact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailFact}>
      <Text style={styles.detailFactLabel}>{label}</Text>
      <Text style={styles.detailFactValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.lg,
    marginBottom: space.xxxl,
  },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, flexShrink: 1, maxWidth: '100%' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.cream,
    cursor: 'pointer',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '160ms',
  },
  chipHover: { borderColor: colors.mauve, backgroundColor: colors.blushTint },
  chipActive: { backgroundColor: colors.plum, borderColor: colors.plum },
  chipText: { ...sans('600'), fontSize: 13.5, color: colors.plum },
  chipCount: { ...sans('700'), fontSize: 12, color: colors.mauveDeep },
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep, outlineOffset: 2 } as object,
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.lineStrong,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    minWidth: 200,
    flexGrow: 1,
    maxWidth: 360,
    height: 44,
  },
  searchInput: {
    flex: 1,
    ...sans('500'),
    fontSize: 15,
    color: colors.plum,
    height: '100%',
    ...({ outlineStyle: 'none' } as object),
  },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.blushTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupIssuer: { ...serif('500'), fontSize: 30, lineHeight: 36, color: colors.plum, letterSpacing: -0.5 },
  groupCount: { ...sans('600'), fontSize: 13, color: colors.plumSoft },
  groupNote: { maxWidth: 760, marginTop: -space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xl },
  card: { flexGrow: 0, flexShrink: 1, backgroundColor: colors.cream },
  cardBody: { padding: space.xl, gap: space.sm, flex: 1 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  cardCategory: { fontSize: 10.5, letterSpacing: 1.6, flexShrink: 1 },
  cardYear: { ...serif('500'), fontSize: 16, color: colors.mauve },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: space.md,
  },
  viewDetails: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  viewDetailsText: { ...sans('700'), fontSize: 13.5, color: colors.mauveDeep },
  placeholder: {
    width: '100%',
    backgroundColor: colors.blushTint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  placeholderRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.blush,
  },
  placeholderText: { ...sans('500'), fontSize: 12, color: colors.plumSoft },
  empty: { alignItems: 'center', gap: space.md, paddingVertical: space.huge },
  detailTitle: { ...serif('500'), fontSize: 30, lineHeight: 37, color: colors.plum, letterSpacing: -0.4 },
  detailFacts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingVertical: space.lg,
    rowGap: space.lg,
  },
  detailFact: { minWidth: 140, flexGrow: 1, flexBasis: 140, gap: 4, paddingRight: space.lg },
  detailFactLabel: {
    ...sans('700'),
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.mauveDeep,
  },
  detailFactValue: { ...sans('600'), fontSize: 15, color: colors.plum, lineHeight: 22 },
  detailPreview: { borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.line },
  zoomHint: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.overlay,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  zoomHintText: { ...sans('600'), fontSize: 12, color: colors.cream },
  zoomBackdrop: { flex: 1, backgroundColor: 'rgba(30, 22, 26, 0.94)' },
  zoomControls: { position: 'absolute', top: 16, right: 16, flexDirection: 'row', gap: space.sm },
  zoomBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
