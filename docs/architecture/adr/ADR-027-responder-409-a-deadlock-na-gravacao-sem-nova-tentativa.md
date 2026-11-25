---
status: proposto   # 2026-11-18 proposto (F03d, card F10, achado U6 do VIGIA)
date: 2026-11-18
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: [VIGIA (achado U6, política 8.6 e seção 7 "API, edição")]
informed: [ESPRESSO, CRIVO, PERGAMINHO, ORLA]
---

# Responder 409 a deadlock e espera de lock na gravação, sem nova tentativa

## Contexto e problema

Com os índices únicos `uk_clientes_cpf` (V6) e `uk_clientes_email` (V8, [ADR-026](ADR-026-garantir-email-unico-por-indice-na-v8-com-409-no-ponto-unico-de-gravacao.md)), a corrida entre escritas normalmente termina em 1062, que vira 409. Provei em MySQL 8.4 que ela também pode terminar em **deadlock (1213)** (Mais informações). Hoje nada trata isso (conferido por `grep` de `CannotAcquireLock`, `PessimisticLock` e `1213` em `apps/api/src/main`), então a requisição perdedora cai no handler genérico e responde 500. Isso contraria o US-CLI-33 ("nenhum erro 500"). O VIGIA deixou o status com o CARTOGRAFO (U6): 409 ou nova tentativa no service?

## Fatores de decisão

* F1. Nenhum 500 na corrida (US-CLI-33), no POST e no PUT de cliente.
* F2. Sem dependência nova e sem mudar a fronteira transacional do service (`@Transactional` por método).
* F3. Mensagem fixa, sem `getMessage()` e sem causa: a mensagem do driver pode citar a consulta.
* F4. O caminho pode ser provado por teste de integração determinístico.

## Opções consideradas

* A. Handler global: `PessimisticLockingFailureException` responde 409 com mensagem fixa, sem nova tentativa.
* B. Nova tentativa no service, com `TransactionTemplate` em laço (no máximo 2 tentativas).
* C. Nova tentativa declarativa com `@Retryable`.
* D. Manter como está (500).

## Resultado da decisão

Opção escolhida: "A. 409 com mensagem fixa no handler global". Atende F1 a F4 com um método no handler. O deadlock só aparece com três escritas concorrentes no mesmo valor ou com valores cruzados, o que numa oficina de balcão é raro. Quem recebe o 409 reenvia, e o reenvio termina em 200 ou no 409 com o campo. Uma nova tentativa automática daria o mesmo resultado, com mais código.

### Especificação normativa

1. `GlobalExceptionHandler` ganha `@ExceptionHandler(PessimisticLockingFailureException.class)`, que responde 409 no formato do ADR-011 com a `mensagem` fixa `Conflito de gravacao simultanea, tente novamente` e `erros: []`, **sem log** e sem ler a exceção. `PessimisticLockingFailureException` é a mãe de `CannotAcquireLockException` (deadlock 1213 e espera de lock 1205) no Spring.
   * **Não verificado:** a classe exata que chega ao handler pelo caminho JPA (Hibernate `LockAcquisitionException` traduzida pelo Spring). O IT prova. Se chegar outra classe, o ESPRESSO a acrescenta ao mesmo handler, e não ao handler genérico.
2. O handler é global, então vale também para veículos (`uk_veiculos_placa`, F04), que têm a mesma corrida. Isso não muda nenhum contrato da F04: troca um 500 por um 409, um status que as rotas de veículo já documentam.
3. O `ClienteService.atualizar` captura `PessimisticLockingFailureException` só para emitir `clientes.editar.conflito clienteId={} usuarioId={} campo=concorrencia` e relança a mesma exceção. O valor `concorrencia` é texto fixo, sem dado pessoal. **Depende de o VIGIA acrescentar esse valor à 6.7 da política**, que hoje só prevê `cpf` e `email`. Se ele recusar, a linha sai, e o resto da decisão fica.
4. Proibido `getMessage()`, log de pilha ou causa no handler e no service, como no ADR-020.

### Consequências

