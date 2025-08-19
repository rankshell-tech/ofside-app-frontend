import { Venue, Booking, User } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
  name: 'John Doe',
  role: 'player',
  phone: '+1234567890',
  location: 'New York, NY',
};

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Elite Sports Complex',
    description: 'Premier multi-sport facility with state-of-the-art courts and professional equipment.',
    address: '123 Sports Ave, New York, NY 10001',
    images: [
      'https://images.pexels.com/photos/159698/basketball-court-sport-game-159698.jpeg',
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg',
      'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    ],
    rating: 4.8,
    reviewCount: 124,
    ownerId: 'owner1',
    amenities: ['Parking', 'Locker Rooms', 'Equipment Rental', 'Cafeteria'],
    coordinates: { latitude: 40.7128, longitude: -74.0060 },
    facilities: [
      {
        id: 'f1',
        name: 'Basketball Courts',
        sport: 'basketball',
        courts: [
          { id: 'c1', name: 'Court A', hourlyRate: 50, facilityId: 'f1' },
          { id: 'c2', name: 'Court B', hourlyRate: 50, facilityId: 'f1' },
        ],
      },
      {
        id: 'f2',
        name: 'Tennis Courts',
        sport: 'tennis',
        courts: [
          { id: 'c3', name: 'Court 1', hourlyRate: 40, facilityId: 'f2' },
          { id: 'c4', name: 'Court 2', hourlyRate: 40, facilityId: 'f2' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Urban Football Hub',
    description: 'Modern football facility with synthetic grass fields and professional lighting.',
    address: '456 Football St, Brooklyn, NY 11201',
    images: [
      'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
      'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg',
    ],
    rating: 4.6,
    reviewCount: 89,
    ownerId: 'owner2',
    amenities: ['Parking', 'Changing Rooms', 'Equipment Storage'],
    coordinates: { latitude: 40.6892, longitude: -73.9442 },
    facilities: [
      {
        id: 'f3',
        name: 'Football Fields',
        sport: 'football',
        courts: [
          { id: 'c5', name: 'Field A', hourlyRate: 80, facilityId: 'f3' },
          { id: 'c6', name: 'Field B', hourlyRate: 75, facilityId: 'f3' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Ace Tennis Club',
    description: 'Professional tennis club with indoor and outdoor courts.',
    address: '789 Tennis Blvd, Manhattan, NY 10016',
    images: [
      'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
      'https://images.pexels.com/photos/1619563/pexels-photo-1619563.jpeg',
    ],
    rating: 4.9,
    reviewCount: 156,
    ownerId: 'owner3',
    amenities: ['Pro Shop', 'Coaching', 'Locker Rooms', 'Restaurant'],
    coordinates: { latitude: 40.7589, longitude: -73.9851 },
    facilities: [
      {
        id: 'f4',
        name: 'Tennis Courts',
        sport: 'tennis',
        courts: [
          { id: 'c7', name: 'Indoor Court 1', hourlyRate: 60, facilityId: 'f4' },
          { id: 'c8', name: 'Indoor Court 2', hourlyRate: 60, facilityId: 'f4' },
          { id: 'c9', name: 'Outdoor Court 1', hourlyRate: 45, facilityId: 'f4' },
        ],
      },
    ],
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'b1',
    venueId: '1',
    courtId: 'c1',
    playerId: '1',
    date: '2025-01-25',
    startTime: '14:00',
    endTime: '16:00',
    totalPrice: 100,
    status: 'confirmed',
    venue: mockVenues[0],
    court: mockVenues[0].facilities[0].courts[0],
  },
  {
    id: 'b2',
    venueId: '3',
    courtId: 'c7',
    playerId: '1',
    date: '2025-01-27',
    startTime: '10:00',
    endTime: '11:00',
    totalPrice: 60,
    status: 'confirmed',
    venue: mockVenues[2],
    court: mockVenues[2].facilities[0].courts[0],
  },
];