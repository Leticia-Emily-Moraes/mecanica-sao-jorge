# F27 — Protótipo de alta fidelidade de Catálogo e Estoque (Figma)

- Autor: ESQUADRO (etapa 1 de 3 da rota: ESQUADRO → ORLA → CRIVO)
- Data: 2026-11-24
- Feature: F27, Sprint 03, P1, critérios US-PROTO-CAT-01 a 15
- Estado: **entregue ao Figma, AGUARDANDO APROVAÇÃO. Não aprovado.** A aprovação (US-PROTO-CAT-06) e a reprovação (07) são da pessoa; nada aqui as declara. A F27 é o gate do ADR-007: **a F36 (front) não deve começar sem aprovação explícita.**
- Não avalio critérios nem escrevo cenários de teste: isso é da etapa do CRIVO.

## 1. Base dos frames: a F39 continua sem wireframe aprovado

O wireframe aprovado da F39 não existe (`docs/design/F39-redesenho-wireframes-navegacao.md` segue "BLOQUEADO"). A base foi a referência `FPdB8RymAnN81pbKfizdzE`, como na F26. **Foi escolha minha, não decisão da pessoa.** Se a F39 mudar a estrutura de alguma tela, os frames afetados precisam ser refeitos. Quem decide: a pessoa.

## 2. Onde está o trabalho

- Arquivo `FPdB8RymAnN81pbKfizdzE`, página `20:2132` "02 — Alta fidelidade", **seção `191:4113`** "F27 — Catálogo e Estoque", com **36 frames de nível superior** de 362 × 742 pt (P10 362 × 860, P11 362 × 980), nomeados `F27-<código> …`.
- Cada frame tem a camada "Foco por controle (sobreposição de especificação; ocultar para paridade)" e, abaixo dele, a "Anotação de acessibilidade" (ordem de foco, rótulo, o que o leitor anuncia).
- Ponto de partida do fluxo: **S3** (`197:4263`, carregando), que abre a lista de serviços (S1) depois de 1,5 s.
- Nada fora da seção foi alterado, exceto os componentes compartilhados listados na seção 6.

## 3. Dúvidas do briefing: premissas minhas, a pessoa confirma

| # | Dúvida | O que fiz | Estado |
|---|---|---|---|
| 1 | Depende da F39 | Ver seção 1 | Aberta (base escolhida por mim) |
| 2 | Histórico: tela própria ou seção do detalhe? | **Tela própria** (P12 a P15), aberta por "Ver histórico desta peça" | Premissa; muda a contagem de telas a aprovar |
| 3 | Posição do Catálogo na barra inferior | Terceira aba, entre Clientes e Financeiro. **A barra do arquivo tem 4 abas**, não as 5 da F34; não inventei a quinta | Premissa; conferir com a F34 |
| 4 | Saída maior que o saldo bloqueia? | **Bloqueia**, com erro 409 desenhado (M5): "Saída maior que o estoque atual." A F16 não está implementada; o texto e o código são suposição | Premissa; confirmar com a F16 |
| 5 | Histórico mostra o usuário? | **Não mostra** (sem dado pessoal no arquivo) | Premissa |

Outras escolhas minhas, sem pergunta no briefing:

- **Editar peça não tem campo de quantidade** (P10, P11): a quantidade aparece só como "Estoque atual" (leitura) e muda por movimentação. O wireframe F24 prevê "Quantidade em estoque" na edição; divirjo porque o critério da feature e o modelo (`MovimentacaoEstoque`) tratam o saldo como resultado de movimentações. A pessoa confirma.
- **"Saldo após a saída: 10 un."** aparece em M2, M6 e M8. É um auxílio calculado no cliente (estoque atual − quantidade); **não vem do contrato da F16** e pode sair sem afetar o resto.
- Alerta "Estoque baixo" quando `quantidade <= mínimo` (ADR-035), calculado no service; a Vela de ignição (4 un., mínimo 4 un.) mostra o alerta de propósito.

## 4. Os frames

