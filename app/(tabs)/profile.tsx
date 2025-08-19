import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { toggleTheme } from '@/store/slices/themeSlice';
import { logout } from '@/store/slices/authSlice';
import { User, Moon, Sun, Settings, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, Bell, CreditCard, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  const handleLogout = () => {
    const actionText = isGuest ? 'Exit Guest Mode' : 'Logout';
    const messageText = isGuest 
      ? 'Are you sure you want to exit guest mode?' 
      : 'Are you sure you want to logout?';
    
    Alert.alert(
      actionText,
      messageText,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: actionText, 
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            router.replace('/');
          }
        },
      ]
    );
  };

  // Show guest profile
  if (isGuest) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <ThemedText size="2xl" weight="bold">
              Profile
            </ThemedText>
          </View>

          {/* Guest Info Card */}
          <View style={[styles.userCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.avatarContainer}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <User size={40} color={theme.colors.accent} />
              </View>
            </View>
            
            <View style={styles.userInfo}>
              <ThemedText size="lg" weight="bold">
                Guest User
              </ThemedText>
              <ThemedText variant="secondary" size="sm">
                Browsing as Guest
              </ThemedText>
              <View style={[styles.roleBadge, { backgroundColor: theme.colors.surface }]}>
                <ThemedText size="xs" weight="medium" style={{ color: theme.colors.primary }}>
                  Guest Mode
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Sign In Prompt */}
          <View style={[styles.signInPrompt, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="base" weight="bold" style={styles.promptTitle}>
              Get the Full Experience
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={styles.promptDescription}>
              Sign in to book venues, track your games, and access all features.
            </ThemedText>
            <View style={styles.promptButtons}>
              <Button
                title="Sign In"
                onPress={() => router.push('/auth/login')}
                size="md"
                style={styles.promptButton}
              />
              <Button
                title="Create Account"
                onPress={() => router.push('/onboarding/get-started')}
                variant="outline"
                size="md"
                style={styles.promptButton}
              />
            </View>
          </View>

          {/* Theme Toggle */}
          <View style={[styles.themeCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.themeInfo}>
              {isDark ? (
                <Moon size={20} color={theme.colors.textSecondary} />
              ) : (
                <Sun size={20} color={theme.colors.textSecondary} />
              )}
              <View style={styles.themeText}>
                <ThemedText size="base" weight="medium">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </ThemedText>
                <ThemedText variant="secondary" size="sm">
                  Switch between light and dark themes
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.themeToggle, 
                { backgroundColor: isDark ? theme.colors.primary : theme.colors.border }
              ]}
              onPress={() => dispatch(toggleTheme())}
            >
              <View style={[
                styles.themeToggleButton,
                {
                  backgroundColor: theme.colors.background,
                  transform: [{ translateX: isDark ? 22 : 2 }],
                }
              ]} />
            </TouchableOpacity>
          </View>

          {/* Exit Guest Mode Button */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={[styles.logoutButton, { borderColor: theme.colors.error }]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <LogOut size={20} color={theme.colors.error} />
              <ThemedText size="base" weight="medium" style={{ color: theme.colors.error, marginLeft: 12 }}>
                Exit Guest Mode
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  const profileItems = [
    {
      icon: <Edit3 size={20} color={theme.colors.textSecondary} />,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => router.push('/profile/edit'),
    },
    {
      icon: <Bell size={20} color={theme.colors.textSecondary} />,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => router.push('/profile/notifications'),
    },
    {
      icon: <CreditCard size={20} color={theme.colors.textSecondary} />,
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => router.push('/profile/payment-methods'),
    },
    {
      icon: <Shield size={20} color={theme.colors.textSecondary} />,
      title: 'Privacy & Security',
      subtitle: 'Control your privacy settings',
      onPress: () => router.push('/profile/privacy'),
    },
    {
      icon: <Settings size={20} color={theme.colors.textSecondary} />,
      title: 'App Settings',
      subtitle: 'Customize your app experience',
      onPress: () => router.push('/profile/settings'),
    },
    {
      icon: <HelpCircle size={20} color={theme.colors.textSecondary} />,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => router.push('/profile/help'),
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText size="2xl" weight="bold">
            Profile
          </ThemedText>
        </View>

        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: theme.colors.background }]}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
                <User size={40} color={theme.colors.accent} />
              </View>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <ThemedText size="lg" weight="bold">
              {user?.name}
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              {user?.email}
            </ThemedText>
            <View style={[styles.roleBadge, { backgroundColor: theme.colors.surface }]}>
              <ThemedText size="xs" weight="medium" style={{ color: theme.colors.primary }}>
                {user?.role === 'venue_owner' ? 'Venue Owner' : 'Player'}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Theme Toggle */}
        <View style={[styles.themeCard, { backgroundColor: theme.colors.background }]}>
          <View style={styles.themeInfo}>
            {isDark ? (
              <Moon size={20} color={theme.colors.textSecondary} />
            ) : (
              <Sun size={20} color={theme.colors.textSecondary} />
            )}
            <View style={styles.themeText}>
              <ThemedText size="base" weight="medium">
                {isDark ? 'Dark Mode' : 'Light Mode'}
              </ThemedText>
              <ThemedText variant="secondary" size="sm">
                Switch between light and dark themes
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.themeToggle, 
              { backgroundColor: isDark ? theme.colors.primary : theme.colors.border }
            ]}
            onPress={() => dispatch(toggleTheme())}
          >
            <View style={[
              styles.themeToggleButton,
              {
                backgroundColor: theme.colors.background,
                transform: [{ translateX: isDark ? 22 : 2 }],
              }
            ]} />
          </TouchableOpacity>
        </View>

        {/* Profile Items */}
        <View style={styles.itemsContainer}>
          {profileItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.profileItem, { backgroundColor: theme.colors.background }]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.itemIcon}>
                {item.icon}
              </View>
              <View style={styles.itemContent}>
                <ThemedText size="base" weight="medium">
                  {item.title}
                </ThemedText>
                <ThemedText variant="secondary" size="sm">
                  {item.subtitle}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: theme.colors.error }]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color={theme.colors.error} />
            <ThemedText size="base" weight="medium" style={{ color: theme.colors.error, marginLeft: 12 }}>
              Logout
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeText: {
    marginLeft: 12,
  },
  themeToggle: {
    width: 48,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    position: 'relative',
  },
  themeToggleButton: {
    width: 24,
    height: 26,
    borderRadius: 13,
    position: 'absolute',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  itemsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemIcon: {
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  logoutContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  signInPrompt: {
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
  promptTitle: {
    marginBottom: 8,
  },
  promptDescription: {
    lineHeight: 18,
    marginBottom: 16,
  },
  promptButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  promptButton: {
    flex: 1,
  },
});