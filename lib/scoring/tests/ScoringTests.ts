import { ScorerFactory } from '../ScorerFactory';
import { SportName } from '@/types/scoring';

/**
 * Test suite for the scoring engine
 * Validates edge cases and acceptance criteria
 */
export class ScoringTests {
  
  /**
   * Test badminton golden point scenario (29-29)
   */
  static testBadmintonGoldenPoint(): boolean {
    console.log('Testing Badminton Golden Point...');
    const scorer = ScorerFactory.create('badminton');
    
    // Score to 29-29
    for (let i = 0; i < 29; i++) {
      scorer.addPoint(0);
      scorer.addPoint(1);
    }
    
    const state = scorer.getState();
    if (state.currentUnit.a !== 29 || state.currentUnit.b !== 29) {
      console.error('Failed: Should be 29-29');
      return false;
    }
    
    // Next point should win the set
    scorer.addPoint(0);
    const finalState = scorer.getState();
    
    if (finalState.setsOrGamesSummary.length !== 1) {
      console.error('Failed: Set should be completed');
      return false;
    }
    
    if (finalState.setsOrGamesSummary[0].a !== 30 || finalState.setsOrGamesSummary[0].b !== 29) {
      console.error('Failed: Set should be 30-29');
      return false;
    }
    
    console.log('✅ Badminton Golden Point test passed');
    return true;
  }

  /**
   * Test tennis deuce/advantage scenario
   */
  static testTennisDeuce(): boolean {
    console.log('Testing Tennis Deuce/Advantage...');
    const scorer = ScorerFactory.create('tennis');
    
    // Score to 40-40 (deuce)
    for (let i = 0; i < 3; i++) {
      scorer.addPoint(0);
      scorer.addPoint(1);
    }
    scorer.addPoint(0); // 40-30
    scorer.addPoint(1); // 40-40 (deuce)
    
    let state = scorer.getState();
    if (state.tennis?.points.labelA !== 'Deuce' || state.tennis?.points.labelB !== 'Deuce') {
      console.error('Failed: Should be Deuce-Deuce');
      return false;
    }
    
    // A gains advantage
    scorer.addPoint(0);
    state = scorer.getState();
    if (state.tennis?.points.labelA !== 'Ad') {
      console.error('Failed: Player A should have advantage');
      return false;
    }
    
    // B wins next point (back to deuce)
    scorer.addPoint(1);
    state = scorer.getState();
    if (state.tennis?.points.labelA !== 'Deuce' || state.tennis?.points.labelB !== 'Deuce') {
      console.error('Failed: Should be back to Deuce');
      return false;
    }
    
    // B gains advantage and wins
    scorer.addPoint(1);
    scorer.addPoint(1);
    state = scorer.getState();
    
    if (state.tennis?.games.b !== 1) {
      console.error('Failed: Player B should have won the game');
      return false;
    }
    
    console.log('✅ Tennis Deuce/Advantage test passed');
    return true;
  }

  /**
   * Test volleyball deciding set (5th set to 15)
   */
  static testVolleyballDecidingSet(): boolean {
    console.log('Testing Volleyball Deciding Set...');
    const scorer = ScorerFactory.create('volleyball');
    
    // Simulate 4 sets to reach 2-2
    for (let set = 0; set < 4; set++) {
      const winner = set % 2;
      
      // Score to win the set
      for (let i = 0; i < 25; i++) {
        scorer.addPoint(winner as any);
      }
      for (let i = 0; i < 20; i++) {
        scorer.addPoint(winner === 0 ? 1 : 0);
      }
    }
    
    let state = scorer.getState();
    if (state.setsOrGamesSummary.length !== 4) {
      console.error('Failed: Should have 4 completed sets');
      return false;
    }
    
    // Now in deciding set (should be to 15)
    for (let i = 0; i < 14; i++) {
      scorer.addPoint(0);
      scorer.addPoint(1);
    }
    
    state = scorer.getState();
    if (state.currentUnit.a !== 14 || state.currentUnit.b !== 14) {
      console.error('Failed: Should be 14-14 in deciding set');
      return false;
    }
    
    // Win by 2 in deciding set
    scorer.addPoint(0);
    scorer.addPoint(0);
    
    state = scorer.getState();
    if (!state.over || state.winner !== 0) {
      console.error('Failed: Team A should have won the match');
      return false;
    }
    
    console.log('✅ Volleyball Deciding Set test passed');
    return true;
  }

