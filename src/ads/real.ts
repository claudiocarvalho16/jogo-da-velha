// Os anúncios de verdade, com o SDK do Google. Só são carregados quando o SDK existe
// no app; no Expo Go, `index.ts` usa `simulated.tsx` no lugar.
export { AdsProvider, useAds } from './AdsProvider';
export { useInterstitialBetweenRounds } from './useInterstitialBetweenRounds';
export { useRewardedAction } from './useRewardedAction';
