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
      return;
    }

    // Create socket connection with authentication
    const newSocket = io(API_URL, {
      auth: {
        token: user.accessToken,
      },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      setError(null);
      
      // Join the match room
      newSocket.emit('join_match', { matchId, sport: sport.toLowerCase() });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err);
      setError(err.message || 'Failed to connect to server');
    });

    newSocket.on('error', (err: string) => {
      console.error('WebSocket error:', err);
      setError(err);
    });

    // Listen for match updates
    newSocket.on('match_updated', (update: MatchUpdate) => {
      console.log('📥 Match update received:', update);
      setMatchData(update.match);
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

