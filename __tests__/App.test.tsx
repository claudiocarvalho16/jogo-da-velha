import { expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import App from '../App';

test('mostra o título do jogo', async () => {
  await render(<App />);
  expect(screen.getByText('Jogo da Velha')).toBeTruthy();
});
