// O SDK de anúncios é nativo e não roda no Jest. Por padrão, o consentimento não é
// exigido e os anúncios ficam liberados; cada teste pode mudar isso.
import { jest } from '@jest/globals';

export const AdsConsentPrivacyOptionsRequirementStatus = {
  UNKNOWN: 'UNKNOWN',
  REQUIRED: 'REQUIRED',
  NOT_REQUIRED: 'NOT_REQUIRED',
} as const;

const consentInfo = {
  status: 'NOT_REQUIRED',
  canRequestAds: true,
  privacyOptionsRequirementStatus: AdsConsentPrivacyOptionsRequirementStatus.NOT_REQUIRED,
  isConsentFormAvailable: false,
};

export const AdsConsent = {
  gatherConsent: jest.fn(async () => consentInfo),
  getConsentInfo: jest.fn(async () => consentInfo),
  getGdprApplies: jest.fn(async () => false),
  getPurposeConsents: jest.fn(async () => ''),
  showPrivacyOptionsForm: jest.fn(async () => consentInfo),
};

const mobileAdsModule = {
  setRequestConfiguration: jest.fn(async () => {}),
  initialize: jest.fn(async () => []),
};

export default function mobileAds() {
  return mobileAdsModule;
}

export const MaxAdContentRating = { G: 'G', PG: 'PG', T: 'T', MA: 'MA' } as const;

export const TestIds = {
  INTERSTITIAL: 'test-interstitial',
  REWARDED: 'test-rewarded',
};

/** Estado de um anúncio de tela cheia; os testes trocam `status` para simular o SDK. */
export const mockFullScreenAd = {
  status: 'idle' as string,
  load: jest.fn(),
  retry: jest.fn(),
  show: jest.fn(),
};

export const useInterstitialAd = jest.fn(() => mockFullScreenAd);

/** Vídeo premiado: um objeto separado, para os testes controlarem cada formato. */
export const mockRewardedAd = {
  status: 'idle' as string,
  earnedReward: false,
  load: jest.fn(),
  retry: jest.fn(),
  show: jest.fn(),
};

export const useRewardedAd = jest.fn(() => mockRewardedAd);
