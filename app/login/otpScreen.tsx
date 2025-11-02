import { AntDesign, Zocial } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleIcon from '@/components/GoogleIcon';
import { router, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

export default function OtpScreen() {
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const identifier = typeof params.email === 'string' ? params.email : '';
    const typeOfAuth = typeof params.type === 'string' ? params.type : '';
    const [otp, setOtp] = useState(['', '', '', '']);
    
    // Create refs for each input
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleCodeVerify = async () => {

        console.log('Verifying OTP for:', identifier, 'with OTP:', otp.join(''), 'and type:', typeOfAuth);
        try {
            setLoading(true);
            const response = await fetch(API_URL + '/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, otp: otp.join(''), type: typeOfAuth }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            setLoading(false);
           
        } catch (error) {
            Alert.alert('Error', 'Failed to send code. Please try again.');
            console.error('Login error:', error);
        }
    };

    // Handle OTP input change
    const handleOtpChange = (text: string, index: number) => {
        // Only allow numbers
        const numericText = text.replace(/[^0-9]/g, '');
        
        const newOtp = [...otp];
        newOtp[index] = numericText;
        setOtp(newOtp);

        // Auto-focus to next input if current input is filled
        if (numericText && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit if all fields are filled
        if (newOtp.every(digit => digit !== '') && index === 3) {
            handleCodeVerify();
        }
    };

    // Handle backspace key press
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            // Move focus to previous input on backspace when current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle text input focus
    const handleFocus = (index: number) => {
        // Clear the current input when focused (for better UX)
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <LinearGradient
                colors={['#FFF201', '#FFFFFF']}
                className="flex-1"
            >
                {/* Skip Button */}
                <TouchableOpacity onPress={() => router.replace("/(tabs)")} className="flex-row justify-end p-4">
                    <Text className="text-black text-base font-medium">Skip</Text>
                </TouchableOpacity>

                {/* Logo */}
                <View className="items-center mt-4 p-4">
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={{ width: 200, height: 200, resizeMode: 'contain' }}
                    />
                </View>

                {/* OTP Input */}
                <View className="flex-row justify-center mt-14 space-x-3">
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => { inputRefs.current[index] = ref }}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            onFocus={() => handleFocus(index)}
                            maxLength={1}
                            keyboardType="number-pad"
                            className="w-14 h-14 border-2 border-black rounded-lg text-center text-xl font-bold bg-white"
                            selectTextOnFocus={true}
                            textContentType="oneTimeCode"
                            autoComplete="one-time-code"
                        />
                    ))}
                </View>

                {/* Instruction Text */}
                <View className="mt-4 px-8">
                    <Text className="text-center text-gray-600 text-sm">
                        Enter the 4-digit code sent to your email
                    </Text>
                </View>

                {/* Resend OTP */}
                <View className="flex-row justify-center mt-6">
                    <TouchableOpacity>
                        <Text className="text-base text-black font-medium underline">
                            Resend OTP
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Continue Button */}
                <TouchableOpacity 
                    onPress={handleCodeVerify} 
                    className={`mx-8 mt-12 py-4 rounded-lg ${otp.every(digit => digit !== '') ? 'bg-black' : 'bg-gray-400'}`}
                    disabled={!otp.every(digit => digit !== '')}
                >
                    <Text className="text-xl font-bold text-center text-white">
                        {loading ? 'Verifying...' : 'Continue'}
                    </Text>
                </TouchableOpacity>

                {/* Manual Continue Option */}
               

                {/* Terms and Conditions */}
                <View className="mt-20 w-full items-center">
                    <Text className="text-black text-sm">
                        I agree to the{' '}
                        <Text 
                            className="underline" 
                            onPress={() => router.push('/login/termsAndPrivacy')}
                        >
                            Terms and Conditions
                        </Text>
                    </Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}