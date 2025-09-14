#!/usr/bin/env python3
"""
Simple test to verify the core functionality works in both versions
"""

import sys
sys.path.append('..')
from rummikub_solver import solve_rummikub, Tile, GameState

def test_core_functionality():
    """Test core functionality that should work in both versions"""
    
    print("🧪 Testing Core Rummikub Solver Functionality")
    print("=" * 50)
    
    # Test 1: Duplicate color fix
    print("\n📋 Test 1: Duplicate Color Fix")
    hand_tiles = [
        Tile(id="bl6_1", color="#000000", number=6, color_name="Black"),
        Tile(id="r6", color="#FF0000", number=6, color_name="Red"),
        Tile(id="y6", color="#FFD700", number=6, color_name="Yellow"),
        Tile(id="bl6_2", color="#000000", number=6, color_name="Black"),  # Duplicate
    ]
    
    game_state = GameState(hand_tiles=hand_tiles, table_tiles=[])
    result = solve_rummikub(game_state)
    
    print(f"Tiles: Black 6, Red 6, Yellow 6, Black 6")
    print(f"Result: {result.is_solvable}")
    print(f"Max Score: {result.max_score}")
    print(f"Suggested Moves: {result.suggested_moves}")
    
    # Check that only unique colors are suggested
    valid_group_found = False
    for move in result.suggested_moves or []:
        if "Group:" in move:
            if move.count("Black 6") == 1 and "Red 6" in move and "Yellow 6" in move:
                valid_group_found = True
                print("✅ PASS: Correctly suggests group with unique colors only")
                break
    
    if not valid_group_found:
        print("❌ FAIL: Still suggesting groups with duplicate colors")
        return False
    
    # Test 2: Valid group detection
    print("\n📋 Test 2: Valid Group Detection")
    hand_tiles_2 = [
        Tile(id="bl6", color="#000000", number=6, color_name="Black"),
        Tile(id="r6", color="#FF0000", number=6, color_name="Red"),
        Tile(id="y6", color="#FFD700", number=6, color_name="Yellow"),
        Tile(id="b6", color="#0000FF", number=6, color_name="Blue"),
    ]
    
    game_state_2 = GameState(hand_tiles=hand_tiles_2, table_tiles=[])
    result_2 = solve_rummikub(game_state_2)
    
    print(f"Tiles: Black 6, Red 6, Yellow 6, Blue 6")
    print(f"Result: {result_2.is_solvable}")
    print(f"Max Score: {result_2.max_score}")
    print(f"Suggested Moves: {result_2.suggested_moves}")
    
    group_count = sum(1 for move in result_2.suggested_moves or [] if "Group:" in move)
    if group_count > 0:
        print("✅ PASS: Correctly identifies valid groups")
    else:
        print("❌ FAIL: Should find valid groups")
        return False
    
    # Test 3: Run detection
    print("\n📋 Test 3: Run Detection")
    hand_tiles_3 = [
        Tile(id="r1", color="#FF0000", number=1, color_name="Red"),
        Tile(id="r2", color="#FF0000", number=2, color_name="Red"),
        Tile(id="r3", color="#FF0000", number=3, color_name="Red"),
        Tile(id="r4", color="#FF0000", number=4, color_name="Red"),
    ]
    
    game_state_3 = GameState(hand_tiles=hand_tiles_3, table_tiles=[])
    result_3 = solve_rummikub(game_state_3)
    
    print(f"Tiles: Red 1, Red 2, Red 3, Red 4")
    print(f"Result: {result_3.is_solvable}")
    print(f"Max Score: {result_3.max_score}")
    print(f"Suggested Moves: {result_3.suggested_moves}")
    
    run_found = any("Run:" in move for move in result_3.suggested_moves or [])
    if run_found:
        print("✅ PASS: Correctly identifies runs")
    else:
        print("❌ FAIL: Should find runs")
        return False
    
    print("\n" + "=" * 50)
    print("�� All core functionality tests passed!")
    print("   - Duplicate color bug is fixed")
    print("   - Valid groups are detected correctly")
    print("   - Runs are detected correctly")
    print("   - TypeScript version should match this behavior")
    
    return True

if __name__ == "__main__":
    test_core_functionality()
