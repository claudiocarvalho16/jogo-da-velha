import { expect, jest, test } from '@jest/globals';

import type { AdsState } from '../src/ads/prepareAds';

type Mock = jest.Mock<(...args: any[]) => any>;

function info(canRequestAds: boolean, privacyOptions: 'REQUIRED' | 'NOT_REQUIRED' = 'NOT_REQUIRED') {
  return { status: 'OBTAINED', canRequestAds, privacyOptionsRequirementStatus: privacyOptions, isConsentFormAvailable: true };
}

/**
 * `prepareAds` roda uma vez por abertura do app, então cada teste carrega o módulo do zero,
 * junto com as versões falsas do SDK que esse módulo enxerga.
 */
function load() {
  let modules!: {
    prepareAds: () => Promise<AdsState>;
    consent: Record<string, Mock>;
    sdk: Record<string, Mock>;
    askTracking: Mock;
  };
  jest.isolateModules(() => {
    const ads = require('react-native-google-mobile-ads');
    modules = {
      prepareAds: require('../src/ads/prepareAds').prepareAds,
      consent: ads.AdsConsent,
      sdk: ads.default(),
      askTracking: require('expo-tracking-transparency').requestTrackingPermissionsAsync,
    };
  });
  return modules;
}

test('com consentimento, inicia o SDK depois do aviso de rastreamento', async () => {
  const { prepareAds, consent, sdk, askTracking } = load();
  consent.gatherConsent.mockResolvedValueOnce(info(true));
  expect(await prepareAds()).toEqual({ canRequestAds: true, privacyOptionsRequired: false });
  expect(askTracking).toHaveBeenCalledTimes(1);
  expect(sdk.initialize).toHaveBeenCalledTimes(1);
  expect(askTracking.mock.invocationCallOrder[0]).toBeLessThan(sdk.initialize.mock.invocationCallOrder[0]);
});

test('sem consentimento, não inicia o SDK', async () => {
  const { prepareAds, consent, sdk } = load();
  consent.gatherConsent.mockResolvedValueOnce(info(false));
  expect((await prepareAds()).canRequestAds).toBe(false);
  expect(sdk.initialize).not.toHaveBeenCalled();
});

test('avisa quando a lei pede o botão de privacidade', async () => {
  const { prepareAds, consent } = load();
  consent.gatherConsent.mockResolvedValueOnce(info(true, 'REQUIRED'));
  expect((await prepareAds()).privacyOptionsRequired).toBe(true);
});

test('onde vale o GDPR e a pessoa recusou guardar dados, não mostra o aviso de rastreamento', async () => {
  const { prepareAds, consent, askTracking } = load();
  consent.getGdprApplies.mockResolvedValueOnce(true);
  consent.getPurposeConsents.mockResolvedValueOnce('0111');
  await prepareAds();
  expect(askTracking).not.toHaveBeenCalled();
});

test('se o formulário falhar, usa o consentimento da última vez', async () => {
  const { prepareAds, consent } = load();
  consent.gatherConsent.mockRejectedValueOnce(new Error('sem rede'));
  consent.getConsentInfo.mockResolvedValueOnce(info(true));
  expect((await prepareAds()).canRequestAds).toBe(true);
});

test('roda uma vez só por abertura do app', async () => {
  const { prepareAds, consent } = load();
  await Promise.all([prepareAds(), prepareAds()]);
  expect(consent.gatherConsent).toHaveBeenCalledTimes(1);
});
