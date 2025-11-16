import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';
// Types - Clear and simple
export type MatchStatus = 'scheduled' | 'live' | 'paused' | 'completed' | 'cancelled';
export type SportType = 'Football' | 'Badminton' | 'Volleyball' | 'Basketball' | 'Tennis' | 'Pickleball';
export type FormatType = 'Team' | 'Singles' | 'Doubles' | 'Two Player';
export type TeamSide = 'A' | 'B';

export interface Player {
  id: string;
  username: string;
  name: string;
  email?: string;
  mobile?: string;
  profilePicture?: string;
  role?: string;
}

export interface Team {
  _id?: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
  players: Player[];
  won: number;
  loss: number;
  location: string;
  captain: Player[];
  sport: string;
  matches: number;
  homeGround?: string;
  city?: string;
  description?: string;
  createdBy?: Player[];
  admin?: Player[];
}




export interface MatchSetup {
  sport: SportType;
  format: FormatType;
  tournamentMode: boolean;
  teams: [Team, Team]; // Team A, Team B
  matchType: string;
  location: {
    city: string;
    ground: string;
  };
  date?: string;
  configuration: Record<string, any>;
  rules: Record<string, any>;
  toss?: {
    tossWinner: TeamSide;
    kickOff?: TeamSide;
    side?: 'L' | 'R';
  };
  currentTeamSelecting?: TeamSide; // 'A' | 'B'
  isScheduled: boolean;

}

export interface MatchScore {
  teamA: number;
  teamB: number;
}

export interface FeedEvent {
  id: string;
  time: string;
  type: string;
  description: string;
  team?: TeamSide;
  playerId?: string;
  meta?: Record<string, any>;
  createdAt: Date;
}

interface MatchScoringState {
  // Match setup phase
  setup: MatchSetup | null;
  setupLoading: boolean;
  setupError: string | null;
  
  // Match creation
  matchId: string | null;
  matchCreationLoading: boolean;
  matchCreationError: string | null;
  
  // Live match state
  status: MatchStatus;
  scores: MatchScore;
  scoringState: Record<string, any>;
  feed: FeedEvent[];
  
  // WebSocket
  websocketConnected: boolean;
  lastWebhookUpdate: string | null;
}

// Initial state - clean and organized
const initialState: MatchScoringState = {
  setup: null,
  setupLoading: false,
  setupError: null,
  
  matchId: null,
  matchCreationLoading: false,
  matchCreationError: null,
  
  status: 'scheduled',
  scores: { teamA: 0, teamB: 0 },
  scoringState: {},
  feed: [],
  
  websocketConnected: false,
  lastWebhookUpdate: null
};

// Async thunks - simple and focused
export const createMatch = createAsyncThunk(
  'matchScoring/createMatch',
  async (setupData: MatchSetup, { rejectWithValue }) => {
    try {
      const matchData = transformToBackendModel(setupData);
      
      const response = await fetch(`${API_URL}/api/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create match');
      }
     const res = await response.json();
     console.log('res in create match thunk', res)
      return res;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create match');
    }
  }
);

export const updateScore = createAsyncThunk(
  'matchScoring/updateScore',
  async (scoreUpdate: {
    type: string;
    team: TeamSide;
    playerId?: string;
    points?: number;
    meta?: Record<string, any>;
  }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { matchScoring: MatchScoringState };
      
      if (!state.matchScoring.matchId) {
        throw new Error('No active match');
      }

      const response = await fetch(`${API_URL}/api/matches/${state.matchScoring.matchId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scoreUpdate),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update score');
      }

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update score');
    }
  }
);


