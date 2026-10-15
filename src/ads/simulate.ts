import { TurboModuleRegistry } from 'react-native';

/**
 * O SDK de anúncios é código nativo: não existe no Expo Go, nem em builds feitos sem ele.
 * Nesses casos o app mostra telas falsas de anúncio, para dar para testar o jogo.
 */
export const SIMULATE_ADS = TurboModuleRegistry.get('RNGoogleMobileAdsModule') == null;
