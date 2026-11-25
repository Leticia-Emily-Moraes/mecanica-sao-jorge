# F40 — Evidência da reestruturação de UI (ADR-015)

Autoria: ORLA. Data: 2026-11-13. Ramo: `refactor/f40-estrutura-ui-sobre-f41`, criado a partir da ponta da F41 (`1490234`, ramo `feat/f41-paridade-correcoes`).
Escopo: pedidos (a) e (b) da revisão humana das 20:44 (R6 a R10 do PRD). Só estrutura de arquivos e extração de estilo; nenhum texto, token ou comportamento mudou.

Ambiente: macOS (Darwin 27.0.0), Node via `npm --prefix apps/mobile`. Os testes rodam em Jest (`jest-expo`) com React Native Testing Library, **sem aparelho e sem simulador**: nada aqui foi verificado em iOS ou Android reais. Havia um simulador iPhone 17 (iOS 27.0) ligado, mas não foi usado.

## 1. Ordem seguida

1. CARTOGRAFO gravou o ADR-015 (status **proposto**). Commit `docs(architecture): ADR-015 ...`.
2. ORLA moveu e extraiu, em commits separados (movimentação pura, depois estilo, depois telas, depois lint, depois teste de estrutura, depois README).
3. O ADR diz que nenhum arquivo deve ser movido enquanto estiver em "proposto". O pedido da pessoa foi "CARTOGRAFO registra em ADR antes de a ORLA mover; depois a ORLA aplica", e foi isso que segui. **O ADR segue "proposto"**: o aceite é da pessoa e fica pendente (ver Riscos na entrega).

## 2. Linha de base e resultado

| Medida | Antes (ponta da F41, `1490234`) | Depois (commit final) |
|---|---|---|
| Suítes / testes (`npm --prefix apps/mobile test`) | 30 / 170 | 31 / 176 |
| `npm --prefix apps/mobile run typecheck` | sem erro | sem erro |
| `npm --prefix apps/mobile run lint` | sem erro | sem erro (com as regras novas do ADR-015) |

O "119 testes" citado na revisão era a contagem do ramo da F40 sem a F41; a ponta da F41 já tinha 170. A diferença de 6 testes é o `ui-structure.test.ts` novo.

Saída real da suíte final:

```
Test Suites: 31 passed, 31 total
Tests:       176 passed, 176 total
```

## 3. Buscas de verificação (saída real, vazia = nenhuma ocorrência)

```
git grep -n "StyleSheet.create" -- apps/mobile/app apps/mobile/src   (fora de *.styles.ts)  -> vazio
git grep -ln "@/theme/tokens" -- 'apps/mobile/app/**/*.tsx' 'apps/mobile/src/**/*.tsx'      (fora de *.test.tsx) -> vazio
git grep -n "fetch(" -- apps/mobile/app apps/mobile/src/screens apps/mobile/src/layouts apps/mobile/src/components -> vazio
git grep -nE "#[0-9a-fA-F]{3,8}\b" -- app, screens, layouts, components (fora de teste)       -> vazio
```

## 4. As regras de lint falham de verdade (violação proposital, arquivos temporários já apagados)

Comando: `npx --prefix apps/mobile eslint <arquivos temporários> --format unix`. Saída real (caminho abreviado):

| Violação criada | Mensagem do lint |
|---|---|
| `StyleSheet.create` em `.tsx` de componente | "StyleSheet.create só em \<nome\>.styles.ts, na pasta do componente." |
| `style={{ flex: n }}` em componente | "Objeto de estilo inline: use styles ou uma função de \<nome\>.styles.ts." |
| `import { spacing } from '@/theme/tokens'` em `.tsx` | "Valor visual entra pelo \<nome\>.styles.ts (styles ou visual), não direto do token." |
| `import { useState } from 'react'` e `import { View } from 'react-native'` em `*.styles.ts` | "Arquivo de estilo importa só StyleSheet, tipos de estilo e @/theme/tokens." e "Arquivo de estilo importa de react-native só StyleSheet (tipos com import type)." |
| `export default` em `*.styles.ts` | "Use export nomeado: styles, visual ou função pura de estilo." |
| import e JSX em `app/zz-v6.tsx` | "app/ só roteia: reexporte a tela de @/screens ou o layout de @/layouts." (linhas 1 e 3) |
| `import ... from '../button/button.styles'` em outro componente | "\*.styles é privado da pasta do componente: só ./\<nome\>.styles é permitido." |
| `import './zz-v8.styles'` em tela | "Tela e layout não têm estilo: componha componentes de @/components." |
| `export * from '../button/button.styles'` em `index.ts` | "O index.ts reexporta só o componente e seus tipos; nunca o estilo." |

