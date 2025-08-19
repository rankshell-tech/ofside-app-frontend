export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'player' | 'venue_owner' | 'admin';
  phone?: string;
  location?: string;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  images: string[];
  rating: number;
  reviewCount: number;
  ownerId: string;
  facilities: Facility[];
  amenities: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Facility {
  id: string;
  name: string;
  sport: SportType;
  courts: Court[];
}

export interface Court {
  id: string;
  name: string;
  hourlyRate: number;
  facilityId: string;
}

export interface Booking {
  id: string;
  venueId: string;
  courtId: string;
  playerId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  venue: Venue;
  court: Court;
  paymentId?: string;
}

export type SportType = 
  | 'football' 
  | 'tennis' 
  | 'basketball' 
  | 'badminton' 
  | 'cricket' 
  | 'volleyball'
  | 'squash'
  | 'table_tennis';

export interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
}

export interface AppTheme {
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  dark: boolean;
}