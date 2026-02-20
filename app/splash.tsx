import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../assets/images/mybn_icon.png';
import { APP_CONSTANTS, COLORS } from '../utils/constants';

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after delay
    const timer = setTimeout(() => {
      router.replace('/(app)/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={[COLORS.gradient.start, COLORS.gradient.end]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: slideAnim },
                ],
              },
            ]}
          >
            <Image
              source={Logo}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>{APP_CONSTANTS.APP_NAME}</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.taglineContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.tagline}>Discover Local Maheshwari Businesses</Text>
            <Text style={styles.subTagline}>
              Connecting you with the best services in city
            </Text>
          </Animated.View>

          {/* <View style={styles.loadingContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.loadingDot,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              />
            ))}
          </View> */}
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>v{APP_CONSTANTS.VERSION}</Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  logoImage: {
    width: 120, // Adjust based on your logo
    height: 120,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text.inverted,
    letterSpacing: 1,
  },
  taglineContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  tagline: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.inverted,
    textAlign: 'center',
    marginBottom: 8,
  },
  subTagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 6,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  version: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
  },
});

export default SplashScreen;