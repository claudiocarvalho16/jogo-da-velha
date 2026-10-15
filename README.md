# Jogo da Velha

Jogo da velha para Android e iOS, feito com [Expo](https://expo.dev) (React Native).

Dá para jogar com duas pessoas no mesmo celular ou contra o celular, no modo fácil ou imbatível, com placar.

## Testar no celular

Há dois jeitos, conforme o que você quer ver.

### Rápido, no Expo Go (anúncios simulados)

Serve para testar o jogo, a tradução, o intersticial a cada 3 partidas e o desfazer jogada. Os anúncios do Google não existem no Expo Go, então o app mostra telas falsas de anúncio no lugar, com botões para "assistir até o fim" ou "fechar antes".

1. Instale o app **Expo Go** no celular (Google Play ou App Store).
2. No computador, com Node.js 22 instalado, na pasta do projeto:

   ```bash
   npm install
   npm run go
   ```

3. Escaneie o QR code do terminal: no Android pelo próprio Expo Go, no iPhone pela câmera. O celular e o computador precisam estar na mesma rede Wi-Fi.

Use `npm run go`, e não `npm start`: como o projeto tem o `expo-dev-client`, o `npm start` abre o app de desenvolvimento em vez do Expo Go.

### Completo, com o SDK de anúncios (build de desenvolvimento)

Para ver os anúncios de teste do Google e as telas de consentimento, é preciso um build com o SDK. Ele funciona como um Expo Go feito só para este app.

1. Gere e instale o build (na nuvem da Expo, sem Mac nem Android Studio):

   ```bash
   npx eas-cli@latest login
   npx eas-cli@latest build --profile development --platform android   # ou ios
   ```

   No fim, o EAS mostra um link e um QR code para instalar o app no celular. Só é preciso refazer esse build quando entrar uma biblioteca nativa nova.

2. Rode `npm start` e abra o app de desenvolvimento no celular.

Os anúncios desse build são de teste (blocos de exemplo do Google), então dá para tocar neles sem risco para a conta do AdMob. Detalhes em [`src/ads/README.md`](src/ads/README.md).

## Comandos

```bash
npm test            # testes automáticos
npm run typecheck   # checagem de tipos
npm run android     # abre no emulador Android
npm run ios         # abre no simulador iOS (precisa de Mac)
```

## Publicar nas lojas

O app já tem ícone, tela de abertura e configuração de build (`eas.json`). Os builds rodam na nuvem da Expo com o [EAS](https://docs.expo.dev/eas/), então não é preciso Mac nem Android Studio.

### Antes de começar

- Conta gratuita na [Expo](https://expo.dev/signup).
- Para Android: conta no [Google Play Console](https://play.google.com/console) (taxa única de US$ 25).
- Para iOS: conta no [Apple Developer Program](https://developer.apple.com/programs/) (US$ 99 por ano).

### Passo a passo

```bash
npx eas-cli@latest login      # entra na conta Expo
npx eas-cli@latest init       # cria o projeto na Expo e grava o projectId no app.json

# APK para instalar direto num Android e testar
npx eas-cli@latest build --profile preview --platform android

# Builds de loja (o EAS cuida das chaves de assinatura e do número de versão)
npx eas-cli@latest build --profile production --platform all

# Envio para as lojas
npx eas-cli@latest submit --platform android
npx eas-cli@latest submit --platform ios
```

Observações:

- No Google Play, o primeiro envio do app precisa ser feito à mão pelo Play Console; depois disso o `submit` funciona.
- As duas lojas pedem uma política de privacidade. O jogo não coleta nenhum dado, então ela pode ser curta e dizer exatamente isso.
- Para lançar uma nova versão, aumente `version` no `app.json` (por exemplo, `1.0.1`) e rode o build de produção de novo.
