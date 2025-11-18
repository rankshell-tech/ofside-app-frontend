import { Zocial } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { JSX, useEffect, useState } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import GoogleIcon from '@/components/GoogleIcon';

type Gender = 'male' | 'female' | 'other';
import Constants from 'expo-constants';
import OfsideLoader from './ofsideLoader';
const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

export default function SignupScreen(): JSX.Element {
  const [form, setForm] = useState<{
    name: string;
    username: string;
    mobile: string;
    email?: string;
    referralCode?: string;
    profilePicture?: string;
    gender?: Gender;
    favSports: string[];
  }>({
    name: 'Ramesh',
    username: 'dwdwdw',
    mobile: '9889898888',
    email: 'ashi@gmail.com',
    referralCode: '',
    profilePicture: undefined,
    gender: undefined,
    favSports: [],
  });

  const sportsOptions = [
    'Football',
    'Volleyball',
    'Basketball',
    'Tennis',
    'Badminton',
    'Pickleball',
  ];

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        // ignore status handling here for brevity
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        base64: false,
      });
      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          setForm((s) => ({ ...s, profilePicture: result.assets[0].uri }));
        }
      }
    } catch (e) {
      // handle or ignore
    }
  };

  const toggleSport = (sport: string) => {
    setForm((s) => {
      const has = s.favSports.includes(sport);
      return {
        ...s,
        favSports: has
          ? s.favSports.filter((x) => x !== sport)
          : [...s.favSports, sport],
      };
    });
  };
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    try {
      setLoading(true);

      // Validate form data before making the request
      if (!form.email || !form.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      const response = await fetch(API_URL + '/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ form }),
      });
      console.log(response);
      // Handle HTTP errors with specific messages
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        switch (response.status) {
          case 400:
            throw new Error(errorData?.message || 'Invalid request data');
          case 409:
            throw new Error(errorData?.message || 'User already exists');
          case 429:
            throw new Error('Too many attempts. Please try again later.');
          case 500:
            throw new Error('Server error. Please try again later.');
          default:
            throw new Error(
              errorData?.message ||
                `Request failed with status ${response.status}`
            );
        }
      }

      const data = await response.json();
      console.log('Signup response data:', data);

      // Validate response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from server');
      }

      setLoading(false);
      if(response.ok){
        router.replace({
        pathname: '/login/otpScreen',
        params: {
          email: form.email,
          type: 'signup',
          // Include any other necessary data from the response
          userId: data.userId,
        },
      });
      }

      // Navigate to OTP screen
   
    } catch (error: any) {
      setLoading(false);
      console.error('Signup error:', error);

      // User-friendly error messages
      let errorMessage = 'Failed to send code. Please try again.';

      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please try again later.';
      } else {
        // Use the specific error message from the server or validation
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);

      // Optional: Log to error reporting service
      // logErrorToService('signup_error', error);
    }
  };

  return (
    <>
      {loading ? (
        <OfsideLoader text="Signing up..." />
      ) : (
        <SafeAreaView className=" bg-white">
          <LinearGradient colors={['#FFF201', '#FFFFFF']} className="flex-1">
            <ScrollView>
              <TouchableOpacity
                onPress={() => router.replace('/(tabs)')}
                className="flex-row justify-end p-4"
              >
                <Text className="text-black text-base font-medium">Skip</Text>
              </TouchableOpacity>
              <View className="items-center mt-4">
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={{ width: 160, height: 160, resizeMode: 'contain' }}
                />
              </View>
              <View className="mt-4 px-6">
                <Text className="text-black text-3xl mb-4 font-bold text-center">
                  Sign up
                </Text>
                <View className="space-y-3">
                  <View className="border border-black rounded-lg p-3 bg-white mb-4 ">
                    <TextInput
                      placeholder="Full name"
                      value={form.name}
                      onChangeText={(t) => setForm((s) => ({ ...s, name: t }))}
                      className="text-lg"
                      placeholderTextColor="#666"
                      autoCapitalize="words"
                    />
                  </View>
                  <View className="border border-black rounded-lg p-3 bg-white mb-4 ">
                    <TextInput
                      placeholder="Username"
                      value={form.username}
                      onChangeText={(t) =>
                        setForm((s) => ({ ...s, username: t }))
                      }
                      className="text-lg"
                      placeholderTextColor="#666"
                      autoCapitalize="none"
                    />
                  </View>

                  <View className="border border-black rounded-lg p-3 bg-white mb-4">
                    <TextInput
                      placeholder="Email"
                      value={form.email}
                      onChangeText={(t) => setForm((s) => ({ ...s, email: t }))}
                      className="text-lg"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#666"
                    />
                  </View>

                  <View className="border border-black rounded-lg p-3 bg-white mb-4">
                    <TextInput
                      placeholder="Mobile number"
                      value={form.mobile}
                      onChangeText={(t) =>
                        setForm((s) => ({ ...s, mobile: t }))
                      }
                      className="text-lg"
                      keyboardType="phone-pad"
                      placeholderTextColor="#666"
                    />
                  </View>

                  <View className="border border-black rounded-lg p-3 bg-white mb-4">
                    <TextInput
                      placeholder="Referral code (optional)"
                      value={form.referralCode}
                      onChangeText={(t) =>
                        setForm((s) => ({ ...s, referralCode: t }))
                      }
                      className="text-lg"
                      placeholderTextColor="#666"
                    />
                  </View>

                  <View className="flex-row items-center space-x-4  mb-4">
                    <View className="w-20 h-20 border border-black rounded-full overflow-hidden items-center justify-center bg-white mr-4 ">
                      {form.profilePicture ? (
                        <Image
                          source={{ uri: form.profilePicture }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 100,
                          }}
                        />
                      ) : (
                        <Text className="text-sm text-black">Profile</Text>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={pickImage}
                      className="bg-black rounded-lg px-4 py-3"
                    >
                      <Text className="text-white">Upload Photo</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="mb-4">
                    <Text className="text-black mb-2 font-medium">Gender</Text>
                    <View className="flex-row space-x-3 gap-2">
                      {(['male', 'female', 'other'] as Gender[]).map((g) => {
                        const selected = form.gender === g;
                        return (
                          <TouchableOpacity
                            key={g}
                            onPress={() =>
                              setForm((s) => ({ ...s, gender: g }))
                            }
                            className={`px-4 py-2  rounded-lg border ${
                              selected ? 'bg-black' : 'bg-white'
                            } border-black`}
                          >
                            <Text
                              className={`${
                                selected ? 'text-white' : 'text-black'
                              }`}
                            >
                              {g}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                  <View className="mb-4">
                    <Text className="text-black mb-2 font-medium">
                      Favorite Sports
                    </Text>
                    <View className="flex-row flex-wrap">
                      {sportsOptions.map((sport) => {
                        const selected = form.favSports.includes(sport);
                        return (
                          <TouchableOpacity
                            key={sport}
                            onPress={() => toggleSport(sport)}
                            className={`mr-2 mb-2 px-3 py-2 rounded-full border ${
                              selected ? 'bg-black' : 'bg-white'
                            } border-black`}
                          >
                            <Text
                              className={`${
                                selected ? 'text-white' : 'text-black'
                              }`}
                            >
                              {sport}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={submit}
                    className="mt-2 bg-black rounded-lg py-3 items-center"
                  >
                    <Text className="text-white text-lg font-medium">
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="mt-12 px-6">
                <Text className="text-gray-600 text-center text-base mb-4">
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/login/loginScreen')}
                  className="bg-yellow-300 rounded-xl py-4 px-6 items-center shadow-lg"
                >
                  <Text className="text-black font-bold text-lg">Login</Text>
                </TouchableOpacity>
              </View>
              <View className="mt-8  w-full items-center">
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
            </ScrollView>
          </LinearGradient>
        </SafeAreaView>
      )}
    </>
  );
}
