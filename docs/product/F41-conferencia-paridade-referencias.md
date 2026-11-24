# F41 — Referência de paridade e dependência com a F40

> **REVISADO em 2026-11-16 (ESQUADRO), por decisão da pessoa (D-01 e D-02 do PRD `F41-prd-paridade-figma-fpdb8.md`).**
> A referência definitiva de paridade da F41 é o arquivo **`FPdB8RymAnN81pbKfizdzE`**, página `20:2132`, nós em `docs/design/figma.md` (seção "Referência F41 (FPdB8)") e no ADR-014. As tabelas abaixo, do arquivo `DLqbSzzKRxiN2eyvXG73Lr`, ficam como **histórico da v1** e **não valem mais como referência**. A dependência F40 → F41 (§3) foi superada: a F40 já está na `main` (PR #10) e a F41 é a nova linha de base das telas seguintes.
> Registro: o arquivo novo **não é "a v2 editada pela F39"**. A F39 não editou nenhum nó; ele é a inspiração externa da F39 e vira referência da F41 por decisão da pessoa. Os ids `20:2131` e `20:968` do briefing **não são frames de alta fidelidade**: `20:2131` é a **página** "01 — Wireframes" e `20:968` é um **rótulo de texto**, verificado por `get_metadata` em 16/11 (`20:2131` é o canvas "01 — Wireframes"; `20:968` é um nó `text` de 420 × 16, "Navegação inferior / OS · Clientes · Catálogo · Financeiro / 3", legenda da página de wireframes).

PRD (decisões de escopo) — dono: BUSSOLA (Product Owner). Data: 2026-11-13.
Rota: BUSSOLA → ESQUADRO → ORLA → CRIVO. Prioridade P1 · Frontend · Sprint 01.

**Depende de:** [[F25]], [[F30]], [[F33]], [[F34]].
**Bloqueia (só para fechamento):** [[F40]] (ver §3).

Este documento **não reescreve** os critérios US-PAR-01 a US-PAR-15: eles valem como estão na feature. Ele fixa duas decisões que faltavam por escrito: qual é o frame de referência e se a F40 depende da F41. A conferência e as divergências estão em `docs/design/F41-conferencia-paridade.md` (ESQUADRO e ORLA).

## 1. Decisão: frames de referência

**A referência da F41 são os frames aprovados da F25 e da F34, nos nós abaixo, do arquivo `DLqbSzzKRxiN2eyvXG73Lr`. O redesenho da F39 não é referência.**

Arquivo: https://www.figma.com/design/DLqbSzzKRxiN2eyvXG73Lr (`docs/design/figma.md`).

| Origem | Página | Estado | Frame (nodeId) |
|---|---|---|---|
| F25 | `28:2` | Login vazio (pós-logout) | `29:2` |
| F25 | `28:2` | Login carregando | `29:20` |
| F25 | `28:2` | Login falha de conexão | `29:35` |
| F25 | `28:2` | Login credencial inválida e validação de campo (mesmo frame) | `29:56` |
| F25 | `28:2` | Login preenchido | `29:79` |
| F25 | `28:2` | Perfil carregando | `33:2` |
| F25 | `28:2` | Perfil erro | `33:14` |
| F25 | `28:2` | Perfil preenchido | `33:33` |
| F25 | `28:2` | Diálogo de confirmação de logout | `33:49` |
| F34 | `39:2` | Tab bar, Perfil selecionado | `39:3` |
| F34 | `39:2` | Tab bar, Perfil padrão | `39:31` |
| F34 | `39:2` | Tab bar, Perfil com foco | `39:58` |

Os quatro itens desabilitados (Clientes e Veículos, Catálogo, Ordens de Serviço, Financeiro) aparecem nos três frames da tab bar.

**Por que não a F39:**
- A F39 está **em revisão** e o ADR-014 (identidade v2) está **Proposto**, não aceito.
- `docs/design/figma.md` (seção F39) registra que **nenhum nó do arquivo foi alterado**: as páginas `3:2`, `28:2` e `39:2` seguem como foram aprovadas. A versão nomeada da F24 exigida pelo US-WFR-15 não pôde ser criada (`saveVersionHistoryAsync` não suportado), então a F39 não editou nada.
- ~~O arquivo `FPdB8RymAnN81pbKfizdzE` (nó `1:66`) é só a inspiração externa da F39. Não é referência de paridade.~~ **Revogado em 2026-11-16 (D-01):** o arquivo `FPdB8RymAnN81pbKfizdzE` é a **referência definitiva de paridade** da F41 (página `20:2132`, nós em `docs/design/figma.md`). Continua verdade que ele é a inspiração externa da F39 e que a F39 não o editou.
- A F40 ficou na identidade v1 de propósito (F40, fora do escopo). A F41 confere a v1.

**Condição para mudar:** se o ADR-014 for aceito e a F39 passar a editar `28:2` ou `39:2`, a referência só muda por decisão registrada da pessoa, e a linha de base da F41 é refeita. Sem essa decisão, vale esta tabela.

**Verificado × não verificado:**
- Verificado por mim: os nodeIds batem entre `docs/design/figma.md` (páginas `28:2` e `39:2`, frames `39:3`, `39:31`, `39:58`) e `docs/design/F41-conferencia-paridade.md` §2, que lista os mesmos 12 frames com capturas em `docs/design/f41-capturas/` (os 12 PNGs `figma-*` existem na pasta).
- **Não verificado por mim no Figma:** nesta sessão a chamada a whoami do MCP figma-remote voltou negada por falta de permissão concedida (mensagem: "Claude requested permissions to use mcp__figma-remote__whoami, but you have not granted it yet", transcrita sem a contração). Não li nenhum nó. A leitura dos frames é a do ESQUADRO (2026-11-13), na seção 1 do documento de conferência. Isso não bloqueia esta etapa (só escrevo decisão), mas as etapas que conferem ou editam o Figma seguem sujeitas ao US-PAR-11.

## 2. Observação sobre ids da F25 em `figma.md`

A tabela de reações da F25 em `docs/design/figma.md` cita ids como `29:16`, `29:93`, `33:43`, `33:65` e `33:67`. São nós internos de interação (botões e campos), não os frames de tela. Para captura e paridade, use só os ids da tabela do §1.

## 3. Decisão: F40 passa a depender da F41

**Sim. A F40 lista a F41 em "Depende de", só para o fechamento.**

- A F40 já está codificada: a dependência **não bloqueia a escrita**, bloqueia marcar a F40 como entregue.
- A F40 só fecha depois que a F41 não tiver divergência real em aberto (US-PAR-08) e a linha de base estiver disponível (US-PAR-13).
- Motivo verificado no histórico: a F41 alterou componentes que a F40 refatorou (`TabBarItem`, `ScreenContainer`, `TextField`, `Button`, `ConfirmDialog`; commits `a2b809f` a `892b35c`). O "depois" da F40 é o commit final **depois** das correções da F41, e a prova de "sem mudança visual" da F40 (US-COMP-11) tem de ser refeita sobre ele. O "antes" da F40 continua `c815235` (F40 §3.1, item 2).
- As duas medem coisas diferentes: F41 confere Figma × código; F40 confere código × código.
- F35, F36, F42 e F43 já dependem da F40; não acrescento a F41 a elas (dependência transitiva, sem sobreposição).

**Pendência de texto no PRD da F40 (não corrigida nesta etapa):** o item 1 de §3.1 de `docs/product/F40-componentizacao-front-mobile.md` diz "F41 passa a Depende de da F40", o que inverte o sentido (o cabeçalho do próprio PRD e esta decisão dizem que é a F40 que depende da F41). A edição do arquivo não foi autorizada na sessão; fica para o próximo agente com permissão de edição.

## 4. Dúvidas do PRD da feature: situação

| # | Dúvida | Situação |
|---|---|---|
| 1 | Link do Figma de F25 e F34 | **Resolvida** (§1). |
| 5 | A F39 altera os frames da F34? Qual versão é a referência? | **Resolvida**: referência é a F25/F34 aprovada; a F39 não é (§1). |
| 2 | Aparelho físico (modelo, sistema, resolução, Expo Go ou build) | **Aberta, da pessoa.** A rodada do ORLA usou simulador iPhone 17 (iOS 27.0), desvio da premissa 9; trocar para o aparelho físico obriga refazer as capturas. |
| 4 | Onde ficam as capturas finais e o limite por arquivo | **Aberta, da pessoa.** Hoje provisórias em `docs/design/f41-capturas/` (PNGs reduzidos). Recomendo manter lá, com teto de 100 KB por arquivo (valor sugerido, não medido contra restrição do repositório). |
| — | Decisões 1 a 5 da §7 do documento de conferência (botão Fechar, rótulos do Perfil, ícones, estado "Padrão", Perfil carregando e erro) | **Abertas, da pessoa.** Enquanto abertas, são divergência real em aberto e o US-PAR-08 não fecha. |

## 5. Sem cobertura (declarado)

- Capturas do app de Perfil carregando e erro (não existem no código), foco real da tab bar e estado "Padrão" da tab bar.
- US-MENU-06 (foco de teclado e leitor de tela em aparelho): segue onde está.
- Variáveis numéricas dos tokens novos na coleção `28:3` do Figma: pendentes (US-PAR-07 descumprido até o ESQUADRO criá-las com Figma acessível).

## 6. Dados pessoais

Nenhuma coleta nova. Capturas só com dados fictícios (premissa 4 da feature). Base legal: não aplicável. Retenção: até o fechamento da F40; depois, só a linha de base.

## 7. README

README sem mudança: esta etapa só registra decisão em documentação.
