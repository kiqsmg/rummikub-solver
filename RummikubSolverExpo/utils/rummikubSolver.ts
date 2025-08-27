// Rummikub Solver Logic
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
}

/**
 * Main solver function that determines if the current game state is solvable
 * @param handTiles - Tiles in the player's hand
 * @param tableTiles - Tiles currently on the table
 * @returns SolverResult with solvability status and details
 */
export function solveRummikubGame(handTiles: Tile[], tableTiles: Tile[]): SolverResult {
  // TODO: Implement your Rummikub solving algorithm here
  
  // Basic validation
  if (handTiles.length === 0) {
    return {
      isSolvable: true,
      reason: "No tiles in hand - game already won!"
    };
  }

  if (handTiles.length === 1) {
    return {
      isSolvable: true,
      reason: "Only one tile remaining - can always be played"
    };
  }

  // TODO: Add your solving logic here
  // This is where you'll implement the core algorithm
  
  // Placeholder logic - replace with your actual implementation
  const isSolvable = analyzeGameState(handTiles, tableTiles);
  
  return {
    isSolvable,
    reason: isSolvable ? "Game state appears solvable" : "Game state appears unsolvable",
    suggestedMoves: isSolvable ? ["Implement move suggestions here"] : undefined
  };
}

/**
 * Core algorithm function - implement your solving logic here
 * @param hand - Tiles in hand
 * @param table - Tiles on table
 * @returns boolean indicating if the game state is solvable
 */
function analyzeGameState(hand: Tile[], table: Tile[]): boolean {
  // Gather all tiles from both hand and table into a single list
  const allTiles = [...hand, ...table];
  
  if (allTiles.length === 0) {
    return true; // No tiles means nothing to solve
  }
  
  // Try to find a valid combination that uses all tiles
  return canFormValidCombination(allTiles);
}

/**
 * Check if we can form valid combinations using all tiles
 * @param tiles - All tiles to arrange
 * @returns boolean indicating if all tiles can be used in valid sets
 */
function canFormValidCombination(tiles: Tile[]): boolean {
  // If we have less than 3 tiles, we can't form any valid sets
  if (tiles.length < 3) {
    return false;
  }
  
  // Try different approaches to arrange all tiles
  // Approach 1: Try to form groups first, then runs
  if (tryGroupsFirstApproach(tiles)) {
    return true;
  }
  
  // Approach 2: Try to form runs first, then groups
  if (tryRunsFirstApproach(tiles)) {
    return true;
  }
  
  // Approach 3: Try mixed approach (some groups, some runs)
  if (tryMixedApproach(tiles)) {
    return true;
  }
  
  // If none of the approaches work, the game is not solvable
  return false;
}

/**
 * Try to arrange tiles by prioritizing groups over runs
 */
function tryGroupsFirstApproach(tiles: Tile[]): boolean {
  const remainingTiles = [...tiles];
  const usedTiles = new Set<string>();
  
  // First, try to form all possible groups
  const groups = findPossibleGroups(remainingTiles);
  
  // Mark tiles used in groups
  for (const group of groups) {
    for (const tile of group) {
      usedTiles.add(tile.id);
    }
  }
  
  // Remove used tiles from remaining tiles
  const tilesAfterGroups = remainingTiles.filter(tile => !usedTiles.has(tile.id));
  
  // If no tiles left, we've used all tiles in groups
  if (tilesAfterGroups.length === 0) {
    return true;
  }
  
  // Try to form runs with remaining tiles
  const runs = findPossibleRuns(tilesAfterGroups);
  
  // Check if all remaining tiles can be used in runs
  const usedInRuns = new Set<string>();
  for (const run of runs) {
    for (const tile of run) {
      usedInRuns.add(tile.id);
    }
  }
  
  // Check if all remaining tiles were used
  return tilesAfterGroups.every(tile => usedInRuns.has(tile.id));
}

/**
 * Try to arrange tiles by prioritizing runs over groups
 */
function tryRunsFirstApproach(tiles: Tile[]): boolean {
  const remainingTiles = [...tiles];
  const usedTiles = new Set<string>();
  
  // First, try to form all possible runs
  const runs = findPossibleRuns(remainingTiles);
  
  // Mark tiles used in runs
  for (const run of runs) {
    for (const tile of run) {
      usedTiles.add(tile.id);
    }
  }
  
  // Remove used tiles from remaining tiles
  const tilesAfterRuns = remainingTiles.filter(tile => !usedTiles.has(tile.id));
  
  // If no tiles left, we've used all tiles in runs
  if (tilesAfterRuns.length === 0) {
    return true;
  }
  
  // Try to form groups with remaining tiles
  const groups = findPossibleGroups(tilesAfterRuns);
  
  // Check if all remaining tiles can be used in groups
  const usedInGroups = new Set<string>();
  for (const group of groups) {
    for (const tile of group) {
      usedInGroups.add(tile.id);
    }
  }
  
  // Check if all remaining tiles were used
  return tilesAfterRuns.every(tile => usedInGroups.has(tile.id));
}

