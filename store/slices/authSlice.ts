import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';

interface AuthState {
  isAuthenticated: any;
  user: User | null;
  role: 'player' | 'venue_owner' | 'admin';
  isGuest: boolean;
  isLoading: boolean;
}

interface LoginPayload {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  role: 'player',
  isGuest: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<LoginPayload>) => {
      const { user, accessToken, refreshToken } = action.payload;
    
      // set user and attach tokens in one go (this is safe with RTK's immer)
      state.user = {
        ...user,
        ...(accessToken ? { accessToken } : {}),
        ...(refreshToken ? { refreshToken } : {}),
      };
    
      state.isAuthenticated = true;
      state.isGuest = false;
      state.isLoading = false;
    
      console.log('Login success - User role:', user?.role);
    },
    
    loginFailure: (state) => {
      state.isLoading = false;
    },
    continueAsGuest: (state) => {
      state.isGuest = true;
      state.isAuthenticated = false;
      state.user = null;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      state.isLoading = false;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, continueAsGuest, logout, updateProfile } = authSlice.actions;

export default authSlice.reducer;