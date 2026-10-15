import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

import App, { PHONE_DELAY_MS } from '../App';

async function tap(casa: number) {
  await fireEvent.press(screen.getByLabelText(new RegExp(`^Casa ${casa},`)));
}

beforeEach(() => {
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
