import { Player } from './game';

export type ThemeId = 'classico';

export type Theme = {
  id: ThemeId;
  name: string;
  /** Estilo dos ícones da barra de status: 'dark' em fundos claros, 'light' em fundos escuros. */
  statusBar: 'dark' | 'light';
  /** O que aparece na casa para cada jogador. */
  marks: Record<Player, string>;
  colors: {
    background: string;
    board: string;
    cell: string;
    cellPressed: string;
    highlight: string;
    text: string;
    muted: string;
    modes: string;
    buttonText: string;
    X: string;
    O: string;
  };
};

export const THEMES: Record<ThemeId, Theme> = {
  classico: {
    id: 'classico',
    name: 'Clássico',
    statusBar: 'dark',
    marks: { X: 'X', O: 'O' },
    colors: {
      background: '#f6f1e9',
      board: '#2f2a24',
      cell: '#fffdf9',
      cellPressed: '#efe8dc',
      highlight: '#ffe58a',
      text: '#2f2a24',
      muted: '#8a8175',
      modes: '#e8e0d4',
      buttonText: '#fff',
      X: '#1e6fd9',
      O: '#e0482b',
    },
  },
};

export const DEFAULT_THEME: ThemeId = 'classico';
