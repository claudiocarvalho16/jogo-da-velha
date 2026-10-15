/** Na web não há AdMob: o intersticial nunca aparece. */
export function useInterstitialBetweenRounds(_every?: number) {
  return { roundFinished: () => {} };
}
