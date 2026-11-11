# C4 — Nível 1: Contexto

Sistema **Mecânica São Jorge** e seus atores. Diagrama versionado (Mermaid).
Atualizar junto de qualquer mudança estrutural, citando o ADR correspondente.

```mermaid
C4Context
  title Contexto — Sistema de Gestão da Mecânica São Jorge

  Person(func, "Funcionário / Admin", "Usuário interno da oficina. Autentica por email e senha (perfil ADMIN ou FUNCIONARIO, sem diferença de permissão nesta fase).")

  System(msj, "Sistema Mecânica São Jorge", "Gestão de clientes, veículos, ordens de serviço, catálogo/estoque, parcelas, pagamentos e financeiro. App mobile + API REST.")

  System_Ext(mysql, "MySQL", "Banco de dados relacional da oficina.")

  Rel(func, msj, "Usa (login, cadastros, OS, financeiro)", "App mobile / HTTPS")
  Rel(msj, mysql, "Lê e grava", "JDBC")
```

Notas:
- Sem integrações externas nesta fase (sem WhatsApp, PDF, e-mail, gateway de
  pagamento) — backlog de produto, fora de escopo (briefing).
- A própria API emite e valida o JWT (sem servidor de autorização externo) —
  ver [[ADR-004-autenticacao-stateless-via-jwt-hs256]].
