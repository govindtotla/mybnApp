import { ThemedText } from '@/components/themed-text';
import { Collapsible } from '@/components/ui/collapsible';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Alert, BackHandler, Button, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../utils/constants';

export default function Index() {

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

  return (
        <SafeAreaView style={styles.container}>
          <LinearGradient
            colors={[COLORS.primary, '#6AA8FF']}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.replace('/welcome')}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Text style={styles.welcomeText}>Examples</Text>
              <Text style={styles.subtitle}>
                React Native UI examples
              </Text>
            </View>
          </LinearGradient>

      <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Collapsible title="Collops & Expend Component">
                <ThemedText>
                what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
                <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
                </ThemedText>

                <Button title="I am Button" onPress={() => Alert.alert('Button', 'Button Pressed') } />
            </Collapsible>

            <View style={styles.innerContent}>
              <TouchableOpacity style={styles.button} onPress={() => router.replace('/demoable-list-view')}>
                <Text style={styles.buttonText}>Demoable List View</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => router.replace('/demoable-tab-navigation')}>
                <Text style={styles.buttonText}>Demoable Tab Nav</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => router.replace('/demoable-drawer-navigation')}>
                <Text style={styles.buttonText}>Demoable Drawer Navigation</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => router.replace('/business-list')}>
                <Text style={styles.buttonText}>Demoable FlatList & ScrollView</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => router.replace('/demoable-registration')}>
                <Text style={styles.buttonText}>Demoable Form Elements</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => router.replace('/demoable-animation')}>
                <Text style={styles.buttonText}>Animation</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => router.replace('/demoable-stopwatch')}>
                <Text style={styles.buttonText}>Tools</Text>
              </TouchableOpacity>

            </View>

          </View>

        </ScrollView>
    </SafeAreaView>
  );
}

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
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 1,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContent: {
    paddingTop: 40,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  headerImage: {
    color: '#808080',
    bottom: -0,
    left: -0,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    marginTop:4,
    backgroundColor: '#5ea8fc',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
