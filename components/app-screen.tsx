import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { palette, spacing } from '@/constants/theme';

type AppScreenProps = {
  children: ReactNode;
  edges?: Edge[];
  scroll?: boolean;
};

export function AppScreen({ children, edges, scroll = true }: AppScreenProps) {
  if (!scroll) {
    return (
      <SafeAreaView edges={edges} style={styles.safeArea}>
        <View style={[styles.content, styles.nonScrollContent]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
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
  },
});