| Código | Tela e estado | Id |
|---|---|---|
| S1 | Serviços, lista preenchida | `194:4122` |
| S2 | Serviços, vazio | `197:4195` |
| S3 | Serviços, carregando (ponto de partida) | `197:4263` |
| S4 | Serviços, erro de carregamento | `197:4317` |
| S5 | Serviços, busca sem resultado | `197:4387` |
| S6 | Novo serviço, formulário vazio | `198:4367` |
| S7 | Novo serviço, erro de validação (400) | `198:4433` |
| S8 | Novo serviço, nome repetido (409) | `198:4514` |
| S9 | Novo serviço, salvando | `198:4590` |
| S13 | Novo serviço, sucesso | `198:4658` |
| S10 | Editar serviço ativo | `198:4750` |
| S11 | Editar serviço inativo | `198:4821` |
| S12 | Confirmar inativação | `198:4897` |
| P1 | Peças, lista preenchida com "Estoque baixo" | `198:4976` |
| P2 | Peças, vazio | `198:5127` |
| P3 | Peças, carregando | `198:5201` |
| P4 | Peças, erro de carregamento | `198:5259` |
| P5 | Peças, busca sem resultado | `198:5333` |
| P6 | Nova peça, formulário vazio | `199:4825` |
| P7 | Nova peça, erro de validação (400) | `199:4903` |
| P8 | Nova peça, código repetido (409) | `199:5001` |
| P9 | Nova peça, salvando | `199:5089` |
| P10 | Editar peça (sem campo de quantidade) | `199:5169` |
| P11 | Editar peça, erro de validação (400) | `201:4981` |
| P12 | Histórico da peça, preenchido | `202:5051` |
| P13 | Histórico da peça, vazio | `202:5125` |
| P14 | Histórico da peça, carregando | `202:5190` |
| P15 | Histórico da peça, erro | `202:5246` |
| M1 | Movimentar estoque, vazio | `203:5082` |
| M2 | Movimentar estoque, preenchido | `203:5146` |
| M3 | Movimentar estoque, erro de tipo e quantidade (400) | `203:5217` |
| M4 | Movimentar estoque, ajuste sem motivo | `203:5299` |
| M5 | Movimentar estoque, saída maior que o saldo (409) | `203:5380` |
| M6 | Movimentar estoque, registrando | `204:5214` |
| M8 | Movimentar estoque, erro de conexão | `204:5245` |
| M7 | Movimentação registrada, com estoque baixo | `204:5275` |

**Lacunas conhecidas:** não há frame de sucesso para **edição de serviço**, **cadastro de peça** e **edição de peça** (a edição de serviço volta à lista S1; o cadastro de peça volta à lista P1 depois de 1,5 s). A pessoa decide se precisam de frame próprio.

## 5. Componentes

### Reaproveitados (F28/F41 e F26)

Botão `174:3037`, Campo de texto `174:3063` (variante Erro editada, ver seção 6), Banner, Busca `20:1532`, Navegação inferior, cabeçalhos principais `20:1592` e `20:1516`.

### Novos (7), cada um com a justificativa

| Componente | Id | Por que nenhum existente resolve |
|---|---|---|
| Badge de catálogo | `191:4124` | "Estoque baixo" (primary, ícone + texto) e "Ativo/Inativo" precisam de selo com ícone; o Banner é de largura total |
| Card de serviço | `192:4154` | O cartão de cliente é de pessoa (avatar, telefone); serviço tem nome, valor e tempo |
| Card de peça | `192:4185` | Peça tem código, saldo, mínimo, preço e ação de movimentar |
| Seletor segmentado | `193:4158` | A aba Serviços/Peças e o Tipo da movimentação precisam de duas e três opções exclusivas; não há equivalente |
| Alternância Ativo-Inativo | `198:4357` | O catálogo pede ativar e inativar sem excluir; não há controle de estado binário |
| Diálogo de confirmação | `198:4358` | A inativação pede confirmação; a F26 só tem diálogo de sair do formulário, com outro conteúdo |
| Linha de movimentação | `202:5048` | Linha do histórico: tipo, quantidade com sinal, motivo e data |

