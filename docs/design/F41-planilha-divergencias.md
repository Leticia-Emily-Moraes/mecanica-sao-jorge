# F41 · Planilha de divergências Figma × app (app em `fde7cda`)

Autor: ESQUADRO · Data: 2026-11-13 · Estado: **feature NÃO fechada** (US-PAR-08 depende de decisões da pessoa e de correções de código).

## 1. Acesso ao Figma nesta sessão (US-PAR-11)

O servidor `figma-remote` está marcado como "exige autorização" e **nenhuma ferramenta `mcp__figma-remote__*` consta no meu conjunto de ferramentas nesta sessão**. Não consegui chamar `whoami`, `get_screenshot` nem `get_metadata`, então **não exportei frame novo e não li nem editei nó ou variável do Figma agora**. Não há saída de erro de chamada para registrar, só a ausência da ferramenta. Login do servidor: `claude mcp login figma-remote` (sessão interativa).

Lado Figma desta planilha: as 12 capturas em `docs/design/f41-capturas/figma-*.png`, exportadas pelo MCP na rodada do ESQUADRO de 2026-11-13 (seção 12.1 de `F41-conferencia-paridade.md`: os 12 frames foram recapturados e batiam com as anteriores; `39:31` e `39:58` foram trocadas após eu corrigir os ícones). **Não verifiquei de novo, nesta sessão, se os frames mudaram depois disso.**

Lado app: as 8 capturas `docs/design/f41-capturas/app-*.png`, commit `fde7cda` (md5 na seção 13.3 de `F41-conferencia-paridade.md`; reconferi com `md5` que os 8 arquivos versionados batem com aquela tabela). Protocolo: simulador iPhone 17, iOS 27.0, Expo Go, claro, retrato; **não é o aparelho físico da premissa 9** (dúvida 2 sem resposta). Só `app-login-vazio.png` é a rota real; as outras 7 são aparência de componentes reais com props fixas (rota temporária apagada).

Como comparei: abri cada par e olhei lado a lado nesta rodada. Não há montagem num só arquivo nem diff automático (o ambiente não tem Pillow nem ImageMagick). Medidas em pixel vêm da seção 13.4 da F41, feitas pelo ORLA; não as refiz.

Os frames do Figma trazem texto de legenda (leitor de tela, ordem de foco) abaixo da tela: é anotação do protótipo, não interface, e **não conta como divergência**.

## 2. Pares e estados

Legenda de situação: **Par** = os dois lados capturados; **Sem app** = existe no Figma, não há captura do app; **Ausente no código** = o frame prevê, o código não tem (divergência real, premissa 5); **N/A** = não se aplica, com justificativa.

### 2.1 Login

| Estado | Frame Figma | Captura do app | Situação | Divergências abertas (ver seção 3) |
|---|---|---|---|---|
| Vazio | `29:2` | `app-login-vazio.png` (rota real) | Par | R-01 |
| Carregando | `29:20` | `app-login-carregando.png` | Par | R-05 |
| Credencial inválida + campos vazios | `29:56` | `app-login-erro-validacao.png` | Par | R-01, R-02, R-03 |
| Falha de conexão | `29:35` | `app-login-erro-rede.png` | Par | R-02, R-04, R-06 |
| Preenchido (foco no Entrar) | `29:79` | `app-login-preenchido.png` | Par **sem o anel de foco** | R-07 (lacuna de captura) |
| Credencial inválida sozinha | não existe frame | não aplicável | **N/A**: o Figma junta o banner de 401 e os erros de campo no `29:56`; o código mostra os dois estados com os mesmos componentes. Não inventei frame. | — |

### 2.2 Perfil e diálogo de saída

