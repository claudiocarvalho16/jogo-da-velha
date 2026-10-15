import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Blocos de anúncio do app. Por enquanto são os blocos de teste do Google, que sempre
 * mostram anúncios de exemplo e não geram receita nem risco para a conta.
 *
 * Os blocos reais só entram quando o app for publicado, junto com os IDs do app no
 * plugin `react-native-google-mobile-ads` do `app.json`.
 */
export const AD_UNITS = {
  interstitial: TestIds.INTERSTITIAL,
  rewarded: TestIds.REWARDED,
};
