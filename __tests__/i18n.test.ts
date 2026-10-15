import { expect, test } from '@jest/globals';

import { STRINGS, pickLanguage } from '../src/i18n';
import { THEMES } from '../src/themes';

test('usa o primeiro idioma preferido que o app traduz', () => {
  expect(pickLanguage([{ languageCode: 'pt' }])).toBe('pt');
  expect(pickLanguage([{ languageCode: 'en' }])).toBe('en');
  expect(pickLanguage([{ languageCode: 'fr' }, { languageCode: 'pt' }])).toBe('pt');
});

test('cai para o inglês quando nenhum idioma do aparelho tem tradução', () => {
  expect(pickLanguage([{ languageCode: 'ja' }])).toBe('en');
  expect(pickLanguage([{ languageCode: null }])).toBe('en');
});

test('cada idioma dá nome a todos os temas', () => {
  for (const strings of Object.values(STRINGS)) {
    for (const id of Object.keys(THEMES)) {
      expect(strings.themeNames[id as keyof typeof THEMES]).toBeTruthy();
    }
  }
});
