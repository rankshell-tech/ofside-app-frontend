import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { toggleTheme } from '@/store/slices/themeSlice';
import { ArrowLeft, Moon, Sun, Globe, Volume2, Smartphone, Download, RefreshCw } from 'lucide-react-native';

export default function AppSettings() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = useSelector((state: RootState) => state.theme.isDark);

  const [settings, setSettings] = useState({
    autoSync: true,
    offlineMode: false,
    soundEffects: true,
    hapticFeedback: true,
    autoDownload: false,
    backgroundRefresh: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLanguageChange = () => {
    Alert.alert('Language Settings', 'Multiple language support coming soon!');
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and temporary files. The app may take longer to load initially.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully!');
          },
        },
      ]
    );
  };

  const appSettings = [
    {
      key: 'autoSync' as keyof typeof settings,
      icon: <RefreshCw size={20} color={theme.colors.textSecondary} />,
      title: 'Auto Sync',
      description: 'Automatically sync data when connected to WiFi',
    },
    {
      key: 'offlineMode' as keyof typeof settings,
      icon: <Download size={20} color={theme.colors.textSecondary} />,
      title: 'Offline Mode',
      description: 'Download content for offline access',
    },
    {
      key: 'soundEffects' as keyof typeof settings,
      icon: <Volume2 size={20} color={theme.colors.textSecondary} />,
      title: 'Sound Effects',
      description: 'Play sounds for app interactions',
    },
    {
      key: 'hapticFeedback' as keyof typeof settings,
      icon: <Smartphone size={20} color={theme.colors.textSecondary} />,
      title: 'Haptic Feedback',
      description: 'Vibrate on touch interactions',
    },
    {
      key: 'backgroundRefresh' as keyof typeof settings,
      icon: <RefreshCw size={20} color={theme.colors.textSecondary} />,
      title: 'Background Refresh',
      description: 'Update content in the background',
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          App Settings
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Theme Settings */}
        <View style={styles.section}>
          <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
            Appearance
          </ThemedText>
        </View>

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
          <Switch
            value={isDark}
            onValueChange={() => dispatch(toggleTheme())}
            trackColor={{ 
              false: theme.colors.border, 
              true: theme.colors.primary 
            }}
            thumbColor={isDark ? theme.colors.accent : theme.colors.textSecondary}
          />
        </View>

        {/* Language Settings */}
        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: theme.colors.background }]}
          onPress={handleLanguageChange}
        >
          <View style={styles.settingIcon}>
            <Globe size={20} color={theme.colors.textSecondary} />
          </View>
          <View style={styles.settingContent}>
            <ThemedText size="base" weight="medium">
              Language
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              English (US)
            </ThemedText>
          </View>
        </TouchableOpacity>

        {/* App Behavior */}
        <View style={styles.section}>
          <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
            App Behavior
          </ThemedText>
        </View>

        <View style={styles.settingsContainer}>
          {appSettings.map((item) => (
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

        {/* Storage & Data */}
        <View style={styles.section}>
          <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
            Storage & Data
          </ThemedText>
        </View>

        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: theme.colors.background }]}
          onPress={handleClearCache}
        >
          <View style={styles.settingIcon}>
            <RefreshCw size={20} color={theme.colors.textSecondary} />
          </View>
          <View style={styles.settingContent}>
            <ThemedText size="base" weight="medium">
              Clear Cache
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Free up storage space by clearing cached data
            </ThemedText>
          </View>
        </TouchableOpacity>

        <View style={[styles.storageCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" weight="medium" style={styles.storageTitle}>
            Storage Usage
          </ThemedText>
          <View style={styles.storageInfo}>
            <View style={styles.storageItem}>
              <ThemedText variant="secondary" size="xs">App Data:</ThemedText>
              <ThemedText size="xs" weight="medium">12.5 MB</ThemedText>
            </View>
            <View style={styles.storageItem}>
              <ThemedText variant="secondary" size="xs">Cache:</ThemedText>
              <ThemedText size="xs" weight="medium">8.2 MB</ThemedText>
            </View>
            <View style={styles.storageItem}>
              <ThemedText variant="secondary" size="xs">Images:</ThemedText>
              <ThemedText size="xs" weight="medium">24.1 MB</ThemedText>
            </View>
          </View>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" weight="medium" style={styles.infoTitle}>
            App Version
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.infoText}>
            Ofside v1.0.0 (Build 1)
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.infoText}>
            Last updated: January 2025
          </ThemedText>
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
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  settingsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
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
  storageCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  storageTitle: {
    marginBottom: 12,
  },
  storageInfo: {
    gap: 8,
  },
  storageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 2,
  },
});