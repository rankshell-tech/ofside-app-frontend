import { BaseScorer } from '../base/BaseScorer';
import { Side, MatchState, SportConfig } from '@/types/scoring';

/**
 * Volleyball Scorer Implementation
 * 
 * Rules:
 * - Best of 5 sets
 * - Rally scoring (point on every rally)
 * - Set to 25 points, must win by 2, no hard cap
 * - Deciding set (5th) is to 15 points, win by 2
 * - First to win 3 sets wins match
 */
export class VolleyballScorer extends BaseScorer {
  private sets: Array<{ a: number; b: number }> = [];
  private currentSet = { a: 0, b: 0 };
  private setsWon = { a: 0, b: 0 };

  constructor(config: SportConfig) {
    super(config);
  }

  addPoint(side: Side): void {
    if (this.isMatchOver()) return;

    this.currentSet[side === 0 ? 'a' : 'b']++;
    this.logEvent('point', side, {
      setScore: { ...this.currentSet },
      setIndex: this.sets.length
    });

    this.checkSetWin();
  }

  private checkSetWin(): void {
    const isDecidingSet = this.sets.length === 4; // 5th set (index 4)
    const targetPoints = isDecidingSet 
      ? (this.config.metadata?.fifthSetTo || 15)
      : (this.config.winUnitsTo || 25);
    const mustWinBy = this.config.mustWinBy || 2;
    
    const { a, b } = this.currentSet;

    // Check for set win
    if ((a >= targetPoints || b >= targetPoints) && Math.abs(a - b) >= mustWinBy) {
      const winner: Side = a > b ? 0 : 1;
      
      // Complete the set
      this.sets.push({ ...this.currentSet });
      this.setsWon[winner === 0 ? 'a' : 'b']++;
      
      this.logEvent('set_won', winner, {
        setScore: { ...this.currentSet },
        setsWon: { ...this.setsWon },
        isDecidingSet
      });

      // Reset for next set if match not over
      if (!this.isMatchOver()) {
        this.currentSet = { a: 0, b: 0 };
      }
    }
  }

  getState(): MatchState {
    const isDecidingSet = this.sets.length === 4;
    const targetPoints = isDecidingSet 
      ? (this.config.metadata?.fifthSetTo || 15)
      : (this.config.winUnitsTo || 25);

    return {
      sport: 'volleyball',
      over: this.isMatchOver(),
      winner: this.getWinner(),
      setsOrGamesSummary: this.sets,
      currentUnit: {
        a: this.currentSet.a,
        b: this.currentSet.b,
        label: `Set ${this.sets.length + 1}${isDecidingSet ? ' (Deciding)' : ''}`
      },
      volleyball: {
        setIndex: this.sets.length,
        decidingSetTo: isDecidingSet ? targetPoints : undefined
      },
      events: this.events
    };
  }

  getScore(): string {
    if (this.sets.length === 0 && this.currentSet.a === 0 && this.currentSet.b === 0) {
      return 'Match not started';
    }

    const winner = this.getWinner();
    
    if (this.isMatchOver() && winner !== null) {
      const winnerName = winner === 0 ? 'Team A' : 'Team B';
      const setsDisplay = this.sets.map(set => `${set.a}–${set.b}`).join(', ');
      return `${winnerName} wins — Sets: A ${this.setsWon.a} – ${this.setsWon.b} B (${setsDisplay})`;
    }

    if (this.sets.length > 0) {
      const setsDisplay = this.sets.map(set => `${set.a}–${set.b}`).join(', ');
      return `Sets: ${setsDisplay} | Current: ${this.currentSet.a}–${this.currentSet.b}`;
    }

    return `Set 1: ${this.currentSet.a}–${this.currentSet.b}`;
  }

  isMatchOver(): boolean {
    const setsToWin = Math.ceil((this.config.bestOf || 5) / 2);
    return this.setsWon.a >= setsToWin || this.setsWon.b >= setsToWin;
  }

  private getWinner(): Side | null {
    const setsToWin = Math.ceil((this.config.bestOf || 5) / 2);
    if (this.setsWon.a >= setsToWin) return 0;
    if (this.setsWon.b >= setsToWin) return 1;
    return null;
  }

  protected recomputeFromEvents(): void {
    this.resetState();
    
    for (const event of this.events) {
      if (event.type === 'point' && event.side !== undefined) {
        this.currentSet[event.side === 0 ? 'a' : 'b']++;
        this.checkSetWin();
      }
    }
  }

  protected resetState(): void {
    this.sets = [];
    this.currentSet = { a: 0, b: 0 };
    this.setsWon = { a: 0, b: 0 };
  }
}