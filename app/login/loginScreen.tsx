import { Zocial } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleIcon from "@/components/GoogleIcon";


export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
        <LinearGradient
            colors={['#FFF201', '#FFFFFF']}
            className="flex-1"
        >
            {/* Skip Button */}
            <TouchableOpacity onPress={()=> router.push("/login/loginViaApp")} className="flex-row justify-end p-4">
                <Text className="text-black text-base font-medium">Skip</Text>
            </TouchableOpacity>

            {/* Logo */}
            <View className="items-center mt-4">
                <Image
                    source={require('../../assets/images/logo.png')} // transparent logo
                    style={{ width: 200, height: 200, resizeMode: 'contain' }}
                />
            </View>

            {/* Phone Input */}
            <View className="flex-row items-center border border-black rounded-md mx-6 mt-12 px-4 py-1 bg-white">
                <Text className="text-lg pr-2">+91</Text>
                <View className="h-6 w-px bg-black mx-2" />
                <TextInput
                    placeholder="Enter your number"
                    keyboardType="phone-pad"
                    className="flex-1 text-lg"
                />
            </View>

            {/* Continue Button */}
            <TouchableOpacity className="my-8 py-3 rounded-md" onPress={() => router.push('/login/otpScreen')}>
                <Text className="text-2xl font-black text-center">Continue</Text>
            </TouchableOpacity>

            {/* Social Icons */}
            <View className="flex-row justify-center mt-8 space-x-6">
                <TouchableOpacity className="w-16 h-16 border border-black rounded-lg items-center justify-center mr-10 bg-white">
                    <Zocial name="email" size={36} color="black" />
                </TouchableOpacity>
                <TouchableOpacity className="w-16 h-16 border border-black rounded-lg items-center justify-center mr-10 bg-white">
                    <GoogleIcon size={36} />
                </TouchableOpacity>
                <TouchableOpacity className="w-16 h-16 border border-black rounded-lg items-center justify-center bg-white">
                    <AntDesign name="apple1" size={36} color="black" />
                </TouchableOpacity>
            </View>

            {/* Terms and Conditions */}
            <View className="absolute bottom-1 w-full items-center">
                <Text className="text-black text-sm">
                    I agree to the <Text className="underline" onPress={()=>router.push('/login/termsAndPrivacy')}>Terms and Conditions</Text>
                </Text>
            </View>
        </LinearGradient>
    </SafeAreaView>
  );
}
