# F45: evidência da API de Clientes e Veículos (ESPRESSO)

Data: 2026-11-25. Código medido: `origin/main` = `00f3236` (clone limpo). Dados 100% fictícios, segredos descartáveis locais.

## 1. Build e testes do backend (US-REV-02-02)

Comando, em clone limpo de `00f3236` com JDK 21.0.10:

```
apps/api/mvnw -B -f apps/api/pom.xml clean verify
```

Saída final real:

```
[INFO] Tests run: 160, Failures: 0, Errors: 0, Skipped: 0     (failsafe, 8 classes IT, Testcontainers MySQL)
[INFO] BUILD SUCCESS
[INFO] Total time:  01:47 min
```

Contagem somada dos relatórios XML (`target/surefire-reports` e `target/failsafe-reports`):

| Fase | Testes | Falhas | Erros | Ignorados |
|---|---|---|---|---|
| surefire (unitários, 22 classes) | 250 | 0 | 0 | 0 |
| failsafe (integração, 8 classes) | 160 | 0 | 0 | 0 |
| **Total** | **410** | **0** | **0** | **0** |

Os 410 confirmam o número que o CRIVO relatou. Os 155 e os 208 antigos não valem: eram anteriores ao merge de F03c, F03d e F04. Nenhum teste falhou. Esta execução vale para o código da `main`; a branch da revisão não altera `apps/`.

## 2. Erros e bordas por HTTP (US-REV-02-05)

Ambiente: `api.jar` do clone limpo, MySQL 8.4 novo (Docker), Flyway V1–V8, login real com usuário criado só para o teste. Token expirado forjado com a chave descartável (`exp` 1 h no passado). Roteiro: `http-f45.sh` (fora do repositório). 52 chamadas.

| Caso | Resultado | Formato ADR-011 |
|---|---|---|
| Sem token (GET/POST/PUT em clientes e veículos), token lixo, token expirado (3 rotas) | 401 `Nao autenticado` | sim, `erros: []` |
| Cliente/veículo inexistente (GET, PUT, POST de veículo, lista de veículos) | 404 | sim |
| id `abc`, `0`, `-1`, `99999999999999999999` | 400 `Parametro invalido: id` | sim |
| `{}` em POST e PUT de cliente | 400, 3 campos em `erros[]` | sim |
| JSON malformado | 400 `Corpo da requisicao invalido` | sim |
| Sem `Content-Type` JSON | 415 | sim |
| CPF 10 dígitos, e-mail inválido, telefone curto, nome de 300 caracteres | 400 com o campo | sim |
| CPF repetido (POST e PUT), e-mail repetido, placa repetida | 409 | sim |
| Veículo: corpo vazio, placa inválida, ano texto, ano 2999 | 400 com chave i18n | sim |
| `DELETE /clientes/{id}` | 405 | sim |

Varredura nas 52 respostas: **0** ocorrências de `Exception`, `at pacote.Classe(`, `org.springframework`, `java.lang`. O CPF, o telefone, o e-mail e o nome que enviei só reaparecem em respostas 2xx (corpo do próprio recurso), nunca em corpo de erro.

Log da API (`api-f45.log`) depois da bateria: CPF cru 0, telefone cru 0, e-mail 0, nome 0, placa crua 0, stack trace 0.

### Observações novas (todas de baixa severidade, sem alterar produto)

| ID | Sev. | O que vi | Tamanho | Destino |
|---|---|---|---|---|
| ESP-01 | Baixa | `POST /clientes` com `"nome":123` (número JSON) responde 201 e grava `"123"`. O Jackson converte número em texto. | não pequeno (decisão sobre `ALLOW_COERCION_OF_SCALARS` mexe no contrato) | feature de correção F-API-3 |
| ESP-02 | Baixa | URL com barra dupla (`/clientes//veiculos`) responde 401 com `path":"/error"`, não 400/404. Quem barra é o firewall do Spring Security. Aconteceu por um id vazio no meu roteiro. | não pequeno (afeta segurança e ADR-004) | ressalva aceita; dono CARTOGRAFO |
| ESP-03 | Baixa | Erros de Veículos trazem a chave i18n na `mensagem` (`veiculo.form.placa.erro`) e preenchem `erros[].chave`. Erros de Clientes trazem texto e `chave: null`. | não pequeno (contrato) | decisão do PO sobre o formato único, junto com ARQ-02 |

LG-07 reconfirmado: `POST /clientes` com `{}` devolve `cpf e obrigatorio`.

