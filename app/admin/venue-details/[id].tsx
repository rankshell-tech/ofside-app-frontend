import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Building, MapPin, Star, User, Calendar, DollarSign, CircleCheck as CheckCircle, Ban, Trash2, CreditCard as Edit } from 'lucide-react-native';
import { mockVenues } from '@/data/mockData';

interface VenueDetails {
  id: string;
  name: string;
  description: string;
  address: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  rating: number;
  reviewCount: number;
  totalBookings: number;
  monthlyRevenue: number;
  createdDate: string;
  lastUpdated: string;
  facilities: Array<{
    id: string;
    name: string;
    sport: string;
    courts: Array<{
      id: string;
      name: string;
      hourlyRate: number;
    }>;
  }>;
  amenities: string[];
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function VenueDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // Find venue from mock data or create mock details
  const existingVenue = mockVenues.find(v => v.id === id);
  
  const venueData: VenueDetails = {
    id: id || '1',
    name: existingVenue?.name || 'Elite Sports Complex',
    description: existingVenue?.description || 'Premier multi-sport facility with state-of-the-art courts and professional equipment.',
    address: existingVenue?.address || '123 Sports Ave, New York, NY 10001',
    ownerName: 'John Smith',
    ownerEmail: 'john.smith@example.com',
    ownerPhone: '+1234567890',
    status: 'active',
    rating: existingVenue?.rating || 4.8,
    reviewCount: existingVenue?.reviewCount || 124,
    totalBookings: 456,
    monthlyRevenue: 12500,
    createdDate: '2024-01-15',
    lastUpdated: '2025-01-20',
    facilities: existingVenue?.facilities || [],
    amenities: existingVenue?.amenities || [],
    images: existingVenue?.images || [],
    coordinates: existingVenue?.coordinates || { latitude: 40.7128, longitude: -74.0060 },
  };

