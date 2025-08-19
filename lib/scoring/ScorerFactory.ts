import { IScorer } from './base/IScorer';
import { SportConfig, SportName } from '@/types/scoring';
import { SPORT_CONFIGS } from './configs';
import { BadmintonScorer } from './scorers/BadmintonScorer';
import { TennisScorer } from './scorers/TennisScorer';
import { FootballScorer } from './scorers/FootballScorer';
import { VolleyballScorer } from './scorers/VolleyballScorer';
import { PickleballScorer } from './scorers/PickleballScorer';

/**
 * Factory class for creating sport-specific scorers
 * Provides a unified interface for creating scorers with default or custom configurations
 */
export class ScorerFactory {
  /**
   * Create a scorer instance for the specified sport
   * @param sport - The sport name
   * @param customConfig - Optional custom configuration (merges with defaults)
   * @returns IScorer instance for the sport
   */
  static create(sport: SportName, customConfig?: Partial<SportConfig>): IScorer {
    const defaultConfig = SPORT_CONFIGS[sport];
    if (!defaultConfig) {
      throw new Error(`Unsupported sport: ${sport}`);
    }

    // Merge custom config with defaults
    const config: SportConfig = {
      ...defaultConfig,
      ...customConfig
    };

    switch (sport) {
      case 'badminton':
        return new BadmintonScorer(config);
      
      case 'tennis':
        return new TennisScorer(config);
      
      case 'football':
        return new FootballScorer(config);
      
      case 'volleyball':
        return new VolleyballScorer(config);
      
      case 'pickleball':
        return new PickleballScorer(config);
      
      default:
        throw new Error(`No scorer implementation found for sport: ${sport}`);
    }
  }

  /**
   * Get available sports
   * @returns Array of supported sport names
   */
  static getSupportedSports(): SportName[] {
    return Object.keys(SPORT_CONFIGS) as SportName[];
  }

  /**
   * Get default configuration for a sport
   * @param sport - The sport name
   * @returns Default sport configuration
   */
  static getDefaultConfig(sport: SportName): SportConfig {
    const config = SPORT_CONFIGS[sport];
    if (!config) {
      throw new Error(`Unsupported sport: ${sport}`);
    }
    return { ...config };
  }

  /**
   * Validate a sport configuration
   * @param config - Configuration to validate
   * @returns true if valid, throws error if invalid
   */
  static validateConfig(config: SportConfig): boolean {
    if (!config.sport) {
      throw new Error('Sport name is required');
    }

    if (!SPORT_CONFIGS[config.sport]) {
      throw new Error(`Unsupported sport: ${config.sport}`);
    }

    if (config.bestOf && config.bestOf < 1) {
      throw new Error('bestOf must be at least 1');
    }

    if (config.winUnitsTo && config.winUnitsTo < 1) {
      throw new Error('winUnitsTo must be at least 1');
    }

    if (config.mustWinBy && config.mustWinBy < 1) {
      throw new Error('mustWinBy must be at least 1');
    }

    return true;
  }
}