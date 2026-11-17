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
VIGIA abaixo, antes da migration. A V4 ainda não está na `main`
([ADR-018](../architecture/adr/ADR-018-guardar-cpf-e-endereco-do-cliente-como-colunas-opcionais.md),
proposto). Detalhe por campo, exposição na API e regras de log de `clientes` e
`veiculos`: `docs/security/politica-dados-pessoais-cliente.md`, que prevalece
se este registro divergir.

Por que aqui e não no SQL: a V2 já está aplicada. Editar comentário de
migration aplicada muda o checksum e o Flyway falha no `validate`
(ADR-003/ADR-013).

## Inventário por tabela

| Tabela (migration) | Dado pessoal | Finalidade | Base legal (LGPD art. 7º) | Quem acessa | Para onde vai | Retenção | Como é apagado |
|---|---|---|---|---|---|---|---|
| `usuarios` (V1) | nome, email, senha_hash (BCrypt), perfil, ativo, datas | Controle de acesso ao sistema interno | V (contrato de trabalho) e IX (legítimo interesse no controle de acesso) | Usuário autenticado; DBA | Resposta do login (`UsuarioResumo`: id, nome, email, perfil; nunca senha_hash). JWT leva só `sub`=id e `perfil` | Enquanto o vínculo estiver ativo; após desligamento, `ativo=false` e anonimizar/remover em até 90 dias | **Sem rotina hoje** (pendência P2) |
| `clientes` (V2, V3) | nome, telefone, email, created_at | Identificar o cliente da OS e contatá-lo sobre orçamento, valor e veículo pronto | V (execução de contrato e procedimentos preliminares, como orçamento); II (obrigação legal fiscal) para o que compõe a OS faturada | Qualquer usuário autenticado (sem RBAC nesta fase, briefing; risco A3 da política) | Só para o app, por HTTPS fora do local: lista `GET /api/v1/clientes` (F03a: id, nome, telefone, email) e detalhe `GET /api/v1/clientes/{id}` (F03b, proposto: os mesmos e mais `cpf` e `endereco`). Nenhum terceiro. Nunca em log (política, seção 6) | R1: 5 anos após o último evento do cliente (prescrição do CDC art. 27, Código Civil art. 206, § 5º, I, e CTN arts. 173 e 174); R2: sem OS, 12 meses após o cadastro (política, seção 3). Proposta, P1 | Anonimizar (nome substituído, telefone e email NULL; política, seção 4). `DELETE` físico é inviável com OS ligada (FK sem `ON DELETE`), e a OS precisa ficar para o relatório |
| `clientes.cpf` (V4 da F08, especificada no ADR-018, ainda não aplicada) | CPF, só dígitos, `VARCHAR(11) NULL` com `CHECK` de 11 dígitos ASCII | Emissão de documento fiscal. Coletado só quando o cliente pedir nota ou a emissão exigir; proibido "por garantia" | II (obrigação legal fiscal). Sem nota, não se coleta | Qualquer usuário autenticado, só pelo detalhe (risco B2 da política, aceite pendente P8) | Só no detalhe, completo, para o app, que mascara na tela e não grava em disco. Nunca na lista, em log, em erro nem em exemplo do OpenAPI com dado real | Segue o cliente (R1 ou R2; R4 da política). Proposta, P1 | NULL na anonimização. A F08 só lê; a primeira escrita é da F09 |
| `clientes.endereco` (V4 da F08, especificada no ADR-018, ainda não aplicada) | Endereço em texto livre, campo único, `VARCHAR(255) NULL` | Emissão fiscal ou busca e entrega do veículo combinada com o cliente | II (nota) ou V (busca e entrega) | Igual a `clientes.cpf` | Igual a `clientes.cpf` | Segue o cliente (R1 ou R2). Proposta, P1 | NULL na anonimização |
| `veiculos` (V2) | placa (identifica o dono via DETRAN e via `cliente_id`), modelo, marca, ano, cor, quilometragem | Identificar o veículo atendido | Igual a `clientes` | Igual a `clientes` | Ainda nenhum endpoint | Igual ao cliente dono | Anonimizar a placa junto com o cliente |
| `ordens_servico`, `parcelas`, `pagamentos`, `financeiro` (V2) | Nenhuma coluna pessoal direta; são dado pessoal por associação (histórico de consumo e pagamento ligado a `cliente_id`) | Execução do serviço, cobrança e controle financeiro | V e II (escrituração fiscal) | Igual a `clientes` | Relatórios internos (futuros) | 5 anos (fiscal) | Mantidos após anonimizar o cliente: deixam de identificar a pessoa |
| `movimentacoes_estoque.motivo` (V2) | Texto livre: risco de alguém digitar nome ou placa | Auditoria de estoque | — | Igual a `clientes` | — | Igual à OS ligada | Orientar no app a não digitar dado pessoal (pendência P5) |

Não coletado hoje: CPF e endereço de cliente. As colunas nascem vazias pela V4 da F08 (F03b), que só lê; a coleta começa na F09 (F03c), dentro da finalidade das linhas acima (overview.md, "Fora do script"). Antes, este registro dizia que as colunas entravam pela F09; a F09 depende da F08 no quadro, por isso a V4 foi antecipada.

## Segredos e logs (conferido na F44)

* `JWT_SECRET` vem só de variável de ambiente (`application.yml`, sem default). `JwtConfig` recusa segredo com menos de 32 bytes, e a mensagem de erro não traz o valor. O `.env.example` usa placeholder curto de propósito, para o boot falhar se for copiado sem troca.
* O `toString()` gerado pelo record `JwtProperties` imprimia o segredo em texto claro. Corrigido na F44 (`secret=***`), com teste.
* Na F44 o código de produção da API não tinha nenhuma chamada de log. Desde a F03a (PR #18) tem duas, conferidas em 2026-11-17 na `main` b1f29fc: `clientes.listar qLen page size total usuarioId` no `ClienteService` e o erro inesperado (classe da exceção e caminho) no `GlobalExceptionHandler`. Nenhuma leva dado pessoal de cliente nem segredo; numa execução local com clientes fictícios, o `grep` de nome, telefone e email no log deu 0. A F03b acrescenta só as duas linhas da seção 6.4 da política. O actuator expõe só `health`.
* Retenção de log: hoje só na saída padrão do contêiner, sem persistência. Proposta de no máximo 90 dias quando houver coletor (política, seção 7; pendência P7 da política).
* gitleaks nos commits da F44 ainda fora da `main`: sem vazamento.

## Decisões pendentes (controladora / pessoa)

* P1: aprovar base legal e prazos propostos para `clientes` e `veiculos` (e o prazo de 1 ano para cliente sem OS).
* P2: rotina de anonimização (usuário desligado após 90 dias; cliente após o prazo). Hoje não existe. Precisa existir antes de a F03a gravar o primeiro cliente real.
* P3: canal para o titular pedir acesso, correção ou eliminação (art. 18) e quem responde (encarregado, art. 41).
* P4: aviso de privacidade ao cliente da oficina no momento do cadastro (art. 9º).
* P5: orientação no app para não digitar dado pessoal em `motivo` e em outros campos de texto livre.
