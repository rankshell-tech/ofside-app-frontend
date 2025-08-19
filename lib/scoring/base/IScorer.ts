import { Side, MatchState } from '@/types/scoring';

/**
 * Base interface for all sport scorers
 * Provides a unified API for scoring across different sports
 */
export interface IScorer {
  /**
   * Add a point/goal/score to the specified side
   * @param side - 0 or 1 representing the two sides/players/teams
   */
  addPoint(side: Side): void;

  /**
   * Undo the last scoring action
   * Useful for correcting mistakes during live scoring
   */
  undoLast(): void;

  /**
   * Get the current structured match state
   * Returns detailed state information for UI rendering
   */
  getState(): MatchState;

  /**
   * Get a human-readable score summary
   * Returns formatted string suitable for display
   */
  getScore(): string;

  /**
   * Check if the match has ended
   * @returns true if match is complete, false otherwise
   */
  isMatchOver(): boolean;

  /**
   * Reset the match to initial state
   * Clears all scores and events
   */
  reset(): void;
}