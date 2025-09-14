# Rummikub Solver Logic - Based on van Rijn, Takes, and Vis (2016)
# This file contains the core algorithm for determining if a Rummikub game state is solvable

from typing import List, Optional, Dict, Any, Tuple
from dataclasses import dataclass
from enum import IntEnum


class RunState(IntEnum):
    """Run state: 0 = no run, 1 = 1 tile, 2 = 2 tiles, 3 = 3+ tiles"""
    NO_RUN = 0
    ONE_TILE = 1
    TWO_TILES = 2
    THREE_PLUS = 3


@dataclass
class Tile:
    """Represents a single Rummikub tile"""
    id: str
    color: str
    number: int
    color_name: str


@dataclass
class GameState:
    """Represents the current state of a Rummikub game"""
    hand_tiles: List[Tile]
    table_tiles: List[Tile]


@dataclass
class SolverResult:
    """Result of the Rummikub solver"""
    is_solvable: bool
    reason: str
    suggested_moves: Optional[List[str]] = None
    max_score: Optional[int] = None


@dataclass
class RunConfiguration:
    """Configuration of runs for all suits"""
    runs: List[RunState]
    score: int


class RummikubSolver:
    """Advanced Rummikub solver based on dynamic programming approach"""
    
    def __init__(self, n: int = 13, k: int = 4, m: int = 2):
        self.n = n  # max tile value
        self.k = k  # number of suits
        self.m = m  # copies of each tile
        self.score: Dict[str, int] = {}
        self.hand: List[Tile] = []
        self.suits = ['Red', 'Blue', 'Yellow', 'Black']
    
    def count_tiles(self, value: int, suit: str) -> int:
        """Count tiles of a specific value and suit"""
        return len([tile for tile in self.hand if tile.number == value and tile.color == suit])
    
    def make_runs(self, current_runs: List[RunState], value: int) -> List[RunConfiguration]:
        """Generate all possible run configurations for a given value"""
        configurations = []
        max_tiles_per_suit = [self.count_tiles(value, suit) for suit in self.suits]
        
        # Generate all combinations of how to use these tiles
        self._generate_run_combinations(
            current_runs, max_tiles_per_suit, 0, [], 0, configurations, value
        )
        
        return configurations
    
    def _generate_run_combinations(
        self,
        current_runs: List[RunState],
        max_tiles: List[int],
        suit_index: int,
        current_config: List[RunState],
        current_score: int,
        configurations: List[RunConfiguration],
        value: int
    ) -> None:
        """Recursively generate all possible run combinations"""
        if suit_index >= self.k:
            configurations.append(RunConfiguration(
                runs=current_config.copy(),
                score=current_score
            ))
            return
        
        max_tiles_for_suit = max_tiles[suit_index]
        current_run_length = current_runs[suit_index]
        
        # Try using 0 to max_tiles_for_suit tiles for this suit
        for tiles_used in range(max_tiles_for_suit + 1):
            new_run_length = self._calculate_new_run_length(current_run_length, tiles_used)
            score_increase = self._calculate_score_increase(
                current_run_length, new_run_length, value
            )
            
            current_config.append(new_run_length)
            self._generate_run_combinations(
                current_runs,
                max_tiles,
                suit_index + 1,
                current_config,
                current_score + score_increase,
                configurations,
                value
            )
            current_config.pop()
    
    def _calculate_new_run_length(self, current_length: RunState, tiles_used: int) -> RunState:
        """Calculate new run length after using tiles"""
        if tiles_used == 0:
            return RunState.NO_RUN  # Run ends
        
        new_length = current_length + tiles_used
        return min(new_length, RunState.THREE_PLUS)  # Cap at 3+ for state representation
    
    def _calculate_score_increase(
        self, old_length: RunState, new_length: RunState, value: int
    ) -> int:
        """Calculate score increase from run changes"""
        if new_length == RunState.NO_RUN and old_length >= RunState.THREE_PLUS:
            # Run was completed, score the entire run
            return self._calculate_run_score(old_length, value)
        elif new_length >= RunState.THREE_PLUS and old_length < RunState.THREE_PLUS:
            # Run just became valid, score the new tiles
            return value * (new_length - old_length)
        elif new_length > old_length:
            # Run continues, score the new tiles
            return value * (new_length - old_length)
        return 0
    
    def _calculate_run_score(self, length: RunState, end_value: int) -> int:
        """Calculate score for a completed run"""
        if length < RunState.THREE_PLUS:
            return 0
        
        score = 0
        for i in range(length):
            score += end_value - i
        return score
    
    def _calculate_group_score(self, remaining_tiles: List[Tile], value: int) -> int:
        """Calculate total group score for remaining tiles"""
        groups: Dict[int, List[Tile]] = {}
        
        # Group remaining tiles by number
        for tile in remaining_tiles:
            if tile.number not in groups:
                groups[tile.number] = []
            groups[tile.number].append(tile)
        
        group_score = 0
        for group in groups.values():
            if len(group) >= 3:
                group_score += group[0].number * len(group)
        
        return group_score
    
    def _get_remaining_tiles(self, value: int, runs: List[RunState]) -> List[Tile]:
        """Get tiles remaining after run configuration"""
        remaining_tiles = []
        
        for suit_index in range(self.k):
            suit_tiles = [
                tile for tile in self.hand 
                if tile.number == value and tile.color == self.suits[suit_index]
            ]
            tiles_used = 1 if runs[suit_index] > RunState.NO_RUN else 0
            remaining_tiles.extend(suit_tiles[tiles_used:])
        
        return remaining_tiles
    
    def max_score(self, value: int, runs: List[RunState]) -> int:
        """Main dynamic programming algorithm"""
        if value > self.n:
            return 0
        
        state_key = f"{value}-{','.join(map(str, runs))}"
        if state_key in self.score:
            return self.score[state_key]
        
        max_score = float('-inf')
        run_configurations = self.make_runs(runs, value)
        
        for config in run_configurations:
            remaining_tiles = self._get_remaining_tiles(value, config.runs)
            group_score = self._calculate_group_score(remaining_tiles, value)
            run_score = config.score
            future_score = self.max_score(value + 1, config.runs)
            
            total_score = group_score + run_score + future_score
            max_score = max(max_score, total_score)
        
        self.score[state_key] = max_score
        return max_score
    
    def solve(self, game_state: GameState) -> SolverResult:
        """Public method to solve Rummikub"""
        self.hand = game_state.hand_tiles + game_state.table_tiles
        self.score.clear()
        
        initial_runs = [RunState.NO_RUN] * self.k
        max_score = self.max_score(1, initial_runs)
        
        total_tile_value = sum(tile.number for tile in self.hand)
        is_solvable = max_score >= total_tile_value * 0.8  # 80% threshold for solvability
        
        return SolverResult(
            is_solvable=is_solvable,
            reason=(
                f"Found solution with score {max_score} out of {total_tile_value} possible"
                if is_solvable
                else f"No valid solution found. Max score: {max_score}"
            ),
            max_score=max_score,
            suggested_moves=self._generate_move_suggestions()
        )
    
    def _generate_move_suggestions(self) -> List[str]:
        """Generate move suggestions based on the solution"""
        suggestions = []
        
        # Find runs
        runs = self._find_runs(self.hand)
        for run in runs:
            run_tiles = ', '.join([f"{tile.color_name} {tile.number}" for tile in run])
            suggestions.append(f"Run: {run_tiles}")
        
        # Find groups
        groups = self._find_groups(self.hand)
        for group in groups:
            group_tiles = ', '.join([f"{tile.color_name} {tile.number}" for tile in group])
            suggestions.append(f"Group: {group_tiles}")
        
        return suggestions[:5]
    
    def _find_runs(self, tiles: List[Tile]) -> List[List[Tile]]:
        """Find all possible runs"""
        runs = []
        color_groups: Dict[str, List[Tile]] = {}
        
        for tile in tiles:
            if tile.color not in color_groups:
                color_groups[tile.color] = []
            color_groups[tile.color].append(tile)
        
        for color_tiles in color_groups.values():
            color_tiles.sort(key=lambda x: x.number)
            
            current_run = []
            for i in range(len(color_tiles)):
                if (len(current_run) == 0 or 
                    color_tiles[i].number == current_run[-1].number + 1):
                    current_run.append(color_tiles[i])
                else:
                    if len(current_run) >= 3:
                        runs.append(current_run.copy())
                    current_run = [color_tiles[i]]
            
            if len(current_run) >= 3:
                runs.append(current_run)
        
        return runs
    
    def _find_groups(self, tiles: List[Tile]) -> List[List[Tile]]:
        """Find all possible groups"""
        groups = []
        number_groups: Dict[int, List[Tile]] = {}
        
        for tile in tiles:
            if tile.number not in number_groups:
                number_groups[tile.number] = []
            number_groups[tile.number].append(tile)
        
        for number_tiles in number_groups.values():
            if len(number_tiles) >= 3:
                groups.append(number_tiles)
        
        return groups


