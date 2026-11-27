import { useEffect } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { X } from '@/components/ui/icons';
import { colors, radius, shadow, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { LIGHT, SurfaceContext } from '@/theme/surface';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  label: string;
  maxWidth?: number;
};

/**
 * Accessible modal: centered dialog on desktop, bottom sheet on phones.
 * Closes on backdrop press, the close button, and Escape (web).
 */
export function Sheet({ visible, onClose, children, label, maxWidth = 760 }: Props) {
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (Platform.OS !== 'web' || !visible) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [visible, onClose]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile ? 'slide' : 'fade'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={[styles.backdrop, isMobile && styles.backdropMobile]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Close dialog"
          role="button"
        />
        <View
          role="dialog"
          aria-modal
          aria-label={label}
          style={[
            styles.panel,
            isMobile ? styles.panelMobile : { maxWidth, width: '92%' },
          ]}
        >
          <Pressable
            onPress={onClose}
            accessibilityLabel="Close"
            role="button"
            style={styles.close}
            hitSlop={8}
          >
            <X size={20} color={colors.plum} strokeWidth={1.8} />
          </Pressable>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <SurfaceContext.Provider value={LIGHT}>{children}</SurfaceContext.Provider>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.lg,
  },
  backdropMobile: { justifyContent: 'flex-end', padding: 0 },
  panel: {
    backgroundColor: colors.ivory,
    borderRadius: radius.xl,
    maxHeight: '88%',
    overflow: 'hidden',
    ...shadow.lifted,
  },
  panelMobile: {
    width: '100%',
    maxHeight: '92%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  scroll: { padding: space.xxl, paddingTop: space.xxxl + 8 },
  close: {
    position: 'absolute',
    top: space.lg,
    right: space.lg,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
});
