import { describe, expect, test } from '@jest/globals';

import { chooseMove } from '../src/ai';
import { Board, Player, emptyBoard, getStatus, play } from '../src/game';

function playAll(moves: number[]): Board {
  return moves.reduce((board, index) => play(board, index), emptyBoard());
}

describe('imbatível', () => {
  test('completa a própria linha para vencer', () => {
    // X X .
    // O O .
    // X . .   vez de O, que vence na casa 5
    const board = playAll([0, 3, 1, 4, 6]);
    expect(chooseMove(board, 'X', 'imbativel')).toBe(5);
  });

  test('bloqueia a vitória do adversário', () => {
    // X X .
    // . O .
    // . . .   vez de O, que precisa bloquear a casa 2
    const board = playAll([0, 4, 1]);
    expect(chooseMove(board, 'X', 'imbativel')).toBe(2);
  });

  test('nunca perde, contra qualquer sequência de jogadas', () => {
    // Explora todas as partidas possíveis em que o celular joga com O,
    // começando ele ou a pessoa.
    let games = 0;
    function explore(board: Board, first: Player) {
      const status = getStatus(board, first);
      if (status.kind === 'won') {
        expect(status.winner).toBe('O');
        games += 1;
        return;
      }
      if (status.kind === 'draw') {
        games += 1;
        return;
      }
      if (status.next === 'O') {
        explore(play(board, chooseMove(board, first, 'imbativel'), first), first);
        return;
      }
      board.forEach((cell, index) => {
        if (cell === null) {
          explore(play(board, index, first), first);
        }
      });
    }
    explore(emptyBoard(), 'X');
    explore(emptyBoard(), 'O');
    expect(games).toBeGreaterThan(0);
  });
});

describe('fácil', () => {
  test('escolhe uma casa vazia usando o sorteio', () => {
    const board = playAll([0, 1, 2]);
    // Casas vazias: 3, 4, 5, 6, 7, 8
    expect(chooseMove(board, 'X', 'facil', () => 0)).toBe(3);
    expect(chooseMove(board, 'X', 'facil', () => 0.99)).toBe(8);
  });
});

test('não escolhe jogada com a partida encerrada', () => {
  expect(() => chooseMove(playAll([0, 3, 1, 4, 2]), 'X', 'imbativel')).toThrow();
});
