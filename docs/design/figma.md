# Arquivo Figma da operação OP-002

> **Referência de alta fidelidade (desde 2026-11-16, decisão da pessoa, F41):**
> https://www.figma.com/design/FPdB8RymAnN81pbKfizdzE (`FPdB8RymAnN81pbKfizdzE`, "Feito-pelo-Claude-Desing").
> Detalhe e lista viva de nós na seção "Referência F41 (FPdB8)" logo abaixo.
> O arquivo `DLqbSzzKRxiN2eyvXG73Lr` descrito a seguir é **histórico da v1** (F24, F25, F34): não é mais referência de paridade e não é editado.

- **Arquivo (histórico v1)**: OP-002 app-mecanica-sao-jorge
- **Link**: https://www.figma.com/design/DLqbSzzKRxiN2eyvXG73Lr
- **file_key**: `DLqbSzzKRxiN2eyvXG73Lr`
- **Pasta**: `team::1274094162661077353` / projeto `681115069` (pasta da operação)
- **Criado por**: ESQUADRO, via `create_new_file` (Figma MCP oficial `figma-remote`, OAuth, sem `FIGMA_TOKEN`), em 2026-11-07
- **Acesso**: confirmado com `whoami` antes da criação — handle "Leticia Moraes", plano "Time Pessoal" (`team::1274094162661077353`), sem bloqueio

Um arquivo por operação. Toda nova entrega de design desta operação (F24, e as
próximas F25+) continua neste mesmo arquivo, em páginas novas, sem criar
arquivo adicional.

## Referência F41 (FPdB8) — lista viva de nós aprovados

Lido por ESQUADRO em **2026-11-16** com o Figma MCP oficial (`figma-remote`), sessão `0aa749b1-35d2-40cf-aabc-92c54f24f036`.
Regra de edição e escopo: ADR-014, seção "Edição do arquivo de referência".

**Acesso (US-PAR-11), saída real de `whoami`:**
`{"handle":"Leticia Moraes","plans":[{"name":"Time Pessoal","seat":"Full","tier":"student","key":"team::1274094162661077353","role":"admin"}]}` (e-mail omitido aqui de propósito). Leitura de `get_metadata`, `get_screenshot`, `get_design_context` e `get_variable_defs` do arquivo `FPdB8RymAnN81pbKfizdzE`: sem erro de permissão.

**Páginas do arquivo:** `20:2131` "01 — Wireframes", `20:2132` "02 — Alta fidelidade", `1:66` "Componentes".
Na página `20:2132` há duas seções: `10:3936` "Mecânica São Jorge — 49 telas de alta fidelidade" (referência da F41) e `62:1529` "Complementos de fluxo — 9 telas de alta fidelidade" (6136, 0; **posterior à leitura de 14/11, fora do escopo da F41, não tocada**).

| Tela e estado | Frame | Nó (verificado por `get_metadata` em 16/11) | Captura "antes" |
|---|---|---|---|
| Login, estado inicial | 1a — Login | `10:895` (362 × 772; tela `10:900`, 362 × 742) | `f41-capturas/figma-fpdb8-login-vazio-10-895.png` |
| Login, erro de credencial | 1b — Login — erro de credencial | `10:936` | `f41-capturas/figma-fpdb8-login-erro-credencial-10-936.png` |
| Cabeçalho com botão de usuário (e padrão "Sem conexão") | 1c — Sem conexão (padrão global) | `10:981` | `f41-capturas/figma-fpdb8-ordens-sem-conexao-cabecalho-10-981.png` |
| Perfil | 1av — Perfil | `10:3842` | `f41-capturas/figma-fpdb8-perfil-10-3842.png` |
| Diálogo de logout | 1aw — Sair — confirmação | `10:3886` | `f41-capturas/figma-fpdb8-logout-10-3886.png` |
| Tab bar, Ordens selecionado | símbolo `Alta fidelidade / Navegação inferior / Ordens · Clientes · Catálogo · Financeiro` | **`20:1102`** (360 × 62) | `f41-capturas/figma-fpdb8-tabbar-ordens-20-1102.png` |
| Tab bar, Clientes selecionado | mesmo nome, sufixo `/ 2` | **`20:1340`** (360 × 62) | `f41-capturas/figma-fpdb8-tabbar-clientes-20-1340.png` |
| Cabeçalho "Ordens de Serviço" com botão de usuário | símbolo `Alta fidelidade / Cabeçalho / Ordens de Serviço` | `20:1079` (360 × 56) | — |
| Cabeçalho "Perfil" com seta de voltar | símbolo `Alta fidelidade / Cabeçalho / Perfil` | `20:2083` | — |
| Botão Entrar | símbolo | `20:1073` (304 × 50) | — |
| Cartão do Perfil | símbolo | `20:2097` (328 wide) | — |

**Id da tab bar (achado 11 do CARTOGRAFO), verificado por `get_metadata` em 16/11:** os dois ids existem e não se contradizem. **`20:1102`** é o **componente** (símbolo, na seção "Componentes reutilizáveis", 360 × 62) e **`20:1103`** é a **instância** dele posicionada dentro do frame 1c (x 1, y 679, 360 × 62; mesmos 4 itens de 90 × 62, ícone 22 em x 34 / y 11,5, rótulo em y 37,5). A referência de paridade é o componente (`20:1102` Ordens selecionado, `20:1340` Clientes selecionado); `20:1103` é só onde ele aparece na tela. O ADR-014 pode citar os dois, com essa distinção.

**Capturas "antes":** exportadas em 1x lógico (410 × 804 com margem do frame de apresentação; as da tab bar em 360 × 62), todas abaixo de 100 KB. Guardam o estado dos frames **antes de qualquer edição da F41** (regra de edição, passo 2).

**Variáveis do arquivo (leitura de `get_variable_defs` em `10:895`):** o arquivo foi gerado por importação de HTML e as variáveis têm **nome automático por matiz e luminosidade**, sem papel (`color/cyan/18` = `#1E3A3F`, `color/red/47` = `#B5453D`, `color/grey/96` = `#F7F5F2`, `color/orange/87` = `#E2DEDA`, `color/grey/42` = `#6E6A66`, `color/grey/64` = `#A8A39D`, `color/grey/70` = `#B7B2AC`, `color/cyan/28` = `#33575D`, `color/grey/93-3` = `#F6E7E5`, `color/red/79` = `#E2B5B0`, `color/red/38` = `#923631`). Isso **foge da convenção `<categoria>/<papel>/<estado>`** da casa; a coleção `OP-002 Identidade v2` do ADR-014 é quem corrige, e só entra depois da aprovação dos tokens (US-PAR-07). Até a leitura de 14/11 nenhuma variável semântica existia; **em 16/11 foi criada a coleção `OP-002 Identidade v2` com 6 variáveis** (ver "Sessão de 16/11 com acesso ao Figma" mais abaixo).

