import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, CreditCard, Plus, MoveVertical as MoreVertical, Trash2 } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export default function PaymentMethods() {
  const router = useRouter();
  const theme = useTheme();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      'Delete Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(method => method.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const getCardIcon = (brand: string) => {
    return <CreditCard size={24} color={theme.colors.primary} />;
  };

  const formatCardNumber = (last4: string, brand: string) => {
    return `•••• •••• •••• ${last4}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemedText size="lg" weight="bold">
            Payment Methods
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <ThemedText size="base" weight="medium" style={styles.sectionTitle}>
              Saved Payment Methods
            </ThemedText>
            <ThemedText variant="secondary" size="sm" style={styles.sectionDescription}>
              Manage your payment methods for quick and secure bookings
            </ThemedText>
          </View>

          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <View key={method.id} style={[styles.paymentMethodCard, { backgroundColor: theme.colors.background }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    {getCardIcon(method.brand || '')}
                    <View style={styles.cardDetails}>
                      <ThemedText size="base" weight="medium">
                        {method.brand} {formatCardNumber(method.last4 || '', method.brand || '')}
                      </ThemedText>
                      <ThemedText variant="secondary" size="sm">
                        Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash2 size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>

                {method.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: theme.colors.primary }]}>
                    <ThemedText size="xs" weight="medium" style={{ color: theme.colors.accent }}>
                      Default
                    </ThemedText>
                  </View>
                )}

                {!method.isDefault && (
                  <TouchableOpacity
                    style={styles.setDefaultButton}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                      Set as Default
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={styles.addButtonContainer}>
            <Button
              title="Add New Payment Method"
              onPress={() => {
                // TODO: Navigate to add payment method screen
                Alert.alert('Coming Soon', 'Payment method integration will be available soon.');
              }}
              variant="outline"
              size="lg"
              style={styles.addButton}
            />
          </View>

          <View style={[styles.securityCard, { backgroundColor: theme.colors.surface }]}>
            <ThemedText size="sm" weight="medium" style={styles.securityTitle}>
              🔒 Secure Payments
            </ThemedText>
            <ThemedText variant="secondary" size="xs" style={styles.securityText}>
              Your payment information is encrypted and secure. We use industry-standard security measures to protect your financial data.
            </ThemedText>
          </View>

          <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
            <ThemedText size="sm" weight="medium" style={styles.infoTitle}>
              Supported Payment Methods
            </ThemedText>
            <View style={styles.supportedMethods}>
              <ThemedText variant="secondary" size="xs">
                • Credit & Debit Cards (Visa, Mastercard, American Express)
              </ThemedText>
              <ThemedText variant="secondary" size="xs">
                • PayPal (Coming Soon)
              </ThemedText>
              <ThemedText variant="secondary" size="xs">
                • Apple Pay & Google Pay (Coming Soon)
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  sectionDescription: {
    lineHeight: 18,
  },
  paymentMethodsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  paymentMethodCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardDetails: {
    marginLeft: 12,
    flex: 1,
  },
  moreButton: {
    padding: 8,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  addButtonContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  addButton: {
    borderStyle: 'dashed',
  },
  securityCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  securityTitle: {
    marginBottom: 8,
  },
  securityText: {
    lineHeight: 16,
  },
  infoCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  infoTitle: {
    marginBottom: 12,
  },
  supportedMethods: {
    gap: 4,
  },
});