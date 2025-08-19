import { BaseScorer } from '../base/BaseScorer';
import { Side, MatchState, SportConfig } from '@/types/scoring';

/**
 * Badminton Scorer Implementation
 * 
 * Rules:
 * - Best of 3 sets
 * - Rally scoring (point on every rally)
 * - Set to 21 points, must win by 2
 * - At 29-29, next point wins (golden point)
 * - First to win 2 sets wins match
 */
export class BadmintonScorer extends BaseScorer {
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
    const { winUnitsTo = 21, mustWinBy = 2, maxCap = 30 } = this.config;
    const { a, b } = this.currentSet;

    // Check for set win
    const isGoldenPoint = a >= (maxCap - 1) && b >= (maxCap - 1);
    const hasMinPoints = a >= winUnitsTo || b >= winUnitsTo;
    const hasWinMargin = Math.abs(a - b) >= mustWinBy;
    
    if (hasMinPoints && (hasWinMargin || isGoldenPoint)) {
      const winner: Side = a > b ? 0 : 1;
      
      // Complete the set
      this.sets.push({ ...this.currentSet });
      this.setsWon[winner === 0 ? 'a' : 'b']++;
      
      this.logEvent('set_won', winner, { 
        setScore: { ...this.currentSet },
        setsWon: { ...this.setsWon }
      });

      // Reset for next set if match not over
      if (!this.isMatchOver()) {
        this.currentSet = { a: 0, b: 0 };
      }
    }
  }

  getState(): MatchState {
    const isGoldenPoint = this.currentSet.a >= 29 && this.currentSet.b >= 29;
    
    return {
      sport: 'badminton',
      over: this.isMatchOver(),
      winner: this.getWinner(),
      setsOrGamesSummary: this.sets,
      currentUnit: {
        a: this.currentSet.a,
        b: this.currentSet.b,
        label: `Set ${this.sets.length + 1}`
      },
      badminton: {
        setIndex: this.sets.length,
        isGoldenPoint
      },
      events: this.events
    };
  }

  getScore(): string {
    if (this.sets.length === 0 && this.currentSet.a === 0 && this.currentSet.b === 0) {
      return 'Match not started';
    }

    const winner = this.getWinner();
    const setsDisplay = this.sets.map(set => `${set.a}–${set.b}`).join(', ');
    
    if (this.isMatchOver() && winner !== null) {
      const winnerName = winner === 0 ? 'Player A' : 'Player B';
      return `${winnerName} wins ${setsDisplay} (${this.setsWon.a}–${this.setsWon.b})`;
    }

    if (this.sets.length > 0) {
      return `Sets: ${setsDisplay} | Current: ${this.currentSet.a}–${this.currentSet.b}`;
    }

    return `Set 1: ${this.currentSet.a}–${this.currentSet.b}`;
  }

  isMatchOver(): boolean {
    const setsToWin = Math.ceil((this.config.bestOf || 3) / 2);
    return this.setsWon.a >= setsToWin || this.setsWon.b >= setsToWin;
  }

  private getWinner(): Side | null {
    const setsToWin = Math.ceil((this.config.bestOf || 3) / 2);
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