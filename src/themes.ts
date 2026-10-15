import { Player } from './game';

export type ThemeId = 'classico' | 'espaco' | 'doces' | 'futebol';

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
  espaco: {
    id: 'espaco',
    name: 'Espaço',
    statusBar: 'light',
    marks: { X: '🚀', O: '👾' },
    colors: {
      background: '#0b1026',
      board: '#3a3f8f',
      cell: '#161c44',
      cellPressed: '#222a5e',
      highlight: '#6b4fd8',
      text: '#eef0ff',
      muted: '#9aa0d0',
      modes: '#1c2350',
      buttonText: '#fff',
      X: '#5ec8ff',
      O: '#7dff9a',
    },
  },
  doces: {
    id: 'doces',
    name: 'Doces',
    statusBar: 'dark',
    marks: { X: '🧁', O: '🍭' },
    colors: {
      background: '#fff0f6',
      board: '#e88fb4',
      cell: '#fffafc',
      cellPressed: '#ffe3ef',
      highlight: '#c8f0dc',
      text: '#7a2e52',
      muted: '#9a5f7c',
      modes: '#fbd9e8',
      buttonText: '#fff',
      X: '#d6457f',
      O: '#8a5ad6',
    },
  },
  futebol: {
    id: 'futebol',
    name: 'Futebol',
    statusBar: 'light',
    marks: { X: '⚽', O: '👟' },
    colors: {
      background: '#1f7a3a',
      board: '#f4f4f0',
      cell: '#2e9a4c',
      cellPressed: '#38ad58',
      highlight: '#f5d33b',
      text: '#ffffff',
      muted: '#bfe6c9',
      modes: '#186330',
      buttonText: '#1f7a3a',
      X: '#ffffff',
      O: '#f5d33b',
    },
  },
};

export const DEFAULT_THEME: ThemeId = 'classico';
