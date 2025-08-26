import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Bell, MessageSquare, Calendar, Trophy } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettings() {
  const router = useRouter();
  const theme = useTheme();

  const [settings, setSettings] = useState({
    bookingUpdates: true,
    promotions: false,
    reminders: true,
    community: true,
    tournaments: false,
    venueUpdates: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationTypes = [
    {
      key: 'bookingUpdates' as keyof typeof settings,
      icon: <Calendar size={20} color={theme.colors.textSecondary} />,
      title: 'Booking Updates',
      description: 'Get notified about booking confirmations and changes',
    },
    {
      key: 'reminders' as keyof typeof settings,
      icon: <Bell size={20} color={theme.colors.textSecondary} />,
      title: 'Booking Reminders',
      description: 'Receive reminders before your scheduled games',
    },
    {
      key: 'venueUpdates' as keyof typeof settings,
      icon: <MessageSquare size={20} color={theme.colors.textSecondary} />,
      title: 'Venue Updates',
      description: 'Updates from venues you\'ve booked or follow',
    },
    {
      key: 'community' as keyof typeof settings,
      icon: <MessageSquare size={20} color={theme.colors.textSecondary} />,
      title: 'Community Activity',
      description: 'Messages and activity from your sports community',
    },
    {
      key: 'tournaments' as keyof typeof settings,
      icon: <Trophy size={20} color={theme.colors.textSecondary} />,
      title: 'Tournaments & Events',
      description: 'Notifications about tournaments and special events',
    },
    {
      key: 'promotions' as keyof typeof settings,
      icon: <Bell size={20} color={theme.colors.textSecondary} />,
      title: 'Promotions & Offers',
      description: 'Special deals and promotional offers',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemedText size="lg" weight="bold">
            Notifications
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
              Push Notifications
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={styles.sectionDescription}>
              Choose what notifications you want to receive
            </ThemedText>
          </View>

          <View style={styles.settingsContainer}>
            {notificationTypes.map((item) => (
              <View key={item.key} style={[styles.settingItem, { backgroundColor: theme.colors.background }]}>
                <View style={styles.settingIcon}>
                  {item.icon}
                </View>
                <View style={styles.settingContent}>
                  <ThemedText size="base" weight="medium">
                    {item.title}
                  </ThemedText>
                  <ThemedText variant="secondary" size="sm" style={styles.settingDescription}>
                    {item.description}
                  </ThemedText>
                </View>
                <Switch
                  value={settings[item.key]}
                  onValueChange={() => toggleSetting(item.key)}
                  trackColor={{
                    false: theme.colors.border,
                    true: theme.colors.primary
                  }}
                  thumbColor={settings[item.key] ? theme.colors.accent : theme.colors.textSecondary}
                />
              </View>
            ))}
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <ThemedText size="sm" weight="medium" style={styles.infoTitle}>
              Notification Permissions
            </ThemedText>
            <ThemedText variant="secondary" size="xs" style={styles.infoText}>
              You can manage notification permissions in your device settings. Go to Settings > Apps > SportBook > Notifications to control system-level notification settings.
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
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
    paddingTop: 10,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDescription: {
    lineHeight: 18,
  },
  settingsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  settingItem: {
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
  settingIcon: {
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingDescription: {
    marginTop: 2,
    lineHeight: 16,
  },
  infoCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  infoTitle: {
    marginBottom: 8,
  },
  infoText: {
    lineHeight: 16,
  },
});