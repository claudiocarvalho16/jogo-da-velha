import { expect, test } from '@jest/globals';

import { DEFAULT_THEME, THEMES } from '../src/themes';

test('o tema padrão existe e é o Clássico', () => {
  expect(THEMES[DEFAULT_THEME].id).toBe('classico');
});

test('cada tema tem símbolos e cores diferentes para X e O', () => {
  for (const [id, theme] of Object.entries(THEMES)) {
    expect(theme.id).toBe(id);
    expect(theme.marks.X).not.toBe(theme.marks.O);
    expect(theme.colors.X).not.toBe(theme.colors.O);
  }
});
