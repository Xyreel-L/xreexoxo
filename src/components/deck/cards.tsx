import type { ComponentType, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CodeXml, FolderGit2, Images, Mail } from '@/components/ui/icons';
import { colors, sans, serif } from '@/theme/tokens';
import { profile } from '@/data/profile';
import { skills } from '@/data/skills';
import { achievements } from '@/data/achievements';
import { projects } from '@/data/projects';
import { gallery } from '@/data/gallery';
import { initials } from '@/utils/text';
import { DARK, LIGHT, TINTED, type Surface } from '@/theme/surface';
import { About } from '@/components/about/About';
import { Skills } from '@/components/skills/Skills';
import { Achievements } from '@/components/achievements/Achievements';
import { Projects } from '@/components/projects/Projects';
import { Gallery } from '@/components/gallery/Gallery';
import { Contact } from '@/components/contact/Contact';

export type DeckCard = {
  id: string;
  title: string;
  /** Card background, also used while the card opens. */
  bg: string;
  /** Text palette used inside the popup, which shares the card colour. */
  surface: Surface;
  Face: ComponentType<{ w: number }>;
  Content: ComponentType;
};

const years = achievements.map((a) => a.year);
const yearSpan = `${Math.min(...years)}–${Math.max(...years)}`;
const featured = projects.find((p) => p.featured) ?? projects[0];

/**
 * Shared card layout: header (index + label) / centre art / footer caption,
 * stacked in a column so nothing can overlap.
 */
function FaceLayout({
  w,
  index,
  label,
  ink,
  caption,
  children,
  background,
}: {
  w: number;
  index: string;
  label: string;
  ink: string;
  caption?: string;
  children: ReactNode;
  background?: ReactNode;
}) {
  const pad = w * 0.08;
  const small = Math.max(8, w * 0.048);
  return (
    <View style={[StyleSheet.absoluteFill, { padding: pad }]}>
      {background}
      <View style={styles.header}>
        <Text style={[styles.index, { color: ink, fontSize: small * 1.35 }]}>{index}</Text>
        <Text style={[styles.label, { color: ink, fontSize: small * 0.85 }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <View style={styles.center}>{children}</View>
      {caption ? (
        <Text style={[styles.caption, { color: ink, fontSize: small * 0.9 }]} numberOfLines={1}>
          {caption}
        </Text>
      ) : (
        <View style={{ height: small }} />
      )}
    </View>
  );
}

function AboutFace({ w }: { w: number }) {
  return (
    <FaceLayout
      w={w}
      index="01"
      label="ABOUT ME"
      ink={colors.blush}
      caption={w < 140 ? undefined : profile.fullName.toUpperCase()}
      background={
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice">
          <Circle cx="82" cy="124" r="40" fill={colors.mauve} opacity={0.3} />
          <Circle cx="14" cy="18" r="22" fill={colors.rose} opacity={0.16} />
        </Svg>
      }
    >
      <Text style={[styles.monogram, { fontSize: w * 0.42 }]}>{initials(profile.fullName)}</Text>
    </FaceLayout>
  );
}

function SkillsFace({ w }: { w: number }) {
  return (
    <FaceLayout w={w} index="02" label="TECH STACK" ink={colors.plum} caption={w < 140 ? `${skills.length} TOOLS` : `${skills.length} TECHNOLOGIES`}>
      <View style={[styles.badge, { width: w * 0.5, height: w * 0.5, borderRadius: w * 0.25 }]}>
        <CodeXml size={w * 0.22} color={colors.rose} strokeWidth={1.6} />
      </View>
    </FaceLayout>
  );
}

function AchievementsFace({ w }: { w: number }) {
  return (
    <FaceLayout w={w} index="03" label="CERTIFICATES" ink={colors.mauveDeep} caption={yearSpan}>
      <Text style={[styles.bigNumber, { fontSize: w * 0.5, lineHeight: w * 0.54 }]}>{achievements.length}</Text>
      <Text style={[styles.sub, { fontSize: Math.max(8, w * 0.06) }]} numberOfLines={1}>
        {w < 140 ? 'certificates' : 'certificates & exams'}
      </Text>
    </FaceLayout>
  );
}

function ProjectsFace({ w }: { w: number }) {
  return (
    <FaceLayout w={w} index="04" label="PROJECTS" ink={colors.plum} caption="FEATURED">
      <FolderGit2 size={w * 0.15} color={colors.mauveDeep} strokeWidth={1.6} />
      <Text style={[styles.projectName, { fontSize: w * 0.17 }]} numberOfLines={1}>
        {featured?.shortName ?? 'Projects'}
      </Text>
    </FaceLayout>
  );
}

function GalleryFace({ w }: { w: number }) {
  return (
    <FaceLayout w={w} index="05" label="GALLERY" ink={colors.plum} caption={`${gallery.length} PHOTOS`}>
      <Images size={w * 0.24} color={colors.mauve} strokeWidth={1.4} />
    </FaceLayout>
  );
}

function ContactFace({ w }: { w: number }) {
  return (
    <FaceLayout
      w={w}
      index={gallery.length ? '06' : '05'}
      label="CONTACT"
      ink={colors.blush}
      caption="SAY HELLO"
      background={
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice">
          {[16, 26, 36, 46].map((r) => (
            <Circle key={r} cx="50" cy="70" r={r} stroke={colors.blush} strokeWidth="0.6" fill="none" opacity={0.4} />
          ))}
        </Svg>
      }
    >
      <Mail size={w * 0.24} color={colors.cream} strokeWidth={1.4} />
    </FaceLayout>
  );
}

/** The deck, left to right. "About" sits in the middle of the fan. */
export const DECK: DeckCard[] = [
  { id: 'skills', title: 'Tech Stack', bg: colors.rose, surface: TINTED, Face: SkillsFace, Content: Skills },
  { id: 'achievements', title: 'Certificates', bg: colors.ivory, surface: LIGHT, Face: AchievementsFace, Content: Achievements },
  { id: 'about', title: 'About Me', bg: colors.plum, surface: DARK, Face: AboutFace, Content: About },
  { id: 'projects', title: 'Projects', bg: colors.blush, surface: TINTED, Face: ProjectsFace, Content: Projects },
  ...(gallery.length ? [{ id: 'gallery', title: 'Gallery', bg: colors.cream, surface: LIGHT, Face: GalleryFace, Content: Gallery }] : []),
  { id: 'contact', title: 'Contact', bg: '#5E4753', surface: DARK, Face: ContactFace, Content: Contact },
];

export const CENTER_ID = 'about';

const styles = StyleSheet.create({
  header: { gap: 2 },
  index: { ...serif('600'), lineHeight: undefined },
  label: { ...sans('700'), letterSpacing: 1.4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  caption: { ...sans('700'), letterSpacing: 1.4, textAlign: 'center' },
  monogram: { ...serif('400'), fontStyle: 'italic', color: colors.cream, letterSpacing: -2 },
  badge: { backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center' },
  bigNumber: { ...serif('500'), color: colors.mauve, letterSpacing: -3 },
  sub: { ...sans('600'), color: colors.plumSoft, textAlign: 'center' },
  projectName: { ...serif('500'), fontStyle: 'italic', color: colors.plum, letterSpacing: -1 },
});
