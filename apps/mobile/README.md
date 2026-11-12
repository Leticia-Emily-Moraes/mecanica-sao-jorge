# mobile — app Mecânica São Jorge

App em React Native + Expo, com Expo Router (`app/`, navegação por arquivo de
rota) e TypeScript estrito. A F30 entregou as telas de **Login** e **Perfil**
consumindo a API real da F02 — são as duas primeiras telas de feature do app.

O que existe hoje:

- scaffold Expo com Expo Router, TypeScript estrito, ESLint + Prettier e Jest;
- **Login** (`app/login.tsx`): e-mail/senha, validação de campo vazio sem
  chamar a API, erro genérico de credencial inválida (401), popup de erro de
  conexão com "Tentar novamente", alternar mostrar/ocultar senha, e aviso de
  sessão expirada quando a API devolve 401 numa chamada autenticada;
- **Perfil** (`app/perfil.tsx`): nome, e-mail e badge de perfil do usuário
  logado, com logout por diálogo de confirmação (`ConfirmDialog`);
- **Reidratação de sessão** (`app/index.tsx`): ao abrir o app, decide sem
  interação do usuário entre Login e Perfil a partir do token salvo no
  `expo-secure-store` — cobre os estados de carregando e erro dessa decisão
  (ver "Decisão: Perfil sem endpoint próprio" abaixo);
- `src/auth/`: `AuthProvider`/`useAuth` (estado de sessão), `auth-api.ts`
  (chamada a `POST /auth/login`), `types.ts`;
- `src/api/http.ts`: `fetchAutenticado`, infraestrutura para qualquer chamada
  autenticada futura tratar 401 como sessão expirada (US-LGN-FRONT-07) — não
  tem chamador ainda nesta fatia, porque Perfil não tem endpoint de rede
  próprio (ver decisão abaixo);
- `src/theme/tokens.ts`: tokens de cor petro/primary + derivados (F25,
  `docs/design/figma.md`) — única fonte de cor do app;
- `src/i18n/strings.ts`: todo texto de interface por chave, nenhuma string
  fixa em componente;
- `src/components/`: `Button`, `TextField`, `ErrorRetryModal`, `ConfirmDialog`
  — primitivas de UI compartilhadas entre as duas telas, com anel de foco
  duplo (petro + halo branco) em todo controle focável;
- leitor de variável de ambiente (`src/config/env.ts`) para a URL base da API,
  com teste unitário cobrindo valor configurado e valor padrão;
- `.env.example` sem segredo.

## Decisão: Perfil sem endpoint de rede próprio

`apps/api` só expõe `POST /api/v1/auth/login` (confirmado em
`AuthController.java`) — não existe `GET /auth/me` ou equivalente. Seguindo a
opção (a) registrada em `docs/product/F25-prototipo-login-perfil.md` (Dúvida
1): a tela de Perfil renderiza direto do que o login devolveu, guardado junto
com o token no `expo-secure-store`, sem nova chamada de rede a cada visita.
Os estados de carregando/erro de "Perfil" da matriz de estados da F25 ficam
na tela de reidratação (`app/index.tsx`), que é quando o app de fato lê o
armazenamento local. Isto não foi reaberto com CARTOGRAFO/ESPRESSO nesta
etapa — é uma decisão de implementação registrada aqui para revisão.

## Divergência de governança registrada

O ADR-007 (`docs/product/F25-prototipo-login-perfil.md`, seção 1) condiciona
o início da F30 a uma linha **"Aprovado"** na tabela de registro de execução
da F25. Essa linha não existe no documento até o momento desta entrega — o
CRIVO relatou dois gaps pendentes (reação `AFTER_TIMEOUT` ausente nos estados
"Carregando" do protótipo, e anel de foco ilustrado em só 2 dos 6+ controles)
e BUSSOLA ainda não registrou a decisão. Esta implementação seguiu instrução
direta do comandante para prosseguir mesmo assim; o código fecha o segundo
gap por conta própria (anel de foco em todo controle focável, não só nos dois
botões primários), mas o gate formal continua aberto e precisa ser fechado
por BUSSOLA.

## Pré-requisitos

- Node.js 20 LTS (ou superior) e npm
- Expo Go instalado no celular (iOS/Android) **ou** um simulador iOS
  (Xcode) / emulador Android (Android Studio)
- A API (`apps/api`) rodando localmente para testar o login de verdade —
  `docker compose up -d` em `apps/api` + `mvn spring-boot:run` (ver o README
  daquela pasta)

