import { Difficulty } from './ai';
import { Board, Player, emptyBoard, getStatus, play } from './game';

export type Mode = 'dois-jogadores' | Difficulty;

export type Score = { X: number; O: number; empates: number };

export type Match = {
  mode: Mode;
  board: Board;
  first: Player;
  score: Score;
};

export type Action =
  | { type: 'play'; index: number }
  | { type: 'restart' }
  | { type: 'setMode'; mode: Mode };

/** No modo contra o celular, a pessoa joga com X e o celular com O. */
export const PHONE: Player = 'O';

export function newMatch(mode: Mode = 'dois-jogadores'): Match {
  return { mode, board: emptyBoard(), first: 'X', score: { X: 0, O: 0, empates: 0 } };
}

export function isPhoneTurn(match: Match): boolean {
  const status = getStatus(match.board, match.first);
  return match.mode !== 'dois-jogadores' && status.kind === 'playing' && status.next === PHONE;
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
      return { ...match, board, score };
    }
    case 'restart':
      // Quem começa alterna a cada partida.
      return { ...match, board: emptyBoard(), first: match.first === 'X' ? 'O' : 'X' };
    case 'setMode':
      return newMatch(action.mode);
  }
}
