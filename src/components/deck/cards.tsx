import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { CodeXml, FolderGit2, Mail } from '@/components/ui/icons';
import { colors, sans, serif } from '@/theme/tokens';
import { profile } from '@/data/profile';
import { skills } from '@/data/skills';
import { achievements } from '@/data/achievements';
import { projects } from '@/data/projects';
import { gallery } from '@/data/gallery';
import { initials } from '@/utils/text';
import { About } from '@/components/about/About';
import { Skills } from '@/components/skills/Skills';
import { Achievements } from '@/components/achievements/Achievements';
import { Projects } from '@/components/projects/Projects';
import { Gallery } from '@/components/gallery/Gallery';
import { Contact } from '@/components/contact/Contact';

export type DeckCard = {
  id: string;
  title: string;
  /** Card background, also used while the card expands. */
  bg: string;
  /** Text/ink colour on the card face. */
  ink: string;
  Face: ComponentType<{ w: number }>;
  Content: ComponentType;
};

const years = achievements.map((a) => a.year);
const yearSpan = `${Math.min(...years)}–${Math.max(...years)}`;
const featured = projects.find((p) => p.featured) ?? projects[0];

/** Playing-card corner marks: index + label top-left, mirrored bottom-right. */
function Corners({ index, label, ink, w }: { index: string; label: string; ink: string; w: number }) {
  const size = Math.max(9, w * 0.05);
  const mark = (
    <View style={{ gap: 2 }}>
      <Text style={[styles.cornerIndex, { color: ink, fontSize: size * 1.25 }]}>{index}</Text>
      <Text style={[styles.cornerLabel, { color: ink, fontSize: size * 0.82 }]}>{label}</Text>
    </View>
  );
  return (
    <>
      <View style={[styles.cornerTL, { top: w * 0.07, left: w * 0.08 }]}>{mark}</View>
      <View style={[styles.cornerBR, { bottom: w * 0.07, right: w * 0.08 }]}>{mark}</View>
    </>
  );
}

function AboutFace({ w }: { w: number }) {
  return (
    <View style={styles.fill}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice">
        <Circle cx="78" cy="118" r="46" fill={colors.mauve} opacity={0.35} />
        <Circle cx="18" cy="22" r="26" fill={colors.rose} opacity={0.18} />
      </Svg>
      <Corners index="01" label="ME" ink={colors.blush} w={w} />
      <Text style={[styles.monogram, { fontSize: w * 0.46 }]}>{initials(profile.fullName)}</Text>
      {w >= 150 ? <Text style={[styles.faceCaption, { color: colors.blush, fontSize: Math.max(9, w * 0.06), bottom: w * 0.2 }]}>
        {profile.fullName.toUpperCase()}
      </Text> : null}
    </View>
  );
}

function SkillsFace({ w }: { w: number }) {
  return (
    <View style={styles.fill}>
      <Corners index="02" label="STACK" ink={colors.plum} w={w} />
      <View style={[styles.badge, { width: w * 0.52, height: w * 0.52, borderRadius: w * 0.26 }]}>
        <CodeXml size={w * 0.24} color={colors.rose} strokeWidth={1.6} />
      </View>
      {w >= 150 ? <Text style={[styles.faceCaption, { color: colors.plum, fontSize: Math.max(9, w * 0.06), bottom: w * 0.2 }]}>
        TECH STACK · {skills.length}
      </Text> : null}
    </View>
  );
}

function AchievementsFace({ w }: { w: number }) {
  return (
    <View style={styles.fill}>
      <Corners index="03" label="AWARDS" ink={colors.mauveDeep} w={w} />
      <Text style={[styles.bigNumber, { fontSize: w * 0.56, lineHeight: w * 0.6 }]}>{achievements.length}</Text>
      {w >= 150 ? (
        <Text style={[styles.faceSub, { fontSize: Math.max(9, w * 0.065) }]}>certifications{'\n'}& examinations</Text>
      ) : null}
      {w >= 150 ? <Text style={[styles.faceCaption, { color: colors.mauveDeep, fontSize: Math.max(9, w * 0.06), bottom: w * 0.2 }]}>
        {yearSpan}
      </Text> : null}
    </View>
  );
}

