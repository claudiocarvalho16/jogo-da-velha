import { ReactNode } from 'react';

/** Na web não há AdMob: os anúncios ficam sempre desligados. */
export function AdsProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useAds() {
  return { canRequestAds: false, privacyOptionsRequired: false, openPrivacyOptions: async () => {} };
}
