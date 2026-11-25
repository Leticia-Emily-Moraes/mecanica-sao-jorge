# F45 — Matriz critério Gherkin x teste (Sprint 02, rodada 2)

- Rascunho: CRIVO (QA), 2026-11-24 · Revisão e fechamento: BUSSOLA (PO), 2026-11-25
- Base: branch `docs/f45-revisao-sprint-02-rodada-2` = `main` `00f3236` (já contém F03a, F03b, F03c, F03d, F04, F26 e F35).
- Escopo: leitura de código e execução de testes. Nenhum código de produto foi alterado. Esta matriz **não reescreve nenhum critério** das features revisadas; onde o texto do critério não está no repo, a linha diz isso (seção 10.3).
- Estado: **fechada como matriz**. As lacunas da seção 10 continuam abertas, cada uma com dono e destino proposto.

## 1. Como ler

Classes: **Coberto** (teste executado e passando), **Parcial** (há teste, mas falta parte do critério; a coluna "teste" diz o que falta), **Lacuna** (sem teste, ou ID sem registro no repo), **Manual** (depende de aparelho, Figma ou pessoa).

Tipo: S = sucesso, E = erro, B = borda.

Nomes de teste: `Classe#método`. Os de integração (`*IT`) estão em `apps/api/src/test/java/br/com/mecanicasaojorge/api/integration/`; os `*Test` de controller e service ficam ao lado do código testado. Os de tela estão em `apps/mobile`.

Texto de card: os cards de F03a, F03c, F03d e F35 **não estão no repo**. Onde o resumo é "derivado de <arquivo>", ele vem do nome do teste ou de comentário, não de texto de aceite. Isso limita o que a matriz prova: ela diz que existe teste para o comportamento descrito pelo nome, não que o teste cobre o critério original.

## 2. O que EXECUTEI e o que LI

| Item | Situação | Evidência |
|---|---|---|
| Backend (surefire + failsafe), clone limpo da `main` `00f3236` | **Relato do CRIVO** (relatórios Maven de 24/11, surefire 23:19 e failsafe 23:25, num clone fora desta pasta). **Eu não reproduzi o número de 410.** O `apps/api/target/` desta pasta é de 24/11 12:47 e soma 208 testes, 0 falha: é de outra execução e não prova a `main` atual. Os 100 nomes de teste citados nesta matriz existem no código (conferi por `grep` em `apps/api/src/test`, nenhum ausente), mas existir não é ter passado. | 410 PASS segundo o CRIVO; 208 PASS no `target` local (desatualizado) |
| Jest das 10 suítes de tela | Executado | 160 passando |
| Jest dos 15 arquivos de componente e formatador | Executado | 139 passando, 34 ignorados (`f35-real-api`), 14 suítes passando e 1 ignorada |
| Jest, suíte completa do app | Executado pelo CRIVO em 24/11 | `Test Suites: 1 skipped, 98 passed, 98 of 99 total` / `Tests: 34 skipped, 891 passed, 925 total` |
| Jest, suíte completa, **repetida por mim em 25/11** (`npm --prefix apps/mobile test -- --silent`, 3 execuções) | Executado | Execuções 2 e 3: 891 passando, 34 ignorados, 98 suítes passando (47 s e 43 s). **Execução 1: 5 suítes e 6 testes falharam (885 passando), 138 s.** Na saída só ficou visível `src/integration/menu-routing.test.tsx:59`; não gravei os nomes dos outros 5 testes. `menu-routing` isolado passa (4 de 4, 6 s). Falha intermitente, talvez por carga (tempo 3x maior), **causa não provada**. Vira achado (LAC-10). |
| `node --test docs/design/f26-frames/dados-ficticios.test.mjs` | Executado | 7 testes, 7 passando, 0 falha |
| Frames do Figma (44 frames, contraste, alvo de toque) | **Só li** o relato do ESQUADRO (`docs/design/F45-conferencia-paridade-wcag-sprint-02.md`). Não abri o Figma. | sem evidência própria |
| `f35-real-api.test.tsx` (34 testes) | **Não executado**: o arquivo se ignora sem a variável `QA_F35_API`. Li os títulos. | 34 skipped |
| Deadlock real do MySQL, leitor de tela, teclado externo, aparelho | Não executado | ver seção 10 |

Ruído sem falha: o Jest imprime `console.error` de "not wrapped in act(...)" em `ClienteDetalheScreen` (`use-resource.ts:74`). Não derruba teste, mas vale limpar.

## 3. F03a — Listar clientes (`GET /api/v1/clientes`)

Texto do card não está no repo. Os IDs vêm de `ClienteListagemIT:44` ("01 a 06a"), de ADR-017 e da política de dados (`politica-dados-pessoais-cliente.md`, 6.3). **Os IDs 03, 04, 06 e 07 não têm texto nem ID isolado no repo** (só a faixa "US-CLI-01 a US-CLI-08" em ADR-017:17). Para eles, o resumo é uma hipótese minha, rotulada como tal, e a classe é Parcial: sei que há teste para a hipótese, mas não sei se ela é o critério.

