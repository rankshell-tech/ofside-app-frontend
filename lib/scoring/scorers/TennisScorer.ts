import { BaseScorer } from '../base/BaseScorer';
import { Side, MatchState, SportConfig } from '@/types/scoring';

/**
 * Tennis Scorer Implementation
 * 
 * Rules:
 * - Best of 3 or 5 sets
 * - Point progression: 0, 15, 30, 40, Deuce, Advantage
 * - Game requires 2-point margin past Deuce
 * - Set to 6 games, must win by 2
 * - At 6-6, play tiebreak to 7 points, win by 2
 * - Tiebreak counts as 7-6 in set score
 */
export class TennisScorer extends BaseScorer {
  private sets: Array<{ a: number; b: number }> = [];
  private games = { a: 0, b: 0 };
  private points = { a: 0, b: 0 };
  private setsWon = { a: 0, b: 0 };
  private server: Side = 0;
  private tiebreakMode = false;
  private tiebreakPoints = { a: 0, b: 0 };

  constructor(config: SportConfig) {
    super(config);
  }

  addPoint(side: Side): void {
    if (this.isMatchOver()) return;

    if (this.tiebreakMode) {
      this.addTiebreakPoint(side);
    } else {
      this.addGamePoint(side);
    }

    this.logEvent('point', side, {
      games: { ...this.games },
      points: this.tiebreakMode ? { ...this.tiebreakPoints } : { ...this.points },
      tiebreak: this.tiebreakMode,
      setIndex: this.sets.length
    });
  }

  private addGamePoint(side: Side): void {
    this.points[side === 0 ? 'a' : 'b']++;
    this.checkGameWin();
  }

  private addTiebreakPoint(side: Side): void {
    this.tiebreakPoints[side === 0 ? 'a' : 'b']++;
    this.checkTiebreakWin();
  }

  private checkGameWin(): void {
    const { a, b } = this.points;
    
    // Regular game scoring
    if (a >= 4 || b >= 4) {
      if (Math.abs(a - b) >= 2) {
        // Game won
        const winner: Side = a > b ? 0 : 1;
        this.games[winner === 0 ? 'a' : 'b']++;
        this.points = { a: 0, b: 0 };
        
        // Alternate server
        this.server = this.server === 0 ? 1 : 0;
        
        this.checkSetWin();
      }
    }
  }

  private checkTiebreakWin(): void {
    const { to = 7, mustWinBy = 2 } = this.config.tieBreak || {};
    const { a, b } = this.tiebreakPoints;
    
    if ((a >= to || b >= to) && Math.abs(a - b) >= mustWinBy) {
      // Tiebreak won
      const winner: Side = a > b ? 0 : 1;
      this.games[winner === 0 ? 'a' : 'b'] = 7;
      this.games[winner === 1 ? 'a' : 'b'] = 6;
      
      this.tiebreakMode = false;
      this.tiebreakPoints = { a: 0, b: 0 };
      
      this.checkSetWin();
    }
  }

  private checkSetWin(): void {
    const { winUnitsTo = 6, mustWinBy = 2 } = this.config;
    const { a, b } = this.games;
    const { at: tiebreakAt = 6 } = this.config.tieBreak || {};

    // Check for tiebreak condition
    if (a === tiebreakAt && b === tiebreakAt && !this.tiebreakMode) {
      this.tiebreakMode = true;
      this.tiebreakPoints = { a: 0, b: 0 };
      return;
    }

    // Check for set win
    if ((a >= winUnitsTo || b >= winUnitsTo) && Math.abs(a - b) >= mustWinBy) {
      const winner: Side = a > b ? 0 : 1;
      
      // Complete the set
      this.sets.push({ ...this.games });
      this.setsWon[winner === 0 ? 'a' : 'b']++;
      
      // Reset for next set if match not over
      if (!this.isMatchOver()) {
        this.games = { a: 0, b: 0 };
        this.points = { a: 0, b: 0 };
      }
    }
  }

  private getPointLabel(points: number, opponentPoints: number): string {
    if (points < 3) return ['0', '15', '30'][points];
    if (points === 3 && opponentPoints < 3) return '40';
    if (points === opponentPoints && points >= 3) return 'Deuce';
    if (points > opponentPoints && points >= 4) return 'Ad';
    if (points < opponentPoints && opponentPoints >= 4) return '40';
    return '40';
  }

  getState(): MatchState {
    return {
      sport: 'tennis',
      over: this.isMatchOver(),
      winner: this.getWinner(),
      setsOrGamesSummary: this.sets,
      currentUnit: {
        a: this.games.a,
        b: this.games.b,
        label: `Set ${this.sets.length + 1}`
      },
      tennis: {
        setIndex: this.sets.length,
        games: { ...this.games },
        points: this.tiebreakMode 
          ? { 
              labelA: this.tiebreakPoints.a.toString(), 
              labelB: this.tiebreakPoints.b.toString() 
            }
          : {
              labelA: this.getPointLabel(this.points.a, this.points.b),
              labelB: this.getPointLabel(this.points.b, this.points.a)
            },
        tiebreak: this.tiebreakMode,
        server: this.server
      },
      events: this.events
    };
  }

  getScore(): string {
    if (this.sets.length === 0 && this.games.a === 0 && this.games.b === 0 && this.points.a === 0 && this.points.b === 0) {
      return 'Match not started';
    }

    const winner = this.getWinner();
    
    if (this.isMatchOver() && winner !== null) {
      const winnerName = winner === 0 ? 'Player A' : 'Player B';
      const setsDisplay = this.sets.map(set => `${set.a}–${set.b}`).join(', ');
      return `${winnerName} wins ${setsDisplay}`;
    }

    let result = '';
    if (this.sets.length > 0) {
      const setsDisplay = this.sets.map(set => `${set.a}–${set.b}`).join(' | ');
      result += `Sets: ${setsDisplay}`;
    }

    if (this.tiebreakMode) {
      result += ` | TB: ${this.tiebreakPoints.a}–${this.tiebreakPoints.b}`;
    } else {
      const pointsA = this.getPointLabel(this.points.a, this.points.b);
      const pointsB = this.getPointLabel(this.points.b, this.points.a);
      result += ` | Game: ${this.games.a}–${this.games.b} (${pointsA}–${pointsB})`;
    }

    return result.startsWith(' | ') ? result.slice(3) : result;
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
        if (this.tiebreakMode) {
          this.addTiebreakPoint(event.side);
        } else {
          this.addGamePoint(event.side);
        }
      }
    }
  }

  protected resetState(): void {
    this.sets = [];
    this.games = { a: 0, b: 0 };
    this.points = { a: 0, b: 0 };
    this.setsWon = { a: 0, b: 0 };
    this.server = 0;
    this.tiebreakMode = false;
    this.tiebreakPoints = { a: 0, b: 0 };
  }
}