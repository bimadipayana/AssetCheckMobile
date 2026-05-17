import { ReactNode } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing } from '@/constants/theme';

type AppScreenProps = {
  children: ReactNode;
  edges?: Edge[];
  scroll?: boolean;
};

export function AppScreen({ children, edges, scroll = true }: AppScreenProps) {
  const safeEdges = edges ?? (['top', 'left', 'right'] as Edge[]);

  if (!scroll) {
    return (
      <SafeAreaView edges={safeEdges} style={styles.safeArea}>
        <ImageBackground
          resizeMode="cover"
          source={require('@/assets/images/home-background.png.png')}
          style={styles.background}
          imageStyle={styles.backgroundImage}>
          <View pointerEvents="none" style={styles.backgroundOverlay} />
          <View style={[styles.content, styles.nonScrollContent]}>{children}</View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={safeEdges} style={styles.safeArea}>
      <ImageBackground
        resizeMode="cover"
        source={require('@/assets/images/home-background.png.png')}
        style={styles.background}
        imageStyle={styles.backgroundImage}>
        <View pointerEvents="none" style={styles.backgroundOverlay} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.32)',
  },
  content: {
    flexGrow: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    position: 'relative',
  },
  nonScrollContent: {
    flex: 1,
    paddingBottom: 0,
  },
});