| ID | Resumo (derivado do teste) | Tipo | Teste | Resultado | Classe |
|---|---|---|---|---|---|
| 01 | Busca por nome, sem caixa e sem acento | S | `ClienteListagemIT#shouldFindByNameIgnoringCaseAndAccentWhenTermIsPartOfName`; `#shouldFindDecomposedAccentWhenTermIsInNfd`; `ClienteCollationLatin1IT#shouldUseUtf8mb4SessionAndFixedCollationWhenMigrationsRanFromScratch` | PASS | Coberto |
| 01a | Busca por e-mail (fragmento) e por telefone com ou sem máscara; curinga e escape tratados como texto | S/B | `ClienteListagemIT#shouldFindByEmailFragmentWhenTermMatchesEmail`; `#shouldFindByPhoneDigitsWhenTermHasMaskOrNot`; `#shouldTreatWildcardsAndEscapeAsLiteralTextWhenTermHasSpecialCharacters` | PASS | Coberto |
| 01b | Termo misto (letra e dígito) não consulta telefone | B | `ClienteListagemIT#shouldReturnOnlyTheEmailOwnerWhenMixedTermHasDigitAndMatchesPhones`; `#shouldNotMatchPhoneWhenTermHasOnlyLetters`; `TermoBuscaTest` | PASS | Coberto |
| 01c | Termo só de dígitos consulta telefone e também nome ou e-mail | B | `ClienteListagemIT#shouldFindPhoneAndNameOrEmailWhenTermIsNumeric` | PASS | Coberto |
| 02 | Sem resultado ou base vazia: página vazia, totais zerados; sem termo, lista tudo (ADR-017:225) | B | `ClienteListagemIT#shouldReturnEmptyPageWithZeroTotalsWhenNothingMatches`; `#shouldListWithoutFilterWhenTermIsMissingEmptyOrBlank` | PASS | Coberto |
| 03 | **Sem texto no repo.** Hipótese: família de paginação (cobre 03a, 03b e 03c) | — | ver 03a, 03b, 03c | PASS | Parcial (texto ausente) |
| 03a | Parâmetros inválidos (página, tamanho) respondem 400 | E | `ClienteListagemIT#shouldReturnBadRequestWhenParametersAreInvalid`; `#shouldReturnBadRequestWhenPageDoesNotFitInInteger`; `ClienteControllerTest#...ParameterIsInvalid[1..7]` | PASS | Coberto |
| 03b | Página além do fim: itens vazios e total real | B | `ClienteListagemIT#shouldReturnEmptyItemsWithRealTotalWhenPageIsBeyondTheEnd` | PASS | Coberto |
| 03c | Offset acima de `Integer.MAX_VALUE`: itens vazios e total real, com e sem termo | B | `ClienteListagemIT#shouldReturnEmptyItemsWithRealTotalWhenOffsetExceedsIntegerMax`; `#shouldKeepSearchTotalWhenOffsetExceedsIntegerMaxWithTerm`; `ClienteServiceTest` (limiar exato) | PASS | Coberto |
| 04 | **Sem texto no repo.** Hipótese: ordenação por nome com desempate por id | S/B | `ClienteListagemIT#shouldPaginateOrderedByNameWhenThereAre25Clients`; `#shouldBreakNameTieByIdWhenNamesDifferOnlyByAccent` | PASS | Parcial (texto ausente) |
| 05a | Rota inexistente: 404 sem registrar a consulta | E | `ClienteListagemIT#shouldReturnNotFoundWithoutLoggingQueryWhenRouteDoesNotExist`; `GlobalExceptionHandlerTest` | PASS | Coberto |
| 05b | Método não suportado: 405 com cabeçalho `Allow` | E | `ClienteListagemIT#shouldReturnMethodNotAllowedWithAllowHeaderWhenMethodIsNotSupported` | PASS | Coberto |
| 05c | Sem token, 401 vem antes de 404 e 405 | E | `ClienteListagemIT#shouldReturnUnauthorizedBeforeNotFoundOrMethodNotAllowedWhenThereIsNoToken` | PASS | Coberto |
| 06 | **Sem texto no repo.** Hipótese: autenticação obrigatória (06a é o caso sem token). Token expirado só é testado em `ClienteControllerTest#shouldReturnUnauthorizedWhenTokenIsExpired` | E | ver 06a | PASS | Parcial (texto ausente) |
| 06a | Sem token: 401 | E | `ClienteListagemIT#shouldReturnUnauthorizedWhenThereIsNoToken` | PASS | Coberto |
| 07 | **Sem texto no repo.** Hipótese: minimização, a lista devolve só id, nome, telefone e e-mail | S | `ClienteListagemIT#shouldReturnOnlyIdNameTelefoneAndEmailWhenListing`; `ClienteListResponseTest` | PASS | Parcial (texto ausente) |
| 08 | Log da busca só com `qLen`, página, tamanho, total e `usuarioId`; sem termo nem dígitos (política 6.3) | S | `ClienteServiceTest#shouldLogOnlyLengthPageSizeTotalAndUserWhenSearchingByNameEmailAndPhone` | PASS | Coberto |
| extra | 500 sem vazar dado quando o banco falha | E | `ClienteListagemIT#shouldReturnInternalErrorWithoutLeakingDataWhenDatabaseFails` | PASS | Coberto (não numerado) |

Observação sobre o 08: o teste de log fica no service. Não há teste que capture o log da chamada HTTP completa no `ClienteListagemIT`. Se o PO entender que o 08 exige a prova pela borda HTTP, o item vira Parcial.

## 4. F03b (F08) — Detalhe do cliente (`GET /api/v1/clientes/{id}`)

Fonte: `docs/product/F03b-clientes-detalhe.md`. Os critérios de tela (DET-01, 03, 07, 08, 09, 10, 12 e 18) **saíram do aceite da F08** (linha 12 do PRD) e vão para a F35. Aparecem aqui só como "Fora do aceite"; o resumo de cada um está no PRD e não o reproduzo.

