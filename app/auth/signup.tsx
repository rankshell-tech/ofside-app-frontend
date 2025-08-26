import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, ScrollView, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, User, Mail, Phone, Gift } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { ThemedView } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { loginSuccess } from '@/store/slices/authSlice';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { role } = useLocalSearchParams<{ role?: 'player' | 'venue_owner' }>();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    referralCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [whatsappUpdates, setWhatsappUpdates] = useState(false);
  const [ofsideUpdates, setOfsideUpdates] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const validateName = (name: string): boolean => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must be 2-50 characters and contain only letters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Terms agreement validation
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms of Use and Privacy Policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to verification screen with email and additional data
      router.push(`/auth/verify-code?contact=${encodeURIComponent(formData.email)}&type=email&name=${encodeURIComponent(formData.name)}&role=${role || 'player'}`);
    }, 1500);
  };

  const handleSocialSignup = (provider: string) => {
    // Placeholder for social signup implementation
    console.log(`Sign up with ${provider}`);
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid
      >
        <ThemedView style={styles.container}>
          <LinearGradient
            colors={[theme.colors.primary, '#FFF8DC', theme.colors.background]}
            style={styles.gradient}
          >
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
                    Create Account
                  </Text>
                  <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Enter your details to receive a verification code
                  </Text>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Full Name *</Text>
                    <View style={styles.inputWrapper}>
                      <User size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, {
                          color: theme.colors.text,
                          backgroundColor: theme.colors.background,
                          borderColor: errors.name ? theme.colors.error : theme.colors.border
                        }]}
                        value={formData.name}
                        onChangeText={(text) => {
                          setFormData({ ...formData, name: text });
                          clearError('name');
                        }}
                        placeholder="Enter your full name"
                        placeholderTextColor={theme.colors.textSecondary}
                        autoComplete="name"
                      />
                    </View>
                    {errors.name && (
                      <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {errors.name}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Email Address *</Text>
                    <View style={styles.inputWrapper}>
                      <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, {
                          color: theme.colors.text,
                          backgroundColor: theme.colors.background,
                          borderColor: errors.email ? theme.colors.error : theme.colors.border
                        }]}
                        value={formData.email}
                        onChangeText={(text) => {
                          setFormData({ ...formData, email: text });
                          clearError('email');
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

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Phone Number *</Text>
                    <View style={styles.inputWrapper}>
                      <Phone size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, {
                          color: theme.colors.text,
                          backgroundColor: theme.colors.background,
                          borderColor: errors.phone ? theme.colors.error : theme.colors.border
                        }]}
                        value={formData.phone}
                        onChangeText={(text) => {
                          setFormData({ ...formData, phone: text });
                          clearError('phone');
                        }}
                        placeholder="Enter your phone number"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="phone-pad"
                        autoComplete="tel"
                      />
                    </View>
                    {errors.phone && (
                      <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {errors.phone}
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={[styles.label, { color: theme.colors.text }]}>Referral Code (Optional)</Text>
                    <View style={styles.inputWrapper}>
                      <Gift size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                      <TextInput
                        style={[styles.input, {
                          color: theme.colors.text,
                          backgroundColor: theme.colors.background,
                          borderColor: theme.colors.border
                        }]}
                        value={formData.referralCode}
                        onChangeText={(text) => setFormData({ ...formData, referralCode: text })}
                        placeholder="Enter referral code"
                        placeholderTextColor={theme.colors.textSecondary}
                        autoCapitalize="characters"
                      />
                    </View>
                  </View>

                  {/* Checkboxes */}
                  <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => setWhatsappUpdates(!whatsappUpdates)}
                    >
                      <View style={[
                        styles.checkbox,
                        {
                          backgroundColor: whatsappUpdates ? theme.colors.primary : 'transparent',
                          borderColor: theme.colors.border,
                        }
                      ]}>
                        {whatsappUpdates && <Check size={16} color={theme.colors.accent} />}
                      </View>
                      <Text style={[styles.checkboxText, { color: theme.colors.text }]}>
                        Get updates on WhatsApp
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.checkboxRow}
                      onPress={() => setOfsideUpdates(!ofsideUpdates)}
                    >
                      <View style={[
                        styles.checkbox,
                        {
                          backgroundColor: ofsideUpdates ? theme.colors.primary : 'transparent',
                          borderColor: theme.colors.border,
                        }
                      ]}>
                        {ofsideUpdates && <Check size={16} color={theme.colors.accent} />}
                      </View>
                      <Text style={[styles.checkboxText, { color: theme.colors.text }]}>
                        Receive updates from Ofside
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Button
                    title={isLoading ? "Sending Code..." : "Send Verification Code"}
                    onPress={handleSignup}
                    disabled={isLoading}
                    size="lg"
                    style={styles.signupButton}
                  />

                  {/* Terms Agreement */}
                  <TouchableOpacity
                    style={styles.termsContainer}
                    onPress={() => {
                      setAgreeTerms(!agreeTerms);
                      clearError('terms');
                    }}
                  >
                    <View style={[
                      styles.checkbox,
                      {
                        backgroundColor: agreeTerms ? theme.colors.primary : 'transparent',
                        borderColor: errors.terms ? theme.colors.error : theme.colors.border,
                      }
                    ]}>
                      {agreeTerms && <Check size={16} color={theme.colors.accent} />}
                    </View>
                    <Text style={[styles.termsText, { color: theme.colors.text }]}>
                      I agree to the{' '}
                      <Text style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}>
                        Terms of Use
                      </Text>
                      {' '}and{' '}
                      <Text style={{ color: theme.colors.primary, textDecorationLine: 'underline' }}>
                        Privacy Policy
                      </Text>
                    </Text>
                  </TouchableOpacity>
                  {errors.terms && (
                    <Text style={[styles.errorText, { color: theme.colors.error, textAlign: 'center' }]}>
                      {errors.terms}
                    </Text>
                  )}
                </View>

                <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push('/auth/login')}>
                    <Text style={[styles.loginLink, { color: theme.colors.primary }]}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </LinearGradient>
        </ThemedView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: '100%',
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
    marginBottom: 20,
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
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  signupButton: {
    width: '100%',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
  checkboxContainer: {
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
    flex: 1,
    marginLeft: 8,
  },
});