import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Calendar, Clock, User, MapPin, Check, X, Filter } from 'lucide-react-native';

interface BookingRequest {
  id: string;
  playerName: string;
  playerEmail: string;
  venue: string;
  court: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'rejected';
  requestedAt: string;
}

export default function ManageBookings() {
  const router = useRouter();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'all'>('pending');

  // Mock booking data
  const [bookings, setBookings] = useState<BookingRequest[]>([
    {
      id: '1',
      playerName: 'John Doe',
      playerEmail: 'john@example.com',
      venue: 'Elite Sports Complex',
      court: 'Court A',
      date: '2025-01-25',
      startTime: '14:00',
      endTime: '16:00',
      totalPrice: 100,
      status: 'pending',
      requestedAt: '2025-01-20T10:30:00Z',
    },
    {
      id: '2',
      playerName: 'Jane Smith',
      playerEmail: 'jane@example.com',
      venue: 'Elite Sports Complex',
      court: 'Court B',
      date: '2025-01-26',
      startTime: '10:00',
      endTime: '11:00',
      totalPrice: 50,
      status: 'pending',
      requestedAt: '2025-01-20T15:45:00Z',
    },
    {
      id: '3',
      playerName: 'Mike Johnson',
      playerEmail: 'mike@example.com',
      venue: 'Urban Football Hub',
      court: 'Field A',
      date: '2025-01-24',
      startTime: '16:00',
      endTime: '18:00',
      totalPrice: 160,
      status: 'confirmed',
      requestedAt: '2025-01-19T09:15:00Z',
    },
  ]);

  const handleBookingAction = (bookingId: string, action: 'accept' | 'reject') => {
    const actionText = action === 'accept' ? 'accept' : 'reject';
    Alert.alert(
      `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Booking`,
      `Are you sure you want to ${actionText} this booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionText.charAt(0).toUpperCase() + actionText.slice(1),
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: () => {
            setBookings(prev =>
              prev.map(booking =>
                booking.id === bookingId
                  ? { ...booking, status: action === 'accept' ? 'confirmed' : 'rejected' }
                  : booking
              )
            );
            Alert.alert('Success', `Booking ${action === 'accept' ? 'accepted' : 'rejected'} successfully!`);
          },
        },
      ]
    );
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'rejected': return theme.colors.error;
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

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Manage Bookings
        </ThemedText>
        <TouchableOpacity>
          <Filter size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'pending' ? theme.colors.primary : 'transparent',
            },
          ]}
          onPress={() => setActiveTab('pending')}
        >
          <ThemedText
            size="sm"
            weight="medium"
            style={{
              color: activeTab === 'pending' ? theme.colors.accent : theme.colors.textSecondary,
            }}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'confirmed' ? theme.colors.primary : 'transparent',
            },
          ]}
          onPress={() => setActiveTab('confirmed')}
        >
          <ThemedText
            size="sm"
            weight="medium"
            style={{
              color: activeTab === 'confirmed' ? theme.colors.accent : theme.colors.textSecondary,
            }}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'all' ? theme.colors.primary : 'transparent',
            },
          ]}
          onPress={() => setActiveTab('all')}
        >
          <ThemedText
            size="sm"
            weight="medium"
            style={{
              color: activeTab === 'all' ? theme.colors.accent : theme.colors.textSecondary,
            }}
          >
            All ({bookings.length})
          </ThemedText>
        </TouchableOpacity>
      </View>

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
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                  <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                    {booking.status.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={16} color={theme.colors.textSecondary} />
                  <ThemedText variant="secondary" size="sm" style={styles.detailText}>
                    {booking.venue} • {booking.court}
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
              </View>

              <View style={styles.bookingFooter}>
                <ThemedText size="lg" weight="bold" style={{ color: theme.colors.text }}>
                  ${booking.totalPrice}
                </ThemedText>

                {booking.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.rejectButton, { borderColor: theme.colors.error }]}
                      onPress={() => handleBookingAction(booking.id, 'reject')}
                    >
                      <X size={16} color={theme.colors.error} />
                      <ThemedText size="sm" style={{ color: theme.colors.error, marginLeft: 4 }}>
                        Reject
                      </ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.acceptButton, { backgroundColor: theme.colors.success }]}
                      onPress={() => handleBookingAction(booking.id, 'accept')}
                    >
                      <Check size={16} color={theme.colors.background} />
                      <ThemedText size="sm" style={{ color: theme.colors.background, marginLeft: 4 }}>
                        Accept
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <ThemedText variant="secondary" size="xs" style={styles.requestTime}>
                Requested {new Date(booking.requestedAt).toLocaleDateString()} at{' '}
                {new Date(booking.requestedAt).toLocaleTimeString('en-US', {
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
              No {activeTab === 'all' ? '' : activeTab} bookings
            </ThemedText>
            <ThemedText variant="secondary" size="base" style={styles.emptyDescription}>
              {activeTab === 'pending'
                ? 'New booking requests will appear here.'
                : activeTab === 'confirmed'
                ? 'Confirmed bookings will be shown here.'
                : 'All booking requests will be displayed here.'}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  requestTime: {
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