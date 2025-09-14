import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { solveRummikubGame, Tile as SolverTile, SolverResult } from '../../utils/rummikubSolver';

interface Tile {
  id: string;
  color: string;
  number: number;
  colorName: string;
}

export default function SolverScreen() {
  const [handTiles, setHandTiles] = useState<Tile[]>([]);
  const [tableTiles, setTableTiles] = useState<Tile[]>([]);
  const [solverResult, setSolverResult] = useState<SolverResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<SolverResult[]>([]);

  // Sample game states for quick testing
  const sampleGames = [
    {
      name: "Easy Win",
      handTiles: [
        { id: "r1", color: "#FF0000", number: 1, colorName: "Red" },
        { id: "r2", color: "#FF0000", number: 2, colorName: "Red" },
        { id: "r3", color: "#FF0000", number: 3, colorName: "Red" },
        { id: "b5", color: "#0000FF", number: 5, colorName: "Blue" },
        { id: "y5", color: "#FFD700", number: 5, colorName: "Yellow" },
        { id: "bl5", color: "#000000", number: 5, colorName: "Black" },
      ],
      tableTiles: []
    },
    {
      name: "Complex Game",
      handTiles: [
        { id: "r1", color: "#FF0000", number: 1, colorName: "Red" },
        { id: "r2", color: "#FF0000", number: 2, colorName: "Red" },
        { id: "r3", color: "#FF0000", number: 3, colorName: "Red" },
        { id: "r4", color: "#FF0000", number: 4, colorName: "Red" },
        { id: "b7", color: "#0000FF", number: 7, colorName: "Blue" },
        { id: "y7", color: "#FFD700", number: 7, colorName: "Yellow" },
        { id: "bl7", color: "#000000", number: 7, colorName: "Black" },
        { id: "r10", color: "#FF0000", number: 10, colorName: "Red" },
        { id: "b10", color: "#0000FF", number: 10, colorName: "Blue" },
        { id: "y10", color: "#FFD700", number: 10, colorName: "Yellow" },
      ],
      tableTiles: [
        { id: "b1", color: "#0000FF", number: 1, colorName: "Blue" },
        { id: "b2", color: "#0000FF", number: 2, colorName: "Blue" },
        { id: "b3", color: "#0000FF", number: 3, colorName: "Blue" },
      ]
    },
    {
      name: "Difficult Case",
      handTiles: [
        { id: "r1", color: "#FF0000", number: 1, colorName: "Red" },
        { id: "r3", color: "#FF0000", number: 3, colorName: "Red" },
        { id: "r5", color: "#FF0000", number: 5, colorName: "Red" },
        { id: "r7", color: "#FF0000", number: 7, colorName: "Red" },
        { id: "b2", color: "#0000FF", number: 2, colorName: "Blue" },
        { id: "b4", color: "#0000FF", number: 4, colorName: "Blue" },
        { id: "b6", color: "#0000FF", number: 6, colorName: "Blue" },
        { id: "y8", color: "#FFD700", number: 8, colorName: "Yellow" },
        { id: "y9", color: "#FFD700", number: 9, colorName: "Yellow" },
        { id: "y10", color: "#FFD700", number: 10, colorName: "Yellow" },
      ],
      tableTiles: []
    }
  ];

  const loadSampleGame = (gameIndex: number) => {
    const game = sampleGames[gameIndex];
    setHandTiles(game.handTiles);
    setTableTiles(game.tableTiles);
    setSolverResult(null);
  };

  const runSolver = async () => {
    if (handTiles.length === 0 && tableTiles.length === 0) {
      Alert.alert('No Tiles', 'Please load a sample game or add tiles before running the solver.');
      return;
    }

    setIsLoading(true);
    setSolverResult(null);

    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const result = solveRummikubGame(handTiles, tableTiles);
      setSolverResult(result);
      
      // Add to history
      setAnalysisHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
    } catch (error) {
      Alert.alert('Error', 'Failed to run the solver. Please try again.');
      console.error('Solver error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setHandTiles([]);
    setTableTiles([]);
    setSolverResult(null);
  };

  const getScoreColor = (score: number, maxPossible: number) => {
    if (maxPossible === 0) return '#666';
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
          AI Solver Lab
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Advanced Rummikub Analysis
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Sample Games
        </ThemedText>
        <ThemedText style={styles.description}>
          Test the solver with pre-configured game states
        </ThemedText>
        
        <View style={styles.sampleButtonsContainer}>
          {sampleGames.map((game, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sampleButton}
              onPress={() => loadSampleGame(index)}
            >
              <ThemedText style={styles.sampleButtonText}>
                {game.name}
              </ThemedText>
              <ThemedText style={styles.sampleButtonSubtext}>
                {game.handTiles.length + game.tableTiles.length} tiles
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <View style={styles.gameInfoContainer}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Current Game State
          </ThemedText>
          <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
            <ThemedText style={styles.clearButtonText}>Clear All</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Hand Tiles:</ThemedText>
            <ThemedText style={styles.statValue}>{handTiles.length}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Table Tiles:</ThemedText>
            <ThemedText style={styles.statValue}>{tableTiles.length}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Total Value:</ThemedText>
            <ThemedText style={styles.statValue}>{totalTileValue}</ThemedText>
          </View>
        </View>

        {handTiles.length > 0 && (
          <View style={styles.tilesPreview}>
            <ThemedText style={styles.tilesLabel}>Hand Tiles:</ThemedText>
            <View style={styles.tilesRow}>
              {handTiles.slice(0, 10).map((tile, index) => (
                <View key={tile.id} style={styles.tilePreview}>
                  <View style={[styles.tileColor, { backgroundColor: tile.color }]} />
                  <ThemedText style={styles.tileNumber}>{tile.number}</ThemedText>
                </View>
              ))}
              {handTiles.length > 10 && (
                <ThemedText style={styles.moreTiles}>+{handTiles.length - 10} more</ThemedText>
              )}
            </View>
          </View>
        )}

        {tableTiles.length > 0 && (
          <View style={styles.tilesPreview}>
            <ThemedText style={styles.tilesLabel}>Table Tiles:</ThemedText>
            <View style={styles.tilesRow}>
              {tableTiles.slice(0, 10).map((tile, index) => (
                <View key={tile.id} style={styles.tilePreview}>
                  <View style={[styles.tileColor, { backgroundColor: tile.color }]} />
                  <ThemedText style={styles.tileNumber}>{tile.number}</ThemedText>
                </View>
              ))}
              {tableTiles.length > 10 && (
                <ThemedText style={styles.moreTiles}>+{tableTiles.length - 10} more</ThemedText>
              )}
            </View>
          </View>
        )}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          AI Analysis
        </ThemedText>
        <ThemedText style={styles.description}>
          Advanced dynamic programming algorithm with O(n) complexity
        </ThemedText>
        
        <TouchableOpacity 
          style={[styles.analyzeButton, isLoading && styles.analyzeButtonDisabled]} 
          onPress={runSolver}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" size="small" />
              <ThemedText style={styles.analyzeButtonText}>Analyzing...</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.analyzeButtonText}>Run AI Analysis</ThemedText>
          )}
        </TouchableOpacity>

        {solverResult && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <ThemedText style={styles.resultTitle}>Analysis Result</ThemedText>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: solverResult.isSolvable ? '#4CAF50' : '#F44336' }
              ]}>
                <ThemedText style={styles.statusText}>
                  {solverResult.isSolvable ? 'SOLVABLE' : 'NOT SOLVABLE'}
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.scoreSection}>
              <View style={styles.scoreItem}>
                <ThemedText style={styles.scoreLabel}>Max Score:</ThemedText>
                <ThemedText style={[
                  styles.scoreValue,
                  { color: getScoreColor(solverResult.maxScore || 0, totalTileValue) }
                ]}>
                  {solverResult.maxScore || 0}
                </ThemedText>
              </View>
              <View style={styles.scoreItem}>
                <ThemedText style={styles.scoreLabel}>Total Possible:</ThemedText>
                <ThemedText style={styles.scoreValue}>{totalTileValue}</ThemedText>
              </View>
              <View style={styles.scoreItem}>
                <ThemedText style={styles.scoreLabel}>Efficiency:</ThemedText>
                <ThemedText style={[
                  styles.scoreValue,
                  { color: getScoreColor(solverResult.maxScore || 0, totalTileValue) }
                ]}>
                  {totalTileValue > 0 ? Math.round(((solverResult.maxScore || 0) / totalTileValue) * 100) : 0}%
                </ThemedText>
              </View>
            </View>
            
            <ThemedText style={styles.reasonText}>
              {solverResult.reason}
            </ThemedText>

            {solverResult.suggestedMoves && solverResult.suggestedMoves.length > 0 && (
              <View style={styles.movesSection}>
                <ThemedText style={styles.movesTitle}>Suggested Moves:</ThemedText>
                {solverResult.suggestedMoves.map((move, index) => (
                  <View key={index} style={styles.moveItem}>
                    <View style={styles.moveNumber}>
                      <ThemedText style={styles.moveNumberText}>{index + 1}</ThemedText>
                    </View>
                    <ThemedText style={styles.moveText}>{move}</ThemedText>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ThemedView>

      {analysisHistory.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Analysis History
          </ThemedText>
          <ThemedText style={styles.description}>
            Recent solver results
          </ThemedText>
          
          {analysisHistory.map((result, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <ThemedText style={styles.historyIndex}>#{index + 1}</ThemedText>
                <View style={[
                  styles.historyStatus,
                  { backgroundColor: result.isSolvable ? '#4CAF50' : '#F44336' }
                ]}>
                  <ThemedText style={styles.historyStatusText}>
                    {result.isSolvable ? 'SOLVABLE' : 'NOT SOLVABLE'}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={styles.historyScore}>
                Score: {result.maxScore || 0} / {totalTileValue}
              </ThemedText>
            </View>
          ))}
        </ThemedView>
      )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1D3D47',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  sampleButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sampleButton: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    width: '48%',
    marginBottom: 8,
    alignItems: 'center',
  },
  sampleButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sampleButtonSubtext: {
    fontSize: 12,
    color: '#666',
  },
  gameInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  gameStats: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  tilesPreview: {
    marginBottom: 12,
  },
  tilesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tilePreview: {
    width: 30,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  tileColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  tileNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  moreTiles: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scoreSection: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    marginBottom: 16,
    lineHeight: 20,
  },
  movesSection: {
    marginTop: 8,
  },
  movesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  moveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  moveNumber: {
    backgroundColor: '#4CAF50',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moveNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  moveText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  historyItem: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  historyIndex: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  historyStatus: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  historyStatusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  historyScore: {
    fontSize: 12,
    color: '#666',
  },
});
