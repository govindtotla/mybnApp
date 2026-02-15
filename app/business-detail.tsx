import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingSpinner from '../components/LoadingSpinner';
import { businessService } from '../services/api';
import { COLORS } from '../utils/constants';
import { Business } from '../utils/types';

const BusinessDetailScreen = () => {
  const params = useLocalSearchParams();
  const businessId = params.businessId as number;

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadBusinessDetails();
  }, [businessId]);

  const loadBusinessDetails = async () => {
    try {
      setLoading(true);
      const data = await businessService.getBusinessById(businessId);
      setBusiness(data);
    } catch (error) {
      console.error('Failed to load business details:', error);
      Alert.alert('Error', 'Failed to load business details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (!business?.phone) return;

    const phoneNumber = `tel:${String(business.phone).replace(/\D/g, '')}`;
    Linking.openURL(phoneNumber).catch(() => {
      Alert.alert('Error', 'Unable to make a call. Please check your device settings.');
    });
  };

  const handleEmail = () => {
    if (!business?.email) return;

    const emailUrl = `mailto:${business.email}`;
    Linking.openURL(emailUrl).catch(() => {
      Alert.alert('Error', 'Unable to open email app. Please check your device settings.');
    });
  };

  const handleWebsite = () => {
    if (!business?.website) return;

    let url = business.website;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open website. Please check your device settings.');
    });
  };

  const handleDirections = () => {
    if (!business.location?.latitude || !business.location?.longitude) {
      Alert.alert('Info', 'Location not available for this business.');
      return;
    }

    const lat = business.location.latitude;
    const lng = business.location.longitude;

    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });

    const latLng = `${lat},${lng}`;
    const label = encodeURIComponent(business.business_name);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url!).catch(() => {
      Alert.alert('Error', 'Unable to open maps app. Please check your device settings.');
    });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would save this to AsyncStorage or your backend
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={20} color="#FFD700" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={20} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={20} color="#FFD700" />
        );
      }
    }

    return stars;
  };

  if (loading) {
    return <LoadingSpinner message="Loading business details..." />;
  }

  if (!business) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color={COLORS.error} />
        <Text style={styles.errorTitle}>Business Not Found</Text>
        <Text style={styles.errorText}>
          The business you're looking for doesn't exist or has been removed.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: business.featured_banner.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={styles.imageGradient}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => router.back()}
          >
            <View style={styles.backButtonInner}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
            </View>
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={toggleFavorite}
          >
            <View style={styles.favoriteButtonInner}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? COLORS.error : COLORS.text.primary}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Business Name and Category */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>{business.business_name}</Text>
              <View style={styles.categoryContainer}>
                <Text style={styles.category}>{business.category.name}</Text>
              </View>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              {renderStars(business.stats.rating)}
              <Text style={styles.ratingText}>
                {business.stats.rating.toFixed(1)} ({business.stats.total_views} reviews)
              </Text>
            </View>
          </View>

          {/* Contact Buttons */}
          <View style={styles.contactButtons}>
            <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
              <Ionicons name="call" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
              <Ionicons name="mail" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactButton} onPress={handleWebsite}>
              <Ionicons name="globe" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Website</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactButton} onPress={handleWebsite}>
              <Ionicons name="logo-whatsapp" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Whatsapp</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.contactButton} onPress={handleDirections}>
              <Ionicons name="navigate" size={20} color={COLORS.primary} />
              <Text style={styles.contactButtonText}>Directions</Text>
            </TouchableOpacity> */}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="person-circle-outline" size={20} color={COLORS.text.secondary} />
                <Text style={styles.contactText}>{business.managed_by}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="location-outline" size={20} color={COLORS.text.secondary} />
                <Text style={styles.contactText}>{business.address}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={20} color={COLORS.text.secondary} />
                <Text style={styles.contactText}>{business.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={20} color={COLORS.text.secondary} />
                <Text style={styles.contactText}>{business.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="globe-outline" size={20} color={COLORS.text.secondary} />
                <Text style={styles.contactText}>{business.website}</Text>
              </View>
            </View>
          </View>

          {/* Details Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              <RenderHtml
                source={{ html: business.description }}
              />
            </Text>
          </View>

          {/* Map (if coordinates available) */}
          {/* {business.latitude && business.longitude && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: business.latitude,
                    longitude: business.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: business.latitude,
                      longitude: business.longitude,
                    }}
                    title={business.business_name}
                    description={business.address}
                  />
                </MapView>
              </View>
            </View>
          )} */}
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
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 16,
  },
  favoriteButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 12,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  category: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  contactButton: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactButtonText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    lineHeight: 24,
  },
  contactInfo: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  hoursContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
  },
  hourText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginTop: 20,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.text.inverted,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BusinessDetailScreen;