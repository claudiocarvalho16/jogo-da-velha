/** Na web não há AdMob: nunca há vídeo premiado pronto. */
export function useRewardedAction() {
  return { ready: false, watch: (_onReward: () => void) => {} };
}
