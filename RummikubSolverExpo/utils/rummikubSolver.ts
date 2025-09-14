// Rummikub Solver Logic - Based on van Rijn, Takes, and Vis (2016)
// This file contains the core algorithm for determining if a Rummikub game state is solvable

export interface Tile {
  id: string;
  color: string;
  number: number;
  colorName: string;
}

export interface GameState {
  handTiles: Tile[];
  tableTiles: Tile[];
}

export interface SolverResult {
  isSolvable: boolean;
  reason: string;
  suggestedMoves?: string[];
  maxScore?: number;
}

// Run state: 0 = no run, 1 = 1 tile, 2 = 2 tiles, 3 = 3+ tiles
type RunState = 0 | 1 | 2 | 3;

// Configuration of runs for all suits
interface RunConfiguration {
  runs: RunState[];
  score: number;
}

class RummikubSolver {
  private score: Map<string, number> = new Map();
  private hand: Tile[] = [];
  private n: number; // max tile value
  private k: number; // number of suits
  private m: number; // copies of each tile
  private suits: string[] = ['Red', 'Blue', 'Yellow', 'Black'];

  constructor(n: number = 13, k: number = 4, m: number = 2) {
    this.n = n;
    this.k = k;
    this.m = m;
  }

  // Count tiles of a specific value and suit
  private countTiles(value: number, suit: string): number {
    return this.hand.filter(tile => tile.number === value && tile.color === suit).length;
  }

  // Generate all possible run configurations for a given value
  private makeRuns(currentRuns: RunState[], value: number): RunConfiguration[] {
    const configurations: RunConfiguration[] = [];
    const maxTilesPerSuit = this.suits.map(suit => this.countTiles(value, suit));
    
    // Generate all combinations of how to use these tiles
    this.generateRunCombinations(
      currentRuns, maxTilesPerSuit, 0, [], 0, configurations, value
    );
    
    return configurations;
  }

  // Recursively generate all possible run combinations
  private generateRunCombinations(
    currentRuns: RunState[],
    maxTiles: number[],
    suitIndex: number,
    currentConfig: RunState[],
    currentScore: number,
    configurations: RunConfiguration[],
    value: number
  ): void {
    if (suitIndex >= this.k) {
      configurations.push({
        runs: [...currentConfig],
        score: currentScore
      });
      return;
    }

    const maxTilesForSuit = maxTiles[suitIndex];
    const currentRunLength = currentRuns[suitIndex];

    // Try using 0 to maxTilesForSuit tiles for this suit
    for (let tilesUsed = 0; tilesUsed <= maxTilesForSuit; tilesUsed++) {
      const newRunLength = this.calculateNewRunLength(currentRunLength, tilesUsed);
      const scoreIncrease = this.calculateScoreIncrease(
        currentRunLength, newRunLength, value
      );
      
      currentConfig.push(newRunLength);
      this.generateRunCombinations(
        currentRuns,
        maxTiles,
        suitIndex + 1,
        currentConfig,
        currentScore + scoreIncrease,
        configurations,
        value
      );
      currentConfig.pop();
    }
  }

  // Calculate new run length after using tiles
  private calculateNewRunLength(currentLength: RunState, tilesUsed: number): RunState {
    if (tilesUsed === 0) {
      return 0; // Run ends
    }
    
    const newLength = currentLength + tilesUsed;
    return Math.min(newLength, 3) as RunState; // Cap at 3+ for state representation
  }

  // Calculate score increase from run changes
  private calculateScoreIncrease(oldLength: RunState, newLength: RunState, value: number): number {
    if (newLength === 0 && oldLength >= 3) {
      // Run was completed, score the entire run
      return this.calculateRunScore(oldLength, value);
    } else if (newLength >= 3 && oldLength < 3) {
      // Run just became valid, score the new tiles
      return value * (newLength - oldLength);
    } else if (newLength > oldLength) {
      // Run continues, score the new tiles
      return value * (newLength - oldLength);
    }
    return 0;
  }

