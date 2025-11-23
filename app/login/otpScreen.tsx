import { AntDesign, Zocial } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GoogleIcon from '@/components/GoogleIcon';
import { router, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// Custom full-screen loader to indicate async operations (verify/resend) in progress
import OfsideLoader from '@/components/ui/ofsideLoader';
// Redux: dispatch typed with our app store for safe action dispatching
import { useDispatch } from 'react-redux';
// Redux actions: update auth state on successful OTP verification
import { loginSuccess, logout } from '@/store/slices/authSlice';
// Redux: access typed state if needed (kept for future state reads on this screen)
import { useSelector } from 'react-redux';
// Typed RootState and AppDispatch from our store for TS safety
import { RootState } from '@/store';
import { AppDispatch } from '@/store';
const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

export default function OtpScreen() {
    const [loading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const identifier = typeof params.email === 'string' ? params.email : '';
    const typeOfAuth = typeof params.type === 'string' ? params.type : '';
    const [otp, setOtp] = useState(['', '', '', '']);
    const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);
    const [firstInputValue, setFirstInputValue] = useState('');
    
    // Create refs for each input
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const otpRef = useRef(otp);
    
    // Keep ref in sync with state
    useEffect(() => {
        otpRef.current = otp;
    }, [otp]);

    const dispatch = useDispatch<AppDispatch>();

    // Watch for SMS autofill in first input and distribute immediately
    useEffect(() => {
        if (firstInputValue.length > 1 && !hasAutoSubmitted) {
            const digits = firstInputValue.replace(/[^0-9]/g, '').slice(0, 4).split('');
            if (digits.length >= 4) {
                // Immediately distribute digits across all inputs in one update
                const newOtp = digits.slice(0, 4);
                setOtp(newOtp);
                otpRef.current = newOtp;
                setFirstInputValue(newOtp[0]); // Reset first input to show only first digit
                
                // Blur all inputs and auto-submit
                requestAnimationFrame(() => {
                    inputRefs.current.forEach(ref => ref?.blur());
                    Keyboard.dismiss();
                    
                    // Auto-submit after a brief delay
                    setTimeout(() => {
                        if (!hasAutoSubmitted && newOtp.every(digit => digit !== '')) {
                            // Use the latest OTP from ref
                            const currentOtp = otpRef.current;
                            if (currentOtp.every(digit => digit !== '')) {
                                handleCodeVerify();
                            }
                        }
                    }, 150);
                });
            }
        }
    }, [firstInputValue, hasAutoSubmitted]);

    const handleCodeVerify = async () => {
        console.log('Verifying OTP for:', identifier, 'with OTP:', otp.join(''), 'and type:', typeOfAuth);
        try {
            // Basic validation
            const joinedOtp = otp.join('');
            if (joinedOtp.length !== 4) {
                Alert.alert('Invalid code', 'Please enter the 4-digit code.');
                return;
            }
            if (!identifier) {
                Alert.alert('Missing identifier', 'No email or phone number found.');
                return;
            }
            if (!typeOfAuth) {
                Alert.alert('Missing auth type', 'Authentication type is not provided.');
                return;
            }

            // Prevent multiple submissions
            if (loading) return;
            
            setLoading(true);
            setHasAutoSubmitted(true);
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
                // ignore json parse errors; will fall back to generic messages
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

            // If API returns a success flag/token, we could store it here
            // For now, consider any 2xx as success
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
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP input change
    const handleOtpChange = (text: string, index: number) => {
        // Only allow numbers
        const numericText = text.replace(/[^0-9]/g, '');
        
        // Special handling for first input (SMS autofill)
        if (index === 0) {
            // If multiple digits detected (SMS autofill), store in separate state
            if (numericText.length > 1) {
                setFirstInputValue(numericText);
                return; // useEffect will handle distribution
            } else {
                setFirstInputValue(numericText);
                const newOtp = [...otp];
                newOtp[0] = numericText;
                setOtp(newOtp);
                
                // Auto-focus to next input if filled
                if (numericText && index < 3) {
                    inputRefs.current[index + 1]?.focus();
                }
                return;
            }
        }
        
        // For other inputs, handle normally
        const newOtp = [...otp];
        newOtp[index] = numericText;
        setOtp(newOtp);

        // Auto-focus to next input if current input is filled
        if (numericText && index < 3) {
            inputRefs.current[index + 1]?.focus();
        } else if (numericText && index === 3) {
            // Last input filled, dismiss keyboard and auto-submit
            inputRefs.current[index]?.blur();
            Keyboard.dismiss();
            setTimeout(() => {
                if (newOtp.every(digit => digit !== '') && !hasAutoSubmitted) {
                    handleCodeVerify();
                }
            }, 150);
        }
        
        // Check if all fields are filled (for edge cases)
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4 && !hasAutoSubmitted) {
            inputRefs.current.forEach(ref => ref?.blur());
            Keyboard.dismiss();
            setTimeout(() => {
                handleCodeVerify();
            }, 200);
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
        // Don't clear on focus - this prevents SMS autofill from working
        // Only select the text so user can easily replace it
        inputRefs.current[index]?.setNativeProps({ selection: { start: 0, end: 1 } });
    };


    if(loading) {
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
                            value={index === 0 ? (firstInputValue.length > 1 ? firstInputValue[0] : digit) : digit}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            onFocus={() => handleFocus(index)}
                            maxLength={index === 0 ? 4 : 1}
                            keyboardType="number-pad"
                            className="w-14 h-14 border-2 border-black rounded-lg text-center text-xl font-bold bg-white"
                            selectTextOnFocus={index === 0 ? false : true}
                            textContentType={index === 0 ? "oneTimeCode" : "none"}
                            autoComplete={index === 0 ? "sms-otp" : "off"}
                            importantForAutofill={index === 0 ? "yes" : "no"}
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
                        handleCodeVerify();
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