export type Side = 0 | 1;
export type SportName = 'badminton' | 'football' | 'volleyball' | 'tennis' | 'pickleball';

export interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface MatchPlayers {
  playerA: Player;
  playerB: Player;
}

export interface SportConfig {
  sport: SportName;
  participants: 'singles' | 'doubles' | 'teams';
  bestOf?: number;
  winUnitsTo?: number;
  mustWinBy?: number | null;
  maxCap?: number | null;
  tieBreak?: {
    at?: number;
    to?: number;
    mustWinBy?: number;
    alternatingPattern?: number[];
  } | null;
  periods?: Array<{ name: string; durationSec?: number }>;
  extraTime?: { 
    enabled: boolean; 
    periods: number; 
    periodDurationSec: number; 
  } | null;
  rallyScoring?: boolean;
  metadata?: Record<string, any>;
}

export interface MatchEvent {
  ts: number;
  type: string;
  side?: Side;
  meta?: any;
}

export interface MatchState {
  sport: string;
  over: boolean;
  winner: Side | null;
  setsOrGamesSummary: Array<{ a: number; b: number }>;
  currentUnit: { a: number; b: number; label: string };
  
  // Sport-specific overlays
  tennis?: {
    setIndex: number;
    games: { a: number; b: number };
    points: { labelA: string; labelB: string };
    tiebreak: boolean;
    server: Side;
  };
  football?: {
    period: string;
    secondsElapsed: number;
  };
  volleyball?: {
    setIndex: number;
    decidingSetTo?: number;
  };
  badminton?: {
    setIndex: number;
    isGoldenPoint: boolean;
  };
  pickleball?: {
    gameIndex: number;
  };
  
  events?: MatchEvent[];
}

export interface IScorer {
  addPoint(side: Side): void;
  undoLast(): void;
  getState(): MatchState;
  getScore(): string;
  isMatchOver(): boolean;
  reset(): void;
  getEvents(): MatchEvent[];
}