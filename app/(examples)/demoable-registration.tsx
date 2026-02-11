import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { COLORS } from '../../utils/constants';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Enter valid 10 digit phone')
    .required('Phone is required'),
  gender: Yup.string().required('Gender is required'),
  country: Yup.string().required('Country is required'),
  terms: Yup.boolean().oneOf([true], 'Accept terms to continue'),
});

export default function RegistrationScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);

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
            <Text style={styles.welcomeText}>Register</Text>
            <Text style={styles.subtitle}>
              Formik, FormElements
            </Text>
          </View>
        </LinearGradient>


      <ScrollView style={styles.container}>
        <View style={styles.content}>
        <Formik
          initialValues={{
            fullName: '',
            email: '',
            password: '',
            phone: '',
            gender: '',
            dob: new Date(),
            country: '',
            terms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log('Form Data:', values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View>

              {/* Full Name */}
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                onChangeText={handleChange('fullName')}
                onBlur={handleBlur('fullName')}
                value={values.fullName}
              />
              {touched.fullName && errors.fullName && (
                <Text style={styles.error}>{errors.fullName}</Text>
              )}

              {/* Email */}
              <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              {/* Password */}
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              {/* Phone */}
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="numeric"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
              />
              {touched.phone && errors.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}

              {/* Gender Radio */}
              <Text style={styles.label}>Gender</Text>
              <View style={styles.radioContainer}>
                {['Male', 'Female'].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={styles.radioButton}
                    onPress={() => setFieldValue('gender', g)}
                  >
                    <View style={styles.radioCircle}>
                      {values.gender === g && <View style={styles.selectedRb} />}
                    </View>
                    <Text>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {touched.gender && errors.gender && (
                <Text style={styles.error}>{errors.gender}</Text>
              )}

              {/* Date Picker */}
              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{values.dob.toDateString()}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={values.dob}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setFieldValue('dob', selectedDate);
                    }
                  }}
                />
              )}

              {/* Country Dropdown */}
              <Picker
                selectedValue={values.country}
                onValueChange={(itemValue) =>
                  setFieldValue('country', itemValue)
                }
              >
                <Picker.Item label="Select Country" value="" />
                <Picker.Item label="India" value="India" />
                <Picker.Item label="USA" value="USA" />
                <Picker.Item label="UK" value="UK" />
              </Picker>
              {touched.country && errors.country && (
                <Text style={styles.error}>{errors.country}</Text>
              )}

              {/* Terms Checkbox */}
              <View style={styles.switchContainer}>
                <Switch
                  value={values.terms}
                  onValueChange={(value) => setFieldValue('terms', value)}
                />
                <Text>I accept terms & conditions</Text>
              </View>
              {touched.terms && errors.terms && (
                <Text style={styles.error}>{errors.terms}</Text>
              )}

              {/* Submit */}
              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit as any}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>

            </View>
          )}
        </Formik>
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
  content: {
    padding: 24,
    paddingTop: 40,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  label: { fontWeight: '600', marginTop: 10 },
  error: { color: 'red', marginBottom: 8 },
  radioContainer: { flexDirection: 'row', marginVertical: 10 },
  radioButton: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#555',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: { color: 'white', fontWeight: '600' },
});
