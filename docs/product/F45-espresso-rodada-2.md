# F45, rodada 2: entrega do ESPRESSO (testes de borda e suíte intermitente)

Data: 2026-11-25. Branch `docs/f45-revisao-sprint-02-rodada-2`. Nenhum código de produto foi alterado.

## 1. Build do backend num clone limpo da `main`

Clone novo de `origin/main` (`00f3236`, merge do PR #34), JDK 21.0.10, Docker Desktop ligado (Testcontainers, MySQL 8.4).

```
./mvnw -B clean verify        (em apps/api do clone)
Tests run: 250, Failures: 0, Errors: 0, Skipped: 0     (surefire, unitários)
Tests run: 160, Failures: 0, Errors: 0, Skipped: 0     (failsafe, 8 classes *IT)
BUILD SUCCESS, 02:10 min
```

Total: **410 testes, 0 falhas**. Isso inclui F03c, F03d e F04, que já estão na `main`. O número "155" do relatório anterior está superado.

Atenção: o `apps/api/target` do working tree tinha classes antigas (migrations V9 e V10 que não existem no código) e fez `VeiculoIT` falhar numa rodada sem `clean`. Sempre rodar com `clean`.

## 2. Testes de integração novos (só teste, sem mudar produto)

| Teste | Fecha | Resultado |
|---|---|---|
| `ClienteDetalheIT#shouldReturn200WithOnlyNameWhenClientIsAnonymized` | DET-15 (LAC-02) | passa |
| `ClienteDetalheIT#shouldReturn401WithoutPersonalDataWhenTokenIsExpired` | DET-06 expirado (LAC-04, parte) | passa |
| `ClienteDetalheIT#shouldDocumentGetClienteByIdWith200And400And401And404And500InOpenApi` | DET-17 (LAC-03, em parte) | passa |
| `VeiculoIT#shouldOrderErrorsByFieldNameWhenSeveralFieldsAreInvalid` | C7 e C26: ordem de `erros[]` | passa |
| `VeiculoIT#shouldReturn400OnModelFieldWhenModelHasOnlySpaces` | C7b | passa |
| `VeiculoIT#shouldReturnEmptyErrorsArrayOn404And400OfIdAnd405WhenMethodIsNotAllowed` | C25b | passa |

Esses testes cobrem comportamento que já existia, então **não existe estado "falha antes"** para eles: são lacunas de cobertura, não defeitos. Não os apresento como regressão de achado.

As bordas 400, 401 (sem token, malformado, expirado, chave errada, `alg=none`), 404 e 409 de Clientes e Veículos já tinham teste de integração (`ClienteCriarIT`, `ClienteAtualizarIT`, `ClienteDetalheIT`, `VeiculoIT`, `VeiculoSegurancaIT`). Não dupliquei.

Ainda abertos (não feitos): DET-11 (500 forçado sem vazar dado), DET-16 (upgrade V3 para V4 com linha existente), C7c, C19a, C19b, e o schema dos 6 campos no OpenAPI do GET.

## 3. Suíte Jest intermitente (LAC-10)

Reproduzi a falha: com o cache do Jest limpo e **3 suítes completas em paralelo**, 8 a 10 suítes (12 a 13 testes) falharam, quase todas por `Exceeded timeout of 5000 ms for a test`, sempre no primeiro teste de cada arquivo (carga fria do `jest-expo` e do router).

| Condição | Resultado |
|---|---|
| Cache frio, 3 em paralelo, `testTimeout` padrão (5 s) | 8, 10 e 9 suítes falharam (337 s) |
| Cache quente, 3 em paralelo, padrão | 0 falhas nas 3 (27 s) |
| Cache frio, 3 em paralelo, `testTimeout: 30000` | 0, 2 e 2 suítes falharam (102 s) |
| Cache quente, 3 em paralelo, 30 s | 0 falhas nas 3 (38 s) |
| Execução única, com a mudança | 98 suítes passam, 891 testes, 34 ignorados |

Conclusão: a causa é **cache frio somado a contenção de CPU**, e não defeito dos testes. A mudança (`apps/mobile/jest.config.js`, `testTimeout: 30000`) **reduz, mas não elimina**. Sobram, sob a carga extrema, um `waitFor` de `MenuLayout` (o padrão de 1000 ms do Testing Library) e um timeout de `ClientesScreen` aos 30 s. Não investiguei essas duas. O `act` apontado antes como suspeito não apareceu nos erros desta reprodução.

Não existe teste de regressão para essa mudança (é configuração do runner); a evidência é a tabela acima. Fica para a ORLA (F-APP-10): `asyncUtilTimeout` do Testing Library e um passo de aquecimento do cache no CI.

## 4. Verificação final (uma vez, no fim)

- `apps/api`: `./mvnw -B clean verify` na branch: surefire 250, failsafe 166, 0 falhas, BUILD SUCCESS. O total passou de 410 para 416 (6 testes novos).
- `apps/mobile`: `npm run lint`: 0 erros, 15 avisos (não investiguei os avisos nem se são anteriores). `npm run typecheck`: sem saída de erro. `npm test`: 98 suítes passam, 891 testes, 34 ignorados.

## 5. O que não foi feito

- Não subi o jar com MySQL para chamar por HTTP (tarefa 5 com 401 expirado, id inválido): a cobertura vem dos ITs com MockMvc, que usam o filtro de segurança real e MySQL real, mas **não é HTTP sobre o jar**.
- Não rodei `f35-real-api.test.tsx` com `QA_F35_API`: os 34 ignorados continuam ignorados.
- Gitleaks, TalkBack/VoiceOver, capturas e medição de contraste: fora do que eu posso fazer (sem leitor de tela, sem Figma).
- ARQ-03, ARQ-04, ARQ-08, ARQ-11 e F-API-7/F-API-8 (pedidos do CARTOGRAFO que mudam produto ou `checkstyle.xml`): não fiz. Passam do limite de 5 correções pequenas desta revisão ou tocam contrato OpenAPI.
- Totais da seção 10.1 da matriz não foram recalculados após as mudanças de status.
