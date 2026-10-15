import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen, within } from '@testing-library/react-native';

// @ts-expect-error: só existe na versão falsa do SDK, em __mocks__.
import { mockFullScreenAd as ad, mockRewardedAd as rewarded } from 'react-native-google-mobile-ads';

import App, { PHONE_DELAY_MS } from '../App';
import { THEMES } from '../src/themes';

// Estes testes usam o SDK falso de __mocks__; os anúncios simulados têm o seu próprio arquivo.
jest.mock('../src/ads/simulate', () => ({ SIMULATE_ADS: false }));

// Os testes rodam num aparelho em português, salvo quando dizem outro idioma.
let mockLanguage = 'pt';
jest.mock('expo-localization', () => ({
  useLocales: () => [{ languageCode: mockLanguage }],
}));

const mockStore = new Map<string, string>();
jest.mock('expo-sqlite/kv-store', () => ({
  Storage: {
    getItemSync: (key: string) => mockStore.get(key) ?? null,
    setItemSync: (key: string, value: string) => mockStore.set(key, value),
  },
}));

async function tap(casa: number) {
  await fireEvent.press(screen.getByLabelText(new RegExp(`^Casa ${casa},`)));
}

beforeEach(() => {
  mockLanguage = 'pt';
  mockStore.clear();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('mostra o título e de quem é a vez', async () => {
  await render(<App />);
  expect(screen.getByText('Jogo da Velha')).toBeTruthy();
  expect(screen.getByText('Vez de X')).toBeTruthy();
});

test('dois jogadores: partida até a vitória, placar e recomeço', async () => {
  await render(<App />);
  for (const casa of [1, 4, 2, 5, 3]) {
    await tap(casa);
  }
  expect(screen.getByText('X venceu!')).toBeTruthy();
  expect(screen.getByLabelText('X: 1')).toBeTruthy();

  await fireEvent.press(screen.getByText('Nova partida'));
  expect(screen.getByLabelText('Casa 1, vazia')).toBeTruthy();
  // Na partida seguinte, O começa; o placar continua.
  expect(screen.getByText('Vez de O')).toBeTruthy();
  expect(screen.getByLabelText('X: 1')).toBeTruthy();
});

test('contra o celular: ele responde depois da jogada da pessoa', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByText('Imbatível'));
  expect(screen.getByText('Sua vez (X)')).toBeTruthy();

  await tap(1);
  expect(screen.getByText('O celular está pensando…')).toBeTruthy();

  await act(async () => {
    jest.advanceTimersByTime(PHONE_DELAY_MS);
  });
  expect(screen.getByText('Sua vez (X)')).toBeTruthy();
  // Contra um canto, o jogo perfeito responde no centro.
  expect(screen.getByLabelText('Casa 5, O')).toBeTruthy();
});

test.each(Object.values(THEMES))('tema $name: mostra os símbolos do tema nas casas', async (theme) => {
  await render(<App initialThemeId={theme.id} />);
  await tap(1);
  await tap(2);
  expect(within(screen.getByLabelText('Casa 1, X')).getByText(theme.marks.X)).toBeTruthy();
  expect(within(screen.getByLabelText('Casa 2, O')).getByText(theme.marks.O)).toBeTruthy();
});

test('troca o tema pela tela de escolha e salva a escolha', async () => {
  await render(<App />);
  expect(screen.getByText('X Tema: Clássico O')).toBeTruthy();

  await fireEvent.press(screen.getByLabelText('Tema: Clássico. Trocar tema'));
  await fireEvent.press(screen.getByLabelText('Tema Espaço'));
  expect(screen.getByText('🚀 Tema: Espaço 👾')).toBeTruthy();
  await tap(1);
  expect(within(screen.getByLabelText('Casa 1, X')).getByText('🚀')).toBeTruthy();

  expect(mockStore.get('tema')).toBe('espaco');
});

test('abre com o tema salvo da última vez', async () => {
  mockStore.set('tema', 'futebol');
  await render(<App />);
  expect(screen.getByText('⚽ Tema: Futebol 👟')).toBeTruthy();
});