| ID | Resumo | Tipo | Teste | Resultado | Classe |
|---|---|---|---|---|---|
| DET-02 | Cliente existente devolve os 6 campos (e `Cache-Control: no-store`) | S | `ClienteDetalheIT#shouldReturnFullDetailWithSixFieldsWhenClientExists`; `ClienteControllerTest#shouldReturnDetailWithSixFieldsAndNoStoreWhenAuthenticated` | PASS | Coberto |
| DET-04 | Id inexistente: 404, não 500 | E | `ClienteDetalheIT#shouldReturnNotFoundNotServerErrorWhenIdDoesNotExist` | PASS | Coberto |
| DET-05 | Id inválido: 400 | E | `ClienteDetalheIT#shouldReturnBadRequestWhenIdIsInvalid` | PASS | Coberto |
| DET-06 | Sem token ou token inválido: 401 sem consultar o banco | E | `ClienteDetalheIT#shouldReturnUnauthorizedWithoutQueryingWhenTokenIsMissingOrInvalid`; `ClienteControllerTest#shouldReturnUnauthorizedWithoutQueryingWhenDetailHasNoOrInvalidToken` | PASS | Parcial: falta token **expirado** no detalhe (só testado na listagem) |
| DET-11 | Log do detalhe só com ids, sem dado pessoal (política 6.4) | S | `ClienteDetalheIT#shouldLogOnlyIdsWithoutAnyPersonalDataWhenDetailIsRequested`; `ClienteDetalheServiceTest#shouldNeverLogPersonalDataWhenClientExists` | PASS | Parcial: falta o 500 forçado no detalhe (vazamento no caminho de erro) |
| DET-13 | Ids `abc`, `0`, `-1`, `99999999999999999999` e `1.5`: 400 | E/B | `ClienteDetalheIT#shouldReturnBadRequestWhenIdIsInvalid` (itera os 4 primeiros); `ClienteControllerTest#...IdIsInvalid[1..5]` (inclui `1.5`) | PASS | Coberto (confirmado na `main`) |
| DET-14 | Cliente criado antes das colunas da V4 devolve CPF e endereço nulos, presentes no JSON | B | `ClienteDetalheIT#shouldReturnNullsPresentWhenClientWasCreatedBeforeV4Columns` | PASS | Coberto |
| DET-15 | Cliente **anonimizado** no detalhe | B | **nenhum teste.** Não há teste de cliente com "anonim"; `ANONIMO` só aparece em `VeiculoIT:720` e em `shouldAllowAnonymizationMarkerWithVehicleIdForManyVehiclesOfSameClient` | n/a | **Lacuna** (confirmada na `main`) |
| DET-16 | Colunas opcionais de CPF e endereço, com CHECK de 11 dígitos | S/E | `shouldCreateOptionalCpfAndAddressColumnsWhenMigrationsRanFromScratch`; `shouldRejectCpfOutsideElevenDigitsWhenInsertingDirectlyInDatabase` | PASS | Parcial: falta upgrade V3 para V4 com linha preexistente |
| DET-17 | OpenAPI do `GET` detalhe documentado | S | **nenhum teste.** O único `/v3/api-docs` de cliente é o do PUT (`ClienteAtualizarIT:540`) e o do POST (`ClienteCriarIT:393`) | n/a | **Lacuna** (confirmada na `main`) |
| DET-19 | Id só com espaços: 400, não 500 | E/B | `ClienteDetalheIT#shouldReturnBadRequestNotServerErrorWhenIdIsOnlyWhitespace` | PASS | Coberto |
| DET-01, 03, 07, 08, 09, 10, 12, 18 | Cenários de tela | — | F35 (seção 9) | — | Fora do aceite da F08 (8) |

## 5. F03c (F09) — Criar cliente (`POST /api/v1/clientes`)

Texto do card não está no repo. IDs e resumos derivados dos comentários de `ClienteCriarIT`. **Os IDs 20.1, 20.2 e 20.7 não aparecem no repo**: contados como Lacuna "ID sem registro", sem afirmar que existam.

| ID | Resumo (derivado do teste) | Tipo | Teste (`ClienteCriarIT#`) | Resultado | Classe |
|---|---|---|---|---|---|
| 15 | Dados válidos: 201, `Location`, grava só dígitos; opcionais ausentes aceitos | S | `shouldReturn201WithLocationAndStoreOnlyDigitsWhenRequestIsValid`; `shouldCreateClientWithoutEmailAndAddressWhenOptionalFieldsAreAbsent` | PASS | Coberto |
| 16 | Campo obrigatório ausente ou em branco: 400 nomeando o campo (6 casos) | E | `shouldReturn400NamingFieldWhenRequiredFieldIsAbsentOrBlank` | PASS | Coberto |
| 17 | CPF fora do formato: 400 sem ecoar o valor (4 casos) | E | `shouldReturn400NamingCpfWithoutEchoingValueWhenCpfFormatIsInvalid` | PASS | Coberto |
| 18 | E-mail sem arroba: 400 nomeando o campo | E | `shouldReturn400NamingEmailWhenEmailHasNoAtSign` | PASS | Coberto |
| 19 | Nunca ecoar valor enviado nem logar CPF ou telefone, em sucesso e em falha | S/E | `shouldNeverEchoSentValuesNorLogCpfOrPhoneWhenRequestSucceedsOrFails` | PASS | Coberto |
| 20.1 | ID sem registro no repo | — | — | n/a | Lacuna (sem registro) |
| 20.2 | ID sem registro no repo | — | — | n/a | Lacuna (sem registro) |
| 20.3 | Telefone com menos de 10 ou mais de 11 dígitos: 400; 10 e 11 dígitos com ou sem máscara: aceito | E/B | `shouldReturn400NamingPhoneWhenPhoneHasLessThan10OrMoreThan11Digits` (4); `shouldAcceptPhoneWith10Or11DigitsWithOrWithoutMask` (4) | PASS | Coberto |
| 20.4 | Nome com 120 caracteres aceito, 121 recusado | B | `shouldAcceptNameWith120CharactersAndRejectWith121` | PASS | Coberto |
| 20.5 | Token ausente, malformado ou expirado: 401 e nada criado | E | `shouldReturn401AndCreateNothingWhenTokenIsMissingMalformedOrExpired` | PASS | Coberto |
| 20.6 | CPF repetido em qualquer formato: 409 sem CPF nem id alheio; e-mail repetido (com NBSP nas pontas) 409; 10 requisições concorrentes criam uma; vários CPF nulos permitidos no banco | E/B | `shouldReturn409WithoutCpfNorExistingIdWhenCpfIsRepeatedInAnyFormat`; `shouldStoreTrimmedEmailAndReturn409WhenSameEmailComesBackWithNbspAtTheEdges`; `shouldCreateExactlyOneWhenTenRequestsWithSameCpfRunConcurrently`; `shouldAllowManyRowsWithNullCpfWhenInsertedDirectlyInDatabase` | PASS | Coberto |
| 20.7 | ID sem registro no repo | — | — | n/a | Lacuna (sem registro) |
| 20.8 | OpenAPI do POST (exemplo, 400, 401, 409) e migrations V1 a V7 com CHECK e UNIQUE | S | `shouldDocumentPostClientesWithRequestExampleAnd400And401And409InOpenApi`; `shouldApplyMigrationsV1ToV7AndKeepCheckAndUniqueConstraintsOnClientes` | PASS | Coberto |

