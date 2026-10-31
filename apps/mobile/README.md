# mobile — app Mecânica São Jorge

App em React Native + Expo, com Expo Router (`app/`, navegação por arquivo de
rota) e TypeScript estrito. Esta etapa é **apenas fundação**: nenhuma tela de
feature (Login, Clientes, Veículos, Catálogo, Ordens de Serviço, Financeiro)
foi implementada, e não há ainda tokens de cor/tipografia (identidade visual
pendente de wireframe + protótipo de alta fidelidade).

O que existe hoje:

- scaffold Expo com Expo Router, TypeScript estrito, ESLint + Prettier e Jest;
- uma tela única (`app/index.tsx`) confirmando que o app sobe, sem regra de
  negócio — ela não chama API nem tem estado de carregamento/vazio/erro
  porque não busca dado nenhum; esses estados entram com a primeira tela real
  (Login);
- leitor de variável de ambiente (`src/config/env.ts`) para a URL base da API,
  com teste unitário cobrindo valor configurado e valor padrão;
- `.env.example` sem segredo.

## Pré-requisitos

- Node.js 20 LTS (ou superior) e npm
- Expo Go instalado no celular (iOS/Android) **ou** um simulador iOS
  (Xcode) / emulador Android (Android Studio)
- A API (`apps/api`) rodando localmente se quiser testar chamadas reais —
  nesta etapa não há nenhuma

## Instalar

```bash
cd apps/mobile
npm install
```

> Depois do `npm install`, rode `npx expo install --check` (ou
> `npx expo-doctor`) para o próprio Expo alinhar as versões das dependências
> nativas (`react`, `react-native`, `react-native-screens`, etc.) à versão do
> SDK instalada. Ver "Pendências" abaixo sobre por que isso não foi
> verificado nesta sessão.

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

- `app/index.test.tsx`: smoke test de componente (`@testing-library/react-native`),
  renderiza a tela inicial e confirma que o texto principal aparece.
- `src/config/env.test.ts`: teste unitário puro do leitor de variável de
  ambiente (valor configurado e valor padrão).

## Lint, formatação e tipos

```bash
npm run lint           # ESLint (eslint-config-expo + regra de formatação)
npm run format:check   # Prettier — verifica
npm run format         # Prettier — aplica
npm run typecheck      # tsc --noEmit
```

## Estrutura de pastas

```
app/                  # rotas (Expo Router) — telas por arquivo
├── _layout.tsx        # layout raiz (Stack)
├── index.tsx          # tela única desta etapa (smoke screen)
└── index.test.tsx

src/
└── config/
    ├── env.ts          # leitura tipada de variável de ambiente
    └── env.test.ts
```

Os diretórios `src/api`, `src/components`, `src/navigation`, `src/theme`,
`src/hooks` e `src/utils` fazem parte da estrutura definida na arquitetura,
mas ainda não existem como diretórios no git (diretório vazio não é
versionado) — chegam com a primeira feature de domínio (Login), junto com os
tokens de cor/tipografia da identidade visual. `src/navigation` só ganha
conteúdo se algum fluxo precisar de lógica de navegação que o roteamento por
arquivo do Expo Router não cubra sozinho.

## Divergência registrada em relação à proposta inicial do CARTOGRAFO

A árvore de pastas proposta para o mobile listava `src/screens/` para as
telas. Esta etapa segue, em vez disso, a convenção explícita da casa
("Navegação com Expo Router (`app/`), telas em arquivos por rota"): as telas
ficam em `app/`, e `src/` guarda código que não é rota (config, e depois api,
componentes, tema, hooks, utils).

## Pendências / riscos conhecidos

- **Nada foi executado nesta sessão.** As ferramentas desta sessão de
  implementação não incluíam terminal/shell — não rodei `npm install`,
  `npm start`, `npm test`, `npm run lint`, `npm run format:check` nem
  `npm run typecheck`, e **não abri o app em nenhum simulador, emulador ou
  dispositivo físico**. Os arquivos foram escritos com cuidado, mas isso não
  substitui a execução real. Antes de aceitar esta etapa como pronta, alguém
  com shell precisa rodar os comandos acima (Android e iOS, pelo menos um dos
  dois) e colar a saída real.
- **Versões do `package.json` não verificadas no registro npm.** Escrevi as
  versões do Expo SDK (`~54.0.0`) e das dependências de navegação/teste
  compatíveis com ela a partir do meu conhecimento, sem acesso à rede nesta
  sessão para confirmar no npm. É esperado rodar `npx expo install --check`
  logo após o primeiro `npm install` para corrigir qualquer desalinhamento de
  versão de dependência nativa.
- **ESLint fixado em `^8.57.0` com `.eslintrc.js` (formato legado)**, não no
  formato flat (`eslint.config.js`) do ESLint 9+, porque não pude confirmar
  nesta sessão se `eslint-config-expo` já suporta flat config na versão
  atual. Se o time já usa ESLint 9 em outro app do monorepo, ajustar para
  manter o mesmo formato.
- **Sem tema nem telas de feature.** Os tokens de cor/tipografia e os
  critérios de estado (carregando, vazio, erro, sucesso) por tela entram a
  partir da etapa de Login, quando a identidade visual estiver validada em
  protótipo de alta fidelidade.
