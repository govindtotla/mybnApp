import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { router } from 'expo-router';
import { Button, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Examples
        </ThemedText>
      </ThemedView>
      <ThemedText>Checkout all the React Native UI examples</ThemedText>
      <Collapsible title="Demoable List View Component">
          <ThemedText>
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
          </ThemedText>
      </Collapsible>

      <Button title="Demoable List View" onPress={() => router.replace('/demoable-list-view')} />

      <Button title="Demoable Tab Nav" onPress={() => router.replace('/demoable-tab-navigation')} />

      <Button title="Demoable Drawer Navigation" onPress={() => router.replace('/demoable-drawer-navigation')} />

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
