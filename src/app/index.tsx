import { useCallback, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import type { ScrollViewInstance } from 'react-native';
import { colors, layout } from '@/theme/tokens';
import { NAV_ITEMS, type SectionId } from '@/constants/navigation';
import { profile } from '@/data/profile';
import { NavBar } from '@/components/navigation/NavBar';
import { BackToTop } from '@/components/navigation/BackToTop';
import { Hero, initials } from '@/components/hero/Hero';
import { About } from '@/components/about/About';
import { Skills } from '@/components/skills/Skills';
import { Achievements } from '@/components/achievements/Achievements';
import { Projects } from '@/components/projects/Projects';
import { Gallery } from '@/components/gallery/Gallery';
import { Contact } from '@/components/contact/Contact';

export default function Home() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const offsets = useRef<Record<string, number>>({});
  const [active, setActive] = useState<SectionId>('home');
  const [scrollY, setScrollY] = useState(0);
  const [progress, setProgress] = useState(0);

  const onMeasure = useCallback((id: string, y: number) => {
    offsets.current[id] = y;
  }, []);

  const navigate = useCallback((id: SectionId) => {
    const y = offsets.current[id] ?? 0;
    scrollRef.current?.scrollTo({ y: id === 'home' ? 0 : Math.max(0, y - layout.navHeight + 1), animated: true });
  }, []);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
    const y = contentOffset.y;
    const max = Math.max(1, contentSize.height - layoutMeasurement.height);
    setScrollY(y);
    setProgress(Math.min(1, Math.max(0, y / max)));

    // At the very bottom the last section is active even if it is short.
    if (y + layoutMeasurement.height >= contentSize.height - 4) {
      setActive('contact');
      return;
    }
    const probe = y + layout.navHeight + layoutMeasurement.height * 0.3;
    let current: SectionId = 'home';
    for (const item of NAV_ITEMS) {
      const top = offsets.current[item.id];
      if (top !== undefined && top <= probe) current = item.id;
    }
    setActive((prev) => (prev === current ? prev : current));
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.root}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View role="main">
          <Hero onNavigate={navigate} onMeasure={onMeasure} />
          <About onMeasure={onMeasure} />
          <Skills onMeasure={onMeasure} />
          <Achievements onMeasure={onMeasure} />
          <Projects onMeasure={onMeasure} />
          <Gallery onMeasure={onMeasure} />
          <Contact onMeasure={onMeasure} />
        </View>
      </ScrollView>
      <NavBar
        active={active}
        scrolled={scrollY > 12}
        progress={progress}
        onNavigate={navigate}
        monogram={initials(profile.fullName)}
      />
      <BackToTop visible={scrollY > 700} onPress={() => navigate('home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
});
