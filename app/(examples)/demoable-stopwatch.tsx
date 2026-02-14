import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generalService } from '../../services/api';

export default function StopWatch() {
  const [time, setTime] = useState(0); // milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [number, setNumber] = useState<number | null>(null);
  const [amount, setAmount] = useState('1');
  const [converted, setConverted] = useState<number | null>(null);
  const [rate, setRate] = useState<number>(0);

  const FROM = 'USD';
  const TO = 'INR';

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
    fetchRate();
    generateRandom();
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

  const generateRandom = () => {
    const random = Math.floor(Math.random() * 100) + 1;
    setNumber(random);
  };


  const fetchRate = async () => {
    const response = await generalService.fetchRate(FROM, TO);
    setRate(response);
  };

  const convert = async () => {
    const result = parseFloat(amount) * rate;
    setConverted(result);
  };

  const pad = (num: number) => num.toString().padStart(2, '0');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
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

      <View style={styles.inner}>
        <Text style={styles.number}>
          {number ?? "Press button"}
        </Text>

        <Button title="Generate Random Number" onPress={generateRandom} />
      </View>

      <View style={styles.inner}>
        <Text style={styles.title}>Currency Converter</Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
        />

        <Button title="Convert" onPress={convert} />

        {converted && (
          <Text style={styles.result}>
            {amount} {FROM} = {converted.toFixed(2)} {TO}
          </Text>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#faf9f9',
  },
  inner: {
    margin: 5,
    borderWidth:1,
    borderColor: '#333',
    borderRadius:5,
    borderStyle:'solid',
    padding:5,
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
  number: {
    textAlign:'center',
    fontSize: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
  },
});
