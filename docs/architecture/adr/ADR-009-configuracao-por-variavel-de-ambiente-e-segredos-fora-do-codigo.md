---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [VIGIA (AppSec/LGPD), ESPRESSO (Dev Java), ANCORA (CI/CD)]
informed: [REGENTE, CRIVO]
---

# Configuração por variável de ambiente e segredos fora do código e do log

> Backfill: decisão da F00 já materializada (`application.yml` com `${...}`,
> `.env.example`, `JwtProperties`). Gravada agora para fechar o débito de ADR e
> consolidar a regra de segredos, que a F02 estende (segredo do JWT).

## Contexto e problema

A aplicação precisa de credenciais de banco e do segredo de assinatura do JWT.
O briefing e a LGPD exigem segredos fora do código e do log. Como externalizar a
configuração e os segredos?

## Fatores de decisão

* Nenhum segredo em código-fonte nem em log (briefing, OWASP, LGPD).
* Mesmo artefato roda em local/CI/futuro staging mudando só variáveis.
* Falha explícita se um segredo obrigatório faltar em produção.

## Opções consideradas

* **Opção A — Variáveis de ambiente** referenciadas no `application.yml` (`${VAR}`), com `.env.example` sem valores reais e `@ConfigurationProperties` tipado.
* **Opção B — Valores fixos no `application.yml`** por perfil (`application-prod.yml`).
* **Opção C — Cofre externo (Vault/Secrets Manager).**

## Resultado da decisão

Opção escolhida: **"Opção A — variáveis de ambiente"** (já aplicada pela F00),
porque externaliza config e segredos sem infraestrutura extra, adequado à
escala. `DB_URL`/`DB_USERNAME`/`DB_PASSWORD` e `JWT_SECRET`/
`JWT_EXPIRATION_MINUTES` vêm do ambiente; `.env.example` documenta as chaves sem
valores; `JwtProperties` (`@ConfigurationProperties(prefix="jwt")`) tipa o
acesso. **F02 estende**: `JWT_SECRET` passa a ser obrigatório para o login
funcionar (sem default utilizável) e o padrão de `JWT_EXPIRATION_MINUTES` muda
para `10080` (7 dias, ver ADR-004).

### Consequências

* Bom, porque o segredo nunca entra no versionamento; o mesmo build roda em qualquer ambiente.
* Bom, porque `@ConfigurationProperties` dá acesso tipado e testável.
* Neutro, porque exige disciplina para nunca logar `jwt.secret` nem senha (revisão + mascaramento).
* Ruim, porque não há rotação/auditoria central de segredo (sem cofre); aceitável nesta fase, revisitável se houver staging/produção gerida.

### Confirmação

* `grep` no código/log não encontra segredo literal; `.env.example` sem valores reais (já verificado nesta sessão).
* Teste/arranque: subir sem `JWT_SECRET` válido falha o login de forma controlada (não emite token com chave vazia).
* VIGIA valida mascaramento de log do fluxo de login.

## Prós e contras das opções

### Opção A — Variáveis de ambiente
* Bom, porque simples, portável e sem segredo em código.
* Neutro, porque depende de disciplina de não logar segredos.
* Ruim, porque sem rotação central.

### Opção B — Valores fixos por perfil
* Bom, porque simples de ler.
* Ruim, porque coloca segredo no versionamento — inaceitável.

### Opção C — Cofre externo
* Bom, porque dá rotação e auditoria.
* Ruim, porque é peso de infraestrutura desproporcional a uma oficina pequena nesta fase.

## Mais informações

Sustenta [[ADR-004-autenticacao-stateless-via-jwt-hs256]] (segredo e expiração).
Arquivos: `apps/api/src/main/resources/application.yml`, `.env.example`,
`config/JwtProperties.java`. Rotação de segredo é mitigação de incidente citada
no ADR-004.
