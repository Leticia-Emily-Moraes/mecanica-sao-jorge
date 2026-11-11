---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), ANCORA (CI/CD), CRIVO (QA)]
informed: [REGENTE, VIGIA]
---

# Versionar o schema com Flyway e nunca reescrever migration aplicada

## Contexto e problema

O schema completo da oficina (12 tabelas) vem do script de referência (cópia
versionada neste repo em `docs/script.sql`, originada do `BD/script.sql` do repo
irmão), que começa com `DROP DATABASE` — proibido pelo briefing. A
F00 já aplicou `V1__criar_tabela_usuarios.sql` criando `usuarios`. O texto da
F02 pede "Migration V1 gerada a partir de `BD/script.sql`", no singular. Duas
perguntas de fundação: (a) como versionar o schema de forma reprodutível em
local/CI/futuro staging; (b) a V1 da F00 deve ser **reescrita** para conter as
12 tabelas, ou mantida com uma **V2 aditiva** para as 11 restantes?

## Fatores de decisão

* Reprodutibilidade: todo ambiente sobe do zero com o mesmo schema.
* Integridade do histórico: Flyway valida checksum de migrations já aplicadas.
* Segurança operacional: não quebrar ambientes/CI que já rodaram a V1.
* Restrição do briefing: sem `DROP DATABASE`; `hibernate.ddl-auto: validate`.

## Opções consideradas

* **Opção A — Manter V1 (`usuarios`) e adicionar V2 com as 11 tabelas restantes** (aditiva).
* **Opção B — Reescrever a V1 em uma única migration com as 12 tabelas.**
* **Opção C — Deixar o Hibernate criar o schema (`ddl-auto: update`), sem Flyway.**

## Resultado da decisão

Opção escolhida: **"Opção A — V2 aditiva"**, porque respeita a regra de ouro do
Flyway (nunca modificar migration já aplicada: muda o checksum e falha a
validação em qualquer ambiente que já a rodou, incluindo o CI da F00) e entrega
o schema completo de forma reprodutível. O "V1 no singular" do texto da F02 é
lido como "a migration do schema da oficina", materializada aqui como a
**próxima** versão (`V2`), já que a V1 está ocupada pela F00.

`V2__criar_schema_oficina.sql` cria as 11 tabelas restantes (clientes, veiculos,
servicos, pecas, ordens_servico, ordens_servico_servicos, ordens_servico_pecas,
movimentacoes_estoque, parcelas, pagamentos, financeiro), sem `DROP DATABASE`,
seguindo a convenção de nomes do projeto (ADR-007), com enums como VARCHAR
(ADR-006) e os subtotais das junções como coluna gerada (ADR-005).

### Consequências

* Bom, porque o histórico Flyway permanece íntegro; nenhum ambiente quebra.
* Bom, porque `V2` isola o schema da oficina da baseline de `usuarios`.
* Neutro, porque a tabela `usuarios` segue a convenção da F00 (PK `id`, snake_case), divergente do `Usuarios` do script de referência (PK `usuario_id`, PascalCase) — divergência registrada em ADR-007.
* Ruim, porque o schema fica em duas migrations em vez de uma; sem impacto prático, já que o CI roda todas do zero (ADR-010).

### Confirmação

Teste de integração com Testcontainers (ADR-010) aplica **todas** as migrations
do zero contra MySQL real e valida que as 12 tabelas existem. `ddl-auto:
validate` garante que a aplicação só sobe se as entidades batem com o schema
migrado. Nenhum arquivo em `db/migration` contém `DROP DATABASE` (grep no CI).

## Prós e contras das opções

### Opção A — V2 aditiva
* Bom, porque preserva o checksum da V1 já aplicada.
* Bom, porque é a prática padrão de Flyway (forward-only).
* Neutro, porque mantém a divergência de convenção de `usuarios` (aceitável).

### Opção B — Reescrever a V1
* Bom, porque deixaria o schema em um único arquivo coeso.
* Ruim, porque **quebra a validação de checksum** em qualquer ambiente/CI que já aplicou a V1 da F00 (feature Concluída e mergeada).
* Ruim, porque exigiria `flyway repair` ou limpar bancos — risco operacional sem ganho real.

### Opção C — ddl-auto do Hibernate
* Bom, porque elimina escrever SQL.
* Ruim, porque não é reprodutível nem auditável, e o briefing exige migration a cada mudança de schema e `validate`.
* Ruim, porque não suporta coluna gerada/DDL fino de forma confiável.

## Mais informações

Depende de [[ADR-005-subtotais-da-os-como-coluna-gerada-no-banco]],
[[ADR-006-persistir-enum-de-dominio-como-string]] e
[[ADR-007-nao-expor-entidade-na-api-dto-e-convencao-de-nomes]]. Verificada por
[[ADR-010-testes-de-integracao-com-testcontainers]]. Revisitar a estratégia de
baseline se, antes de produção, a equipe decidir consolidar V1+V2 num baseline
único (`flyway baseline`) — decisão nova, fora desta fatia.
