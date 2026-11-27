import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, sans } from '@/theme/tokens';

export function Tag({ label, tone = 'blush' }: { label: string; tone?: 'blush' | 'outline' | 'plum' }) {
  return (
    <View style={[styles.tag, styles[tone]]}>
      <Text style={[styles.text, tone === 'plum' && { color: colors.cream }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 5,
    alignSelf: 'flex-start',
  },
  blush: { backgroundColor: colors.blushTint },
  outline: { borderWidth: 1, borderColor: colors.lineStrong },
  plum: { backgroundColor: colors.plum },
  text: { ...sans('600'), fontSize: 12, color: colors.plum, letterSpacing: 0.2 },
});
