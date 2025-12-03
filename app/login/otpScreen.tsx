import { AntDesign, Zocial } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View, Keyboard, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleIcon from '@/components/GoogleIcon';
import { router, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import OfsideLoader from '@/components/ui/ofsideLoader';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';

const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

export default function OtpScreen() {
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const identifier = typeof params.email === 'string' ? params.email : '';
    const typeOfAuth = typeof params.type === 'string' ? params.type : '';
    const [otp, setOtp] = useState(['', '', '', '']);
    const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
    
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const lastFilledIndexRef = useRef(-1);
    const autoFillDetectedRef = useRef(false);

    const dispatch = useDispatch<AppDispatch>();

    // Enhanced autofill detection and handling
    useEffect(() => {
        // Check if all fields are filled
        const isFilled = otp.every(digit => digit !== '');
        if (isFilled && otp.join('').length === 4 && !hasAutoSubmitted) {
            const otpString = otp.join('');
            console.log('Auto-submitting OTP:', otpString);
            
            // Dismiss keyboard first
            Keyboard.dismiss();
            
            // Small delay to ensure UI is updated
            setTimeout(() => {
                handleCodeVerify();
            }, 300);
        }
    }, [otp, hasAutoSubmitted]);

    // Handle autofill specifically for iOS and Android
    const handleAutoFill = (text: string, index: number) => {
        // Clean the text to only numbers
        const cleanText = text.replace(/[^0-9]/g, '');
        
        // If we get more than 1 character, it's likely autofill
        if (cleanText.length > 1) {
            autoFillDetectedRef.current = true;
            
            // Extract exactly 4 digits
            const digits = cleanText.slice(0, 4).split('');
            
            // Create new OTP array
            const newOtp = [...otp];
            digits.forEach((digit, idx) => {
                if (idx < 4) {
                    newOtp[idx] = digit;
                }
            });
            
            setOtp(newOtp);
            
            // Update refs
            lastFilledIndexRef.current = digits.length - 1;
            
            // Blur all inputs and prepare for auto-submit
            setTimeout(() => {
                inputRefs.current.forEach(ref => ref?.blur());
                Keyboard.dismiss();
                
                // Force state update
                setOtp([...newOtp]);
                
                // Set flag to prevent multiple submissions
                setHasAutoSubmitted(true);
                
                // Auto-submit after ensuring UI is updated
                setTimeout(() => {
                    if (newOtp.every(digit => digit !== '')) {
                        handleCodeVerify();
                    }
                }, 400);
            }, 100);
            
            return true; // Indicate autofill was handled
        }
        
        return false; // Not autofill
    };

    const handleCodeVerify = async () => {
        console.log('Verifying OTP for:', identifier, 'with OTP:', otp.join(''), 'and type:', typeOfAuth);
        
        try {
            // Basic validation
            const joinedOtp = otp.join('');
            if (joinedOtp.length !== 4) {
                Alert.alert('Invalid code', 'Please enter the 4-digit code.');
                setHasAutoSubmitted(false);
                return;
            }
            
            if (!identifier) {
                Alert.alert('Missing identifier', 'No email or phone number found.');
                setHasAutoSubmitted(false);
                return;
            }
            
            if (!typeOfAuth) {
                Alert.alert('Missing auth type', 'Authentication type is not provided.');
                setHasAutoSubmitted(false);
                return;
            }

            // Prevent multiple submissions
            if (loading) return;
            
            setLoading(true);
            
            const response = await fetch(API_URL + '/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, otp: joinedOtp, type: typeOfAuth }),
            });

            let parsed: any = null;
            try {
                parsed = await response.json();
            } catch {
                // ignore json parse errors
            }

            console.log('verify-otp status:', response.status, 'body:', parsed);

            if (!response.ok) {
                const message =
                    parsed?.message ||
                    parsed?.error ||
                    'Verification failed. Please check the code and try again.';
                Alert.alert('Error', message);
                setLoading(false);
                setHasAutoSubmitted(false);
                return;
            }

            // Success
            setLoading(false);
            dispatch(loginSuccess(parsed?.data));
            router.replace({ pathname: '/(tabs)', params: { screen: 'Home' } });
        } catch (error) {
            setLoading(false);
            setHasAutoSubmitted(false);
            Alert.alert('Error', 'Failed to verify code. Please try again.');
            console.error('OTP verification error:', error);
        }
    };

    const handleResendOtp = async () => {
        console.log('API_URL:', API_URL + '/api/auth/resend-otp');
        try {
            if (!identifier) {
                Alert.alert('Missing identifier', 'No email or phone number found.');
                return;
            }
            if (!typeOfAuth) {
                Alert.alert('Missing auth type', 'Authentication type is not provided.');
                return;
            }

            const response = await fetch(API_URL + '/api/auth/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, type: typeOfAuth }),
            });

            let parsed: any = null;
            try {
                parsed = await response.json();
            } catch {
                // ignore parse errors
            }

            console.log('resend-otp status:', response.status, 'body:', parsed);

            if (!response.ok) {
                const message =
                    parsed?.message ||
                    parsed?.error ||
                    'Failed to resend OTP. Please try again.';
                Alert.alert('Error', message);
                return;
            }

            Alert.alert('Success', parsed?.message || 'OTP sent successfully.');
        } catch (error) {
            Alert.alert('Error', 'Failed to resend OTP. Please try again.');
            console.error('Resend OTP error:', error);
        }
    };

    // Handle OTP input change
    const handleOtpChange = (text: string, index: number) => {
        // Only allow numbers
        const numericText = text.replace(/[^0-9]/g, '');
        
        // Check for autofill first
        if (numericText.length > 1) {
            if (handleAutoFill(numericText, index)) {
                return;
            }
        }
        
        // Single digit input
        const newOtp = [...otp];
        
        // Handle paste scenario where text might be exactly 1 char
        if (numericText.length === 1) {
            newOtp[index] = numericText;
            setOtp(newOtp);
            
            // Auto-focus next if not last input
            if (index < 3 && numericText) {
                setTimeout(() => {
                    inputRefs.current[index + 1]?.focus();
                }, 50);
            }
            
            // If last input, check if all filled
            if (index === 3 && numericText) {
                setTimeout(() => {
                    if (newOtp.every(digit => digit !== '')) {
                        Keyboard.dismiss();
                        if (!hasAutoSubmitted) {
                            setTimeout(() => {
                                handleCodeVerify();
                            }, 200);
                        }
                    }
                }, 100);
            }
        } else if (numericText.length === 0) {
            // Handle backspace/clear
            newOtp[index] = '';
            setOtp(newOtp);
        }
    };

    // Handle backspace key press
    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            // Move focus to previous input on backspace when current is empty
            setTimeout(() => {
                inputRefs.current[index - 1]?.focus();
            }, 10);
        }
    };

    // Handle text input focus
    const handleFocus = (index: number) => {
        // Select text for easy editing
        setTimeout(() => {
            inputRefs.current[index]?.setNativeProps({
                selection: { start: 0, end: otp[index] ? 1 : 0 }
            });
        }, 50);
    };

    // Clear OTP when user manually focuses on first input
    const handleFirstInputFocus = () => {
        if (autoFillDetectedRef.current && otp.some(digit => digit !== '')) {
            // Don't clear on first focus after autofill
            return;
        }
        // Optional: Clear if user wants to manually enter
    };

    if (loading) {
        return <OfsideLoader text="Verifying OTP..." />;
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <LinearGradient
                colors={['#FFF201', '#FFFFFF']}
                className="flex-1"
            >
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    contentContainerStyle={{ flexGrow: 1 }}
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
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                value={digit}
                                onChangeText={(text) => handleOtpChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                onFocus={() => {
                                    if (index === 0) handleFirstInputFocus();
                                    handleFocus(index);
                                }}
                                maxLength={index === 0 ? 4 : 1}
                                keyboardType="number-pad"
                                className="w-14 h-14 border-2 border-black rounded-lg text-center text-xl font-bold bg-white"
                                selectTextOnFocus={true}
                                textContentType={index === 0 ? "oneTimeCode" : "none"}
                                autoComplete={index === 0 ? "sms-otp" : "off"}
                                importantForAutofill={index === 0 ? "yes" : "no"}
                                autoFocus={index === 0}
                                contextMenuHidden={index === 0 ? false : true}
                                editable={!loading}
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
                        <TouchableOpacity onPress={handleResendOtp} disabled={loading}>
                            <Text className="text-base text-black font-medium underline">
                                {loading ? 'Resending...' : 'Resend OTP'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Continue Button */}
                    <TouchableOpacity 
                        onPress={() => {
                            Keyboard.dismiss();
                            setTimeout(() => {
                                handleCodeVerify();
                            }, 200);
                        }} 
                        className={`mx-8 mt-12 py-4 rounded-lg ${otp.every(digit => digit !== '') && !loading ? 'bg-black' : 'bg-gray-400'}`}
                        disabled={!otp.every(digit => digit !== '') || loading}
                        activeOpacity={0.7}
                    >
                        <Text className="text-xl font-bold text-center text-white">
                            {loading ? 'Verifying...' : 'Continue'}
                        </Text>
                    </TouchableOpacity>

                    {/* Manual Continue Option */}
                    {Platform.OS === 'ios' && (
                        <View className="mt-4 px-8">
                            <Text className="text-center text-gray-500 text-xs">
                                If autofill doesn't work, tap above inputs or press Continue
                            </Text>
                        </View>
                    )}

                    {/* Terms and Conditions */}
                    <View className="mt-20 w-full items-center">
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
                </KeyboardAwareScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}