### Seção "F41 — estados propostos" (`82:1989`, página `20:2132`, x 7800, y 0)

Criada por ESQUADRO em 2026-11-16 via `use_figma`, só com nós novos (cópias dos frames de referência e frames novos). **Todos aguardam aprovação da pessoa**; enquanto isso **não** fazem parte da lista viva de nós aprovados acima (regra do ADR-014). Sem variável criada.

| Frame | Nó | Captura |
|---|---|---|
| L1 Login — preenchido — proposto | `82:1990` | — |
| L2 Login — carregando — proposto | `82:2024` | — |
| L3 Login — erro de conexão — proposto | `82:2058` | — |
| L4 Login — sessão expirada — proposto | `82:2098` | — |
| P1 Perfil — carregando — proposto | `83:712` | `f41-capturas/figma-fpdb8-proposto-perfil-carregando-83-712.png` |
| P2 Perfil — erro ao carregar — proposto | `83:754` | `f41-capturas/figma-fpdb8-proposto-perfil-erro-83-754.png` |
| T1 Tab bar — foco no item — proposto | `83:817` | `f41-capturas/figma-fpdb8-proposto-tabbar-foco-83-817.png` |
| T2 Tab bar — módulos indisponíveis — proposto | `83:844` | `f41-capturas/figma-fpdb8-proposto-tabbar-desabilitada-83-844.png` |
| C1 Cores AA propostas | `85:744` | `f41-capturas/figma-fpdb8-proposto-cores-aa-85-744.png` |

Observação de método: a instrução `figma-use` não pôde ser carregada nesta sessão; cada passo foi conferido por `get_screenshot`.

A conferência da F41 (planilha, tokens, contraste e estados propostos) está em `docs/design/F41-planilha-fpdb8.md`. Desde 16/11 a prova de paridade é a planilha de valores `docs/design/F41-valores-fpdb8.md` (sem capturas lado a lado).

**Sessão de 16/11 sem acesso ao Figma (ESQUADRO, US-PAR-11).** O ambiente informou que o servidor `figma-remote` exige autenticação e a sessão é não interativa; nenhuma ferramenta `mcp__figma-remote__*` ficou disponível. **Não houve chamada, então não há saída de `whoami` desta sessão.** Nada foi lido nem editado no Figma. Para liberar: `claude mcp login figma-remote` em sessão interativa. Pendente por isso: criar as 3 variáveis aprovadas (placeholder Flint, borda de campo `#8C8780`, aba selecionada `#EE8279`) e religar L1 a L4, C1, T1, T2, `20:1102` e `20:1340`; ajustar o P2 `83:754` (botão cheio + contorno); propor o frame Início; exportar o escudo de `10:895` com origem e liberação.

### Sessão de 16/11 com acesso ao Figma (ESQUADRO, US-PAR-07, US-PAR-11) — o que foi feito

**Saída real de `whoami` (e-mail omitido de propósito):** `{"whoami":{"user_id":"1126488233271433922","handle":"Leticia Moraes","plans":[{"name":"Time Pessoal","seat":"Full","tier":"student","key":"team::1274094162661077353","role":"admin","specs_enabled":true,"code_layers_enabled":true}]}}`. `create_session` no `FPdB8RymAnN81pbKfizdzE` devolveu a sessão `dabe8d86-f507-4d5c-8b04-08048d17d893`. Nenhum erro de permissão em `get_metadata`, `get_design_context`, `get_variable_defs`, `get_screenshot` e `use_figma`.

**Método:** a instrução `figma-use` não pôde ser carregada (não há `get_figma_skill` nem recurso de skill disponível nesta sessão). Cada escrita foi feita em passo pequeno, com leitura do estado antes e conferência depois (leitura por código e `get_screenshot`). Só toquei os nós listados abaixo.

**Coleção criada: `OP-002 Identidade v2`** (`VariableCollectionId:89:712`, modo "Padrão"). Só tem o que a F41 aprovou; **as outras ~70 linhas da tabela do ADR-014 não foram criadas** (ver "Não feito").

| Variável | Id | Valor | Aponta para | Escopo |
|---|---|---|---|---|
| `primitive/flint` | `89:713` | `#6E6A66` | — | todos |
| `primitive/stone` | `89:714` | `#8C8780` | — | todos |
| `primitive/coral` | `89:715` | `#EE8279` | — | todos |
| `color/text/placeholder` | `89:716` | `#6E6A66` | `primitive/flint` | texto |
| `color/border/default` | `89:717` | `#8C8780` | `primitive/stone` | traço |
| `color/text/tabSelected` | `89:718` | `#EE8279` | `primitive/coral` | texto, preenchimento, traço |

A descrição das três semânticas guarda o antes e o depois com a razão de contraste (ADR-014, regra 16).

**Nós religados (lidos de volta por `get_variable_defs`):**

- `color/text/placeholder`: textos `10:926`, `10:933` (frame `10:895`), `82:2117`, `82:2122` (L4). L1, L2 e L3 não têm placeholder (campos preenchidos).
- `color/border/default`: traço dos campos em repouso `10:932`, `82:2008`, `82:2013`, `82:2042`, `82:2047`, `82:2076`, `82:2081`, `82:2116`, `82:2121`. **Não foi religado** o traço dos campos em Crail (`10:925`, `10:960`, `10:965`: foco e erro) nem a borda externa das telas e do cartão (Westar, decorativa).
- `color/text/tabSelected`: rótulo `10:1023` e ícone (`I10:1020;10:42`, `I10:1020;10:43`) em **`20:1102`**; rótulo `10:1141` e ícone (`I10:1136;10:95` a `10:98`) em **`20:1340`**. Como T1 `83:817` é instância de `20:1340`, ele herdou: a leitura posterior achou 5 elementos em `#EE8279` e nenhum em Crail. T2 `83:844` não mudou (os 4 itens continuam em Tide a 50%).
- Efeito colateral aceito: toda instância desses dois componentes no arquivo passa a mostrar o item selecionado em `#EE8279` (é o propósito do componente; o ADR-014 pede isso).

