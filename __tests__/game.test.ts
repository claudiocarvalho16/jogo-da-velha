import { describe, expect, test } from '@jest/globals';

import { Board, emptyBoard, getStatus, play } from '../src/game';

function playAll(moves: number[]): Board {
  return moves.reduce((board, index) => play(board, index), emptyBoard());
}

describe('getStatus', () => {
  test('X começa', () => {
    expect(getStatus(emptyBoard())).toEqual({ kind: 'playing', next: 'X' });
  });

  test('alterna entre X e O', () => {
    expect(getStatus(playAll([0]))).toEqual({ kind: 'playing', next: 'O' });
    expect(getStatus(playAll([0, 1]))).toEqual({ kind: 'playing', next: 'X' });
  });

  test('o primeiro jogador pode ser O', () => {
    expect(getStatus(emptyBoard(), 'O')).toEqual({ kind: 'playing', next: 'O' });
  });

  test.each([
    ['linha', [0, 3, 1, 4, 2], [0, 1, 2]],
    ['coluna', [0, 1, 3, 2, 6], [0, 3, 6]],
    ['diagonal', [0, 1, 4, 2, 8], [0, 4, 8]],
    ['diagonal inversa', [2, 0, 4, 1, 6], [2, 4, 6]],
  ])('X vence pela %s', (_name, moves, line) => {
    expect(getStatus(playAll(moves))).toEqual({ kind: 'won', winner: 'X', line });
  });

  test('O vence', () => {
    expect(getStatus(playAll([0, 3, 1, 4, 8, 5]))).toEqual({
      kind: 'won',
      winner: 'O',
      line: [3, 4, 5],
    });
  });

  test('empate com o tabuleiro cheio', () => {
    // X O X
    // X O O
    // O X X
    expect(getStatus(playAll([0, 1, 2, 4, 3, 5, 7, 6, 8]))).toEqual({ kind: 'draw' });
  });

  test('vitória na última casa não é empate', () => {
    // X O X
    // O O X
    // O X X  (X fecha a coluna da direita na nona jogada)
    const board = playAll([0, 1, 2, 3, 5, 4, 7, 6, 8]);
    expect(getStatus(board)).toEqual({ kind: 'won', winner: 'X', line: [2, 5, 8] });
  });
});

describe('play', () => {
  test('não deixa jogar em casa ocupada', () => {
    const board = playAll([4]);
    expect(play(board, 4)).toBe(board);
  });

  test('não deixa jogar depois que alguém venceu', () => {
    const board = playAll([0, 3, 1, 4, 2]);
    expect(play(board, 8)).toBe(board);
  });
});
