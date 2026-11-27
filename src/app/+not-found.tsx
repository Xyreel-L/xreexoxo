import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from '@/components/ui/icons';
import { colors, serif, space } from '@/theme/tokens';
import { Button } from '@/components/ui/Button';
import { Body, Eyebrow } from '@/components/ui/Typography';

export default function NotFound() {
  return (
    <View style={styles.wrap}>
      <Eyebrow>Error 404</Eyebrow>
      <Text style={styles.title}>This page wandered off.</Text>
      <Body style={{ textAlign: 'center', maxWidth: 420 }}>
        The page you are looking for does not exist. Head back to the portfolio to keep exploring.
      </Body>
      <Button label="Back to portfolio" icon={ArrowLeft} onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xl,
    padding: space.xxl,
    backgroundColor: colors.cream,
  },
  title: { ...serif('500'), fontSize: 44, color: colors.plum, textAlign: 'center', letterSpacing: -1 },
});
