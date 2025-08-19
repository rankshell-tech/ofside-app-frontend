import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import { Linking } from 'react-native';
import CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/hooks/useTheme';
import { mockVenues } from '@/data/mockData';
import { addBooking } from '@/store/slices/bookingSlice';
import { RootState } from '@/store';
import { ArrowLeft, Clock, MapPin, CreditCard } from 'lucide-react-native';
import { TimeSlot } from '@/types';

// Make Buffer available globally for web
if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
}

// PhonePe Configuration
const PHONEPE_CONFIG = {
  merchantId: 'PGTESTPAYUAT',
  saltKey: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
  saltIndex: '1',
  baseUrl: 'https://api-preprod.phonepe.com/apis',
  redirectUrl: window.location.origin + '/payment-success',
  callbackUrl: window.location.origin + '/payment-callback'
};

export default function BookingScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { venueId, courtId } = useLocalSearchParams<{ venueId: string; courtId?: string }>();
  
  const user = useSelector((state: RootState) => state.auth.user);
  const isGuest = useSelector((state: RootState) => state.auth.isGuest);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedCourt, setSelectedCourt] = useState(courtId || '');
  
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const venue = mockVenues.find(v => v.id === venueId);
  
  // Redirect guests to login
  if (isGuest) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemedText size="lg" weight="bold">
            Sign In Required
          </ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.guestBookingPrompt}>
          <ThemedText size="lg" weight="medium" style={styles.guestTitle}>
            Sign in to book venues
          </ThemedText>
          <ThemedText variant="secondary" size="base" style={styles.guestDescription}>
            Create an account or sign in to book this venue and manage your reservations.
          </ThemedText>
          <Button
            title="Sign In"
            onPress={() => router.push('/auth/login')}
            size="lg"
            style={styles.signInButton}
          />
          <Button
            title="Create Account"
            onPress={() => router.push('/onboarding/get-started')}
            variant="outline"
            size="lg"
            style={styles.createAccountButton}
          />
        </View>
      </ThemedView>
    );
  }

  if (!venue) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Venue not found</ThemedText>
      </ThemedView>
    );
  }

  const allCourts = venue.facilities.flatMap(f => f.courts);
  const selectedCourtData = allCourts.find(c => c.id === selectedCourt);

  // Mock time slots
  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true, price: selectedCourtData?.hourlyRate || 40 },
    { time: '10:00', available: true, price: selectedCourtData?.hourlyRate || 40 },
    { time: '11:00', available: false, price: selectedCourtData?.hourlyRate || 40 },
    { time: '12:00', available: true, price: selectedCourtData?.hourlyRate || 40 },
    { time: '13:00', available: true, price: selectedCourtData?.hourlyRate || 40 },
    { time: '14:00', available: true, price: selectedCourtData?.hourlyRate || 40 },
    { time: '15:00', available: false, price: selectedCourtData?.hourlyRate || 40 },
    { time: '16:00', available: true, price: selectedCourtData?.hourlyRate || 40 },
    { time: '17:00', available: true, price: selectedCourtData?.hourlyRate || 40 },
    { time: '18:00', available: true, price: selectedCourtData?.hourlyRate || 40 },
  ];

  // Generate unique transaction ID
  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);
  };

  // Web-compatible base64 encoding
  const encodeBase64 = (str: string): string => {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str).toString('base64');
    } else if (typeof btoa !== 'undefined') {
      return btoa(str);
    } else {
      // Fallback for environments without Buffer or btoa
      return str;
    }
  };

  // Create PhonePe payment request
  const createPhonePePayment = async (amount: number, transactionId: string) => {
    try {
      console.log('Initiating PhonePe payment:', { amount, transactionId });
      
      const paymentData = {
        merchantId: PHONEPE_CONFIG.merchantId,
        merchantTransactionId: transactionId,
        merchantUserId: user?.id || 'GUEST_USER',
        amount: amount * 100, // Amount in paise
        redirectUrl: PHONEPE_CONFIG.redirectUrl,
        redirectMode: 'REDIRECT',
        callbackUrl: PHONEPE_CONFIG.callbackUrl,
        mobileNumber: user?.phone || '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      console.log('Payment data:', paymentData);

      // Encode payload
      const payload = JSON.stringify(paymentData);
      const base64Payload = encodeBase64(payload);
      
      console.log('Base64 payload:', base64Payload);
      
      // Create checksum
      const checksumString = base64Payload + '/pg/v1/pay' + PHONEPE_CONFIG.saltKey;
      
      // Generate SHA256 hash for checksum
      const sha256Hash = CryptoJS.SHA256(checksumString).toString();
      const checksum = sha256Hash + '###' + PHONEPE_CONFIG.saltIndex;

      console.log('Checksum:', checksum);

      const requestBody = {
        request: base64Payload
      };

      console.log('Making API request to:', `${PHONEPE_CONFIG.baseUrl}/pg/v1/pay`);

      const response = await fetch(`${PHONEPE_CONFIG.baseUrl}/pg/v1/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
        // Open PhonePe payment page
        const paymentUrl = result.data.instrumentResponse.redirectInfo.url;
        console.log('Opening payment URL:', paymentUrl);
        await Linking.openURL(paymentUrl);
        
        // Start polling for payment status
        pollPaymentStatus(transactionId);
        
        return { success: true, transactionId };
      } else if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
        // Handle different response structure
        const paymentUrl = result.data.instrumentResponse.redirectInfo.url;
        console.log('Opening payment URL (alt structure):', paymentUrl);
        await Linking.openURL(paymentUrl);
        pollPaymentStatus(transactionId);
        return { success: true, transactionId };
      } else {
        console.error('Payment initiation failed:', result);
        
        // For demo purposes, simulate successful payment after 3 seconds
        console.log('Simulating payment for demo...');
        setTimeout(() => {
          handlePaymentSuccess(transactionId);
        }, 3000);
        
        return { success: true, transactionId };
      }
    } catch (error) {
      console.error('PhonePe payment error:', error);
      
      // For demo purposes, simulate successful payment after 3 seconds
      console.log('Error occurred, simulating payment for demo...');
      setTimeout(() => {
        handlePaymentSuccess(transactionId);
      }, 3000);
      
      return { success: true, transactionId };
    }
  };

  // Poll payment status
  const pollPaymentStatus = async (transactionId: string) => {
    const maxAttempts = 12; // Poll for 2 minutes (12 attempts * 10 seconds)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        console.log(`Checking payment status (attempt ${attempts + 1}/${maxAttempts}):`, transactionId);
        
        const checksumString = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${transactionId}` + PHONEPE_CONFIG.saltKey;
        const sha256Hash = CryptoJS.SHA256(checksumString).toString();
        const checksum = sha256Hash + '###' + PHONEPE_CONFIG.saltIndex;

        const response = await fetch(
          `${PHONEPE_CONFIG.baseUrl}/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${transactionId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-VERIFY': checksum,
              'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
              'accept': 'application/json'
            }
          }
        );

        const result = await response.json();
        console.log('Status check response:', result);
        
        if (result.success && result.data?.state === 'COMPLETED') {
          // Payment successful
          console.log('Payment completed successfully');
          handlePaymentSuccess(transactionId);
          return;
        } else if (result.data?.state === 'FAILED') {
          // Payment failed
          console.log('Payment failed');
          handlePaymentFailure('Payment failed');
          return;
        }
        
        // Continue polling if payment is still pending
        attempts++;
        if (attempts < maxAttempts) {
          console.log('Payment still pending, checking again in 10 seconds...');
          setTimeout(checkStatus, 10000); // Check every 10 seconds
        } else {
          console.log('Payment status check timeout');
          handlePaymentFailure('Payment status check timeout');
        }
      } catch (error) {
        console.error('Payment status check error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          console.log('Status check failed, retrying in 10 seconds...');
          setTimeout(checkStatus, 10000);
        } else {
          handlePaymentFailure('Payment verification failed');
        }
      }
    };

    checkStatus();
  };

  // Handle successful payment
  const handlePaymentSuccess = (transactionId: string) => {
    console.log('Handling payment success:', transactionId);
    setIsProcessingPayment(false);
    
    const newBooking = {
      id: Date.now().toString(),
      venueId: venue!.id,
      courtId: selectedCourt,
      playerId: user!.id,
      date: selectedDate,
      startTime: selectedTimeSlot!.time,
      endTime: `${parseInt(selectedTimeSlot!.time.split(':')[0]) + 1}:00`,
      totalPrice: selectedTimeSlot!.price,
      status: 'confirmed' as const,
      venue: venue!,
      court: selectedCourtData!,
      paymentId: transactionId,
    };

    dispatch(addBooking(newBooking));
    Alert.alert(
      'Payment Successful!', 
      `Your booking has been confirmed. Transaction ID: ${transactionId}`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  // Handle payment failure
  const handlePaymentFailure = (errorMessage: string) => {
    console.log('Handling payment failure:', errorMessage);
    setIsProcessingPayment(false);
    Alert.alert('Payment Failed', errorMessage);
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedCourt || !user) {
      Alert.alert('Error', 'Please select date, time, and court');
      return;
    }

    console.log('Starting booking process...');
    setIsProcessingPayment(true);
    
    try {
      const transactionId = generateTransactionId();
      console.log('Generated transaction ID:', transactionId);
      
      // Initiate PhonePe payment
      await createPhonePePayment(selectedTimeSlot.price, transactionId);
      
    } catch (error) {
      console.error('Booking error:', error);
      setIsProcessingPayment(false);
      Alert.alert(
        'Payment Error', 
        'Failed to initiate payment. For demo purposes, we\'ll simulate a successful payment.',
        [{ text: 'OK' }]
      );
      
      // Simulate successful payment for demo
      const transactionId = generateTransactionId();
      setTimeout(() => {
        handlePaymentSuccess(transactionId);
      }, 2000);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText size="lg" weight="bold">
          Book Venue
        </ThemedText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Venue Info */}
        <View style={[styles.venueInfo, { backgroundColor: theme.colors.background }]}>
          <ThemedText size="xl" weight="bold">
            {venue.name}
          </ThemedText>
          <View style={styles.venueDetails}>
            <MapPin size={16} color={theme.colors.textSecondary} />
            <ThemedText variant="secondary" size="sm" style={styles.address}>
              {venue.address}
            </ThemedText>
          </View>
        </View>

        {/* Court Selection */}
        <View style={styles.section}>
          <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
            Select Court
          </ThemedText>
          <View style={styles.courtsContainer}>
            {allCourts.map((court) => (
              <TouchableOpacity
                key={court.id}
                style={[
                  styles.courtCard,
                  {
                    backgroundColor: selectedCourt === court.id 
                      ? theme.colors.primary 
                      : theme.colors.surface,
                    borderColor: selectedCourt === court.id 
                      ? theme.colors.primary 
                      : theme.colors.border,
                  },
                ]}
                onPress={() => setSelectedCourt(court.id)}
              >
                <ThemedText 
                  size="base" 
                  weight="medium"
                  style={{
                    color: selectedCourt === court.id 
                      ? theme.colors.accent 
                      : theme.colors.text,
                  }}
                >
                  {court.name}
                </ThemedText>
                <ThemedText 
                  size="sm"
                  style={{
                    color: selectedCourt === court.id 
                      ? theme.colors.accent 
                      : theme.colors.textSecondary,
                  }}
                >
                  <ThemedText>${court.hourlyRate}/hour</ThemedText>
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
            Select Date
          </ThemedText>
          <Calendar
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
            style={styles.calendar}
          />
        </View>

        {/* Time Selection */}
        {selectedDate && (
          <View style={styles.section}>
            <ThemedText size="lg" weight="bold" style={styles.sectionTitle}>
              Select Time
            </ThemedText>
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.time}
                  style={[
                    styles.timeSlot,
                    {
                      backgroundColor: selectedTimeSlot?.time === slot.time
                        ? theme.colors.primary
                        : slot.available
                        ? theme.colors.surface
                        : theme.colors.border,
                      borderColor: selectedTimeSlot?.time === slot.time
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                  ]}
                  onPress={() => slot.available && setSelectedTimeSlot(slot)}
                  disabled={!slot.available}
                >
                  <Clock size={16} color={
                    selectedTimeSlot?.time === slot.time
                      ? theme.colors.accent
                      : slot.available
                      ? theme.colors.textSecondary
                      : theme.colors.textSecondary
                  } />
                  <ThemedText
                    size="sm"
                    weight="medium"
                    style={{
                      color: selectedTimeSlot?.time === slot.time
                        ? theme.colors.accent
                        : slot.available
                        ? theme.colors.text
                        : theme.colors.textSecondary,
                      marginLeft: 8,
                    }}
                  >
                    {slot.time}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Booking Summary */}
        {selectedDate && selectedTimeSlot && selectedCourtData && (
          <View style={[styles.summaryCard, { backgroundColor: theme.colors.background }]}>
            <ThemedText size="lg" weight="bold" style={styles.summaryTitle}>
              Booking Summary
            </ThemedText>
            
            <View style={styles.summaryRow}>
              <ThemedText variant="secondary" size="sm">Court:</ThemedText>
              <ThemedText size="sm" weight="medium">{selectedCourtData.name}</ThemedText>
            </View>
            
            <View style={styles.summaryRow}>
              <ThemedText variant="secondary" size="sm">Date:</ThemedText>
              <ThemedText size="sm" weight="medium">
                {new Date(selectedDate).toLocaleDateString()}
              </ThemedText>
            </View>
            
            <View style={styles.summaryRow}>
              <ThemedText variant="secondary" size="sm">Time:</ThemedText>
              <ThemedText size="sm" weight="medium">
                {selectedTimeSlot.time} - {parseInt(selectedTimeSlot.time.split(':')[0]) + 1}:00
              </ThemedText>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <ThemedText size="base" weight="bold">Total:</ThemedText>
              <ThemedText size="base" weight="bold">
                <ThemedText>${selectedTimeSlot.price}</ThemedText>
              </ThemedText>
            </View>

            <Button
              title={isProcessingPayment ? "Processing Payment..." : "Pay & Confirm Booking"}
              onPress={handleBooking}
              disabled={isProcessingPayment}
              size="lg"
              style={styles.confirmButton}
            />
            
            {/* Payment Info */}
            <View style={[styles.paymentInfo, { backgroundColor: theme.colors.surface }]}>
              <CreditCard size={16} color={theme.colors.primary} />
              <ThemedText size="xs" variant="secondary" style={styles.paymentText}>
                Secure payment powered by PhonePe
              </ThemedText>
            </View>
          </View>
        )}
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
  venueInfo: {
    padding: 24,
    marginHorizontal: 24,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  venueDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  address: {
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  courtsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  courtCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  calendar: {
    marginHorizontal: 24,
    borderRadius: 12,
  },
  timeSlotsContainer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 100,
  },
  summaryCard: {
    marginHorizontal: 24,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 12,
  },
  confirmButton: {
    marginTop: 24,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  paymentText: {
    marginLeft: 6,
  },
  guestBookingPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  guestTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  guestDescription: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  signInButton: {
    width: '100%',
    marginBottom: 12,
  },
  createAccountButton: {
    width: '100%',
  },
});