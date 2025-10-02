import { AntDesign, Zocial } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleIcon from '@/components/GoogleIcon';
import { router } from 'expo-router';

export default function OtpScreen() {
    const [otp, setOtp] = useState(['', '', '', '']);

  return (
    <SafeAreaView className="flex-1 bg-white">
        <LinearGradient
            colors={['#FFF201', '#FFFFFF']}
            className="flex-1"
        >
            {/* Skip Button */}
            {/* <View className="flex-row justify-end p-4">
                <Text className="text-black text-base font-medium">Skip</Text>
            </View> */}

            {/* Logo */}
            <View className="items-center mt-4">
                <Image
                    source={require('../../assets/images/logo.png')} // transparent logo
                    style={{ width: 200, height: 200, resizeMode: 'contain' }}
                />
            </View>

                {/* OTP Input */}
            <View className="flex-row justify-center mt-14 space-x-4">
                {otp.map((digit, index) => (
                    <TextInput
                    key={index}
                    value={digit}
                    maxLength={1}
                    keyboardType="number-pad"
                    className="w-12 h-12 border border-black rounded-md text-center text-lg bg-white mr-1"
                    />
                ))}
            </View>

            {/* Resend OTP */}
            <View className="flex-row justify-end px-28 mt-2">
                <TouchableOpacity>
                <Text className="text-xs text-black">Resend OTP</Text>
                </TouchableOpacity>
            </View>

            {/* Continue Button */}
            <TouchableOpacity onPress={()=> router.replace("/(tabs)")} className="my-8 py-3 rounded-md">
                <Text className="text-2xl font-black text-center">Continue</Text>
            </TouchableOpacity>

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
