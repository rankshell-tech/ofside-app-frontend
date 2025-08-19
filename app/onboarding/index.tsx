import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { ThemedView } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/useTheme';

const { width, height } = Dimensions.get('window');

export default function OnboardingWelcome() {
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
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Welcome to Ofside
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Your ultimate sports venue booking platform. Find, reserve, and play at the best facilities in your area.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={() => router.push('/onboarding/welcome')}
              size="lg"
              style={styles.button}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  heroImage: {
    width: width * 0.8,
    height: height * 0.3,
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
  },
});