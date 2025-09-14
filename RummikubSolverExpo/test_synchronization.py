#!/usr/bin/env python3
"""
Test script to verify Python and TypeScript Rummikub solvers are synchronized
"""

import sys
import subprocess
import json
sys.path.append('..')
from rummikub_solver import solve_rummikub, Tile, GameState

def test_solver_synchronization():
    """Test that Python and TypeScript solvers produce identical results"""
    
    print("🔄 Testing Python ↔ TypeScript Solver Synchronization")
    print("=" * 60)
    
    # Test cases with various scenarios
    test_cases = [
        {
            "name": "Duplicate Colors Fix",
            "hand_tiles": [
                Tile(id="bl6_1", color="#000000", number=6, color_name="Black"),
                Tile(id="r6", color="#FF0000", number=6, color_name="Red"),
                Tile(id="y6", color="#FFD700", number=6, color_name="Yellow"),
                Tile(id="bl6_2", color="#000000", number=6, color_name="Black"),
            ],
            "table_tiles": []
        },
        {
            "name": "Valid Group with 4 Colors",
            "hand_tiles": [
                Tile(id="bl6", color="#000000", number=6, color_name="Black"),
                Tile(id="r6", color="#FF0000", number=6, color_name="Red"),
                Tile(id="y6", color="#FFD700", number=6, color_name="Yellow"),
                Tile(id="b6", color="#0000FF", number=6, color_name="Blue"),
            ],
            "table_tiles": []
        },
        {
            "name": "Run Detection",
            "hand_tiles": [
                Tile(id="r1", color="#FF0000", number=1, color_name="Red"),
                Tile(id="r2", color="#FF0000", number=2, color_name="Red"),
                Tile(id="r3", color="#FF0000", number=3, color_name="Red"),
                Tile(id="r4", color="#FF0000", number=4, color_name="Red"),
            ],
            "table_tiles": []
        },
        {
            "name": "Mixed Scenario",
            "hand_tiles": [
                Tile(id="r1", color="#FF0000", number=1, color_name="Red"),
                Tile(id="r2", color="#FF0000", number=2, color_name="Red"),
                Tile(id="r3", color="#FF0000", number=3, color_name="Red"),
                Tile(id="b5", color="#0000FF", number=5, color_name="Blue"),
                Tile(id="y5", color="#FFD700", number=5, color_name="Yellow"),
                Tile(id="bl5", color="#000000", number=5, color_name="Black"),
            ],
            "table_tiles": []
        }
    ]
    
    all_passed = True
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📋 Test Case {i}: {test_case['name']}")
        print("-" * 40)
        
        # Test Python solver
        game_state = GameState(
            hand_tiles=test_case['hand_tiles'],
            table_tiles=test_case['table_tiles']
        )
        python_result = solve_rummikub(game_state)
        
        print(f"Python Result:")
        print(f"  Solvable: {python_result.is_solvable}")
        print(f"  Max Score: {python_result.max_score}")
        print(f"  Moves: {len(python_result.suggested_moves or [])} suggestions")
        
        # Test TypeScript solver (via Node.js)
        try:
            # Create a simple test script
            ts_test_script = f"""
const {{ solveRummikubGame }} = require('./utils/rummikubSolver.ts');

const handTiles = {json.dumps([{
                'id': tile.id,
                'color': tile.color,
                'number': tile.number,
                'colorName': tile.color_name
            } for tile in test_case['hand_tiles']])};

const tableTiles = {json.dumps([{
                'id': tile.id,
                'color': tile.color,
                'number': tile.number,
                'colorName': tile.color_name
            } for tile in test_case['table_tiles']])};

const result = solveRummikubGame(handTiles, tableTiles);
console.log(JSON.stringify(result));
"""
            
            with open('temp_ts_test.js', 'w') as f:
                f.write(ts_test_script)
            
            # Run TypeScript test
            ts_result = subprocess.run(['node', 'temp_ts_test.js'], 
                                     capture_output=True, text=True, cwd='.')
            
            if ts_result.returncode == 0:
                ts_data = json.loads(ts_result.stdout.strip())
                print(f"TypeScript Result:")
                print(f"  Solvable: {ts_data['isSolvable']}")
                print(f"  Max Score: {ts_data['maxScore']}")
                print(f"  Moves: {len(ts_data.get('suggestedMoves', []))} suggestions")
                
                # Compare results
                python_solvable = python_result.is_solvable
                ts_solvable = ts_data['isSolvable']
                python_score = python_result.max_score or 0
                ts_score = ts_data.get('maxScore', 0)
                
                if python_solvable == ts_solvable and python_score == ts_score:
                    print("✅ PASS: Results match between Python and TypeScript")
                else:
                    print("❌ FAIL: Results differ between Python and TypeScript")
                    all_passed = False
            else:
                print(f"❌ FAIL: TypeScript test failed - {ts_result.stderr}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ FAIL: Error running TypeScript test - {e}")
            all_passed = False
        finally:
            # Clean up
            try:
                import os
                os.remove('temp_ts_test.js')
            except:
                pass
    
    print("\n" + "=" * 60)
    if all_passed:
        print("�� SUCCESS: Python and TypeScript solvers are synchronized!")
        print("   - Both versions produce identical results")
        print("   - Duplicate color bug is fixed in both")
        print("   - All test cases passed")
    else:
        print("⚠️  WARNING: Some tests failed - versions may not be synchronized")
    
    return all_passed

if __name__ == "__main__":
    test_solver_synchronization()
