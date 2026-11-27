import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { ArrowRight, Award, Download, Mail } from '@/components/ui/icons';
import { colors, layout, radius, sans, serif, shadow, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { profile } from '@/data/profile';
import { Button } from '@/components/ui/Button';
import { Body, Eyebrow } from '@/components/ui/Typography';
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
  const { isDesktop, isMobile, isTablet } = useBreakpoint();
  const nameSize = isMobile ? 64 : isTablet ? 92 : 118;
  const parts = profile.fullName.split(' ');
  const first = parts.slice(0, -1).join(' ');
  const last = parts.slice(-1)[0];

  return (
    <View
      nativeID="home"
      onLayout={(e) => onMeasure('home', e.nativeEvent.layout.y)}
      style={[styles.wrap, { paddingTop: layout.navHeight + (isMobile ? space.xxxl : space.huge) }]}
    >
      <Container style={[styles.grid, isDesktop ? styles.gridRow : styles.gridCol]}>
        <View style={[styles.copy, isDesktop && { flex: 1.2 }]}>
          <Reveal>
            {profile.availableForOjt ? (
              <View style={styles.status}>
                <View style={styles.pulseWrap}>
                  <View style={[styles.pulse, pulseAnim]} />
                  <View style={styles.statusDot} />
                </View>
                <Text style={styles.statusText}>Open to OJT opportunities</Text>
              </View>
            ) : null}
          </Reveal>

          <Reveal delay={80}>
            <Eyebrow style={styles.eyebrow}>{profile.professionalTitle}</Eyebrow>
          </Reveal>

          <Reveal delay={160}>
            <Text
              role="heading"
              aria-level={1}
              style={[styles.name, { fontSize: nameSize, lineHeight: nameSize * 0.98 }]}
            >
              {first}
              {'\n'}
              <Text style={styles.nameAccent}>{last}</Text>
            </Text>
          </Reveal>

          <Reveal delay={240}>
            <Body style={styles.tagline}>{profile.tagline}</Body>
          </Reveal>

          <Reveal delay={300}>
            <RotatingInterest items={profile.technicalInterests} />
          </Reveal>

          <Reveal delay={360} style={styles.ctas}>
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
                onPress={() =>
                  downloadFile(profile.resumeUrl!, `${profile.fullName.replace(/\s+/g, '-')}-Resume.pdf`)
                }
              />
            ) : null}
          </Reveal>

          <Reveal delay={420} style={styles.socials}>
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

        <Reveal delay={200} style={[styles.visualWrap, isDesktop && { flex: 0.8 }]}>
          <Portrait size={isMobile ? 280 : isDesktop ? 400 : 340} />
        </Reveal>
      </Container>
    </View>
  );
}

/** "Currently exploring — <interest>", cycling every few seconds. */
function RotatingInterest({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (items.length < 2) return;
    let swap: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setVisible(false);
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 320);
    }, 2600);
    return () => {
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, [items.length]);

  if (!items.length) return null;
  return (
    <View style={styles.rotating} aria-live="polite">
      <Text style={styles.rotatingLabel}>Currently exploring</Text>
      <View style={styles.rotatingRule} />
      <Text style={[styles.rotatingWord, !visible && styles.rotatingHidden]}>{items[index]}</Text>
    </View>
  );
}

/** Arch portrait that tilts gently toward the cursor (web, pointer devices). */
function Portrait({ size }: { size: number }) {
  const w = size;
  const h = size * 1.2;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (!window.matchMedia?.('(pointer: fine)').matches) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        setTilt({ x, y });
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const archStyle: ViewStyle = {
    width: w,
    height: h,
    borderTopLeftRadius: w / 2,
    borderTopRightRadius: w / 2,
    transform: [{ translateX: tilt.x * -8 }, { translateY: tilt.y * -6 }],
  };

  return (
    <View style={{ width: w + 40, height: h + 40, alignItems: 'center', justifyContent: 'center' }}>
      {/* soft offset outline behind the arch */}
      <View
        style={[
          styles.archOutline,
          {
            width: w,
            height: h,
            borderTopLeftRadius: w / 2,
            borderTopRightRadius: w / 2,
            transform: [{ translateX: 18 + tilt.x * 10 }, { translateY: 18 + tilt.y * 8 }],
          },
        ]}
      />
      <View style={[styles.arch, styles.smooth, archStyle]}>
        {profile.photo ? (
          <Image
            source={profile.photo}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            contentPosition="top"
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
    </View>
  );
}

const pulseAnim = {
  animationKeyframes: [
    { '0%': { opacity: 0.55, transform: [{ scale: 1 }] }, '100%': { opacity: 0, transform: [{ scale: 2.6 }] } },
  ],
  animationDuration: '1.8s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'ease-out',
} as object as ViewStyle;

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
  pulseWrap: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mauve },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mauve },
  statusText: { ...sans('600'), fontSize: 13, color: colors.plum },
  eyebrow: { lineHeight: 20 },
  name: { ...serif('500'), color: colors.plum, letterSpacing: -2.5 },
  nameAccent: { ...serif('500'), fontStyle: 'italic', color: colors.mauve, letterSpacing: -2 },
  tagline: { fontSize: 19, lineHeight: 31, maxWidth: 540, color: colors.plumSoft },
  rotating: { flexDirection: 'row', alignItems: 'center', gap: space.md, flexWrap: 'wrap' },
  rotatingLabel: {
    ...sans('700'),
    fontSize: 11.5,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.plumSoft,
  },
  rotatingRule: { width: 24, height: 1.5, backgroundColor: colors.rose },
  rotatingWord: {
    ...serif('500'),
    fontStyle: 'italic',
    fontSize: 22,
    color: colors.mauveDeep,
    transitionProperty: 'opacity, transform',
    transitionDuration: '300ms',
  },
  rotatingHidden: { opacity: 0, transform: [{ translateY: 8 }] },
  ctas: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md, marginTop: space.sm },
  socials: { flexDirection: 'row', gap: space.md },
  visualWrap: { alignItems: 'center', justifyContent: 'center' },
  archOutline: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: colors.rose,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    transitionProperty: 'transform',
    transitionDuration: '500ms',
    transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  },
  arch: {
    overflow: 'hidden',
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blush,
    ...shadow.soft,
  },
  smooth: {
    transitionProperty: 'transform',
    transitionDuration: '400ms',
    transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
  },
  portraitInitials: { ...serif('400'), color: colors.ivory, fontStyle: 'italic', letterSpacing: -2 },
});
