import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleIcon from '@/components/GoogleIcon';
import OfsideLoader from './ofsideLoader';
import AntDesign from '@expo/vector-icons/AntDesign';

// Firebase imports for social auth
import { auth } from '@/firebase';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// For Apple Sign-In
import * as AppleAuthentication from 'expo-apple-authentication';

import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

// For Google auth to work properly in Expo
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [identifier, setIdentifier] = React.useState<string>(
    'ashi888032@gmail.com'
  );

  // Google Auth Configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_EXPO_GOOGLE_CLIENT_ID', // For development in Expo Go
    iosClientId: 'YOUR_IOS_GOOGLE_CLIENT_ID', // For standalone iOS app
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', // For standalone Android app
  });

  // Handle Google Auth Response
  React.useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      handleFirebaseGoogleSignIn(response.authentication.accessToken);
    }

    if (response?.type === 'error') {
      console.log('Google auth error:', response.error);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    }
  }, [response]);

  // Your existing Send Code function (unchanged)
  const handleSendCode = async (): Promise<void> => {
    console.log('API_URL:', API_URL + '/api/auth/login');
    try {
      setLoading(true);
      const response = await fetch(API_URL + '/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      console.log('Login response data:', data);
      setLoading(false);
      router.replace({
        pathname: '/login/otpScreen',
        params: { email: identifier, type: 'login' },
      });
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to send code. Please try again.');
      console.error('Login error:', error);
    }
  };

  // 1. Google Sign-In with Firebase
  const handleFirebaseGoogleSignIn = async (
    accessToken: string
  ): Promise<void> => {
    try {
      setLoading(true);

      // Create Firebase credential with Google token
      const credential = GoogleAuthProvider.credential(null, accessToken);

      // Sign in with credential to Firebase
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      console.log('Google sign-in success:', user.email);

      // You can choose to:
      // Option A: Navigate directly to main app
      router.replace('/(tabs)');

      // Option B: Send user data to your backend
      // await sendUserToBackend(user);
    } catch (error: any) {
      console.error('Google sign-in error:', error);

      let errorMessage = 'Google sign-in failed. Please try again.';

      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with the same email address.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid Google credentials.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 2. Apple Sign-In with Firebase
  const handleAppleSignIn = async (): Promise<void> => {
    try {
      setLoading(true);

      // Perform Apple authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Check if we have the required identity token
      if (!credential.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token received');
      }

      // Create Firebase credential with Apple token
      const firebaseCredential = GoogleAuthProvider.credential(
        credential.identityToken
      );

      // Sign in to Firebase with Apple credential
      const userCredential = await signInWithCredential(
        auth,
        firebaseCredential
      );
      const user = userCredential.user;

      console.log('Apple sign-in success:', user.email);

      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // User canceled Apple Sign In - no need to show error
        console.log('Apple sign-in canceled by user');
      } else {
        console.error('Apple sign-in error:', error);

        let errorMessage = 'Apple sign-in failed. Please try again.';

        if (error.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid Apple credentials.';
        } else if (
          error.code === 'auth/account-exists-with-different-credential'
        ) {
          errorMessage =
            'An account already exists with the same email address.';
        }

        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = (): void => {
    promptAsync();
  };

  return (
    <>
      {loading ? (
        <OfsideLoader text="Signing in..." />
      ) : (
        <SafeAreaView className="flex-1 bg-white">
          <LinearGradient colors={['#FFF201', '#FFFFFF']} className="flex-1">
            {/* Skip Button */}
            <TouchableOpacity
              onPress={() => router.replace('/(tabs)')}
              className="flex-row justify-end p-4"
            >
              <Text className="text-black text-base font-medium">Skip</Text>
            </TouchableOpacity>

            {/* Logo */}
            <View className="items-center mt-4">
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 200, height: 200, resizeMode: 'contain' }}
              />
            </View>

            {/* Your existing Send Code form (unchanged) */}
            <View className="mt-4 px-6 overflow-visible">
              <Text className="text-black text-3xl mb-4 font-bold text-center">
                Log in
              </Text>
              <View className="p-0 border border-black rounded-lg bg-white">
                <TextInput
                  placeholder="Enter your email or mobile number"
                  className="text-lg px-4 w-full py-0"
                  autoCapitalize="none"
                  placeholderTextColor="#666"
                  value={identifier}
                  onChangeText={setIdentifier}
                  style={{ textAlignVertical: 'center', height: 50 }}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                onPress={handleSendCode}
                disabled={loading}
                className={`mt-2 rounded-lg py-3 items-center ${
                  loading ? 'bg-gray-400' : 'bg-black'
                }`}
              >
                <Text className="text-white text-lg font-medium">
                  {loading ? 'Sending...' : 'Send Code'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="mt-10 text-xl text-black text-center">
              or Continue with
            </Text>

            {/* Social Icons - Fixed with Firebase */}
            <View
              className="mt-10 flex-row justify-center space-x-6"
              style={{ gap: 24 }}
            >
              {/* Google */}
              <TouchableOpacity
                onPress={handleGooglePress}
                disabled={!request || loading}
                className={`w-16 h-16 border border-black rounded-lg items-center justify-center ${
                  !request || loading ? 'opacity-50' : ''
                }`}
              >
                <GoogleIcon size={36} />
              </TouchableOpacity>

              {/* Apple - Only show on iOS */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  onPress={handleAppleSignIn}
                  disabled={loading}
                  className={`w-16 h-16 border border-black rounded-lg items-center justify-center ${
                    loading ? 'opacity-50' : ''
                  }`}
                >
                  <AntDesign name="apple" size={36} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <View className="mt-12 px-6">
              <Text className="text-gray-600 text-center text-base mb-4">
                New to Ofside?
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/login/signup')}
                className="bg-yellow-300 rounded-xl py-4 px-6 items-center shadow-lg"
              >
                <Text className="text-black font-bold text-lg">
                  Create Your Account
                </Text>
              </TouchableOpacity>
            </View>
            {/* Terms and Conditions */}
            <View className="mt-10 bottom-0 w-full items-center">
              <Text className="text-black text-sm">
                By continuing, you agree to our{' '}
                <Text
                  className="underline"
                  onPress={() =>
                    !loading && router.push('/staticPages/termsAndPrivacy')
                  }
                >
                  Terms and Conditions
                </Text>
              </Text>
            </View>
          </LinearGradient>
        </SafeAreaView>
      )}
    </>
  );
}