  /**
   * Test pickleball win-by-2 scenario
   */
  static testPickleballWinBy2(): boolean {
    console.log('Testing Pickleball Win-by-2...');
    const scorer = ScorerFactory.create('pickleball');
    
    // Score to 10-10
    for (let i = 0; i < 10; i++) {
      scorer.addPoint(0);
      scorer.addPoint(1);
    }
    
    let state = scorer.getState();
    if (state.currentUnit.a !== 10 || state.currentUnit.b !== 10) {
      console.error('Failed: Should be 10-10');
      return false;
    }
    
    // 11-10 (not enough to win)
    scorer.addPoint(0);
    state = scorer.getState();
    if (state.over) {
      console.error('Failed: Game should not be over at 11-10');
      return false;
    }
    
    // 11-11
    scorer.addPoint(1);
    
    // 12-11 (still not enough)
    scorer.addPoint(0);
    state = scorer.getState();
    if (state.over) {
      console.error('Failed: Game should not be over at 12-11');
      return false;
    }
    
    // 13-11 (wins by 2)
    scorer.addPoint(0);
    state = scorer.getState();
    if (state.setsOrGamesSummary.length !== 1) {
      console.error('Failed: Game should be completed');
      return false;
    }
    
    console.log('✅ Pickleball Win-by-2 test passed');
    return true;
  }

  /**
   * Test football timing and periods
   */
  static testFootballTiming(): boolean {
    console.log('Testing Football Timing...');
    const scorer = ScorerFactory.create('football');
    
    // Score some goals
    scorer.addPoint(0); // Team A
    scorer.addPoint(1); // Team B
    scorer.addPoint(0); // Team A again
    
    let state = scorer.getState();
    if (state.currentUnit.a !== 2 || state.currentUnit.b !== 1) {
      console.error('Failed: Should be 2-1');
      return false;
    }
    
    if (state.over) {
      console.error('Failed: Match should not be over until manually ended');
      return false;
    }
    
    // End the match
    (scorer as any).endMatch();
    state = scorer.getState();
    
    if (!state.over) {
      console.error('Failed: Match should be over after endMatch()');
      return false;
    }
    
    const score = scorer.getScore();
    if (!score.includes('Full Time') || !score.includes('2 – 1')) {
      console.error('Failed: Score format incorrect');
      return false;
    }
    
    console.log('✅ Football Timing test passed');
    return true;
  }

  /**
   * Test undo functionality across sports
   */
  static testUndoFunctionality(): boolean {
    console.log('Testing Undo Functionality...');
    const scorer = ScorerFactory.create('badminton');
    
    // Score some points
    scorer.addPoint(0);
    scorer.addPoint(1);
    scorer.addPoint(0);
    
    let state = scorer.getState();
    if (state.currentUnit.a !== 2 || state.currentUnit.b !== 1) {
      console.error('Failed: Should be 2-1 before undo');
      return false;
    }
    
    // Undo last point
    scorer.undoLast();
    state = scorer.getState();
    
    if (state.currentUnit.a !== 1 || state.currentUnit.b !== 1) {
      console.error('Failed: Should be 1-1 after undo');
      return false;
    }
    
    // Undo another point
    scorer.undoLast();
    state = scorer.getState();
    
    if (state.currentUnit.a !== 1 || state.currentUnit.b !== 0) {
      console.error('Failed: Should be 1-0 after second undo');
      return false;
    }
    
    console.log('✅ Undo Functionality test passed');
    return true;
  }

  /**
   * Run all acceptance tests
   */
  static runAllTests(): boolean {
    console.log('🧪 Running Scoring Engine Tests...\n');
    
    const tests = [
      this.testBadmintonGoldenPoint,
      this.testTennisDeuce,
      this.testVolleyballDecidingSet,
      this.testPickleballWinBy2,
      this.testFootballTiming,
      this.testUndoFunctionality
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
      try {
        if (test()) {
          passed++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error('Test failed with error:', error);
        failed++;
      }
    }
    
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    return failed === 0;
  }

  /**
   * Demonstrate live scoring progression for a sport
   */
  static demonstrateLiveScoring(sport: SportName): void {
    console.log(`\n🏆 Live Scoring Demo: ${sport.toUpperCase()}`);
    const scorer = ScorerFactory.create(sport);
    
    console.log('Initial:', scorer.getScore());
    
    // Simulate some scoring
    for (let i = 0; i < 10; i++) {
      const side = Math.random() > 0.5 ? 0 : 1;
      scorer.addPoint(side);
      
      if (i % 3 === 0) { // Show progress every few points
        console.log(`Progress: ${scorer.getScore()}`);
      }
      
      if (scorer.isMatchOver()) {
        console.log(`Final: ${scorer.getScore()}`);
        break;
      }
    }
    
    if (!scorer.isMatchOver()) {
      console.log(`Current: ${scorer.getScore()}`);
    }
  }
}