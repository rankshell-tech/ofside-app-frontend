import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { ThemedView } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/useTheme';

const { width, height } = Dimensions.get('window');

export default function OnboardingFeatures() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, '#FFF8DC', theme.colors.background]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg' }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Discover Amazing Venues
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Explore top-rated sports facilities in your area. From tennis courts to football fields, find the perfect venue for your game.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Continue"
              onPress={() => router.push('/onboarding/features')}
              size="lg"
              style={styles.button}
            />
            <Button
              title="Skip"
              onPress={() => router.push('/onboarding/get-started')}
              variant="ghost"
              size="md"
              style={styles.skipButton}
            />
          </View>
        </View>
      </LinearGradient>
    </ThemedView>
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
  },
  image: {
    width: width * 0.8,
    height: height * 0.35,
    borderRadius: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
  skipButton: {
    width: '100%',
  },
});