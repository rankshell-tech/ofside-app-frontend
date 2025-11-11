import { AppTheme } from '@/types';

export const lightTheme: AppTheme = {
  colors: {
    primary: '#fff201',
    accent: '#002D3D',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    grey: '#E1E6E2'
  },
  dark: false,
};

export const darkTheme: AppTheme = {
  colors: {
    primary: '#fff201',
    accent: '#4A90E2',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    grey: '#E1E6E2'
  },
  dark: true,
};

export const sports = [
  { id: 'football', name: 'Football', icon: '⚽' },
  { id: 'tennis', name: 'Tennis', icon: '🎾' },
  { id: 'basketball', name: 'Basketball', icon: '🏀' },
  { id: 'badminton', name: 'Badminton', icon: '🏸' },
  { id: 'cricket', name: 'Cricket', icon: '🏏' },
  { id: 'volleyball', name: 'Volleyball', icon: '🏐' },
  { id: 'squash', name: 'Squash', icon: '🥎' },
  { id: 'table_tennis', name: 'Table Tennis', icon: '🏓' },
  { id: 'pickleball', name: 'Pickleball', icon: '🏓' },
  { id: 'golf', name: 'Golf', icon: '⛳' },
  { id: 'hockey', name: 'Hockey', icon: '🏒' },
  { id: 'rugby', name: 'Rugby', icon: '🏉' },
  { id: 'running', name: 'Running', icon: '🏃' },
  { id: 'cycling', name: 'Cycling', icon: '🚴' },
  { id: 'swimming', name: 'Swimming', icon: '🏊' },
  { id: 'boxing', name: 'Boxing', icon: '🥊' },
  { id: 'yoga', name: 'Yoga', icon: '🧘' },
  { id: 'pilates', name: 'Pilates', icon: '🧘‍♀️' },
  { id: 'judo', name: 'Judo', icon: '🥋' },
  { id: 'karate', name: 'Karate', icon: '🥋' },
  { id: 'taekwondo', name: 'Taekwondo', icon: '🥋' },
  { id: 'jujitsu', name: 'Jujitsu', icon: '🥋' },
  { id: 'mma', name: 'MMA', icon: '🥋' },
  { id: 'wrestling', name: 'Wrestling', icon: '🥋' },
  { id: 'boxing', name: 'Boxing', icon: '🥋' },
  { id: 'yoga', name: 'Yoga', icon: '🧘' },
  { id: 'pilates', name: 'Pilates', icon: '🧘‍♀️' },
] as const;