/**
 * Try mixed approach - form some groups and some runs
 */
function tryMixedApproach(tiles: Tile[]): boolean {
  // This is a more complex approach that tries to find the optimal combination
  // For now, we'll use a simplified version
  
  const remainingTiles = [...tiles];
  
  // Try to find the best combination by looking at all possibilities
  return findOptimalCombination(remainingTiles);
}

/**
 * Find optimal combination using backtracking
 */
function findOptimalCombination(tiles: Tile[]): boolean {
  if (tiles.length === 0) {
    return true;
  }
  
  if (tiles.length < 3) {
    return false;
  }
  
  // Try to form a group with the first tile
  const possibleGroups = findGroupsStartingWith(tiles[0], tiles);
  for (const group of possibleGroups) {
    const remainingAfterGroup = tiles.filter(tile => !group.some(gTile => gTile.id === tile.id));
    if (findOptimalCombination(remainingAfterGroup)) {
      return true;
    }
  }
  
  // Try to form a run with the first tile
  const possibleRuns = findRunsStartingWith(tiles[0], tiles);
  for (const run of possibleRuns) {
    const remainingAfterRun = tiles.filter(tile => !run.some(rTile => rTile.id === tile.id));
    if (findOptimalCombination(remainingAfterRun)) {
      return true;
    }
  }
  
  // If we can't form any valid set with the first tile, it's not solvable
  return false;
}

/**
 * Find all possible groups from a collection of tiles
 */
function findPossibleGroups(tiles: Tile[]): Tile[][] {
  const groups: Tile[][] = [];
  
  // Group tiles by number
  const tilesByNumber = new Map<number, Tile[]>();
  
  for (const tile of tiles) {
    if (!tilesByNumber.has(tile.number)) {
      tilesByNumber.set(tile.number, []);
    }
    tilesByNumber.get(tile.number)!.push(tile);
  }
  
  // Find valid groups (3-4 tiles of same number, different colors)
  for (const [number, tilesWithNumber] of tilesByNumber) {
    if (tilesWithNumber.length >= 3) {
      // Try different combinations of 3-4 tiles
      for (let size = 3; size <= Math.min(4, tilesWithNumber.length); size++) {
        const combinations = getCombinations(tilesWithNumber, size);
        for (const combination of combinations) {
          if (isValidGroup(combination)) {
            groups.push(combination);
          }
        }
      }
    }
  }
  
  return groups;
}

/**
 * Find all possible runs from a collection of tiles
 */
function findPossibleRuns(tiles: Tile[]): Tile[][] {
  const runs: Tile[][] = [];
  
  // Group tiles by color
  const tilesByColor = new Map<string, Tile[]>();
  
  for (const tile of tiles) {
    if (!tilesByColor.has(tile.color)) {
      tilesByColor.set(tile.color, []);
    }
    tilesByColor.get(tile.color)!.push(tile);
  }
  
  // Find valid runs for each color
  for (const [color, tilesWithColor] of tilesByColor) {
    if (tilesWithColor.length >= 3) {
      // Sort by number
      const sortedTiles = tilesWithColor.sort((a, b) => a.number - b.number);
      
      // Try runs of different lengths starting from each position
      for (let start = 0; start <= sortedTiles.length - 3; start++) {
        for (let length = 3; length <= sortedTiles.length - start; length++) {
          const run = sortedTiles.slice(start, start + length);
          if (isValidRun(run)) {
            runs.push(run);
          }
        }
      }
    }
  }
  
  return runs;
}

/**
 * Find groups that can start with a specific tile
 */
function findGroupsStartingWith(startTile: Tile, allTiles: Tile[]): Tile[][] {
  const groups: Tile[][] = [];
  
  // Find all tiles with the same number
  const sameNumberTiles = allTiles.filter(tile => tile.number === startTile.number);
  
  if (sameNumberTiles.length >= 3) {
    // Try combinations of 3-4 tiles
    for (let size = 3; size <= Math.min(4, sameNumberTiles.length); size++) {
      const combinations = getCombinations(sameNumberTiles, size);
      for (const combination of combinations) {
        if (isValidGroup(combination)) {
          groups.push(combination);
        }
      }
    }
  }
  
  return groups;
}