## 6. Edições em componentes compartilhados (efeito além da F27)

- **Campo de texto, variante Erro:** texto de apoio com a cor `color/text/placeholderError` (`209:2039`, **token proposto por mim**, ainda sem aprovação) para o placeholder em campo com erro passar 4,5:1.
- **Cabeçalhos `20:1592` e `20:1516`:** alvo de toque do botão levado a 44 × 44 pt. Afeta as instâncias das telas de referência que usam esses cabeçalhos; conferir a paridade das telas da F26/F41.
- **Seletor segmentado:** ajuste de espaçamento para o alvo de 44 pt.
- **Busca `20:1532`:** o traço do ícone da lupa passou a usar `color/text/placeholder` (`89:716`); antes media 2,5:1 e reprovava em 3:1 (WCAG 1.4.11).
- **Linha de movimentação:** os textos de tipo e quantidade de "Entrada" ligados à variável existente `color/spring green/34` (primitiva; **não criei token semântico de sucesso**).

## 7. Navegação (modo Prototype)

Lido de volta do arquivo: **140 reações** (138 nos quadros mais 2 nos botões compactos); **36 frames alcançáveis a partir de S3, 0 órfãos, 0 sem saída; todos chegam a S1.** A conferência foi por leitura do grafo gravado. **O MCP não aciona o modo Present, e não percorri o clique real.**

| De | Ação | Para |
|---|---|---|
| S3 | espera 1,5 s | S1 |
| S1 | cartão de serviço ativo / inativo | S10 / S11 |
| S1 | Novo serviço | S6 |
| S1 | aba Peças | P1 (nos estados S2 a S5, o estado equivalente P2 a P5) |
| S1 | busca | S5 |
| S6 → S7 → S8 → S9 | Salvar (cadeia demonstrativa) | S9 vai a S13 em 1,5 s |
| S10 | alternância | S12 |
| S12 | Inativar / Voltar | S11 / S10 |
| S11 | alternância | S10 |
| S10, S11 | Salvar alterações | S1 |
| P1 | cartão de peça / "Movimentar estoque" | P10 / M1 |
| P1 | Nova peça | P6 |
| P6 → P7 → P8 → P9 | Salvar (cadeia demonstrativa) | P9 vai a P1 em 1,5 s |
| P10 | Salvar → P11 (erro) → P1; botões compactos | P11 / M1 |
| P12 | Movimentar estoque | M1 |
| P14 | espera 1,5 s | P12 |
| P15 | Tentar novamente / Voltar | P14 / M1 |
| M1 → M3 → M4 → M5 → M8 | Registrar (cadeia demonstrativa) | próximo erro |
| M8 | Tentar novamente | M6, e M6 vai a M7 em 1,5 s |
| M2 | Registrar | M6 |
| M7 | Movimentar estoque / voltar | M1 / P1 |
| M1 a M8 | "Ver histórico desta peça" | P12 |
| Todo formulário | voltar e Cancelar | S1 ou P1 |

Teclas 2, 3 e 4 nas listas levam aos estados vazio, carregando e erro (como na F26).

**Sem destino de propósito:** abas Ordens, Clientes e Financeiro; botão de usuário; seletor "Tipo" (abrir lista); alternância da peça; itens do histórico.

## 8. Acessibilidade (medição de 2026-11-24)

Medido por script no arquivo, com a luminância relativa do WCAG 2.2, sobre os 36 frames (sem a camada de foco e sem as anotações), empilhando fundo e opacidade dos ancestrais.

