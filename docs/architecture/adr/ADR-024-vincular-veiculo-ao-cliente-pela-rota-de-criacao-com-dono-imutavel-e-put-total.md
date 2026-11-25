---
status: proposto   # 2026-11-19 proposto (F04, CARTOGRAFO); aguarda aceite formal da pessoa dona do produto
date: 2026-11-19
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: [BUSSOLA (PRD F04 rev 2, N1 e N3), VIGIA (revisão 8 da política, seção 2.6)]
informed: [ESPRESSO, CRIVO, PERGAMINHO, ORLA, dono da F35, dono da F18 (OS)]
---

# Vincular o veículo ao cliente pela rota de criação, com dono imutável e edição por PUT total no recurso do veículo

## Contexto e problema

Todo veículo pertence a um cliente: `veiculos.cliente_id NOT NULL` com `fk_veiculos_cliente` **sem** `ON DELETE CASCADE` (lido em `apps/api/src/main/resources/db/migration/V2__criar_schema_oficina.sql`). A `ordens_servico` da mesma V2 guarda `cliente_id` **e** `veiculo_id`, então o dono do veículo também aparece na OS. O código do commit `4becbb2` já segue este ADR, mas o arquivo não existia. A revisão de 18/11 pediu marca e modelo aparados (critério 7) e um cenário próprio para PUT sem `cor` (critério 17). Pergunta: como o vínculo entra na API, pode mudar, e como a edição trata campo ausente?

## Fatores de decisão

* F1. O dono não pode vir do corpo: id de cliente no corpo é ignorado (C11a, C17).
* F2. Coerência com a OS: `ordens_servico.cliente_id` = `veiculos.cliente_id` do veículo da OS.
* F3. Rotas no plural, sem verbo (CLAUDE.md), e o detalhe do cliente da F08 não muda (decisão D-E da F08).
* F4. Edição previsível para o app: o que não vem no corpo não fica com valor antigo escondido.
* F5. Nada de apagar veículo nem cliente em cascata: histórico de OS e financeiro dependem dele.

## Opções consideradas

* A. Criação e lista aninhadas no cliente (`POST`/`GET /api/v1/clientes/{clienteId}/veiculos`), detalhe e edição planos (`GET`/`PUT /api/v1/veiculos/{id}`), dono imutável, PUT total.
* B. Tudo aninhado (`/clientes/{clienteId}/veiculos/{id}`).
* C. Tudo plano, com `clienteId` no corpo.
* D. Veículos embutidos no detalhe do cliente.
* E. Edição por PATCH parcial em vez de PUT total.

## Resultado da decisão

Opção escolhida: "A", porque o dono sai do caminho validado no servidor (F1), o detalhe do cliente fica intacto (F3) e o id do veículo basta para detalhe e edição, sem o app precisar saber o dono. PUT total (contra E) atende F4 com o mapper que já existe.

### Especificação normativa

