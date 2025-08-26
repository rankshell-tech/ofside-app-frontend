import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { ThemedView } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Zocial } from '@expo/vector-icons';
import GoogleIcon from "../../components/GoogleIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";

const apiUrl = Constants.expoConfig?.extra?.API_URL;

export default function Login() {
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string}>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: {email?: string} = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSendCode = async () => {
  console.log("Sending code to:", email);
  if (!validateForm()) {
    console.log("Form validation failed:", errors);
    return;
  }

  setIsLoading(true);

  try {
    if (!apiUrl) {
      console.error("API_URL environment variable is not set");
      throw new Error("API_URL environment variable is not set");
    }
    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier: email }),
    });

    console.log("Response:", response);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // ✅ Success
    Alert.alert("Success", data.message);

    // Navigate to verify screen with email
    router.push(`/auth/verify-code?contact=${encodeURIComponent(email)}&type=email`);
  } catch (error: any) {
    Alert.alert("Error", error.message || "Failed to send code");
  } finally {
    setIsLoading(false);
  }
};


  const handleSocialLogin = (provider: string) => {
    // Placeholder for social login implementation
    console.log(`Login with ${provider}`);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid
    >
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={[theme.colors.primary, '#FFF8DC', theme.colors.background]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: 'https://ofside.in/assets/ofside-logo.png' }}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Enter your email to receive a verification code
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.text }]}>
                  Email Address
                </Text>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, {
                      color: theme.colors.text,
                      backgroundColor: theme.colors.background,
                      borderColor: errors.email ? theme.colors.error : theme.colors.border
                    }]}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (errors.email) {
                        setErrors(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="Enter your email address"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
                {errors.email && (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors.email}
                  </Text>
                )}
              </View>

              <Button
                title={isLoading ? "Sending Code..." : "Send Verification Code"}
                onPress={handleSendCode}
                disabled={isLoading}
                size="lg"
                style={styles.sendButton}
              />

              {/* Social Login Options */}
              <View style={styles.socialContainer}>
                <View style={styles.dividerContainer}>
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                  <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>
                    Or continue with
                  </Text>
                  <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                </View>
                {/* Social Icons */}
                <View className="flex-row justify-center mt-10">
                  <TouchableOpacity
                    className="w-16 h-16 border border-black rounded-lg items-center justify-center mr-10 bg-white"
                    onPress={() => handleSocialLogin('Apple')}
                  >
                      <Zocial name="email" size={36} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-16 h-16 border border-black rounded-lg items-center justify-center mr-10 bg-white"
                    onPress={() => handleSocialLogin('Google')}
                  >
                      <GoogleIcon size={36} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="w-16 h-16 border border-black rounded-lg items-center justify-center bg-white"
                    onPress={() => handleSocialLogin('Apple')}
                  >
                      <AntDesign name="apple1" size={36} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                <Text style={[styles.signupLink, { color: theme.colors.primary }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ThemedView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 48,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  sendButton: {
    width: '100%',
    marginBottom: 24,
  },
  socialContainer: {
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  socialButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
});