import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Search, Filter, Calendar, Clock, User, MapPin, DollarSign, TrendingUp, Download } from 'lucide-react-native';

interface AdminBooking {
  id: string;
  playerName: string;
  playerEmail: string;
  venueName: string;
  courtName: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  venueOwner: string;
}

export default function AdminBookings() {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed'>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Mock bookings data - replace with API call
  const [bookings, setBookings] = useState<AdminBooking[]>([
    {
      id: '1',
      playerName: 'John Doe',
      playerEmail: 'john.doe@example.com',
      venueName: 'Elite Sports Complex',
      courtName: 'Court A',
      date: '2025-01-25',
      startTime: '14:00',
      endTime: '16:00',
      totalPrice: 100,
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2025-01-20T10:30:00Z',
      venueOwner: 'John Smith',
    },
    {
      id: '2',
      playerName: 'Jane Smith',
      playerEmail: 'jane.smith@example.com',
      venueName: 'Urban Football Hub',
      courtName: 'Field A',
      date: '2025-01-26',
      startTime: '10:00',
      endTime: '12:00',
      totalPrice: 160,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2025-01-21T15:45:00Z',
      venueOwner: 'Jane Doe',
    },
    {
      id: '3',
      playerName: 'Mike Johnson',
      playerEmail: 'mike.johnson@example.com',
      venueName: 'Ace Tennis Club',
      courtName: 'Court 1',
      date: '2025-01-24',
      startTime: '16:00',
      endTime: '17:00',
      totalPrice: 60,
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2025-01-19T09:15:00Z',
      venueOwner: 'Mike Johnson',
    },
    {
      id: '4',
      playerName: 'Sarah Wilson',
      playerEmail: 'sarah.wilson@example.com',
      venueName: 'Elite Sports Complex',
      courtName: 'Court B',
      date: '2025-01-23',
      startTime: '18:00',
      endTime: '19:00',
      totalPrice: 50,
      status: 'cancelled',
      paymentStatus: 'refunded',
      createdAt: '2025-01-18T14:20:00Z',
      venueOwner: 'John Smith',
    },
  ]);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.venueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         booking.playerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || booking.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'cancelled': return theme.colors.error;
      case 'completed': return theme.colors.accent;
      default: return theme.colors.textSecondary;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'failed': return theme.colors.error;
      case 'refunded': return theme.colors.textSecondary;
      default: return theme.colors.textSecondary;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const totalRevenue = filteredBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const handleExportData = () => {
    Alert.alert('Export Data', 'Booking data will be exported to CSV format.');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          All Bookings
        </ThemedText>
        <TouchableOpacity onPress={handleExportData}>
          <Download size={24} color={theme.colors.primary} />
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
            placeholder="Search bookings..."
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
            {['all', 'confirmed', 'pending', 'cancelled', 'completed'].map((filter) => (
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
          <ThemedText size="xl" weight="bold">{filteredBookings.length}</ThemedText>
          <ThemedText variant="secondary" size="sm">Total Bookings</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">{filteredBookings.filter(b => b.status === 'confirmed').length}</ThemedText>
          <ThemedText variant="secondary" size="sm">Confirmed</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">${totalRevenue}</ThemedText>
          <ThemedText variant="secondary" size="sm">Revenue</ThemedText>
        </View>
      </View>

      {/* Bookings List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <View key={booking.id} style={[styles.bookingCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.bookingHeader}>
                <View style={styles.playerInfo}>
                  <View style={[styles.playerAvatar, { backgroundColor: theme.colors.primary }]}>
                    <User size={20} color={theme.colors.accent} />
                  </View>
                  <View style={styles.playerDetails}>
                    <ThemedText size="base" weight="bold">
                      {booking.playerName}
                    </ThemedText>
                    <ThemedText variant="secondary" size="sm">
                      {booking.playerEmail}
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                    <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                      {booking.status.toUpperCase()}
                    </ThemedText>
                  </View>
                  <View style={[styles.paymentBadge, { backgroundColor: getPaymentStatusColor(booking.paymentStatus) }]}>
                    <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                      {booking.paymentStatus.toUpperCase()}
                    </ThemedText>
                  </View>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={16} color={theme.colors.textSecondary} />
                  <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                    {booking.venueName} • {booking.courtName}
                  </ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <Calendar size={16} color={theme.colors.textSecondary} />
                  <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                    {formatDate(booking.date)}
                  </ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <Clock size={16} color={theme.colors.textSecondary} />
                  <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <DollarSign size={16} color={theme.colors.textSecondary} />
                  <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                    ${booking.totalPrice} • Owner: {booking.venueOwner}
                  </ThemedText>
                </View>
              </View>

              <ThemedText variant="secondary" size="xs" style={styles.createdTime}>
                Created {new Date(booking.createdAt).toLocaleDateString()} at{' '}
                {new Date(booking.createdAt).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                })}
              </ThemedText>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={48} color={theme.colors.textSecondary} />
            <ThemedText size="lg" weight="medium" style={styles.emptyTitle}>
              No bookings found
            </ThemedText>
            <ThemedText variant="secondary" size="base" style={styles.emptyDescription}>
              Try adjusting your search or filter criteria.
            </ThemedText>
          </View>
        )}
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
  bookingCard: {
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
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  playerDetails: {
    flex: 1,
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
  },
  createdTime: {
    textAlign: 'right',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
});