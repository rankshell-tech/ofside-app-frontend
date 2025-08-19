import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, TrendingUp, TrendingDown, Users, Building, Calendar, DollarSign, Download } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  period: string;
  users: { total: number; growth: number };
  venues: { total: number; growth: number };
  bookings: { total: number; growth: number };
  revenue: { total: number; growth: number };
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export default function AdminAnalytics() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  // Mock analytics data - replace with API call
  const analyticsData: Record<string, AnalyticsData> = {
    week: {
      period: 'This Week',
      users: { total: 47, growth: 12.5 },
      venues: { total: 3, growth: 50.0 },
      bookings: { total: 89, growth: 8.3 },
      revenue: { total: 4250, growth: 15.7 },
    },
    month: {
      period: 'This Month',
      users: { total: 1247, growth: 18.2 },
      venues: { total: 89, growth: 12.6 },
      bookings: { total: 3456, growth: 22.1 },
      revenue: { total: 45200, growth: 28.4 },
    },
    quarter: {
      period: 'This Quarter',
      users: { total: 3891, growth: 24.7 },
      venues: { total: 267, growth: 31.2 },
      bookings: { total: 12847, growth: 19.8 },
      revenue: { total: 156800, growth: 33.9 },
    },
    year: {
      period: 'This Year',
      users: { total: 15634, growth: 42.3 },
      venues: { total: 892, growth: 67.8 },
      bookings: { total: 48392, growth: 51.2 },
      revenue: { total: 634500, growth: 78.6 },
    },
  };

  const currentData = analyticsData[selectedPeriod];

  // Mock chart data
  const revenueChartData: ChartData[] = [
    { label: 'Jan', value: 32000, color: theme.colors.primary },
    { label: 'Feb', value: 28000, color: theme.colors.primary },
    { label: 'Mar', value: 35000, color: theme.colors.primary },
    { label: 'Apr', value: 42000, color: theme.colors.primary },
    { label: 'May', value: 38000, color: theme.colors.primary },
    { label: 'Jun', value: 45200, color: theme.colors.accent },
  ];

  const topSportsData: ChartData[] = [
    { label: 'Football', value: 35, color: theme.colors.primary },
    { label: 'Tennis', value: 28, color: theme.colors.accent },
    { label: 'Basketball', value: 22, color: theme.colors.success },
    { label: 'Badminton', value: 15, color: theme.colors.warning },
  ];

  const maxRevenueValue = Math.max(...revenueChartData.map(d => d.value));

  const renderBarChart = (data: ChartData[], maxValue: number) => {
    return (
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.value / maxValue) * 120,
                    backgroundColor: item.color,
                  },
                ]}
              />
              <ThemedText size="xs" variant="secondary" style={styles.barLabel}>
                {item.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPieChart = (data: ChartData[]) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {data.map((item, index) => (
            <View
              key={index}
              style={[
                styles.pieSlice,
                {
                  backgroundColor: item.color,
                  width: `${(item.value / total) * 100}%`,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.pieLegend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <ThemedText size="sm">{item.label}</ThemedText>
              <ThemedText size="sm" weight="bold">{item.value}%</ThemedText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Analytics Dashboard
        </ThemedText>
        <TouchableOpacity>
          <Download size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <View style={styles.periodContainer}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Analytics Overview
          </ThemedText>
          <View style={styles.periodSelector}>
            {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
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

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: theme.colors.primary }]}>
                <Users size={20} color={theme.colors.accent} />
              </View>
              <View style={[styles.growthBadge, { backgroundColor: theme.colors.success }]}>
                <TrendingUp size={12} color={theme.colors.background} />
                <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background, marginLeft: 4 }}>
                  +{currentData.users.growth}%
                </ThemedText>
              </View>
            </View>
            <ThemedText size="2xl" weight="bold" style={styles.metricValue}>
              {currentData.users.total.toLocaleString()}
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Total Users
            </ThemedText>
          </View>

          <View style={[styles.metricCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: theme.colors.accent }]}>
                <Building size={20} color={theme.colors.background} />
              </View>
              <View style={[styles.growthBadge, { backgroundColor: theme.colors.success }]}>
                <TrendingUp size={12} color={theme.colors.background} />
                <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background, marginLeft: 4 }}>
                  +{currentData.venues.growth}%
                </ThemedText>
              </View>
            </View>
            <ThemedText size="2xl" weight="bold" style={styles.metricValue}>
              {currentData.venues.total.toLocaleString()}
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Active Venues
            </ThemedText>
          </View>
        </View>

        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: theme.colors.success }]}>
                <Calendar size={20} color={theme.colors.background} />
              </View>
              <View style={[styles.growthBadge, { backgroundColor: theme.colors.success }]}>
                <TrendingUp size={12} color={theme.colors.background} />
                <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background, marginLeft: 4 }}>
                  +{currentData.bookings.growth}%
                </ThemedText>
              </View>
            </View>
            <ThemedText size="2xl" weight="bold" style={styles.metricValue}>
              {currentData.bookings.total.toLocaleString()}
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Total Bookings
            </ThemedText>
          </View>

          <View style={[styles.metricCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.metricHeader}>
              <View style={[styles.metricIcon, { backgroundColor: theme.colors.warning }]}>
                <DollarSign size={20} color={theme.colors.background} />
              </View>
              <View style={[styles.growthBadge, { backgroundColor: theme.colors.success }]}>
                <TrendingUp size={12} color={theme.colors.background} />
                <ThemedText size="xs" weight="bold" style={{ color: theme.colors.background, marginLeft: 4 }}>
                  +{currentData.revenue.growth}%
                </ThemedText>
              </View>
            </View>
            <ThemedText size="2xl" weight="bold" style={styles.metricValue}>
              ${(currentData.revenue.total / 1000).toFixed(1)}K
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              Total Revenue
            </ThemedText>
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.section}>
          <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
            Revenue Trend
          </ThemedText>
          <View style={[styles.chartCard, { backgroundColor: theme.colors.background }]}>
            {renderBarChart(revenueChartData, maxRevenueValue)}
            <View style={styles.chartFooter}>
              <ThemedText variant="secondary" size="sm">
                Monthly revenue growth over the last 6 months
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Top Sports */}
        <View style={styles.section}>
          <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
            Popular Sports
          </ThemedText>
          <View style={[styles.chartCard, { backgroundColor: theme.colors.background }]}>
            {renderPieChart(topSportsData)}
          </View>
        </View>

        {/* Performance Insights */}
        <View style={styles.section}>
          <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
            Key Insights
          </ThemedText>
          <View style={[styles.insightsCard, { backgroundColor: theme.colors.background }]}>
            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: theme.colors.success }]}>
                <TrendingUp size={16} color={theme.colors.background} />
              </View>
              <View style={styles.insightContent}>
                <ThemedText size="sm" weight="bold">Peak booking hours</ThemedText>
                <ThemedText variant="secondary" size="xs">
                  Most bookings occur between 6-9 PM on weekdays
                </ThemedText>
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: theme.colors.primary }]}>
                <Users size={16} color={theme.colors.accent} />
              </View>
              <View style={styles.insightContent}>
                <ThemedText size="sm" weight="bold">User retention</ThemedText>
                <ThemedText variant="secondary" size="xs">
                  78% of users make repeat bookings within 30 days
                </ThemedText>
              </View>
            </View>

            <View style={styles.insightItem}>
              <View style={[styles.insightIcon, { backgroundColor: theme.colors.accent }]}>
                <Building size={16} color={theme.colors.background} />
              </View>
              <View style={styles.insightContent}>
                <ThemedText size="sm" weight="bold">Top performing venues</ThemedText>
                <ThemedText variant="secondary" size="xs">
                  Elite Sports Complex leads with 89% occupancy rate
                </ThemedText>
              </View>
            </View>
          </View>
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
  periodContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
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
  metricsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricValue: {
    marginBottom: 4,
  },
  section: {
    marginBottom: 24,
  },
  chartCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartContainer: {
    height: 160,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    textAlign: 'center',
  },
  chartFooter: {
    marginTop: 16,
    alignItems: 'center',
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  pieChart: {
    flexDirection: 'row',
    width: 200,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  pieSlice: {
    height: '100%',
  },
  pieLegend: {
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  insightsCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
});