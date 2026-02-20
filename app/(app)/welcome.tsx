import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from "expo-web-browser";
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import banner from '../../assets/images/mybn_banner.jpg';
import { authService } from '../../services/authService';
import { APP_CONSTANTS, COLORS } from '../../utils/constants';

const WelcomeScreen = () => {
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const features = [
    {
      icon: 'business-outline',
      title: 'Browse Businesses',
      description: 'Discover thousands of registered Maheshwari businesses in your area',
    },
    {
      icon: 'information-circle-outline',
      title: 'Detailed Information',
      description: 'Get complete business details, contact info, and operating hours',
    },
    {
      icon: 'star-outline',
      title: 'Ratings & Reviews',
      description: 'Make informed decisions with authentic customer reviews',
    },
    {
      icon: 'navigate-outline',
      title: 'Easy Navigation',
      description: 'Get directions to businesses with integrated maps',
    },
  ];
  const openTerms = async () => {
    await WebBrowser.openBrowserAsync(
      "https://mybn.in/terms"
    );
  };
  const openPrivacy = async () => {
    await WebBrowser.openBrowserAsync(
      "https://mybn.in/privacy-policy"
    );
  };

  const handleGetStarted = async () => {
    try {
      setIsCheckingSession(true);

      // Check if user has a valid session
      const hasValidSession = await authService.hasValidSession();

      if (hasValidSession) {
        // Set the token in API headers
        const token = await authService.getToken();
        if (token) {
          authService.setAuthToken(token);
        }

        // Check if user data exists
        const user = await authService.getCurrentUser();

        if (user) {
          // Navigate to profile if user is authenticated
          router.replace('/(tabs)/profile');
          return;
        }
      }

      // Navigate to login if no valid session
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error checking session:', error);
      // Navigate to login on error
      router.replace('/(auth)/login');
    } finally {
      setIsCheckingSession(false);
    }
  };
  const handleGuestStarted = () => {
    router.replace('/business-list');
  };
  const handleOptions = () => {
    router.replace('../(examples)/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Welcome to</Text>
            <Text style={styles.headerAppName}>{APP_CONSTANTS.APP_NAME}</Text>
            <Text style={styles.headerSubtitle}>
              Your gateway to discovering amazing local Maheshwari businesses and services
            </Text>
          </View>

          <View style={styles.headerImageContainer}>
            <Image
              source={banner}
              style={styles.headerImage}
            />
          </View>
        </LinearGradient>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You Can Do</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons
                    name={feature.icon as any}
                    size={32}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            {[
              { number: '1', text: 'Browse or search for businesses by category or location' },
              { number: '2', text: 'View detailed information including contact, hours, and reviews' },
              { number: '3', text: 'Get directions or contact businesses directly from the app' },
              { number: '4', text: 'Save your favorite businesses for quick access' },
            ].map((step, index) => (
              <View style={styles.step} key={index}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={[styles.ctaButton, isCheckingSession && styles.buttonDisabled]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
            disabled={isCheckingSession}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.secondary]}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaButtonText}>
                {isCheckingSession ? 'Checking...' : 'Get Started'}
              </Text>
              {!isCheckingSession && (
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color={COLORS.text.inverted}
                />
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleGuestStarted}
          >
            <Text style={styles.secondaryButtonText}>
              Explore as Guest
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleOptions}
          >
            <Text style={styles.secondaryButtonText}>
              Options
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text onPress={openTerms} style={styles.link}>Terms of Service</Text> and{' '}
            <Text onPress={openPrivacy} style={styles.link}>Privacy Policy</Text>
          </Text>
          <Text style={styles.copyright}>
            © 2026 {APP_CONSTANTS.APP_NAME}. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  headerAppName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text.inverted,
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  headerImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    padding: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  stepsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    color: COLORS.text.inverted,
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 16,
    color: COLORS.text.primary,
    flex: 1,
    lineHeight: 24,
  },
  ctaSection: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  ctaButton: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    color: COLORS.text.inverted,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  secondaryButton: {
    paddingVertical: 16,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 16,
  },
  copyright: {
    fontSize: 11,
    color: COLORS.text.light,
    textAlign: 'center',
  },
    link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;