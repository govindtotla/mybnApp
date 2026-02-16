// app/(auth)/login.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../../assets/images/mybn_icon.png';
import { authService } from '../../services/authService';
import { COLORS } from '../../utils/constants';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  // OTP Authentication State
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
      // Handle back button press
      const backAction = () => {
        router.replace('/welcome')
        return true; // Prevent default back behavior
      };

      // Add event listener
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      // Cleanup
      return () => backHandler.remove();
    }, []);

  useEffect(() => {
    checkAppleAvailability();
  }, []);

  const checkAppleAvailability = async () => {
    const isAvailable = await authService.isAppleAuthAvailable();
    setAppleAvailable(isAvailable);
  };

  // OTP Validation
  const validateMobileNumber = (number: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!mobileNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const success = await authService.sendOTP(mobileNumber);

      if (success) {
        setOtpSent(true);
        Alert.alert('Success', 'OTP sent to your mobile number');
      } else {
        setOtpError('Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setOtpError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    setOtpError('');

    try {
      const user = await authService.verifyOTP(mobileNumber, otp);

      if (user) {
        Alert.alert('Success', 'OTP verified successfully');
        // Navigate to profile page
        router.replace('/(tabs)/profile');
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      setOtpError(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    setOtp('');
    setOtpError('');
    handleSendOTP();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/welcome')}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>MYBN</Text>
          <Text style={styles.subtitle}>
            Sign in to Manage your business
          </Text>
        </View>
      </LinearGradient>

      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image
              source={Logo}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Sign In</Text>

          {/* Mobile Number Input Section */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Enter your 10-digit mobile number"
                placeholderTextColor={COLORS.text.secondary}
                keyboardType="phone-pad"
                maxLength={10}
                editable={!otpSent}
              />
            </View>
          </View>

          {/* Send OTP Button */}
          {!otpSent ? (
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, (!mobileNumber || loading || otpLoading) && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={!mobileNumber || loading || otpLoading}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText]}>
                {otpLoading ? 'Sending...' : 'Send OTP'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.otpSection}>
              <Text style={styles.otpTitle}>Enter OTP</Text>
              <Text style={styles.otpSubtitle}>
                OTP sent to +91 {mobileNumber}
              </Text>

              {/* OTP Input */}
              <View style={styles.inputContainer, styles.inputBorder}>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={COLORS.text.secondary}
                  keyboardType="numeric"
                  maxLength={6}
                  textAlign="center"
                />
              </View>

              {/* OTP Error Message */}
              {otpError ? (
                <Text style={styles.errorText}>{otpError}</Text>
              ) : null}

              {/* OTP Actions */}
              <View style={styles.otpActions}>
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton, otpLoading && styles.buttonDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={otpLoading}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                    {otpLoading ? 'Verifying...' : 'Verify OTP'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.ghostButton, otpLoading && styles.buttonDisabled]}
                  onPress={handleResendOTP}
                  disabled={otpLoading}
                >
                  <Text style={[styles.buttonText, styles.ghostButtonText]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
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
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  googleButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  appleButtonText: {
    color: COLORS.text.primary,
  },
  googleButtonText: {
    color: COLORS.text.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  inputBorder: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },
  countryCode: {
    fontSize: 16,
    color: COLORS.text.primary,
    marginRight: 12,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
    paddingVertical: 14,
  },
  otpInput: {
    fontSize: 16,
    letterSpacing: 8,
  },
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginRight: 8,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: COLORS.white,
  },
  secondaryButtonText: {
    color: COLORS.white,
  },
  ghostButtonText: {
    color: COLORS.text.primary,
  },
  otpSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  otpSubtitle: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  otpActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
});

export default LoginScreen;