import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { BookingCard } from '@/components/ui/BookingCard';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';
import { Building, Plus, Calendar, DollarSign, TrendingUp, Users, Settings, Clock } from 'lucide-react-native';

export default function BookingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const isVenueOwner = user?.role === 'venue_owner';
  const isAdmin = user?.role === 'admin';

  // Show login prompt for guests
  if (isGuest) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText size="2xl" weight="bold">
            My Bookings
          </ThemedText>
        </View>
        
        <View style={styles.guestPrompt}>
          <ThemedText size="lg" weight="medium" style={styles.guestTitle}>
            Sign in to view your bookings
          </ThemedText>
          <ThemedText variant="secondary" size="base" style={styles.guestDescription}>
            Create an account or sign in to manage your venue bookings and track your game history.
          </ThemedText>
          <Button
            title="Sign In"
            onPress={() => router.push('/auth/login')}
            size="lg"
            style={styles.signInButton}
          />
          <Button
            title="Create Account"
            onPress={() => router.push('/onboarding/get-started')}
            variant="outline"
            size="lg"
            style={styles.createAccountButton}
          />
        </View>
      </ThemedView>
    );
  }

  // Admin Panel
  if (isAdmin) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText size="2xl" weight="bold">
            Admin Panel
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/admin/settings')}>
            <Settings size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.primary }]}>
                <Users size={20} color={theme.colors.accent} />
              </View>
              <ThemedText size="2xl" weight="bold">1,247</ThemedText>
              <ThemedText variant="secondary" size="sm">Total Users</ThemedText>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.success }]}>
                <Building size={20} color={theme.colors.background} />
              </View>
              <ThemedText size="2xl" weight="bold">89</ThemedText>
              <ThemedText variant="secondary" size="sm">Active Venues</ThemedText>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.accent }]}>
                <Calendar size={20} color={theme.colors.background} />
              </View>
              <ThemedText size="2xl" weight="bold">3,456</ThemedText>
              <ThemedText variant="secondary" size="sm">Total Bookings</ThemedText>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.warning }]}>
                <DollarSign size={20} color={theme.colors.background} />
              </View>
              <ThemedText size="2xl" weight="bold">$45.2K</ThemedText>
              <ThemedText variant="secondary" size="sm">Revenue</ThemedText>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Quick Actions
            </ThemedText>
            <View style={styles.actionsGrid}>
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/admin/users')}
              >
                <Users size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  Manage Users
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/admin/venues')}
              >
                <Building size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  Manage Venues
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/admin/bookings')}
              >
                <Calendar size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  View Bookings
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/admin/analytics')}
              >
                <TrendingUp size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  Analytics
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Recent Activity
            </ThemedText>
            <View style={[styles.activityCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: theme.colors.success }]}>
                  <Users size={16} color={theme.colors.background} />
                </View>
                <View style={styles.activityContent}>
                  <ThemedText size="sm" weight="medium">New user registered</ThemedText>
                  <ThemedText variant="secondary" size="xs">john.doe@example.com • 2 min ago</ThemedText>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: theme.colors.primary }]}>
                  <Building size={16} color={theme.colors.accent} />
                </View>
                <View style={styles.activityContent}>
                  <ThemedText size="sm" weight="medium">Venue approved</ThemedText>
                  <ThemedText variant="secondary" size="xs">Elite Sports Complex • 15 min ago</ThemedText>
                </View>
              </View>

              <View style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: theme.colors.accent }]}>
                  <Calendar size={16} color={theme.colors.background} />
                </View>
                <View style={styles.activityContent}>
                  <ThemedText size="sm" weight="medium">Booking completed</ThemedText>
                  <ThemedText variant="secondary" size="xs">Court A - Tennis • 1 hour ago</ThemedText>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  // Mock data for venue owner dashboard
  const ownerStats = {
    totalBookings: 156,
    monthlyEarnings: 4250,
    activeVenues: 3,
    todayBookings: 12,
  };

  const todayBookings = [
    { id: '1', venue: 'Elite Sports Complex', court: 'Court A', time: '10:00 AM', player: 'John Doe', status: 'confirmed' },
    { id: '2', venue: 'Elite Sports Complex', court: 'Court B', time: '2:00 PM', player: 'Jane Smith', status: 'pending' },
    { id: '3', venue: 'Urban Football Hub', court: 'Field A', time: '4:00 PM', player: 'Mike Johnson', status: 'confirmed' },
  ];

  // Venue Owner Dashboard
  if (isVenueOwner) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText size="2xl" weight="bold">
            Owner Dashboard
          </ThemedText>
          <TouchableOpacity onPress={() => router.push('/venue-owner/add-venue')}>
            <Plus size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.primary }]}>
                <Calendar size={20} color={theme.colors.accent} />
              </View>
              <ThemedText size="2xl" weight="bold">{ownerStats.totalBookings}</ThemedText>
              <ThemedText variant="secondary" size="sm">Total Bookings</ThemedText>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.accent }]}>
                <DollarSign size={20} color={theme.colors.background} />
              </View>
              <ThemedText size="2xl" weight="bold">${ownerStats.monthlyEarnings}</ThemedText>
              <ThemedText variant="secondary" size="sm">Monthly Earnings</ThemedText>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.success }]}>
                <Building size={20} color={theme.colors.background} />
              </View>
              <ThemedText size="2xl" weight="bold">{ownerStats.activeVenues}</ThemedText>
              <ThemedText variant="secondary" size="sm">Active Venues</ThemedText>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
              <View style={[styles.statIcon, { backgroundColor: theme.colors.warning }]}>
                <Users size={20} color={theme.colors.background} />
              </View>
              <ThemedText size="2xl" weight="bold">{ownerStats.todayBookings}</ThemedText>
              <ThemedText variant="secondary" size="sm">Today's Bookings</ThemedText>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Quick Actions
            </ThemedText>
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/venue-owner/add-venue')}
              >
                <Plus size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  Add Venue
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/venue-owner/manage-bookings')}
              >
                <Calendar size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  Manage Bookings
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/venue-owner/manage-slots')}
              >
                <Clock size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  Manage Slots
                </ThemedText>
              </TouchableOpacity>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/venue-owner/pricing')}
              >
                <DollarSign size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  Set Pricing
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/venue-owner/earnings')}
              >
                <TrendingUp size={24} color={theme.colors.primary} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  View Earnings
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
                onPress={() => router.push('/venue-owner/withdraw')}
              >
                <DollarSign size={24} color={theme.colors.success} />
                <ThemedText size="sm" weight="medium" style={styles.actionText}>
                  Withdraw Funds
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's Bookings */}
          <View style={styles.section}>
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Today's Bookings
            </ThemedText>
            {todayBookings.map((booking) => (
              <View key={booking.id} style={[styles.bookingRow, { backgroundColor: theme.colors.background }]}>
                <View style={styles.bookingInfo}>
                  <ThemedText size="base" weight="medium">{booking.venue}</ThemedText>
                  <ThemedText variant="secondary" size="sm">
                    {booking.court} • {booking.time} • {booking.player}
                  </ThemedText>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: booking.status === 'confirmed' ? theme.colors.success : theme.colors.warning }
                ]}>
                  <ThemedText size="xs" weight="medium" style={{ color: theme.colors.background }}>
                    {booking.status.toUpperCase()}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  // Original player bookings screen
  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' && new Date(b.date) >= new Date()
  );

  const pastBookings = bookings.filter(b => 
    b.status === 'confirmed' && new Date(b.date) < new Date()
  );

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText size="2xl" weight="bold">
          My Bookings
        </ThemedText>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === 'upcoming' ? theme.colors.primary : 'transparent',
              },
            ]}
            onPress={() => setActiveTab('upcoming')}
          >
            <ThemedText
              size="sm"
              weight="medium"
              style={{
                color: activeTab === 'upcoming' ? theme.colors.accent : theme.colors.textSecondary,
              }}
            >
              Upcoming ({upcomingBookings.length})
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === 'past' ? theme.colors.primary : 'transparent',
              },
            ]}
            onPress={() => setActiveTab('past')}
          >
            <ThemedText
              size="sm"
              weight="medium"
              style={{
                color: activeTab === 'past' ? theme.colors.accent : theme.colors.textSecondary,
              }}
            >
              Past ({pastBookings.length})
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentBookings.length > 0 ? (
          currentBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <ThemedText size="lg" weight="medium" style={styles.emptyTitle}>
              No {activeTab} bookings
            </ThemedText>
            <ThemedText variant="secondary" size="base" style={styles.emptyDescription}>
              {activeTab === 'upcoming' 
                ? 'Book a venue to see your upcoming reservations here.'
                : 'Your completed bookings will appear here.'
              }
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    flexWrap: 'wrap',
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    minWidth: '45%',
  },
  actionText: {
    marginTop: 8,
    textAlign: 'center',
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  bookingInfo: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  guestPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  guestTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  guestDescription: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  signInButton: {
    width: '100%',
    marginBottom: 12,
  },
  createAccountButton: {
    width: '100%',
  },
  activityCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
});