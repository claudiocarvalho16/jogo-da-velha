export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

export type Status =
  | { kind: 'playing'; next: Player }
  | { kind: 'won'; winner: Player; line: number[] }
  | { kind: 'draw' };

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function emptyBoard(): Board {
  return Array(9).fill(null);
}

export function getStatus(board: Board, first: Player = 'X'): Status {
  for (const line of LINES) {
    const [a, b, c] = line;
    const cell = board[a];
    if (cell && cell === board[b] && cell === board[c]) {
      return { kind: 'won', winner: cell, line };
    }
  }
  const filled = board.filter(Boolean).length;
  if (filled === board.length) {
    return { kind: 'draw' };
  }
  const second: Player = first === 'X' ? 'O' : 'X';
  return { kind: 'playing', next: filled % 2 === 0 ? first : second };
}

/** Retorna o novo tabuleiro, ou o mesmo se a jogada não for válida. */
export function play(board: Board, index: number, first: Player = 'X'): Board {
  const status = getStatus(board, first);
  if (status.kind !== 'playing' || board[index] !== null) {
    return board;
  }
  const next = board.slice();
  next[index] = status.next;
  return next;
}
