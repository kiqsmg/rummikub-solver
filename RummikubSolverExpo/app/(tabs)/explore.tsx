import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Switch, Alert } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { solveRummikubGame, Tile as SolverTile, SolverResult } from '../../utils/rummikubSolver';

interface Tile {
  id: string;
  color: string;
  number: number;
  colorName: string;
}

export default function TileSelectionScreen() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [isTableList, setIsTableList] = useState(false);
  const [tableTiles, setTableTiles] = useState<Tile[]>([]);
  const [handTiles, setHandTiles] = useState<Tile[]>([]);
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const colors = ['Red', 'Yellow', 'Blue', 'Black'];
  const numbers = Array.from({ length: 14 }, (_, i) => i);

  const getColorValue = (colorIndex: number) => {
    const colorMap = ['#FF0000', '#FFD700', '#0000FF', '#000000'];
    return colorMap[colorIndex];
  };

  const addTileToList = () => {
    const newTile: Tile = {
      id: Date.now().toString(),
      color: getColorValue(selectedColor),
      number: selectedNumber,
      colorName: colors[selectedColor],
    };
    
    if (isTableList) {
      setTableTiles([...tableTiles, newTile]);
    } else {
      setHandTiles([...handTiles, newTile]);
    }
  };

  const removeTile = (tileId: string, isTable: boolean) => {
    if (isTable) {
      setTableTiles(tableTiles.filter(tile => tile.id !== tileId));
    } else {
      setHandTiles(handTiles.filter(tile => tile.id !== tileId));
    }
  };

  const clearAllTiles = (isTable: boolean) => {
    if (isTable) {
      setTableTiles([]);
    } else {
      setHandTiles([]);
    }
  };

  const runSolver = async () => {
    if (handTiles.length === 0 && tableTiles.length === 0) {
      Alert.alert('No Tiles', 'Please add some tiles before running the solver.');
      return;
    }

    setIsLoading(true);
    setSolverResult(null);

    try {
      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = solveRummikubGame(handTiles, tableTiles);
      setSolverResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to run the solver. Please try again.');
      console.error('Solver error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number, maxPossible: number) => {
    const percentage = (score / maxPossible) * 100;
    if (percentage >= 80) return '#4CAF50'; // Green
    if (percentage >= 60) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const totalTileValue = handTiles.reduce((sum, tile) => sum + tile.number, 0) + 
                        tableTiles.reduce((sum, tile) => sum + tile.number, 0);

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Rummikub Solver
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Advanced AI-powered tile analysis
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <View style={styles.switchContainer}>
          <ThemedText style={styles.switchLabel}>
            {isTableList ? 'Table' : 'Hand'}
          </ThemedText>
          <Switch
            value={isTableList}
            onValueChange={setIsTableList}
            trackColor={{ false: '#D0D0D0', true: '#A1CEDC' }}
            thumbColor={isTableList ? '#353636' : '#f4f3f4'}
          />
        </View>
        <ThemedText style={styles.switchDescription}>
          Switch between adding tiles to your {isTableList ? 'table' : 'hand'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Color Selection
        </ThemedText>
        <View style={styles.colorButtonsContainer}>
          {colors.map((color, index) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                selectedColor === index && styles.colorButtonSelected
              ]}
              onPress={() => setSelectedColor(index)}
            >
              <View 
                style={[
                  styles.colorButtonCircle, 
                  { backgroundColor: getColorValue(index) }
                ]} 
              />
              <ThemedText style={[
                styles.colorButtonText,
                selectedColor === index && styles.colorButtonTextSelected
              ]}>
                {color}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Number Selection
        </ThemedText>
        <View style={styles.numberButtonsContainer}>
          {/* Joker button */}
          <TouchableOpacity
            style={[
              styles.numberButton,
              selectedNumber === 0 && styles.numberButtonSelected
            ]}
            onPress={() => setSelectedNumber(0)}
          >
            <ThemedText style={[
              styles.numberButtonText,
              selectedNumber === 0 && styles.numberButtonTextSelected
            ]}>
              🃏
            </ThemedText>
            <ThemedText style={[
              styles.numberButtonLabel,
              selectedNumber === 0 && styles.numberButtonLabelSelected
            ]}>
              Joker
            </ThemedText>
          </TouchableOpacity>
          
          {/* Number buttons 1-13 */}
          {Array.from({ length: 13 }, (_, i) => i + 1).map((number) => (
            <TouchableOpacity
              key={number}
              style={[
                styles.numberButton,
                selectedNumber === number && styles.numberButtonSelected
              ]}
              onPress={() => setSelectedNumber(number)}
            >
              <ThemedText style={[
                styles.numberButtonText,
                selectedNumber === number && styles.numberButtonTextSelected
              ]}>
                {number}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Selected Tile
        </ThemedText>
        <View style={styles.tilePreview}>
          <View style={styles.tile}>
            <View 
              style={[
                styles.tileColor, 
                { backgroundColor: getColorValue(selectedColor) }
              ]} 
            />
            <ThemedText style={styles.tileNumber}>
              {selectedNumber}
            </ThemedText>
          </View>
          <ThemedText style={styles.tileDescription}>
            {colors[selectedColor]} {selectedNumber}
          </ThemedText>
        </View>
        
        <TouchableOpacity style={styles.addButton} onPress={addTileToList}>
          <ThemedText style={styles.addButtonText}>
            Add to {isTableList ? 'Table' : 'Hand'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.section}>
        <View style={styles.listHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Hand Tiles ({handTiles.length})
          </ThemedText>
          {handTiles.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => clearAllTiles(false)}
            >
              <ThemedText style={styles.clearButtonText}>
                Clear All
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
        
        {handTiles.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No tiles in your hand yet. Use the sliders above to select a tile and add it.
          </ThemedText>
        ) : (
          <View style={styles.tilesGrid}>
            {handTiles.map((tile) => (
              <View key={tile.id} style={styles.tileItem}>
                <View style={styles.tileItemTile}>
                  <View 
                    style={[
                      styles.tileItemColor, 
                      { backgroundColor: tile.color }
                    ]} 
                  />
                  <ThemedText style={styles.tileItemNumber}>
                    {tile.number}
                  </ThemedText>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeTile(tile.id, false)}
                >
                  <ThemedText style={styles.removeButtonText}>×</ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <View style={styles.listHeader}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Table Tiles ({tableTiles.length})
          </ThemedText>
          {tableTiles.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => clearAllTiles(true)}
            >
              <ThemedText style={styles.clearButtonText}>
                Clear All
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
        
        {tableTiles.length === 0 ? (
          <ThemedText style={styles.emptyText}>
            No tiles on the table yet. Use the sliders above to select a tile and add it.
          </ThemedText>
        ) : (
          <View style={styles.tilesGrid}>
            {tableTiles.map((tile) => (
              <View key={tile.id} style={styles.tileItem}>
                <View style={styles.tileItemTile}>
                  <View 
                    style={[
                      styles.tileItemColor, 
                      { backgroundColor: tile.color }
                    ]} 
                  />
                  <ThemedText style={styles.tileItemNumber}>
                    {tile.number}
                  </ThemedText>
                </View>
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => removeTile(tile.id, true)}
                >
                  <ThemedText style={styles.removeButtonText}>×</ThemedText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Game Summary
        </ThemedText>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Hand Tiles:</ThemedText>
            <ThemedText style={styles.summaryValue}>{handTiles.length}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Table Tiles:</ThemedText>
            <ThemedText style={styles.summaryValue}>{tableTiles.length}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Total Tiles:</ThemedText>
            <ThemedText style={styles.summaryValue}>{handTiles.length + tableTiles.length}</ThemedText>
          </View>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Total Value:</ThemedText>
            <ThemedText style={styles.summaryValue}>{totalTileValue}</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={[styles.section, styles.lastSection]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          AI Solver Analysis
        </ThemedText>
        <ThemedText style={styles.solverDescription}>
          Advanced dynamic programming algorithm analyzes your game state
        </ThemedText>
        
        <TouchableOpacity 
          style={[styles.solverButton, isLoading && styles.solverButtonDisabled]} 
          onPress={runSolver}
          disabled={isLoading}
        >
          <ThemedText style={styles.solverButtonText}>
            {isLoading ? 'Analyzing...' : 'Run AI Solver'}
          </ThemedText>
        </TouchableOpacity>

        {solverResult && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <ThemedText style={styles.resultLabel}>Analysis Result:</ThemedText>
              <View style={[
                styles.resultBadge, 
                { backgroundColor: solverResult.isSolvable ? '#4CAF50' : '#F44336' }
              ]}>
                <ThemedText style={styles.resultText}>
                  {solverResult.isSolvable ? 'SOLVABLE' : 'NOT SOLVABLE'}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.scoreContainer}>
              <ThemedText style={styles.scoreLabel}>Max Score:</ThemedText>
              <ThemedText style={[
                styles.scoreValue,
                { color: getScoreColor(solverResult.maxScore || 0, totalTileValue) }
              ]}>
                {solverResult.maxScore || 0} / {totalTileValue}
              </ThemedText>
            </View>
            
            <ThemedText style={styles.reasonText}>
              {solverResult.reason}
            </ThemedText>

            {solverResult.suggestedMoves && solverResult.suggestedMoves.length > 0 && (
              <View style={styles.movesContainer}>
                <ThemedText style={styles.movesTitle}>Suggested Moves:</ThemedText>
                {solverResult.suggestedMoves.map((move, index) => (
                  <View key={index} style={styles.moveItem}>
                    <ThemedText style={styles.moveText}>{move}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#A1CEDC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D3D47',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353636',
  },
  switchDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1D3D47',
  },
  colorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  colorButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    minWidth: 70,
  },
  colorButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  colorButtonCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginBottom: 4,
  },
  colorButtonText: {
    fontSize: 12,
    color: '#666',
  },
  colorButtonTextSelected: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  numberButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numberButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  numberButtonSelected: {
    backgroundColor: '#A1CEDC',
    borderColor: '#1D3D47',
  },
  numberButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  numberButtonTextSelected: {
    color: '#1D3D47',
  },
  numberButtonLabel: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  numberButtonLabelSelected: {
    color: '#1D3D47',
  },
  tilePreview: {
    alignItems: 'center',
    marginBottom: 16,
  },
  tile: {
    width: 60,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tileColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 4,
  },
  tileNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tileDescription: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#A1CEDC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#1D3D47',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  tileItem: {
    margin: 4,
    alignItems: 'center',
  },
  tileItemTile: {
    width: 40,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tileItemColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  tileItemNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    backgroundColor: '#F44336',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  solverDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  solverButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  solverButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  solverButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  resultBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  resultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reasonText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  movesContainer: {
    marginTop: 8,
  },
  movesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  moveItem: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  moveText: {
    fontSize: 12,
    color: '#333',
  },
  lastSection: {
    marginBottom: 20,
  },
});