  const handleVenueAction = (action: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      switch (action) {
        case 'approve':
          Alert.alert('Success', `${venueData.name} has been approved.`);
          break;
        case 'reject':
          Alert.alert('Success', `${venueData.name} has been rejected.`);
          break;
        case 'suspend':
          Alert.alert('Success', `${venueData.name} has been suspended.`);
          break;
        case 'activate':
          Alert.alert('Success', `${venueData.name} has been activated.`);
          break;
        case 'delete':
          Alert.alert('Success', `${venueData.name} has been deleted.`, [
            { text: 'OK', onPress: () => router.back() }
          ]);
          break;
        case 'edit':
          router.push(`/venue-owner/edit-venue/${venueData.id}`);
          break;
      }
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'suspended': return theme.colors.error;
      case 'rejected': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Venue Details
        </ThemedText>
        <TouchableOpacity onPress={() => handleVenueAction('edit')}>
          <Edit size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Venue Images */}
        {venueData.images.length > 0 && (
          <View style={styles.imagesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {venueData.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.venueImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Venue Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.background }]}>
          <View style={styles.venueHeader}>
            <View style={[styles.venueIcon, { backgroundColor: theme.colors.primary }]}>
              <Building size={32} color={theme.colors.accent} />
            </View>
            <View style={styles.venueInfo}>
              <ThemedText size="xl" weight="bold">{venueData.name}</ThemedText>
              <View style={styles.ratingRow}>
                <Star size={16} color={theme.colors.primary} fill={theme.colors.primary} />
                <ThemedText variant="secondary" size="sm" style={styles.ratingText}>
                  {venueData.rating.toFixed(1)} ({venueData.reviewCount} reviews)
                </ThemedText>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(venueData.status) }]}>
                <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                  {venueData.status.toUpperCase()}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.addressRow}>
            <MapPin size={16} color={theme.colors.textSecondary} />
            <ThemedText variant="secondary" size="sm" style={styles.addressText}>
              {venueData.address}
            </ThemedText>
          </View>

          <ThemedText variant="secondary" size="sm" style={styles.description}>
            {venueData.description}
          </ThemedText>
        </View>

        {/* Owner Information */}
        <View style={[styles.ownerCard, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="lg" weight="bold" style={styles.cardTitle}>
            Owner Information
          </ThemedText>
          
          <View style={styles.ownerInfo}>
            <View style={[styles.ownerAvatar, { backgroundColor: theme.colors.accent }]}>
              <User size={24} color={theme.colors.background} />
            </View>
            <View style={styles.ownerDetails}>
              <ThemedText size="base" weight="bold">{venueData.ownerName}</ThemedText>
              <ThemedText variant="secondary" size="sm">{venueData.ownerEmail}</ThemedText>
              <ThemedText variant="secondary" size="sm">{venueData.ownerPhone}</ThemedText>
            </View>
          </View>
        </View>

        {/* Performance Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold">{venueData.totalBookings}</ThemedText>
            <ThemedText variant="secondary" size="sm">Total Bookings</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold">${venueData.monthlyRevenue}</ThemedText>
            <ThemedText variant="secondary" size="sm">Monthly Revenue</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold">{venueData.facilities.length}</ThemedText>
            <ThemedText variant="secondary" size="sm">Facilities</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold">{venueData.facilities.reduce((total, f) => total + f.courts.length, 0)}</ThemedText>
            <ThemedText variant="secondary" size="sm">Total Courts</ThemedText>
          </View>
        </View>

        {/* Facilities */}
        <View style={[styles.facilitiesCard, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="lg" weight="bold" style={styles.cardTitle}>
            Facilities & Pricing
          </ThemedText>
          
          {venueData.facilities.map((facility) => (
            <View key={facility.id} style={[styles.facilitySection, { backgroundColor: theme.colors.surface }]}>
              <ThemedText size="base" weight="bold" style={styles.facilityName}>
                {facility.name}
              </ThemedText>
              <View style={styles.courtsGrid}>
                {facility.courts.map((court) => (
                  <View key={court.id} style={styles.courtItem}>
                    <ThemedText size="sm" weight="medium">{court.name}</ThemedText>
                    <ThemedText variant="secondary" size="xs">${court.hourlyRate}/hour</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Amenities */}
        <View style={[styles.amenitiesCard, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="lg" weight="bold" style={styles.cardTitle}>
            Amenities
          </ThemedText>
          <View style={styles.amenitiesContainer}>
            {venueData.amenities.map((amenity, index) => (
              <View key={index} style={[styles.amenityChip, { backgroundColor: theme.colors.surface }]}>
                <ThemedText size="sm" style={{ color: theme.colors.textSecondary }}>
                  {amenity}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {venueData.status === 'pending' && (
            <>
              <Button
                title={isLoading ? "Approving..." : "Approve Venue"}
                onPress={() => {
                  Alert.alert(
                    'Approve Venue',
                    `Are you sure you want to approve ${venueData.name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Approve', onPress: () => handleVenueAction('approve') }
                    ]
                  );
                }}
                disabled={isLoading}
                style={styles.actionButton}
              />
              <Button
                title={isLoading ? "Rejecting..." : "Reject Venue"}
                onPress={() => {
                  Alert.alert(
                    'Reject Venue',
                    `Are you sure you want to reject ${venueData.name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Reject', style: 'destructive', onPress: () => handleVenueAction('reject') }
                    ]
                  );
                }}
                disabled={isLoading}
                variant="outline"
                style={[styles.actionButton, { borderColor: theme.colors.error }]}
                textStyle={{ color: theme.colors.error }}
              />
            </>
          )}

          {venueData.status === 'active' && (
            <Button
              title={isLoading ? "Suspending..." : "Suspend Venue"}
              onPress={() => {
                Alert.alert(
                  'Suspend Venue',
                  `Are you sure you want to suspend ${venueData.name}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Suspend', style: 'destructive', onPress: () => handleVenueAction('suspend') }
                  ]
                );
              }}
              disabled={isLoading}
              variant="outline"
              style={[styles.actionButton, { borderColor: theme.colors.warning }]}
              textStyle={{ color: theme.colors.warning }}
            />
          )}

          {venueData.status === 'suspended' && (
            <Button
              title={isLoading ? "Activating..." : "Activate Venue"}
              onPress={() => handleVenueAction('activate')}
              disabled={isLoading}
              style={styles.actionButton}
            />
          )}

          <Button
            title={isLoading ? "Deleting..." : "Delete Venue"}
            onPress={() => {
              Alert.alert(
                'Delete Venue',
                `Are you sure you want to permanently delete ${venueData.name}? This action cannot be undone.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => handleVenueAction('delete') }
                ]
              );
            }}
            disabled={isLoading}
            variant="outline"
            style={[styles.actionButton, { borderColor: theme.colors.error }]}
            textStyle={{ color: theme.colors.error }}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  imagesContainer: {
    height: 200,
    marginBottom: 24,
  },
  venueImage: {
    width: 300,
    height: 200,
    borderRadius: 16,
    marginLeft: 24,
  },
  profileCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  venueIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  venueInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressText: {
    marginLeft: 8,
    flex: 1,
  },
  description: {
    lineHeight: 18,
  },
  ownerCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardTitle: {
    marginBottom: 16,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  ownerDetails: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  facilitiesCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  facilitySection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  facilityName: {
    marginBottom: 12,
  },
  courtsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courtItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  amenitiesCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
  },
});