import { useCallback, useEffect, useRef } from 'react';
import { useInterstitialAd } from 'react-native-google-mobile-ads';

import { AD_UNITS } from './adUnits';
import { useAds } from './AdsProvider';

/** Quantas partidas terminadas entre um intersticial e outro. */
export const ROUNDS_BETWEEN_INTERSTITIALS = 3;

/**
 * Intersticial entre partidas: chame `roundFinished()` quando a pessoa sai de uma partida
 * terminada (por exemplo, ao tocar em "Nova partida"). O anúncio aparece a cada
 * `every` partidas, nunca na primeira e nunca no meio de uma partida.
 */
export function useInterstitialBetweenRounds(every = ROUNDS_BETWEEN_INTERSTITIALS) {
  const { canRequestAds } = useAds();
  const ad = useInterstitialAd({ adUnitId: AD_UNITS.interstitial, autoLoad: canRequestAds });
  const { status, load, retry, show } = ad;
  const rounds = useRef(0);

  // Depois de fechado, já deixa o próximo carregado.
  useEffect(() => {
    if (status === 'closed') {
      load();
    }
  }, [status, load]);

  const roundFinished = useCallback(() => {
    rounds.current += 1;
    if (status === 'no-fill' || status === 'error') {
      // O SDK não tenta de novo sozinho; uma tentativa por partida evita insistir demais.
      retry();
      return;
    }
    if (rounds.current >= every && status === 'loaded') {
      rounds.current = 0;
      show();
    }
  }, [every, status, retry, show]);

  return { roundFinished };
}
