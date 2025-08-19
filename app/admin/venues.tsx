import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Search, Filter, Plus, Building, MapPin, Star, MoveVertical as MoreVertical, CreditCard as Edit, Trash2, Eye, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';

interface AdminVenue {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  ownerEmail: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  rating: number;
  reviewCount: number;
  totalBookings: number;
  monthlyRevenue: number;
  createdDate: string;
  facilities: number;
  images: string[];
}

export default function AdminVenues() {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<AdminVenue | null>(null);
  const [showVenueActions, setShowVenueActions] = useState(false);

  // Mock venues data - replace with API call
  const [venues, setVenues] = useState<AdminVenue[]>([
    {
      id: '1',
      name: 'Elite Sports Complex',
      address: '123 Sports Ave, New York, NY 10001',
      ownerName: 'John Smith',
      ownerEmail: 'john.smith@example.com',
      status: 'active',
      rating: 4.8,
      reviewCount: 124,
      totalBookings: 456,
      monthlyRevenue: 12500,
      createdDate: '2024-01-15',
      facilities: 4,
      images: ['https://images.pexels.com/photos/159698/basketball-court-sport-game-159698.jpeg'],
    },
    {
      id: '2',
      name: 'Urban Football Hub',
      address: '456 Football St, Brooklyn, NY 11201',
      ownerName: 'Jane Doe',
      ownerEmail: 'jane.doe@example.com',
      status: 'pending',
      rating: 0,
      reviewCount: 0,
      totalBookings: 0,
      monthlyRevenue: 0,
      createdDate: '2025-01-18',
      facilities: 2,
      images: ['https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg'],
    },
    {
      id: '3',
      name: 'Ace Tennis Club',
      address: '789 Tennis Blvd, Manhattan, NY 10016',
      ownerName: 'Mike Johnson',
      ownerEmail: 'mike.johnson@example.com',
      status: 'suspended',
      rating: 4.2,
      reviewCount: 89,
      totalBookings: 234,
      monthlyRevenue: 8900,
      createdDate: '2024-03-10',
      facilities: 3,
      images: ['https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg'],
    },
  ]);

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || venue.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleVenueAction = (action: string, venue: AdminVenue) => {
    setShowVenueActions(false);
    
    switch (action) {
      case 'view':
        router.push(`/admin/venue-details/${venue.id}`);
        break;
      case 'approve':
        Alert.alert(
          'Approve Venue',
          `Are you sure you want to approve ${venue.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Approve',
              onPress: () => {
                setVenues(prev => prev.map(v => 
                  v.id === venue.id ? { ...v, status: 'active' as const } : v
                ));
                Alert.alert('Success', 'Venue approved successfully!');
              }
            }
          ]
        );
        break;
      case 'reject':
        Alert.alert(
          'Reject Venue',
          `Are you sure you want to reject ${venue.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Reject',
              style: 'destructive',
              onPress: () => {
                setVenues(prev => prev.map(v => 
                  v.id === venue.id ? { ...v, status: 'rejected' as const } : v
                ));
              }
            }
          ]
        );
        break;
      case 'suspend':
        Alert.alert(
          'Suspend Venue',
          `Are you sure you want to suspend ${venue.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Suspend',
              style: 'destructive',
              onPress: () => {
                setVenues(prev => prev.map(v => 
                  v.id === venue.id ? { ...v, status: 'suspended' as const } : v
                ));
              }
            }
          ]
        );
        break;
      case 'activate':
        setVenues(prev => prev.map(v => 
          v.id === venue.id ? { ...v, status: 'active' as const } : v
        ));
        break;
      case 'delete':
        Alert.alert(
          'Delete Venue',
          `Are you sure you want to permanently delete ${venue.name}? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setVenues(prev => prev.filter(v => v.id !== venue.id));
              }
            }
          ]
        );
        break;
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} color={theme.colors.success} />;
      case 'pending': return <Eye size={16} color={theme.colors.warning} />;
      case 'suspended': return <XCircle size={16} color={theme.colors.error} />;
      case 'rejected': return <XCircle size={16} color={theme.colors.textSecondary} />;
      default: return null;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Manage Venues
        </ThemedText>
        <TouchableOpacity onPress={() => Alert.alert('Add Venue', 'Add new venue functionality')}>
          <Plus size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search venues..."
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Options */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'active', 'pending', 'suspended'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selectedFilter === filter ? theme.colors.primary : theme.colors.surface,
                    borderColor: selectedFilter === filter ? theme.colors.primary : theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedFilter(filter as any)}
              >
                <ThemedText
                  size="sm"
                  style={{
                    color: selectedFilter === filter ? theme.colors.accent : theme.colors.text,
                  }}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">{filteredVenues.length}</ThemedText>
          <ThemedText variant="secondary" size="sm">Total Venues</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">{filteredVenues.filter(v => v.status === 'active').length}</ThemedText>
          <ThemedText variant="secondary" size="sm">Active</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">{filteredVenues.filter(v => v.status === 'pending').length}</ThemedText>
          <ThemedText variant="secondary" size="sm">Pending</ThemedText>
        </View>
      </View>

      {/* Venues List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredVenues.map((venue) => (
          <View key={venue.id} style={[styles.venueCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.venueHeader}>
              <View style={styles.venueInfo}>
                <View style={styles.venueImageContainer}>
                  <Building size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.venueDetails}>
                  <View style={styles.venueNameRow}>
                    <ThemedText size="base" weight="bold">{venue.name}</ThemedText>
                    {getStatusIcon(venue.status)}
                  </View>
                  <View style={styles.addressRow}>
                    <MapPin size={14} color={theme.colors.textSecondary} />
                    <ThemedText variant="secondary" size="sm" style={styles.addressText}>
                      {venue.address}
                    </ThemedText>
                  </View>
                  <ThemedText variant="secondary" size="xs">
                    Owner: {venue.ownerName}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.venueActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(venue.status) }]}>
                  <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                    {venue.status.toUpperCase()}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedVenue(venue);
                    setShowVenueActions(true);
                  }}
                >
                  <MoreVertical size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            {venue.status === 'active' && (
              <View style={styles.venueRating}>
                <Star size={16} color={theme.colors.primary} fill={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.ratingText}>
                  {venue.rating.toFixed(1)} ({venue.reviewCount} reviews)
                </ThemedText>
              </View>
            )}

            <View style={styles.venueStats}>
              <View style={styles.statColumn}>
                <ThemedText variant="secondary" size="xs">Created</ThemedText>
                <ThemedText size="sm" weight="medium">
                  {new Date(venue.createdDate).toLocaleDateString()}
                </ThemedText>
              </View>
              <View style={styles.statColumn}>
                <ThemedText variant="secondary" size="xs">Facilities</ThemedText>
                <ThemedText size="sm" weight="medium">{venue.facilities}</ThemedText>
              </View>
              <View style={styles.statColumn}>
                <ThemedText variant="secondary" size="xs">Bookings</ThemedText>
                <ThemedText size="sm" weight="medium">{venue.totalBookings}</ThemedText>
              </View>
              <View style={styles.statColumn}>
                <ThemedText variant="secondary" size="xs">Revenue</ThemedText>
                <ThemedText size="sm" weight="medium">${venue.monthlyRevenue}</ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Venue Actions Modal */}
      <Modal
        visible={showVenueActions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVenueActions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowVenueActions(false)}
        >
          <View style={[styles.actionSheet, { backgroundColor: theme.colors.background }]}>
            <View style={styles.actionSheetHeader}>
              <ThemedText size="lg" weight="bold">Venue Actions</ThemedText>
              <ThemedText variant="secondary" size="sm">{selectedVenue?.name}</ThemedText>
            </View>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleVenueAction('view', selectedVenue!)}
            >
              <Eye size={20} color={theme.colors.text} />
              <ThemedText size="base" style={styles.actionText}>View Details</ThemedText>
            </TouchableOpacity>

            {selectedVenue?.status === 'pending' && (
              <>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleVenueAction('approve', selectedVenue!)}
                >
                  <CheckCircle size={20} color={theme.colors.success} />
                  <ThemedText size="base" style={[styles.actionText, { color: theme.colors.success }]}>
                    Approve Venue
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => handleVenueAction('reject', selectedVenue!)}
                >
                  <XCircle size={20} color={theme.colors.error} />
                  <ThemedText size="base" style={[styles.actionText, { color: theme.colors.error }]}>
                    Reject Venue
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}

            {selectedVenue?.status === 'active' && (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => handleVenueAction('suspend', selectedVenue!)}
              >
                <XCircle size={20} color={theme.colors.warning} />
                <ThemedText size="base" style={[styles.actionText, { color: theme.colors.warning }]}>
                  Suspend Venue
                </ThemedText>
              </TouchableOpacity>
            )}

            {selectedVenue?.status === 'suspended' && (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => handleVenueAction('activate', selectedVenue!)}
              >
                <CheckCircle size={20} color={theme.colors.success} />
                <ThemedText size="base" style={[styles.actionText, { color: theme.colors.success }]}>
                  Activate Venue
                </ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleVenueAction('delete', selectedVenue!)}
            >
              <Trash2 size={20} color={theme.colors.error} />
              <ThemedText size="base" style={[styles.actionText, { color: theme.colors.error }]}>
                Delete Venue
              </ThemedText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statItem: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  venueCard: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  venueImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  venueDetails: {
    flex: 1,
  },
  venueNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  addressText: {
    marginLeft: 4,
    flex: 1,
  },
  venueActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  venueRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 4,
  },
  venueStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statColumn: {
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  actionSheetHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  actionText: {
    marginLeft: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
});