**P2 `83:754`:** botão `83:770` "Tentar novamente" agora é cheio (preenchimento e traço `color/red/47` = Crail, texto `color/white/solid`); `83:815` "Entrar novamente" continua em contorno petro. Medidas intactas (328 × 50, raio 8).

**C1 `85:744`** (criado por mim): título trocado de "aguardam aprovação" para "aprovadas em 16/11/2026" e nome do quadro atualizado. Os exemplos dentro dele continuam com hex direto, de propósito: mostram o antes e o depois.

**Novo frame proposto I1 `89:971` — Início, estado vazio** (na seção `82:1989`, x 1550, y 1850; a seção cresceu de 2450 para 2650 de altura). Tela `89:976` (362 × 742, Pampas): cabeçalho `89:996` (instância de `20:1079`, título "Início", botão de usuário 36 × 36), círculo `89:979` (72, `color/grey/91`) com ícone de documento de 32 (variante 18 da tab bar, traço Spectra, **escolha minha**: o frame não tem ícone de "em breve"), título `89:981` "Em breve" (Barlow Condensed SemiBold 20, petro), mensagem `89:984` "Os módulos da oficina chegam nas próximas versões." (Inter 14 / 21, Flint, centralizada), tab bar `89:1003` (cópia do T2: 4 itens a 50%). Textos, ícone e posições são **proposta minha, não valor do Figma de referência**. **Aguarda aprovação da pessoa**; até lá não faz parte da lista viva (D-20: Início está fora do aceite da F41).

### Releitura de L2, L3, L4, L1, P1, P2 e T1 (16/11, com acesso)

| Nó | Leitura |
|---|---|
| L2 `82:2024` botão `82:2049` | texto **"Entrando…"** (um caractere U+2026), preenchimento Crail a **100%** de opacidade (botão e texto), indicador `82:2137` elipse 16 × 16 branca, arco de 270°, à esquerda do texto |
| L3 `82:2058` caixa `82:2092` | Pot Pourri `#F6E7E5`, borda Rose Fog `#E2B5B0` 1 px, raio 8, margem 13, espaço 10, ícone 18, texto **"Sem conexão. Verifique a internet da oficina e tente de novo."** El Salva `#923631`, Inter Regular 14 / 19,6, caixa de 66 de altura entre a senha e o botão |
| L4 `82:2098` caixa `82:2131` | mesma caixa e estilo, texto **"Sua sessão expirou. Faça login novamente."**, **acima** do campo Usuário (entre o bloco da marca e o formulário); placeholders "Seu usuário" e "Sua senha" agora em `color/text/placeholder` |
| L1 `82:2023` / L2 `82:2057` | ação da senha com texto visível **"Mostrar"** (a camada se chama "Mostrar senha"), Inter **Medium 13**, Flint |
| P1 `83:712` | indicador `83:752` elipse 36, petro; texto `83:753` **"Carregando sessão…"** (U+2026), Inter Regular 14, Flint, 12 abaixo do indicador; fundo Pampas |
| P2 `83:754` | círculo 72 em `color/grey/91` `#EDE9E4`; ícone 32 (variante 5, Spectra); título "Não foi possível carregar" Barlow Condensed SemiBold **20**, petro; mensagem Inter Regular **14 / 21**, Flint, centralizada, 289 de largura; botões de 328 × 50 empilhados com 12 de espaço, rodapé |
| T1 `83:817` anel `84:786` | retângulo 86 × 58, traço branco 2 px **por dentro**, **raio 10**, 2 px de respiro dentro da célula de 90 × 62; legenda: 12,12:1 sobre petro |

### Não feito nesta sessão (declarado)

- Escudo 84 × 96 de `10:895`: **não exportado** (origem e liberação de uso sem registro; D-21 deixa fora do aceite da F41). Nenhum substituto foi inventado.
- Frame Início: só proposto (I1), sem aprovação.
- Coleção completa do ADR-014 (cores restantes, medidas, raios, espaçamentos, estilos de texto e efeitos): **não criada**; só as 3 variáveis que a F41 aprovou. Nenhum frame além dos listados foi ligado a variável nova.
- Capturas em arquivo: o shell bloqueou o download dos PNGs, então conferi cada frame por `get_screenshot` em linha, sem gravar imagem no repositório.

### Segunda sessão de 16/11 com acesso (ESQUADRO, US-PAR-07, US-PAR-11): variáveis dos 6 tokens, Início aprovado, capturas

Detalhe completo, com valor lido e id por linha, em `docs/design/F41-valores-fpdb8.md` §17. Resumo:

- **Acesso:** `whoami` passou (handle "Leticia Moraes", plano "Time Pessoal" `team::1274094162661077353`, e-mail omitido); `create_session` → `f942924b-db78-4ddd-9c88-84d37812bdd6`. `figma-use` não pôde ser carregado; escrita em passos pequenos, com leitura antes e depois.
- **Coleção `OP-002 Identidade v2` (`89:712`): de 6 para 14 variáveis.** Novas: `primitive/grey91` `92:761` (`#EDE9E4`), `primitive/spectra` `92:762` (`#33575D`), `color/surface/neutral` `92:763`, `color/icon/state` `92:764`, `size/stateIcon` `92:765` (72), `iconSize/alert` `92:766` (32), `radius/tabFocus` `92:767` (10), `layout/stateActionsMaxWidth` `92:768` (328). Estilo de texto novo `OP-002/stateTitle` (Barlow Condensed SemiBold 20). Os 6 tokens que o ORLA criou no código (`neutral`, `icon.state`, `stateIcon`, `stateTitle`, `tabFocus`, `stateActionsMaxWidth`) agora existem no Figma com o valor do `tokens.ts`; `iconSize/alert` entra porque o Início I1 e o P2 usam o ícone de 32.
- **Ligações (conferidas por `get_variable_defs`):** P2 `83:763` (fundo e 72 × 72), `83:764` (32 e traço Spectra), `83:767` (estilo), `83:770` e `83:815` (largura 328); I1 `89:979`, `89:980`, `89:983`; T1 anel `84:786` (raio 10). Raio dos círculos fica em 36 sem variável (ligá-lo à variável de 72 foi um erro meu e foi desfeito na mesma sessão).
- **Início I1 `89:971`:** **aprovado pela pessoa em 16/11**; entra na lista viva de nós aprovados (a D-20 cai). Lido por valor; o código diverge em I-1 a I-6 (círculo, ícone 32, título 20 Barlow, mensagem 14 / 21, espaços 16 e 10).
- **Releitura por valor de L2, L3, L4:** textos e caixas batem com o código; L2 tem a diferença R-11 (indicador a 6,5 do texto, texto centralizado, contra `gap` 8 no código).
- **Capturas:** 15 PNGs dos frames de Login, Perfil, diálogo, tab bar e Início em `docs/design/f41-capturas/final-2026-11-16/` (todas abaixo de 100 KB; só lado Figma, sem app).
- **Não feito:** escudo (D-21), restante da tabela do ADR-014 (~70 linhas) e rótulos "proposto" dos frames L1 a L4, P1, P2, T1, T2 e I1, ainda no texto de cada frame.

