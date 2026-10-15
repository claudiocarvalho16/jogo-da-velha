import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import mobileAds, {
  AdsConsent,
  AdsConsentInfo,
  AdsConsentPrivacyOptionsRequirementStatus,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';

export type AdsState = {
  /** O SDK foi iniciado e o consentimento permite pedir anúncios. */
  canRequestAds: boolean;
  /** A pessoa precisa ter um botão para rever o consentimento (por exemplo, na Europa). */
  privacyOptionsRequired: boolean;
};

export const ADS_NOT_READY: AdsState = { canRequestAds: false, privacyOptionsRequired: false };

let preparing: Promise<AdsState> | undefined;

/**
 * Pede o consentimento do Google (GDPR e leis dos EUA), depois o aviso de rastreamento
 * do iOS (ATT), e só então inicia o SDK de anúncios. Roda uma vez por abertura do app.
 */
export function prepareAds(): Promise<AdsState> {
  preparing ??= gatherConsentAndStart();
  return preparing;
}

async function gatherConsentAndStart(): Promise<AdsState> {
  let info: AdsConsentInfo;
  try {
    info = await AdsConsent.gatherConsent();
  } catch {
    // Sem rede, por exemplo. O SDK reaproveita o consentimento da última vez.
    info = await AdsConsent.getConsentInfo();
  }

  if (await mayAskForTracking()) {
    // O aviso só aparece no iOS, e só na primeira vez; fora isso a função apenas
    // devolve a resposta (no Android, sempre "permitido").
    await requestTrackingPermissionsAsync();
  }

  const state: AdsState = {
    canRequestAds: info.canRequestAds,
    privacyOptionsRequired:
      info.privacyOptionsRequirementStatus === AdsConsentPrivacyOptionsRequirementStatus.REQUIRED,
  };
  if (!state.canRequestAds) {
    return state;
  }

  // Público geral: o app não é para crianças, mas evita anúncios adultos.
  await mobileAds().setRequestConfiguration({ maxAdContentRating: MaxAdContentRating.T });
  await mobileAds().initialize();
  return state;
}

/**
 * Onde o GDPR vale, o aviso do iOS só faz sentido se a pessoa aceitou guardar dados no
 * aparelho (propósito 1). Se recusou, perguntar de novo seria insistir no que ela já negou.
 */
async function mayAskForTracking(): Promise<boolean> {
  if (!(await AdsConsent.getGdprApplies())) {
    return true;
  }
  const purposes = await AdsConsent.getPurposeConsents();
  return purposes.startsWith('1');
}

/** Abre o formulário do Google para a pessoa mudar o consentimento dado. */
export async function showPrivacyOptions(): Promise<void> {
  await AdsConsent.showPrivacyOptionsForm();
}