Total de 13 problemas reportados nessa execução (inclui 2 de `import/no-unresolved` dos arquivos temporários, que não existiam de verdade). Depois de apagar os temporários, `git status` voltou a mostrar só o `.eslintrc.js` modificado, depois commitado.

O `ui-structure.test.ts` também foi visto falhando: com um `.tsx` solto em `src/components/ui/` e um `zz.test.ts` em `app/`, 2 dos 6 testes falharam (`should have a folder per component...` e `should not have tests or styles inside app...`); os 4 outros passaram. Arquivos apagados em seguida.

## 5. Mesma aparência: árvore renderizada idêntica (substitui a captura, R8)

Método: um teste temporário (não versionado) renderizou, com o mesmo harness (`SafeAreaProvider` com métricas fixas, `AuthProvider`, `expo-router` mockado), seis estados e gravou `screen.toJSON()` em arquivo: Login vazio, Login com erro de validação (botão Entrar com campos vazios), reidratação de sessão carregando, tab bar, Perfil logado e diálogo de confirmação de saída. Rodou uma vez num worktree de `1490234` e outra no commit final, importando as telas por `app/...` nos dois (a rota existe nas duas estruturas).

```
MD5 dump-old.json = e56a3c9f958bc6b623512533a92ecfa6   (54777 bytes)
MD5 dump-new.json = e56a3c9f958bc6b623512533a92ecfa6   (54777 bytes)
cmp -> ARVORES IDENTICAS
```