Apoio: `ClienteCriarControllerTest` (5) e `ClienteCriarServiceTest` (3), todos PASS.

## 6. F03d (F10) — Editar cliente (`PUT /api/v1/clientes/{id}`)

Texto do card não está no repo. IDs e resumos derivados de `ClienteAtualizarIT` (33), `ClienteAtualizarControllerTest` (9), `ClienteAtualizarServiceTest` (7) e `AparoUnicodeTest`. Os IDs 24 e 26 não aparecem entre os comentários (a numeração salta); não sei se existem.

| ID | Resumo (derivado do teste) | Tipo | Teste (`ClienteAtualizarIT#`) | Resultado | Classe |
|---|---|---|---|---|---|
| 21 | PUT válido: 200; o detalhe devolve os mesmos valores; opcionais omitidos viram nulo e `createdAt` se mantém | S | `shouldReturn200WithNewDataAndDetailReturnsSameValuesWhenRequestIsValid`; `shouldReplaceOptionalFieldsWithNullAndKeepCreatedAtWhenTheyAreOmitted` | PASS | Coberto |
| 22 | Obrigatório em branco, CPF ou e-mail inválido: 400, sem ecoar valor, sem alterar nada | E | `shouldReturn400NamingFieldAndChangeNothingWhenRequiredFieldIsBlank`; `shouldReturn400WithoutEchoingValueAndChangeNothingWhenCpfAndEmailAreInvalid` | PASS | Coberto |
| 23 | Id inexistente: 404 no formato global | E | `shouldReturn404InGlobalFormatWhenIdDoesNotExist` | PASS | Coberto |
| 25 | Log sem CPF, telefone, e-mail nem corpo; OpenAPI do PUT; e-mail único no banco, vários nulos | S/E | `shouldNeverLogCpfPhoneEmailNorBodyWhenEditSucceedsOrFails`; `shouldDocumentPutClientesWith200And400And401And404And409InOpenApi`; `shouldRejectDuplicateEmailDirectlyInDatabaseButAllowManyNullEmails` | PASS | Coberto |
| 27 | CPF de outro cliente: 409 nomeando CPF, sem valor nem id alheio, nada alterado | E | `shouldReturn409NamingCpfWithoutValueNorOtherIdAndChangeNothingWhenCpfBelongsToAnother` | PASS | Coberto |
| 28 | Só o telefone muda e o CPF vem com outra pontuação: 200 | B | `shouldReturn200WhenOnlyPhoneChangesAndCpfIsSentWithDifferentPunctuation` | PASS | Coberto |
| 29 | 401 com token ausente, inválido, expirado, de outra chave, `alg none`; controle com token válido | E | métodos de 401 do `ClienteAtualizarIT` (5 variantes) | PASS | Coberto |
| 30 | Id do corpo diferente do caminho é ignorado: altera só o cliente do caminho | B | `shouldChangeOnlyPathClientAndIgnoreBodyIdWhenBodyIdDiffers` | PASS | Coberto |
| 31 | E-mail repetido: 409 (parametrizado, espaço Unicode, zero-width) | E/B | métodos de 409 de e-mail do `ClienteAtualizarIT` | PASS | Coberto |
| 32 | Mesmo e-mail com caixa diferente: 200, grava em minúsculas | B | `shouldReturn200AndStoreLowercaseWhenSameEmailIsSentWithDifferentCase` | PASS | Coberto |
| 33 | Concorrência: um 200 e um 409, sem 500 | B | métodos de concorrência do `ClienteAtualizarIT`; `ClienteAtualizarServiceTest#shouldLogOnlyConcurrencyFieldAndRethrowSameErrorWhenDatabaseReportsDeadlock` | PASS | Parcial: o **deadlock real do MySQL não foi provado**; só o service com exceção simulada e o controller com 409 (ADR-027) |

## 7. F04 — Veículos (4 rotas)

Fonte: `docs/product/F04-veiculos.md`, seção 5 (cenários C1 a C26 com letras). A tabela de rastreabilidade da seção 11 está **desatualizada** e não foi usada. Os resumos seguem o nome do teste; confira o texto de cada C no PRD.

Testes em `VeiculoIT` (e `VeiculoSegurancaIT`, `VeiculoControllerTest`, `VeiculoServiceTest`, `VeiculoRequestTest`, `AnoModeloValidatorTest`, `MascaraPlacaTest`). Todos os citados abaixo estão PASS.

