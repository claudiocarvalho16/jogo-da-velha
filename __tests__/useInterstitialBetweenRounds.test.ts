import { beforeEach, expect, jest, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
// @ts-expect-error: só existe na versão falsa do SDK, em __mocks__.
import { mockFullScreenAd as ad } from 'react-native-google-mobile-ads';

import { useInterstitialBetweenRounds } from '../src/ads/useInterstitialBetweenRounds';

beforeEach(() => {
  jest.clearAllMocks();
  ad.status = 'loaded';
});

async function finishRounds(roundFinished: () => void, count: number) {
  for (let i = 0; i < count; i++) {
    await act(async () => roundFinished());
  }
}

test('mostra o intersticial a cada 3 partidas, nunca antes', async () => {
  const { result } = await renderHook(() => useInterstitialBetweenRounds());
  await finishRounds(result.current.roundFinished, 2);
  expect(ad.show).not.toHaveBeenCalled();

  await finishRounds(result.current.roundFinished, 1);
  expect(ad.show).toHaveBeenCalledTimes(1);

  await finishRounds(result.current.roundFinished, 2);
  expect(ad.show).toHaveBeenCalledTimes(1);
  await finishRounds(result.current.roundFinished, 1);
  expect(ad.show).toHaveBeenCalledTimes(2);
});

test('se o anúncio ainda não carregou, mostra na próxima partida em que estiver pronto', async () => {
  ad.status = 'loading';
  const { result, rerender } = await renderHook(() => useInterstitialBetweenRounds());
  await finishRounds(result.current.roundFinished, 3);
  expect(ad.show).not.toHaveBeenCalled();

  ad.status = 'loaded';
  await rerender({});
  await finishRounds(result.current.roundFinished, 1);
  expect(ad.show).toHaveBeenCalledTimes(1);
});

test('sem anúncio disponível, tenta carregar de novo ao fim da partida', async () => {
  ad.status = 'no-fill';
  const { result } = await renderHook(() => useInterstitialBetweenRounds());
  await finishRounds(result.current.roundFinished, 1);
  expect(ad.retry).toHaveBeenCalledTimes(1);
  expect(ad.show).not.toHaveBeenCalled();
});

test('carrega o próximo depois que o anúncio é fechado', async () => {
  ad.status = 'closed';
  await renderHook(() => useInterstitialBetweenRounds());
  expect(ad.load).toHaveBeenCalledTimes(1);
});
