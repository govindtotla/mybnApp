import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function StopWatch() {
  const [time, setTime] = useState(0); // milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

        // Cleanup
        return () => backHandler.remove();
      }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (milliseconds: number) => {
    const mins = Math.floor(milliseconds / 60000);
    const secs = Math.floor((milliseconds % 60000) / 1000);
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${pad(mins)}:${pad(secs)}.${pad(ms)}`;
  };

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(time)}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isRunning ? 'orange' : 'green' }]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Text style={styles.buttonText}>
            {isRunning ? 'Pause' : 'Start'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => {
            setIsRunning(false);
            setTime(0);
          }}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf9f9',
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#484bfd',
    marginBottom: 40,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
