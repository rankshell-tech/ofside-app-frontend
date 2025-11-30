  export interface User {
    _id?: string;
    name: string;
    mobile: string;
    email?: string;
    referralCode?: string;
    role: 0 | 1 | 2; // 0: user, 1: venue owner, 2: admin
    isActive: boolean;
    profilePicture?: string;
    gender?: 'male' | 'female' | 'other';
    favSports?: string[];
    createdAt?: Date;
    updatedAt?: Date;
    dateOfBirth?: Date;
    accessToken?: string;
    refreshToken?: string;
   
  }
export interface Venue {
  _id?: string;
  venueName: string;
  venueType?: string;
  sportsOffered?: string[];
  description: string;
  amenities?: string[];
  is24HoursOpen: boolean;
  location: {
    shopNo: string;
    floorTower: string;
    areaSectorLocality: string;
    city: string;
    state: string;
    landmark: string;
    country?: string;
    pincode: string;
    fullAddress: string;
    coordinates: {
      type: string;
      coordinates: number[]; // [longitude, latitude]
    };
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  owner?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  courts: string[]; // Array of Court IDs
  declarationAgreed?: boolean;
  rating?: number;
  reviewsCount?: number;
  isActive?: boolean;
  isTrending?: boolean;
  isVerified?: boolean;
  pendingChanges?: any;
  rawVenueData?: any;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Court {
  _id?: string;
  name: string;
  venue: string; // Venue ID
  sportType: string;
  surfaceType?: string;
  size?: string;
  isIndoor?: boolean;
  hasLighting?: boolean;
  images?: {
    cover?: string;
    logo?: string;
    others?: string[];
  };
  slotDuration?: number; // in minutes
  maxPeople: number;
  pricePerSlot: number;
  peakEnabled?: boolean;
  peakDays?: number[];
  peakStart?: string;
  peakEnd?: string;
  peakPricePerSlot?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  days?: number[];
}

export interface Booking {
  _id?: string;
  user: string; // User ID
  court: string; // Court ID
  venue: string; // Venue ID
  date: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
    grey: string
  };
  dark: boolean;
}