| Estado | Frame Figma | Captura do app | Situação | Divergências abertas |
|---|---|---|---|---|
| Carregando | `33:2` (esqueleto de avatar, nome, e-mail e selo; "Sair" visível) | nenhuma | **Ausente no código**: o carregamento é spinner em tela em branco (`index.tsx`) | R-08 |
| Erro | `33:14` (popup com X sobre Perfil esmaecido; "Sair" fora da área esmaecida) | nenhuma | **Ausente no código** | R-08, R-04 |
| Preenchido (foco no Sair) | `33:33` | `app-perfil-preenchido.png` | Par **sem foco**; o app mostra a tab bar, o frame não | R-09, R-10 |
| Diálogo de saída | `33:49` | `app-perfil-confirmar-saida.png` | Par | R-04, R-11 |
| Vazio | — | — | **N/A**: a legenda do `33:33` diz "estado vazio e erro de validação: N/A". O Perfil sempre tem nome, e-mail e perfil vindos do login. | — |

### 2.3 Tab bar

| Estado | Frame Figma | Captura do app | Situação | Divergências abertas |
|---|---|---|---|---|
| Perfil selecionado | `39:3` | faixa inferior de `app-perfil-preenchido.png` | Par | R-12 |
| Perfil padrão (não selecionado) | `39:31` | nenhuma | **Ausente no código** (`MenuTabBar` fixa `selected: true`). Vira "N/A na Sprint 01" **só se a decisão 4 for aceita**. | R-13 |
| Perfil com foco | `39:58` | nenhuma | **Sem app**: o foco só foi testado em componente; não deu para forçar de fora | R-14 (lacuna de captura) |
| Quatro itens desabilitados | `39:3`, `39:31`, `39:58` | `app-perfil-preenchido.png` | Par: ordem Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro e opacidade reduzida **vistas** nos dois lados | R-12 |

## 3. Divergências abertas

Classificação: **R** = real; **P** = só de plataforma (não conta). "Caminho" segue a premissa 1: o código se ajusta ao Figma, salvo decisão da pessoa.