O JSON inclui elementos, estilos já achatados e as props de acessibilidade (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityLiveRegion`), então **nenhum anúncio de acessibilidade mudou** nesses seis estados.

Limites desta prova: não vê pixel (fonte, sombra, anel de foco real), nem o foco do teclado, nem o que o leitor de tela fala; não cobre Login com erro de credencial, erro de rede, carregando e senha visível (exigem interação mais longa que o dump); não é uma captura de simulador nem de aparelho. O teste temporário foi apagado e não está no repositório, então a prova não se repete sem refazer o método.

## 6. Diff dos testes de F30 e F33 (US-COMP-06, R7)

`git diff -M --unified=0 1490234 HEAD -- '*.test.ts' '*.test.tsx'`, linhas alteradas nos testes que já existiam:

| Teste (arquivo novo) | Linha removida | Linha adicionada |
|---|---|---|
| `src/screens/login/login-screen.test.tsx` | `import LoginScreen from './login';` | `import LoginScreen from './login-screen';` |
| `src/screens/profile/profile-screen.test.tsx` | `import PerfilScreen from './perfil';` | `import PerfilScreen from './profile-screen';` |
| `src/screens/session-restore/session-restore-screen.test.tsx` | `import IndexScreen from './index';` | `import IndexScreen from './session-restore-screen';` |
| `src/layouts/menu-layout/menu-layout.test.tsx` | `import MenuLayout from './_layout';` | `import MenuLayout from './menu-layout';` |
| `src/integration/menu-routing.test.tsx` | nenhuma (continua importando de `../../app/...`) | nenhuma |

Os outros 15 testes de componente foram só movidos (`similarity index 100%`); dois mudaram, e são testes de componente da própria F40 (não de F30 ou F33):

- `inline-alert.test.tsx`: `import { AlertIcon } from './alert-icon'` virou `from '@/components/ui/alert-icon'`.
- `screen-container.test.tsx`: `<ScreenContainer topSpacing={spacing.formTop}>` virou `<ScreenContainer topSpacing="form">`. O valor esperado no `expect` continua `spacing.formTop`. Esta é a única mudança de contrato de componente da rodada: a tela deixou de importar o token, então a prop virou variante (`'default'` = 24, `'form'` = 30).

Também mudou, fora dos testes: o nome da função exportada `IndexScreen` virou `SessionRestoreScreen` e `PerfilScreen` virou `ProfileScreen` (os testes mantêm o nome local do import, então não mudaram).

## 7. Sessão expirada (US-COMP-10, R10)

Busca no código de produção: `fetchAutenticado` continua sem chamador fora de teste. Não liguei a nenhuma chamada, porque não existe chamada autenticada no app hoje e inventar uma seria feature nova. Registrado no PRD (US-COMP-10, R10): o destino pós-expiração fica para a primeira feature que usar API autenticada (F35).

## 8. O que NÃO foi verificado

- **Fluxo real contra a API** (login, Perfil, logout, voltar ao login): não executei. Havia Docker no `PATH` e um simulador ligado, mas subir MySQL + API Java + Expo Go e tocar na tela não cabia nesta etapa. Fica com o CRIVO.
- **Simulador ou aparelho**: nenhuma verificação visual nesta entrega e o app não foi aberto (o ADR pede `npx expo start` com Expo Go na Confirmação). O que foi provado do lado do Metro é só o empacotamento estático, no item 9.
- **VoiceOver e TalkBack**: seguem sem teste em aparelho (R9).
- **Figma**: sem mudança de tela, de token ou de texto nesta rodada, então não houve lado Figma a atualizar. Não chamei o conector.
- **Foco por teclado** dos componentes movidos: coberto só pelos testes que já existiam (`has-focus-ring`), que passaram.

## 9. Empacotamento do Metro (iOS)

Comando: `npx --prefix apps/mobile expo export apps/mobile --platform ios --output-dir <scratchpad>`. Saída real, resumida:

```
iOS Bundled 4545ms node_modules/expo-router/entry.js (1150 modules)
› ios bundles (1): _expo/static/js/ios/entry-3e97a03354b36f7ee097e95ba7c8807b.hbc (3.04 MB)
Exported: <scratchpad>/export-ios
```

Isto confirma que o Metro resolve `@/components/ui/<nome>` para `<nome>/index.ts`, o alias `@/screens` e `@/layouts` e os re-exports de `app/`, e gera o bundle sem erro. **Não executa o app**: não prova que a tela abre, só que o bundle compila. A saída foi para o scratchpad, fora do repositório.

## 10. Revisão humana de 14/11: estrutura no que está em revisão (critério 1)

Ambiente: macOS (Darwin 27.0.0), Node via `npm --prefix apps/mobile`, Jest com `jest-expo`. Sem simulador nem aparelho nesta rodada (ver 10.5).

### 10.1 Situação da PR #10 (comando `gh pr view 10 --json headRefName,headRefOid,baseRefName,state,isDraft`)

```
{"baseRefName":"main","headRefName":"feat/f40-componentizacao-mobile","headRefOid":"ea0dd69434429a2c63319f24bc10bac96b928fb4","isDraft":true,"state":"OPEN"}
```

`git merge-base --is-ancestor ea0dd69 HEAD` respondeu que `ea0dd69` **não** é ancestral do ramo `refactor/f40-estrutura-ui-sobre-f41`. A estrutura do ADR-015 não está na PR #10. Nada foi enviado ao remoto.

### 10.2 Integração I2 feita só em ramo local

Ramo local `integracao/f40-i2-sobre-pr10` = `ea0dd69` + 31 commits (`git rev-list --count ea0dd69..integracao/f40-i2-sobre-pr10` = 31): a F41 (do `03bcb51` ao `1490234`) e os commits do ADR-015 (do `074cffd` ao `3e4c218`), sem o `c815235` (docs da F39). Um conflito, em `docs/design/figma.md` no commit `03bcb51`: resolvido mantendo só a seção da F41, porque a seção da F39 vem do `c815235`, que ficou de fora.

`git diff --stat refactor/f40-estrutura-ui-sobre-f41 integracao/f40-i2-sobre-pr10 -- apps` não listou nenhum arquivo: o código do app é idêntico nos dois ramos. Em `docs/` diferem 3 arquivos: `F39-redesenho-wireframes-navegacao.md` e a seção da F39 em `figma.md` (efeito de excluir o `c815235`) e `F40-evidencia-paridade-visual.md` (+12 linhas que já estão na PR #10).

Lint, tipos e suíte no ramo integrado (comandos abaixo, saída real):

```
npm --prefix <worktree>/apps/mobile run lint        -> eslint . ; EXIT_LINT=0
npm --prefix <worktree>/apps/mobile run typecheck   -> tsc --noEmit ; EXIT_TSC=0
npm --prefix <worktree>/apps/mobile test -- --ci --silent
Test Suites: 31 passed, 31 total
Tests:       176 passed, 176 total
```

Esse ramo **não foi publicado**: levá-lo à PR #10 exige force-push em `feat/f40-componentizacao-mobile` e contraria a decisão anterior de deixar a F41 fora da PR. Decisão e autorização são da pessoa (opção I2 do ADR-015).

### 10.3 Listagem de pastas (ramo `refactor/f40-estrutura-ui-sobre-f41`, idêntica no ramo integrado)

```
$ ls apps/mobile/src/components/ui/button apps/mobile/src/components/menu/menu-tab-bar
apps/mobile/src/components/ui/button:
button.styles.ts   button.test.tsx   button.tsx   index.ts

apps/mobile/src/components/menu/menu-tab-bar:
index.ts   menu-tab-bar.styles.ts   menu-tab-bar.test.tsx   menu-tab-bar.tsx

$ ls -R apps/mobile/src/screens
login:           login-screen.test.tsx            login-screen.tsx
profile:         profile-screen.test.tsx          profile-screen.tsx
session-restore: session-restore-screen.test.tsx  session-restore-screen.tsx

$ ls -R apps/mobile/src/layouts
menu-layout:  menu-layout.test.tsx  menu-layout.tsx
root-layout:  root-layout.tsx

$ ls -R apps/mobile/app
_layout.tsx  (menu)  index.tsx  login.tsx
(menu): _layout.tsx  perfil.tsx
```

Conteúdo dos 5 arquivos de `app/` (cada um é uma linha de re-export):

```
app/_layout.tsx        export { default } from '@/layouts/root-layout/root-layout';
app/index.tsx          export { default } from '@/screens/session-restore/session-restore-screen';
app/login.tsx          export { default } from '@/screens/login/login-screen';
app/(menu)/_layout.tsx export { default } from '@/layouts/menu-layout/menu-layout';
app/(menu)/perfil.tsx  export { default } from '@/screens/profile/profile-screen';
```

Contagem: 13 pastas em `src/components/ui`, 2 em `src/components/menu` e 3 em `src/components/perfil` (18 pastas de componente), mais 3 pastas em `src/screens` e 2 em `src/layouts`.

Desvio que a listagem expõe: `ui/error-retry-modal/` tem `.tsx`, `.styles.ts` e `index.ts`, mas **não tem `.test.tsx` próprio**. Ele só é exercido por `state-view.test.tsx` (o `StateView` o renderiza no estado de erro). O `ui-structure.test.ts` não exige teste por pasta, então passa. A regra do briefing pede teste de componente para todo componente criado ou alterado: fica registrado como pendência a corrigir (teste direto do `ErrorRetryModal`), sem que eu tenha mudado código nesta rodada.

### 10.4 `ui-structure.test.ts` (comando `npm --prefix apps/mobile test -- --ci src/integration/ui-structure.test.ts --verbose`, saída real)

```
PASS src/integration/ui-structure.test.ts
  ui-structure (ADR-015)
    ✓ should have a folder per component when listing src/components groups
    ✓ should have component file and index when reading each component folder
    ✓ should have a styles file next to the component when the folder renders UI
    ✓ should keep styles file inside its component folder when searching src
    ✓ should have a screen file named after its folder when reading src/screens
    ✓ should not have tests or styles inside app when reading the routes folder
Tests:       6 passed, 6 total
```

Rodou no ramo `refactor/f40-estrutura-ui-sobre-f41` e de novo, dentro da suíte completa, no ramo integrado. Suíte completa no ramo atual: 31 suítes, 176 testes passando; lint e `tsc --noEmit` com saída 0.

### 10.5 Capturas (tarefas 2 e 14): não feitas nesta rodada

Havia o simulador iPhone 17 (iOS 27.0) ligado, o Expo Go 54.0.7 instalado e o Docker respondendo. Tentei subir o Metro em segundo plano a partir do ramo integrado para abrir o app e capturar; o ambiente barrou o comando (processo em segundo plano com redirecionamento), então o app **não foi aberto** e nenhuma captura nova existe. A linha de base continua sendo a da F41 em `docs/design/f41-capturas/` (md5 de `app-login-vazio.png` = `2d9941f83bf73e3c3d675d0dfda536e2`, 402 x 874). A prova de "mesma aparência" segue sendo a árvore renderizada idêntica do item 5, que não vê pixel. A tarefa 2 no sentido literal (antes da refatoração) já não é possível; o "antes" é a F41.
