import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { ThemedView } from '@/components/ui/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { loginSuccess } from '@/store/slices/authSlice';

export default function VerifyCode() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { contact, type, name, role } = useLocalSearchParams<{ 
    contact: string; 
    type: 'email' | 'phone';
    name?: string;
    role?: 'player' | 'venue_owner';
  }>();

  const [code, setCode] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyCode = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 4) {
      Alert.alert('Error', 'Please enter the complete 4-digit code');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any 4-digit code
      const user = {
        id: Date.now().toString(),
        email: type === 'email' ? contact : `${contact}@example.com`,
        name: name || (contact.includes('owner') ? 'Venue Owner' : 'John Player'),
        role: role || (contact.includes('owner') ? 'venue_owner' as const : 'player' as const),
        phone: type === 'phone' ? contact : '+1234567890',
        location: 'New York, NY',
      };
      
      dispatch(loginSuccess(user));
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  const handleResendCode = () => {
    Alert.alert('Code Sent', `A new verification code has been sent to your ${type}.`);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.container}>
        <LinearGradient
          colors={[theme.colors.primary, '#FFF8DC', theme.colors.background]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Verify Your {type === 'email' ? 'Email' : 'Phone'}
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                We've sent a 4-digit verification code to
              </Text>
              <Text style={[styles.contact, { color: theme.colors.text }]}>
                {contact}
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={[styles.codeInput, { 
                      color: theme.colors.text, 
                      backgroundColor: theme.colors.background,
                      borderColor: digit ? theme.colors.primary : theme.colors.border 
                    }]}
                    value={digit}
                    onChangeText={(text) => handleCodeChange(text, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>

              <Button
                title={isLoading ? "Verifying..." : "Verify Code"}
                onPress={handleVerifyCode}
                disabled={isLoading || code.join('').length !== 4}
                size="lg"
                style={styles.verifyButton}
              />

              <View style={styles.resendContainer}>
                <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
                  Didn't receive the code?
                </Text>
                <TouchableOpacity onPress={handleResendCode}>
                  <Text style={[styles.resendLink, { color: theme.colors.primary }]}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ThemedView>
    </KeyboardAvoidingView>
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
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 20,
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
    marginBottom: 8,
  },
  contact: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  codeInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  verifyButton: {
    width: '100%',
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
});