## Instalar

```bash
cd apps/mobile
npm install
```

`npx expo-doctor` deve reportar 18/18 checks passando. Se alguém reintroduzir
uma dependência fora da faixa esperada pelo SDK, rode `npx expo install --fix`
antes de investigar como bug de código.

## Configurar variáveis de ambiente

```bash
cp .env.example .env
```

`EXPO_PUBLIC_API_BASE_URL` aponta para a API local (`http://localhost:8080/api/v1`
por padrão). Variáveis `EXPO_PUBLIC_*` ficam embutidas no bundle — nunca
coloque segredo nelas.

## Rodar o app

```bash
npm start
```

Abre o Metro/Expo Dev Tools no terminal: escaneie o QR code com o Expo Go
(iOS/Android) ou pressione `i` / `a` para abrir no simulador/emulador.
Atalhos equivalentes diretos:

```bash
npm run ios      # simulador iOS
npm run android  # emulador Android
npm run web      # navegador (suporte web do Expo Router)
```

## Rodar os testes

```bash
npm test
```

27 testes em 6 suítes:

- `app/index.test.tsx`: reidratação de sessão (redireciona para Login/Perfil
  conforme o SecureStore, mostra e recupera do erro de inicialização).
- `app/login.tsx` / `app/login.test.tsx`: validação de campo vazio sem chamar
  a API, erro de credencial, erro de rede com retry, login com sucesso
  navegando para Perfil, alternância de mostrar/ocultar senha.
- `app/perfil.tsx` / `app/perfil.test.tsx`: dados do usuário exibidos,
  diálogo de confirmação de logout (cancelar mantém sessão, confirmar limpa o
  token e navega para Login).
- `src/auth/auth-api.test.ts`: chamada HTTP a `POST /auth/login` (sucesso,
  401, API fora do ar, resposta malformada).
- `src/auth/auth-context.test.tsx`: `AuthProvider`/`useAuth` — restauração de
  sessão, falha de leitura do SecureStore, login, logout, sessão expirada.
- `src/config/env.test.ts`: leitor de variável de ambiente (valor configurado
  e valor padrão).

**Não coberto por teste automatizado**: toque real num simulador/dispositivo
(ver "Verificação manual" abaixo) e VoiceOver/TalkBack reais.

## Lint, formatação e tipos

```bash
npm run lint           # ESLint (eslint-config-expo + regra de formatação)
npm run format:check   # Prettier — verifica
npm run format         # Prettier — aplica
npm run typecheck      # tsc --noEmit
```

## Estrutura de pastas

```
app/                     # rotas (Expo Router) — telas por arquivo
├── _layout.tsx           # layout raiz (Stack + AuthProvider)
├── index.tsx             # reidratação de sessão (decide Login x Perfil)
├── index.test.tsx
├── login.tsx
├── login.test.tsx
├── perfil.tsx
└── perfil.test.tsx

src/
├── api/
│   └── http.ts            # fetchAutenticado (401 -> SessaoExpiradaError)
├── auth/
│   ├── auth-api.ts         # POST /auth/login
│   ├── auth-api.test.ts
│   ├── auth-context.tsx    # AuthProvider / useAuth
│   ├── auth-context.test.tsx
│   └── types.ts
├── components/
│   ├── button.tsx
│   ├── confirm-dialog.tsx
│   ├── error-retry-modal.tsx
│   └── text-field.tsx
├── config/
│   ├── env.ts              # leitura tipada de variável de ambiente
│   └── env.test.ts
├── i18n/
│   └── strings.ts           # todo texto de interface, por chave
└── theme/
    ├── tokens.ts             # cor/espaçamento/tipografia (F25)
    └── use-focus-ring.ts

__mocks__/
└── expo-secure-store.ts   # mock manual (node_modules), aplicado automaticamente pelo Jest
```

`src/navigation` e `src/hooks`/`src/utils` da árvore proposta pela
arquitetura ainda não existem como diretório (vazio não é versionado) —
Login/Perfil não precisaram de lógica de navegação além do roteamento por
arquivo do Expo Router, nem de hook/util compartilhado além do que já está em
`src/auth` e `src/theme`.

## Divergência registrada em relação à proposta inicial do CARTOGRAFO