### Terceira sessão de 16/11 com acesso (ESQUADRO, US-PAR-07, US-PAR-11): 2 variáveis, R-11, I1 e L2 relidos, lista fechada

Detalhe completo em `docs/design/F41-valores-fpdb8.md` §19. Resumo:

- **Acesso:** `whoami` passou (handle "Leticia Moraes", plano "Time Pessoal" `team::1274094162661077353`, e-mail omitido); `create_session` → `82501eec-57a2-4d20-be22-fcb0a288a02d`. `figma-use` não pôde ser carregado; escrita em passos pequenos, com leitura antes e depois.
- **Coleção `OP-002 Identidade v2` (`89:712`): de 14 para 16 variáveis.** Novas: `layout/stateMessageMaxWidth` `94:712` (289) e `size/loadingIndicator` `94:713` (16), escopo só largura e altura. Ligadas a `83:769` e `89:985` (largura) e a `82:2137` (largura e altura); lidas de volta por `get_variable_defs` em `89:971`, `83:754` e `82:2024`.
- **R-11 decidida a favor do código (6 = `spacing.s6`):** o indicador `82:2137` do L2 foi movido de x 102 para 102,5, deixando 6 até o texto "Entrando…" (antes 6,5). PNG do L2 reexportado.
- **Releitura:** I1 e L2 batem com o código `3c8df54` e `7f9db9f` (I-1 a I-6 fechadas).
- **Confirmado no arquivo:** o Perfil `10:3842` não desenha tab bar; T2 a 50%, T1 com anel 86 × 58 raio 10 branco; `20:1102` e `20:1340` desenham um item selecionado, que o código não renderiza (P-01, aguarda a pessoa).
- **Achado novo, P2 `83:754`:** gaps 16 e 10 (código 24 e 8), botões ancorados na base com 12 entre eles (código 10, agrupados com a mensagem). R-12, R-13 e R-14, do lado do código.
- Nenhum frame fora de Login, Perfil, diálogo, tab bar e Início foi editado.

## Páginas

### `F24 · Wireframe baixa fidelidade`
Wireframe de baixa fidelidade das 24 telas da Feature F24, a partir da
especificação em `docs/design/F24-wireframe-baixa-fidelidade.md`. Conteúdo
fictício (seção 5 daquela spec), sem nenhum dado real da oficina.

**Organização**: cada tela ocupa uma linha (offset vertical de 1800 px por
tela, na ordem 01 a 24); cada estado aplicável ocupa uma coluna (offset
horizontal de 420 px: Vazio, Carregando, Erro de rede, Erro de validação,
Preenchido). Frame mobile fixo em 360 px de largura, altura dinâmica
conforme o conteúdo de cada tela (lista ou formulário mais longo = frame mais
alto, representando rolagem).

**Nomenclatura de frame**: `[nº da tela] Nome da tela / Estado` — ex.:
`03 Clientes · lista / Vazio`. A tela 24 (Financeiro · lançamentos), por
reunir lista e formulário de lançamento manual na mesma tela, tem os estados
"Preenchido" desdobrados em dois frames (`Preenchido (lista)` e
`Preenchido (formulário)`) e os estados de erro de rede/validação
identificados com o sufixo `(lista)`/`(formulário)`, mantendo cada frame
identificável pelo nome (US-DES-01).

**94 frames no total** (93 células da matriz de cobertura da seção 7 da spec
+ 1 frame extra para desdobrar "24 · Preenchido" em lista e formulário).
Nenhuma célula "—" da matriz (vazio ou erro de validação não aplicável a uma
tela) virou frame — confirmado contra a matriz antes de fechar a entrega.

**Padrões de acessibilidade aplicados em todos os frames** (US-DES-03):
- Todo campo tem rótulo de texto visível acima da caixa (nunca só
  placeholder).
- Campo somente leitura é sinalizado no próprio rótulo ("(somente leitura)")
  e com fundo diferenciado.
- Todo erro de campo é texto ("! mensagem") abaixo do campo, nunca só borda
  vermelha — a borda vermelha acompanha o texto, não substitui.
- Estado "Estoque baixo" (tela 13) e badges de status (perfil, parcela) usam
  ícone/símbolo + texto, nunca só cor.
- Segmented control (Catálogo e Financeiro, seção 4.6 da spec) marca a aba
  ativa com negrito + sublinhado, as duas opções sempre com rótulo visível.
- Toda tela carrega uma legenda final (itálico, cinza) com a ordem de foco
  e/ou o texto que o leitor de tela deve anunciar ao entrar no estado
  (loading e erro de rede), e a nota "N/A" quando um estado da matriz não se
  aplica àquela tela.
- Estado de erro de rede segue padrão único nas 24 telas: ícone de alerta +
  "Não foi possível carregar" + "Verifique sua conexão e tente novamente" +
  botão "Tentar novamente".

## Pendência conhecida (registrar para CRIVO)
Não revisei célula por célula com zoom todas as 94 telas após a montagem —
validei visualmente por amostragem (8 telas de tipos diferentes: formulário
simples, formulário longo multi-seção, lista com ação secundária, lista com
segmented control, detalhe com histórico, e os três estados de erro) mais a
conferência estrutural via `get_metadata` (nomes das 94 frames contra a
matriz da spec). Não é uma verificação exaustiva de todas as 94 telas
individualmente — registrado como o que foi checado de fato, não suposto.

## Fechamento de resíduos (2026-11-07, ESQUADRO)

A pedido do REGENTE, reli o arquivo real (não só esta spec) com `get_metadata`
sobre a página inteira (118 frames: 94 de tela/estado + 24 popups novos) e
achei três resíduos reais, confirmados por XML antes de qualquer correção —
não presumidos:

