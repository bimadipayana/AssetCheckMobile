import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

const splashImage = require('@/assets/images/final-splash.png');

export function AppSplashScreen({ onFinish }: { onFinish: () => void }) {
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const finishTimer = setTimeout(() => {
      Animated.timing(fade, {
        duration: 420,
        easing: Easing.out(Easing.quad),
        toValue: 0,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          onFinish();
        }
      });
    }, 3200);

    return () => {
      clearTimeout(finishTimer);
    };
  }, [fade, onFinish]);

  return (
    <Animated.View
      pointerEvents="auto"
      style={[
        styles.root,
        {
          opacity: fade,
        },
      ]}>
      <Image
        contentFit="contain"
        priority="high"
        source={splashImage}
        style={styles.image}
        transition={0}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F5FAF7',
    elevation: 1000,
    zIndex: 1000,
  },
});
