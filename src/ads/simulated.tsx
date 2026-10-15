import { ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ROUNDS_BETWEEN_INTERSTITIALS } from './constants';
import type * as Real from './real';

// Anúncios simulados, para testar o jogo onde o SDK do Google não existe (Expo Go).
// Têm as mesmas funções que `real.ts`, mas mostram uma tela falsa no lugar do anúncio.
// Ficam fora do SDK de propósito: nada aqui pode importar `react-native-google-mobile-ads`.

type FakeAd = {
  kind: 'interstitial' | 'rewarded';
  /** `earned` é verdadeiro quando a pessoa "assistiu até o fim" um vídeo premiado. */
  onClose: (earned: boolean) => void;
};

const ShowFakeAd = createContext<(ad: FakeAd) => void>(() => {});

const ADS = { canRequestAds: true, privacyOptionsRequired: false, openPrivacyOptions: async () => {} };

export const AdsProvider: typeof Real.AdsProvider = ({ children }: { children: ReactNode }) => {
  const [shown, setShown] = useState<FakeAd | null>(null);

  const close = (earned: boolean) => {
    setShown(null);
    shown?.onClose(earned);
  };

  return (
    <ShowFakeAd.Provider value={setShown}>
      {children}
      <Modal visible={shown !== null} animationType="fade" onRequestClose={() => close(false)}>
        <View style={styles.screen}>
          <Text style={styles.badge}>Anúncio simulado · Simulated ad</Text>
          <Text style={styles.title}>{shown?.kind === 'rewarded' ? '▶ Vídeo premiado' : 'Intersticial'}</Text>
          <Text style={styles.note}>
            Tela de teste do Expo Go. Em um build com o SDK, aqui aparece um anúncio do Google.
          </Text>
          {shown?.kind === 'rewarded' ? (
            <>
              <Button label="Assistir até o fim · Watch to the end" onPress={() => close(true)} />
              <Button label="Fechar antes · Close early" onPress={() => close(false)} />
            </>
          ) : (
            <Button label="Fechar · Close" onPress={() => close(false)} />
          )}
        </View>
      </Modal>
    </ShowFakeAd.Provider>
  );
};

function Button({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export const useAds: typeof Real.useAds = () => ADS;

export const useInterstitialBetweenRounds: typeof Real.useInterstitialBetweenRounds = (
  every = ROUNDS_BETWEEN_INTERSTITIALS,
) => {
  const show = useContext(ShowFakeAd);
  const rounds = useRef(0);

  const roundFinished = useCallback(() => {
    rounds.current += 1;
    if (rounds.current >= every) {
      rounds.current = 0;
      show({ kind: 'interstitial', onClose: () => {} });
    }
  }, [every, show]);

  return { roundFinished };
};

export const useRewardedAction: typeof Real.useRewardedAction = () => {
  const show = useContext(ShowFakeAd);

  const watch = useCallback(
    (onReward: () => void) =>
      show({ kind: 'rewarded', onClose: (earned) => earned && onReward() }),
    [show],
  );

  return useMemo(() => ({ ready: true, watch }), [watch]);
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#1d1d2b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  badge: { color: '#f5d33b', fontSize: 14, fontWeight: '700' },
  title: { color: '#fff', fontSize: 28, fontWeight: '800' },
  note: { color: '#b8b8cc', fontSize: 15, textAlign: 'center' },
  button: { backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  buttonText: { color: '#1d1d2b', fontSize: 16, fontWeight: '700' },
});
