---
status: proposto   # 2026-11-19 proposto (F04, CARTOGRAFO); aguarda aceite formal da pessoa dona do produto
date: 2026-11-19
decision-makers: [CARTOGRAFO (Arquiteto, o como), VIGIA (AppSec/LGPD, revisão 7 da política), pessoa dona do produto (aceite)]
consulted: [BUSSOLA (PRD F04 rev 2), ESPRESSO (código do commit 4becbb2)]
informed: [CRIVO, PERGAMINHO, ANCORA, ORLA, dono da F35]
---

# Normalizar a placa no DTO e garantir unicidade pelo índice `uk_veiculos_placa` da V7 com 409 no ponto único de gravação

## Contexto e problema

A F04 pede placa única em toda a oficina, aceitando o padrão antigo (`ABC1234`) e o Mercosul (`ABC1D23`), com hífen, espaço e minúscula na entrada (critérios 3, 6, 10, 14 e 15 do card). O código do commit `4becbb2` já cita este ADR, mas o arquivo não existia (conferido por `git log --all` em 2026-11-19).

Migrations lidas em 2026-11-19:

* `apps/api/src/main/resources/db/migration/V2__criar_schema_oficina.sql`: cria `veiculos.placa VARCHAR(10) NOT NULL` **sem** índice único e sem `CHECK`.
* `apps/api/src/main/resources/db/migration/V7__adicionar_indice_unico_e_check_de_placa_em_veiculos.sql` (commit `1a0a325`): adiciona `uk_veiculos_placa UNIQUE (placa)` e `ck_veiculos_placa_formato CHECK (REGEXP_LIKE(placa, '^([A-Z]{3}[0-9][A-Z0-9][0-9]{2}|ANON[0-9]{1,6})$', 'c'))`.

Pergunta: onde normalizar a placa e como garantir unicidade sem 500 na corrida e sem vazar a placa?

## Fatores de decisão

* F1. Corrida: dois POST simultâneos com a mesma placa resultam em um 201 e um 409, nenhum 500.
* F2. Nada vaza: o erro 1062 do MySQL escreve a placa inteira; nenhum caminho usa `getMessage()` nem propaga a causa, e log só leva placa mascarada (`MascaraDadoPessoal.placa`).
* F3. Uma única forma canônica gravada (`ABC1D23`), para o índice comparar igual com igual.
* F4. Um comando SQL por escrita, sem código para o PUT excluir o próprio id.
* F5. Migration aditiva (ADR-003) e mesmo padrão de 409 já provado no CPF (ADR-020) e no email (ADR-026).

## Opções consideradas

* A. Normalizar no construtor compacto do `VeiculoRequest` (`PlacaVeiculo.normalizar`), validar com `@Pattern(PlacaVeiculo.REGEX)`, garantir unicidade pelo índice da V7 e traduzir a violação para 409 no `gravar` do service, sem consulta prévia.
* B. Sem índice: `existsByPlaca` no POST e `existsByPlacaAndIdNot` no PUT.
* C. Índice da opção A mais consulta prévia `existsByPlaca...`, para responder antes do `flush`.
* D. Coluna gerada normalizada (ou índice funcional) no banco, aceitando a placa crua.
* E. Manter como está na V2: placa sem índice nem `CHECK`.

## Resultado da decisão

Opção escolhida: "A", porque é a única que atende F1 e F4 juntas: o InnoDB serializa a corrida no próprio índice com um comando só, e o `UPDATE` da própria linha com o mesmo valor não viola o índice, então o PUT não precisa se excluir da checagem. Reaproveita o caminho de 409 do ADR-020 e do ADR-026 (F5).

**Divergência registrada com a tarefa 2 do card**, que pedia `existsByPlaca`/`existsByPlacaAndIdNot`: o `VeiculoRepository` não tem essas consultas, de propósito. A garantia é o índice; a consulta prévia não fecha a corrida (opção C) e duplica regra.

### Especificação normativa

