import { useCallback, useEffect, useState } from 'react';
import { ImageStyle, Modal, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from '@/components/ui/icons';
import { colors, radius, sans, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { gallery } from '@/data/gallery';
import { Section, SectionHeader } from '@/components/ui/Section';

/** Photo gallery with a full-screen lightbox. Renders nothing until photos are added. */
export function Gallery({ onMeasure }: { onMeasure?: (id: string, y: number) => void }) {
  const { columns } = useBreakpoint();
  const [open, setOpen] = useState<number | null>(null);

  if (gallery.length === 0) return null;

  const basis = columns === 3 ? '31.5%' : columns === 2 ? '48%' : '100%';

  return (
    <Section id="gallery" onMeasure={onMeasure}>
      <SectionHeader id="gallery" eyebrow="Gallery" title="Moments along the way." />

      <View style={styles.grid}>
        {gallery.map((p, i) => (
          <Tile key={p.id} index={i} basis={basis} onOpen={() => setOpen(i)} />
        ))}
      </View>

      <Lightbox index={open} onChange={setOpen} />
    </Section>
  );
}

function Tile({ index, basis, onOpen }: { index: number; basis: string; onOpen: () => void }) {
  const p = gallery[index]!;
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      role="button"
      accessibilityLabel={`Open photo: ${p.caption ?? p.alt}`}
      onPress={onOpen}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={[
        styles.tile,
        { flexBasis: basis as `${number}%`, aspectRatio: p.orientation === 'landscape' ? 4 / 3 : 4 / 5 },
      ]}
    >
      <Image
        source={p.image}
        style={[StyleSheet.absoluteFill, tileImage, hover && tileImageHover]}
        contentFit="cover"
        contentPosition="top"
        alt={p.alt}
        transition={250}
      />
      <View style={[styles.tileOverlay, hover && { opacity: 1 }]}>
        <ZoomIn size={20} color={colors.cream} />
        {p.caption ? <Text style={styles.tileCaption}>{p.caption}</Text> : null}
      </View>
    </Pressable>
  );
}

function Lightbox({ index, onChange }: { index: number | null; onChange: (i: number | null) => void }) {
  const { width, height } = useWindowDimensions();
  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onChange((index + d + gallery.length) % gallery.length);
    },
    [index, onChange],
  );

  useEffect(() => {
    if (Platform.OS !== 'web' || index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, close, step]);

  const p = index !== null ? gallery[index] : null;

  return (
    <Modal visible={!!p} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop} role="dialog" aria-modal aria-label="Photo viewer">
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Close photo viewer" />
        {p ? (
          <View style={styles.stage} pointerEvents="box-none">
            <Image
              source={p.image}
              style={{ width: Math.min(width - 48, 1100), height: height - 180 }}
              contentFit="contain"
              alt={p.alt}
            />
            <View style={styles.captionRow}>
              {p.caption ? <Text style={styles.caption}>{p.caption}</Text> : null}
              <Text style={styles.counter}>
                {index! + 1} / {gallery.length}
              </Text>
            </View>
          </View>
        ) : null}

        <Pressable onPress={close} style={[styles.ctrl, styles.closeBtn]} accessibilityLabel="Close" role="button">
          <X size={22} color={colors.cream} />
        </Pressable>
        {gallery.length > 1 ? (
          <>
            <Pressable onPress={() => step(-1)} style={[styles.ctrl, styles.prev]} accessibilityLabel="Previous photo" role="button">
              <ChevronLeft size={24} color={colors.cream} />
            </Pressable>
            <Pressable onPress={() => step(1)} style={[styles.ctrl, styles.next]} accessibilityLabel="Next photo" role="button">
              <ChevronRight size={24} color={colors.cream} />
            </Pressable>
          </>
        ) : null}
      </View>
    </Modal>
  );
}

const tileImage = { transitionProperty: 'transform', transitionDuration: '500ms' } as ImageStyle;
const tileImageHover: ImageStyle = { transform: [{ scale: 1.05 }] };

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xl, alignItems: 'flex-start' },
  tile: {
    flexGrow: 0,
    flexShrink: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.blushTint,
    ...({ cursor: 'zoom-in' } as object),
  },
  tileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    padding: space.lg,
    gap: space.sm,
    backgroundColor: 'rgba(64, 51, 58, 0.35)',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '250ms',
  },
  tileCaption: { ...sans('600'), fontSize: 14, color: colors.cream },
  backdrop: { flex: 1, backgroundColor: 'rgba(30, 22, 26, 0.95)', alignItems: 'center', justifyContent: 'center' },
  stage: { alignItems: 'center', gap: space.lg },
  captionRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  caption: { ...sans('600'), fontSize: 15, color: colors.cream },
  counter: { ...sans('500'), fontSize: 13, color: colors.blush },
  ctrl: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  closeBtn: { top: 20, right: 20 },
  prev: { left: 20, top: '50%' },
  next: { right: 20, top: '50%' },
});
