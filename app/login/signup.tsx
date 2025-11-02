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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import GoogleIcon from '@/components/GoogleIcon';

type Gender = 'male' | 'female' | 'other';

export default function SignupScreen(): JSX.Element {
    const [form, setForm] = useState<{
        name: string;
        mobile: string;
        email?: string;
        referralCode?: string;
        profilePicture?: string;
        gender?: Gender;
        favSports: string[];
    }>({
        name: '',
        mobile: '',
        email: '',
        referralCode: '',
        profilePicture: undefined,
        gender: undefined,
        favSports: [],
    });

    const sportsOptions = ['Football', 'Volleyball', 'Basketball', 'Tennis', 'Badminton', 'Pickleball'];

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
                favSports: has ? s.favSports.filter((x) => x !== sport) : [...s.favSports, sport],
            };
        });
    };

    const submit = () => {
        // TODO: validate and send to backend
        console.log('signup payload', form);
        router.replace('/(tabs)');
    };

    return (
        <SafeAreaView className=" bg-white">
            <LinearGradient colors={['#FFF201', '#FFFFFF']} className="flex-1">
                <ScrollView>
                  <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="flex-row justify-end p-4">
                    <Text className="text-black text-base font-medium">Skip</Text>
                  </TouchableOpacity>
                  <View className="items-center mt-4">
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{ width: 160, height: 160, resizeMode: 'contain' }}
                    />
                  </View>
                  <View className="mt-4 px-6">
                    <Text className="text-black text-3xl mb-4 font-bold text-center">Sign up</Text>
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
                                onChangeText={(t) => setForm((s) => ({ ...s, mobile: t }))}
                                className="text-lg"
                                keyboardType="phone-pad"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View className="border border-black rounded-lg p-3 bg-white mb-4">
                            <TextInput
                                placeholder="Referral code (optional)"
                                value={form.referralCode}
                                onChangeText={(t) => setForm((s) => ({ ...s, referralCode: t }))}
                                className="text-lg"
                                placeholderTextColor="#666"
                            />
                        </View>

                        <View className="flex-row items-center space-x-4  mb-4">
                            <View className="w-20 h-20 border border-black rounded-full overflow-hidden items-center justify-center bg-white mr-4 ">
                                {form.profilePicture ? (
                                    <Image source={{ uri: form.profilePicture }} style={{ width: '100%', height: '100%' ,borderRadius: 100}} />
                                ) : (
                                    <Text className="text-sm text-black">Profile</Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={pickImage} className="bg-black rounded-lg px-4 py-3">
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
                                            onPress={() => setForm((s) => ({ ...s, gender: g }))}
                                            className={`px-4 py-2  rounded-lg border ${selected ? 'bg-black' : 'bg-white'} border-black`}
                                        >
                                            <Text className={`${selected ? 'text-white' : 'text-black'}`}>{g}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                        <View className="mb-4">
                            <Text className="text-black mb-2 font-medium">Favorite Sports</Text>
                            <View className="flex-row flex-wrap">
                                {sportsOptions.map((sport) => {
                                    const selected = form.favSports.includes(sport);
                                    return (
                                        <TouchableOpacity
                                            key={sport}
                                            onPress={() => toggleSport(sport)}
                                            className={`mr-2 mb-2 px-3 py-2 rounded-full border ${selected ? 'bg-black' : 'bg-white'} border-black`}
                                        >
                                            <Text className={`${selected ? 'text-white' : 'text-black'}`}>{sport}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        <TouchableOpacity onPress={submit} className="mt-2 bg-black rounded-lg py-3 items-center">
                            <Text className="text-white text-lg font-medium">Create Account</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                  <View className="mt-8 bottom-0 w-full items-center">
                    <Text className="text-black font-bold text-lg">
                        Already have an account?{' '}
                        <Text className="text-yellow-500 font-semibold underline" onPress={() => router.push('/login/loginViaApp')}>
                            Log in
                        </Text>
                    </Text>
                  </View>
                  <View className="mt-8  w-full items-center">
                    <Text className="text-black text-sm">
                        I agree to the{' '}
                        <Text className="underline" onPress={() => router.push('/login/termsAndPrivacy')}>
                            Terms and Conditions
                        </Text>
                    </Text>
                  </View>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}
