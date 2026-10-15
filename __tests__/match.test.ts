import { describe, expect, test } from '@jest/globals';

import { Action, Match, isPhoneTurn, matchReducer, newMatch } from '../src/match';

function run(match: Match, actions: Action[]): Match {
  return actions.reduce(matchReducer, match);
}

const moves = (...indexes: number[]): Action[] =>
  indexes.map((index) => ({ type: 'play', index }));

describe('placar', () => {
  test('conta vitórias e empates', () => {
    let match = run(newMatch(), moves(0, 3, 1, 4, 2)); // X vence
    expect(match.score).toEqual({ X: 1, O: 0, empates: 0 });

    match = run(match, [{ type: 'restart' }, ...moves(0, 3, 1, 4, 2)]); // O começa e vence
    expect(match.score).toEqual({ X: 1, O: 1, empates: 0 });

    match = run(match, [{ type: 'restart' }, ...moves(0, 1, 2, 4, 3, 5, 7, 6, 8)]); // empate
    expect(match.score).toEqual({ X: 1, O: 1, empates: 1 });
  });

  test('jogada inválida não muda nada', () => {
    const match = run(newMatch(), moves(0, 3, 1, 4, 2));
    expect(matchReducer(match, { type: 'play', index: 8 })).toBe(match);
  });

  test('trocar de modo zera o placar', () => {
    const match = run(newMatch(), [...moves(0, 3, 1, 4, 2), { type: 'setMode', mode: 'facil' }]);
    expect(match).toEqual(newMatch('facil'));
  });
});

describe('isPhoneTurn', () => {
  test('é a vez do celular quando ele joga com O', () => {
    const match = run(newMatch('imbativel'), moves(4));
    expect(isPhoneTurn(match)).toBe(true);
  });

  test('nunca é a vez do celular no modo dois jogadores', () => {
    expect(isPhoneTurn(run(newMatch(), moves(4)))).toBe(false);
  });

  test('o celular começa na partida em que O começa', () => {
    const match = run(newMatch('facil'), [{ type: 'restart' }]);
    expect(isPhoneTurn(match)).toBe(true);
  });
});
