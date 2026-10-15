import { Locale } from 'expo-localization';

import { ThemeId } from './themes';

export type Language = 'en' | 'pt';

/** Idioma usado quando o do aparelho não é um dos traduzidos. */
export const DEFAULT_LANGUAGE: Language = 'en';

export type Strings = {
  title: string;
  modes: { twoPlayers: string; easy: string; unbeatable: string };
  themeNames: Record<ThemeId, string>;
  themeButton: (name: string) => string;
  themeButtonLabel: (name: string) => string;
  you: string;
  phone: string;
  draws: string;
  youWon: string;
  phoneWon: string;
  playerWon: (mark: string) => string;
  draw: string;
  phoneThinking: string;
  yourTurn: (mark: string) => string;
  turnOf: (mark: string) => string;
  cellLabel: (number: number, mark: string | null) => string;
  newGame: string;
  pickTheme: string;
  themeOption: (name: string) => string;
  inUse: string;
  backToGame: string;
  privacyOptions: string;
  undoWithVideo: string;
};

export const STRINGS: Record<Language, Strings> = {
  en: {
    title: 'Tic Tac Toe',
    modes: { twoPlayers: '2 players', easy: 'Easy', unbeatable: 'Unbeatable' },
    themeNames: { classico: 'Classic', espaco: 'Space', doces: 'Sweets', futebol: 'Soccer' },
    themeButton: (name) => `Theme: ${name}`,
    themeButtonLabel: (name) => `Theme: ${name}. Change theme`,
    you: 'You',
    phone: 'Phone',
    draws: 'Draws',
    youWon: 'You won!',
    phoneWon: 'The phone won!',
    playerWon: (mark) => `${mark} wins!`,
    draw: "It's a draw!",
    phoneThinking: 'The phone is thinking…',
    yourTurn: (mark) => `Your turn (${mark})`,
    turnOf: (mark) => `${mark}'s turn`,
    cellLabel: (number, mark) => `Square ${number}, ${mark ?? 'empty'}`,
    newGame: 'New game',
    pickTheme: 'Choose a theme',
    themeOption: (name) => `Theme ${name}`,
    inUse: 'In use',
    backToGame: 'Back to the game',
    privacyOptions: 'Privacy options',
    undoWithVideo: 'Undo move (watch a video)',
  },
  pt: {
    title: 'Jogo da Velha',
    modes: { twoPlayers: '2 jogadores', easy: 'Fácil', unbeatable: 'Imbatível' },
    themeNames: { classico: 'Clássico', espaco: 'Espaço', doces: 'Doces', futebol: 'Futebol' },
    themeButton: (name) => `Tema: ${name}`,
    themeButtonLabel: (name) => `Tema: ${name}. Trocar tema`,
    you: 'Você',
    phone: 'Celular',
    draws: 'Empates',
    youWon: 'Você venceu!',
    phoneWon: 'O celular venceu!',
    playerWon: (mark) => `${mark} venceu!`,
    draw: 'Deu velha! Empate.',
    phoneThinking: 'O celular está pensando…',
    yourTurn: (mark) => `Sua vez (${mark})`,
    turnOf: (mark) => `Vez de ${mark}`,
    cellLabel: (number, mark) => `Casa ${number}, ${mark ?? 'vazia'}`,
    newGame: 'Nova partida',
    pickTheme: 'Escolha o tema',
    themeOption: (name) => `Tema ${name}`,
    inUse: 'Em uso',
    backToGame: 'Voltar ao jogo',
    privacyOptions: 'Opções de privacidade',
    undoWithVideo: 'Desfazer jogada (assistir vídeo)',
  },
};

/** Escolhe o primeiro idioma preferido do aparelho que o app traduz. */
export function pickLanguage(locales: Pick<Locale, 'languageCode'>[]): Language {
  for (const { languageCode } of locales) {
    if (languageCode === 'en' || languageCode === 'pt') {
      return languageCode;
    }
  }
  return DEFAULT_LANGUAGE;
}
