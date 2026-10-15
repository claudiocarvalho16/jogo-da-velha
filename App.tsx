import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { chooseMove } from './src/ai';
import { getStatus } from './src/game';
import { Mode, PHONE, isPhoneTurn, matchReducer, newMatch } from './src/match';
import { ThemePicker } from './src/ThemePicker';
import { loadThemeId, saveThemeId } from './src/themeStorage';
import { THEMES, Theme, ThemeId } from './src/themes';

/** Pausa antes da jogada do celular, para dar tempo de ver a própria jogada. */
export const PHONE_DELAY_MS = 500;

const MODES: { mode: Mode; label: string }[] = [
  { mode: 'dois-jogadores', label: '2 jogadores' },
  { mode: 'facil', label: 'Fácil' },
  { mode: 'imbativel', label: 'Imbatível' },
];

/** `initialThemeId` substitui o tema salvo; serve para os testes. */
export default function App({ initialThemeId }: { initialThemeId?: ThemeId }) {
  const [match, dispatch] = useReducer(matchReducer, undefined, () => newMatch());
  const status = getStatus(match.board, match.first);
  const vsPhone = match.mode !== 'dois-jogadores';
  const phoneTurn = isPhoneTurn(match);
  const [themeId, setThemeId] = useState<ThemeId>(() => initialThemeId ?? loadThemeId());
  const [pickingTheme, setPickingTheme] = useState(false);
  const theme = THEMES[themeId];
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { colors, marks } = theme;

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
      message = `${marks[status.winner]} venceu!`;
    }
  } else if (status.kind === 'draw') {
    message = 'Deu velha! Empate.';
  } else if (vsPhone) {
    message = phoneTurn ? 'O celular está pensando…' : `Sua vez (${marks.X})`;
  } else {
    message = `Vez de ${marks[status.next]}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Velha</Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Tema: ${theme.name}. Trocar tema`}
        onPress={() => setPickingTheme(true)}
        style={({ pressed }) => [styles.themeButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.themeButtonText}>
          {theme.marks.X} Tema: {theme.name} {theme.marks.O}
        </Text>
      </Pressable>

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
        <ScoreItem label={vsPhone ? `Você (${marks.X})` : marks.X} value={match.score.X} color={colors.X} styles={styles} />
        <ScoreItem label="Empates" value={match.score.empates} color={colors.muted} styles={styles} />
        <ScoreItem label={vsPhone ? `Celular (${marks.O})` : marks.O} value={match.score.O} color={colors.O} styles={styles} />
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
              <Text style={[styles.mark, { color: cell === 'O' ? colors.O : colors.X }]}>
                {cell ? theme.marks[cell] : ''}
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
      <ThemePicker
        visible={pickingTheme}
        current={theme}
        onSelect={(id) => {
          setThemeId(id);
          saveThemeId(id);
          setPickingTheme(false);
        }}
        onClose={() => setPickingTheme(false)}
      />
      <StatusBar style={theme.statusBar} />
    </View>
  );
}

type Styles = ReturnType<typeof makeStyles>;

function ScoreItem({
  label,
  value,
  color,
  styles,
}: {
  label: string;
  value: number;
  color: string;
  styles: Styles;
}) {
  return (
    <View style={styles.scoreItem} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.scoreValue, { color }]}>{value}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
}

function makeStyles(theme: Theme) {
  const { colors } = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      fontSize: 34,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 12,
    },
    themeButton: {
      backgroundColor: colors.modes,
      borderRadius: 999,
      paddingVertical: 6,
      paddingHorizontal: 14,
      marginBottom: 16,
    },
    themeButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    modes: {
      flexDirection: 'row',
      backgroundColor: colors.modes,
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
      backgroundColor: colors.cell,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    modeText: {
      fontSize: 15,
      color: colors.muted,
      fontWeight: '600',
    },
    modeTextSelected: {
      color: colors.text,
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
      color: colors.muted,
    },
    message: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    board: {
      width: 300,
      height: 300,
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: colors.board,
      borderRadius: 18,
      padding: 3,
    },
    cell: {
      width: '33.333%',
      height: '33.333%',
      borderWidth: 3,
      borderColor: colors.board,
      borderRadius: 14,
      backgroundColor: colors.cell,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cellHighlighted: {
      backgroundColor: colors.highlight,
    },
    cellPressed: {
      backgroundColor: colors.cellPressed,
    },
    mark: {
      fontSize: 60,
      fontWeight: '800',
    },
    button: {
      marginTop: 28,
      backgroundColor: colors.board,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
    },
    buttonPressed: {
      opacity: 0.8,
    },
    buttonText: {
      color: colors.buttonText,
      fontSize: 18,
      fontWeight: '700',
    },
  });
}