test('um valor salvo inválido volta para o Clássico', async () => {
  mockStore.set('tema', 'inexistente');
  await render(<App />);
  expect(screen.getByText('X Tema: Clássico O')).toBeTruthy();
});

test('placar e mensagens usam os símbolos do tema', async () => {
  await render(<App initialThemeId="futebol" />);
  expect(screen.getByText('Vez de ⚽')).toBeTruthy();
  await tap(1);
  expect(screen.getByText('Vez de 👟')).toBeTruthy();
  for (const casa of [4, 2, 5, 3]) {
    await tap(casa);
  }
  expect(screen.getByText('⚽ venceu!')).toBeTruthy();
  expect(screen.getByLabelText('⚽: 1')).toBeTruthy();
  expect(screen.getByLabelText('👟: 0')).toBeTruthy();

  await fireEvent.press(screen.getByText('Fácil'));
  expect(screen.getByText('Sua vez (⚽)')).toBeTruthy();
  expect(screen.getByLabelText('Você (⚽): 0')).toBeTruthy();
  expect(screen.getByLabelText('Celular (👟): 0')).toBeTruthy();
});

test('em inglês quando o aparelho está em inglês', async () => {
  mockLanguage = 'en';
  await render(<App />);
  expect(screen.getByText('Tic Tac Toe')).toBeTruthy();
  expect(screen.getByText('X Theme: Classic O')).toBeTruthy();
  expect(screen.getByText("X's turn")).toBeTruthy();
  for (const casa of [1, 4, 2, 5, 3]) {
    await fireEvent.press(screen.getByLabelText(new RegExp(`^Square ${casa},`)));
  }
  expect(screen.getByText('X wins!')).toBeTruthy();
  expect(screen.getByText('New game')).toBeTruthy();

  await fireEvent.press(screen.getByLabelText('Theme: Classic. Change theme'));
  expect(screen.getByText('Choose a theme')).toBeTruthy();
  await fireEvent.press(screen.getByLabelText('Theme Space'));
  expect(screen.getByText('🚀 Theme: Space 👾')).toBeTruthy();
});

test('em inglês quando o idioma do aparelho não tem tradução', async () => {
  mockLanguage = 'ja';
  await render(<App />);
  expect(screen.getByText('Tic Tac Toe')).toBeTruthy();
});

test('o intersticial só conta partidas terminadas', async () => {
  ad.status = 'loaded';
  ad.show.mockClear();
  await render(<App />);

  // Recomeçar no meio da partida não conta.
  for (let i = 0; i < 3; i++) {
    await tap(1);
    await fireEvent.press(screen.getByText('Nova partida'));
  }
  expect(ad.show).not.toHaveBeenCalled();

  // Três partidas terminadas (empates), e o anúncio aparece ao sair da terceira.
  const empate = [1, 2, 3, 5, 4, 6, 8, 7, 9];
  for (let partida = 0; partida < 3; partida++) {
    for (const casa of empate) {
      await tap(casa);
    }
    expect(screen.getByText('Deu velha! Empate.')).toBeTruthy();
    await fireEvent.press(screen.getByText('Nova partida'));
  }
  expect(ad.show).toHaveBeenCalledTimes(1);
});

test('contra o celular, desfaz a jogada depois de assistir ao vídeo', async () => {
  rewarded.status = 'loaded';
  rewarded.earnedReward = false;
  const view = await render(<App />);
  await fireEvent.press(screen.getByText('Fácil'));
  expect(screen.queryByLabelText('Desfazer jogada (assistir vídeo)')).toBeNull();

  await tap(1);
  await act(async () => {
    jest.advanceTimersByTime(PHONE_DELAY_MS);
  });
  await fireEvent.press(screen.getByLabelText('Desfazer jogada (assistir vídeo)'));
  expect(rewarded.show).toHaveBeenCalled();

  // A pessoa assiste até o fim e fecha o vídeo.
  rewarded.status = 'closed';
  rewarded.earnedReward = true;
  await view.rerender(<App />);
  expect(screen.getByLabelText('Casa 1, vazia')).toBeTruthy();
  expect(screen.getAllByLabelText(/, vazia$/)).toHaveLength(9);
});
