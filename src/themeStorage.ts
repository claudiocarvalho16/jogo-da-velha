import { Storage } from 'expo-sqlite/kv-store';

import { DEFAULT_THEME, THEMES, ThemeId } from './themes';

const KEY = 'tema';

function isThemeId(value: string | null): value is ThemeId {
  return value !== null && value in THEMES;
}

/** Tema salvo na última vez; o Clássico se não houver nenhum ou se a leitura falhar. */
export function loadThemeId(): ThemeId {
  try {
    const saved = Storage.getItemSync(KEY);
    return isThemeId(saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveThemeId(id: ThemeId): void {
  try {
    Storage.setItemSync(KEY, id);
  } catch {
    // Sem salvar, o tema vale só até fechar o app.
  }
}
