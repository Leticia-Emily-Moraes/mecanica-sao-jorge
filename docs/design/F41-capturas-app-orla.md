# F41: capturas do app no simulador, lado a lado com o Figma (ORLA, 16/11)

Pedido do comandante: capturar cada tela e estado de US-PAR-01 a US-PAR-03 no simulador, conferir o md5 e montar o lado a lado com os PNGs do Figma. Os critérios 1, 4, 12 e 13 foram reescritos pela BUSSOLA sem captura no aceite; este material é evidência de apoio, **não** substitui a planilha `F41-valores-fpdb8.md` nem os testes que travam os valores.

## Protocolo (referência registrada, não aparelho físico)

| Item | Valor |
|---|---|
| Dispositivo | Simulador iPhone 17, iOS 27.0 (`xcrun simctl list devices booted`) |
| Modo do app | Expo Go, Metro na 8082 com `CI=1` (o Metro da 8081 é de outro clone) |
| Tema / texto | `appearance` = light, `content_size` = large (lidos com `simctl ui`) |
| Orientação | retrato, 1206 × 2622 px (3x) |
| Barra de status | `simctl status_bar override --time 9:41`, bateria cheia; em 2 capturas a Dynamic Island aparece (só de plataforma) |
| Versão do Expo Go | não lida nesta sessão |

## Como as capturas foram feitas (limite que o revisor precisa saber)

Rota temporária `apps/mobile/app/capture.tsx` (**apagada, nunca commitada**) que compõe os **componentes reais** (`Button`, `TextField`, `StateView`, `ErrorState`, `MenuShell`, `ConfirmDialog`, `ScreenHeader` e os do Perfil) com props fixas, aberta por `simctl openurl exp://localhost:8082/--/capture?estado=X` depois de `simctl terminate host.exp.Exponent`. Portanto:

- prova **aparência dos componentes**, não as telas de `app/*.tsx`, e **não** o fluxo contra a API (o JSX das telas foi copiado para a rota; se uma tela mudar sem a rota, a foto não pega);
- dados fictícios (Maria Teste, `maria.teste@exemplo.invalid`, senha `senha-ficticia` mascarada em 14 pontos), sem rede, sem token, nenhuma notificação visível.

## Capturas (md5 dos arquivos commitados; 11 hashes distintos)

| Estado | Frame do Figma | md5 da captura |
|---|---|---|
| Login vazio | `10:895` | `d0609ce0d5ad74b17ef41652c303ef69` |
| Login preenchido | L1 `82:1990` | `e8e63f498e7b7fa9f4928a9208faf7bc` |
| Login carregando | L2 `82:2024` | `286a2a163b0fd00e85e44588f992c742` |
| Login erro de credencial | `10:936` | `3648ec90814f90ed29d08cab64e60acd` |
| Login erro de conexão | L3 `82:2058` | `42a2bb1a8b146a4f916ba3877f20c4e7` |
| Login sessão expirada | L4 `82:2098` | `efd683f05a008696cc6b84415dfa161d` |
| Perfil preenchido | `10:3842` | `46fa7dc9808c03c32b4092031f32f10e` |
| Diálogo de logout | `10:3886` | `4b6a49c25d331b0fb2c0ea6a07151954` |
| Carregando (sessão) | P1 `83:712` | `e6ce4bf0afcefa2183706aafecaf3a3d` |
| Erro (sessão) | P2 `83:754` | `95b1a3ff39ca24506a2c87cd649373a7` |
| Início + tab bar (4 desabilitados) | I1 `89:971` | `373b8c9d95091f7f44c70dd896976c9d` |

Arquivos em `docs/design/f41-capturas/app-2026-11-16-orla/`: `app-<estado>.png` (captura crua) e `lado-a-lado-<estado>.png` (Figma à esquerda, app à direita, altura 900). Cada um tem no máximo 233 KB.

## Atualização de 17/11 (ORLA): dois pares remontados, capturas do app mantidas

Depois das edições do ESQUADRO em 17/11 (R-15 no L2 e O-2 no `10:936`, `F41-valores-fpdb8.md` §20), o lado Figma de dois pares estava desatualizado. Reexportei só o lado esquerdo com os PNGs novos de `final-2026-11-16/` e **mantive as capturas do app**: elas são de 16/11 às 22:02 (`12c5e78`) e o último commit que mexeu em código do app antes delas é `c242b6f` (21:55); depois delas só entrou teste (`c21436c`). Não refiz foto no simulador nesta rodada.

| Par | Lado Figma | md5 do par novo | O que mostra |
|---|---|---|---|
| `lado-a-lado-login-carregando.png` | L2 `82:2024` (md5 `2aa84cf0…`) | `881180d700e226f0a72d1158c51f6603` | campos cinza-azulados (`#F1F5F9`) nos dois lados; indicador à esquerda do texto "Entrando…". Diferenças: escudo (L-02, aberto), indicador nativo (O-3, só de plataforma), barra de status e largura |
| `lado-a-lado-login-credencial.png` | `10:936` (md5 `edbf416b…`) | `a9cf46b74f2586afeabc1798f664fbdb` | "Mostrar" no campo Senha nos dois lados (O-2 fechada a favor do código). Diferenças: escudo, barra de status e largura |

Os outros 9 pares não foram remontados: o hash do PNG do Figma de cada um é idêntico ao já versionado (`F41-valores-fpdb8.md` §20.5). Abri os dois pares novos depois de gravar. **Escudo:** segue ausente no app; não foi programado porque a licença (S-2) está sem registro, ver a entrega do ORLA de 17/11.

## Não capturado (e por quê)

- **Tab bar com item selecionado** (`20:1102`, `20:1340`): o código nunca renderiza (`menu-tab-bar.tsx:62`, `selected={false}`). É o P-01, aguarda a pessoa.
- **Tab bar com foco (T1 `83:817`)**: o foco só existe com teclado ou leitor de tela; o simulador sem toque nem teclado não o produz. Segue no US-MENU-06, coberto só por teste.
- **Escudo do Login**: fora do aceite (D-21); aparece como diferença em todos os Logins.

## O que as fotos mostram sobre R-12 a R-14

No P2 do app, os dois botões ficam ancorados na base, com 12 pt entre eles (medido na captura: ~38 px a 3x) e ~16 pt da borda inferior, e a ilustração fica centrada na área acima. Confere com o frame por inspeção visual e pelos valores do código (testes em `error-state.test.tsx`). Não medi pixel a pixel contra o Figma.

## Diferenças vistas nos pares que NÃO estão na lista do ESQUADRO (para ele decidir)

| # | Onde | Figma | App | Leitura |
|---|---|---|---|---|
| O-1 | P2 `83:754`, ícone do círculo | wifi com corte diagonal | `cloud-offline-outline` (nuvem cortada) | desenho diferente; mesmo tipo de lacuna do P-10 (ícones Ionicons parecidos, não idênticos). Não alterei: o teste de R-5 trava o nome do ícone. |
| O-2 | Login erro de credencial `10:936` | campo Senha **sem** "Mostrar" | "Mostrar" presente | o L3 novo desenha "Mostrar"; `10:936` é frame antigo. Provável inconsistência do Figma, não do código. |
| O-3 | P1 `83:712`, indicador | anel com arco (círculo contínuo) | `ActivityIndicator` nativo do iOS (raios) | renderização nativa do controle; classifico como de plataforma, mas a decisão é do ESQUADRO. |

As demais diferenças (moldura de aparelho com cantos, barra de status, largura 402 contra 360 do frame, quebra de linha do L4) são só de plataforma.
