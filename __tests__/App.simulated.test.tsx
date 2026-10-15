import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import App, { PHONE_DELAY_MS } from '../App';

// No Expo Go o SDK do Google não existe: se o app tentasse carregá-lo, o teste falharia.
jest.mock('react-native-google-mobile-ads', () => {
  throw new Error('O SDK de anúncios não pode ser carregado nos anúncios simulados');
});
jest.mock('../src/ads/simulate', () => ({ SIMULATE_ADS: true }));
jest.mock('expo-localization', () => ({ useLocales: () => [{ languageCode: 'pt' }] }));
jest.mock('expo-sqlite/kv-store', () => ({
  Storage: { getItemSync: () => null, setItemSync: () => {} },
}));

const tap = (casa: number) => fireEvent.press(screen.getByLabelText(new RegExp(`^Casa ${casa},`)));

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

test('a cada 3 partidas terminadas aparece uma tela de anúncio simulado', async () => {
  await render(<App />);
  const empate = [1, 2, 3, 5, 4, 6, 8, 7, 9];

  for (let partida = 1; partida <= 3; partida++) {
    for (const casa of empate) {
      await tap(casa);
    }
    await fireEvent.press(screen.getByText('Nova partida'));
    if (partida < 3) {
      expect(screen.queryByText('Anúncio simulado · Simulated ad')).toBeNull();
    }
  }

  expect(screen.getByText('Anúncio simulado · Simulated ad')).toBeTruthy();
  expect(screen.getByText('Intersticial')).toBeTruthy();
  await fireEvent.press(screen.getByText('Fechar · Close'));
  expect(screen.queryByText('Anúncio simulado · Simulated ad')).toBeNull();
});

test('assistir ao vídeo simulado até o fim desfaz a jogada', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByText('Fácil'));
  await tap(1);
  await act(async () => {
    jest.advanceTimersByTime(PHONE_DELAY_MS);
  });
  expect(screen.getAllByLabelText(/, vazia$/)).toHaveLength(7);

  await fireEvent.press(screen.getByLabelText('Desfazer jogada (assistir vídeo)'));
  expect(screen.getByText('▶ Vídeo premiado')).toBeTruthy();
  await fireEvent.press(screen.getByText('Assistir até o fim · Watch to the end'));

  expect(screen.getAllByLabelText(/, vazia$/)).toHaveLength(9);
  expect(screen.queryByText('Anúncio simulado · Simulated ad')).toBeNull();
});

test('fechar o vídeo simulado antes do fim não desfaz a jogada', async () => {
  await render(<App />);
  await fireEvent.press(screen.getByText('Fácil'));
  await tap(1);
  await act(async () => {
    jest.advanceTimersByTime(PHONE_DELAY_MS);
  });

  await fireEvent.press(screen.getByLabelText('Desfazer jogada (assistir vídeo)'));
  await fireEvent.press(screen.getByText('Fechar antes · Close early'));

  expect(screen.getAllByLabelText(/, vazia$/)).toHaveLength(7);
});
