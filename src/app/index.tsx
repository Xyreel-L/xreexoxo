import { useCallback, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';
import { DeckHero, type CardRect } from '@/components/deck/DeckHero';
import { ExpandedCard } from '@/components/deck/ExpandedCard';
import { DECK } from '@/components/deck/cards';

type Open = { id: string; from?: CardRect } | null;

function setHash(id: string | null) {
  if (Platform.OS !== 'web') return;
  const url = id ? `#${id}` : window.location.pathname + window.location.search;
  window.history.replaceState(null, '', url);
}

export default function Home() {
  const [open, setOpen] = useState<Open>(null);

  // Deep links: xreexoxo.vercel.app/#achievements opens that card directly.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const id = window.location.hash.slice(1);
    if (DECK.some((c) => c.id === id)) setOpen({ id });
  }, []);

  const onOpen = useCallback((id: string, from?: CardRect) => {
    setOpen({ id, from });
    setHash(id);
  }, []);

  const onClose = useCallback(() => {
    setOpen(null);
    setHash(null);
  }, []);

  const onSwitch = useCallback((id: string) => {
    // Keep the original "from" rect so closing still flies back into the fan.
    setOpen((o) => (o ? { ...o, id } : { id }));
    setHash(id);
  }, []);

  return (
    <View style={styles.root}>
      <ScrollView style={styles.root} contentContainerStyle={{ flexGrow: 1 }} aria-hidden={!!open}>
        <View role="main" style={{ flexGrow: 1 }}>
          <DeckHero onOpen={onOpen} paused={!!open} />
        </View>
      </ScrollView>
      {open ? <ExpandedCard id={open.id} from={open.from} onClose={onClose} onSwitch={onSwitch} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.cream },
});
