import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../utils/constants';
import { decodeHtmlEntities } from '../utils/htmlUtils';
import { Business } from '../utils/types';

interface BusinessCardProps {
  business: Business;
  onPress: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onPress }) => {
  const handleCall = () => {
    Alert.alert(
      'Call Business',
      `Call ${business.registered_name} at ${business.phone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log(`Calling ${business.phone}`) },
      ]
    );
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(business.stats.rating);
    const hasHalfStar = business.stats.rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons name="star" size={16} color="#FFD700" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons name="star-half" size={16} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons name="star-outline" size={16} color="#FFD700" />
        );
      }
    }

    return stars;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Business Image */}
      <Image
        source={{ uri: business.featured_banner.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Category Badge */}
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{business.category.name}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {business.business_name}
          </Text>
          <TouchableOpacity onPress={handleCall} style={styles.callButton}>
            <Ionicons name="call" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Business Owner */}
        <Text style={styles.description} numberOfLines={1}>
          {business.managed_by}
        </Text>

        {/* Address */}
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={16} color={COLORS.text.secondary} />
          <Text style={styles.address} numberOfLines={2}>
            {business.address}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={1}>
          {decodeHtmlEntities(business.description)}
        </Text>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>
            {renderStars()}
            <Text style={styles.ratingText}>
              {business.stats.rating.toFixed(1)} ({business.stats.total_views} reviews)
            </Text>
          </View>
          <Text style={styles.ratingText}>
            {business.stats.products_count} products
          </Text>
        </View>

        {/* View Details Button */}
        <View style={styles.footer}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    flex: 1,
    marginRight: 8,
  },
  callButton: {
    padding: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text.secondary,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hours: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text.secondary,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  viewDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default BusinessCard;