  // Calculate score for a completed run
  private calculateRunScore(length: RunState, endValue: number): number {
    if (length < 3) return 0;
    let score = 0;
    for (let i = 0; i < length; i++) {
      score += endValue - i;
    }
    return score;
  }

  // Calculate total group score for remaining tiles
  private calculateGroupScore(remainingTiles: Tile[], value: number): number {
    const groups: { [key: number]: Tile[] } = {};
    
    // Group remaining tiles by number
    remainingTiles.forEach(tile => {
      if (!groups[tile.number]) {
        groups[tile.number] = [];
      }
      groups[tile.number].push(tile);
    });

    let groupScore = 0;
    Object.values(groups).forEach(group => {
      // FIXED: Check for unique colors in groups
      const validGroups = this.findValidGroups(group);
      validGroups.forEach(validGroup => {
        if (validGroup.length >= 3) {
          groupScore += validGroup[0].number * validGroup.length;
        }
      });
    });

    return groupScore;
  }

  // Get tiles remaining after run configuration
  private getRemainingTiles(value: number, runs: RunState[]): Tile[] {
    const remainingTiles: Tile[] = [];
    
    for (let suitIndex = 0; suitIndex < this.k; suitIndex++) {
      const suitTiles = this.hand.filter(tile => 
        tile.number === value && tile.color === this.suits[suitIndex]
      );
      const tilesUsed = runs[suitIndex] > 0 ? 1 : 0;
      remainingTiles.push(...suitTiles.slice(tilesUsed));
    }
    
    return remainingTiles;
  }

  // Main dynamic programming algorithm
  private maxScore(value: number, runs: RunState[]): number {
    if (value > this.n) {
      return 0;
    }

    const stateKey = `${value}-${runs.join(',')}`;
    if (this.score.has(stateKey)) {
      return this.score.get(stateKey)!;
    }

    let maxScore = -Infinity;
    const runConfigurations = this.makeRuns(runs, value);

    for (const config of runConfigurations) {
      const remainingTiles = this.getRemainingTiles(value, config.runs);
      const groupScore = this.calculateGroupScore(remainingTiles, value);
      const runScore = config.score;
      const futureScore = this.maxScore(value + 1, config.runs);
      
      const totalScore = groupScore + runScore + futureScore;
      maxScore = Math.max(maxScore, totalScore);
    }

    this.score.set(stateKey, maxScore);
    return maxScore;
  }

  // Public method to solve Rummikub
  public solve(gameState: GameState): SolverResult {
    this.hand = [...gameState.handTiles, ...gameState.tableTiles];
    this.score.clear();
    
    const initialRuns: RunState[] = new Array(this.k).fill(0);
    const maxScore = this.maxScore(1, initialRuns);
    
    const totalTileValue = this.hand.reduce((sum, tile) => sum + tile.number, 0);
    const isSolvable = maxScore >= totalTileValue * 0.8; // 80% threshold for solvability
    
    return {
      isSolvable,
      reason: isSolvable 
        ? `Found solution with score ${maxScore} out of ${totalTileValue} possible`
        : `No valid solution found. Max score: ${maxScore}`,
      maxScore,
      suggestedMoves: this.generateMoveSuggestions()
    };
  }

  // Generate move suggestions based on the solution
  private generateMoveSuggestions(): string[] {
    const suggestions: string[] = [];
    
    // Find runs
    const runs = this.findRuns(this.hand);
    runs.forEach(run => {
      const runTiles = run.map(tile => `${tile.colorName} ${tile.number}`).join(', ');
      suggestions.push(`Run: ${runTiles}`);
    });
    
    // Find groups
    const groups = this.findGroups(this.hand);
    groups.forEach(group => {
      const groupTiles = group.map(tile => `${tile.colorName} ${tile.number}`).join(', ');
      suggestions.push(`Group: ${groupTiles}`);
    });
    
    return suggestions.slice(0, 5);
  }

