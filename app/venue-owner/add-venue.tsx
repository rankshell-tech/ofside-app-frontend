import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { ArrowLeft, MapPin, Camera, Plus, X } from 'lucide-react-native';
import { sports } from '@/constants/theme';

interface Court {
  id: string;
  name: string;
  hourlyRate: number;
}

interface Facility {
  id: string;
  sport: string;
  courts: Court[];
}

export default function AddVenue() {
  const router = useRouter();
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [venueData, setVenueData] = useState({
    name: '',
    description: '',
    address: '',
    amenities: [] as string[],
    facilities: [] as Facility[],
    images: [] as string[],
  });

  const [newAmenity, setNewAmenity] = useState('');

  const commonAmenities = [
    'Parking', 'Locker Rooms', 'Equipment Rental', 'Cafeteria', 
    'WiFi', 'Air Conditioning', 'Shower Facilities', 'First Aid'
  ];

  const addFacility = (sport: string) => {
    const newFacility: Facility = {
      id: Date.now().toString(),
      sport,
      courts: [],
    };
    setVenueData(prev => ({
      ...prev,
      facilities: [...prev.facilities, newFacility],
    }));
  };

  const addCourt = (facilityId: string) => {
    const newCourt: Court = {
      id: Date.now().toString(),
      name: `Court ${Date.now()}`,
      hourlyRate: 50,
    };
    setVenueData(prev => ({
      ...prev,
      facilities: prev.facilities.map(facility =>
        facility.id === facilityId
          ? { ...facility, courts: [...facility.courts, newCourt] }
          : facility
      ),
    }));
  };

  const removeFacility = (facilityId: string) => {
    setVenueData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f.id !== facilityId),
    }));
  };

  const removeCourt = (facilityId: string, courtId: string) => {
    setVenueData(prev => ({
      ...prev,
      facilities: prev.facilities.map(facility =>
        facility.id === facilityId
          ? { ...facility, courts: facility.courts.filter(c => c.id !== courtId) }
          : facility
      ),
    }));
  };

  const updateCourt = (facilityId: string, courtId: string, field: keyof Court, value: string | number) => {
    setVenueData(prev => ({
      ...prev,
      facilities: prev.facilities.map(facility =>
        facility.id === facilityId
          ? {
              ...facility,
              courts: facility.courts.map(court =>
                court.id === courtId ? { ...court, [field]: value } : court
              ),
            }
          : facility
      ),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setVenueData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim()) {
      setVenueData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }));
      setNewAmenity('');
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Venue Submitted',
        'Your venue has been submitted for verification. You will be notified once it\'s approved.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 2000);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step) => (
        <View key={step} style={styles.stepContainer}>
          <View
            style={[
              styles.stepCircle,
              {
                backgroundColor: step <= currentStep ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <ThemedText
              size="sm"
              weight="bold"
              style={{
                color: step <= currentStep ? theme.colors.accent : theme.colors.textSecondary,
              }}
            >
              {step}
            </ThemedText>
          </View>
          {step < 4 && (
            <View
              style={[
                styles.stepLine,
                {
                  backgroundColor: step < currentStep ? theme.colors.primary : theme.colors.border,
                },
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <ThemedText size="lg" weight="bold" style={styles.stepTitle}>
        Basic Information
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText size="sm" weight="medium" style={styles.label}>
          Venue Name *
        </ThemedText>
        <TextInput
          style={[styles.input, { 
            color: theme.colors.text, 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border 
          }]}
          value={venueData.name}
          onChangeText={(text) => setVenueData(prev => ({ ...prev, name: text }))}
          placeholder="Enter venue name"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText size="sm" weight="medium" style={styles.label}>
          Description *
        </ThemedText>
        <TextInput
          style={[styles.textArea, { 
            color: theme.colors.text, 
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border 
          }]}
          value={venueData.description}
          onChangeText={(text) => setVenueData(prev => ({ ...prev, description: text }))}
          placeholder="Describe your venue..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText size="sm" weight="medium" style={styles.label}>
          Address *
        </ThemedText>
        <View style={styles.addressContainer}>
          <MapPin size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.addressInput, { 
              color: theme.colors.text, 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border 
            }]}
            value={venueData.address}
            onChangeText={(text) => setVenueData(prev => ({ ...prev, address: text }))}
            placeholder="Enter full address"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <ThemedText size="sm" weight="medium" style={styles.label}>
          Amenities
        </ThemedText>
        <View style={styles.amenitiesContainer}>
          {commonAmenities.map((amenity) => (
            <TouchableOpacity
              key={amenity}
              style={[
                styles.amenityChip,
                {
                  backgroundColor: venueData.amenities.includes(amenity)
                    ? theme.colors.primary
                    : theme.colors.surface,
                  borderColor: venueData.amenities.includes(amenity)
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
              onPress={() => toggleAmenity(amenity)}
            >
              <ThemedText
                size="sm"
                style={{
                  color: venueData.amenities.includes(amenity)
                    ? theme.colors.accent
                    : theme.colors.textSecondary,
                }}
              >
                {amenity}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customAmenityContainer}>
          <TextInput
            style={[styles.customAmenityInput, { 
              color: theme.colors.text, 
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border 
            }]}
            value={newAmenity}
            onChangeText={setNewAmenity}
            placeholder="Add custom amenity"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity
            style={[styles.addAmenityButton, { backgroundColor: theme.colors.primary }]}
            onPress={addCustomAmenity}
          >
            <Plus size={16} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <ThemedText size="lg" weight="bold" style={styles.stepTitle}>
        Facilities & Courts
      </ThemedText>

      <View style={styles.sportsContainer}>
        <ThemedText size="sm" weight="medium" style={styles.label}>
          Add Sports Facilities
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsScroll}>
          {sports.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[styles.sportButton, { backgroundColor: theme.colors.surface }]}
              onPress={() => addFacility(sport.id)}
            >
              <ThemedText size="lg">{sport.icon}</ThemedText>
              <ThemedText size="xs" weight="medium" style={styles.sportText}>
                {sport.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.facilitiesContainer}>
        {venueData.facilities.map((facility) => {
          const sportData = sports.find(s => s.id === facility.sport);
          return (
            <View key={facility.id} style={[styles.facilityCard, { backgroundColor: theme.colors.background }]}>
              <View style={styles.facilityHeader}>
                <View style={styles.facilityInfo}>
                  <ThemedText size="lg">{sportData?.icon}</ThemedText>
                  <ThemedText size="base" weight="bold" style={styles.facilityName}>
                    {sportData?.name}
                  </ThemedText>
                </View>
                <TouchableOpacity onPress={() => removeFacility(facility.id)}>
                  <X size={20} color={theme.colors.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.courtsContainer}>
                {facility.courts.map((court) => (
                  <View key={court.id} style={[styles.courtCard, { backgroundColor: theme.colors.surface }]}>
                    <View style={styles.courtHeader}>
                      <TextInput
                        style={[styles.courtNameInput, { 
                          color: theme.colors.text,
                          borderColor: theme.colors.border 
                        }]}
                        value={court.name}
                        onChangeText={(text) => updateCourt(facility.id, court.id, 'name', text)}
                        placeholder="Court name"
                        placeholderTextColor={theme.colors.textSecondary}
                      />
                      <TouchableOpacity onPress={() => removeCourt(facility.id, court.id)}>
                        <X size={16} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.courtPricing}>
                      <ThemedText size="sm" variant="secondary">Hourly Rate: $</ThemedText>
                      <TextInput
                        style={[styles.priceInput, { 
                          color: theme.colors.text,
                          borderColor: theme.colors.border 
                        }]}
                        value={court.hourlyRate.toString()}
                        onChangeText={(text) => updateCourt(facility.id, court.id, 'hourlyRate', parseInt(text) || 0)}
                        placeholder="50"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                ))}
                
                <TouchableOpacity
                  style={[styles.addCourtButton, { borderColor: theme.colors.primary }]}
                  onPress={() => addCourt(facility.id)}
                >
                  <Plus size={16} color={theme.colors.primary} />
                  <ThemedText size="sm" style={{ color: theme.colors.primary, marginLeft: 8 }}>
                    Add Court
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <ThemedText size="lg" weight="bold" style={styles.stepTitle}>
        Upload Images
      </ThemedText>

      <View style={styles.imageUploadContainer}>
        <TouchableOpacity
          style={[styles.imageUploadButton, { borderColor: theme.colors.primary }]}
          onPress={() => Alert.alert('Image Upload', 'Image upload functionality will be implemented with camera/gallery access.')}
        >
          <Camera size={40} color={theme.colors.primary} />
          <ThemedText size="base" weight="medium" style={{ color: theme.colors.primary, marginTop: 12 }}>
            Upload Venue Images
          </ThemedText>
          <ThemedText variant="secondary" size="sm" style={styles.uploadHint}>
            Add at least 3 high-quality images of your venue
          </ThemedText>
        </TouchableOpacity>
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <ThemedText size="sm" weight="medium" style={styles.infoTitle}>
          📸 Image Guidelines
        </ThemedText>
        <ThemedText variant="secondary" size="xs" style={styles.infoText}>
          • Upload high-resolution images (minimum 1080x720)
        </ThemedText>
        <ThemedText variant="secondary" size="xs" style={styles.infoText}>
          • Include exterior and interior shots
        </ThemedText>
        <ThemedText variant="secondary" size="xs" style={styles.infoText}>
          • Show courts, facilities, and amenities
        </ThemedText>
        <ThemedText variant="secondary" size="xs" style={styles.infoText}>
          • Ensure good lighting and clear visibility
        </ThemedText>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <ThemedText size="lg" weight="bold" style={styles.stepTitle}>
        Review & Submit
      </ThemedText>

      <View style={[styles.reviewCard, { backgroundColor: theme.colors.background }]}>
        <ThemedText size="base" weight="bold" style={styles.reviewTitle}>
          Venue Summary
        </ThemedText>
        
        <View style={styles.reviewItem}>
          <ThemedText variant="secondary" size="sm">Name:</ThemedText>
          <ThemedText size="sm" weight="medium">{venueData.name || 'Not specified'}</ThemedText>
        </View>
        
        <View style={styles.reviewItem}>
          <ThemedText variant="secondary" size="sm">Address:</ThemedText>
          <ThemedText size="sm" weight="medium">{venueData.address || 'Not specified'}</ThemedText>
        </View>
        
        <View style={styles.reviewItem}>
          <ThemedText variant="secondary" size="sm">Facilities:</ThemedText>
          <ThemedText size="sm" weight="medium">
            {venueData.facilities.length} sport(s), {venueData.facilities.reduce((total, f) => total + f.courts.length, 0)} court(s)
          </ThemedText>
        </View>
        
        <View style={styles.reviewItem}>
          <ThemedText variant="secondary" size="sm">Amenities:</ThemedText>
          <ThemedText size="sm" weight="medium">{venueData.amenities.length} selected</ThemedText>
        </View>
      </View>

      <View style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <ThemedText size="sm" weight="medium" style={styles.infoTitle}>
          ⏳ What happens next?
        </ThemedText>
        <ThemedText variant="secondary" size="xs" style={styles.infoText}>
          1. Your venue will be reviewed by our team (24-48 hours)
        </ThemedText>
        <ThemedText variant="secondary" size="xs" style={styles.infoText}>
          2. You'll receive a notification once approved
        </ThemedText>
        <ThemedText variant="secondary" size="xs" style={styles.infoText}>
          3. Your venue will be live and bookable by players
        </ThemedText>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Add New Venue
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>

      <View style={styles.bottomBar}>
        {currentStep < 4 ? (
          <Button
            title="Next"
            onPress={handleNext}
            disabled={
              (currentStep === 1 && (!venueData.name || !venueData.description || !venueData.address)) ||
              (currentStep === 2 && venueData.facilities.length === 0)
            }
            size="lg"
            style={styles.nextButton}
          />
        ) : (
          <Button
            title={isLoading ? "Submitting..." : "Submit for Review"}
            onPress={handleSubmit}
            disabled={isLoading}
            size="lg"
            style={styles.submitButton}
          />
        )}
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
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  stepTitle: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    minHeight: 100,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  addressInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  customAmenityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  customAmenityInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  addAmenityButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportsContainer: {
    marginBottom: 24,
  },
  sportsScroll: {
    paddingVertical: 8,
  },
  sportButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
  },
  sportText: {
    marginTop: 4,
    textAlign: 'center',
  },
  facilitiesContainer: {
    maxHeight: 400,
  },
  facilityCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  facilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  facilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityName: {
    marginLeft: 8,
  },
  courtsContainer: {
    gap: 12,
  },
  courtCard: {
    padding: 12,
    borderRadius: 12,
  },
  courtHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courtNameInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  courtPricing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minWidth: 60,
    textAlign: 'center',
  },
  addCourtButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  imageUploadContainer: {
    marginBottom: 24,
  },
  imageUploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  uploadHint: {
    marginTop: 8,
    textAlign: 'center',
  },
  reviewCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewTitle: {
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    marginBottom: 12,
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextButton: {
    width: '100%',
  },
  submitButton: {
    width: '100%',
  },
});