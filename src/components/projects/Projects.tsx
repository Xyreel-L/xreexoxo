import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { ArrowRight, ExternalLink, FolderGit2 } from '@/components/ui/icons';
import { colors, radius, sans, serif, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { projects } from '@/data/projects';
import type { Project } from '@/types/content';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { Body, Eyebrow, H3, Small } from '@/components/ui/Typography';
import { openUrl } from '@/utils/links';

export function Projects({ onMeasure }: { onMeasure: (id: string, y: number) => void }) {
  const { isDesktop, columns } = useBreakpoint();
  const [selected, setSelected] = useState<Project | null>(null);
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  const basis = columns === 3 ? '31.5%' : columns === 2 ? '48%' : '100%';

  return (
    <Section id="projects" onMeasure={onMeasure}>
      <SectionHeader
        id="projects"
        eyebrow="Projects"
        title="Things I have designed and built."
        intro="Academic and personal software projects — the problems they address, how they work, and what I contributed."
      />

      <View style={{ gap: space.xl }}>
        {featured.map((p) => (
          <Card
            key={p.id}
            onPress={() => setSelected(p)}
            accessibilityLabel={`${p.shortName ?? p.name}. View project details`}
            style={[styles.featured, isDesktop && { flexDirection: 'row' }]}
          >
            <View style={[isDesktop ? { flex: 1, minHeight: 360 } : { height: 240 }]}>
              <ProjectVisual project={p} />
            </View>
            <View style={[styles.featuredBody, isDesktop && { flex: 1 }]}>
              <View style={styles.metaRow}>
                <Tag label="Featured project" tone="plum" />
                {p.status ? <Tag label={p.status} tone="outline" /> : null}
              </View>
              <Text style={styles.featuredName}>{p.shortName ?? p.name}</Text>
              {p.shortName ? <Small style={styles.fullName}>{p.name}</Small> : null}
              <Body>{p.description}</Body>
              {p.technologies.length ? (
                <View style={styles.tags}>
                  {p.technologies.map((t) => (
                    <Tag key={t} label={t} />
                  ))}
                </View>
              ) : null}
              <View style={styles.more}>
                <Text style={styles.moreText}>View project details</Text>
                <ArrowRight size={16} color={colors.mauveDeep} strokeWidth={2} />
              </View>
            </View>
          </Card>
        ))}

        {others.length ? (
          <View style={styles.grid}>
            {others.map((p) => (
              <Card
                key={p.id}
                onPress={() => setSelected(p)}
                accessibilityLabel={`${p.shortName ?? p.name}. View project details`}
                style={[styles.card, { flexBasis: basis as `${number}%` }]}
              >
                <View style={{ height: 190 }}>
                  <ProjectVisual project={p} />
                </View>
                <View style={styles.cardBody}>
                  <H3 numberOfLines={2}>{p.shortName ?? p.name}</H3>
                  <Small numberOfLines={3}>{p.description}</Small>
                  <View style={styles.tags}>
                    {p.technologies.slice(0, 4).map((t) => (
                      <Tag key={t} label={t} />
                    ))}
                  </View>
                </View>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.soon}>
            <FolderGit2 size={20} color={colors.mauve} strokeWidth={1.6} />
            <Small>More projects are on the way.</Small>
          </View>
        )}
      </View>

      <ProjectDetail project={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.thumbnail) {
    return (
      <Image
        source={project.thumbnail}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        alt={`${project.shortName ?? project.name} preview`}
        transition={200}
      />
    );
  }
  const label = project.shortName ?? project.name.split(':')[0];
  return (
    <View style={[StyleSheet.absoluteFill, styles.visual]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 300">
        <Defs>
          <LinearGradient id={`pg-${project.id}`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.plum} />
            <Stop offset="1" stopColor="#5E4753" />
          </LinearGradient>
        </Defs>
        <Rect width="400" height="300" fill={`url(#pg-${project.id})`} />
        <Circle cx="340" cy="250" r="150" fill={colors.rose} opacity={0.22} />
        <Circle cx="40" cy="30" r="90" fill={colors.blush} opacity={0.12} />
      </Svg>
      <Text style={styles.visualText}>{label}</Text>
    </View>
  );
}

function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const p = project;
  return (
    <Sheet visible={!!p} onClose={onClose} label={p?.name ?? 'Project details'} maxWidth={820}>
      {p ? (
        <View style={{ gap: space.xl }}>
          <View style={styles.detailVisual}>
            <ProjectVisual project={p} />
          </View>
          <View style={{ gap: space.sm }}>
            <View style={styles.metaRow}>
              {p.featured ? <Tag label="Featured" tone="plum" /> : null}
              {p.status ? <Tag label={p.status} tone="outline" /> : null}
            </View>
            <Text style={styles.detailTitle}>{p.name}</Text>
          </View>
          <Body>{p.description}</Body>

          <DetailBlock title="The problem" text={p.problem} />
          <DetailBlock title="The solution" text={p.solution} />

          {p.keyFeatures.length ? (
            <View style={{ gap: space.sm }}>
              <Eyebrow>Key features</Eyebrow>
              {p.keyFeatures.map((f) => (
                <Bullet key={f} text={f} />
              ))}
            </View>
          ) : null}

          {p.role || p.contributions?.length ? (
            <View style={{ gap: space.sm }}>
              <Eyebrow>My role{p.role ? ` · ${p.role}` : ''}</Eyebrow>
              {p.contributions?.map((c) => <Bullet key={c} text={c} />)}
            </View>
          ) : null}

          {p.technologies.length ? (
            <View style={{ gap: space.sm }}>
              <Eyebrow>Built with</Eyebrow>
              <View style={styles.tags}>
                {p.technologies.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </View>
            </View>
          ) : null}

          {!p.problem && !p.solution && !p.keyFeatures.length ? (
            <View style={styles.pending}>
              <Small>A full case study for this project is being prepared.</Small>
            </View>
          ) : null}

          {p.githubUrl || p.liveUrl ? (
            <View style={styles.actions}>
              {p.liveUrl ? (
                <Button label="Visit live site" icon={ExternalLink} onPress={() => openUrl(p.liveUrl!)} />
              ) : null}
              {p.githubUrl ? (
                <Button label="View repository" variant="secondary" onPress={() => openUrl(p.githubUrl!)} />
              ) : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </Sheet>
  );
}

function DetailBlock({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <View style={{ gap: space.sm }}>
      <Eyebrow>{title}</Eyebrow>
      <Body>{text}</Body>
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bullet}>
      <View style={styles.bulletDot} />
      <Body style={{ flex: 1 }}>{text}</Body>
    </View>
  );
}


const styles = StyleSheet.create({
  featured: { backgroundColor: colors.ivory },
  featuredBody: { padding: space.xxl, gap: space.lg, justifyContent: 'center' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  featuredName: { ...serif('500'), fontSize: 40, lineHeight: 46, color: colors.plum, letterSpacing: -0.8 },
  fullName: { fontSize: 14, lineHeight: 21, marginTop: -space.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  more: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: space.sm },
  moreText: { ...sans('700'), fontSize: 14, color: colors.mauveDeep },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xl },
  card: { flexGrow: 0, flexShrink: 1 },
  cardBody: { padding: space.xl, gap: space.sm },
  soon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    alignSelf: 'flex-start',
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.lineStrong,
  },
  visual: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  visualText: { ...serif('500'), fontStyle: 'italic', fontSize: 54, color: colors.cream, letterSpacing: -1 },
  detailVisual: { height: 220, borderRadius: radius.md, overflow: 'hidden' },
  detailTitle: { ...serif('500'), fontSize: 26, lineHeight: 34, color: colors.plum, letterSpacing: -0.3 },
  bullet: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  bulletDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.rose, marginTop: 11 },
  pending: {
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
});
