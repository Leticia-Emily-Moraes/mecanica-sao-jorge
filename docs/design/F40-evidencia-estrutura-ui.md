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
