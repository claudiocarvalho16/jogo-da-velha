import { expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react-native';

import App from '../App';

async function tap(casa: number) {
  await fireEvent.press(screen.getByLabelText(new RegExp(`^Casa ${casa},`)));
}

test('mostra o título e de quem é a vez', async () => {
  await render(<App />);
  expect(screen.getByText('Jogo da Velha')).toBeTruthy();
  expect(screen.getByText('Vez de X')).toBeTruthy();
});

test('jogar uma partida até a vitória e recomeçar', async () => {
  await render(<App />);
  for (const casa of [1, 4, 2, 5]) {
    await tap(casa);
  }
  expect(screen.getByText('Vez de X')).toBeTruthy();
  await tap(3);
  expect(screen.getByText('X venceu!')).toBeTruthy();

  await fireEvent.press(screen.getByText('Nova partida'));
  expect(screen.getByLabelText('Casa 1, vazia')).toBeTruthy();
  // Na partida seguinte, O começa.
  expect(screen.getByText('Vez de O')).toBeTruthy();
});
