import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Constants from 'expo-constants';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const API_URL = Constants.expoConfig?.extra?.API_URL ?? '';

export interface MatchUpdate {
  type: string;
  sport: string;
  match: any;
  commentary?: string;
}

export function useMatchWebSocket(matchId: string | null, sport: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [matchData, setMatchData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!matchId || !user?.accessToken) {
      console.log('⚠️ WebSocket: Missing matchId or accessToken', { matchId, hasToken: !!user?.accessToken });
      return;
    }

    if (!API_URL) {
      console.error('❌ WebSocket: API_URL is not configured');
      setError('Server URL not configured');
      return;
    }

    console.log('🔌 WebSocket: Attempting to connect to', API_URL);

    // Create socket connection with authentication
    const newSocket = io(API_URL, {
      auth: {
        token: user.accessToken,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected. Socket ID:', newSocket.id);
      setIsConnected(true);
      setError(null);
      
      // Join the match room
      console.log('📤 Joining match room:', { matchId, sport: sport.toLowerCase() });
      newSocket.emit('join_match', { matchId, sport: sport.toLowerCase() });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected. Reason:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Server disconnected the socket, try to reconnect manually
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection error:', err);
      console.error('Error details:', {
        message: err.message,
        type: err.type,
        description: err.description,
      });
      setError(err.message || 'Failed to connect to server');
      setIsConnected(false);
    });

    newSocket.on('error', (err: string | Error) => {
      console.error('❌ WebSocket error:', err);
      const errorMessage = typeof err === 'string' ? err : err.message || 'Unknown error';
      setError(errorMessage);
    });

    // Listen for match updates
    newSocket.on('match_updated', (update: MatchUpdate) => {
      console.log('📥 Match update received:', update);
      setMatchData(update.match);
    });

    // Listen for reconnection attempts
    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 WebSocket reconnection attempt ${attemptNumber}`);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log(`✅ WebSocket reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      setError(null);
      // Rejoin the match room after reconnection
      newSocket.emit('join_match', { matchId, sport: sport.toLowerCase() });
    });

    newSocket.on('reconnect_failed', () => {
      console.error('❌ WebSocket reconnection failed');
      setError('Failed to reconnect to server');
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [matchId, sport, user?.accessToken]);

  const emitEvent = (type: string, payload: any) => {
    if (!socket || !isConnected || !matchId) {
      console.error('Cannot emit event: socket not connected');
      setError('Not connected to server');
      return;
    }

    console.log('📤 Emitting event:', { matchId, sport, type, payload });
    socket.emit('match_event', {
      matchId,
      sport: sport.toLowerCase(),
      type,
      payload,
    });
  };

  return {
    socket,
    isConnected,
    matchData,
    error,
    emitEvent,
  };
}

