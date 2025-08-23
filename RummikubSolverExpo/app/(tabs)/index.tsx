import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Rummikub Solver
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Contents
        </ThemedText>
        <ThemedText style={styles.text}>
          106 tiles (8 sets of tiles 1-13 in four colours, and 2 joker tiles), 4 racks + rack holders.
        </ThemedText>
        <ThemedText style={styles.text}>
          Contents for Rummikub XP/Mini XP for 5 or 6 players: use all of the 160 tiles (12 sets of tiles 1-13 in four colours, and 4 joker tiles).
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Object of The Game
        </ThemedText>
        <ThemedText style={styles.text}>
          To be the first player to play all the tiles from your rack by forming them into sets (runs and/or groups).
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Sets
        </ThemedText>
        <ThemedText style={styles.text}>
          There are two kinds of sets:
        </ThemedText>
        <ThemedText style={styles.text}>
          A group is a set of either three or four tiles of the same number in different colors.
        </ThemedText>
        <ThemedText style={styles.text}>
          A run is a set of three or more consecutive numbers all in the same color.
        </ThemedText>
        <ThemedText style={styles.text}>
          The number 1 is always played as the lowest number, it cannot follow the number 13.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Set-up
        </ThemedText>
        <ThemedText style={styles.text}>
          Place the tiles face down on the table and mix them thoroughly. Each player picks a tile; the player with the highest number goes first. Return the tiles to the table and mix them. It is recommended to stack the tiles in piles of 7 for ease of playing. Each player takes 14 tiles and places them on his/her rack.
        </ThemedText>
        <ThemedText style={styles.text}>
          The remaining tiles are called the "pool." Each round is made up of multiple games. The number of players determines the number of games in a round - with four players a round is made up of four games, with three players a round is made up of three games, and with two players a round is made up of two games. However, the players can determine the numbers of rounds. (Nevertheless - players may have their own 'house rules')
        </ThemedText>
        <ThemedText style={styles.text}>
          When a player plays the last tile on his/her rack a game ends. Players then start over again until they have played the number of games/rounds they agreed to play.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Playing The Game
        </ThemedText>
        <ThemedText style={styles.text}>
          Each tile is worth its face value (the number shown on the tile). In order to make an initial meld, each player must place tiles on the table in one or more sets that total at least 30 points. These points must come from the tiles on each player's rack; for their initial meld, players may not use tiles already played on the table.
        </ThemedText>
        <ThemedText style={styles.text}>
          A joker used in the initial meld scores the value of the tile it represents. When players cannot play any tiles from their racks, or purposely choose not to, they must draw a tile from the pool. After they draw, their turn is over. Play passes to the left (clockwise).
        </ThemedText>
        <ThemedText style={styles.text}>
          On turns after a player has made his/her initial meld, that player can build onto other sets on the table with tiles from his/her rack. On any turn that a player cannot add onto another set or play a set from his/her rack, that player picks a tile from the pool and his/her turn ends.
        </ThemedText>
        <ThemedText style={styles.text}>
          Players cannot lay down a tile they just drew; they must wait until their next turn to play this tile.
        </ThemedText>
        <ThemedText style={styles.text}>
          Play continues until one player empties his/her rack and calls, "Rummikub!" This ends the game and players tally their points (see Scoring). If there are no more tiles in the pool but no player has emptied his/her rack, play continues until no more plays can be made. This ends the game.
        </ThemedText>
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
    backgroundColor: '#A1CEDC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D3D47',
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
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    color: '#333',
  },
});
