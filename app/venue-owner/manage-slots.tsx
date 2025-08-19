import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, Clock, Calendar, Settings, Save } from 'lucide-react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { mockVenues } from '@/data/mockData';
import { sports } from '@/constants/theme';

interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
  isBlocked: boolean;
}

interface DaySchedule {
  date: string;
  slots: TimeSlot[];
}

export default function ManageTimeSlots() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedVenue, setSelectedVenue] = useState(mockVenues[0]);
  const [selectedCourt, setSelectedCourt] = useState(mockVenues[0].facilities[0].courts[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Generate time slots from 6 AM to 11 PM
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour <= 23; hour++) {
      slots.push({
        id: `${hour}:00`,
        time: `${hour.toString().padStart(2, '0')}:00`,
        isAvailable: hour >= 9 && hour <= 21, // Default available 9 AM - 9 PM
        isBlocked: false,
      });
    }
    return slots;
  };

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  const toggleSlotAvailability = (slotId: string) => {
    setTimeSlots(prev =>
      prev.map(slot =>
        slot.id === slotId
          ? { ...slot, isAvailable: !slot.isAvailable }
          : slot
      )
    );
  };

  const toggleSlotBlocked = (slotId: string) => {
    setTimeSlots(prev =>
      prev.map(slot =>
        slot.id === slotId
          ? { ...slot, isBlocked: !slot.isBlocked, isAvailable: slot.isBlocked ? slot.isAvailable : false }
          : slot
      )
    );
  };

  const bulkToggleSlots = (action: 'enable' | 'disable' | 'block') => {
    setTimeSlots(prev =>
      prev.map(slot => {
        switch (action) {
          case 'enable':
            return { ...slot, isAvailable: true, isBlocked: false };
          case 'disable':
            return { ...slot, isAvailable: false };
          case 'block':
            return { ...slot, isBlocked: true, isAvailable: false };
          default:
            return slot;
        }
      })
    );
  };

  const handleSaveSchedule = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Time slot schedule updated successfully!');
    }, 1500);
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (slot.isBlocked) return 'blocked';
    if (slot.isAvailable) return 'available';
    return 'unavailable';
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'available': return theme.colors.success;
      case 'blocked': return theme.colors.error;
      case 'unavailable': return theme.colors.textSecondary;
      default: return theme.colors.border;
    }
  };

  const formatTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${ampm}`;
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
          Manage Time Slots
        </ThemedText>
        <TouchableOpacity onPress={handleSaveSchedule}>
          <Save size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Venue & Court Selection */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Select Court
          </ThemedText>
          
          <View style={[styles.selectionCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="base" weight="bold">
              {selectedVenue.name}
            </ThemedText>
            <View style={styles.courtSelection}>
              {selectedVenue.facilities.map((facility) => (
                <View key={facility.id} style={styles.facilityGroup}>
                  <View style={styles.facilityHeader}>
                    <ThemedText size="lg">{getFacilityIcon(facility.sport)}</ThemedText>
                    <ThemedText size="sm" weight="medium" style={styles.facilityName}>
                      {facility.name}
                    </ThemedText>
                  </View>
                  <View style={styles.courtsRow}>
                    {facility.courts.map((court) => (
                      <TouchableOpacity
                        key={court.id}
                        style={[
                          styles.courtChip,
                          {
                            backgroundColor: selectedCourt.id === court.id 
                              ? theme.colors.primary 
                              : theme.colors.surface,
                            borderColor: selectedCourt.id === court.id 
                              ? theme.colors.primary 
                              : theme.colors.border,
                          },
                        ]}
                        onPress={() => setSelectedCourt(court)}
                      >
                        <ThemedText
                          size="xs"
                          weight="medium"
                          style={{
                            color: selectedCourt.id === court.id 
                              ? theme.colors.accent 
                              : theme.colors.textSecondary,
                          }}
                        >
                          {court.name}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Select Date
          </ThemedText>
          <RNCalendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: theme.colors.primary,
              },
            }}
            minDate={new Date().toISOString().split('T')[0]}
            theme={{
              backgroundColor: theme.colors.background,
              calendarBackground: theme.colors.background,
              textSectionTitleColor: theme.colors.text,
              dayTextColor: theme.colors.text,
              todayTextColor: theme.colors.primary,
              selectedDayTextColor: theme.colors.accent,
              monthTextColor: theme.colors.text,
              arrowColor: theme.colors.primary,
              textDisabledColor: theme.colors.textSecondary,
            }}
            style={[styles.calendar, { backgroundColor: theme.colors.background }]}
          />
        </View>

        {/* Bulk Actions */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Quick Actions
          </ThemedText>
          <View style={styles.bulkActionsContainer}>
            <TouchableOpacity
              style={[styles.bulkActionButton, { backgroundColor: theme.colors.success }]}
              onPress={() => bulkToggleSlots('enable')}
            >
              <ThemedText size="sm" weight="medium" style={{ color: theme.colors.background }}>
                Enable All
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bulkActionButton, { backgroundColor: theme.colors.textSecondary }]}
              onPress={() => bulkToggleSlots('disable')}
            >
              <ThemedText size="sm" weight="medium" style={{ color: theme.colors.background }}>
                Disable All
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bulkActionButton, { backgroundColor: theme.colors.error }]}
              onPress={() => bulkToggleSlots('block')}
            >
              <ThemedText size="sm" weight="medium" style={{ color: theme.colors.background }}>
                Block All
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <ThemedText size="base" weight="bold" style={styles.sectionTitle}>
            Time Slots for {new Date(selectedDate).toLocaleDateString()}
          </ThemedText>
          
          <View style={[styles.slotsContainer, { backgroundColor: theme.colors.background }]}>
            <View style={styles.slotsHeader}>
              <ThemedText size="sm" weight="bold" style={styles.slotsHeaderText}>
                {selectedCourt.name} - ${selectedCourt.hourlyRate}/hour
              </ThemedText>
            </View>

            <View style={styles.slotsGrid}>
              {timeSlots.map((slot) => {
                const status = getSlotStatus(slot);
                return (
                  <View key={slot.id} style={styles.slotRow}>
                    <View style={styles.slotTime}>
                      <Clock size={16} color={theme.colors.textSecondary} />
                      <ThemedText size="sm" weight="medium" style={styles.timeText}>
                        {formatTime(slot.time)}
                      </ThemedText>
                    </View>

                    <View style={styles.slotControls}>
                      <View style={styles.slotStatus}>
                        <View
                          style={[
                            styles.statusIndicator,
                            { backgroundColor: getSlotColor(status) },
                          ]}
                        />
                        <ThemedText size="xs" variant="secondary">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </ThemedText>
                      </View>

                      <View style={styles.slotToggles}>
                        <View style={styles.toggleGroup}>
                          <ThemedText size="xs" variant="secondary">Available</ThemedText>
                          <Switch
                            value={slot.isAvailable && !slot.isBlocked}
                            onValueChange={() => toggleSlotAvailability(slot.id)}
                            disabled={slot.isBlocked}
                            trackColor={{ 
                              false: theme.colors.border, 
                              true: theme.colors.success 
                            }}
                            thumbColor={slot.isAvailable ? theme.colors.background : theme.colors.textSecondary}
                          />
                        </View>

                        <View style={styles.toggleGroup}>
                          <ThemedText size="xs" variant="secondary">Block</ThemedText>
                          <Switch
                            value={slot.isBlocked}
                            onValueChange={() => toggleSlotBlocked(slot.id)}
                            trackColor={{ 
                              false: theme.colors.border, 
                              true: theme.colors.error 
                            }}
                            thumbColor={slot.isBlocked ? theme.colors.background : theme.colors.textSecondary}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Legend */}
        <View style={[styles.legendCard, { backgroundColor: theme.colors.surface }]}>
          <ThemedText size="sm" weight="bold" style={styles.legendTitle}>
            Status Legend
          </ThemedText>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.success }]} />
              <ThemedText size="xs" variant="secondary">Available for booking</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.textSecondary }]} />
              <ThemedText size="xs" variant="secondary">Unavailable (closed)</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.error }]} />
              <ThemedText size="xs" variant="secondary">Blocked (maintenance/private)</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
        <Button
          title={isLoading ? "Saving..." : "Save Schedule"}
          onPress={handleSaveSchedule}
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
  selectionCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  courtSelection: {
    marginTop: 16,
  },
  facilityGroup: {
    marginBottom: 16,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityName: {
    marginLeft: 8,
  },
  courtsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  courtChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  calendar: {
    marginHorizontal: 24,
    borderRadius: 12,
  },
  bulkActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  bulkActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  slotsContainer: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  slotsHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  slotsHeaderText: {
    textAlign: 'center',
  },
  slotsGrid: {
    padding: 16,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  slotTime: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeText: {
    marginLeft: 8,
  },
  slotControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'space-between',
  },
  slotStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  slotToggles: {
    flexDirection: 'row',
    gap: 16,
  },
  toggleGroup: {
    alignItems: 'center',
    gap: 4,
  },
  legendCard: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 12,
    marginBottom: 100,
  },
  legendTitle: {
    marginBottom: 12,
  },
  legendItems: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
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