import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { THEMES, Theme, ThemeId } from './themes';

type Props = {
  visible: boolean;
  current: Theme;
  onSelect: (id: ThemeId) => void;
  onClose: () => void;
};

/** Tela de escolha do tema, com uma prévia de cada um. */
export function ThemePicker({ visible, current, onSelect, onClose }: Props) {
  const { colors } = current;
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
          Escolha o tema
        </Text>
        <ScrollView contentContainerStyle={styles.list}>
          {Object.values(THEMES).map((theme) => {
            const selected = theme.id === current.id;
            return (
              <Pressable
                key={theme.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={`Tema ${theme.name}`}
                onPress={() => onSelect(theme.id)}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: theme.colors.background, borderColor: theme.colors.board },
                  selected && { borderColor: colors.highlight, borderWidth: 4 },
                  pressed && styles.cardPressed,
                ]}
              >
                <Preview theme={theme} />
                <Text style={[styles.name, { color: theme.colors.text }]}>{theme.name}</Text>
                {selected && <Text style={[styles.badge, { color: theme.colors.muted }]}>Em uso</Text>}
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable
          accessibilityRole="button"
          onPress={onClose}
          style={({ pressed }) => [
            styles.close,
            { backgroundColor: colors.board },
            pressed && styles.cardPressed,
          ]}
        >
          <Text style={[styles.closeText, { color: colors.buttonText }]}>Voltar ao jogo</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

/** Uma fileira do tabuleiro com as cores e os símbolos do tema. */
function Preview({ theme }: { theme: Theme }) {
  const { colors, marks } = theme;
  return (
    <View style={[styles.preview, { backgroundColor: colors.board }]}>
      {(['X', 'O', 'X'] as const).map((player, i) => (
        <View
          key={i}
          style={[styles.previewCell, { backgroundColor: i === 1 ? colors.highlight : colors.cell }]}
        >
          <Text style={[styles.previewMark, { color: colors[player] }]}>{marks[player]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    gap: 14,
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.8,
  },
  preview: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  previewCell: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewMark: {
    fontSize: 22,
    fontWeight: '800',
  },
  name: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
  },
  badge: {
    fontSize: 13,
    fontWeight: '600',
  },
  close: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    fontWeight: '700',
  },
});
