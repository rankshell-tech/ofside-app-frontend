import { BaseScorer } from '../base/BaseScorer';
import { Side, MatchState, SportConfig } from '@/types/scoring';

/**
 * Pickleball Scorer Implementation
 * 
 * Rules:
 * - Best of 3 games
 * - Rally scoring (simplified - point on every rally)
 * - Game to 11 points, must win by 2, no hard cap
 * - First to win 2 games wins match
 * 
 * Note: Traditional pickleball uses side-out scoring, but this implements
 * rally scoring for simplicity. Can be extended with a config flag.
 */
export class PickleballScorer extends BaseScorer {
  private games: Array<{ a: number; b: number }> = [];
  private currentGame = { a: 0, b: 0 };
  private gamesWon = { a: 0, b: 0 };

  constructor(config: SportConfig) {
    super(config);
  }

  addPoint(side: Side): void {
    if (this.isMatchOver()) return;

    this.currentGame[side === 0 ? 'a' : 'b']++;
    this.logEvent('point', side, {
      gameScore: { ...this.currentGame },
      gameIndex: this.games.length
    });

    this.checkGameWin();
  }

  private checkGameWin(): void {
    const { winUnitsTo = 11, mustWinBy = 2 } = this.config;
    const { a, b } = this.currentGame;

    // Check for game win
    if ((a >= winUnitsTo || b >= winUnitsTo) && Math.abs(a - b) >= mustWinBy) {
      const winner: Side = a > b ? 0 : 1;
      
      // Complete the game
      this.games.push({ ...this.currentGame });
      this.gamesWon[winner === 0 ? 'a' : 'b']++;
      
      this.logEvent('game_won', winner, {
        gameScore: { ...this.currentGame },
        gamesWon: { ...this.gamesWon }
      });

      // Reset for next game if match not over
      if (!this.isMatchOver()) {
        this.currentGame = { a: 0, b: 0 };
      }
    }
  }

  getState(): MatchState {
    return {
      sport: 'pickleball',
      over: this.isMatchOver(),
      winner: this.getWinner(),
      setsOrGamesSummary: this.games,
      currentUnit: {
        a: this.currentGame.a,
        b: this.currentGame.b,
        label: `Game ${this.games.length + 1}`
      },
      pickleball: {
        gameIndex: this.games.length
      },
      events: this.events
    };
  }

  getScore(): string {
    if (this.games.length === 0 && this.currentGame.a === 0 && this.currentGame.b === 0) {
      return 'Match not started';
    }

    const winner = this.getWinner();
    
    if (this.isMatchOver() && winner !== null) {
      const winnerName = winner === 0 ? 'Team A' : 'Team B';
      const gamesDisplay = this.games.map(game => `${game.a}–${game.b}`).join(', ');
      return `${winnerName} wins ${gamesDisplay}`;
    }

    if (this.games.length > 0) {
      const gamesDisplay = this.games.map(game => `${game.a}–${game.b}`).join(', ');
      return `Games: ${gamesDisplay} | Current: ${this.currentGame.a}–${this.currentGame.b}`;
    }

    return `Game 1: ${this.currentGame.a}–${this.currentGame.b}`;
  }

  isMatchOver(): boolean {
    const gamesToWin = Math.ceil((this.config.bestOf || 3) / 2);
    return this.gamesWon.a >= gamesToWin || this.gamesWon.b >= gamesToWin;
  }

  private getWinner(): Side | null {
    const gamesToWin = Math.ceil((this.config.bestOf || 3) / 2);
    if (this.gamesWon.a >= gamesToWin) return 0;
    if (this.gamesWon.b >= gamesToWin) return 1;
    return null;
  }

  protected recomputeFromEvents(): void {
    this.resetState();
    
    for (const event of this.events) {
      if (event.type === 'point' && event.side !== undefined) {
        this.currentGame[event.side === 0 ? 'a' : 'b']++;
        this.checkGameWin();
      }
    }
  }

  protected resetState(): void {
    this.games = [];
    this.currentGame = { a: 0, b: 0 };
    this.gamesWon = { a: 0, b: 0 };
  }
}