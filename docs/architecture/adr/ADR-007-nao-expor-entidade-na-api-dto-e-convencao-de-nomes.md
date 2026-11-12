---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), VIGIA (AppSec/LGPD)]
informed: [REGENTE, CRIVO, PERGAMINHO]
---

# Não expor entidade na API: DTO + MapStruct e convenção de nomes do domínio

## Contexto e problema

O briefing proíbe expor entidade JPA na API e exige que o domínio seja
representado por entidades no singular dentro do pacote `entity`, mapeando o
schema real (sem classes de template genérico). O schema de referência
(`docs/script.sql`, cópia do `BD/script.sql` do repo irmão) tem **12 tabelas** em PascalCase com PK `*_id`; a F00 já
aplicou `usuarios` em snake_case com PK `id`. O texto da F02 fala em "11
entidades". Precisamos fixar: (a) como o dado entra e sai da API; (b) a
convenção de nomes de tabela/coluna/entidade; (c) quantas entidades existem.

## Fatores de decisão

* Restrição do briefing (nunca expor entidade; entidades no singular em `entity`).
* Consistência de nomes em todo o schema e em todas as features.
* Alinhamento com o que a F00 já aplicou (tabela `usuarios`).
* Controle do que entra (Bean Validation) e do que sai (sem campos sensíveis como `senha_hash`).

## Opções consideradas

Para a exposição:
* **Opção A — DTOs `*Request`/`*Response` com mapeamento por MapStruct.**
* **Opção B — Expor a entidade direto / com `@JsonIgnore` nos campos sensíveis.**

Para a convenção de nomes:
* **Opção C — Seguir a convenção da F00**: tabela plural snake_case, PK `id`, FK `<rel>_id`, entidade no singular.
* **Opção D — Seguir o script de referência**: tabela PascalCase, PK `<tabela>_id`.

## Resultado da decisão

**Exposição — Opção A (DTO + MapStruct)**: toda entrada é um `*Request` validado
com Bean Validation; toda saída é um `*Response` sem entidade e sem campo
sensível. O mapeamento entity↔DTO fica em `mapper` (MapStruct, já no pom). A
entidade nunca aparece em assinatura de controller.

**Convenção de nomes — Opção C (padrão da F00)**, porque a tabela `usuarios` já
foi aplicada assim e o PRD (US-FUND-02/03) lista as tabelas em snake_case e as
entidades no singular. Registro aqui a **divergência deliberada** do
`BD/script.sql` (PascalCase, PK `usuario_id`): o script é referência de
estrutura, não de nomenclatura; a casa segue o padrão já aplicado.

Regras concretas:
* Tabela: plural, snake_case minúsculo (`clientes`, `ordens_servico_servicos`).
* PK: `id` (`BIGINT UNSIGNED AUTO_INCREMENT`).
* FK: `<entidade_referenciada_singular>_id` (ex.: `cliente_id`, `ordem_id`, `peca_id`).
* Entidade: nome no singular em `entity` (`Cliente`, `OrdemServicoServico`).
* Repositório: `<Entidade>Repository`; serviço: `<Entidade>Service` / `<Acao>UseCase` quando fizer sentido.

**Contagem — 12 entidades, não 11**: o "11" do texto conta só as tabelas que
ganham migration nova (as de `V2`); a entidade `Usuario` (sobre a `usuarios` da
F00) também é necessária, inclusive para o login. Ao final da F02 o pacote
`entity` tem **12** classes:

`Cliente`, `Veiculo`, `Servico`, `Peca`, `OrdemServico`, `OrdemServicoServico`,
`OrdemServicoPeca`, `MovimentacaoEstoque`, `Parcela`, `Pagamento`, `Financeiro`,
`Usuario`.

### Consequências

* Bom, porque a API nunca vaza `senha_hash` nem estrutura interna; o contrato é estável e independente do schema.
* Bom, porque a convenção única elimina ambiguidade em todas as features seguintes.
* Bom, porque corrige o texto "11" para 12 sem mudar o schema.
* Neutro, porque exige um par DTO + mapper por recurso exposto (custo previsível).
* Ruim, porque diverge do `BD/script.sql` na nomenclatura — divergência registrada aqui, conforme o guia da casa ("se o repositório já tiver um padrão diferente, siga o padrão do repositório e registre a divergência").

### Confirmação

* Revisão: nenhum controller recebe/retorna entidade; todo `*Response` de login e futuros não têm `senha`/`senha_hash`.
* Teste (Hibernate sobe com `ddl-auto: validate`): cada entidade mapeia uma tabela real no singular; nenhuma aponta para `Categories`, `users` (genérico) ou `products` (US-FUND-03).
* Teste de controller (MockMvc) confirma o shape do DTO de saída.

## Prós e contras das opções

### Opção A — DTO + MapStruct
* Bom, porque separa contrato de modelo e controla campos expostos.
* Bom, porque MapStruct gera o mapeamento em tempo de compilação (sem reflexão em runtime).
* Neutro, porque adiciona classes de DTO/mapper por recurso.

### Opção B — Expor entidade
* Bom, porque menos classes a escrever.
* Ruim, porque **viola o briefing** e arrisca vazar campo sensível a cada novo atributo.

### Opção C — Convenção da F00
* Bom, porque alinha com o que já está aplicado e com o PRD.
* Neutro, porque diverge do script de referência (registrado).

### Opção D — Convenção do script
* Bom, porque copiaria o script literalmente.
* Ruim, porque exigiria reescrever a `usuarios` já aplicada (quebra Flyway, ver ADR-003) e PascalCase em tabela é atrito desnecessário.

## Mais informações

Depende de [[ADR-001-organizar-pacotes-por-camada]] (pacotes `entity`, `dto`,
`mapper`), [[ADR-003-versionar-schema-com-flyway-migrations-aditivas]] (schema),
[[ADR-006-persistir-enum-de-dominio-como-string]] (enums). Modelo de dados
detalhado (colunas, FKs, geradas) em `../overview.md`.