| ID | Resumo | Tipo | Teste (`VeiculoIT#` salvo indicação) | Classe |
|---|---|---|---|---|
| C1, C2 | Cria veículo com placa antiga e com placa Mercosul: 201 | S | `shouldReturn201LinkedToClientWhenPlateIsInOldFormat`; `shouldReturn201WhenPlateIsMercosul` | Coberto |
| C3 | Placa digitada com máscara ou minúscula: grava normalizada | B | `shouldStoreNormalizedPlateWhenPlateIsTypedWithMaskOrLowerCase` | Coberto |
| C4, C5 | Placa inválida, em branco ou com letra Unicode parecida: 400 no campo, nada gravado | E | `shouldReturn400OnPlateFieldAndStoreNothingWhenPlateFormatIsInvalid`; `shouldReturn400OnPlateFieldWhenPlateIsBlankOrAbsent`; `shouldReturn400WithUnicodeLookalikePlateAndStoreNothing` | Coberto |
| C6 | Placa repetida em qualquer caixa: 409 sem a placa inteira | E | `shouldReturn409WithoutFullPlateWhenPlateIsRepeatedInAnyCase` | Coberto |
| C7 | Marca, modelo e ano em branco: um erro por campo | E | `shouldReturn400WithOneErrorPerFieldWhenBrandModelAndYearAreBlank` | Coberto |
| C7a | Marca e modelo gravados sem espaço nas pontas | B | `shouldStoreBrandAndModelWithoutEdgeSpacesWhenTheyComeWithSpaces` | Coberto |
| C7b | Marca só com espaços no POST | E | só o caso de PUT: `shouldReturn400AndKeepBrandWhenPutBrandHasOnlySpaces` | Parcial: falta o caso de POST |
| C7c | Limite de 100 caracteres em marca e modelo | B | `VeiculoRequestTest#shouldLimitBrandAndModelTo100Characters` (cobre o 101) | Parcial: falta "100 com espaços nas pontas: 201" |
| C8, C8a | Ano fora da faixa recusado; próximo ano aceito | B | `shouldRejectYearOutsideRangeAndAcceptNextYear` | Coberto |
| C8b | Virada do ano (faixa depende da data) | B | `AnoModeloValidatorTest` | Coberto |
| C8c, C8d, C8e | Ano que não é inteiro JSON: 400 no campo ano (7 casos) | E | `shouldReturn400OnYearFieldAndStoreNothingWhenYearIsNotAJsonInteger` | Coberto |
| C9 | Cliente inexistente: 404, nada gravado | E | `shouldReturn404AndStoreNothingWhenClientDoesNotExist` | Coberto |
| C10 | 10 requisições concorrentes com a mesma placa criam uma | B | `shouldCreateExactlyOneWhenTenRequestsWithSamePlateRunConcurrently` | Coberto |
| C11 | 401 nas 4 rotas com token ausente ou malformado, sem alterar nada | E | `shouldReturn401AndChangeNothingOnAllFourRoutesWhenTokenIsMissingOrMalformed`; `VeiculoSegurancaIT` (5) | Coberto |
| C11a | Corpo com id e dono de outro cliente: cria no cliente do caminho | B | `shouldCreateNewVehicleInPathClientWhenBodyCarriesIdAndOtherOwner` | Coberto |
| C12, C13, C14, C15, C16 | Edita marca, modelo, ano e cor: 200; troca de formato de placa mantendo a mesma placa; placa de outro veículo: 409 e mantém a original; corpo inválido: 400 e registro intacto | S/E | `shouldReturn200WithUpdatedDataWhenEditingBrandModelYearAndColor`; `shouldAcceptPlateChangeBetweenOldAndMercosulFormatsAndKeepSamePlate`; `shouldReturn409AndKeepOriginalPlateWhenPlateBelongsToAnotherVehicle`; `shouldReturn400AndKeepRecordUnchangedWhenEditBodyIsInvalid` | Coberto (5 IDs; o mapeamento de cada C ao método é por agrupamento, confira no PRD) |
| C16a | PUT grava marca, modelo e cor sem espaço nas pontas | B | `shouldStoreBrandModelAndColorWithoutEdgeSpacesWhenPutComesWithSpaces` | Coberto |
| C17 | Dono e quilometragem imutáveis no PUT (ADR-024) | B | `shouldKeepOwnerAndMileageWhenEditBodyCarriesOtherOwnerIdAndMileage` | Coberto |
| C17a, C17b | PUT sem cor ou com cor em branco grava nulo | B | `shouldStoreNullColorWhenPutOmitsOrBlanksColor` | Coberto (2 IDs) |
| C18 | Editar veículo inexistente: 404 | E | `shouldReturn404WhenEditingMissingVehicle` | Coberto |
| C19 | Detalhe com dono e histórico vazio | S | `shouldReturnDetailWithOwnerAndEmptyHistoryWhenVehicleHasNoOrders` | Coberto |
| C19a | `historicoOs` sempre `[]` e a API não consulta `ordens_servico` (ADR-025) | B | o `[]` está provado; **não há teste de que a tabela não é consultada** | Parcial |
| C19b | Detalhe do veículo sem CPF, telefone, e-mail e endereço do dono | B | **sem asserção de ausência**; garantido só pela forma do DTO | Parcial |
| C20 | Detalhe de veículo inexistente: 404 | E | `shouldReturn404WhenDetailingMissingVehicle` | Coberto |
| C20a | Id do veículo não positivo: 400 sem chamar o service | E | `VeiculoControllerTest#shouldReturn400WithoutCallingServiceWhenIdIsNotPositiveNumber` | Coberto |
| C21, C22, C23 | Lista de veículos do cliente, ordenada por placa, sem paginação; vazia quando não há; 404 se o cliente não existe | S/B/E | `shouldListClientVehiclesOrderedByPlateWithoutPagination`; `shouldReturnEmptyListWhenClientHasNoVehiclesAnd404WhenClientIsMissing` | Coberto (3 IDs) |
| C23a | Lista só traz veículos do cliente do caminho | B | não confirmei que o teste cria veículos de **dois** clientes | Parcial (não confirmado) |
| C24 | Log só com placa mascarada (`****D23`) em criar, editar, detalhe, lista e conflito | S | `shouldLogOnlyMaskedPlateOnCreateEditDetailListAndConflict`; `MascaraPlacaTest`; `VeiculoServiceTest` | Coberto |
| C25 | Todo campo inválido volta com `{campo, chave}`, nunca repetindo o valor enviado | E | `shouldReturnEveryInvalidFieldWithKeyAndNeverRepeatSentValues` | Coberto |
| C25a | Placa duplicada na edição: 409 | E | `shouldReturn409AndKeepOriginalPlateWhenPlateBelongsToAnotherVehicle`; `VeiculoControllerTest` (409) | Coberto |
| C25b | 415 e 400 de corpo ilegível; 405; `erros[]` vazio | E | 415 e 400 só em `VeiculoControllerTest`; **405 não testado nas rotas de veículo**; `erros[]` vazio não afirmado em todas as respostas | Parcial |
| C26 | Validação de request (Bean Validation) | E | `VeiculoRequestTest` | Coberto |

