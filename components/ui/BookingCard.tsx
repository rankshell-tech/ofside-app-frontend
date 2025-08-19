import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Calendar, Clock, MapPin, X } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Booking } from '@/types';
import { useDispatch } from 'react-redux';
import { cancelBooking } from '@/store/slices/bookingSlice';

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, showActions = true }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => dispatch(cancelBooking(booking.id))
        },
      ]
    );
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'confirmed': return theme.colors.success;
      case 'pending': return theme.colors.warning;
      case 'cancelled': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.venueName, { color: theme.colors.text }]}>
          {booking.venue.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{booking.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MapPin size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {booking.court.name}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Calendar size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {new Date(booking.date).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {booking.startTime} - {booking.endTime}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.price, { color: theme.colors.text }]}>
          ${booking.totalPrice}
        </Text>
        
        {showActions && booking.status === 'confirmed' && (
          <TouchableOpacity 
            style={[styles.cancelButton, { borderColor: theme.colors.error }]}
            onPress={handleCancel}
          >
            <X size={16} color={theme.colors.error} />
            <Text style={[styles.cancelText, { color: theme.colors.error }]}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Inter-Bold',
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
});