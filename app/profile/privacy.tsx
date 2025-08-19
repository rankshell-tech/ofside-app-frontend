import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Shield, Eye, Users, MapPin, Bell, Trash2 } from 'lucide-react-native';

export default function PrivacySettings() {
  const router = useRouter();
  const theme = useTheme();

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    locationSharing: false,
    activityStatus: true,
    dataCollection: true,
    marketingEmails: false,
    thirdPartySharing: false,
  });

  const toggleSetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Please contact support to delete your account.');
          },
        },
      ]
    );
  };

  const privacyOptions = [
    {
      key: 'profileVisibility' as keyof typeof privacySettings,
      icon: <Eye size={20} color={theme.colors.textSecondary} />,
      title: 'Profile Visibility',
      description: 'Allow other users to see your profile information',
    },
    {
      key: 'locationSharing' as keyof typeof privacySettings,
      icon: <MapPin size={20} color={theme.colors.textSecondary} />,
      title: 'Location Sharing',
      description: 'Share your location to find nearby venues and players',
    },
    {
      key: 'activityStatus' as keyof typeof privacySettings,
      icon: <Users size={20} color={theme.colors.textSecondary} />,
      title: 'Activity Status',
      description: 'Show when you\'re active or recently played',
    },
    {
      key: 'dataCollection' as keyof typeof privacySettings,
      icon: <Shield size={20} color={theme.colors.textSecondary} />,
      title: 'Analytics & Improvement',
      description: 'Help improve the app by sharing usage data',
    },
    {
      key: 'marketingEmails' as keyof typeof privacySettings,
      icon: <Bell size={20} color={theme.colors.textSecondary} />,
      title: 'Marketing Communications',
      description: 'Receive promotional emails and offers',
    },
    {
      key: 'thirdPartySharing' as keyof typeof privacySettings,
      icon: <Users size={20} color={theme.colors.textSecondary} />,
      title: 'Third-party Sharing',
      description: 'Allow sharing data with partner services',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Privacy & Security
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
            Privacy Controls
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={styles.sectionDescription}>
            Control how your information is shared and used
          </ThemedText>
        </View>

        <View style={styles.settingsContainer}>
          {privacyOptions.map((item) => (
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
                value={privacySettings[item.key]}
                onValueChange={() => toggleSetting(item.key)}
                trackColor={{ 
                  false: theme.colors.border, 
                  true: theme.colors.primary 
                }}
                thumbColor={privacySettings[item.key] ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
            Data Management
          </ThemedText>
        </View>

        <View style={styles.dataManagementContainer}>
          <TouchableOpacity 
            style={[styles.dataItem, { backgroundColor: theme.colors.background }]}
            onPress={() => Alert.alert('Export Data', 'Your data export will be sent to your email address within 24 hours.')}
          >
            <View style={styles.dataIcon}>
              <Shield size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.dataContent}>
              <ThemedText size="base" weight="medium">
                Export My Data
              </ThemedText>
              <ThemedText variant="secondary" size="sm">
                Download a copy of your personal data
              </ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dataItem, { backgroundColor: theme.colors.background }]}
            onPress={() => Alert.alert('Clear Cache', 'App cache has been cleared successfully.')}
          >
            <View style={styles.dataIcon}>
              <Trash2 size={20} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.dataContent}>
              <ThemedText size="base" weight="medium">
                Clear App Data
              </ThemedText>
              <ThemedText variant="secondary" size="sm">
                Clear cached data and temporary files
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.warningCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" weight="medium" style={styles.warningTitle}>
            ⚠️ Account Deletion
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.warningText}>
            Deleting your account will permanently remove all your data, bookings, and profile information. This action cannot be undone.
          </ThemedText>
          <Button
            title="Delete Account"
            onPress={handleDeleteAccount}
            variant="outline"
            size="sm"
            style={[styles.deleteButton, { borderColor: theme.colors.error }]}
            textStyle={{ color: theme.colors.error }}
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" weight="medium" style={styles.infoTitle}>
            Privacy Policy
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.infoText}>
            You can manage notification permissions in your device settings. Go to Settings > Apps > Ofside > Notifications to control system-level notification settings.
          </ThemedText>
          <TouchableOpacity style={styles.linkButton}>
            <ThemedText size="xs" style={{ color: theme.colors.primary }}>
              Read Privacy Policy
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
  dataManagementContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  dataItem: {
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
  dataIcon: {
    marginRight: 16,
  },
  dataContent: {
    flex: 1,
  },
  warningCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningTitle: {
    marginBottom: 8,
  },
  warningText: {
    lineHeight: 16,
    marginBottom: 12,
  },
  deleteButton: {
    alignSelf: 'flex-start',
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
    marginBottom: 8,
  },
  linkButton: {
    alignSelf: 'flex-start',
  },
});