## 3. Achados pequenos: nenhum código de produto foi alterado

O limite de 5 correções pequenas da revisão já está usado. Os 5 commits `fix(mobile)` estão na `main` (`919d39a` N-05, `eed2d2b` N-06, `d5a04b2` LG-04, `26acea2` N-09, `301cdf4` LG-03; relatório em `docs/design/F45-correcoes-pequenas-app-sprint-02.md`). Pela US-REV-02-18, os achados pequenos de CARTOGRAFO e VIGIA ficam como excedente: viram feature de correção e **não** entram nesta feature. Não escrevi teste de regressão sem correção, porque o critério exige que ele falhe antes e passe depois.

## 4. Features de correção a abrir (tarefa 14)

Não tenho acesso ao painel. Os textos abaixo ficam prontos para a pessoa abrir os cards.

| # | Título | Achados | Escopo resumido | Dono | Prazo |
|---|---|---|---|---|---|
| F-API-1 | `fix(api): completar o OpenAPI de Veículos e cobrir o OpenAPI do detalhe de cliente` | ARQ-03, ARQ-04, ARQ-07, LAC-03 | Declarar 500 nas 4 operações de `VeiculoController`; exemplo de 400 no PUT; ajustar a descrição de `ClienteRequest`; teste de OpenAPI do `GET /clientes/{id}` em `ClienteDetalheIT` | ESPRESSO | 2026-12-02 |
| F-API-2 | `test(api): cobrir cliente anonimizado no detalhe` | LAC-02 (DET-15) | Teste de integração novo, sem mudar produto | ESPRESSO | 2026-12-02 |
| F-API-3 | `fix(api): tolerância do token vencido e coerção de nome` | LG-08, ESP-01 | `JwtTimestampValidator` com tolerância de 5 s e teste `tokenExpiradoHa10sRetorna401`; registrar no ADR-004; decidir coerção de escalar | ESPRESSO, CARTOGRAFO (ADR) | 2026-12-11 |
| F-API-4 | `fix(clientes): tornar CPF opcional conforme P9` | LG-07 | Troca `@NotBlank` por campo opcional com `@Pattern`; ajusta testes; depende da decisão da P9 | BUSSOLA (decisão), ESPRESSO, ORLA | 2026-12-04 |
| F-DOC-1 | `docs(architecture): alinhar arquitetura-backend.md aos ADRs` | ARQ-02, ESP-03 | Já descrito pelo CARTOGRAFO | CARTOGRAFO e PERGAMINHO | 2026-12-02 |

## 5. Higiene (US-REV-02-15)

- `gitleaks detect --source . --redact`: `481 commits scanned ... no leaks found`.
- O commit `03e7646` ainda tem `Co-Authored-By: Claude Opus 5.5` e **já está na `main`** (52 mensagens de commit com o trailer). Corrigir exige reescrever histórico publicado com force-push na `main`. Não fiz. Decisão da pessoa: aceitar como ressalva ou autorizar a reescrita.

## 6. O que não fiz

- Rodar o `f35-real-api.test.tsx` com `QA_F35_API` (LAC-01): é do app, fica com ORLA e CRIVO, que já o relataram.
- Repetir o `mvn clean verify` depois das correções: não houve correção de produto, então o resultado da seção 1 vale.
- Token vencido por pouco (10 a 45 s): coberto pelo teste do VIGIA (LG-08), não repeti.

## 7. Rodada 3 (ESPRESSO, 2026-11-25)

- `mvn clean verify` repetido em clone limpo de `00f3236` (`.f45-clone`, `git status` limpo, HEAD igual a `origin/main`): surefire 250, failsafe 160, **410 testes, 0 falhas**, BUILD SUCCESS, 01:01 min. Confirma a seção 1.
- Dois testes novos em `VeiculoIT`, só teste, sem mudar produto (passam; não há estado "falha antes", pois cobrem comportamento já existente):
  - `shouldAcceptBrandWith100CharactersWhenOnlyTheEdgesAreSpaces` fecha C7c;
  - `shouldNotExposeOwnerPersonalDataWhenDetailingVehicle` fecha C19b.
- Da LAC-08 resta só C19a (provar que a API não consulta `ordens_servico`), que depende da F06 e do ADR-025. Fica na feature de correção só de teste (dono ESPRESSO, 2026-12-02), junto com DET-11 e DET-16.
- A bateria HTTP da seção 2 (52 chamadas sobre o jar) é do mesmo commit `00f3236` e não foi repetida.