- **Texto:** 527 trechos; **menor razão 4,68:1; 0 abaixo do mínimo.**
- **Ícones e traços:** 267; **menor razão 3,56:1; 0 abaixo de 3:1.** Uma primeira medição achou 2 traços da lupa em 2,5:1, corrigidos (seção 6) e remedidos.
- **Alerta "Estoque baixo":** primary com ícone e texto; não depende só de cor.
- **Alvo de toque:** todos os controles com reação ≥ 44 × 44 pt (diálogo 270 × 50). As abas sem destino não foram medidas como controle.
- **Foco visível:** a camada de foco desenha um anel em cada controle navegável e um selo numerado com a ordem. Padrão da F26: botão e cartão com anel petro de 2 pt e respiro branco de 2 pt; campo com borda primary de 2 pt por dentro; botão de cabeçalho e aba com anel branco de 2 pt por dentro; selo branco sobre primary (5,41:1). Primary sobre petro não passa (≈ 2,2:1), por isso o selo não usa essa combinação. Conferi visualmente P1 e M5. **A folha de foco própria da F27 não foi criada**; vale a folha `113:2666` da F26.
- **Cor não é o único sinal:** erro com ícone e texto; obrigatório com `*`; situação com texto.
- **Rótulos de leitor:** "Perfil do usuário, botão" é **rótulo proposto por mim** (o arquivo não nomeia o botão).
- **Risco para a implementação:** o cartão de peça traz a ação "Movimentar estoque" dentro dele. No app, a ação deve ser **irmã** do corpo do cartão, nunca botão dentro de botão.
- **Leitor de tela real (VoiceOver, TalkBack):** não testado.

## 9. Tokens e tipografia (contagem de 2026-11-24)

- **1.374 preenchimentos e traços sólidos visíveis, 1.374 ligados a variável (0 soltos).** Uma primeira contagem achou 2 soltos na Linha de movimentação, religados.
- **527 textos, 527 com estilo de texto.**
- `petro` (`1:13`) e `primary` (`1:29`) entram por variável. Único token novo: `color/text/placeholderError` (proposto, seção 6). O nome segue `<categoria>/<papel>/<estado>`.

## 10. Chaves de texto (i18n), proposta para a ORLA

Formato `area.componente.texto`. Exemplos: `catalogo.servicos.titulo`, `catalogo.servicos.vazio.titulo`, `catalogo.pecas.estoqueBaixo`, `catalogo.pecas.card.movimentar`, `catalogo.movimentacao.erro.saidaMaiorQueEstoque`, `catalogo.movimentacao.sucesso.registrada`. Valores em R$ e "1,5 hora" devem sair de `Intl` (pt-BR), não de texto fixo.

## 11. Dados fictícios

Tudo inventado; nenhum dado pessoal (clientes, telefones, CPF, placas, e-mails) nas telas. Peças e serviços de exemplo: Filtro de óleo (FO-1023), Pastilha de freio (PF-2045), Vela de ignição (VI-3310), Óleo 5W30 (OL-5030); Troca de óleo, Alinhamento e balanceamento, Revisão de freios. Números de OS `OS-0001` a `OS-0004` e datas de 18/11 a 24/11/2026 são inventados. **LGPD:** não há dado pessoal; base legal e retenção não se aplicam.

## 12. O que não consegui fazer ou verificar

- **Aprovação da pessoa:** não aconteceu e não foi registrada.
- **Modo Present / clique real:** não aberto; vale o que li do grafo.
- **Leitor de tela real e link restrito à equipe:** não testados.
- **Conferência visual:** vi por `get_screenshot` P1 e M5; as demais telas foram medidas por script. Os anéis de foco dos outros 34 frames não foram revistos um a um.
- **Folha de foco da F27:** não criada.
- **Frames de sucesso** de edição de serviço, cadastro e edição de peça: não existem (seção 4).
- **Contrato da F16:** não implementada; textos de erro 400 e 409 são suposição.
- **PRD da F27:** não encontrei arquivo no repositório (`docs/product/`); os critérios vieram do briefing.
- **Capturas no repositório:** não versionei PNG.

## 13. Próximo passo

1. A pessoa decide a base (seção 1) e confirma as premissas da seção 3.
2. A pessoa percorre o protótipo em modo Present e aprova ou aponta pendência.
3. Com a aprovação registrada, a ORLA abre a F36 usando o handoff do relatório (componentes, chaves i18n, ação irmã no cartão de peça).
4. O CRIVO reproduz as medições das seções 8 e 9.