A árvore de pastas proposta para o mobile listava `src/screens/` para as
telas. Esta etapa segue, em vez disso, a convenção explícita da casa
("Navegação com Expo Router (`app/`), telas em arquivos por rota"): as telas
ficam em `app/`, e `src/` guarda código que não é rota (config, e depois api,
componentes, tema, hooks, utils).

## Verificação manual (F30, 2026-11-07)

Executado nesta sessão, com shell real — não apenas escrito:

- `npm test`, `npm run typecheck` e `npm run lint`: verdes (27/27 testes, 0
  erro de tipo, 0 violação de lint) depois do `npm run format`.
- `npx expo-doctor`: 18/18 checks (depois de corrigir as dependências
  desalinhadas, ver "Bugs pré-existentes corrigidos" abaixo).
- Subida real: `docker run mysql:8.4` (porta 3307, a 3306 do host já está
  ocupada por um MySQL nativo pré-existente, fora deste projeto) + Flyway
  aplicando V1+V2 + `mvn spring-boot:run` da API real, com um usuário fictício
  inserido via BCrypt (`ana.souza@exemplo-ficticio.com.br`, mesmo dado da F25).
  `curl` confirmou `POST /auth/login` devolvendo 200 com token/usuário na
  senha certa e 401 na errada.
- `npx expo start --ios` com Expo Go no simulador iPhone 17 Pro (iOS 26.5):
  bundle carregou, e a tela de Login renderizou de verdade com os tokens
  petro/primary corretos (screenshot conferido visualmente).
- **Não verificado**: toque real no simulador (digitar e-mail/senha, tocar
  Entrar, ver a tela de Perfil e o diálogo de logout). Esta sessão não tinha
  `idb`/`cliclick` instalado nem permissão de Acessibilidade do macOS para o
  `osascript` simular toque por coordenada — tentei e recebi erro de
  permissão (-1719), não contornei. O comportamento de toque foi exercitado
  pelos testes automatizados (RNTL `fireEvent` contra os componentes reais),
  não por interação humana/visual na tela de Perfil, no popup de erro de rede
  nem no diálogo de confirmação.
- **Não verificado**: Android (nenhum emulador/`adb` disponível nesta
  sessão) e leitor de tela real (VoiceOver/TalkBack).

## Bugs pré-existentes corrigidos nesta etapa (não são da F30, mas bloqueavam)

- `babel-preset-expo` estava fixado em `~12.0.0` (SDK muito antigo) enquanto
  o projeto usa `expo@~54.0.0`; isso puxava um `hermes-parser` incompatível
  com a sintaxe Flow do próprio `react-native@0.81`, e quebrava **qualquer**
  teste de componente que renderizasse `<Text>`/`<View>` (`app/index.test.tsx`
  já falhava assim antes desta etapa). Corrigido para `~54.0.0`.
- `expo-router`, `expo-constants`, `expo-status-bar`, `react`, `react-dom`,
  `react-native`, `react-native-safe-area-context`, `react-native-screens`,
  `eslint-config-expo` e `typescript` estavam 1-2 versões maiores atrás do
  esperado pelo SDK 54 (`expo-router@4.0.22` vs. `~6.0.24` esperado) —
  faltava `query-string`, dependência do `expo-router`, e o bundle do Metro
  quebrava **antes mesmo de abrir qualquer tela**: o app nunca tinha rodado
  de fato em nenhum simulador/dispositivo até agora. Corrigido com
  `npx expo install --fix` + `npx expo install expo-linking` (peer dependency
  que faltava).
- Faltava `metro.config.js`: sem ele, o `require.context` do Expo Router
  empacotava `app/*.test.tsx` dentro do bundle do app, arrastando
  `@testing-library/react-native` (que usa módulos Node) para o runtime
  nativo e quebrando o bundle. Adicionado `resolver.blockList` para
  `*.test.*`/`*.spec.*` — o Jest (que usa a própria config, não o Metro)
  continua rodando os testes normalmente.

## Pendências / riscos conhecidos

- **Governança da F25 em aberto** — ver "Divergência de governança
  registrada" acima: a linha "Aprovado" do protótipo de alta fidelidade ainda
  não existe.
- **Android não verificado** nesta sessão (sem emulador/`adb` disponíveis).
- **Toque real e leitor de tela real não verificados** (ver "Verificação
  manual" acima).
- **ESLint fixado em `^8.57.0` com `.eslintrc.js` (formato legado)**, não no
  formato flat (`eslint.config.js`) do ESLint 9+ — mantido como estava antes
  desta etapa, fora do escopo da F30 revisar.
