import { ScorerFactory } from '../ScorerFactory';
import { SportName } from '@/types/scoring';

/**
 * Example scoring scenarios for testing and demonstration
 * Shows how each sport's scoring system works in practice
 */
export class ScoringExamples {
  
  /**
   * Demonstrate badminton scoring with golden point scenario
   */
  static badmintonExample(): void {
    console.log('=== BADMINTON EXAMPLE ===');
    const scorer = ScorerFactory.create('badminton');
    
    // Simulate a close first set
    for (let i = 0; i < 20; i++) {
      scorer.addPoint(0); // Player A
      scorer.addPoint(1); // Player B
    }
    console.log('After 20-20:', scorer.getScore());
    
    // Continue to 29-29 (golden point scenario)
    for (let i = 0; i < 9; i++) {
      scorer.addPoint(0);
      scorer.addPoint(1);
    }
    console.log('At 29-29 (Golden Point):', scorer.getScore());
    
    // Golden point
    scorer.addPoint(0);
    console.log('After golden point:', scorer.getScore());
    console.log('Match over?', scorer.isMatchOver());
    console.log('State:', JSON.stringify(scorer.getState(), null, 2));
  }

  /**
   * Demonstrate tennis scoring with deuce scenario
   */
  static tennisExample(): void {
    console.log('\n=== TENNIS EXAMPLE ===');
    const scorer = ScorerFactory.create('tennis');
    
    // Simulate games to reach 6-6 for tiebreak
    for (let i = 0; i < 6; i++) {
      // Player A wins game
      for (let j = 0; j < 4; j++) {
        scorer.addPoint(0);
      }
      
      // Player B wins game
      for (let j = 0; j < 4; j++) {
        scorer.addPoint(1);
      }
    }
    console.log('At 6-6 (entering tiebreak):', scorer.getScore());
    
    // Tiebreak scenario
    for (let i = 0; i < 6; i++) {
      scorer.addPoint(0);
      scorer.addPoint(1);
    }
    console.log('Tiebreak 6-6:', scorer.getScore());
    
    // Win tiebreak
    scorer.addPoint(0);
    scorer.addPoint(0);
    console.log('Tiebreak won:', scorer.getScore());
    console.log('State:', JSON.stringify(scorer.getState(), null, 2));
  }

  /**
   * Demonstrate volleyball deciding set scenario
   */
  static volleyballExample(): void {
    console.log('\n=== VOLLEYBALL EXAMPLE ===');
    const scorer = ScorerFactory.create('volleyball');
    
    // Simulate 4 sets (2-2)
    for (let set = 0; set < 4; set++) {
      const winner = set % 2; // Alternate winners
      
      // Score to 25 for winner, 20 for loser
      for (let i = 0; i < 25; i++) {
        scorer.addPoint(winner as any);
      }
      for (let i = 0; i < 20; i++) {
        scorer.addPoint(winner === 0 ? 1 : 0);
      }
    }
    console.log('After 4 sets (2-2):', scorer.getScore());
    
    // Deciding set (to 15)
    for (let i = 0; i < 14; i++) {
      scorer.addPoint(0);
      scorer.addPoint(1);
    }
    console.log('Deciding set 14-14:', scorer.getScore());
    
    // Win deciding set
    scorer.addPoint(0);
    scorer.addPoint(0);
    console.log('Final result:', scorer.getScore());
    console.log('State:', JSON.stringify(scorer.getState(), null, 2));
  }

  /**
   * Demonstrate football scoring
   */
  static footballExample(): void {
    console.log('\n=== FOOTBALL EXAMPLE ===');
    const scorer = ScorerFactory.create('football');
    
    // First half goals
    scorer.addPoint(0); // Team A scores
    console.log('15 min - Goal!:', scorer.getScore());
    
    scorer.addPoint(1); // Team B scores
    console.log('30 min - Equalizer!:', scorer.getScore());
    
    // Advance to second half
    (scorer as any).endPeriod();
    
    // Second half goals
    scorer.addPoint(0); // Team A scores again
    console.log('60 min - Go ahead goal!:', scorer.getScore());
    
    // End match
    (scorer as any).endMatch();
    console.log('Final result:', scorer.getScore());
    console.log('State:', JSON.stringify(scorer.getState(), null, 2));
  }

  /**
   * Demonstrate pickleball win-by-2 scenario
   */
  static pickleballExample(): void {
    console.log('\n=== PICKLEBALL EXAMPLE ===');
    const scorer = ScorerFactory.create('pickleball');
    
    // Score to 10-10
    for (let i = 0; i < 10; i++) {
      scorer.addPoint(0);
      scorer.addPoint(1);
    }
    console.log('At 10-10:', scorer.getScore());
    
    // Win by 2 scenario
    scorer.addPoint(0); // 11-10
    console.log('11-10 (need win by 2):', scorer.getScore());
    
    scorer.addPoint(1); // 11-11
    console.log('Back to 11-11:', scorer.getScore());
    
    scorer.addPoint(0); // 12-11
    scorer.addPoint(0); // 12-11 -> 12-11, now 12-11, need one more
    console.log('12-11 (still need win by 2):', scorer.getScore());
    
    scorer.addPoint(0); // 13-11 (wins by 2)
    console.log('Game 1 won:', scorer.getScore());
    console.log('State:', JSON.stringify(scorer.getState(), null, 2));
  }

  /**
   * Run all examples
   */
  static runAllExamples(): void {
    this.badmintonExample();
    this.tennisExample();
    this.volleyballExample();
    this.footballExample();
    this.pickleballExample();
  }
}