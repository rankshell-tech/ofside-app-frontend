import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, CreditCard, DollarSign, CircleAlert as AlertCircle, Check } from 'lucide-react-native';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  isDefault: boolean;
}

export default function WithdrawFunds() {
  const router = useRouter();
  const theme = useTheme();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const availableBalance = 1420;
  const minimumWithdraw = 50;

  // Mock bank accounts
  const bankAccounts: BankAccount[] = [
    {
      id: '1',
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      accountType: 'Checking',
      isDefault: true,
    },
    {
      id: '2',
      bankName: 'Bank of America',
      accountNumber: '****5678',
      accountType: 'Savings',
      isDefault: false,
    },
  ];

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    
    if (!amount || amount < minimumWithdraw) {
      Alert.alert('Invalid Amount', `Minimum withdrawal amount is $${minimumWithdraw}`);
      return;
    }
    
    if (amount > availableBalance) {
      Alert.alert('Insufficient Balance', 'Withdrawal amount exceeds available balance');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Withdrawal Requested',
        `Your withdrawal of $${amount} has been requested. Funds will be transferred to your account within 1-3 business days.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 2000);
  };

  const quickAmounts = [100, 250, 500, 1000];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Withdraw Funds
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Available Balance */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.balanceIcon, { backgroundColor: theme.colors.primary }]}>
            <DollarSign size={24} color={theme.colors.accent} />
          </View>
          <ThemedText variant="secondary" size="sm" style={styles.balanceLabel}>
            Available Balance
          </ThemedText>
          <ThemedText size="3xl" weight="bold">
            ${availableBalance.toLocaleString()}
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.balanceHint}>
            Minimum withdrawal: ${minimumWithdraw}
          </ThemedText>
        </View>

        {/* Withdrawal Amount */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Withdrawal Amount
          </ThemedText>
          
          <View style={[styles.amountInputContainer, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="2xl" weight="bold" style={styles.dollarSign}>
              $
            </ThemedText>
            <TextInput
              style={[styles.amountInput, { color: theme.colors.text }]}
              value={withdrawAmount}
              onChangeText={setWithdrawAmount}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          {/* Quick Amount Buttons */}
          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickAmountButton,
                  {
                    backgroundColor: withdrawAmount === amount.toString() 
                      ? theme.colors.primary 
                      : theme.colors.surface,
                    borderColor: withdrawAmount === amount.toString() 
                      ? theme.colors.primary 
                      : theme.colors.border,
                  },
                ]}
                onPress={() => setWithdrawAmount(amount.toString())}
                disabled={amount > availableBalance}
              >
                <ThemedText
                  size="sm"
                  weight="medium"
                  style={{
                    color: withdrawAmount === amount.toString()
                      ? theme.colors.accent
                      : amount > availableBalance
                      ? theme.colors.textSecondary
                      : theme.colors.text,
                  }}
                >
                  ${amount}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.maxButton, { borderColor: theme.colors.primary }]}
            onPress={() => setWithdrawAmount(availableBalance.toString())}
          >
            <ThemedText size="sm" style={{ color: theme.colors.primary }}>
              Withdraw Maximum (${availableBalance})
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Bank Account Selection */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Withdraw To
          </ThemedText>
          
          <View style={styles.accountsContainer}>
            {bankAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.accountCard,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: selectedAccount === account.id 
                      ? theme.colors.primary 
                      : theme.colors.border,
                    borderWidth: selectedAccount === account.id ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedAccount(account.id)}
              >
                <View style={styles.accountHeader}>
                  <View style={[styles.accountIcon, { backgroundColor: theme.colors.surface }]}>
                    <CreditCard size={20} color={theme.colors.textSecondary} />
                  </View>
                  <View style={styles.accountDetails}>
                    <ThemedText size="base" weight="bold">
                      {account.bankName}
                    </ThemedText>
                    <ThemedText variant="secondary" size="sm">
                      {account.accountType} {account.accountNumber}
                    </ThemedText>
                  </View>
                  {selectedAccount === account.id && (
                    <View style={[styles.selectedIcon, { backgroundColor: theme.colors.primary }]}>
                      <Check size={16} color={theme.colors.accent} />
                    </View>
                  )}
                </View>
                {account.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: theme.colors.surface }]}>
                    <ThemedText size="xs" weight="medium" style={{ color: theme.colors.primary }}>
                      Default
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addAccountButton}>
            <ThemedText size="sm" style={{ color: theme.colors.primary }}>
              + Add New Bank Account
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Processing Info */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.infoHeader}>
            <AlertCircle size={16} color={theme.colors.primary} />
            <ThemedText size="sm" weight="medium" style={styles.infoTitle}>
              Processing Information
            </ThemedText>
          </View>
          <ThemedText variant="secondary" size="xs" style={styles.infoText}>
            • Withdrawals are processed within 1-3 business days
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.infoText}>
            • No fees for standard bank transfers
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.infoText}>
            • Instant transfers available for eligible accounts (2.5% fee)
          </ThemedText>
          <ThemedText variant="secondary" size="xs" style={styles.infoText}>
            • You'll receive an email confirmation once processed
          </ThemedText>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        <View style={styles.withdrawalSummary}>
          <ThemedText variant="secondary" size="sm">
            Withdrawing
          </ThemedText>
          <ThemedText size="lg" weight="bold">
            ${withdrawAmount || '0.00'}
          </ThemedText>
        </View>
        <Button
          title={isLoading ? "Processing..." : "Withdraw Funds"}
          onPress={handleWithdraw}
          disabled={isLoading || !withdrawAmount || parseFloat(withdrawAmount) < minimumWithdraw}
          size="lg"
          style={styles.withdrawButton}
        />
      </View>
    </ThemedView>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  balanceCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  balanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    marginBottom: 8,
  },
  balanceHint: {
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dollarSign: {
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  quickAmountButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  maxButton: {
    marginHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  accountsContainer: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  accountCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  selectedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addAccountButton: {
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  infoCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 100,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    marginLeft: 8,
  },
  infoText: {
    lineHeight: 16,
    marginBottom: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  withdrawalSummary: {
    flex: 1,
  },
  withdrawButton: {
    paddingHorizontal: 32,
  },
});