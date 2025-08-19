import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Settings, Bell, Shield, Globe, Database, Mail, Smartphone, Save } from 'lucide-react-native';

export default function AdminSettings() {
  const router = useRouter();
  const theme = useTheme();

  const [settings, setSettings] = useState({
    // System Settings
    maintenanceMode: false,
    autoApproveVenues: false,
    requireEmailVerification: true,
    enablePushNotifications: true,
    
    // Business Settings
    platformCommission: '15',
    minimumBookingAmount: '25',
    cancellationWindow: '24',
    refundProcessingDays: '5',
    
    // Communication Settings
    adminEmail: 'admin@ofside.com',
    supportEmail: 'support@ofside.com',
    smsProvider: 'twilio',
    emailProvider: 'sendgrid',
    
    // Security Settings
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    passwordMinLength: '8',
    requireTwoFactor: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const updateSetting = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Settings updated successfully!');
    }, 1500);
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setSettings({
              maintenanceMode: false,
              autoApproveVenues: false,
              requireEmailVerification: true,
              enablePushNotifications: true,
              platformCommission: '15',
              minimumBookingAmount: '25',
              cancellationWindow: '24',
              refundProcessingDays: '5',
              adminEmail: 'admin@ofside.com',
              supportEmail: 'support@ofside.com',
              smsProvider: 'twilio',
              emailProvider: 'sendgrid',
              sessionTimeout: '30',
              maxLoginAttempts: '5',
              passwordMinLength: '8',
              requireTwoFactor: false,
            });
            Alert.alert('Success', 'Settings reset to defaults!');
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Admin Settings
        </ThemedText>
        <TouchableOpacity onPress={handleSaveSettings}>
          <Save size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* System Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color={theme.colors.primary} />
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              System Settings
            </ThemedText>
          </View>

          <View style={[styles.settingsCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText size="base" weight="medium">Maintenance Mode</ThemedText>
                <ThemedText variant="secondary" size="sm">
                  Temporarily disable the platform for maintenance
                </ThemedText>
              </View>
              <Switch
                value={settings.maintenanceMode}
                onValueChange={() => toggleSetting('maintenanceMode')}
                trackColor={{ false: theme.colors.border, true: theme.colors.error }}
                thumbColor={settings.maintenanceMode ? theme.colors.background : theme.colors.textSecondary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText size="base" weight="medium">Auto-approve Venues</ThemedText>
                <ThemedText variant="secondary" size="sm">
                  Automatically approve new venue registrations
                </ThemedText>
              </View>
              <Switch
                value={settings.autoApproveVenues}
                onValueChange={() => toggleSetting('autoApproveVenues')}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={settings.autoApproveVenues ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText size="base" weight="medium">Email Verification Required</ThemedText>
                <ThemedText variant="secondary" size="sm">
                  Require email verification for new accounts
                </ThemedText>
              </View>
              <Switch
                value={settings.requireEmailVerification}
                onValueChange={() => toggleSetting('requireEmailVerification')}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={settings.requireEmailVerification ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText size="base" weight="medium">Push Notifications</ThemedText>
                <ThemedText variant="secondary" size="sm">
                  Enable system-wide push notifications
                </ThemedText>
              </View>
              <Switch
                value={settings.enablePushNotifications}
                onValueChange={() => toggleSetting('enablePushNotifications')}
                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                thumbColor={settings.enablePushNotifications ? theme.colors.accent : theme.colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Business Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Database size={20} color={theme.colors.accent} />
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Business Settings
            </ThemedText>
          </View>

          <View style={[styles.settingsCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Platform Commission (%)</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.platformCommission}
                  onChangeText={(text) => updateSetting('platformCommission', text)}
                  keyboardType="numeric"
                  placeholder="15"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Minimum Booking Amount ($)</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.minimumBookingAmount}
                  onChangeText={(text) => updateSetting('minimumBookingAmount', text)}
                  keyboardType="numeric"
                  placeholder="25"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Cancellation Window (hours)</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.cancellationWindow}
                  onChangeText={(text) => updateSetting('cancellationWindow', text)}
                  keyboardType="numeric"
                  placeholder="24"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Refund Processing (days)</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.refundProcessingDays}
                  onChangeText={(text) => updateSetting('refundProcessingDays', text)}
                  keyboardType="numeric"
                  placeholder="5"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Communication Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Mail size={20} color={theme.colors.success} />
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Communication
            </ThemedText>
          </View>

          <View style={[styles.settingsCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Admin Email</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.adminEmail}
                  onChangeText={(text) => updateSetting('adminEmail', text)}
                  keyboardType="email-address"
                  placeholder="admin@ofside.com"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Support Email</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.supportEmail}
                  onChangeText={(text) => updateSetting('supportEmail', text)}
                  keyboardType="email-address"
                  placeholder="support@ofside.com"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">SMS Provider</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.smsProvider}
                  onChangeText={(text) => updateSetting('smsProvider', text)}
                  placeholder="twilio"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Email Provider</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.emailProvider}
                  onChangeText={(text) => updateSetting('emailProvider', text)}
                  placeholder="sendgrid"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color={theme.colors.warning} />
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Security
            </ThemedText>
          </View>

          <View style={[styles.settingsCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Session Timeout (minutes)</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.sessionTimeout}
                  onChangeText={(text) => updateSetting('sessionTimeout', text)}
                  keyboardType="numeric"
                  placeholder="30"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Max Login Attempts</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.maxLoginAttempts}
                  onChangeText={(text) => updateSetting('maxLoginAttempts', text)}
                  keyboardType="numeric"
                  placeholder="5"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.inputItem}>
              <ThemedText size="base" weight="medium">Password Min Length</ThemedText>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={settings.passwordMinLength}
                  onChangeText={(text) => updateSetting('passwordMinLength', text)}
                  keyboardType="numeric"
                  placeholder="8"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <ThemedText size="base" weight="medium">Require Two-Factor Auth</ThemedText>
                <ThemedText variant="secondary" size="sm">
                  Require 2FA for all admin accounts
                </ThemedText>
              </View>
              <Switch
                value={settings.requireTwoFactor}
                onValueChange={() => toggleSetting('requireTwoFactor')}
                trackColor={{ false: theme.colors.border, true: theme.colors.warning }}
                thumbColor={settings.requireTwoFactor ? theme.colors.background : theme.colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title="Reset to Defaults"
            onPress={handleResetToDefaults}
            variant="outline"
            style={styles.actionButton}
          />
          <Button
            title={isLoading ? "Saving..." : "Save All Settings"}
            onPress={handleSaveSettings}
            disabled={isLoading}
            style={styles.actionButton}
          />
        </View>

        {/* Warning Card */}
        <View style={[styles.warningCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" weight="bold" style={styles.warningTitle}>
            ⚠️ Important Notice
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.warningText}>
            Changes to system settings may affect all users. Please review carefully before saving.
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
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  settingsCard: {
    marginHorizontal: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  inputItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
  },
  warningCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  warningTitle: {
    marginBottom: 8,
  },
  warningText: {
    lineHeight: 16,
  },
});