1. **Criação**: `POST /api/v1/clientes/{clienteId}/veiculos`, `consumes = application/json`, `clienteId` `@Positive`. O service busca o cliente por `findById` (404 se não existe) e liga o veículo a ele. Resposta 201 com `Location` relativa `/api/v1/veiculos/{id}`.
2. **Lista**: `GET /api/v1/clientes/{clienteId}/veiculos`, 404 se o cliente não existe (`existsById`), ordem por `placa` e depois `id`.
3. **Detalhe e edição**: `GET`/`PUT /api/v1/veiculos/{id}`. O detalhe traz do dono só `clienteId` e `clienteNome` (C19b); nenhum CPF, telefone, email ou endereço.
4. **Dono imutável**: `VeiculoRequest` não tem campo de cliente; o `VeiculoMapper.toEntity` e o `atualizar(@MappingTarget)` ignoram `id`, `cliente` e `quilometragem`, com `ReportingPolicy.ERROR` para campo novo não mapeado quebrar o build. Corpo com `clienteId` ou `cliente` é ignorado pelo Jackson.
5. **PUT total**: o mapper copia todos os campos do request, inclusive `null`. `cor` ausente, `null` ou em branco grava `NULL` (nunca `''`). `marca`, `modelo` e `ano` são obrigatórios no PUT como no POST.
6. **Aparar (N1)**: o construtor compacto do `VeiculoRequest` aplica `strip()` em `marca`, `modelo` e `cor` antes da validação, sem mudar caixa nem espaço interno. `@NotBlank` e `@Size` contam depois de aparar (C7b, C7c). Local ao veículo: o `ClienteMapper` já apara com `@Named("aparado")`, então não há dívida no cliente.
7. **Invariante para a F18 (OS)**: ao criar a OS, o service valida que o `veiculo.cliente.id` é o `clienteId` da OS; divergência é 4xx, nunca gravação. Fica registrada aqui para o ADR da OS citar.
8. **Sem exclusão**: não há `DELETE` de veículo. Veículo vendido (P13) segue pela baixa com `ANON<id>` e cadastro novo para o novo dono, nunca por troca de dono.

### Consequências

* Bom, porque o dono nunca vem do usuário e o histórico de OS fica sempre ligado ao dono da época.
* Bom, porque PUT total deixa o contrato simples: o corpo é o estado final.
* Ruim, porque veículo vendido não troca de dono: exige baixa e cadastro novo (P13 sem dono nomeado), e a placa só fica livre após a baixa.
* Ruim, porque o app precisa reenviar todos os campos no PUT; esquecer `cor` limpa a cor (aceito pela revisão, critério 17).
* Neutro, porque `quilometragem` existe no schema e fica fora da API até a feature que a usar.

### Confirmação

* `VeiculoIT`: C9 (cliente inexistente: 404), C11a (dono do caminho), C17 (dono e quilometragem mantidos), C17a (PUT sem `cor`: 200 e `SELECT cor` pelo `JdbcTemplate` devolve `NULL`), C17b (cor em branco: `NULL`), C7a/C7b/C7c e C16a (aparar), C21 a C23a (lista).
* Build: `ReportingPolicy.ERROR` no `VeiculoMapper`.
* Revisão: nenhum `@DeleteMapping` em `VeiculoController`; nenhum campo de cliente em `VeiculoRequest`.

## Prós e contras das opções

### A. Criação aninhada, detalhe plano, PUT total

* Bom, porque atende F1 a F5.
* Neutro, porque mistura rota aninhada e plana; documentado em `docs/api/veiculos.md`.
* Ruim, porque não permite trocar dono pela API.

### B. Tudo aninhado

* Bom, porque a rota mostra o dono.
* Ruim, porque toda chamada exige `clienteId` e o service tem de conferir o par em todo GET e PUT, mais código e mais um 404 ambíguo.

### C. Tudo plano com `clienteId` no corpo

* Bom, porque rota única e simples.
* Ruim, porque o dono vem do corpo (falha F1) e abre a troca de dono pelo PUT, quebrando F2.

### D. Embutir no detalhe do cliente

* Bom, porque uma chamada só para a tela do cliente.
* Ruim, porque muda o contrato do detalhe do cliente da F08 (falha F3) e não resolve criação nem edição.

### E. PATCH parcial

* Bom, porque o app manda só o que mudou.
* Ruim, porque exige distinguir ausente de `null` (JSON Merge Patch ou `Optional` por campo), mais código e mais casos de teste, desproporcional ao porte.

## Mais informações

* Complementa ADR-001 (camadas), ADR-022 (placa), ADR-025 (histórico de OS).
* PRD `docs/product/F04-veiculos.md` (C7a a C7c, C11a, C16a, C17 a C17b, C19b); política rev 8, seção 2.6.
* Revisitar quando a P13 (veículo vendido) for decidida ou quando a F18 criar a OS.
