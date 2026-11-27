---
status: proposto
date: 2026-11-23
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: []
informed: [REGENTE, BUSSOLA, ESPRESSO, CRIVO, PERGAMINHO]
---

# Calcular `estoqueBaixo` no service a cada leitura (`quantidadeEstoque <= estoqueMinimo`), sem persistir

Histórico de status:

* 2026-11-23: proposto (F17, etapa do CARTOGRAFO), ramo `docs/f17-adr-pecas-listar`.

Vínculos: F17 (critérios 9, 10 e 11, premissa 2, dúvida 3), F16 (alerta ao movimentar estoque), F36 (indicador "Estoque baixo"). Usado pelo contrato do [ADR-034](ADR-034-listar-pecas-com-busca-em-nome-ou-codigo-sem-filtro-de-ativo-e-sem-custo.md). Segue o mesmo princípio do status de parcela calculado em runtime (`CLAUDE.md`, "Modelo de dados") e o ADR-001 (regra só no pacote `service`). Contrasta com o ADR-005, que pôs os subtotais da OS no banco.

## Contexto e problema

A lista de peças precisa dizer quais estão com estoque baixo, para a oficina repor antes que falte. `pecas` tem `quantidade_estoque` e `estoque_minimo` (`INT NOT NULL DEFAULT 0`, V2) e nenhuma coluna de alerta. A quantidade muda a cada movimentação (F16) e a cada uso em OS (F19), e o mínimo muda na edição (F15). A regra ainda pode mudar: a dúvida 3 da F17 pergunta se mínimo 0 quer dizer "sem controle de reposição". Onde a flag é calculada, e ela vira coluna?

## Fatores de decisão

* F1. Regra de negócio só no pacote `service` (ADR-001, `CLAUDE.md`). Medido por revisão e pelo `grep` da Confirmação.
* F2. A flag nunca dessincroniza da quantidade e do mínimo gravados, inclusive depois de script manual. Medido por teste: alterar a quantidade direto no banco e listar.
* F3. Mudar a regra (resposta da dúvida 3) custa no máximo um método e os testes dele, sem migration.
* F4. Uma implementação só, reaproveitada pela F16 quando o alerta disparar na movimentação.
* F5. Nenhuma migration a mais nesta fatia.

## Opções consideradas

* E1. Calcular no service, a cada leitura, numa função pura `service.EstoqueMinimo.atingido(quantidade, minimo)`; o mapper só copia o booleano.
* E2. Coluna gerada no banco: `estoque_baixo BOOLEAN GENERATED ALWAYS AS (quantidade_estoque <= estoque_minimo) VIRTUAL`, como os subtotais do ADR-005.
* E3. Coluna comum `estoque_baixo`, gravada pela aplicação a cada movimentação e edição.
* E4. Método na entidade (`Peca.isEstoqueBaixo()`) ou `expression` no `PecaMapper`.
* E5. Não devolver a flag; o app compara `quantidadeEstoque` e `estoqueMinimo`.

## Resultado da decisão

Opção escolhida: "E1", porque é a única que atende os cinco fatores. E2 atende F2, mas põe a regra no DDL (falha F1), e mudar a regra vira migration que redefine a coluna (falha F3 e F5). E3 dessincroniza no primeiro script manual ou caminho de escrita esquecido (falha F2), o mesmo motivo que fez o status da parcela não ser coluna. E4 põe a regra na entidade ou no mapper, fora do `service` (falha F1). E5 espalha a regra para cada cliente da API (falha F4) e contraria o critério 9.

### Regra normativa

* `estoqueBaixo = quantidadeEstoque <= estoqueMinimo`. Igual ao mínimo já é baixo (critério 9).
* Consequências da regra, de propósito: mínimo 0 com quantidade 0 dá `true` (critério 10); quantidade negativa, que só um script manual consegue gravar hoje (a coluna não tem `CHECK`), dá `true`.
* Calculada a cada requisição, nunca gravada, nunca recebida do cliente. Nenhuma migration cria `estoque_baixo`; a entidade `Peca` não ganha campo nem método com esse nome.

### Implementação esperada (ESPRESSO)

```java
// service/EstoqueMinimo.java: final, package-private, sem estado (mesmo padrão de Paginacao)
static boolean atingido(int quantidadeEstoque, int estoqueMinimo) {
  return quantidadeEstoque <= estoqueMinimo;
}
```

* `PecaService.listar` chama `pecaMapper.toListResponse(peca, EstoqueMinimo.atingido(peca.getQuantidadeEstoque(), peca.getEstoqueMinimo()))` para cada item.
* `PecaMapper` declara `@Mapping(target = "estoqueBaixo", source = "estoqueBaixo") PecaListResponse toListResponse(Peca peca, boolean estoqueBaixo)` e `unmappedTargetPolicy = ReportingPolicy.ERROR`, para que um campo de destino sem origem quebre a compilação em vez de sair `false` em silêncio. O mapeamento de parâmetro primitivo para componente de record no MapStruct é suposição desta etapa, a confirmar pela compilação e pelo teste do ESPRESSO.
* A F16 reaproveita `EstoqueMinimo.atingido` para decidir o alerta da movimentação. Se a F16 ficar fora do pacote `service` (não deve, pelo ADR-001), a visibilidade é revista lá.