1. **US-DES-13 violado em 24 telas**: o estado "Erro de rede" tinha sido
   construído como **tela cheia substituindo o conteúdo** (só ícone + título +
   texto + botão sobre fundo branco), e não como popup sobre a tela, como a
   Premissa 5 e o US-DES-13 exigem. Corrigido nas 24 telas: cada frame "Erro
   de rede" agora traz o conteúdo de fundo da própria tela (clonado do estado
   "Carregando" correspondente, mesma estrutura/skeleton), uma sobreposição
   escurecida (preto a 50% de opacidade) e um cartão modal centralizado
   (branco, cantos arredondados, sombra) com o ícone, "Não foi possível
   carregar", "Verifique sua conexão e tente novamente." e o botão "Tentar
   novamente" — mantendo o conteúdo de fundo visível, porém inativo. A legenda
   de leitor de tela foi reescrita por tela ("Erro ao carregar [nome da
   tela]"), com um fundo sutil atrás dela para manter contraste de leitura
   sobre o conteúdo esmaecido (necessário sobretudo na tela 18, formulário
   mais alto que as demais, 826 px).
2. **US-DES-12 violado em 47 textos**: mensagens de erro (banners de erro de
   rede dentro de formulários e mensagens de erro de validação por campo)
   começavam com `"! "`, contra a regra explícita de não iniciar com `"!"`.
   Removido o prefixo nos 47 nós de texto, mantendo o conteúdo da mensagem.
3. **US-DES-11 violado em 17 textos**: placeholder de busca usava o emoji
   `🔍` ("🔍 Buscar cliente" etc., 9 ocorrências em Clientes/Serviços/Peças) e
   a alternância "Ativo" usava o emoji `🟢` ("🟢 Ativo", 8 ocorrências em
   Serviços e Peças editar). Removidos os dois emojis, mantendo só o texto
   (o rótulo "Busca" acima do campo e o texto "Ativo" já cumpriam a função,
   sem depender do emoji).

**Como foi verificado**: script Python sobre o XML de `get_metadata` (salvo
localmente) para localizar e contar cada ocorrência antes de corrigir;
correção aplicada via `use_figma` (API de plugin) node a node, usando os ids
reais; nova varredura completa do XML após a correção confirmando 0
ocorrências residuais de `"! "` no início de texto e 0 ocorrências de emoji
colorido (faixa Unicode de pictogramas), com os 94 frames de tela/estado
preservados (nenhum apagado) e 24 popups novos (118 frames no total). Validado
visualmente com `get_screenshot` em 5 telas (Login erro de rede, Clientes
lista erro de rede, Peças lista erro de rede, OS criar erro de rede — a mais
alta/complexa — e Login erro de validação, para confirmar que a correção do
"!" não quebrou a leitura da mensagem).

**O símbolo `⚠`** (ícone de alerta, presente em todos os estados de erro)
foi mantido: é um glifo de aviso (dingbat), não um emoji colorido, e já era a
decisão de design registrada para representar "ícone de alerta" nesta etapa
de baixa fidelidade, sem ícone vetorial.

**Pendência que segue de pé, não coberta por este fechamento**: a tela 18
(OS · criar, erro de rede) ainda tem um leve bleed visual de 1-2 px de
conteúdo esmaecido nas bordas do fundo de contraste da legenda, por ser a
única tela mais alta que o padrão (826 px vs. 800 px) com seções muito
compactas; não afeta a leitura da legenda nem é uma violação de critério de
aceitação, registrado aqui como polimento visual menor para quando a F24
virar protótipo de alta fidelidade.

### `F25 · Protótipo alta fidelidade` (2026-11-07, ESQUADRO)

Protótipo navegável de alta fidelidade das telas **01 Login** e **02 Perfil**,
a partir de `docs/product/F25-prototipo-login-perfil.md` (critérios
US-PROTO-LGN-01 a 10, texto e dado fictício fixados na seção 8 daquele PRD) e
reaproveitando a estrutura/coordenadas do wireframe F24 (frames `3:3`, `3:15`,
`3:29`, `3:45`, `3:58`, `3:66`, `3:79` da página anterior), com os tokens
petro/primary aplicados por cima.

**Página**: `28:2`. **9 frames**, grade 360×800, offset horizontal 420 px por
estado (linha Login em y=0, linha Perfil em y=1800, mesma convenção da F24):

| Frame | id | Observação |
|---|---|---|
| 01 Login / Vazio (pós-logout) | `29:2` | Campos vazios; novo em relação à F24 (necessário como destino do logout, US-PROTO-LGN-10) |
| 01 Login / Carregando | `29:20` | Campos desabilitados (fundo skeleton), spinner no botão |
| 01 Login / Erro de rede | `29:35` | Popup sobre o conteúdo esmaecido (mesmo padrão corrigido na F24) |
| 01 Login / Erro de validação | `29:56` | Banner de credencial + erro por campo |
| 01 Login / Preenchido | `29:79` | Com anel de foco ilustrado no botão "Entrar" |
| 02 Perfil / Carregando | `33:2` | Skeleton nos dados; "Sair" visível com opacidade reduzida |
| 02 Perfil / Erro de rede | `33:14` | Popup; "Sair" fora da área esmaecida, sempre acessível |
| 02 Perfil / Preenchido | `33:33` | Com anel de foco ilustrado no botão "Sair" |
| 02 Perfil / Confirmar saída | `33:49` | Novo nesta feature (US-PROTO-LGN-10): tela cheia com fundo de Perfil esmaecido + diálogo central "Deseja realmente sair?" |

Não há frame "02 Perfil / Erro de validação" nem "Vazio" (Perfil sempre tem
usuário logado, sem formulário) — ausência já prevista e aceita pelo
US-PROTO-LGN-02.

**Tokens (Figma Variables, coleção `OP-002 Tokens de cor`, id
`VariableCollectionId:28:3`)**: implementados em dois níveis — primitivo e
semântico (o nível "componente" da convenção da casa foi absorvido no
semântico por limite de tempo desta entrega; registrado como simplificação,
não omissão silenciosa).

Primitivos: `primitive/color/petro-900` (`#1E3A3F`), `primary-600`
(`#B5453D`), `white` (`#FFFFFF`) — os três do briefing/PRD — mais quatro
introduzidos por mim para cobrir texto secundário, bordas e fundo de
skeleton/overlay (Dúvida 2 do PRD F25, seção 5.2): `slate-700` (`#334155`),
`slate-500` (`#64748B`), `slate-200` (`#E2E8F0`), `slate-100` (`#F1F5F9`),
`overlay-scrim` (`#000000` a 50%).