  // Find all possible runs
  private findRuns(tiles: Tile[]): Tile[][] {
    const runs: Tile[][] = [];
    const colorGroups: { [color: string]: Tile[] } = {};
    
    tiles.forEach(tile => {
      if (!colorGroups[tile.color]) {
        colorGroups[tile.color] = [];
      }
      colorGroups[tile.color].push(tile);
    });
    
    Object.values(colorGroups).forEach(colorTiles => {
      colorTiles.sort((a, b) => a.number - b.number);
      
      let currentRun: Tile[] = [];
      for (let i = 0; i < colorTiles.length; i++) {
        if (currentRun.length === 0 || 
            colorTiles[i].number === currentRun[currentRun.length - 1].number + 1) {
          currentRun.push(colorTiles[i]);
        } else {
          if (currentRun.length >= 3) {
            runs.push([...currentRun]);
          }
          currentRun = [colorTiles[i]];
        }
      }
      if (currentRun.length >= 3) {
        runs.push(currentRun);
      }
    });
    
    return runs;
  }

  // FIXED: Find all possible groups with unique colors
  private findGroups(tiles: Tile[]): Tile[][] {
    const groups: Tile[][] = [];
    const numberGroups: { [number: number]: Tile[] } = {};
    
    // Group tiles by number
    tiles.forEach(tile => {
      if (!numberGroups[tile.number]) {
        numberGroups[tile.number] = [];
      }
      numberGroups[tile.number].push(tile);
    });
    
    // For each number, find valid groups with unique colors
    Object.values(numberGroups).forEach(numberTiles => {
      const validGroups = this.findValidGroups(numberTiles);
      groups.push(...validGroups);
    });
    
    return groups;
  }

  // NEW: Find valid groups with unique colors
  private findValidGroups(tiles: Tile[]): Tile[][] {
    const validGroups: Tile[][] = [];
    
    if (tiles.length < 3) {
      return validGroups;
    }
    
    // Group tiles by color
    const colorGroups: { [color: string]: Tile[] } = {};
    tiles.forEach(tile => {
      if (!colorGroups[tile.color]) {
        colorGroups[tile.color] = [];
      }
      colorGroups[tile.color].push(tile);
    });
    
    // Get all unique colors
    const uniqueColors = Object.keys(colorGroups);
    
    // Generate all combinations of 3 or more unique colors
    for (let size = 3; size <= uniqueColors.length; size++) {
      const combinations = this.getCombinations(uniqueColors, size);
      
      combinations.forEach(combination => {
        const group: Tile[] = [];
        combination.forEach(color => {
          if (colorGroups[color] && colorGroups[color].length > 0) {
            group.push(colorGroups[color][0]); // Take first tile of each color
          }
        });
        
        if (group.length >= 3) {
          validGroups.push(group);
        }
      });
    }
    
    return validGroups;
  }

  // Helper function to get combinations
  private getCombinations<T>(arr: T[], size: number): T[][] {
    if (size === 1) {
      return arr.map(item => [item]);
    }
    
    const combinations: T[][] = [];
    
    for (let i = 0; i <= arr.length - size; i++) {
      const head = arr[i];
      const tailCombinations = this.getCombinations(arr.slice(i + 1), size - 1);
      
      tailCombinations.forEach(tail => {
        combinations.push([head, ...tail]);
      });
    }
    
    return combinations;
  }
}

// Legacy function for backward compatibility
export function solveRummikub(gameState: GameState): SolverResult {
  const solver = new RummikubSolver();
  return solver.solve(gameState);
}

// Function expected by the frontend
export function solveRummikubGame(handTiles: Tile[], tableTiles: Tile[]): SolverResult {
  const gameState: GameState = {
    handTiles,
    tableTiles
  };
  return solveRummikub(gameState);
}
