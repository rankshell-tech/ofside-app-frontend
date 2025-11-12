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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleIcon from '@/components/GoogleIcon';
import Constants from 'expo-constants';
import OfsideLoader from './ofsideLoader';
const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

export default function LoginScreen() {
  const [loading, setLoading] = React.useState(false);
  const [identifier, setIdentifier] = React.useState('ashi888032@gmail.com');
  
  const handleSendCode = async () => {
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
      Alert.alert('Error', 'Failed to send code. Please try again.');
      console.error('Login error:', error);
    }
  };

  return (
    <>
      {loading  ? (
        <OfsideLoader text="Sending code..." />
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
                source={require('../../assets/images/logo.png')} // transparent logo
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
                onPress={() => {
                  handleSendCode();
                }}
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
              <TouchableOpacity className="w-16 h-16 border border-black rounded-lg items-center justify-center mr-10 bg-white">
                <Zocial name="email" size={36} color="black" />
              </TouchableOpacity>
              <TouchableOpacity className="w-16 h-16 border border-black rounded-lg items-center justify-center mr-10 bg-white">
                <GoogleIcon size={36} />
              </TouchableOpacity>
              <TouchableOpacity className="w-16 h-16 border border-black rounded-lg items-center justify-center bg-white">
                <AntDesign name="apple" size={36} color="black" />
              </TouchableOpacity>
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