### Consequências

* Bom, porque a flag reflete sempre o que está gravado, inclusive depois de script manual.
* Bom, porque responder a dúvida 3 com "mínimo 0 é sem controle" muda uma linha (`estoqueMinimo > 0 && quantidadeEstoque <= estoqueMinimo`) e os testes, sem migration.
* Bom, porque a regra tem teste unitário puro, sem Spring nem banco.
* Ruim, porque um filtro futuro "somente estoque baixo" (backlog) precisaria repetir a comparação na consulta JPQL, ou rever este ADR (E2 passa a ser candidata).
* Neutro, porque o custo de CPU é uma comparação de inteiros por item, no máximo 100 por página.

### Risco residual

* A dúvida 3 está aberta: se a oficina disser que mínimo 0 é "sem controle", o critério 10 muda e este ADR é substituído antes do aceite ou por um novo ADR depois.
* Peça com quantidade negativa aparece como estoque baixo sem outro aviso. Quem impede quantidade negativa é a F16 (saída maior que o saldo), não esta fatia.

### Confirmação

* `EstoqueMinimoTest` (unitário): 5/5 `true`, 2/5 `true`, 0/0 `true`, 6/5 `false`, -1/0 `true`.
* `PecaServiceTest`: o item da lista sai com `estoqueBaixo` igual ao retorno da regra para quantidade igual, abaixo e acima do mínimo e mínimo 0.
* IT: grava quantidade 6 e mínimo 5, lista (`false`), troca para 5 por `UPDATE` direto no banco, lista de novo (`true`), sem passar pela aplicação.
* `grep -rni "estoque_baixo" apps/api/src/main/resources/db/migration` não acha nada; `grep -n "estoqueBaixo" apps/api/src/main/java/br/com/mecanicasaojorge/api/entity/Peca.java` não acha nada.
* `grep -rn "<= " apps/api/src/main/java/br/com/mecanicasaojorge/api` mostra a comparação de estoque só em `service/EstoqueMinimo.java`.

## Prós e contras das opções

### E1. Função pura no service, a cada leitura (escolhida)

* Bom, porque atende F1 a F5.
* Bom, porque a F16 reaproveita a mesma função.
* Ruim, porque não dá para filtrar ou ordenar por estoque baixo no banco sem repetir a comparação na consulta.
* Ruim, porque o mapper passa a receber dois parâmetros, um pouco menos direto do que mapear só a entidade.

### E2. Coluna gerada `VIRTUAL`

* Bom, porque nunca dessincroniza e permitiria `where estoque_baixo` e índice no futuro.
* Bom, porque já existe precedente na casa (ADR-005).
* Ruim, porque a regra fica no DDL, fora do `service` (falha F1), e cada mudança de regra é uma migration (falha F3, F5).
* Ruim, porque a entidade precisaria mapear a coluna com `insertable = false, updatable = false`, mais um ponto a lembrar.
* Custo do descarte: se o filtro "somente estoque baixo" entrar, a comparação aparece duas vezes (service e JPQL) ou este ADR é revisto.

### E3. Coluna comum gravada pela aplicação

* Bom, porque a leitura fica trivial e filtrável.
* Ruim, porque toda escrita de quantidade ou mínimo (F15, F16, F19, scripts) tem de lembrar de atualizar a flag; um esquecimento a deixa errada (falha F2).
* Ruim, porque contraria o texto da F17 ("nunca persistido") e o princípio já usado na parcela.
* Custo do descarte: nenhum.

### E4. Método na entidade ou `expression` no mapper

* Bom, porque o cálculo fica junto do dado e não precisa de segundo parâmetro no mapper.
* Ruim, porque a regra sai do `service` (falha F1) e uma `expression` em string no MapStruct não é coberta pelo compilador.
* Custo do descarte: um parâmetro a mais no método do mapper.

### E5. O app calcula

* Bom, porque a API fica sem regra nenhuma.
* Ruim, porque cada cliente reimplementa a regra (falha F4) e o critério 9 pede a flag na resposta.
* Custo do descarte: nenhum.

## Mais informações

* Dúvida 3 da F17 com a BUSSOLA (pergunta para a oficina). A recomendação do CARTOGRAFO é manter `<=` sem exceção para mínimo 0: é a regra mais simples, e quem não quer controle de reposição vê o alerta só quando o estoque zera, o que ainda é informação útil.
* Revisitar se o filtro "somente estoque baixo" ou o card de dashboard "estoque baixo" (backlog) precisarem da comparação no banco.
