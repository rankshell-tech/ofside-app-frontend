import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { ThemedView } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { continueAsGuest } from '@/store/slices/authSlice';
import { Users, Building, Eye } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GetStarted() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleContinueAsGuest = () => {
    dispatch(continueAsGuest());
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ScrollView className="px-6">
        <LinearGradient
          colors={[theme.colors.primary, '#FFF8DC', theme.colors.background]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Choose Your Role
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                How would you like to use Ofside?
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {/* Player Option */}
              <View style={[styles.optionCard, { backgroundColor: theme.colors.background }]}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
                  <Users size={32} color={theme.colors.accent} />
                </View>
                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                  I'm a Player
                </Text>
                <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
                  Book courts and venues for your games
                </Text>
                <Button
                  title="Continue as Player"
                onPress={() => router.push('/auth/login')}
                  style={styles.optionButton}
                />
              </View>

              {/* Venue Owner Option */}
              <View style={[styles.optionCard, { backgroundColor: theme.colors.background }]}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent }]}>
                  <Building size={32} color={theme.colors.background} />
                </View>
                <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                  I'm a Venue Owner
                </Text>
                <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
                  Manage and rent out your sports facilities
                </Text>
                <Button
                  title="Continue as Owner"
                onPress={() => router.push('/auth/login')}
                  variant="outline"
                  style={styles.optionButton}
                />
              </View>

              {/* Guest Option */}
              <View style={[styles.guestCard, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.guestIconContainer, { backgroundColor: theme.colors.textSecondary }]}>
                  <Eye size={24} color={theme.colors.background} />
                </View>
                <Text style={[styles.guestTitle, { color: theme.colors.text }]}>
                  Just Browsing?
                </Text>
                <Text style={[styles.guestDescription, { color: theme.colors.textSecondary }]}>
                  Explore venues and features without signing up
                </Text>
                <Button
                  title="Continue as Guest"
                  onPress={handleContinueAsGuest}
                  variant="ghost"
                  style={styles.guestButton}
                />
              </View>
            </View>
          </View>


        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
            Already have an account?
          </Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/auth/login')}
            variant="ghost"
            size="sm"
          />
        </View>
        </LinearGradient>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  optionCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionButton: {
    width: '100%',
  },
  guestCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  guestIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  guestDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },
  guestButton: {
    width: '100%',
  },
  loginContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
});