import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { updateProfile } from '@/store/slices/authSlice';
import { ArrowLeft, User, Camera } from 'lucide-react-native';

export default function EditProfile() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      dispatch(updateProfile(formData));
      setIsLoading(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemedText size="lg" weight="bold">
            Edit Profile
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primary }]}>
              <User size={40} color={theme.colors.accent} />
            </View>
            <TouchableOpacity style={[styles.cameraButton, { backgroundColor: theme.colors.background }]}>
              <Camera size={16} color={theme.colors.text} />
            </TouchableOpacity>
            <ThemedText size="sm" variant="secondary" style={styles.avatarText}>
              Tap to change photo
            </ThemedText>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText size="sm" weight="medium" style={styles.label}>
                Full Name
              </ThemedText>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text, 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border 
                }]}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your full name"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText size="sm" weight="medium" style={styles.label}>
                Email
              </ThemedText>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text, 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border 
                }]}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText size="sm" weight="medium" style={styles.label}>
                Phone Number
              </ThemedText>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text, 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border 
                }]}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText size="sm" weight="medium" style={styles.label}>
                Location
              </ThemedText>
              <TextInput
                style={[styles.input, { 
                  color: theme.colors.text, 
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border 
                }]}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Enter your location"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <Button
              title={isLoading ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              disabled={isLoading}
              size="lg"
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 20,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    marginTop: 8,
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    marginTop: 24,
  },
});