import { useState } from 'react';
import { Pressable, PressableStateCallbackType, StyleSheet, Text, View } from 'react-native';
import { Menu, X } from '@/components/ui/icons';
import { colors, layout, radius, sans, serif, shadow, space } from '@/theme/tokens';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { NAV_ITEMS, type SectionId } from '@/constants/navigation';


type WebState = PressableStateCallbackType & { hovered?: boolean; focused?: boolean };

type Props = {
  active: SectionId;
  scrolled: boolean;
  onNavigate: (id: SectionId) => void;
  monogram: string;
  /** 0–1 page scroll progress, drawn as a thin bar under the nav. */
  progress: number;
};

export function NavBar({ active, scrolled, onNavigate, monogram, progress }: Props) {
  const { isDesktop } = useBreakpoint();
  const [open, setOpen] = useState(false);

  const go = (id: SectionId) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <View
      role="navigation"
      aria-label="Main"
      style={[styles.bar, (scrolled || open) && styles.barScrolled]}
    >
      <View style={styles.inner}>
        <Pressable
          onPress={() => go('home')}
          accessibilityLabel="Back to top"
          role="link"
          style={styles.brand}
        >
          <View style={styles.monogram}>
            <Text style={styles.monogramText}>{monogram}</Text>
          </View>
        </Pressable>

        {isDesktop ? (
          <View style={styles.links}>
            {NAV_ITEMS.filter((i) => i.id !== 'home').map((item) => (
              <NavLink
                key={item.id}
                label={item.label}
                active={active === item.id}
                onPress={() => go(item.id)}
              />
            ))}
          </View>
        ) : (
          <Pressable
            onPress={() => setOpen((v) => !v)}
            accessibilityLabel={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            role="button"
            style={styles.menuButton}
          >
            {open ? (
              <X size={22} color={colors.plum} strokeWidth={1.8} />
            ) : (
              <Menu size={22} color={colors.plum} strokeWidth={1.8} />
            )}
          </Pressable>
        )}
      </View>

      <View style={styles.progressTrack} aria-hidden>
        <View style={[styles.progressBar, { transform: [{ scaleX: progress }] }]} />
      </View>

      {!isDesktop && open ? (
        <View style={styles.drawer}>
          {NAV_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => go(item.id)}
              role="link"
              style={styles.drawerItem}
            >
              <Text style={[styles.drawerText, active === item.id && { color: colors.mauveDeep }]}>
                {item.label}
              </Text>
              {active === item.id ? <View style={styles.drawerDot} /> : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function NavLink({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      role="link"
      aria-current={active ? 'location' : undefined}
      style={(s) => {
        const { hovered, focused } = s as WebState;
        return [styles.link, (hovered || active) && styles.linkHover, focused && styles.focused];
      }}
    >
      <Text style={[styles.linkText, active && styles.linkTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  progressTrack: { position: 'absolute', left: 0, right: 0, top: layout.navHeight - 2, height: 2, overflow: 'hidden' },
  progressBar: {
    height: 2,
    width: '100%',
    backgroundColor: colors.mauve,
    transformOrigin: 'left',
  } as object,
  bar: {
    // @ts-expect-error web-only positioning
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '250ms',
  },
  barScrolled: {
    backgroundColor: 'rgba(247, 237, 227, 0.94)',
    borderBottomColor: colors.line,
    backdropFilter: 'saturate(140%) blur(10px)',
  },
  inner: {
    height: layout.navHeight,
    width: '100%',
    maxWidth: layout.maxWidth,
    alignSelf: 'center',
    paddingHorizontal: space.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  monogram: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.mauve,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: { ...serif('600'), color: colors.plum, fontSize: 16, letterSpacing: 0.5 },
  links: { flexDirection: 'row', gap: 2 },
  link: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    transitionProperty: 'background-color',
    transitionDuration: '160ms',
  },
  linkHover: { backgroundColor: colors.blushTint },
  focused: { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.mauveDeep } as object,
  linkText: { ...sans('500'), fontSize: 14.5, color: colors.plumSoft },
  linkTextActive: { color: colors.plum, ...sans('700') },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.line,
  },
  drawer: {
    backgroundColor: colors.ivory,
    marginHorizontal: space.lg,
    marginBottom: space.lg,
    borderRadius: radius.lg,
    paddingVertical: space.sm,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.soft,
  },
  drawerItem: {
    paddingHorizontal: space.xl,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drawerText: { ...serif('500'), fontSize: 22, color: colors.plum },
  drawerDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.rose },
});
