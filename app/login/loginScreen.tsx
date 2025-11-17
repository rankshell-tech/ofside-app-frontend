import { Zocial } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
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
import Constants from 'expo-constants';
import OfsideLoader from './ofsideLoader';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';

const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

// Type definitions
interface GoogleAuthResponse {
  type: 'success' | 'error' | 'cancel';
  authentication?: {
    accessToken: string;
  };
}

interface AppleAuthCredential {
  identityToken: string | null;
  user: string;
  email: string | null;
  fullName: AppleAuthentication.AppleAuthenticationFullName | null;
}

export default function LoginScreen() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [identifier, setIdentifier] = React.useState<string>('ashi888032@gmail.com');
  
  // Google Auth with proper TypeScript typing
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
    androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID', // Added for Android
  });

  // Handle Google Auth Response
  React.useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      handleGoogleSignIn(response.authentication.accessToken);
    }
  }, [response]);

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

  // Google Sign In
  const handleGoogleSignIn = async (accessToken: string): Promise<void> => {
    try {
      setLoading(true);
      
      // Send the Google token to your backend
      const response = await fetch(API_URL + '/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Google sign-in failed');
      }

      const data = await response.json();
      console.log('Google sign-in success:', data);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
      console.error('Google sign-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apple Sign In
  const handleAppleSignIn = async (): Promise<void> => {
    try {
      setLoading(true);
      
      const credential: AppleAuthentication.AppleAuthenticationCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Send Apple credential to your backend
      const response = await fetch(API_URL + '/api/auth/apple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identityToken: credential.identityToken,
          user: credential.user,
          email: credential.email,
          fullName: credential.fullName,
        }),
      });

      if (!response.ok) {
        throw new Error('Apple sign-in failed');
      }

      const data = await response.json();
      console.log('Apple sign-in success:', data);
      
      // Navigate to main app 
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        // User canceled Apple Sign In - no need to show error
        console.log('Apple sign-in canceled');
      } else {
        Alert.alert('Error', 'Apple sign-in failed. Please try again.');
        console.error('Apple sign-in error:', error);
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
                />
              </View>

              <TouchableOpacity
                onPress={handleSendCode}
                className="mt-2 bg-black rounded-lg py-3 items-center"
              >
                <Text className="text-white text-lg font-medium">
                  Send Code
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="mt-10 text-xl text-black text-center">
              or Continue with
            </Text>

            {/* Social Icons */}
            <View className="mt-10 flex-row justify-center space-x-6">
              {/* Email */}
              <TouchableOpacity className="w-16 h-16 border border-black rounded-lg items-center justify-center mr-10 bg-white">
                <Zocial name="email" size={36} color="black" />
              </TouchableOpacity>
              
              {/* Google */}
              <TouchableOpacity 
                onPress={handleGooglePress}
                disabled={!request}
                className="w-16 h-16 border border-black rounded-lg items-center justify-center mr-10 bg-white"
              >
                <GoogleIcon size={36} />
              </TouchableOpacity>
              
              {/* Apple - Only show on iOS */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  onPress={handleAppleSignIn}
                  className="w-16 h-16 border border-black rounded-lg items-center justify-center bg-white"
                >
                  <AntDesign name="apple" size={36} color="black" />
                </TouchableOpacity>
              )}
            </View>

            <View className="mt-10 bottom-0 w-full items-center">
              <Text className="text-black font-bold text-lg">
                New User?{' '}
                <Text
                  className="text-yellow-500 font-semibold underline"
                  onPress={() => router.push('/login/signup')}
                >
                  Sign up
                </Text>
              </Text>
            </View>

            {/* Terms and Conditions */}
            <View className="mt-10 bottom-0 w-full items-center">
              <Text className="text-black text-sm">
                I agree to the{' '}
                <Text
                  className="underline"
                  onPress={() => router.push('/staticPages/termsAndPrivacy')}
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