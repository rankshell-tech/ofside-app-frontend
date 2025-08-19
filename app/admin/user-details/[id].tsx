import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, DollarSign, Shield, Ban, Trash2, CreditCard as Edit } from 'lucide-react-native';

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'player' | 'venue_owner' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  lastActive: string;
  location: string;
  avatar?: string;
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  preferredSports: string[];
  paymentMethods: number;
  referralCode: string;
  referredUsers: number;
}

export default function UserDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data - replace with API call
  const userData: UserDetails = {
    id: id || '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    role: 'player',
    status: 'active',
    joinedDate: '2024-01-15',
    lastActive: '2025-01-20',
    location: 'New York, NY',
    totalBookings: 25,
    totalSpent: 1250,
    averageRating: 4.8,
    preferredSports: ['Tennis', 'Basketball', 'Football'],
    paymentMethods: 2,
    referralCode: 'JOHN2025',
    referredUsers: 3,
  };

  const handleUserAction = (action: string) => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      
      switch (action) {
        case 'suspend':
          Alert.alert('Success', `${userData.name} has been suspended.`);
          break;
        case 'activate':
          Alert.alert('Success', `${userData.name} has been activated.`);
          break;
        case 'delete':
          Alert.alert('Success', `${userData.name} has been deleted.`, [
            { text: 'OK', onPress: () => router.back() }
          ]);
          break;
        case 'edit':
          Alert.alert('Edit User', 'Edit functionality will be implemented.');
          break;
      }
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success;
      case 'suspended': return theme.colors.error;
      case 'pending': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield size={20} color={theme.colors.primary} />;
      case 'venue_owner': return <User size={20} color={theme.colors.accent} />;
      default: return <User size={20} color={theme.colors.textSecondary} />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          User Details
        </ThemedText>
        <TouchableOpacity onPress={() => handleUserAction('edit')}>
          <Edit size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.background }]}>
          <View style={styles.profileHeader}>
            <View style={[styles.userAvatar, { backgroundColor: theme.colors.primary }]}>
              <User size={32} color={theme.colors.accent} />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <ThemedText size="xl" weight="bold">{userData.name}</ThemedText>
                {getRoleIcon(userData.role)}
              </View>
              <ThemedText variant="secondary" size="base">{userData.email}</ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(userData.status) }]}>
                <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                  {userData.status.toUpperCase()}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Phone size={16} color={theme.colors.textSecondary} />
              <ThemedText variant="secondary" size="sm" style={styles.contactText}>
                {userData.phone}
              </ThemedText>
            </View>
            <View style={styles.contactRow}>
              <MapPin size={16} color={theme.colors.textSecondary} />
              <ThemedText variant="secondary" size="sm" style={styles.contactText}>
                {userData.location}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold">{userData.totalBookings}</ThemedText>
            <ThemedText variant="secondary" size="sm">Total Bookings</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold">${userData.totalSpent}</ThemedText>
            <ThemedText variant="secondary" size="sm">Total Spent</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold">{userData.averageRating.toFixed(1)}</ThemedText>
            <ThemedText variant="secondary" size="sm">Avg Rating</ThemedText>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold">{userData.referredUsers}</ThemedText>
            <ThemedText variant="secondary" size="sm">Referrals</ThemedText>
          </View>
        </View>

        {/* Account Details */}
        <View style={[styles.detailsCard, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="lg" weight="bold" style={styles.cardTitle}>
            Account Information
          </ThemedText>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <ThemedText variant="secondary" size="sm">Member Since</ThemedText>
              <ThemedText size="base" weight="medium">
                {new Date(userData.joinedDate).toLocaleDateString()}
              </ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <ThemedText variant="secondary" size="sm">Last Active</ThemedText>
              <ThemedText size="base" weight="medium">
                {new Date(userData.lastActive).toLocaleDateString()}
              </ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <ThemedText variant="secondary" size="sm">Role</ThemedText>
              <ThemedText size="base" weight="medium">
                {userData.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <ThemedText variant="secondary" size="sm">Payment Methods</ThemedText>
              <ThemedText size="base" weight="medium">{userData.paymentMethods}</ThemedText>
            </View>
            
            <View style={styles.detailItem}>
              <ThemedText variant="secondary" size="sm">Referral Code</ThemedText>
              <ThemedText size="base" weight="medium">{userData.referralCode}</ThemedText>
            </View>
          </View>
        </View>

        {/* Preferred Sports */}
        <View style={[styles.sportsCard, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="lg" weight="bold" style={styles.cardTitle}>
            Preferred Sports
          </ThemedText>
          <View style={styles.sportsContainer}>
            {userData.preferredSports.map((sport, index) => (
              <View key={index} style={[styles.sportChip, { backgroundColor: theme.colors.surface }]}>
                <ThemedText size="sm" style={{ color: theme.colors.textSecondary }}>
                  {sport}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {userData.status === 'active' ? (
            <Button
              title={isLoading ? "Suspending..." : "Suspend User"}
              onPress={() => {
                Alert.alert(
                  'Suspend User',
                  `Are you sure you want to suspend ${userData.name}?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Suspend', style: 'destructive', onPress: () => handleUserAction('suspend') }
                  ]
                );
              }}
              disabled={isLoading}
              variant="outline"
              style={[styles.actionButton, { borderColor: theme.colors.warning }]}
              textStyle={{ color: theme.colors.warning }}
            />
          ) : (
            <Button
              title={isLoading ? "Activating..." : "Activate User"}
              onPress={() => handleUserAction('activate')}
              disabled={isLoading}
              variant="outline"
              style={[styles.actionButton, { borderColor: theme.colors.success }]}
              textStyle={{ color: theme.colors.success }}
            />
          )}

          <Button
            title={isLoading ? "Deleting..." : "Delete User"}
            onPress={() => {
              Alert.alert(
                'Delete User',
                `Are you sure you want to permanently delete ${userData.name}? This action cannot be undone.`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => handleUserAction('delete') }
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  contactInfo: {
    gap: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 8,
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
  detailsCard: {
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
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportsCard: {
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
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportChip: {
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