// In matchScoringSlice.ts - update the thunk
export const createMatchFromCurrentSetup = createAsyncThunk(
  'matchScoring/createMatchFromCurrentSetup',
  async (setupData: MatchSetup, { rejectWithValue }) => {
    try {
      if (!setupData.teams) {
        throw new Error('Teams data is missing');
      }

      const matchData = transformToBackendModel(setupData);
      
      console.log('Sending match data to API:', matchData);
      
      const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';
      const response = await fetch(`${API_URL}/api/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      // ✅ FIX: Properly parse the response
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || `HTTP error! status: ${response.status}`);
      }

      // ✅ Return the parsed data
      return responseData;
    } catch (error: any) {
      console.error('Match creation error:', error);
      return rejectWithValue(error.message || 'Failed to create match');
    }
  }
);


// Main slice - clean and readable
const matchScoringSlice = createSlice({
  name: 'matchScoring',
  initialState,
  reducers: {
    // Setup actions
    updateSetup: (state, action: PayloadAction<Partial<MatchSetup>>) => {
      if (!state.setup) {
        state.setup = {} as MatchSetup;
      }
      state.setup = { ...state.setup, ...action.payload };
    },
    
    setTeams: (state, action: PayloadAction<[Team, Team]>) => {
      if (state.setup) {
        state.setup.teams = action.payload;
      }
    },
    
    setMatchRules: (state, action: PayloadAction<Record<string, any>>) => {
      if (state.setup) {
        state.setup.rules = action.payload;
      }
    },
    
    setToss: (state, action: PayloadAction<MatchSetup['toss']>) => {
      if (state.setup) {
        state.setup.toss = action.payload;
      }
    },
    
    clearSetup: (state) => {
      state.setup = null;
      state.setupError = null;
    },
    
    // Live scoring actions
    updateScores: (state, action: PayloadAction<MatchScore>) => {
      state.scores = action.payload;
    },
    
    addFeedEvent: (state, action: PayloadAction<FeedEvent>) => {
      state.feed.unshift(action.payload);
    },
    
    setMatchStatus: (state, action: PayloadAction<MatchStatus>) => {
      state.status = action.payload;
    },
    
    // WebSocket actions
    setWebsocketConnected: (state, action: PayloadAction<boolean>) => {
      state.websocketConnected = action.payload;
    },
    
    handleWebhookUpdate: (state, action: PayloadAction<any>) => {
      const webhookData = action.payload;
      
      if (webhookData.scores) state.scores = webhookData.scores;
      if (webhookData.feedEvent) state.feed.unshift(webhookData.feedEvent);
      if (webhookData.scoringState) state.scoringState = webhookData.scoringState;
      if (webhookData.status) state.status = webhookData.status;
      
      state.lastWebhookUpdate = new Date().toISOString();
    },
    
    resetMatch: (state) => {
      return {
        ...initialState,
        setup: state.setup // Keep setup for new match
      };
    }
  },
  extraReducers: (builder) => {
  builder
    // Create match from current setup
    .addCase(createMatchFromCurrentSetup.pending, (state) => {
      state.matchCreationLoading = true;
      state.matchCreationError = null;
    })
    .addCase(createMatchFromCurrentSetup.fulfilled, (state, action) => {
      console.log('✅ Match creation fulfilled:', action.payload);
      
      state.matchCreationLoading = false;
      // ✅ Use the correct response structure: action.payload.data._id
      state.matchId = action.payload.data._id;
      state.status = action.payload.data.status || 'scheduled';
      state.scores = { 
        teamA: action.payload.data.score?.team1 || 0, 
        teamB: action.payload.data.score?.team2 || 0 
      };
      state.scoringState = action.payload.data.rules || {};
    })
    .addCase(createMatchFromCurrentSetup.rejected, (state, action) => {
      console.error('❌ Match creation rejected:', action.payload);
      state.matchCreationLoading = false;
      state.matchCreationError = action.payload as string;
    });
}
});

// Helper function - clean transformation
const transformToBackendModel = (setup: MatchSetup) => {
    const startAt = setup.date ? new Date(setup.date) : new Date();
  const baseData = {
    sport: setup.sport,
    format: setup.format,
    tournament: setup.tournamentMode,
    startAt: startAt.toISOString(),
    location: setup.location.city,
    teams: setup.teams.map(team => ({
       _id: team._id, 
      name: team.name,
      shortName: team.shortName,
      logoUrl: team.logoUrl,
      players: team.players.map(player => player.id)
    })),
    rules: { ...setup.configuration, ...setup.rules },
    status: 'scheduled' as MatchStatus
  };

  // Sport-specific transformations
  switch (setup.sport) {
    case 'Football':
      return {
        ...baseData,
        durationMinutes: setup.configuration.matchDuration,
        toss: setup.toss ? {
          tossWinnerTeamId: setup.toss.tossWinner === 'A' ? setup.teams[0]._id : setup.teams[1]._id,
          kickOffFirstTeamId: setup.toss.kickOff === 'A' ? setup.teams[0]._id : setup.teams[1]._id,
          sideOfServe: setup.toss.side === 'L' ? 'left' : 'right'
        } : undefined
      };
    
    case 'Basketball':
      return {
        ...baseData,
        quarters: parseInt(setup.configuration.numberOfQuarters?.split(' ')[0] || '4'),
        quarterDurationMins: setup.configuration.quarterDuration
      };
    
    case 'Tennis':
      return {
        ...baseData,
        toss: setup.toss ? {
          tossWinnerTeamId: setup.toss.tossWinner === 'A' ? setup.teams[0]._id : setup.teams[1]._id,
          serveFirstTeamId: setup.teams[setup.toss.tossWinner === 'A' ? 0 : 1]._id,
          sideOfServe: setup.toss.side === 'L' ? 'left' : 'right'
        } : undefined
      };
    
    default:
      return baseData;
  }
};

// Export actions - clean naming
export const {
  updateSetup,
  setTeams,
  setMatchRules,
  setToss,
  clearSetup,
  updateScores,
  addFeedEvent,
  setMatchStatus,
  setWebsocketConnected,
  handleWebhookUpdate,
  resetMatch
} = matchScoringSlice.actions;

export default matchScoringSlice.reducer;