Semânticos (alias para os primitivos): `color/surface/default`,
`/skeleton`, `/brand`, `/overlay`; `color/text/primary`, `/onBrand`,
`/secondary`, `/onPrimaryAction`, `/error` (reaproveita `primary-600` — não
criei uma cor de erro nova, decisão deliberada para não introduzir um tom sem
contraste calculado); `color/border/default`, `/skeleton`;
`color/action/primary/background`; `color/focus/ring` (petro),
`/ring-offset` (branco).

**Contraste verificado por mim** (fórmula de luminância relativa WCAG, mesmo
método da Premissa 5 do PRD), para os quatro tokens novos usados em texto ou
borda:

| Combinação | Razão | Uso | Resultado |
|---|---|---|---|
| `slate-700` sobre branco | 10,35:1 | texto secundário (rótulo, e-mail, legenda) | passa AA (texto normal) |
| `slate-500` sobre branco | 4,76:1 | borda de campo (não-texto, mínimo 3:1) | passa |
| `petro-900` sobre `primary-600` | 2,24:1 | — descartado como anel de foco direto sobre botão | não usado isoladamente por isso |
| branco sobre `primary-600` | 5,41:1 (igual à Premissa 5) | halo do anel de foco sobre o botão | passa |

**Anel de foco**: por `petro` sozinho não ter contraste suficiente sobre o
botão `primary` (2,24:1, tabela acima), usei um anel duplo — 2 px `petro`
(anel externo) + 2 px branco (halo entre o anel e o elemento) — padrão comum
de indicador de foco acessível que garante ≥3:1 tanto sobre fundo branco
(petro a 12,1:1) quanto sobre o botão primary (branco a 5,4:1). Ilustrado
nos frames "01 Login / Preenchido" (botão Entrar) e "02 Perfil / Preenchido"
(botão Sair); a legenda de cada frame descreve a ordem de foco completa.

**Navegação (modo Prototype)**: 10 reações `ON_CLICK` → `NAVIGATE` com
transição Smart Animate, configuradas via `setReactionsAsync` e **relidas por
mim depois de gravadas** (não presumi que a gravação funcionou):

| Origem | Ação | Destino |
|---|---|---|
| Login Vazio (`29:16`) | Entrar | Login Carregando (`29:20`) |
| Login Erro de validação (`29:75`) | Entrar | Login Carregando (`29:20`) |
| Login Erro de rede, popup (`29:52`) | Tentar novamente | Login Carregando (`29:20`) |
| **Login Preenchido (`29:93`)** | **Entrar** | **Perfil Preenchido (`33:33`)** |
| Perfil Erro de rede, popup (`33:27`) | Tentar novamente | Perfil Carregando (`33:2`) |
| Perfil Erro de rede (`33:29`) | Sair | Confirmar saída (`33:49`) |
| Perfil Carregando (`33:10`) | Sair | Confirmar saída (`33:49`) |
| **Perfil Preenchido (`33:43`)** | **Sair** | **Confirmar saída (`33:49`)** |
| **Confirmar saída (`33:65`)** | **Cancelar** | **Perfil Preenchido (`33:33`)**, sem encerrar sessão |
| **Confirmar saída (`33:67`)** | **Sair (confirmar)** | **Login Vazio (`29:2`)** |

As cinco linhas em negrito são os caminhos exigidos literalmente pelo PRD
(US-PROTO-LGN-03 e US-PROTO-LGN-10); as demais (retry de carregamento) são
reforço de fidelidade ao wireframe, não exigência explícita do Gherkin.
Nenhuma tela fica órfã: Perfil só é alcançável a partir de Login Preenchido,
e isso está cumprido. Ponto de partida do fluxo (`flowStartingPoints`)
marcado em "01 Login / Vazio".

**Decisão de escopo não coberta pelo Gherkin, registrada para CRIVO avaliar**:
o botão "mostrar/ocultar senha" (ícone de olho, alvo de toque 44×44) não tem
reação de navegação — é uma interação local (alternar máscara do campo), não
uma navegação entre telas. Interpretei "ação clicável" do US-PROTO-LGN-03
como as ações que mudam de tela (Entrar, Sair, Tentar novamente, Cancelar,
Confirmar), não todo elemento tocável do formulário. Se CRIVO ou BUSSOLA
discordarem dessa leitura, é ajuste pequeno (criar um frame alternativo de
"senha visível" e uma reação local), não revisão estrutural.

**Decisões de copy (Dúvida 3 do PRD F25)**: mantive "Sair" como rótulo do
botão de confirmação dentro do diálogo (em vez de "Confirmar saída"), igual
ao botão que abre o diálogo — distinguidos por posição (sempre a segunda
ação, com `primary`, contra "Cancelar" em `secondary`/outline à esquerda/
acima) e pelo contexto do diálogo, não por texto diferente. Acho que isso é
suficientemente claro, mas é decisão minha, não imposição do PRD; BUSSOLA
pode pedir "Confirmar saída" na revisão sem implicar retrabalho estrutural.

**O que eu verifiquei de fato, e o que não pude verificar**:
- Chamei `get_metadata` depois de cada etapa de construção e confirmei a
  árvore de nós esperada (nenhum frame perdido, nenhum node duplicado) antes
  de seguir para a etapa seguinte.
- Tirei `get_screenshot` das 9 telas (não só amostragem) e look visual
  bate com o esperado: tokens aplicados, popups sobre conteúdo esmaecido
  (não tela cheia), "Sair" visível fora da área do popup em Perfil/Erro de
  rede, anel de foco duplo visível nos dois botões primários ilustrados.
- Configurei as 10 reações via `setReactionsAsync` e **reli cada uma com
  `node.reactions`** depois de gravar, confirmando `destinationId`,
  `navigation: "NAVIGATE"` e o trigger `ON_CLICK` exatamente como pretendido
  — não presumi que a chamada tinha funcionado só porque não lançou erro.
- **Não verifiquei** o clique real em modo Present/Play (não tenho navegador
  interativo nesta sessão): a confirmação de que a transição "funciona" ao
  vivo, com a animação e o teclado/leitor de tela reais, depende de alguém
  abrir o link do Figma em modo de apresentação. O que relato é: os dados de
  reação estão gravados e corretos na árvore do documento, lidos de volta por
  mim.
