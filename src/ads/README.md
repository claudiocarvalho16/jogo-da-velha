# Anúncios e consentimento

Módulo pensado para ser copiado para os próximos jogos. Ele não depende de nada do
jogo da velha.

## O que ele faz

Ao abrir o app, `AdsProvider`:

1. mostra o formulário de consentimento do Google quando a lei pede (Europa, alguns
   estados dos EUA), com o UMP SDK;
2. no iOS, mostra o aviso de rastreamento da Apple (ATT), a não ser que a pessoa já
   tenha recusado guardar dados no formulário anterior;
3. só então inicia o SDK do AdMob, com anúncios até a classificação "Teen".

As telas usam `useAds()`:

- `canRequestAds`: os anúncios podem ser carregados;
- `privacyOptionsRequired` e `openPrivacyOptions()`: a lei pede um botão para a
  pessoa rever o consentimento; o app precisa mostrar esse botão.

Formatos prontos:

- `useInterstitialBetweenRounds()`: intersticial entre partidas. O jogo chama
  `roundFinished()` quando a pessoa sai de uma partida terminada; o anúncio aparece a
  cada 3 partidas (`ROUNDS_BETWEEN_INTERSTITIALS`), nunca na primeira. Se não houver
  anúncio, tenta carregar de novo no fim da partida seguinte.
- `useRewardedAction()`: vídeo premiado. `ready` diz se há vídeo pronto (mostre o
  botão só nesse caso) e `watch(onReward)` mostra o vídeo e chama `onReward` depois
  que ele é fechado, se a pessoa assistiu até o fim. Sem vídeo, tenta de novo a cada
  minuto.

Na web, os arquivos `.web.ts(x)` deixam tudo desligado.

## Anúncios simulados (Expo Go)

O SDK do Google é código nativo e não existe no Expo Go. Quando o app detecta que o SDK
não está no binário (`simulate.ts`), `index.ts` usa `simulated.tsx` no lugar de `real.ts`.
As duas versões têm as mesmas funções; a simulada mostra uma tela falsa no lugar do
anúncio, com botões para "assistir até o fim" ou "fechar antes" no vídeo premiado.
Nada em `simulated.tsx` pode importar `react-native-google-mobile-ads`.

Ao criar um formato novo (por exemplo, um banner), exporte-o em `real.ts` e em
`simulated.tsx`; o TypeScript reclama se um dos dois ficar para trás.

## Para levar a outro jogo

1. Copie a pasta `src/ads/`.
2. Instale as dependências: `npx expo install react-native-google-mobile-ads expo-dev-client expo-tracking-transparency`.
3. Copie do `app.json` o bloco `react-native-google-mobile-ads` da raiz, os plugins
   `react-native-google-mobile-ads` (IDs do app) e
   `expo-tracking-transparency` (texto do aviso), o plugin local
   `plugins/withGoogleMobileAdsAndroidBackend.js` (contorna um erro do build Android da
   biblioteca) e o `NSUserTrackingUsageDescription` dos arquivos em `locales/`.
4. Envolva o app em `<AdsProvider>` e mostre o botão de privacidade quando
   `privacyOptionsRequired` for verdadeiro.

## Antes de publicar

- Troque, no `app.json`, os IDs de app de teste pelos IDs do app no AdMob, nos dois
  lugares: no plugin `react-native-google-mobile-ads` e no bloco de mesmo nome na raiz
  do arquivo (o build Android da biblioteca lê esse bloco).
- Troque os blocos de `adUnits.ts` pelos blocos reais.
- No AdMob, crie as mensagens de GDPR e de estados dos EUA em "Privacidade e mensagens";
  sem elas, o formulário de consentimento não aparece.

O módulo não roda no Expo Go: teste com um build de desenvolvimento
(`eas build --profile development`).