## 8. F26 — Protótipo de clientes e veículos (Figma)

Fonte: `docs/product/F26-prototipo-clientes-veiculos.md` (revisão 2, estado "NÃO APROVADO"; a seção 10 de aprovação está vazia). É protótipo no Figma. **Não abri o Figma.** Os 44 frames, o contraste e o alvo de toque vêm do relato do ESQUADRO, que fez conferência estática por `use_figma`. O único teste automatizado do documento é `docs/design/f26-frames/dados-ficticios.test.mjs` (7 de 7 passando; cobre CPF fictício sem dígito válido, e-mail `@example.com`, telefone `(11) 90000-000N`, ausência de `user_id`, `team::` e ids longos, 39 frames na tabela e ids únicos).

Os resumos são do PRD, simplificados; confira o texto de cada US-PROTO-CLV.

| ID | Resumo | Verificação | Classe |
|---|---|---|---|
| CLV-01 | Cobertura de telas e tokens | só relato do ESQUADRO | Manual |
| CLV-02 | Quatro estados por tela | só relato do ESQUADRO | Manual |
| CLV-03 | Navegação sem beco (roteiro 8.1 do modo Present; "Voltar" da L5 leva ao Perfil) | exige percurso no Present | Manual |
| CLV-04 | Contraste e foco por controle | ESQUADRO corrigiu N-05 e N-09; conferência visual pendente | Manual |
| CLV-05 | Aprovação | seção 10 do PRD vazia; decisão da pessoa | Lacuna |
| CLV-06 | Reprovação | processo, sem registro | Manual |
| CLV-07 | Base dos frames (D8) | N-07: 5 frames propostos (D6, D7, D8, V6, L8) na página errada e sem aprovação | Lacuna |
| CLV-08 | Dado fictício | `dados-ficticios.test.mjs` cobre CPF, e-mail e telefone; **falta inspeção dos frames no Figma** | Parcial |
| CLV-09 | Histórico marcado "Exemplo" | só relato | Manual |
| CLV-10 | Link restrito | pendência de verificação com a pessoa | Manual |
| CLV-11 | Erro acessível | só relato; no app há teste (ver F35) | Manual |
| CLV-12 | Alvo de toque 44x44 | medida no Figma pelo ESQUADRO; no app, N-06 (48x48 do botão de fechar do aviso) tem teste em `inline-notice` | Manual |
| CLV-13 | Erros de negócio nos formulários | só relato | Manual |
| CLV-14 | Registro limpo (sem `user_id`, sem co-author) | `dados-ficticios.test.mjs` cobre `user_id`, `team::` e ids longos; **co-author não coberto** | Parcial |
| CLV-15 | Aviso de privacidade | só relato | Manual |
| CLV-16 | Cartão sem telefone | contrapartida no app testada (`client-row`, `client-contact`); frame não conferido | Parcial |
| CLV-17 | Descartar alterações | contrapartida no app testada (`confirm-dialog`, `use-discard-changes-guard`); frame não conferido | Parcial |
| CLV-18 | V2 é o estado real | só relato | Manual |
| CLV-19 | Sucesso anunciado | só relato; no app há teste (`inline-notice`) | Manual |

Pendências do ESQUADRO que seguem manuais ou dependem do Figma: C1, C3b, C4b, C10 e C12. Em aberto no relatório de paridade: N-01, N-03, N-04 (erro de campo sem ícone, nome acessível, asterisco), N-02 (posição da faixa de erro, decisão da pessoa), N-07 e N-08 (foco inicial do diálogo, só no aparelho).

## 9. F35 — Front (app React Native)

O card da F35 não está no repo. Cada linha traz o resumo **derivado do título do teste** e o critério numerado do rótulo `[crit N]` em `apps/mobile/src/qa/f35-real-api.test.tsx`. "Coberto" vale para o **comportamento da tela contra a API simulada (mock)** no Jest, executado e passando. A prova contra a **API real** está nos 34 testes de `f35-real-api`, **não executados** (ignorados sem `QA_F35_API`); isso entra como lacuna transversal (LAC-01), não em cada linha.

Testes de tela: `client-list-screen`, `client-detail-screen`, `client-create-screen`, `client-edit-screen`, `vehicle-create-screen`, `vehicle-detail-screen`, `vehicle-edit-screen`, `client-form-fields`, `use-client-form`, `use-discard-changes-guard` (10 suítes, 160 testes) e os 15 arquivos de componente e formatador (139 testes), todos passando.

