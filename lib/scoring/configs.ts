import { SportConfig } from '@/types/scoring';

export const SPORT_CONFIGS: Record<string, SportConfig> = {
  badminton: {
    sport: 'badminton',
    participants: 'singles',
    bestOf: 3,
    winUnitsTo: 21,
    mustWinBy: 2,
    maxCap: 30,
    rallyScoring: true
  },

  football: {
    sport: 'football',
    participants: 'teams',
    periods: [
      { name: '1H', durationSec: 2700 },
      { name: '2H', durationSec: 2700 }
    ],
    extraTime: { 
      enabled: false, 
      periods: 2, 
      periodDurationSec: 900 
    },
    rallyScoring: false,
    bestOf: 1
  },

  volleyball: {
    sport: 'volleyball',
    participants: 'teams',
    bestOf: 5,
    winUnitsTo: 25,
    mustWinBy: 2,
    maxCap: null,
    rallyScoring: true,
    metadata: { 
      fifthSetTo: 15 
    }
  },

  tennis: {
    sport: 'tennis',
    participants: 'singles',
    bestOf: 3,
    winUnitsTo: 6,
    mustWinBy: 2,
    tieBreak: { 
      at: 6, 
      to: 7, 
      mustWinBy: 2, 
      alternatingPattern: [1, 2, 2, 2, 2] 
    },
    rallyScoring: false
  },

  pickleball: {
    sport: 'pickleball',
    participants: 'doubles',
    bestOf: 3,
    winUnitsTo: 11,
    mustWinBy: 2,
    maxCap: null,
    rallyScoring: true
  }
};