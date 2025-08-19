import { IScorer } from './IScorer';
import { Side, MatchState, MatchEvent, SportConfig } from '@/types/scoring';

/**
 * Abstract base class providing common functionality for all scorers
 * Handles event logging, undo functionality, and basic state management
 */
export abstract class BaseScorer implements IScorer {
  protected events: MatchEvent[] = [];
  protected config: SportConfig;

  constructor(config: SportConfig) {
    this.config = config;
  }

  /**
   * Log an event to the match history
   * Used for undo functionality and analytics
   */
  protected logEvent(type: string, side?: Side, meta?: any): void {
    this.events.push({
      ts: Date.now(),
      type,
      side,
      meta
    });
  }

  /**
   * Undo the last scoring action by removing the last event
   * and recomputing the state from remaining events
   */
  undoLast(): void {
    if (this.events.length === 0) return;
    
    this.events.pop();
    this.recomputeFromEvents();
  }

  /**
   * Reset match to initial state
   */
  reset(): void {
    this.events = [];
    this.resetState();
  }

  /**
   * Get all events for analytics or persistence
   */
  getEvents(): MatchEvent[] {
    return [...this.events];
  }

  // Abstract methods that must be implemented by concrete scorers
  abstract addPoint(side: Side): void;
  abstract getState(): MatchState;
  abstract getScore(): string;
  abstract isMatchOver(): boolean;
  
  /**
   * Recompute match state from event log
   * Used for undo functionality
   */
  protected abstract recomputeFromEvents(): void;
  
  /**
   * Reset internal state to initial values
   */
  protected abstract resetState(): void;
}

export { BaseScorer }