| ID | Tela / estado | Figma | App (captura) | Classe | Caminho | Origem |
|---|---|---|---|---|---|---|
| R-01 | Login vazio e erro | Placeholders "seu@email.com" e "Sua senha" em slate-700, tão escuros quanto o valor | Placeholders mais claros (slate-500) | Real | **Decisão 8** (recomendo manter o código e levar `color/text/placeholder` ao Figma: placeholder igual ao valor confunde quem tem baixa visão) | L-12 |
| R-02 | Login erro, popup de conexão | Ícone de alerta **triângulo cheio** (`29:60` e popups) | Ícone de alerta em **contorno** | Real (ver nota 1) | **Corrigido no código** (ORLA, `6b3c082`): `AlertIcon` com Ionicons `warning` (cheio) na faixa e no popup; visto em `app-login-erro-validacao.png` e `app-login-erro-rede.png` | novo |
| R-03 | Login credencial inválida | Faixa de erro com 44 de altura | 40 de altura | Real | **Corrigido no código** (ORLA, `6b3c082`): `layout.inlineAlertMinHeight` 44 em `inline-alert.tsx`; teste confere o `minHeight`. Medida em pixel da captura nova não feita (ver seção 9) | L-17 |
| R-04 | Login falha de conexão; Perfil erro; diálogo | Botão **Fechar (X)** 44×44 no canto do popup e do diálogo | Sem X | Real | **Decisão 1** (recomendo incluir, com chave i18n e foco voltando ao controle de origem) | L-10, P-08, D-02 |
| R-05 | Login carregando | Em `29:20`, "Senha", campo e botão ficam 14 px abaixo de `29:79` | O app segue `29:79` | Real, **defeito do Figma** | **Decisão 12** (recomendo corrigir o Figma) | L-16 |
| R-06 | Login falha de conexão | Atrás do popup: campos desabilitados e botão "Entrando..." | Atrás do popup: formulário editável | Real | Mudar isso altera comportamento (US-PAR-10): **decisão da pessoa**, sem default | L-10 (resto) |
| R-07 | Login preenchido | Anel de foco no Entrar (`29:79`) | Sem anel na captura | Lacuna de captura | Conferido só por teste de componente e pela captura do campo de e-mail (`app-login-foco-campo.png`, sem par no Figma). Precisa de aparelho | F-01 |
| R-08 | Perfil carregando e erro | Esqueleto com "Sair" visível; popup com X e só "Tentar novamente" | Não existem; hoje há spinner em tela em branco e o popup traz também "Entrar novamente" | Real | **Decisão 5** | P-07, P-08 |
| R-09 | Perfil preenchido | Divisor `#000000` sem variável | Divisor petro | Real | **Decisão 9** (recomendo ligar o Figma à variável petro) | P-09 |
| R-10 | Perfil preenchido | Nenhum frame mostra o Perfil **com** tab bar | App mostra o Perfil sobre a tab bar | Lacuna do Figma | **Decisão 11** (criar frame de composição; não altera aprovados) | P-10 |
| R-11 | Diálogo de saída | Botões Cancelar e Sair com 44 de altura | Botões de 48 | Real | **Decisão 10** (recomendo seguir o Figma e registrar a exceção do alvo de toque em `tokens.ts`: 44 atende WCAG 2.2 AA 2.5.8) | B-01 (diálogo) |
| R-12 | Tab bar | Ícones geométricos de referência (pessoa, carro, caixa, prancheta, barras) | Ionicons (`person`, `car-outline`, `list-outline`, `construct-outline`, `cash-outline`) | Real | **Decisão 3** (recomendo Ionicons como definitivo e atualizar o Figma) | T-03 |
| R-13 | Tab bar padrão | Frame `39:31` existe | Estado não renderizado no app | Real, ou N/A | **Decisão 4** | T-06 |
| R-14 | Tab bar com foco | Anel branco 2 px, 68×60 (`39:64`) | Sem captura; só teste de componente | Lacuna de captura | Precisa de aparelho (US-MENU-06 fica onde está) | T-02 |
| R-15 | Tab bar `39:8` × `39:35` | Rótulo "Perfil" muda de altura entre selecionado (y=44) e padrão (y=38) | Todos alinhados | Real, **defeito do Figma** | **Decisão 13** (recomendo corrigir o Figma) | T-08 |
| A-01 | Todas as telas com faixa petro | O frame não tem barra de status | A barra de status aparece com **texto escuro sobre a faixa petro** nas capturas; o app não define `StatusBar` e `userInterfaceStyle` é `automatic` (`app.config.ts:9`) | **Achado de acessibilidade, fora da tabela do Figma** | **Corrigido no código** (ORLA, `ad22425`): `ScreenHeader` monta `<StatusBar style="light" />`. Nas 8 capturas novas a hora e os ícones aparecem brancos sobre o petro (razão 12,12:1). Razão antiga com preto puro (limite inferior): 1,73:1. **Confirmar em aparelho**: o simulador usou `status_bar override` e tema claro; o caso do tema escuro do sistema não foi fotografado | novo |

Nota 1 (R-02): o ORLA classificou o ⚠ como só de plataforma, por ser glifo de fonte. Discordo: o ícone é parte do desenho do frame e a forma (cheio × contorno) é visível nos dois pares. Se a pessoa preferir manter como plataforma, vira P e sai da lista.

### 3.1 Só de plataforma (não contam)

- Fonte Inter nos frames × fonte do sistema no app; por isso a quebra de linha da mensagem do diálogo difere ("com / seu e-mail" no Figma, "e-/mail" no app).
- Barra de status, ilha dinâmica (aparece em algumas capturas e em outras não), altura do aparelho (800 do frame × 874 pt) e, por consequência, a posição vertical do diálogo.
- Sombra do popup.
- Spinner de "Entrando...": arco no Figma, indicador nativo do iOS no app. Mesma posição (antes do rótulo). Classifico como plataforma por ser o `ActivityIndicator` do sistema.
- Quantidade de pontos da senha mascarada (10 no frame, 14 no app): dado de exemplo diferente, não é estrutura.
- Frases de legenda dos frames.

### 3.2 Já conferido como igual (visto nas capturas)

