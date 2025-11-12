// /app/(tabs)/RefundAndCancellation.tsx
import React, { JSX } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from 'react-native';

export default function RefundAndCancellation(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.h1}>
          Cancellation &amp; Refund Policy – Ofside Booking Platform
        </Text>

        <View style={styles.section}>
          <Text style={styles.h2}>Refund Policy (Standard Conditions)</Text>
          <Text style={styles.p}>For all standard venue bookings:</Text>
          <View style={styles.list}>
            <Text style={styles.li}>✅ 100% refund if cancelled more than 24 hours before the booking start time.</Text>
            <Text style={styles.li}>✅ 50% refund if cancelled between 12 to 24 hours before the booking start time.</Text>
            <Text style={styles.li}>❌ 0% refund if cancelled less than 12 hours before the booking start time.</Text>
          </View>
          <Text style={[styles.p, styles.muted]}>
            Note: The time of cancellation is calculated from the start time of the first slot in your booking.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Handling Charges</Text>
          <Text style={styles.p}>A 3% handling fee will be deducted from the refund amount in all eligible cancellations.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Split Payments (Advance or Group Bookings)</Text>
          <Text style={styles.p}>
            In the case of partial or split payments, refund amounts will be calculated on the entire slot value,
            not the paid amount.
          </Text>
          <Text style={[styles.p, { marginTop: 8 }]}>
            Example: If the full slot value is ₹2000 and ₹1000 was paid in advance, refund eligibility (if any) is
            determined on ₹2000.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Amendment/Cancellation Limit</Text>
          <Text style={styles.p}>
            Each booking can be amended or cancelled only once via the app. Further changes are not permitted after the first edit/cancellation is processed.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Time Restrictions on Cancellations</Text>
          <Text style={styles.p}>No cancellations or changes are allowed after the start time of the first slot in your booking.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Weather &amp; Natural Calamities</Text>
          <Text style={styles.p}>
            If the venue is unplayable due to weather (e.g., rain, flooding) or natural calamities, the booking will be
            rescheduled at the same venue and slot (based on availability). No monetary refund will be provided in this
            case unless the venue refuses rescheduling.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Platform Rights</Text>
          <Text style={styles.p}>
            Ofside reserves the right to modify the cancellation policy without prior notice. Changes will be updated on
            the platform and will apply to new bookings made after the update.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>How to Cancel</Text>
          <Text style={styles.p}>Visit My Bookings in the app → Select your booking → Tap on Cancel Booking.</Text>
          <Text style={[styles.p, { marginTop: 8 }]}>
            Your refund (if applicable) will be initiated within 5-7 working days post cancellation.
          </Text>
        </View>

        <View style={styles.note}>
          <Text style={styles.noteTitle}>📌 Important Note:</Text>
          <Text style={[styles.p, { marginTop: 8 }]}>
            Always read the specific cancellation policy for each venue before booking, as individual venues may have
            custom rules overriding the standard policy mentioned above.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'stretch',
  },
  h1: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#0f172a',
  },
  section: {
    marginTop: 16,
    paddingBottom: 8,
  },
  h2: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#0f172a',
  },
  p: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 20,
  },
  muted: {
    color: '#374151',
  },
  list: {
    marginLeft: 8,
    marginTop: 6,
  },
  li: {
    fontSize: 14,
    marginBottom: 6,
    color: '#0f172a',
    lineHeight: 20,
  },
  note: {
    marginTop: 20,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    backgroundColor: '#fff7f7',
    borderRadius: 6,
  },
  noteTitle: {
    fontWeight: '800',
    color: '#b91c1c',
    fontSize: 14,
  },
});