* Bom, porque nenhuma escrita concorrente de cliente ou veículo responde 500.
* Bom, porque o custo é um método no handler e uma captura no `atualizar`, sem dependência e sem mexer em transação.
* Ruim, porque a mensagem não diz o campo. O card exige o campo só nos cenários de CPF e email (US-CLI-27 e US-CLI-31). O US-CLI-33 só exige 409.
* Ruim, porque o usuário reenvia à mão. Pela raridade, é aceitável. Se o log mostrar `campo=concorrencia` com frequência, revisitar a opção B.

### Confirmação

* IT com Testcontainers e PUT simultâneos nos três casos da política (seção 7, "API, edição"): mesmo CPF, mesmo email e cruzado. Nenhum 500. As respostas são só 200 e 409, e todo 409 tem `erros: []` e uma das três mensagens fixas.
* Teste do handler (unitário ou MockMvc) com uma `CannotAcquireLockException` simulada: 409, mensagem fixa e nenhuma linha de log do handler.
* Captura de log: nenhuma ocorrência de `Deadlock found` nem de valor fictício.
* `git grep -n "PessimisticLockingFailureException" -- apps/api/src/main` mostra só o handler e o `ClienteService.atualizar`.

## Prós e contras das opções

### A. 409 no handler global (escolhida)

* Bom, porque atende F1 a F4 e cobre também a corrida de placa da F04.
* Ruim, porque o usuário reenvia à mão, e a resposta não aponta o campo.

### B. Nova tentativa com `TransactionTemplate`

* Bom, porque o perdedor do deadlock costuma terminar em 200 ou no 409 com o campo, sem ação do usuário.
* Ruim, porque o `atualizar` deixa de ser `@Transactional` e passa a controlar a transação à mão (F2). O `gravar` é compartilhado com o `criar`, que teria de mudar junto.
* Ruim, porque provar a segunda tentativa exige provocar o deadlock de propósito, o que torna o teste frágil (F4).
* Custo de manter: cerca de 30 linhas e um teste de concorrência a mais, para um caso raro.

### C. `@Retryable` declarativo

* Bom, porque o código do service quase não muda.
* Ruim, porque a nova tentativa precisa envolver a transação por fora. A ordem entre o proxy de retry e o `@Transactional` é configuração implícita, fácil de inverter sem nenhum erro de compilação.
* Ruim, porque, pelo que sei, o Spring Framework 7 traz `@Retryable` no núcleo. Não conferi isso neste `pom.xml`, e se faltar, é dependência nova com ADR próprio (F2).

### D. Manter como está

* Bom, porque não custa nada.
* Ruim, porque não atende F1: o deadlock provado vira 500, com log ERROR.

## Mais informações

**Evidência (CARTOGRAFO, 2026-11-18).** Mesmo contêiner `mysql:8.4` descartável e sem rede do ADR-026, com V1 a V7 e o índice `uk_clientes_email`, só com dado fictício. Removido no fim. Saída real, resumida:

```text
3 sessoes, mesmo email; T1 segura o lock e faz ROLLBACK:
  T3: ERROR 1213 (40001) at line 1: Deadlock found when trying to get lock; try restarting transaction
  T2: grava (1 linha) | T1: rollback
2 sessoes cruzadas (T1: cpf X e depois email Y; T2: email Y e depois cpf X), duas instrucoes por transacao:
  T2: ERROR 1213 (40001) at line 1: Deadlock found when trying to get lock; try restarting transaction
  T1: grava
```

No PUT real, cada transação tem um `UPDATE` só. O caso das 3 sessões acontece quando a transação que segura a primeira entrada falha no outro índice e faz rollback. O caso cruzado com uma instrução por transação **não foi provado**. O IT do ESPRESSO prova os dois pelo caminho da API.

**Vínculos.** Card F10: critério 8 (US-CLI-33) e tarefa 5. Política, 8.6 (U6) e seção 7 ("API, edição"). Complementa o ADR-011 (acrescenta um caso ao 409), o ADR-020 e o ADR-026.

**Revisitar quando:** o log mostrar `campo=concorrencia` com frequência; surgir escrita em lote; ou entrar controle de concorrência otimista (`@Version`), que está fora do escopo da F10.

## Histórico

| Data | Status | Mudança |
|---|---|---|
| 2026-11-18 | Proposto | Criação na F03d (CARTOGRAFO), com o deadlock provado em MySQL 8.4. A linha `campo=concorrencia` depende do VIGIA (regra 3) |
