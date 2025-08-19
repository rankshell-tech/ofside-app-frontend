import { BaseScorer } from '../base/BaseScorer';
import { Side, MatchState, SportConfig } from '@/types/scoring';

/**
 * Football Scorer Implementation
 * 
 * Rules:
 * - Accumulate goals via addPoint (treat as goal)
 * - Two halves of 45 minutes each (2700 seconds)
 * - Optional extra time (2 periods of 15 minutes each)
 * - Match ends when time expires or externally controlled
 * - Simple goal accumulation scoring
 */
export class FootballScorer extends BaseScorer {
  private goals = { a: 0, b: 0 };
  private currentPeriod = 0;
  private secondsElapsed = 0;
  private matchEnded = false;

  constructor(config: SportConfig) {
    super(config);
  }

  addPoint(side: Side): void {
    if (this.isMatchOver()) return;

    this.goals[side === 0 ? 'a' : 'b']++;
    this.logEvent('goal', side, {
      goals: { ...this.goals },
      period: this.getCurrentPeriodName(),
      minute: Math.floor(this.secondsElapsed / 60)
    });
  }

  /**
   * Advance time in the match
   * @param seconds - seconds to advance
   */
  advanceTime(seconds: number): void {
    if (this.isMatchOver()) return;

    this.secondsElapsed += seconds;
    this.logEvent('time_advance', undefined, {
      secondsElapsed: this.secondsElapsed,
      period: this.getCurrentPeriodName()
    });
  }

  /**
   * End the current period and move to next
   */
  endPeriod(): void {
    if (this.isMatchOver()) return;

    const periods = this.config.periods || [];
    if (this.currentPeriod < periods.length - 1) {
      this.currentPeriod++;
      this.secondsElapsed = 0;
      this.logEvent('period_end', undefined, {
        period: this.getCurrentPeriodName()
      });
    } else {
      this.endMatch();
    }
  }

  /**
   * Manually end the match
   */
  endMatch(): void {
    this.matchEnded = true;
    this.logEvent('match_end', undefined, {
      finalScore: { ...this.goals }
    });
  }

  private getCurrentPeriodName(): string {
    const periods = this.config.periods || [{ name: '1H' }, { name: '2H' }];
    return periods[this.currentPeriod]?.name || 'FT';
  }

  getState(): MatchState {
    return {
      sport: 'football',
      over: this.isMatchOver(),
      winner: this.getWinner(),
      setsOrGamesSummary: [],
      currentUnit: {
        a: this.goals.a,
        b: this.goals.b,
        label: this.matchEnded ? 'Full Time' : this.getCurrentPeriodName()
      },
      football: {
        period: this.getCurrentPeriodName(),
        secondsElapsed: this.secondsElapsed
      },
      events: this.events
    };
  }

  getScore(): string {
    if (this.goals.a === 0 && this.goals.b === 0 && this.secondsElapsed === 0) {
      return 'Match not started';
    }

    const status = this.matchEnded ? 'Full Time' : this.getCurrentPeriodName();
    return `${status} — Team A ${this.goals.a} – ${this.goals.b} Team B`;
  }

  isMatchOver(): boolean {
    return this.matchEnded;
  }

  private getWinner(): Side | null {
    if (!this.isMatchOver()) return null;
    if (this.goals.a > this.goals.b) return 0;
    if (this.goals.b > this.goals.a) return 1;
    return null; // Draw
  }

  protected recomputeFromEvents(): void {
    this.resetState();
    
    for (const event of this.events) {
      if (event.type === 'goal' && event.side !== undefined) {
        this.goals[event.side === 0 ? 'a' : 'b']++;
      } else if (event.type === 'time_advance' && event.meta?.secondsElapsed) {
        this.secondsElapsed = event.meta.secondsElapsed;
      } else if (event.type === 'period_end') {
        this.currentPeriod++;
        this.secondsElapsed = 0;
      } else if (event.type === 'match_end') {
        this.matchEnded = true;
      }
    }
  }

  protected resetState(): void {
    this.goals = { a: 0, b: 0 };
    this.currentPeriod = 0;
    this.secondsElapsed = 0;
    this.matchEnded = false;
    this.server = 0;
    this.tiebreakMode = false;
    this.tiebreakPoints = { a: 0, b: 0 };
  }
}