- Calculei o contraste dos quatro tokens novos (tabela acima) pela mesma
  fórmula da Premissa 5 do PRD — não usei uma ferramenta externa de
  contraste como segunda fonte; se BUSSOLA/CRIVO quiserem conferir com outra
  ferramenta, é bem-vindo.
- Não testei leitor de tela real (VoiceOver/TalkBack) sobre o protótipo — as
  legendas de cada frame descrevem o que o leitor de tela *deveria* anunciar
  (mesma convenção da F24), não uma gravação de um teste real, porque o
  protótipo Figma não tem semântica de acessibilidade executável (isso só
  existe depois da F30, no app real).

**Próximo passo**: handoff para CRIVO conferir US-PROTO-LGN-01 a 04 e 08 a
10 contra este arquivo; BUSSOLA decide a aprovação/reprovação formal na
tabela de registro de execução do PRD F25 (US-PROTO-LGN-05/06), incluindo
decidir as duas divergências de escopo/copy registradas acima.

### `F34 · Tab bar alta fidelidade` (2026-11-07, ESQUADRO)

Protótipo de alta fidelidade do Menu principal (tab bar inferior), a partir
dos critérios US-PROTO-MENU-01 a 05 fixados diretamente no briefing da
operação (sem PRD próprio de BUSSOLA — rota desta feature é ESQUADRO → CRIVO).
Reaproveita integralmente os tokens e a coleção de variáveis já criados na
F25 (`VariableCollectionId:28:3`) — nenhum token novo foi criado; onde faltava
um papel semântico (anel de foco sobre fundo escuro), reaproveitei
`color/focus/ring-offset` (branco), que já existia com o valor certo para
esse uso, em vez de criar uma variável nova.

**Página**: `39:2`. **3 frames**, 360×84 cada (grade mobile), offset
horizontal 420 px (mesma convenção F24/F25), com uma legenda de texto
(itálico, `color/text/secondary`) abaixo de cada um:

| Frame | id | O que documenta |
|---|---|---|
| Menu principal / Selecionado (Perfil) · estado real Sprint 01 | `39:3` | Como a tab bar aparece de fato hoje: Perfil é o único item habilitado e já chega selecionado (é a aba de pouso do app) |
| Menu principal / Padrão (Perfil não selecionado) | `39:31` | Variante exigida pelo critério de 3 estados (US-PROTO-MENU-01); documentada por completude de especificação, já que na Sprint 01 Perfil praticamente sempre está selecionado |
| Menu principal / Foco de teclado (Perfil) | `39:58` | Selecionado + anel de foco branco sobreposto (os dois estados coexistem na prática) |

**Ordem fixa dos 5 itens, esquerda → direita, igual nas 3 frames**: Perfil
(habilitado) → Clientes e Veículos → Catálogo → Ordens de Serviço →
Financeiro (os 4 últimos desabilitados, com ícone e rótulo de referência,
sem navegação real — conforme o fora de escopo da feature).

**Layout de cada item**: célula de 72×64 pt/dp (360 ÷ 5), mais 20 pt/dp de
faixa de área segura (home indicator) abaixo, mesma cor do fundo — barra
total 360×84. A célula inteira (72×64) é a área de toque de cada item,
folgada acima do mínimo de 44×44pt (iOS) / 48×48dp (Android) exigido pelo
critério US-PROTO-MENU-03.

**Ícones**: desenhados com formas geométricas simples (retângulo/elipse com
cantos arredondados), no mesmo espírito de referência visual do wireframe
F24 — não são um ícone de produção/SVG importado, são um placeholder
reconhecível (pessoa, carro, caixa, prancheta, gráfico de barras) suficiente
para "ícone de referência" (fora de escopo: ícone final). Ícone preenchido
(fill sólido) nos itens habilitados; ícone em traço (stroke, sem
preenchimento) nos desabilitados — a diferença de estilo do ícone, não só a
cor, é um dos dois sinais exigidos por US-PROTO-MENU-02.

**Estado selecionado (Perfil)**: fundo petro da barra inteira
(`color/surface/brand`) + um "pill" de 56×32 em `color/action/primary/background`
atrás do ícone + ícone e rótulo em `color/text/onPrimaryAction` (branco) +
peso de fonte Semi Bold no rótulo. **Não** usei a cor primary diretamente como
cor de texto/ícone sobre o fundo petro: calculei o contraste de primary
(`#B5453D`) sobre petro (`#1E3A3F`) pela mesma fórmula de luminância relativa
da F25 e deu **≈2,24:1** — não passa AA nem para elemento de UI (mínimo 3:1).
Por isso a cor primary aparece como fundo do pill (com branco em cima, razão
≈5,41:1, já validada na F25), não como cor de texto/ícone isolada — é assim
que o token "primary no ativo" do briefing fica com contraste correto
(US-PROTO-MENU-05).

**Estado padrão/habilitado sem seleção (Perfil)**: ícone preenchido e rótulo
em `color/text/onBrand` (branco) direto sobre petro, sem pill, peso regular —
razão ≈12,1:1 (mesma da F25), passa AA com folga.

**Estado desabilitado (4 itens futuros)**: ícone em traço + rótulo em
`color/text/onBrand`, com opacidade do nó em 60%. Calculei antes de montar
(fórmula de luminância relativa, branco a 60% de opacidade composto sobre o
petro de fundo): resultado **≈5,46:1**, passa AA (mínimo 4,5:1 para texto
normal) com margem — não usei um valor arredondado "de olho"; testei 50%
primeiro (≈4,30:1, não passa) antes de fechar em 60%. Isso cumpre
US-PROTO-MENU-05 também para os itens desabilitados, que o critério exige
explicitamente (diferente do padrão comum de não cobrar contraste de
controle desabilitado).

**Anel de foco**: branco (`color/focus/ring-offset`), 2 px, 2 px de margem
interna da célula — contraste ≈12,1:1 sobre o fundo petro, visível em
qualquer item ao navegar por Tab. Ilustrado no item Perfil no frame "Foco de
teclado"; a legenda do frame descreve que o mesmo anel se aplica a qualquer
item que receba foco.

**Ordem de foco (teclado e leitor de tela)**, anotada na legenda do frame 1,
igual à ordem visual: Perfil → Clientes e Veículos → Catálogo → Ordens de
Serviço → Financeiro (US-PROTO-MENU-04).

**Rótulo acessível (accessibilityLabel/aria-label) e estado anunciado, por
item** (anotado na legenda do frame 1, US-PROTO-MENU-03):
- Perfil — "Perfil, aba selecionada" · role tab, `selected=true`,
  `disabled=false`.
