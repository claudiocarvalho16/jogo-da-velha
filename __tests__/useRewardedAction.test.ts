import { beforeEach, expect, jest, test } from '@jest/globals';
import { act, renderHook } from '@testing-library/react-native';
// @ts-expect-error: só existe na versão falsa do SDK, em __mocks__.
import { mockRewardedAd as ad } from 'react-native-google-mobile-ads';

import { REWARDED_RETRY_MS, useRewardedAction } from '../src/ads/useRewardedAction';
import { AdsProvider } from '../src/ads/AdsProvider';

beforeEach(() => {
  jest.clearAllMocks();
  ad.status = 'loaded';
  ad.earnedReward = false;
});

test('só está pronto quando há um vídeo carregado', async () => {
  const { result, rerender } = await renderHook(() => useRewardedAction());
  expect(result.current.ready).toBe(true);
  ad.status = 'loading';
  await rerender({});
  expect(result.current.ready).toBe(false);
});

test('dá o prêmio quando o vídeo é fechado depois de assistido, e carrega outro', async () => {
  const onReward = jest.fn();
  const { result, rerender } = await renderHook(() => useRewardedAction());
  await act(async () => result.current.watch(onReward));
  expect(ad.show).toHaveBeenCalledTimes(1);

  ad.status = 'closed';
  ad.earnedReward = true;
  await rerender({});
  expect(onReward).toHaveBeenCalledTimes(1);
  expect(ad.load).toHaveBeenCalledTimes(1);
});

test('sem assistir até o fim, não há prêmio', async () => {
  const onReward = jest.fn();
  const { result, rerender } = await renderHook(() => useRewardedAction());
  await act(async () => result.current.watch(onReward));
  ad.status = 'closed';
  await rerender({});
  expect(onReward).not.toHaveBeenCalled();
});

test('sem vídeo disponível, tenta de novo depois de um tempo', async () => {
  jest.useFakeTimers();
  try {
    ad.status = 'no-fill';
    // O AdsProvider libera os anúncios depois do consentimento (falso nos testes).
    await renderHook(() => useRewardedAction(), { wrapper: AdsProvider });
    await act(async () => {});
    expect(ad.retry).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(REWARDED_RETRY_MS);
    });
    expect(ad.retry).toHaveBeenCalledTimes(1);
  } finally {
    jest.useRealTimers();
  }
});
