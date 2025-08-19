import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, MapPin } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Venue } from '@/types';

interface VenueCardProps {
  venue: Venue;
  onPress: () => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.colors.background }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: venue.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.colors.text }]}>{venue.name}</Text>
        <View style={styles.locationRow}>
          <MapPin size={14} color={theme.colors.textSecondary} />
          <Text style={[styles.address, { color: theme.colors.textSecondary }]}>
            {venue.address}
          </Text>
        </View>
        <View style={styles.ratingRow}>
          <Star size={16} color={theme.colors.primary} fill={theme.colors.primary} />
          <Text style={[styles.rating, { color: theme.colors.text }]}>
            {venue.rating.toFixed(1)} ({venue.reviewCount} reviews)
          </Text>
        </View>
        <View style={styles.facilitiesRow}>
          {venue.facilities.slice(0, 3).map((facility) => (
            <View 
              key={facility.id} 
              style={[styles.facilityTag, { backgroundColor: theme.colors.surface }]}
            >
              <Text style={[styles.facilityText, { color: theme.colors.textSecondary }]}>
                {facility.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  facilityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});