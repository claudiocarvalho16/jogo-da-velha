import { useCallback, useEffect, useRef } from 'react';
import { useRewardedAd } from 'react-native-google-mobile-ads';

import { AD_UNITS } from './adUnits';
import { useAds } from './AdsProvider';

/** Espera antes de pedir outro vídeo quando não veio nenhum, para não insistir demais. */
export const REWARDED_RETRY_MS = 60_000;

/**
 * Vídeo premiado: a pessoa escolhe assistir a um vídeo em troca de algo no jogo.
 * `ready` diz se há um vídeo pronto (mostre o botão só nesse caso), e `watch(onReward)`
 * mostra o vídeo e chama `onReward` quando ele é fechado, se a pessoa assistiu até o fim.
 */
export function useRewardedAction() {
  const { canRequestAds } = useAds();
  const ad = useRewardedAd({ adUnitId: AD_UNITS.rewarded, autoLoad: canRequestAds });
  const { status, earnedReward, load, retry, show } = ad;
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (status !== 'closed') {
      return;
    }
    const onReward = pending.current;
    pending.current = null;
    if (earnedReward) {
      onReward?.();
    }
    // Carregar de novo zera `earnedReward`, por isso vem depois de ler o prêmio.
    load();
  }, [status, earnedReward, load]);

  useEffect(() => {
    if (!canRequestAds || (status !== 'no-fill' && status !== 'error')) {
      return;
    }
    const timer = setTimeout(retry, REWARDED_RETRY_MS);
    return () => clearTimeout(timer);
  }, [canRequestAds, status, retry]);

  const watch = useCallback(
    (onReward: () => void) => {
      if (status !== 'loaded') {
        return;
      }
      pending.current = onReward;
      show();
    },
    [status, show],
  );

  return { ready: status === 'loaded', watch };
}
