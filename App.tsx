import { StatusBar } from 'expo-status-bar';
import { useEffect, useReducer } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { chooseMove } from './src/ai';
import { getStatus } from './src/game';
import { Mode, PHONE, isPhoneTurn, matchReducer, newMatch } from './src/match';

/** Pausa antes da jogada do celular, para dar tempo de ver a própria jogada. */
export const PHONE_DELAY_MS = 500;

const MODES: { mode: Mode; label: string }[] = [
  { mode: 'dois-jogadores', label: '2 jogadores' },
  { mode: 'facil', label: 'Fácil' },
  { mode: 'imbativel', label: 'Imbatível' },
];

const COLORS = {
  background: '#f6f1e9',
  board: '#2f2a24',
  cell: '#fffdf9',
  highlight: '#ffe58a',
  text: '#2f2a24',
  muted: '#8a8175',
  X: '#1e6fd9',
  O: '#e0482b',
};

export default function App() {
  const [match, dispatch] = useReducer(matchReducer, undefined, () => newMatch());
  const status = getStatus(match.board, match.first);
  const vsPhone = match.mode !== 'dois-jogadores';
  const phoneTurn = isPhoneTurn(match);

  useEffect(() => {
    if (!phoneTurn || match.mode === 'dois-jogadores') {
      return;
    }
    const index = chooseMove(match.board, match.first, match.mode);
    const timer = setTimeout(() => dispatch({ type: 'play', index }), PHONE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phoneTurn, match.board, match.first, match.mode]);

  let message: string;
  if (status.kind === 'won') {
    if (vsPhone) {
      message = status.winner === PHONE ? 'O celular venceu!' : 'Você venceu!';
    } else {
      message = `${status.winner} venceu!`;
    }
  } else if (status.kind === 'draw') {
    message = 'Deu velha! Empate.';
  } else if (vsPhone) {
    message = phoneTurn ? 'O celular está pensando…' : 'Sua vez (X)';
  } else {
    message = `Vez de ${status.next}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Velha</Text>

      <View style={styles.modes} accessibilityRole="radiogroup">
        {MODES.map(({ mode, label }) => {
          const selected = match.mode === mode;
          return (
            <Pressable
              key={mode}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => dispatch({ type: 'setMode', mode })}
              style={[styles.mode, selected && styles.modeSelected]}
            >
              <Text style={[styles.modeText, selected && styles.modeTextSelected]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.score}>
        <ScoreItem label={vsPhone ? 'Você (X)' : 'X'} value={match.score.X} color={COLORS.X} />
        <ScoreItem label="Empates" value={match.score.empates} color={COLORS.muted} />
        <ScoreItem label={vsPhone ? 'Celular (O)' : 'O'} value={match.score.O} color={COLORS.O} />
      </View>

      <Text style={styles.message} accessibilityLiveRegion="polite">
        {message}
      </Text>

      <View style={styles.board}>
        {match.board.map((cell, index) => {
          const highlighted = status.kind === 'won' && status.line.includes(index);
          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`Casa ${index + 1}${cell ? `, ${cell}` : ', vazia'}`}
              disabled={phoneTurn}
              onPress={() => dispatch({ type: 'play', index })}
              style={({ pressed }) => [
                styles.cell,
                highlighted && styles.cellHighlighted,
                pressed && !cell && styles.cellPressed,
              ]}
            >
              <Text style={[styles.mark, { color: cell === 'O' ? COLORS.O : COLORS.X }]}>
                {cell ?? ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => dispatch({ type: 'restart' })}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Nova partida</Text>
      </Pressable>
      <StatusBar style="dark" />
    </View>
  );
}

function ScoreItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.scoreItem} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.scoreValue, { color }]}>{value}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 20,
  },
  modes: {
    flexDirection: 'row',
    backgroundColor: '#e8e0d4',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  mode: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9,
  },
  modeSelected: {
    backgroundColor: COLORS.cell,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  modeText: {
    fontSize: 15,
    color: COLORS.muted,
    fontWeight: '600',
  },
  modeTextSelected: {
    color: COLORS.text,
  },
  score: {
    flexDirection: 'row',
    width: 300,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scoreItem: {
    alignItems: 'center',
    minWidth: 90,
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.board,
    borderRadius: 18,
    padding: 3,
  },
  cell: {
    width: '33.333%',
    height: '33.333%',
    borderWidth: 3,
    borderColor: COLORS.board,
    borderRadius: 14,
    backgroundColor: COLORS.cell,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellHighlighted: {
    backgroundColor: COLORS.highlight,
  },
  cellPressed: {
    backgroundColor: '#efe8dc',
  },
  mark: {
    fontSize: 60,
    fontWeight: '800',
  },
  button: {
    marginTop: 28,
    backgroundColor: COLORS.board,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
