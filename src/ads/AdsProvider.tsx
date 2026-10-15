import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { ADS_NOT_READY, AdsState, prepareAds, showPrivacyOptions } from './prepareAds';

type AdsContext = AdsState & {
  /** Abre o formulário de privacidade; só use quando `privacyOptionsRequired` for verdadeiro. */
  openPrivacyOptions: () => Promise<void>;
};

const Context = createContext<AdsContext>({ ...ADS_NOT_READY, openPrivacyOptions: async () => {} });

/** Pede o consentimento ao abrir o app e conta para as telas quando os anúncios estão liberados. */
export function AdsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdsState>(ADS_NOT_READY);

  useEffect(() => {
    let active = true;
    prepareAds()
      .then((next) => active && setState(next))
      .catch((error) => console.warn('Não foi possível preparar os anúncios', error));
    return () => {
      active = false;
    };
  }, []);

  const openPrivacyOptions = () =>
    showPrivacyOptions().catch((error) =>
      console.warn('Não foi possível abrir as opções de privacidade', error),
    );

  return <Context.Provider value={{ ...state, openPrivacyOptions }}>{children}</Context.Provider>;
}

export function useAds(): AdsContext {
  return useContext(Context);
}
