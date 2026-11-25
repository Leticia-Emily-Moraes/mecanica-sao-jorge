# F45: verificação do front de Clientes e Veículos (MERIDIANO, rodada 2, 2026-11-25)

Branch `docs/f45-revisao-sprint-02-rodada-2`, partindo de `3874783`. **Nenhum código de produto foi alterado.**

## Por que não implementei nada

- A F45 é revisão. As telas de Clientes e Veículos com os quatro estados vêm da F35, já na `main`.
- As 5 correções pequenas do app (N-05, N-06, LG-04, N-09, LG-03) estão em `HEAD`
  (`git merge-base --is-ancestor` confirmou N-05 e LG-03). O limite de 5 está esgotado.
- FC-A a FC-E (especificação do ESQUADRO) são feature de correção: FC-A passa de 2 arquivos de produto e as demais
  excedem o limite. Alterar código para elas aqui violaria US-REV-02-17 e US-REV-02-18.

## O que conferi no código (leitura, `Grep`)

| Tela | Carregando | Erro com "tentar de novo" | Vazio |
|---|---|---|---|
| `client-list-screen.tsx` | `StateView state="loading"` (l. 90) | `onRetry={lista.tentarNovamente}` (l. 99) | `StateView` (l. 106 e 117) |
| `client-detail-screen.tsx` | l. 78 | `onRetry={cliente.tentarNovamente}` (l. 87); seção de veículos com retry próprio (l. 119) | seção de veículos |
| `client-edit-screen.tsx` | l. 57 | `onRetry={form.recarregar}` (l. 65) | sem estado vazio (lacuna de design já registrada) |
| `vehicle-detail-screen.tsx` | l. 62 | `onRetry={veiculo.tentarNovamente}` (l. 71) | histórico de OS vazio (parcial até a F06) |

As telas só compõem `StateView`; as chamadas à API ficam em hooks. Não abri `client-create`, `vehicle-create` e
`vehicle-edit` nesta etapa. Isso é leitura estática: não vi os estados renderizados.

## Comandos e saídas (em `apps/mobile`, executados nesta sessão)

| Comando | Resultado |
|---|---|
| `npm run lint` | 0 erros, 15 avisos (`array-type`, os mesmos da linha de base) |
| `npm run typecheck` | sem erro |
| `npm run format:check` | `All matched files use Prettier code style!` |
| `npm test` (1ª execução) | **2 falhas**: `Tests: 2 failed, 34 skipped, 889 passed, 925 total`; uma delas em `src/integration/menu-routing.test.tsx:48` (`renderRouter`). Não gravei o nome da segunda |
| `npm test` (2ª execução, saída em arquivo) | `Test Suites: 1 skipped, 98 passed`; `Tests: 34 skipped, 891 passed, 925 total` |
| `npm test -- src/integration/menu-routing.test.tsx` | 4 de 4 passam |

**A suíte é intermitente** (a TORRE já tinha visto 1 falha em 4 execuções; aqui foi 1 em 2 execuções completas
com resultado conhecido). Não encontrei a causa. Os 34 testes ignorados são os de `f35-real-api`, que exigem
`QA_F35_API`; não os rodei, porque não subi API nem MySQL.

## Não verificado

- Estados renderizados em aparelho ou simulador, leitor de tela, teclado externo, 360 × 740.
- A causa da falha intermitente de `menu-routing.test.tsx`.
- `client-create`, `vehicle-create` e `vehicle-edit` por leitura.
