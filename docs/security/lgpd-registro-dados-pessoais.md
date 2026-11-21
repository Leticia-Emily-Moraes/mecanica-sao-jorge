# Registro de dados pessoais (LGPD) — schema atual da API

Dono: VIGIA (AppSec/LGPD). Criado na F44 (2026-11-13) a partir das migrations
V1 e V2 em `apps/api/src/main/resources/db/migration`. Atualizar a cada
migration que crie ou altere coluna com dado pessoal; a feature que traz a
coluna fecha a linha aqui antes do merge.

Status: a V1 já trazia base legal e retenção no comentário do SQL. A V2
(clientes, veículos e tabelas ligadas a eles) não registrava nada. As linhas
da V2 abaixo são **proposta do VIGIA**, pendente de aprovação da oficina
(controladora) — ver "Decisões pendentes".

Por que aqui e não no SQL: a V2 já está aplicada. Editar comentário de
migration aplicada muda o checksum e o Flyway falha no `validate`
(ADR-003/ADR-013).

## Inventário por tabela

| Tabela (migration) | Dado pessoal | Finalidade | Base legal (LGPD art. 7º) | Quem acessa | Para onde vai | Retenção | Como é apagado |
|---|---|---|---|---|---|---|---|
| `usuarios` (V1) | nome, email, senha_hash (BCrypt), perfil, ativo, datas | Controle de acesso ao sistema interno | V (contrato de trabalho) e IX (legítimo interesse no controle de acesso) | Usuário autenticado; DBA | Resposta do login (`UsuarioResumo`: id, nome, email, perfil; nunca senha_hash). JWT leva só `sub`=id e `perfil` | Enquanto o vínculo estiver ativo; após desligamento, `ativo=false` e anonimizar/remover em até 90 dias | **Sem rotina hoje** (pendência P2) |
| `clientes` (V2) | nome, telefone, email, created_at | Identificar o cliente da OS e contatá-lo sobre orçamento, valor e veículo pronto | V (execução de contrato e procedimentos preliminares, como orçamento); II (obrigação legal fiscal) para o que compõe a OS faturada | Qualquer usuário autenticado (sem RBAC nesta fase, briefing) | Ainda nenhum endpoint lê ou grava (F03a+) | Proposta: 5 anos após a última OS do cliente (prescrição do CDC art. 27 e prazo tributário do CTN art. 173/174); sem OS, 1 ano após o cadastro | Anonimizar (nome substituído, telefone e email NULL). `DELETE` físico é inviável com OS ligada (FK sem `ON DELETE`), e a OS precisa ficar para o relatório |
| `veiculos` (V2) | placa (identifica o dono via DETRAN e via `cliente_id`), modelo, marca, ano, cor, quilometragem | Identificar o veículo atendido | Igual a `clientes` | Igual a `clientes` | Ainda nenhum endpoint | Igual ao cliente dono | Anonimizar a placa junto com o cliente |
| `ordens_servico`, `parcelas`, `pagamentos`, `financeiro` (V2) | Nenhuma coluna pessoal direta; são dado pessoal por associação (histórico de consumo e pagamento ligado a `cliente_id`) | Execução do serviço, cobrança e controle financeiro | V e II (escrituração fiscal) | Igual a `clientes` | Relatórios internos (futuros) | 5 anos (fiscal) | Mantidos após anonimizar o cliente: deixam de identificar a pessoa |
| `movimentacoes_estoque.motivo` (V2) | Texto livre: risco de alguém digitar nome ou placa | Auditoria de estoque | — | Igual a `clientes` | — | Igual à OS ligada | Orientar no app a não digitar dado pessoal (pendência P5) |

Não coletado hoje: CPF e endereço de cliente. Entram só pela F09, com base legal e retenção registradas aqui antes da migration (overview.md, "Fora do script").

## Segredos e logs (conferido na F44)

* `JWT_SECRET` vem só de variável de ambiente (`application.yml`, sem default). `JwtConfig` recusa segredo com menos de 32 bytes, e a mensagem de erro não traz o valor. O `.env.example` usa placeholder curto de propósito, para o boot falhar se for copiado sem troca.
* O `toString()` gerado pelo record `JwtProperties` imprimia o segredo em texto claro. Corrigido na F44 (`secret=***`), com teste.
* O código de produção da API não tem nenhuma chamada de log (`git grep` sem ocorrência). O actuator expõe só `health`. Nenhum dado pessoal ou segredo é logado pela aplicação hoje.
* gitleaks nos commits da F44 ainda fora da `main`: sem vazamento.

## Decisões pendentes (controladora / pessoa)

* P1: aprovar base legal e prazos propostos para `clientes` e `veiculos` (e o prazo de 1 ano para cliente sem OS).
* P2: rotina de anonimização (usuário desligado após 90 dias; cliente após o prazo). Hoje não existe. Precisa existir antes de a F03a gravar o primeiro cliente real.
* P3: canal para o titular pedir acesso, correção ou eliminação (art. 18) e quem responde (encarregado, art. 41).
* P4: aviso de privacidade ao cliente da oficina no momento do cadastro (art. 9º).
* P5: orientação no app para não digitar dado pessoal em `motivo` e em outros campos de texto livre.
