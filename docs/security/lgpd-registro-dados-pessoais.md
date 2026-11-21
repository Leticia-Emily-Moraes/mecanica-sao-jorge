# Registro de dados pessoais (LGPD) — schema atual da API

Dono: VIGIA (AppSec/LGPD). Criado na F44 (2026-11-13) a partir das migrations
V1 e V2 em `apps/api/src/main/resources/db/migration`. Atualizar a cada
migration que crie ou altere coluna com dado pessoal; a feature que traz a
coluna fecha a linha aqui antes do merge.

Status: a V1 já trazia base legal e retenção no comentário do SQL. A V2
(clientes, veículos e tabelas ligadas a eles) não registrava nada. As linhas
da V2 abaixo são **proposta do VIGIA**, pendente de aprovação da oficina
(controladora) — ver "Decisões pendentes".

Atualizado em 2026-11-17 (F03b, revisão 2 da política de cliente): as colunas
`clientes.cpf` e `clientes.endereco` da V4 da F08 têm a linha aprovada pelo
VIGIA abaixo. A V4 está no ramo `feat/f03b-clientes-detalhe` (PR #22) e ainda não está na `main`
([ADR-018](../architecture/adr/ADR-018-guardar-cpf-e-endereco-do-cliente-como-colunas-opcionais.md),
proposto). Detalhe por campo, exposição na API e regras de log de `clientes` e
`veiculos`: `docs/security/politica-dados-pessoais-cliente.md`, que prevalece
se este registro divergir.

Revisão do código da F08 pelo VIGIA em 2026-11-17, no commit `eb62813` do ramo,
com a API real em contêiner (MySQL 8.4, dados fictícios): nenhuma coleta nova,
nenhum destino novo e log sem dado pessoal (seção "Segredos e logs"). Fato
novo para o aceite P8 da política: o token de um usuário com `ativo=0` continuou
lendo o CPF inteiro no detalhe, porque o JWT não é revogado e vale até expirar
(7 dias, ADR-004).

Revisão 3 da política em 2026-11-17 (F03c, card F09, criação de cliente), por
leitura e antes de existir código da F03c: CPF **único quando preenchido**, com
409, que entra antes do primeiro cliente real (a F03c segue provisória, sem
checagem); email, telefone e placa **não únicos**; parecer de CPF **opcional**
na criação, contra o card (pendência P9 da política); telefone obrigatório na
API, com a coluna `NULL` mantida para a anonimização; o POST loga só
`clientes.criar clienteId usuarioId`, sem CPF, telefone ou email, nem
mascarados. Nenhuma coluna nova: a V2 e a V4 já têm todas as colunas da F03c.
Detalhes nas seções 2.1, 2.2, 6.5 e 8.3 da política.

Revisão 4 da política em 2026-11-18 (F09): o CPF único com 409 entra na própria
F03c (a premissa 3 do card cai; decisão registrada no ADR-020). Retenção e
descarte ficam resumidos por dado na seção 3.1, com o registro de auditoria da
anonimização (5 anos, proposta) e a regra de texto livre (R5). No pedido de
eliminação dentro de R1, a placa também é anonimizada na hora. O titular
anonimizado em parte que volta como cliente reusa o cadastro retido (2.3), e
essa interação foi provada em MySQL 8.4 descartável. Nenhuma coleta nova e
nenhum destino novo.

Revisão 5 da política em 2026-11-18 (F04, Veículos): a placa é dado pessoal do dono, e marca, modelo, ano e cor são dado pessoal por associação. A placa passa a ser **única**, com 409, e ganha `CHECK` de formato pela V7 da F04 (revoga o "não é única" da revisão 3). No descarte do cliente, a placa de cada veículo vira `ANON<id>`, porque o `ANONIMO` repetido falha no índice (provado em MySQL 8.4 descartável). O `cliente_id` do veículo é imutável depois da criação. Em log, só a máscara `****D23`, nas linhas da seção 6.6 da política. Nenhuma coluna nova: a F04 passa a gravar placa, marca, modelo, ano e cor e não coleta quilometragem. Destino novo: as quatro rotas de veículo, só para o app. Detalhes nas seções 2.4, 6.2.2, 6.6 e 8.5 da política.

Revisão 6 da política em 2026-11-18 (F10, F03d, edição de cliente): a política já cobria a edição. Finalidade, base legal, prazos e descarte de nome, CPF, telefone, email e endereço não mudam, e a edição não é evento para R1 e R2. O valor anterior é sobrescrito e não fica em log, coluna, tabela de histórico, resposta nem auditoria. Só o backup (backlog) o carrega, por até 35 dias. Histórico de alteração só entra com linha na política (regra R6). O email passa a ser **único quando preenchido**, com 409 `Email ja cadastrado` no POST e no PUT, e é gravado com `strip()` e minúsculas só em ASCII. Isso revoga o "email não único" da revisão 3 e depende do aceite da pessoa (P16 da política). O PUT loga só `clienteId`, `usuarioId` e, no 409, o campo (`cpf` ou `email`), sem valor, nem mascarado. Nenhuma coluna nova. Destino novo: a resposta 200 do `PUT /api/v1/clientes/{id}`, só para o app. Detalhes nas seções 2.5, 6.7 e 8.6 da política.

Por que aqui e não no SQL: a V2 já está aplicada. Editar comentário de
migration aplicada muda o checksum e o Flyway falha no `validate`
(ADR-003/ADR-013).

## Inventário por tabela

| Tabela (migration) | Dado pessoal | Finalidade | Base legal (LGPD art. 7º) | Quem acessa | Para onde vai | Retenção | Como é apagado |
|---|---|---|---|---|---|---|---|
| `usuarios` (V1) | nome, email, senha_hash (BCrypt), perfil, ativo, datas | Controle de acesso ao sistema interno | V (contrato de trabalho) e IX (legítimo interesse no controle de acesso) | Usuário autenticado; DBA | Resposta do login (`UsuarioResumo`: id, nome, email, perfil; nunca senha_hash). JWT leva só `sub`=id e `perfil` | Enquanto o vínculo estiver ativo; após desligamento, `ativo=false` e anonimizar/remover em até 90 dias | **Sem rotina hoje** (pendência P2) |
| `clientes` (V2, V3) | nome, telefone, email, created_at | Identificar o cliente da OS e contatá-lo sobre orçamento, valor e veículo pronto | V (execução de contrato e procedimentos preliminares, como orçamento); II (obrigação legal fiscal) para o que compõe a OS faturada | Qualquer usuário autenticado (sem RBAC nesta fase, briefing; risco A3 da política) | Só para o app, por HTTPS fora do local: lista `GET /api/v1/clientes` (F03a: id, nome, telefone, email) e detalhe `GET /api/v1/clientes/{id}` (F03b, PR #22, fora da `main`: os mesmos e mais `cpf` e `endereco`). Resposta 201 da criação (F03c) e 200 da edição (`PUT /api/v1/clientes/{id}`, F03d), no formato do detalhe. Email único quando preenchido (revisão 6, P16). Nenhum terceiro. Nunca em log (política, seção 6) | R1: 5 anos após o último evento do cliente (prescrição do CDC art. 27, Código Civil art. 206, § 5º, I, e CTN arts. 173 e 174); R2: sem OS, 12 meses após o cadastro (política, seção 3). Proposta, P1 | Anonimizar (nome substituído, telefone e email NULL; política, seção 4). `DELETE` físico é inviável com OS ligada (FK sem `ON DELETE`), e a OS precisa ficar para o relatório |
| `clientes.cpf` (V4 da F08, ADR-018 proposto; aplicada no ramo da PR #22, ainda fora da `main`) | CPF, só dígitos, `VARCHAR(11) NULL` com `CHECK` de 11 dígitos ASCII | Emissão de documento fiscal. Coletado só quando o cliente pedir nota ou a emissão exigir; proibido "por garantia" | II (obrigação legal fiscal). Sem nota, não se coleta | Qualquer usuário autenticado, só pelo detalhe, inclusive com token de usuário já desativado até o JWT expirar (risco B2 da política, aceite pendente P8) | Só no detalhe e na resposta 201 da criação (F03c, eco do que o usuário enviou), completo, para o app, que mascara na tela e não grava em disco. Nunca na lista, em log (nem mascarado), em erro nem em exemplo do OpenAPI com dado real | Segue o cliente (R1 ou R2; R4 da política). Proposta, P1 | NULL na anonimização. A F08 só lê; a primeira escrita é da F09 (F03c), opcional (parecer, P9) e única quando preenchida (índice `uk_clientes_cpf` e 409 já na F03c, revisão 4 da política e ADR-020) |
| `clientes.endereco` (V4 da F08, ADR-018 proposto; aplicada no ramo da PR #22, ainda fora da `main`) | Endereço em texto livre, campo único, `VARCHAR(255) NULL` | Emissão fiscal ou busca e entrega do veículo combinada com o cliente | II (nota) ou V (busca e entrega) | Igual a `clientes.cpf` | Igual a `clientes.cpf` | Segue o cliente (R1 ou R2). Proposta, P1 | NULL na anonimização |
| `veiculos` (V2; a V7 da F04 traz `uk_veiculos_placa` e o `CHECK` de formato) | placa (identifica o dono via DETRAN e via `cliente_id`); marca, modelo, ano e cor por associação; quilometragem não coletada na F04 | Identificar o veículo na abertura e no acompanhamento da OS | V | Qualquer usuário autenticado (sem RBAC; riscos A3 e V7 da política) | Só para o app: criação (`POST /api/v1/clientes/{clienteId}/veiculos`), edição (`PUT /api/v1/veiculos/{id}`), detalhe (`GET /api/v1/veiculos/{id}`, com `clienteId` e `clienteNome`) e lista do cliente (`GET /api/v1/clientes/{id}/veiculos`: id, placa, marca e modelo). Nunca em URL nem em mensagem de erro; em log, só `****D23` (política, 6.6). Placa única | Igual ao cliente dono (R1 ou R2) | A placa vira `ANON<id>` junto com o cliente; demais colunas mantidas; a linha não é apagada (FK da OS). `cliente_id` imutável (política, 2.1 e 2.4) |
| `ordens_servico`, `parcelas`, `pagamentos`, `financeiro` (V2) | Nenhuma coluna pessoal direta; são dado pessoal por associação (histórico de consumo e pagamento ligado a `cliente_id`) | Execução do serviço, cobrança e controle financeiro | V e II (escrituração fiscal) | Igual a `clientes` | Relatórios internos (futuros) | 5 anos (fiscal) | Mantidos após anonimizar o cliente: deixam de identificar a pessoa |
| `movimentacoes_estoque.motivo` (V2) | Texto livre: risco de alguém digitar nome ou placa | Auditoria de estoque | — | Igual a `clientes` | — | Igual à OS ligada | Orientar no app a não digitar dado pessoal (pendência P5) |

Não coletado hoje: CPF e endereço de cliente. As colunas nascem vazias pela V4 da F08 (F03b), que só lê; a coleta começa na F09 (F03c), dentro da finalidade das linhas acima (overview.md, "Fora do script"). Antes, este registro dizia que as colunas entravam pela F09; a F09 depende da F08 no quadro, por isso a V4 foi antecipada.

## Segredos e logs (conferido na F44)

* `JWT_SECRET` vem só de variável de ambiente (`application.yml`, sem default). `JwtConfig` recusa segredo com menos de 32 bytes, e a mensagem de erro não traz o valor. O `.env.example` usa placeholder curto de propósito, para o boot falhar se for copiado sem troca.
* O `toString()` gerado pelo record `JwtProperties` imprimia o segredo em texto claro. Corrigido na F44 (`secret=***`), com teste.
* Na F44 o código de produção da API não tinha nenhuma chamada de log. Desde a F03a (PR #18) tem duas, conferidas em 2026-11-17 na `main` b1f29fc: `clientes.listar qLen page size total usuarioId` no `ClienteService` e o erro inesperado (classe da exceção e caminho) no `GlobalExceptionHandler`. Nenhuma leva dado pessoal de cliente nem segredo; numa execução local com clientes fictícios, o `grep` de nome, telefone e email no log deu 0. A F03b acrescenta só as duas linhas da seção 6.4 da política. O actuator expõe só `health`.
* Conferido de novo em 2026-11-17 no ramo da F08 (`eb62813`), com a API real em contêiner e clientes fictícios: as chamadas de log de produção são `clientes.listar`, `clientes.detalhar` e `clientes.detalhar.naoEncontrado` no `ClienteService`, mais o erro inesperado do `GlobalExceptionHandler`. Depois de chamar o detalhe com 200 (cliente com e sem dados opcionais), 404, 400 (`abc` e `%20`), 401 (sem token e com token inválido) e a lista com busca por telefone, o log teve só cinco linhas de cliente, todas com `clienteId`, `usuarioId` ou `qLen`. O `grep -c` de CPF, telefone (completo, trecho e mascarado), nome, email, endereço e credenciais fictícias no log deu 0. Os `toString()` de `ClienteDetalheResponse`, `ClienteListResponse` e do builder de `Cliente` mostram só o id ou texto fixo, com teste (achado B1 da política, fechado).
* Retenção de log: hoje só na saída padrão do contêiner, sem persistência. Proposta de no máximo 90 dias quando houver coletor (política, seção 7; pendência P7 da política).
* gitleaks nos commits da F44 ainda fora da `main`: sem vazamento.

## Decisões pendentes (controladora / pessoa)

* P1: aprovar base legal e prazos propostos para `clientes` e `veiculos` (e o prazo de 1 ano para cliente sem OS).
* P2: rotina de anonimização (usuário desligado após 90 dias; cliente após o prazo). Hoje não existe. Precisa existir antes de a F03a gravar o primeiro cliente real.
* P3: canal para o titular pedir acesso, correção ou eliminação (art. 18) e quem responde (encarregado, art. 41).
* P4: aviso de privacidade ao cliente da oficina no momento do cadastro (art. 9º). Conteúdo mínimo na seção 7 da política; vai no balcão, porque o app é usado pelo funcionário. Bloqueia o primeiro cadastro real, não a F03c (só API).
* P9 a P16 da política: CPF obrigatório ou opcional; índice único de CPF (decidido na revisão 4: entra na F03c, falta o aceite do ADR-020); regra de troca de dono de veículo na F04 (fechada na revisão 5: `cliente_id` imutável); conduta de recadastro do titular anonimizado em parte; veículo vendido com o dono antigo ativo (P13); limite do marcador `ANON<id>` (P14); bloqueio de veículo de cliente anonimizado e, na revisão 6, da edição de cliente anonimizado (P15); aceite do email único no POST e no PUT (P16).
* P5: orientação no app para não digitar dado pessoal em `motivo` e em outros campos de texto livre.