function ProjectsFace({ w }: { w: number }) {
  return (
    <View style={styles.fill}>
      <Corners index="04" label="WORK" ink={colors.plum} w={w} />
      <FolderGit2 size={w * 0.14} color={colors.mauveDeep} strokeWidth={1.6} />
      <Text style={[styles.projectName, { fontSize: w * 0.19 }]} numberOfLines={1} adjustsFontSizeToFit>
        {featured?.shortName ?? 'Projects'}
      </Text>
      {w >= 150 ? <Text style={[styles.faceCaption, { color: colors.plum, fontSize: Math.max(9, w * 0.06), bottom: w * 0.2 }]}>
        FEATURED PROJECT
      </Text> : null}
    </View>
  );
}

function GalleryFace({ w }: { w: number }) {
  return (
    <View style={styles.fill}>
      <Corners index="05" label="PHOTOS" ink={colors.plum} w={w} />
      <Text style={[styles.monogram, { color: colors.plum, fontSize: w * 0.3 }]}>{gallery.length}</Text>
      {w >= 150 ? <Text style={[styles.faceCaption, { color: colors.plum, fontSize: Math.max(9, w * 0.06), bottom: w * 0.2 }]}>
        GALLERY
      </Text> : null}
    </View>
  );
}

function ContactFace({ w }: { w: number }) {
  return (
    <View style={styles.fill}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill} viewBox="0 0 100 140" preserveAspectRatio="xMidYMid slice">
        {[14, 24, 34, 44].map((r) => (
          <Circle key={r} cx="50" cy="70" r={r} stroke={colors.blush} strokeWidth="0.6" fill="none" opacity={0.5} />
        ))}
      </Svg>
      <Corners index={gallery.length ? '06' : '05'} label="HELLO" ink={colors.blush} w={w} />
      <Mail size={w * 0.2} color={colors.cream} strokeWidth={1.4} />
      <Text style={[styles.sayHello, { fontSize: w * 0.13 }]}>Say hello</Text>
    </View>
  );
}

/** The deck, left to right. "About" sits in the middle of the fan. */
export const DECK: DeckCard[] = [
  { id: 'skills', title: 'Tech Stack', bg: colors.rose, ink: colors.plum, Face: SkillsFace, Content: Skills },
  { id: 'achievements', title: 'Achievements', bg: colors.ivory, ink: colors.plum, Face: AchievementsFace, Content: Achievements },
  { id: 'about', title: 'About Me', bg: colors.plum, ink: colors.cream, Face: AboutFace, Content: About },
  { id: 'projects', title: 'Projects', bg: colors.blush, ink: colors.plum, Face: ProjectsFace, Content: Projects },
  ...(gallery.length
    ? [{ id: 'gallery', title: 'Gallery', bg: colors.cream, ink: colors.plum, Face: GalleryFace, Content: Gallery }]
    : []),
  { id: 'contact', title: 'Contact', bg: '#5E4753', ink: colors.cream, Face: ContactFace, Content: Contact },
];

export const CENTER_ID = 'about';

const styles = StyleSheet.create({
  fill: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 6 } as object,
  cornerTL: { position: 'absolute' },
  cornerBR: { position: 'absolute', transform: [{ rotate: '180deg' }] },
  cornerIndex: { ...serif('600'), lineHeight: 16 },
  cornerLabel: { ...sans('700'), letterSpacing: 1.4 },
  monogram: { ...serif('400'), fontStyle: 'italic', color: colors.cream, letterSpacing: -2 },
  faceCaption: { ...sans('700'), position: 'absolute', letterSpacing: 1.6, textAlign: 'center' },
  badge: { backgroundColor: colors.ivory, alignItems: 'center', justifyContent: 'center' },
  bigNumber: { ...serif('500'), color: colors.mauve, letterSpacing: -3 },
  faceSub: { ...sans('600'), color: colors.plumSoft, textAlign: 'center', lineHeight: 16 },
  projectName: { ...serif('500'), fontStyle: 'italic', color: colors.plum, letterSpacing: -1, paddingHorizontal: 10 },
  sayHello: { ...serif('500'), fontStyle: 'italic', color: colors.cream },
});
