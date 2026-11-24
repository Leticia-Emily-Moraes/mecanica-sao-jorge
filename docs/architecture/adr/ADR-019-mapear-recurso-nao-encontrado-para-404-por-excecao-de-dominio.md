---
status: proposto   # 2026-11-17 proposto (F03b, card F08)
date: 2026-11-17
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [BUSSOLA (PRD F03b, premissa 3), ESPRESSO (implementação), VIGIA (mensagem e log sem dado pessoal)]
informed: [REGENTE, CRIVO, ORLA, PERGAMINHO]
---

# Mapear recurso de domínio não encontrado para 404 com exceção dedicada no handler global

## Contexto e problema

O ADR-011 (aceito, imutável) fixou o formato de erro e mapeou `AppError` para 422. O ADR-017 (revisão 2) acrescentou o 404 de **rota** inexistente (`NoResourceFoundException`, mensagem "Recurso nao encontrado"). Não existe 404 para **recurso de domínio** inexistente: hoje uma subclasse comum de `AppError` vira 422, e qualquer outra exceção vira 500. A F03b precisa responder 404 para `GET /api/v1/clientes/{id}` com id inexistente (US-CLI-DET-04), e o mesmo caso volta em veículos (F04), serviços e peças (F11, F12, F14, F15), OS (F19, F20), parcelas (F22) e lançamentos (F23). Como o service sinaliza "não encontrado" e como isso vira 404 sem regra no controller e sem dado pessoal na resposta?

## Fatores de decisão

* F1. Corpo no formato do ADR-011 (`timestamp`, `status`, `erro`, `mensagem`, `path`) também no 404 de recurso.
* F2. Mensagem fixa: nunca o id pedido, nunca dado pessoal, nunca o valor rejeitado (política de dados do cliente, seção 6).
* F3. Regra no service e controller fino (CLAUDE.md, ADR-001): o controller não decide status.
* F4. Um handler só para todos os recursos: feature nova cria uma classe de poucas linhas e nenhum handler.
* F5. Bug de programação não pode virar 404 silencioso (um `Optional.get()` vazio por erro tem que continuar 500).
* F6. Não mudar o status de nenhum erro que já existe (422 de `AppError`, 401 de login, 404 e 405 de rota).

## Opções consideradas

* A. Exceção abstrata `RecursoNaoEncontradoException` (subclasse de `AppError`), uma subclasse concreta por recurso e um handler 404 no `GlobalExceptionHandler`.
* B. O service lança `ResponseStatusException(HttpStatus.NOT_FOUND)`.
* C. O service devolve `Optional` e o controller responde `ResponseEntity.notFound()`.
* D. O service usa `orElseThrow()` sem argumento e o handler mapeia `NoSuchElementException` (e `EntityNotFoundException`) para 404.
* E. Manter como está: subclasse comum de `AppError`, que sai 422.

## Resultado da decisão

Opção escolhida: "A. Exceção abstrata com subclasse por recurso", porque é a única que atende os seis fatores: o service sinaliza o caso de domínio (F3), um handler cobre todos os recursos (F4), a mensagem vem fixa da subclasse (F2), exceções genéricas continuam 500 (F5) e nenhum status existente muda (F6). Complementa o ADR-011 com uma linha a mais no mapeamento; não o substitui.

Contrato, em `exception`:

```java
/** Recurso de dominio inexistente (ADR-019). Mensagem fixa da subclasse, sem id nem dado pessoal. */
public abstract class RecursoNaoEncontradoException extends AppError {
  protected RecursoNaoEncontradoException(String code, String message) {
    super(code, message);
  }
}

public class ClienteNaoEncontradoException extends RecursoNaoEncontradoException {
  private static final String CODE = "CLIENTE_NAO_ENCONTRADO";
  private static final String MESSAGE = "Cliente nao encontrado";

  public ClienteNaoEncontradoException() {
    super(CODE, MESSAGE);
  }
}
```

No `GlobalExceptionHandler`:

```java
@ExceptionHandler(RecursoNaoEncontradoException.class)
public ResponseEntity<ErrorResponse> handleRecursoNaoEncontrado(
    RecursoNaoEncontradoException ex, HttpServletRequest request) {
  return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
}
```

No service da F03b:

```java
Cliente cliente = clienteRepository.findById(id).orElseThrow(ClienteNaoEncontradoException::new);
```

Regras:

1. **Construtor sem argumento.** A subclasse não recebe o id nem outro valor. Assim ninguém consegue pôr dado da requisição na mensagem, e a mensagem pode ir para a resposta sem revisão caso a caso.
2. **Mensagem.** Fixa, em português sem acento, no mesmo padrão das mensagens fixas do handler ("Recurso nao encontrado", "Metodo nao permitido"). O app não exibe a `mensagem` da API: mostra o texto do próprio i18n a partir do `status` (F35, US-CLI-DET-09).
3. **Precedência.** O Spring escolhe o `@ExceptionHandler` da exceção mais próxima na hierarquia. É o mesmo mecanismo que hoje faz `CredenciaisInvalidasException` sair 401 apesar do handler de `AppError` (422). O teste da Confirmação prova as duas coisas juntas.
4. **Sem log no handler.** Igual ao 404 de rota (ADR-017): não encontrado não é erro da aplicação. A rastreabilidade de quem consultou qual id fica na linha de log do service, cuja forma o VIGIA decide (contrato do detalhe no `overview.md`).
5. **Nomes.** Subclasse `<Recurso>NaoEncontradoException`, `code` `<RECURSO>_NAO_ENCONTRADO`, mensagem `<Recurso> nao encontrado(a)`. Exemplos futuros: `VeiculoNaoEncontradoException` (F04), `OrdemServicoNaoEncontradaException` (F19).
6. **Proibido no código de produção:** `ResponseStatusException`, `ResponseEntity.notFound()` e `orElseThrow()` sem argumento para sinalizar recurso inexistente.
7. **Id inválido continua 400, não 404.** `@PathVariable @Positive Long id`: não numérico ou acima de `Long.MAX_VALUE` cai em `MethodArgumentTypeMismatchException`; zero ou negativo cai em `HandlerMethodValidationException`. Os dois handlers já existem e respondem "Parametro invalido: id", sem o valor (lido no código em 2026-11-17; falta o teste desta rota).