def solve_rummikub(game_state: GameState) -> SolverResult:
    """Legacy function for backward compatibility"""
    solver = RummikubSolver()
    return solver.solve(game_state)


# Example usage
if __name__ == "__main__":
    # Example tiles in hand
    hand_tiles = [
        Tile(id="r1", color="#FF0000", number=1, color_name="Red"),
        Tile(id="r2", color="#FF0000", number=2, color_name="Red"),
        Tile(id="r3", color="#FF0000", number=3, color_name="Red"),
        Tile(id="b5", color="#0000FF", number=5, color_name="Blue"),
        Tile(id="y5", color="#FFFF00", number=5, color_name="Yellow"),
        Tile(id="bl5", color="#000000", number=5, color_name="Black"),
        Tile(id="r7", color="#FF0000", number=7, color_name="Red"),
        Tile(id="b8", color="#0000FF", number=8, color_name="Blue"),
        Tile(id="y9", color="#FFFF00", number=9, color_name="Yellow"),
        Tile(id="bl10", color="#000000", number=10, color_name="Black"),
        Tile(id="r11", color="#FF0000", number=11, color_name="Red"),
        Tile(id="b12", color="#0000FF", number=12, color_name="Blue"),
        Tile(id="y13", color="#FFFF00", number=13, color_name="Yellow")
    ]
    
    # Example tiles on the table (already played)
    table_tiles = [
        Tile(id="r4", color="#FF0000", number=4, color_name="Red"),
        Tile(id="r5", color="#FF0000", number=5, color_name="Red"),
        Tile(id="r6", color="#FF0000", number=6, color_name="Red"),
        Tile(id="b1", color="#0000FF", number=1, color_name="Blue"),
        Tile(id="b2", color="#0000FF", number=2, color_name="Blue"),
        Tile(id="b3", color="#0000FF", number=3, color_name="Blue"),
        Tile(id="y7", color="#FFFF00", number=7, color_name="Yellow"),
        Tile(id="bl7", color="#000000", number=7, color_name="Black"),
        Tile(id="r7_dup", color="#FF0000", number=7, color_name="Red")
    ]
    
    # Create game state
    game_state = GameState(hand_tiles=hand_tiles, table_tiles=table_tiles)
    
    # Solve the game
    result = solve_rummikub(game_state)
    
    print(f"Is solvable: {result.is_solvable}")
    print(f"Reason: {result.reason}")
    print(f"Max score: {result.max_score}")
    print(f"Suggested moves: {result.suggested_moves}")