Faixa petro com título e subtítulo; rótulos "E-mail" e "Senha"; olho da senha à direita; botão "Entrar" primary; banner de credencial inválida com fundo, borda e texto à esquerda; borda de erro e mensagens de campo; campos desabilitados em "Entrando..." sem olho; popup de conexão com título, mensagem e "Tentar novamente"; Perfil com avatar "AB", nome, e-mail, selo "ADMIN", divisor e "Sair" fixo no rodapé; diálogo com título, mensagem de apoio, Cancelar em contorno e Sair em primary; ordem e esmaecimento dos quatro itens desabilitados.

## 4. Contraste AA (US-PAR-15), recalculado hoje

Script Python rodado nesta sessão sobre os hex de `tokens.ts` (`python3 -I`, arquivo fora do repositório). Saída real:

```
barra de status preta sobre petro: 1.73:1
barra de status branca sobre petro: 12.12:1
placeholder slate-500 sobre branco: 4.76:1
slate-700 sobre branco: 10.35:1
branco sobre primary-600: 5.41:1
petro sobre branco: 12.12:1
```

Os demais pares das seções 5, 11.7 e 12.7 de `F41-conferencia-paridade.md` não foram recalculados agora. O único par abaixo de AA que aparece nas capturas é o A-01 (e só se o texto da barra for de fato preto).

## 5. Decisões que a pessoa precisa tomar

As numeradas 1 a 13 estão nas seções 7 e 12.8 de `F41-conferencia-paridade.md`. Sem elas, R-01, R-04, R-05, R-06, R-08 a R-13 e R-15 não fecham. R-02, R-03 e A-01 não pedem decisão: o ORLA pode corrigir (R-02 depende de aceitar a nota 1). Dúvidas 2 (aparelho físico), 4 (local das capturas e limite por arquivo) e 5 (F39 altera F34?) seguem abertas.

## 6. Tokens (US-PAR-07)

O lado código ganhou, depois da rodada de 12.5, `spacing.formTop` (30), `layout.pageButtonHeight` (52), respiro do anel 4 e `dialogMaxWidth` 296. **Não consegui criá-los como variáveis no Figma agora (ferramenta indisponível)**: `space/formTop`, `size/button/page`, o respiro do anel e a largura do diálogo seguem pendentes. Também faltam `color/text/placeholder` e `color/border/divider` (aguardam as decisões 8 e 9). A premissa 3 está descumprida para esses tokens.

## 7. O que ficou sem fazer

- Exportar os frames de novo pelo MCP e conferir nesta sessão se mudaram (ferramenta indisponível).
- Tarefas 3 e 5 (protocolo no aparelho físico e dados no aparelho) e a captura do app nos estados "Ausente no código", "Sem app" e com foco.
- Qualquer escrita no Figma.
- US-PAR-08 não fecha.

## 8. README

README sem mudança: só documentação.

## 9. Atualização do ORLA (2026-11-13): R-02, R-03 e A-01 fechadas no código

Ramo `feat/f41-paridade-correcoes`, commits `6b3c082` (R-02 e R-03) e `ad22425` (A-01). As 8 capturas do app em `f41-capturas/app-*.png` foram refeitas depois deles; tabela de md5 na seção 14 de `F41-conferencia-paridade.md`.

- Fechadas no código: R-02, R-03, A-01. Nenhuma depende de decisão, exceto R-02 pela nota 1 (apliquei o glifo cheio porque o frame o desenha assim).
- **Seguem abertas** (decisão da pessoa ou Figma): R-01, R-04, R-05, R-06, R-08 a R-13, R-15; lacunas de captura R-07 e R-14. Não toquei nelas.
- **Tokens:** `layout.inlineAlertMinHeight` (44) é token novo só no código. Entra na lista pendente da seção 6 para o Figma (`size/inlineAlert/minHeight`). O token `glyph.alert` foi removido de `tokens.ts` (sem uso).
- A medida em pixel da faixa de erro nova não foi feita (não há leitor de PNG no ambiente); a evidência é o teste de `minHeight` e a leitura visual da captura. US-PAR-08 **não fecha**.
