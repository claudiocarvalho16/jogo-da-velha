import { Difficulty } from './ai';
import { Board, Player, emptyBoard, getStatus, play } from './game';

export type Mode = 'dois-jogadores' | Difficulty;

export type Score = { X: number; O: number; empates: number };

export type Match = {
  mode: Mode;
  board: Board;
  first: Player;
  score: Score;
  /** Contra o celular: como estava antes de cada jogada da pessoa, para desfazer. */
  history: { board: Board; score: Score }[];
};

export type Action =
  | { type: 'play'; index: number }
  | { type: 'restart' }
  | { type: 'undo' }
  | { type: 'setMode'; mode: Mode };

/** No modo contra o celular, a pessoa joga com X e o celular com O. */
export const PHONE: Player = 'O';

export function newMatch(mode: Mode = 'dois-jogadores'): Match {
  return { mode, board: emptyBoard(), first: 'X', score: { X: 0, O: 0, empates: 0 }, history: [] };
}

export function isPhoneTurn(match: Match): boolean {
  const status = getStatus(match.board, match.first);
  return match.mode !== 'dois-jogadores' && status.kind === 'playing' && status.next === PHONE;
}

/**
 * Contra o celular, a pessoa pode desfazer a última jogada (e a resposta do celular)
 * enquanto a partida corre ou depois de perder ou empatar. Não faz sentido depois de vencer.
 */
export function canUndo(match: Match): boolean {
  if (match.mode === 'dois-jogadores' || match.history.length === 0 || isPhoneTurn(match)) {
    return false;
  }
  const status = getStatus(match.board, match.first);
  return !(status.kind === 'won' && status.winner !== PHONE);
}

export function matchReducer(match: Match, action: Action): Match {
  switch (action.type) {
    case 'play': {
      const board = play(match.board, action.index, match.first);
      if (board === match.board) {
        return match;
      }
      const status = getStatus(board, match.first);
      const score = { ...match.score };
      if (status.kind === 'won') {
        score[status.winner] += 1;
      } else if (status.kind === 'draw') {
        score.empates += 1;
      }
      const personMoved = match.mode !== 'dois-jogadores' && !isPhoneTurn(match);
      const history = personMoved
        ? [...match.history, { board: match.board, score: match.score }]
        : match.history;
      return { ...match, board, score, history };
    }
    case 'restart':
      // Quem começa alterna a cada partida.
      return { ...match, board: emptyBoard(), first: match.first === 'X' ? 'O' : 'X', history: [] };
    case 'undo': {
      if (!canUndo(match)) {
        return match;
      }
      const { board, score } = match.history[match.history.length - 1];
      return { ...match, board, score, history: match.history.slice(0, -1) };
    }
    case 'setMode':
      return newMatch(action.mode);
  }
}
