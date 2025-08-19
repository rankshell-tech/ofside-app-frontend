import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, DollarSign, Clock, TrendingUp, Save } from 'lucide-react-native';
import { mockVenues } from '@/data/mockData';
import { sports } from '@/constants/theme';

interface PricingRule {
  id: string;
  name: string;
  timeSlots: string;
  multiplier: number;
  isActive: boolean;
}

interface CourtPricing {
  courtId: string;
  courtName: string;
  baseRate: number;
  peakRate: number;
  offPeakRate: number;
  weekendRate: number;
}

export default function PricingManagement() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock pricing data
  const [courtPricing, setCourtPricing] = useState<CourtPricing[]>(
    selectedVenue.facilities.flatMap(facility =>
      facility.courts.map(court => ({
        courtId: court.id,
        courtName: court.name,
        baseRate: court.hourlyRate,
        peakRate: court.hourlyRate * 1.5,
        offPeakRate: court.hourlyRate * 0.8,
        weekendRate: court.hourlyRate * 1.3,
      }))
    )
  );

  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: '1',
      name: 'Peak Hours',
      timeSlots: '6:00 PM - 10:00 PM',
      multiplier: 1.5,
      isActive: true,
    },
    {
      id: '2',
      name: 'Off-Peak Hours',
      timeSlots: '9:00 AM - 5:00 PM',
      multiplier: 0.8,
      isActive: true,
    },
    {
      id: '3',
      name: 'Weekend Premium',
      timeSlots: 'Saturday & Sunday',
      multiplier: 1.3,
      isActive: true,
    },
    {
      id: '4',
      name: 'Early Bird',
      timeSlots: '6:00 AM - 9:00 AM',
      multiplier: 0.7,
      isActive: false,
    },
  ]);

  const updateCourtPricing = (courtId: string, field: keyof CourtPricing, value: number) => {
    setCourtPricing(prev =>
      prev.map(court =>
        court.courtId === courtId ? { ...court, [field]: value } : court
      )
    );
  };

  const togglePricingRule = (ruleId: string) => {
    setPricingRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  const updatePricingRule = (ruleId: string, field: keyof PricingRule, value: string | number) => {
    setPricingRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, [field]: value } : rule
      )
    );
  };

  const handleSavePricing = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Pricing updated successfully!');
    }, 1500);
  };

  const getFacilityIcon = (sport: string) => {
    const sportData = sports.find(s => s.id === sport);
    return sportData?.icon || '🏟️';
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Pricing Management
        </ThemedText>
        <TouchableOpacity onPress={handleSavePricing}>
          <Save size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Venue Selection */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Selected Venue
          </ThemedText>
          <View style={[styles.venueCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="lg" weight="bold">
              {selectedVenue.name}
            </ThemedText>
            <ThemedText variant="secondary" size="sm">
              {selectedVenue.facilities.length} facilities • {courtPricing.length} courts
            </ThemedText>
          </View>
        </View>

        {/* Court Pricing */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Court Pricing
          </ThemedText>
          
          {selectedVenue.facilities.map((facility) => {
            const facilityCourts = courtPricing.filter(cp => 
              facility.courts.some(c => c.id === cp.courtId)
            );
            
            return (
              <View key={facility.id} style={[styles.facilitySection, { backgroundColor: theme.colors.background }]}>
                <View style={styles.facilityHeader}>
                  <ThemedText size="lg">{getFacilityIcon(facility.sport)}</ThemedText>
                  <ThemedText size="base" weight="bold" style={styles.facilityTitle}>
                    {facility.name}
                  </ThemedText>
                </View>

                {facilityCourts.map((court) => (
                  <View key={court.courtId} style={[styles.courtPricingCard, { backgroundColor: theme.colors.surface }]}>
                    <ThemedText size="base" weight="medium" style={styles.courtName}>
                      {court.courtName}
                    </ThemedText>
                    
                    <View style={styles.pricingGrid}>
                      <View style={styles.pricingItem}>
                        <ThemedText variant="secondary" size="xs">Base Rate</ThemedText>
                        <View style={styles.priceInputContainer}>
                          <ThemedText size="sm">$</ThemedText>
                          <TextInput
                            style={[styles.priceInput, { 
                              color: theme.colors.text,
                              borderColor: theme.colors.border 
                            }]}
                            value={court.baseRate.toString()}
                            onChangeText={(text) => updateCourtPricing(court.courtId, 'baseRate', parseFloat(text) || 0)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={theme.colors.textSecondary}
                          />
                        </View>
                      </View>

                      <View style={styles.pricingItem}>
                        <ThemedText variant="secondary" size="xs">Peak Rate</ThemedText>
                        <View style={styles.priceInputContainer}>
                          <ThemedText size="sm">$</ThemedText>
                          <TextInput
                            style={[styles.priceInput, { 
                              color: theme.colors.text,
                              borderColor: theme.colors.border 
                            }]}
                            value={court.peakRate.toString()}
                            onChangeText={(text) => updateCourtPricing(court.courtId, 'peakRate', parseFloat(text) || 0)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={theme.colors.textSecondary}
                          />
                        </View>
                      </View>

                      <View style={styles.pricingItem}>
                        <ThemedText variant="secondary" size="xs">Off-Peak</ThemedText>
                        <View style={styles.priceInputContainer}>
                          <ThemedText size="sm">$</ThemedText>
                          <TextInput
                            style={[styles.priceInput, { 
                              color: theme.colors.text,
                              borderColor: theme.colors.border 
                            }]}
                            value={court.offPeakRate.toString()}
                            onChangeText={(text) => updateCourtPricing(court.courtId, 'offPeakRate', parseFloat(text) || 0)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={theme.colors.textSecondary}
                          />
                        </View>
                      </View>

                      <View style={styles.pricingItem}>
                        <ThemedText variant="secondary" size="xs">Weekend</ThemedText>
                        <View style={styles.priceInputContainer}>
                          <ThemedText size="sm">$</ThemedText>
                          <TextInput
                            style={[styles.priceInput, { 
                              color: theme.colors.text,
                              borderColor: theme.colors.border 
                            }]}
                            value={court.weekendRate.toString()}
                            onChangeText={(text) => updateCourtPricing(court.courtId, 'weekendRate', parseFloat(text) || 0)}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={theme.colors.textSecondary}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* Pricing Rules */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Pricing Rules
          </ThemedText>
          
          {pricingRules.map((rule) => (
            <View key={rule.id} style={[styles.ruleCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.ruleHeader}>
                <View style={styles.ruleInfo}>
                  <ThemedText size="base" weight="medium">
                    {rule.name}
                  </ThemedText>
                  <ThemedText variant="secondary" size="sm">
                    {rule.timeSlots}
                  </ThemedText>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.ruleToggle,
                    {
                      backgroundColor: rule.isActive ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                  onPress={() => togglePricingRule(rule.id)}
                >
                  <View
                    style={[
                      styles.ruleToggleButton,
                      {
                        backgroundColor: theme.colors.background,
                        transform: [{ translateX: rule.isActive ? 20 : 0 }],
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {rule.isActive && (
                <View style={styles.ruleDetails}>
                  <View style={styles.multiplierContainer}>
                    <ThemedText variant="secondary" size="sm">Multiplier:</ThemedText>
                    <View style={styles.multiplierInputContainer}>
                      <TextInput
                        style={[styles.multiplierInput, { 
                          color: theme.colors.text,
                          borderColor: theme.colors.border 
                        }]}
                        value={rule.multiplier.toString()}
                        onChangeText={(text) => updatePricingRule(rule.id, 'multiplier', parseFloat(text) || 1)}
                        keyboardType="numeric"
                        placeholder="1.0"
                        placeholderTextColor={theme.colors.textSecondary}
                      />
                      <ThemedText size="sm">x</ThemedText>
                    </View>
                  </View>
                  
                  <View style={styles.rulePreview}>
                    <TrendingUp size={16} color={theme.colors.success} />
                    <ThemedText variant="secondary" size="xs" style={styles.previewText}>
                      Base $50 → ${(50 * rule.multiplier).toFixed(0)}
                    </ThemedText>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Pricing Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="base" weight="bold" style={styles.summaryTitle}>
            💡 Pricing Tips
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={styles.summaryText}>
            • Peak hours typically see 30-50% higher demand
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={styles.summaryText}>
            • Weekend rates can be 20-30% higher than weekdays
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={styles.summaryText}>
            • Off-peak discounts encourage bookings during slow periods
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={styles.summaryText}>
            • Monitor competitor pricing and adjust accordingly
          </ThemedText>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        <Button
          title={isLoading ? "Saving..." : "Save Pricing Changes"}
          onPress={handleSavePricing}
          disabled={isLoading}
          size="lg"
          style={styles.saveButton}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  venueCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  facilitySection: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  facilityTitle: {
    marginLeft: 8,
  },
  courtPricingCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  courtName: {
    marginBottom: 12,
  },
  pricingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pricingItem: {
    flex: 1,
    minWidth: '45%',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
    textAlign: 'center',
  },
  ruleCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ruleInfo: {
    flex: 1,
  },
  ruleToggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  ruleToggleButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  ruleDetails: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  multiplierContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  multiplierInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  multiplierInput: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minWidth: 60,
    textAlign: 'center',
    marginRight: 4,
  },
  rulePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewText: {
    marginLeft: 4,
  },
  summaryCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 100,
  },
  summaryTitle: {
    marginBottom: 12,
  },
  summaryText: {
    lineHeight: 18,
    marginBottom: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    width: '100%',
  },
});