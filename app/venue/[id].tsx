import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { mockVenues } from '@/data/mockData';
import { ArrowLeft, Star, MapPin, Clock, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function VenueDetails() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const venue = mockVenues.find(v => v.id === id);
  
  if (!venue) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Venue not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.background }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Image Slider */}
        <View style={styles.imageContainer}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(newIndex);
            }}
          >
            {venue.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Image indicator */}
          <View style={styles.imageIndicator}>
            {venue.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: selectedImageIndex === index 
                      ? theme.colors.primary 
                      : theme.colors.textSecondary,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Venue Info */}
        <View style={styles.content}>
          <View style={styles.venueHeader}>
            <ThemedText size="2xl" weight="bold" style={styles.venueName}>
              {venue.name}
            </ThemedText>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={theme.colors.primary} fill={theme.colors.primary} />
              <ThemedText size="base" weight="medium" style={styles.ratingText}>
                {`${venue.rating.toFixed(1)} (${venue.reviewCount} reviews)`}
              </ThemedText>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.colors.textSecondary} />
              <ThemedText variant="secondary" size="sm" style={styles.addressText}>
                {venue.address}
              </ThemedText>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              About
            </ThemedText>
            <ThemedText variant="secondary" size="base" style={styles.description}>
              {venue.description}
            </ThemedText>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Amenities
            </ThemedText>
            <View style={styles.amenitiesContainer}>
              {venue.amenities.map((amenity, index) => (
                <View key={index} style={[styles.amenityTag, { backgroundColor: theme.colors.surface }]}>
                  <ThemedText size="sm" style={{ color: theme.colors.textSecondary }}>
                    {amenity}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* Facilities */}
          <View style={styles.section}>
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Facilities
            </ThemedText>
            {venue.facilities.map((facility) => (
              <View key={facility.id} style={[styles.facilityCard, { backgroundColor: theme.colors.surface }]}>
                <ThemedText size="base" weight="bold" style={styles.facilityName}>
                  {facility.name}
                </ThemedText>
                <View style={styles.courtsContainer}>
                  {facility.courts.map((court) => (
                    <View key={court.id} style={styles.courtRow}>
                      <View style={styles.courtInfo}>
                        <ThemedText size="sm" weight="medium">
                          {court.name}
                        </ThemedText>
                        <ThemedText variant="secondary" size="xs">
                          ${court.hourlyRate}/hour
                        </ThemedText>
                      </View>
                      <Button
                        title="Book"
                        onPress={() => router.push(`/booking?venueId=${venue.id}&courtId=${court.id}`)}
                        size="sm"
                        style={styles.bookButton}
                      />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Book Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        <View style={styles.priceInfo}>
          <ThemedText variant="secondary" size="sm">
            Starting from
          </ThemedText>
          <ThemedText size="lg" weight="bold">
            {`$40/hour`}
          </ThemedText>
        </View>
        <Button
          title="Book Now"
          onPress={() => router.push(`/booking?venueId=${venue.id}`)}
          style={styles.bottomBookButton}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width,
    height: 300,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  venueHeader: {
    marginBottom: 24,
  },
  venueName: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    marginLeft: 4,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 22,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  facilityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  facilityName: {
    marginBottom: 12,
  },
  courtsContainer: {
    gap: 8,
  },
  courtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  courtInfo: {
    flex: 1,
  },
  bookButton: {
    paddingHorizontal: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  priceInfo: {
    flex: 1,
  },
  bottomBookButton: {
    paddingHorizontal: 32,
  },
});