import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Switch } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { solveRummikubGame, Tile as SolverTile } from '../../utils/rummikubSolver';

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
  const [solverResult, setSolverResult] = useState<string | null>(null);

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

  const runSolver = () => {
    // Use the imported solver function
    const result = solveRummikubGame(handTiles, tableTiles);
    setSolverResult(result.isSolvable ? 'Solvable' : 'Unsolvable');
  };



  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Tile Selection
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Select your Rummikub tile
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
          Summary
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
        </View>
      </ThemedView>

      <ThemedView style={[styles.section, styles.lastSection]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Game Solver
        </ThemedText>
        <ThemedText style={styles.solverDescription}>
          Analyze your current game state to see if it's possible to win
        </ThemedText>
        
        <TouchableOpacity style={styles.solverButton} onPress={runSolver}>
          <ThemedText style={styles.solverButtonText}>
            Run Solver
          </ThemedText>
        </TouchableOpacity>

        {solverResult && (
          <View style={styles.resultContainer}>
            <ThemedText style={styles.resultLabel}>Result:</ThemedText>
            <View style={[
              styles.resultBadge, 
              { backgroundColor: solverResult === 'Solvable' ? '#4CAF50' : '#F44336' }
            ]}>
              <ThemedText style={styles.resultText}>
                {solverResult}
              </ThemedText>
            </View>
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
    paddingBottom: 100, // Increased bottom padding to account for tab bar and safe areas
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#D0D0D0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#353636',
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
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#353636',
  },
  tilePreview: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  tile: {
    width: 80,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  tileColor: {
    height: 20,
    width: '100%',
  },
  tileNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#353636',
    textAlign: 'center',
    marginTop: 30,
  },
  tileDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353636',
  },
  addButton: {
    backgroundColor: '#A1CEDC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#353636',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tileItem: {
    position: 'relative',
  },
  tileItemTile: {
    width: 60,
    height: 75,
    backgroundColor: 'white',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  tileItemColor: {
    height: 15,
    width: '100%',
  },
  tileItemNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353636',
    textAlign: 'center',
    marginTop: 20,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  summaryContainer: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#353636',
    fontWeight: 'bold',
  },
  solverDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  solverButton: {
    backgroundColor: '#A1CEDC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  solverButtonText: {
    color: '#353636',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  resultLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
  },
  resultBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastSection: {
    marginBottom: 40, // Extra bottom margin for the last section
  },
  colorButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 16,
    paddingHorizontal: 8,
  },
  colorButton: {
    width: '45%',
    aspectRatio: 1.2,
    borderRadius: 16,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    padding: 12,
  },
  colorButtonSelected: {
    borderWidth: 3,
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    transform: [{ scale: 1.05 }],
  },
  colorButtonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  colorButtonText: {
    fontSize: 16,
    color: '#555',
    marginTop: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  colorButtonTextSelected: {
    color: '#4A90E2',
    fontWeight: 'bold',
    textShadowColor: 'rgba(74,144,226,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  numberButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 12,
    paddingHorizontal: 8,
  },
  numberButton: {
    width: '18%',
    aspectRatio: 1.1,
    borderRadius: 14,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
    padding: 8,
    marginBottom: 8,
  },
  numberButtonSelected: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    backgroundColor: '#F0F8FF',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1.08 }],
  },
  numberButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  numberButtonTextSelected: {
    color: '#4A90E2',
    fontWeight: 'bold',
    textShadowColor: 'rgba(74,144,226,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  numberButtonLabel: {
    fontSize: 11,
    color: '#7F8C8D',
    marginTop: 4,
    fontWeight: '500',
    textShadowColor: 'rgba(0,0,0,0.05)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  numberButtonLabelSelected: {
    color: '#4A90E2',
    fontWeight: 'bold',
    textShadowColor: 'rgba(74,144,226,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
