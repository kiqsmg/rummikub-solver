import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, Switch } from 'react-native';
import Slider from '@react-native-community/slider';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface Tile {
  id: string;
  color: string;
  number: number;
  colorName: string;
}

export default function TileSelectionScreen() {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [isTableList, setIsTableList] = useState(false);
  const [tableTiles, setTableTiles] = useState<Tile[]>([]);
  const [handTiles, setHandTiles] = useState<Tile[]>([]);

  const colors = ['Red', 'Yellow', 'Blue', 'Black'];
  const numbers = Array.from({ length: 14 }, (_, i) => i + 1);

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
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={3}
            step={1}
            value={selectedColor}
            onValueChange={setSelectedColor}
            minimumTrackTintColor="#A1CEDC"
            maximumTrackTintColor="#D0D0D0"
          />
          <View style={styles.sliderLabels}>
            {colors.map((color, index) => (
              <ThemedText key={color} style={styles.sliderLabel}>
                {color}
              </ThemedText>
            ))}
          </View>
        </View>
        <View style={styles.colorPreview}>
          <View 
            style={[
              styles.colorCircle, 
              { backgroundColor: getColorValue(selectedColor) }
            ]} 
          />
          <ThemedText style={styles.selectedValue}>
            Selected: {colors[selectedColor]}
          </ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Number Selection
        </ThemedText>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={14}
            step={1}
            value={selectedNumber}
            onValueChange={setSelectedNumber}
            minimumTrackTintColor="#A1CEDC"
            maximumTrackTintColor="#D0D0D0"
          />
          <View style={styles.sliderLabels}>
            <ThemedText style={styles.sliderLabel}>1</ThemedText>
            <ThemedText style={styles.sliderLabel}>7</ThemedText>
            <ThemedText style={styles.sliderLabel}>14</ThemedText>
          </View>
        </View>
        <View style={styles.numberPreview}>
          <View style={styles.numberCircle}>
            <ThemedText style={styles.numberText}>
              {selectedNumber}
            </ThemedText>
          </View>
          <ThemedText style={styles.selectedValue}>
            Selected: {selectedNumber}
          </ThemedText>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  sliderContainer: {
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#666',
  },
  colorPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  numberPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A1CEDC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#353636',
  },
  selectedValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
});
