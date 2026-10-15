import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Board, Player, emptyBoard, getStatus, play } from './src/game';

export default function App() {
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [first, setFirst] = useState<Player>('X');
  const status = getStatus(board, first);

  function restart() {
    setBoard(emptyBoard());
    // Quem começa alterna a cada partida.
    setFirst((p) => (p === 'X' ? 'O' : 'X'));
  }

  let message: string;
  if (status.kind === 'won') {
    message = `${status.winner} venceu!`;
  } else if (status.kind === 'draw') {
    message = 'Deu velha! Empate.';
  } else {
    message = `Vez de ${status.next}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Velha</Text>
      <Text style={styles.message} accessibilityLiveRegion="polite">
        {message}
      </Text>

      <View style={styles.board}>
        {board.map((cell, index) => {
          const highlighted = status.kind === 'won' && status.line.includes(index);
          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`Casa ${index + 1}${cell ? `, ${cell}` : ', vazia'}`}
              onPress={() => setBoard(play(board, index, first))}
              style={[styles.cell, highlighted && styles.cellHighlighted]}
            >
              <Text style={[styles.mark, cell === 'X' ? styles.markX : styles.markO]}>
                {cell ?? ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable accessibilityRole="button" onPress={restart} style={styles.button}>
        <Text style={styles.buttonText}>Nova partida</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  message: {
    fontSize: 20,
    marginBottom: 24,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '33.333%',
    height: '33.333%',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellHighlighted: {
    backgroundColor: '#fff3b0',
  },
  mark: {
    fontSize: 56,
    fontWeight: 'bold',
  },
  markX: {
    color: '#1e6fd9',
  },
  markO: {
    color: '#d9381e',
  },
  button: {
    marginTop: 32,
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