- Clientes e Veículos — "Clientes e Veículos, indisponível nesta versão" ·
  role tab, `disabled=true`, `selected=false`.
- Catálogo — "Catálogo, indisponível nesta versão" · role tab,
  `disabled=true`.
- Ordens de Serviço — "Ordens de Serviço, indisponível nesta versão" · role
  tab, `disabled=true`.
- Financeiro — "Financeiro, indisponível nesta versão" · role tab,
  `disabled=true`.

**Decisão registrada para CRIVO/BUSSOLA confirmarem**: os itens desabilitados
ficam alcançáveis por foco de teclado/leitor de tela (anunciando
"indisponível nesta versão"), em vez de ficarem fora da ordem de tabulação
como é mais comum para controle desabilitado. Optei por isso porque o
próprio critério US-PROTO-MENU-04 pede "ordem de foco" cobrindo os 5 itens
"com indicador de foco visível em cada item", o que só faz sentido se os
desabilitados também puderem receber foco. Não é uma violação de WCAG (um
controle desabilitado-mas-focável que anuncia seu estado é um padrão aceito
para pré-visualizar funcionalidade futura), mas diverge do padrão mais comum
de excluir `disabled` da ordem de tabulação — se CRIVO ou BUSSOLA preferirem
excluir os 4 itens futuros da ordem de foco (deixando só Perfil navegável),
é ajuste pequeno de anotação, não de estrutura visual.

**O que eu verifiquei de fato**:
- Chamei `get_variable_defs` nos frames `39:3` e `39:58` depois de montar e
  confirmei que as cores vieram de variável vinculada (não hex solto): fundo
  petro, pill primary, texto/ícone onBrand e onPrimaryAction, e o anel de
  foco em `color/focus/ring-offset` — os 5 tokens certos, reaproveitados da
  F25.
- Chamei `get_screenshot` dos 3 frames individualmente e do canvas inteiro
  (os 3 lado a lado) em resolução alta; conferi visualmente que os 5 itens
  aparecem na ordem certa nas 3 variantes, que os 4 desabilitados têm o
  mesmo tratamento (traço + opacidade) nas 3, que o pill e o anel de foco
  aparecem só onde esperado, e que não há sobreposição/vazamento de conteúdo
  entre os frames (o `get_metadata` reportou coordenadas relativas estranhas
  para os grupos de ícone — valores negativos grandes — mas conferi por
  captura visual real que a renderização está correta nos 3 frames; registro
  essa discrepância aqui como uma particularidade da ferramenta de leitura de
  metadados com nós agrupados via `figma.group`, não como defeito no arquivo,
  já que o screenshot é a fonte de verdade sobre o que está desenhado).
- Calculei as duas razões de contraste novas desta feature (primary sobre
  petro ≈2,24:1 — descartado; branco a 60% de opacidade sobre petro
  ≈5,46:1 — usado no desabilitado) pela mesma fórmula de luminância relativa
  do WCAG já usada na F25, testando 50% antes de fechar em 60%.

**O que não verifiquei**: não há interação real por teclado/leitor de tela
testada (VoiceOver/TalkBack) — esta é uma especificação visual em Figma, sem
semântica executável; os rótulos acessíveis acima são a anotação de como o
item deve se comportar quando a F33 implementar a tab bar real, não uma
gravação de teste real. Também não configurei reações de navegação
(`ON_CLICK`) neste protótipo — está fora de escopo (critério explícito:
"conteúdo real ou navegação funcional dos itens de módulos futuros" e
"lógica de habilitação dinâmica" ficam para F33); os 3 frames são estados
estáticos lado a lado, não uma sequência clicável.

**Próximo passo**: handoff para CRIVO conferir US-PROTO-MENU-01 a 05 contra
este arquivo (frames `39:3`, `39:31`, `39:58`, página `39:2`).

### F33 · Menu principal de navegação (2026-11-07, ESQUADRO)

Reli a página `39:2` nesta sessão (`get_metadata` + `get_screenshot`) para
confirmar que os 3 frames ainda batem com a descrição acima antes de
especificar a implementação — bateram, sem divergência.

**Nenhuma página/frame novo foi criado nesta feature.** A F33 reaproveita
integralmente os frames `39:3`/`39:31`/`39:58` já aprovados (CRIVO, F34); o
trabalho desta etapa foi de especificação de comportamento (navegação, guard
de sessão, i18n, adaptação responsiva), não de artefato visual novo —
detalhado em `docs/design/F33-especificacao-menu-tabbar.md`.

Decisão registrada: a dúvida §10 do PRD de BUSSOLA (`docs/product/F33-menu-principal-navegacao.md`)
— se falta um frame para o "instante de redirect" de US-MENU-08 — foi
respondida como **não falta**: esse instante é o guard de sessão que já
existe em código (`apps/mobile/app/index.tsx`, implementado na F30), que
nunca chega a montar a tab bar enquanto decide o destino; não é um estado
visual da tab bar em si. Ver seção 2 do documento de especificação para o
raciocínio completo.

**Confirmação pós-implementação (2026-11-09, ESQUADRO)**: reli a página
`39:2` de novo nesta sessão (`whoami` sem bloqueio, `get_metadata`) — os 3
frames (`39:3`, `39:31`, `39:58`) continuam idênticos ao que está descrito
acima, nenhuma mudança desde a F34. Confrontei a spec
(`docs/design/F33-especificacao-menu-tabbar.md`) contra o código real já
implementado por ORLA (`menu-tab-bar.tsx`, `(menu)/_layout.tsx`): bate ponto
a ponto. Detalhe completo, incluindo o gap de verificação de foco em item
desabilitado que fica para CRIVO, na seção 13 do documento de especificação.

### F40 · Componentes base do app (2026-11-13, ESQUADRO)

**Nenhum nó deste arquivo foi alterado na F40.** Leitura (somente) da página `28:2` (`get_metadata`, `get_screenshot` de `29:79` e `33:33`, `get_variable_defs` de `29:79`). Achado: o código de Login e Perfil não tem a faixa petro, o subtítulo, o avatar nem o ícone de olho que os frames aprovados têm; a correção é da F41. Especificação dos componentes, tokens a acrescentar (sem alterar valor) e matriz de anúncio ao leitor de tela: `docs/design/F40-componentes-base-especificacao.md`. Variáveis numéricas no Figma para os tokens novos ficam pendentes até ORLA commitar os valores e a F41 liberar a linha de base.
