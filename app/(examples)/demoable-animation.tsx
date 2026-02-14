import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, BackHandler, Button, StyleSheet, Text, View } from 'react-native';

export default function FadeExample() {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0

  useEffect(() => {
        // Handle back button press
        const backAction = () => {
          router.replace('/(examples)')
          return true; // Prevent default back behavior
        };

        // Add event listener
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );

        fadeIn();
        // Cleanup
        return () => backHandler.remove();
      }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>

      <Animated.View style={[styles.box, { opacity: fadeAnim }]}>
        <Text style={{ color: "white" }}>Hello 👋</Text>
      </Animated.View>

      <View style={{ marginTop: 20 }}>
        <Button title="Fade In" onPress={fadeIn} />
      </View>
      <View style={{ marginTop: 20 }}>
        <Button title="Fade Out" onPress={fadeOut} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  box: {
    width: 200,
    height: 100,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  }
});
