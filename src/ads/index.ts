import { SIMULATE_ADS } from './simulate';
import type * as Real from './real';

// `require` aqui é de propósito: o módulo que não é usado nem chega a ser carregado, e
// carregar `real` no Expo Go quebraria o app, porque o SDK do Google não existe lá.
const ads: typeof Real = SIMULATE_ADS ? require('./simulated') : require('./real');

export const { AdsProvider, useAds, useInterstitialBetweenRounds, useRewardedAction } = ads;
