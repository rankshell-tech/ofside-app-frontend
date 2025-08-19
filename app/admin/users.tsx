import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Search, Filter, Plus, User, Mail, Phone, MoveVertical as MoreVertical, CreditCard as Edit, Trash2, Shield, Ban } from 'lucide-react-native';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'player' | 'venue_owner' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  joinedDate: string;
  lastActive: string;
  totalBookings: number;
  totalSpent: number;
}

export default function AdminUsers() {
  const router = useRouter();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'player' | 'venue_owner' | 'admin'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserActions, setShowUserActions] = useState(false);

  // Mock users data - replace with API call
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      role: 'player',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: '2025-01-20',
      totalBookings: 25,
      totalSpent: 1250,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567891',
      role: 'venue_owner',
      status: 'active',
      joinedDate: '2024-02-10',
      lastActive: '2025-01-19',
      totalBookings: 0,
      totalSpent: 0,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1234567892',
      role: 'player',
      status: 'suspended',
      joinedDate: '2024-03-05',
      lastActive: '2025-01-18',
      totalBookings: 8,
      totalSpent: 400,
    },
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleUserAction = (action: string, user: AdminUser) => {
    setShowUserActions(false);
    
    switch (action) {
      case 'view':
        router.push(`/admin/user-details/${user.id}`);
        break;
      case 'edit':
        // Navigate to edit user screen
        Alert.alert('Edit User', `Edit functionality for ${user.name}`);
        break;
      case 'suspend':
        Alert.alert(
          'Suspend User',
          `Are you sure you want to suspend ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Suspend',
              style: 'destructive',
              onPress: () => {
                setUsers(prev => prev.map(u => 
                  u.id === user.id ? { ...u, status: 'suspended' as const } : u
                ));
              }
            }
          ]
        );
        break;
      case 'activate':
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, status: 'active' as const } : u
        ));
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                setUsers(prev => prev.filter(u => u.id !== user.id));
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
      case 'suspended': return theme.colors.error;
      case 'pending': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield size={16} color={theme.colors.primary} />;
      case 'venue_owner': return <User size={16} color={theme.colors.accent} />;
      default: return <User size={16} color={theme.colors.textSecondary} />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Manage Users
        </ThemedText>
        <TouchableOpacity onPress={() => Alert.alert('Add User', 'Add new user functionality')}>
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
            placeholder="Search users..."
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
            {['all', 'player', 'venue_owner', 'admin'].map((filter) => (
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
                  {filter.charAt(0).toUpperCase() + filter.slice(1).replace('_', ' ')}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">{filteredUsers.length}</ThemedText>
          <ThemedText variant="secondary" size="sm">Total Users</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">{filteredUsers.filter(u => u.status === 'active').length}</ThemedText>
          <ThemedText variant="secondary" size="sm">Active</ThemedText>
        </View>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">{filteredUsers.filter(u => u.status === 'suspended').length}</ThemedText>
          <ThemedText variant="secondary" size="sm">Suspended</ThemedText>
        </View>
      </View>

      {/* Users List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={[styles.userCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.userHeader}>
              <View style={styles.userInfo}>
                <View style={[styles.userAvatar, { backgroundColor: theme.colors.primary }]}>
                  <User size={20} color={theme.colors.accent} />
                </View>
                <View style={styles.userDetails}>
                  <View style={styles.userNameRow}>
                    <ThemedText size="base" weight="bold">{user.name}</ThemedText>
                    {getRoleIcon(user.role)}
                  </View>
                  <ThemedText variant="secondary" size="sm">{user.email}</ThemedText>
                  <ThemedText variant="secondary" size="xs">{user.phone}</ThemedText>
                </View>
              </View>
              <View style={styles.userActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
                  <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background }}>
                    {user.status.toUpperCase()}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedUser(user);
                    setShowUserActions(true);
                  }}
                >
                  <MoreVertical size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.userStats}>
              <View style={styles.statColumn}>
                <ThemedText variant="secondary" size="xs">Joined</ThemedText>
                <ThemedText size="sm" weight="medium">
                  {new Date(user.joinedDate).toLocaleDateString()}
                </ThemedText>
              </View>
              <View style={styles.statColumn}>
                <ThemedText variant="secondary" size="xs">Last Active</ThemedText>
                <ThemedText size="sm" weight="medium">
                  {new Date(user.lastActive).toLocaleDateString()}
                </ThemedText>
              </View>
              <View style={styles.statColumn}>
                <ThemedText variant="secondary" size="xs">Bookings</ThemedText>
                <ThemedText size="sm" weight="medium">{user.totalBookings}</ThemedText>
              </View>
              <View style={styles.statColumn}>
                <ThemedText variant="secondary" size="xs">Spent</ThemedText>
                <ThemedText size="sm" weight="medium">${user.totalSpent}</ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* User Actions Modal */}
      <Modal
        visible={showUserActions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserActions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowUserActions(false)}
        >
          <View style={[styles.actionSheet, { backgroundColor: theme.colors.background }]}>
            <View style={styles.actionSheetHeader}>
              <ThemedText size="lg" weight="bold">User Actions</ThemedText>
              <ThemedText variant="secondary" size="sm">{selectedUser?.name}</ThemedText>
            </View>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleUserAction('view', selectedUser!)}
            >
              <User size={20} color={theme.colors.text} />
              <ThemedText size="base" style={styles.actionText}>View Details</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleUserAction('edit', selectedUser!)}
            >
              <Edit size={20} color={theme.colors.text} />
              <ThemedText size="base" style={styles.actionText}>Edit User</ThemedText>
            </TouchableOpacity>

            {selectedUser?.status === 'active' ? (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => handleUserAction('suspend', selectedUser!)}
              >
                <Ban size={20} color={theme.colors.warning} />
                <ThemedText size="base" style={[styles.actionText, { color: theme.colors.warning }]}>
                  Suspend User
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => handleUserAction('activate', selectedUser!)}
              >
                <Shield size={20} color={theme.colors.success} />
                <ThemedText size="base" style={[styles.actionText, { color: theme.colors.success }]}>
                  Activate User
                </ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleUserAction('delete', selectedUser!)}
            >
              <Trash2 size={20} color={theme.colors.error} />
              <ThemedText size="base" style={[styles.actionText, { color: theme.colors.error }]}>
                Delete User
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
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  userStats: {
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