### Consequências

* Bom, porque toda feature com leitura por id ganha 404 no formato do ADR-011 criando uma classe de poucas linhas, sem tocar no handler.
* Bom, porque a mensagem não tem como carregar dado da requisição: o construtor não aceita argumento.
* Bom, porque `NoSuchElementException` e afins continuam 500, então bug não se disfarça de "não encontrado".
* Neutro, porque 404 de rota e 404 de recurso têm o mesmo status e mensagens diferentes; o app trata os dois como "não encontrado".
* Ruim, porque cada recurso exige uma classe a mais (uma por entidade lida por id, perto de 8 no projeto todo).
* Ruim, porque quem esquecer de herdar de `RecursoNaoEncontradoException` e herdar direto de `AppError` recebe 422 sem aviso de compilação; só o teste ou a revisão pegam.

### Confirmação

* `GlobalExceptionHandlerTest`: `ClienteNaoEncontradoException` responde 404 com os 5 campos e `mensagem` "Cliente nao encontrado"; uma subclasse comum de `AppError` continua 422; `CredenciaisInvalidasException` continua 401.
* `ClienteControllerTest` (MockMvc): service lançando `ClienteNaoEncontradoException` resulta em 404 com `path` `/api/v1/clientes/999999`; `/abc`, `/0`, `/-1` e `/99999999999999999999` resultam em 400 com `mensagem` "Parametro invalido: id" e sem o valor.
* Teste de integração: `GET /api/v1/clientes/999999` contra MySQL real responde 404 (US-CLI-DET-04).
* `git grep -nE "ResponseStatusException|ResponseEntity.notFound|orElseThrow\(\)" -- apps/api/src/main` sem ocorrência.
* Revisão de PR: toda classe `*NaoEncontrad*Exception` estende `RecursoNaoEncontradoException`.

## Prós e contras das opções

### A. Exceção abstrata com subclasse por recurso (escolhida)

* Bom, porque o service fala a língua do domínio e o handler decide o status (F3).
* Bom, porque um handler serve todos os recursos (F4), e a mensagem é fixa por construção (F2).
* Bom, porque reaproveita `AppError` e o `code` estável que ele já tem.
* Ruim, porque soma uma classe por recurso e depende de revisão para garantir a herança certa.

### B. `ResponseStatusException` no service

* Bom, porque é nativo do Spring e não cria classe.
* Ruim, porque põe status HTTP dentro do service, misturando camada web com regra de negócio (F3).
* Ruim, porque o handler genérico de `Exception` captura antes e responde 500; seria preciso outro handler para ela, e a mensagem passaria a ser texto livre escrito em cada chamada (F2).

### C. `Optional` no service e 404 no controller

* Bom, porque não cria exceção.
* Ruim, porque `ResponseEntity.notFound()` sai sem corpo, fora do formato do ADR-011 (F1).
* Ruim, porque o controller passa a decidir regra e status, e cada controller repete o mesmo `if` (F3, F4).

### D. `NoSuchElementException` global como 404

* Bom, porque é o menor código: `orElseThrow()` e um handler.
* Ruim, porque qualquer `Optional.get()` vazio por bug, em qualquer camada, vira 404 em vez de 500 (F5).
* Ruim, porque a mensagem teria que ser genérica para todos os recursos, ou montada a partir da exceção, cujo texto não é controlado (F2).

### E. Manter como está (422)

* Bom, porque não muda nada no handler.
* Ruim, porque 422 diz "entrada bem-formada que viola regra", não "não existe"; contraria o PRD (US-CLI-DET-04) e a semântica HTTP que o app usa para separar "não encontrado" de erro (F1).

## Mais informações

**Risco residual.** Ids são sequenciais, então 404 e 200 permitem descobrir quais ids existem. Não acrescenta exposição: qualquer token já lista todos os clientes pela F03a (achado A3 da política, risco aceito). Revisitar quando houver permissão por perfil.

**Vínculos.** PRD `docs/product/F03b-clientes-detalhe.md` (premissa 3, critérios US-CLI-DET-04, 05 e 13). Complementa o ADR-011 (formato e mapeamento) e o ADR-017 (404 e 405 de rota). Usado pelo ADR-018 e pelo contrato do detalhe no `overview.md`. Vale para F04, F11, F12, F14, F15, F19, F20, F22 e F23.

**Revisitar quando:** surgir recurso cuja existência seja informação sensível por si (aí o 404 pode ter que virar 403 ou 404 indistinto por perfil).

## Histórico

| Data | Status | Mudança |
|---|---|---|
| 2026-11-17 | Proposto | Criação na F03b (CARTOGRAFO) |
