import { Board, Player, getStatus } from './game';

export type Difficulty = 'facil' | 'imbativel';

function emptyCells(board: Board): number[] {
  return board.flatMap((cell, index) => (cell === null ? [index] : []));
}

/**
 * Pontuação do tabuleiro do ponto de vista de `me`, supondo jogo perfeito dos dois lados.
 * `memo` guarda posições já calculadas: sem ele, a primeira jogada com o tabuleiro vazio
 * percorre centenas de milhares de partidas e trava o celular por alguns segundos.
 */
function minimax(
  board: Board,
  me: Player,
  first: Player,
  depth: number,
  memo: Map<string, number>,
): number {
  const key = board.map((cell) => cell ?? '-').join('');
  const cached = memo.get(key);
  if (cached !== undefined) {
    return cached;
  }
  const score = evaluate(board, me, first, depth, memo);
  memo.set(key, score);
  return score;
}

function evaluate(
  board: Board,
  me: Player,
  first: Player,
  depth: number,
  memo: Map<string, number>,
): number {
  const status = getStatus(board, first);
  if (status.kind === 'won') {
    // Vencer mais cedo vale mais; perder mais tarde dói menos.
    return status.winner === me ? 10 - depth : depth - 10;
  }
  if (status.kind === 'draw') {
    return 0;
  }
  const scores = emptyCells(board).map((index) => {
    const next = board.slice();
    next[index] = status.next;
    return minimax(next, me, first, depth + 1, memo);
  });
  return status.next === me ? Math.max(...scores) : Math.min(...scores);
}

/** Escolhe a casa onde o jogador da vez deve jogar. */
export function chooseMove(
  board: Board,
  first: Player,
  difficulty: Difficulty,
  random: () => number = Math.random,
): number {
  const status = getStatus(board, first);
  if (status.kind !== 'playing') {
    throw new Error('A partida já terminou');
  }
  const cells = emptyCells(board);
  if (difficulty === 'facil') {
    return cells[Math.floor(random() * cells.length)];
  }
  const me = status.next;
  // A profundidade depende só de quantas casas estão ocupadas, então a mesma
  // posição sempre tem a mesma pontuação dentro desta chamada.
  const memo = new Map<string, number>();
  let best = cells[0];
  let bestScore = -Infinity;
  for (const index of cells) {
    const next = board.slice();
    next[index] = me;
    const score = minimax(next, me, first, 1, memo);
    if (score > bestScore) {
      best = index;
      bestScore = score;
    }
  }
  return best;
}