/**
 * Find runs that can start with a specific tile
 */
function findRunsStartingWith(startTile: Tile, allTiles: Tile[]): Tile[][] {
  const runs: Tile[][] = [];
  
  // Find all tiles with the same color
  const sameColorTiles = allTiles.filter(tile => tile.color === startTile.color);
  
  if (sameColorTiles.length >= 3) {
    // Sort by number
    const sortedTiles = sameColorTiles.sort((a, b) => a.number - b.number);
    
    // Find the position of our start tile
    const startIndex = sortedTiles.findIndex(tile => tile.id === startTile.id);
    
    if (startIndex !== -1) {
      // Try runs starting from this position
      for (let length = 3; length <= sortedTiles.length - startIndex; length++) {
        const run = sortedTiles.slice(startIndex, startIndex + length);
        if (isValidRun(run)) {
          runs.push(run);
        }
      }
    }
  }
  
  return runs;
}

/**
 * Get all combinations of a specific size from an array
 */
function getCombinations<T>(array: T[], size: number): T[][] {
  if (size === 0) return [[]];
  if (size > array.length) return [];
  
  const combinations: T[][] = [];
  
  function backtrack(start: number, current: T[]) {
    if (current.length === size) {
      combinations.push([...current]);
      return;
    }
    
    for (let i = start; i < array.length; i++) {
      current.push(array[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }
  
  backtrack(0, []);
  return combinations;
}

/**
 * Helper function to check if a set of tiles forms a valid group
 * @param tiles - Array of tiles to check
 * @returns boolean indicating if tiles form a valid group
 */
export function isValidGroup(tiles: Tile[]): boolean {
  if (tiles.length < 3 || tiles.length > 4) {
    return false;
  }
  
  // Find the non-joker number (number that's not 0)
  const nonJokerTiles = tiles.filter(tile => tile.number !== 0);
  if (nonJokerTiles.length === 0) {
    // All tiles are jokers - this is valid
    return true;
  }
  
  const targetNumber = nonJokerTiles[0].number;
  const colors = new Set();
  
  for (const tile of tiles) {
    if (tile.number !== 0 && tile.number !== targetNumber) {
      return false; // Non-joker tile with different number
    }
    if (colors.has(tile.color)) {
      return false; // Duplicate color
    }
    colors.add(tile.color);
  }
  
  return true;
}

/**
 * Helper function to check if a set of tiles forms a valid run
 * @param tiles - Array of tiles to check
 * @returns boolean indicating if tiles form a valid run
 */
export function isValidRun(tiles: Tile[]): boolean {
  if (tiles.length < 3) {
    return false;
  }
  
  // Find the non-joker color (color that's not from joker tiles)
  const nonJokerTiles = tiles.filter(tile => tile.number !== 0);
  if (nonJokerTiles.length === 0) {
    // All tiles are jokers - this is valid
    return true;
  }
  
  const targetColor = nonJokerTiles[0].color;
  
  // Check if all non-joker tiles are the same color
  for (const tile of nonJokerTiles) {
    if (tile.color !== targetColor) {
      return false;
    }
  }
  
  // Get all numbers and sort them
  const numbers = tiles.map(t => t.number).sort((a, b) => a - b);
  
  // Check if numbers form a consecutive sequence
  // Jokers (0) can fill any gap
  let expectedNumber = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] === 0) {
      // Joker tile - skip and continue
      expectedNumber++;
      continue;
    }
    if (numbers[i] !== expectedNumber) {
      return false; // Gap in sequence
    }
    expectedNumber++;
  }
  
  return true;
}

/**
 * Helper function to calculate the total points of a set of tiles
 * @param tiles - Array of tiles
 * @returns total point value
 */
export function calculatePoints(tiles: Tile[]): number {
  return tiles.reduce((total, tile) => total + tile.number, 0);
}

/**
 * Helper function to find all possible valid sets from a collection of tiles
 * @param tiles - Collection of tiles to analyze
 * @returns Array of valid sets (groups and runs)
 */
export function findAllValidSets(tiles: Tile[]): Tile[][] {
  // TODO: Implement this function to find all possible valid sets
  // This is a key function for your solver algorithm
  
  const validSets: Tile[][] = [];
  
  // TODO: Add your logic to find:
  // 1. All possible groups (same number, different colors)
  // 2. All possible runs (consecutive numbers, same color)
  // 3. Consider different combinations and lengths
  
  return validSets;
}

// Export additional helper functions as needed for your solver
export {
  // Add more exports here as you implement additional helper functions
}; 