// Contorna um defeito do react-native-google-mobile-ads 17.2.0 no Android: o build.gradle
// da biblioteca lê `rootProject.ext.googleMobileAdsJson`, que só existe quando o script
// dela consegue ler o bloco da biblioteca no app.json. Quando não consegue, o build falha
// com "Cannot get property 'googleMobileAdsJson'". Com a propriedade abaixo definida no
// gradle.properties, a biblioteca escolhe o SDK sem precisar dessa leitura.
const { withGradleProperties } = require('expo/config-plugins');

const KEY = 'RNGMA_ANDROID_BACKEND';

module.exports = function withGoogleMobileAdsAndroidBackend(config) {
  return withGradleProperties(config, (config) => {
    config.modResults = config.modResults.filter(
      (item) => !(item.type === 'property' && item.key === KEY),
    );
    config.modResults.push({ type: 'property', key: KEY, value: 'classic' });
    return config;
  });
};
