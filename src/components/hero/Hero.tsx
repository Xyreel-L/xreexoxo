import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { ArrowRight, Award, Download, Mail } from '@/components/ui/icons';
import { colors, layout, radius, sans, serif, shadow, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { profile } from '@/data/profile';
import { achievements } from '@/data/achievements';
import { Button } from '@/components/ui/Button';
import { Body, Display, Eyebrow } from '@/components/ui/Typography';
import { Container } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { IconLink } from '@/components/ui/IconLink';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { downloadFile, mailto } from '@/utils/links';
import type { SectionId } from '@/constants/navigation';

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]!.toUpperCase())
    .slice(0, 2)
    .join('');
}

export function Hero({
  onNavigate,
  onMeasure,
}: {
  onNavigate: (id: SectionId) => void;
  onMeasure: (id: string, y: number) => void;
}) {
  const { isDesktop, isMobile } = useBreakpoint();
  const years = achievements.map((a) => a.year);
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <View
      nativeID="home"
      onLayout={(e) => onMeasure('home', e.nativeEvent.layout.y)}
      style={[styles.wrap, { paddingTop: layout.navHeight + (isMobile ? space.xxxl : space.huge) }]}
    >
      <Container style={[styles.grid, isDesktop ? styles.gridRow : styles.gridCol]}>
        <View style={[styles.copy, isDesktop && { flex: 1.15 }]}>
          <Reveal>
            {profile.availableForOjt ? (
              <View style={styles.status}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Open to OJT opportunities</Text>
              </View>
            ) : null}
          </Reveal>

          <Reveal delay={80}>
            <Eyebrow style={styles.eyebrow}>{profile.professionalTitle}</Eyebrow>
          </Reveal>

          <Reveal delay={160}>
            <Display>
              {profile.fullName.split(' ').slice(0, -1).join(' ')}{' '}
              <Text style={styles.nameAccent}>{profile.fullName.split(' ').slice(-1)}</Text>
            </Display>
          </Reveal>

          <Reveal delay={240}>
            <Body style={styles.tagline}>{profile.tagline}</Body>
          </Reveal>

          <Reveal delay={320} style={styles.ctas}>
            <Button
              label="Explore My Work"
              icon={ArrowRight}
              iconPosition="right"
              onPress={() => onNavigate('projects')}
            />
            <Button
              label="View Achievements"
              variant="secondary"
              icon={Award}
              onPress={() => onNavigate('achievements')}
            />
            {profile.resumeUrl ? (
              <Button
                label="Download Resume"
                variant="ghost"
                icon={Download}
                onPress={() => downloadFile(profile.resumeUrl!, `${profile.fullName.replace(/\s+/g, '-')}-Resume.pdf`)}
              />
            ) : null}
          </Reveal>

          <Reveal delay={400} style={styles.socials}>
            {profile.githubUrl ? (
              <IconLink url={profile.githubUrl} label="GitHub profile">
                <GithubIcon />
              </IconLink>
            ) : null}
            {profile.linkedinUrl ? (
              <IconLink url={profile.linkedinUrl} label="LinkedIn profile">
                <LinkedinIcon />
              </IconLink>
            ) : null}
            <IconLink url={mailto(profile.email)} label={`Email ${profile.email}`}>
              <Mail size={18} color={colors.plum} strokeWidth={1.8} />
            </IconLink>
          </Reveal>
        </View>

        <Reveal delay={200} style={[styles.visualWrap, isDesktop && { flex: 0.85 }]}>
          <Portrait size={isMobile ? 280 : isDesktop ? 400 : 340} />
          <View style={[styles.floatCard, isMobile ? styles.floatCardMobile : styles.floatCardDesk]}>
            <Text style={styles.floatNumber}>{achievements.length}</Text>
            <View>
              <Text style={styles.floatLabel}>certifications, exams</Text>
              <Text style={styles.floatLabel}>& courses · {span}</Text>
            </View>
          </View>
        </Reveal>
      </Container>
    </View>
  );
}

function Portrait({ size }: { size: number }) {
  const w = size;
  const h = size * 1.2;
  return (
    <View style={[styles.arch, { width: w, height: h, borderTopLeftRadius: w / 2, borderTopRightRadius: w / 2 }]}>
      {profile.photo ? (
        <Image
          source={profile.photo}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          alt={`Portrait of ${profile.fullName}`}
          accessibilityLabel={`Portrait of ${profile.fullName}`}
          priority="high"
        />
      ) : (
        <>
          <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="heroGrad" x1="0" y1="0" x2="0.4" y2="1">
                <Stop offset="0" stopColor={colors.blush} />
                <Stop offset="1" stopColor={colors.rose} />
              </LinearGradient>
            </Defs>
            <Rect width={w} height={h} fill="url(#heroGrad)" />
            <Circle cx={w * 0.82} cy={h * 0.78} r={w * 0.42} fill={colors.ivory} opacity={0.18} />
            <Circle cx={w * 0.1} cy={h * 0.25} r={w * 0.22} fill={colors.ivory} opacity={0.14} />
          </Svg>
          <Text
            style={[styles.portraitInitials, { fontSize: w * 0.36 }]}
            accessibilityLabel={`${profile.fullName} monogram`}
          >
            {initials(profile.fullName)}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.cream, paddingBottom: space.giant, overflow: 'hidden' },
  grid: { gap: space.xxxl + 8 },
  gridRow: { flexDirection: 'row', alignItems: 'center' },
  gridCol: { flexDirection: 'column' },
  copy: { gap: space.xl },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mauve },
  statusText: { ...sans('600'), fontSize: 13, color: colors.plum },
  eyebrow: { lineHeight: 20 },
  nameAccent: { ...serif('500'), fontStyle: 'italic', color: colors.mauve },
  tagline: { fontSize: 19, lineHeight: 31, maxWidth: 540, color: colors.plumSoft },
  ctas: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.sm },
  socials: { flexDirection: 'row', gap: space.md },
  visualWrap: { alignItems: 'center', justifyContent: 'center' },
  arch: {
    overflow: 'hidden',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blush,
    ...shadow.soft,
  },
  portraitInitials: { ...serif('400'), color: colors.ivory, fontStyle: 'italic', letterSpacing: -2 },
  floatCard: {
    position: 'absolute',
    backgroundColor: colors.ivory,
    borderRadius: radius.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.lifted,
  },
  floatCardDesk: { bottom: 36, left: -8 },
  floatCardMobile: { bottom: -18, left: 8 },
  floatNumber: { ...serif('500'), fontSize: 34, color: colors.mauve, lineHeight: 38 },
  floatLabel: { ...sans('600'), fontSize: 12.5, color: colors.plum, lineHeight: 17 },
});
