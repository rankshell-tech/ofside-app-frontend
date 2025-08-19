import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Download, CreditCard } from 'lucide-react-native';

interface EarningsData {
  period: string;
  amount: number;
  bookings: number;
  growth: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'booking' | 'payout' | 'refund';
}

export default function EarningsPayouts() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Mock earnings data
  const earningsData: Record<string, EarningsData> = {
    week: { period: 'This Week', amount: 1250, bookings: 18, growth: 12.5 },
    month: { period: 'This Month', amount: 4250, bookings: 156, growth: 8.3 },
    year: { period: 'This Year', amount: 48500, bookings: 1842, growth: 15.7 },
  };

  const currentEarnings = earningsData[selectedPeriod];

  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2025-01-20',
      description: 'Court A Booking - John Doe',
      amount: 100,
      status: 'completed',
      type: 'booking',
    },
    {
      id: '2',
      date: '2025-01-19',
      description: 'Weekly Payout',
      amount: -850,
      status: 'completed',
      type: 'payout',
    },
    {
      id: '3',
      date: '2025-01-18',
      description: 'Field B Booking - Jane Smith',
      amount: 160,
      status: 'completed',
      type: 'booking',
    },
    {
      id: '4',
      date: '2025-01-17',
      description: 'Booking Refund - Mike Johnson',
      amount: -75,
      status: 'completed',
      type: 'refund',
    },
    {
      id: '5',
      date: '2025-01-16',
      description: 'Court C Booking - Sarah Wilson',
      amount: 120,
      status: 'pending',
      type: 'booking',
    },
  ];

  const availableBalance = 1420;
  const pendingPayouts = 340;

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'booking': return <TrendingUp size={16} color={theme.colors.success} />;
      case 'payout': return <Download size={16} color={theme.colors.primary} />;
      case 'refund': return <ArrowLeft size={16} color={theme.colors.error} />;
      default: return <DollarSign size={16} color={theme.colors.textSecondary} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'failed': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Earnings & Payouts
        </ThemedText>
        <TouchableOpacity>
          <Download size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Balance Cards */}
        <View style={styles.balanceContainer}>
          <View style={[styles.balanceCard, { backgroundColor: theme.colors.primary }]}>
            <View style={styles.balanceIcon}>
              <DollarSign size={24} color={theme.colors.accent} />
            </View>
            <ThemedText size="sm" style={{ color: theme.colors.accent, marginBottom: 4 }}>
              Available Balance
            </ThemedText>
            <ThemedText size="2xl" weight="bold" style={{ color: theme.colors.accent }}>
              ${availableBalance.toLocaleString()}
            </ThemedText>
            <Button
              title="Withdraw"
              onPress={() => router.push('/venue-owner/withdraw')}
              variant="outline"
              size="sm"
              style={[styles.withdrawButton, { borderColor: theme.colors.accent }]}
              textStyle={{ color: theme.colors.accent }}
            />
          </View>

          <View style={[styles.balanceCard, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.balanceIcon, { backgroundColor: theme.colors.warning }]}>
              <Calendar size={24} color={theme.colors.background} />
            </View>
            <ThemedText variant="secondary" size="sm" style={styles.balanceLabel}>
              Pending Payouts
            </ThemedText>
            <ThemedText size="xl" weight="bold">
              ${pendingPayouts.toLocaleString()}
            </ThemedText>
            <ThemedText variant="secondary" size="xs" style={styles.balanceHint}>
              Next payout in 3 days
            </ThemedText>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Earnings Overview
          </ThemedText>
          <View style={styles.periodSelector}>
            {(['week', 'month', 'year'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: selectedPeriod === period ? theme.colors.primary : theme.colors.surface,
                  },
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <ThemedText
                  size="sm"
                  weight="medium"
                  style={{
                    color: selectedPeriod === period ? theme.colors.accent : theme.colors.textSecondary,
                  }}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Earnings Stats */}
        <View style={[styles.statsCard, { backgroundColor: theme.colors.background }]}>
          <View style={styles.statsHeader}>
            <ThemedText size="lg" weight="bold">
              {currentEarnings.period}
            </ThemedText>
            <View style={[styles.growthBadge, { backgroundColor: theme.colors.success }]}>
              <TrendingUp size={12} color={theme.colors.background} />
              <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background, marginLeft: 4 }}>
                +{currentEarnings.growth}%
              </ThemedText>
            </View>
          </View>

          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <ThemedText size="3xl" weight="bold">
                ${currentEarnings.amount.toLocaleString()}
              </ThemedText>
              <ThemedText variant="secondary" size="sm">
                Total Earnings
              </ThemedText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <ThemedText size="2xl" weight="bold">
                {currentEarnings.bookings}
              </ThemedText>
              <ThemedText variant="secondary" size="sm">
                Total Bookings
              </ThemedText>
            </View>
          </View>

          <View style={styles.averageEarning}>
            <ThemedText variant="secondary" size="sm">
              Average per booking: ${(currentEarnings.amount / currentEarnings.bookings).toFixed(2)}
            </ThemedText>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText size="base" weight="bold">
              Recent Transactions
            </ThemedText>
            <TouchableOpacity>
              <ThemedText size="sm" style={{ color: theme.colors.primary }}>
                View All
              </ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsContainer}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={[styles.transactionItem, { backgroundColor: theme.colors.background }]}>
                <View style={styles.transactionIcon}>
                  {getTransactionIcon(transaction.type)}
                </View>

                <View style={styles.transactionDetails}>
                  <ThemedText size="sm" weight="medium">
                    {transaction.description}
                  </ThemedText>
                  <View style={styles.transactionMeta}>
                    <ThemedText variant="secondary" size="xs">
                      {new Date(transaction.date).toLocaleDateString()}
                    </ThemedText>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(transaction.status) }]} />
                    <ThemedText variant="secondary" size="xs">
                      {transaction.status}
                    </ThemedText>
                  </View>
                </View>

                <ThemedText
                  size="sm"
                  weight="bold"
                  style={{
                    color: transaction.amount > 0 ? theme.colors.success : theme.colors.error,
                  }}
                >
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Payout Settings */}
        <View style={[styles.payoutCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.payoutHeader}>
            <CreditCard size={20} color={theme.colors.primary} />
            <ThemedText size="base" weight="bold" style={styles.payoutTitle}>
              Payout Settings
            </ThemedText>
          </View>
          <ThemedText variant="secondary" size="sm" style={styles.payoutDescription}>
            Automatic weekly payouts to your linked bank account ending in ****1234
          </ThemedText>
          <TouchableOpacity style={styles.payoutButton}>
            <ThemedText size="sm" style={{ color: theme.colors.primary }}>
              Update Payout Method
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  balanceContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  balanceCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  balanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    marginBottom: 4,
  },
  balanceHint: {
    marginTop: 4,
  },
  withdrawButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  periodContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  periodSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  statsCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  averageEarning: {
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  transactionsContainer: {
    paddingHorizontal: 24,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 6,
  },
  payoutCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 40,
  },
  payoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  payoutTitle: {
    marginLeft: 8,
  },
  payoutDescription: {
    lineHeight: 18,
    marginBottom: 12,
  },
  payoutButton: {
    alignSelf: 'flex-start',
  },
});