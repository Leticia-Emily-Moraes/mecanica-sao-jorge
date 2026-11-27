# F45: rascunho do corpo do PR (revisão da Sprint 02, rodada 2)

Título sugerido: `docs(f45): relatório da revisão da Sprint 02 com evidência executada depois do merge`

Base: `main` (`00f3236`). Branch: `docs/f45-revisao-sprint-02-rodada-2`. **Nada foi enviado** (sem push, sem PR aberto).

## O que mudou

Só documentação e 9 capturas PNG. **Nenhum código de `apps/` mudou** (`git diff --stat 00f3236 HEAD -- apps` vazio).

- `docs/product/F45-relatorio-revisao-sprint-02.md`: reescrito para a `main` atual (substitui a versão de 20/11).
- `docs/product/F45-matriz-gherkin-x-teste.md`: 146 linhas, F03a a F35 (F04 com uma linha por cenário).
- `docs/product/F45-evidencia-api-espresso.md`: `mvn clean verify` (410 testes) e 52 chamadas HTTP.
- `docs/design/F45-*.md` e `docs/design/f45-capturas/`: auditoria de código, paridade, a11y, evidência do app.
- `docs/design/figma.md`: registro da leitura do Figma da rodada 2 (somente leitura).

## Por quê

Fechar a Sprint 02 com evidência executada **depois** do merge de F03c, F04, F03d e F35, e separar o que foi
corrigido (5 achados pequenos, já na `main`) do que vira feature de correção (18 cartões no relatório, seção 10).

## Como verificar

    git diff --stat 00f3236 HEAD -- apps                      # vazio
    npm --prefix apps/mobile run lint                        # 15 avisos, 0 erro
    npm --prefix apps/mobile run typecheck                   # sem erro
    npm --prefix apps/mobile test -- --silent                # 891 passam, 34 ignorados (ver aviso abaixo)
    apps/api/mvnw -B -f apps/api/pom.xml clean verify        # 410 testes, 0 falha (relato do ESPRESSO)
    gitleaks detect --source . --redact                      # no leaks found

## Avisos para quem revisa

- **A suíte do app é intermitente:** 1 falha em 4 execuções de TORRE (2 testes, um em `client-edit-screen.test.tsx:103`). Causa não provada (LAC-10).
- **Não verificado por ninguém:** VoiceOver, TalkBack, teclado externo, anel de foco real, contraste no app renderizado, capturas 360×740.
- **Não verificado por TORRE:** `mvn clean verify`, a bateria HTTP e o `f35-real-api` (são evidência do ESPRESSO e da ORLA).
- **A revisão não fecha sozinha:** a política de dados do cliente é **proposta** (P1); faltam registro de aceite (D-E, ADR-020, P16) e decisão sobre o trailer `Co-Authored-By` do `03e7646`, que já está na `main`.
- Captura `app-E1-...` mostra o CPF fictício `529.982.247-25` inteiro (dígito válido). Abri só 2 das 9 imagens.
- Nenhum card foi aberto no painel; os 18 textos estão no relatório, seção 10.