1. **Normalização** em `entity/PlacaVeiculo.normalizar`, chamada no construtor compacto do `VeiculoRequest`, antes do Bean Validation: remove só espaço ASCII e hífen, converte só `a`-`z` para maiúscula (sem `toUpperCase`, que no JDK 21 transforma `ı` em `I`), devolve sem tocar entrada acima de 20 caracteres (`TAMANHO_MAXIMO_BRUTO`) e preserva `null`.
2. **Formato** validado por `@Pattern(regexp = PlacaVeiculo.REGEX)` com `^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$`. A API nunca aceita `ANON...`; esse ramo do `CHECK` existe só para a baixa por anonimização (P13).
3. **Defesa em profundidade** no banco: `ck_veiculos_placa_formato` com flag `'c'` (sensível a caixa), que recusa gravação fora do formato vinda de qualquer caminho que não a API.
4. **Unicidade** só por `uk_veiculos_placa`. O `VeiculoService.gravar` faz `saveAndFlush` e traduz `DataIntegrityViolationException` cujo nome de constraint termina em `uk_veiculos_placa` para `PlacaJaCadastradaException`, **sem causa**. Qualquer outra violação segue para o handler genérico.
5. **Resposta 409**: `mensagem` e `erros[0].chave` = `veiculo.form.placa.duplicada`, `erros[0].campo` = `placa` (ADR-023). Nunca devolve id nem dono do veículo existente.
6. **Proibido**: `existsByPlaca*` no repository; `SELECT placa` em diagnóstico (contagem só com `COUNT(*)`, W4); placa em log sem máscara.

### Consequências

* Bom, porque a corrida fecha no banco e o PUT de mesma placa não precisa de exclusão por id.
* Bom, porque o `CHECK` barra placa fora do formato mesmo em carga manual ou script.
* Ruim, porque a V7 falha no deploy se a base real tiver placa duplicada ou fora do formato; o erro 1062 do Flyway escreve a placa no log de boot (W5/P17). Antes de qualquer deploy: contar duplicadas e fora do formato só com `COUNT(*)` e testar a V7 numa cópia dos dados reais (P8/V7, aceite nominal pendente).
* Ruim, porque o 409 é oráculo de existência de placa para usuário autenticado (V7 da política); aceito porque não há perfil externo e o 409 não devolve dono.
* Ruim, porque `VARCHAR(10)` limita o `ANON<id>` a 6 dígitos (veículo 999999, P14).

### Confirmação

* `PlacaVeiculoTest` (hífen, espaço, minúscula, `ı`, entrada longa, `null`).
* `VeiculoIT`: C3 (normalização), C4 (formato), C6 (409 no POST), C10 (corrida, nenhum 500), C14 (PUT com a própria placa: 200), C15 (409 no PUT), C24 (placa mascarada no log) e o IT que grava `ANON<id>` pelo JDBC e recusa pela API.
* Revisão: `grep -rn "existsByPlaca" apps/api/src` sem resultado; nenhum `getMessage()` no caminho do 409.

## Prós e contras das opções

### A. DTO normaliza, índice garante, `gravar` traduz

* Bom, porque fecha a corrida (F1) com um comando (F4) e mesmo padrão do ADR-020/026 (F5).
* Neutro, porque depende de o nome da constraint seguir estável (`uk_veiculos_placa`).
* Ruim, porque o deploy da V7 exige limpeza prévia dos dados reais.

### B. Só `existsByPlaca` / `existsByPlacaAndIdNot`

* Bom, porque não exige migration nem limpeza de dados.
* Ruim, porque deixa a corrida aberta (falha F1): duas transações leem "não existe" e gravam a mesma placa.
* Ruim, porque são duas consultas por escrita e exige exclusão do próprio id (falha F4).

### C. Índice mais consulta prévia

* Bom, porque responde 409 antes do `flush` na maioria dos casos.
* Ruim, porque a consulta não substitui o índice (a corrida ainda passa pela tradução), dobrando código e consultas sem ganho de garantia (falha F4).

### D. Coluna gerada normalizada no banco

* Bom, porque aceitaria qualquer entrada de qualquer cliente da API.
* Ruim, porque espalha a regra entre Java e SQL, exige migration mais complexa e ainda grava a forma crua, contra F3.

### E. Manter como está

* Bom, porque custo zero agora.
* Ruim, porque falha F1, F3 e o critério de placa única.

## Mais informações

* Complementa: ADR-003 (migrations aditivas), ADR-011 (formato do erro), ADR-020 e ADR-026 (padrão do 409), ADR-023 (chave no `erros[]`), ADR-024 (vínculo com cliente).
* PRD: `docs/product/F04-veiculos.md`. Política: `docs/security/politica-dados-pessoais-cliente.md` rev 7 (V7, W4, W5, P13, P14, P17).
* Revisitar se surgir placa estrangeira ou de outro padrão, ou quando a P13 (baixa de veículo vendido) for decidida.