| Crit | Resumo (derivado do teste) | Teste (tela) | Classe |
|---|---|---|---|
| 1 | Lista mostra nome e contato, sem CPF | `client-list-screen`: "lista nome e contato sem CPF"; `client-row`, `client-contact` | Parcial: ajuste proposto (nome mais uma linha de contato) aguarda confirmação escrita |
| 2 | Uma requisição por pausa de digitação (debounce 400 ms, ADR-031) | `client-list-screen`: "uma requisição por rajada de teclas" | Coberto |
| 3 | Estado de carregando acessível | lista e detalhe: "loading acessível" | Coberto |
| 4 | Lista vazia com "cadastrar primeiro" | `client-list-screen` | Coberto |
| 5 | Erro de conexão com tentar de novo | lista e detalhe | Coberto |
| 6 | Detalhe com CPF mascarado e veículos | `client-detail-screen`; `cpf-mask`, `cpf-format` | Coberto |
| 7 | Criar leva ao detalhe com "Cliente cadastrado." (`replace`) | `client-create-screen`: "cria e replace para o detalhe com aviso" | Parcial: P-02 sem aprovação escrita |
| 8 | CPF inválido recusado | `use-client-form` (CPF inválido); `client-form-fields` | Coberto |
| 9 | Editar envia o PUT e mostra aviso | `client-edit-screen`: "PUT e aviso de editado" | Coberto |
| 10 | Criar veículo | `vehicle-create-screen` | Coberto |
| 11 | Editar veículo (PUT) | `vehicle-edit-screen` | Coberto |
| 12 | Histórico de OS na tela de veículo | `vehicle-history-section`; caracterização F-4 no `f35-real-api` | Parcial: histórico de OS fica vazio até a F06 (CR-05) |
| 13 | Histórico vazio por padrão | `vehicle-detail-screen`; `vehicle-history-section` | Coberto |
| 14 | Exige aparelho (texto do critério não está no repo) | sem teste; `F35-paridade-figma-app.md:73` | Manual |
| 15 | ID sem registro no repo | — | Lacuna (sem registro) |
| 16 | Log sem dado pessoal | describes "personal data in the log (criterion 16)" nas telas de detalhe e criar; `it.each` no detalhe do veículo | Coberto |
| 17 | Placa inválida e placa duplicada | `vehicle-create-screen`, `vehicle-edit-screen`, `vehicle-form-fields` | Coberto |
| 18 | Backend fora mantém os dados digitados | `client-create-screen`: "erro de envio mantém valores" | Parcial: comportamento em aparelho exige conferência manual (`F35-paridade-figma-app.md:73`) |
| 19 | Busca sem resultado, distinta do vazio | `client-list-screen`: "sem resultado distinto do vazio" | Coberto |
| 20 | Cliente sem veículos, com ação de cadastrar | `client-detail-screen` | Coberto |
| 21 | 404 sem tentar de novo | `client-detail-screen`, `client-edit-screen` | Coberto |
| 22 | 409 de CPF no campo CPF | `client-create-screen`; `use-client-form` | Coberto |
| 23 | 401 entrega à sessão expirada (`tratarSessaoExpirada`) | detalhe, criar e editar: "401" | Parcial: parte do critério exige aparelho (`F35-paridade-figma-app.md:73`) |
| 24 | Exige aparelho (texto não está no repo) | sem teste | Manual |
| 25 | ID sem registro no repo | — | Lacuna (sem registro) |
| 26 | Exige aparelho (texto não está no repo) | sem teste | Manual |
| 27 | "Não informado" para campo ausente | `client-detail-screen`; `client-info-card` | Coberto |
| 28 | Máscara de CPF (`cpf-mask.ts:21`) | `cpf-mask`, `cpf-format` | Coberto |
| 29 | Leitura "CPF parcialmente oculto" | `client-detail-screen` | Coberto (leitor de tela real: Manual) |
| 30 | Detalhe com CPF mascarado | `client-detail-screen` | Coberto |

Divergências registradas pelo `f35-real-api` e ainda abertas: **F-1** (a API exige CPF e telefone, que o formulário rotula como opcionais) e **F-2** (ano obrigatório na API). Estão em LAC-18.


## 10. Fechamento (PO, 25/11)

### 10.1 Totais por feature

Uma linha de tabela = um cenário (ou grupo de cenários com o mesmo teste, quando a linha diz isso). Os 8 cenários de tela da F03b (DET-01, 03, 07, 08, 09, 10, 12 e 18) estão fora do aceite da F08 e não entram na conta.

| Feature | Linhas | Coberto | Parcial | Lacuna | Manual |
|---|---|---|---|---|---|
| F03a (clientes, listar) | 18 | 14 | 4 | 0 | 0 |
| F03b / F08 (clientes, detalhe) | 11 | 6 | 3 | 2 | 0 |
| F03c / F09 (clientes, criar) | 13 | 10 | 0 | 3 | 0 |
| F03d / F10 (clientes, editar) | 11 | 10 | 1 | 0 | 0 |
| F04 (veículos) | 32 | 26 | 6 | 0 | 0 |
| F26 (protótipo) | 19 | 0 | 4 | 2 | 13 |
| F35 (front mobile) | 30 | 20 | 5 | 2 | 3 |
| **Total** | **134** | **86** | **23** | **9** | **16** |

"Coberto" no backend significa: o teste existe e, **segundo o relato do CRIVO**, passou; eu não reproduzi o Maven (seção 2). No app significa: coberto no Jest **contra API simulada**; a prova contra a API real (`f35-real-api`) não foi executada.

### 10.2 Lacunas abertas

Dono e prazo são **propostas do PO**, valem a partir do aceite da pessoa. Nenhuma feature de correção foi aberta ainda (tarefa 14 segue pendente); "destino" diz o que abrir.

| ID | Lacuna | Onde na matriz | Dono proposto | Destino proposto | Prazo proposto |
|---|---|---|---|---|---|
| LAC-01 | `f35-real-api.test.tsx` (34 testes) não executado: sem `QA_F35_API` não liga app e API | seção 9 | ORLA com ESPRESSO | executar nesta revisão (critério 3) e anexar a saída | 2026-11-27 |
| LAC-02 | DET-15: cliente anonimizado no detalhe sem teste (confirmei: `anonim` só aparece em `VeiculoIT`, 1 ocorrência, e não é de cliente) | F03b | ESPRESSO | teste novo, feature de correção ou aceite como ressalva | 2026-12-02 |
| LAC-03 | DET-17: OpenAPI do `GET /clientes/{id}` sem teste (o PUT, o POST e o veículo têm: `ClienteAtualizarIT:542`, `ClienteCriarIT:398`, `VeiculoIT:746`) | F03b | ESPRESSO | teste novo, junto com LAC-02 | 2026-12-02 |
| LAC-04 | Parciais da F03b: token **expirado** no detalhe (DET-06), 500 forçado sem vazar dado (DET-11), upgrade V3 para V4 com linha preexistente (DET-16) | F03b | ESPRESSO | teste novo, junto com LAC-02 | 2026-12-02 |
| LAC-05 | IDs sem registro no repo: F03c 20.1, 20.2, 20.7; F03d 24 e 26 (a numeração salta); F35 crit. 15 e 25. Não sei se existem | seções 5, 6, 9 | BUSSOLA | recuperar o texto do painel e gravar em `docs/product`; se não existirem, registrar a numeração como salto | 2026-11-28 |
| LAC-06 | F03a: sem texto no repo para os IDs 03, 04, 06 e 07 (e o resumo dos demais é derivado do teste). A revisão humana pediu o texto dos cards em `docs/product`; **não consegui copiá-lo, porque ele não está no repo e eu não tenho o painel nesta sessão** | seção 3 | BUSSOLA | copiar os cards de F03a, F03c, F03d e F35 para `docs/product` e reconferir as linhas Parcial (texto ausente) | 2026-11-28 |
| LAC-07 | F03d 33: deadlock real do MySQL não provado; só o service com exceção simulada e o controller com 409 (ADR-027) | seção 6 | ESPRESSO com CRIVO | prova contra MySQL real, ou ressalva aceita pela pessoa | 2026-12-02 |
| LAC-08 | F04 parciais: C7b (marca só com espaços no POST), C7c (100 caracteres com espaços nas pontas), C19a (não consulta `ordens_servico`; só `FlywayMigrationIT` cita a tabela, 3 ocorrências), C19b (sem asserção de ausência de dado do dono), C23a (não confirmei veículos de dois clientes), C25b (405 em veículo, `erros[]` vazio) | seção 7 | ESPRESSO | testes novos, feature de correção (só teste, sem mudar produto) | 2026-12-02 |
| LAC-09 | F26: aprovação da seção 10 do PRD vazia (CLV-05) e N-07 (5 frames fora da seção); 13 critérios só pelo relato do ESQUADRO, sem eu abrir o Figma | seção 8 | PO (decisão) e ESQUADRO (conferência) | decisão da pessoa sobre N-02 e N-07; conferência no Figma com captura | 2026-11-28 |
| LAC-10 | Jest intermitente: 1 de 3 execuções completas falhou em 6 testes (5 suítes), uma delas `menu-routing.test.tsx:59`; isolada passa | seção 2 | ORLA | investigar causa (tempo, timer, `act`); o `console.error` de "not wrapped in act" em `ClienteDetalheScreen` (`use-resource.ts:74`) é suspeito, **não provado** | 2026-12-02 |
| LAC-11 | Contagem do backend (410) não reproduzida por mim; o `target` local tem 208 | seção 2 | ESPRESSO | `mvn clean verify` em clone limpo da `main`, com a contagem real (critério 2) | 2026-11-27 |
| LAC-12 | F35 parciais: crit. 1 (contato na lista, ajuste sem confirmação escrita), 7 (P-02 sem aprovação), 12 (histórico de OS vazio até a F06), 18 e 23 (parte só em aparelho); manuais 14, 24 e 26 | seção 9 | ORLA e PO | aparelho com leitor de tela (critério 7); 12 fica "parcialmente coberto" até a F06 | 2026-12-02 |

### 10.3 O que esta matriz não prova

- **Texto dos critérios.** Para F03a, F03c, F03d e F35 o resumo vem do nome do teste ou de comentário, não do card. Isso prova que existe teste para o comportamento descrito pelo nome; não prova que ele cobre o critério original.
- **IDs L-02 a L-08.** A revisão humana pediu para confirmá-los "na ponta de cada branch". Procurei `L-02` a `L-08` em `docs/`: os que existem são da conferência de login da F41, outra feature. Não encontrei lista de lacunas com esses IDs para a Sprint 02. Não confirmei nada sobre eles; peço à pessoa que indique onde estão. DET-13, DET-15 e DET-17 foram confirmados na `main` `00f3236` (DET-13 coberto; DET-15 e DET-17 lacuna).
- **Backend.** Não rodei `mvn clean verify`. Os resultados de Maven são do relato do CRIVO.
- **Aparelho, Figma, leitor de tela, teclado externo.** Não executados nesta etapa.
- **Ordem de merge.** A matriz vale para a `main` `00f3236`. As observações da revisão humana sobre a ordem de merge de F03c, F04, F03d e F35 e sobre a F35 sem PR não foram verificadas por mim e não alteram as linhas acima.
