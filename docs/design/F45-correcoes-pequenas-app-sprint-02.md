# F45: correções pequenas do app (ORLA)

Branch `docs/f45-prd-revisao-sprint-02`, partindo de `581a50d`. Achados vêm de
`F45-conferencia-paridade-wcag-sprint-02.md` (N-xx, ESQUADRO) e da auditoria LGPD (LG-xx, VIGIA).
Tudo rodou em Jest (`jest-expo`, renderer de teste) no macOS. Nenhum simulador, aparelho ou leitor
de tela foi usado.

## Linha de base (antes, em `581a50d`)

| Comando (em `apps/mobile`) | Resultado |
|---|---|
| `npm run lint` | 0 erros, 15 avisos (`@typescript-eslint/array-type`, já existentes) |
| `npm run typecheck` | sem saída de erro |
| `npm test` | 86 suítes passando, 1 ignorada; 841 testes passando, 34 ignorados |

## Correções (ordem: severidade, depois ordem de descoberta; limite de 5 atingido)

| Achado | Sev. | Commit | Produto (arquivos, linhas +/-) | Teste de regressão | Antes | Depois |
|---|---|---|---|---|---|---|
| N-05 sem anel de foco nos botões do cabeçalho (WCAG 2.4.7) | Alta | `919d39a` | `header-icon-button.tsx` 5/1 | `header-icon-button.test.tsx` (2 testes novos) | `Expected: true / Received: false` | 6 de 6 passam |
| N-06 alvo de toque de fechar o aviso: 22 de altura | Média | `eed2d2b` | `inline-notice.tsx` 6/4 | `inline-notice.test.tsx` (1 novo, mede o botão e não o aviso) | `Expected: >= 48 / Received: 22` | 7 de 7 passam |
| LG-04 busca sem `autoComplete="off"` | Baixa | `d5a04b2` | `search-field.tsx` 1/0 | `search-field.test.tsx` (1 novo) | `Expected: "off" / Received: undefined` | passa |
| N-09 `fontWeight: '600'` fora dos tokens | Baixa | `26acea2` | `vehicle-form-fields.tsx` 2/2 | `vehicle-form-fields.test.tsx` (1 novo) | `Expected: "Inter_600SemiBold" / Received: undefined` | passa |
| LG-03 campos do cliente abertos ao preenchimento automático | Baixa | `301cdf4` | `text-field.tsx` 4/0 e `client-form-fields.tsx` 6/10 | `client-form-fields.test.tsx` (5 casos) | 5 falhas | 21 de 21 passam |

Observações:

- N-06: o teste antigo (`should extend the dismiss touch area to 48 high`) somava a altura do aviso
  (44) à folga e passava com o defeito. O botão mede só o ícone (18), então a área real era 34 × 22.
  O teste antigo foi mantido; o novo mede o ícone.
- LG-03: o `campo()` agora define `autoComplete="off"`, `textContentType="none"` e
  `importantForAutofill="no"` antes dos extras. O campo Nome entrou além da lista do VIGIA (nome do
  cliente também é dado de terceiro). A regra de formulário de criação citada pelo VIGIA está na
  política da pilha (revisão 7), não na política desta base; o código ficou de acordo com ela.
- N-05: o anel é desenhado na própria caixa de 36 × 36 (borda de 2 px sempre reservada), então o
  tamanho visível não muda ao focar. O fundo translúcido é preservado.

## Depois (fim da etapa)

| Comando (em `apps/mobile`) | Resultado |
|---|---|
| `npm run lint` | 0 erros, 15 avisos (os mesmos da linha de base) |
| `npm run typecheck` | sem saída de erro |
| `npm run format:check` | `All matched files use Prettier code style!` |
| `npm test` | 86 suítes passando, 1 ignorada; 851 testes passando, 34 ignorados (+10 novos) |

## Não corrigido aqui (não pequeno ou depende de decisão)

- N-01, N-03, N-04 (`text-field.tsx` com ícone, nome acessível e asterisco): tocam `strings.ts`, os
  formulários e o contrato do nome acessível; juntos passam de 2 arquivos. Feature de correção.
- N-02 (faixa de erro acima do botão Salvar): depende de decisão de design da pessoa.
- N-07 (frames fora da seção F26) e N-08 (foco inicial do diálogo de descarte): N-07 é do Figma;
  N-08 não foi verificado em aparelho.

## Capturas antes e depois

Não foram feitas. Esta sessão não tem simulador nem aparelho com o app rodando, e não tentei subir
Expo, API e MySQL. A evidência acima é de teste de componente, que prova props e estilos, não a
renderização. Pendente de captura em 360 × 740 com dados fictícios (lista de ESQUADRO, seção 6).
Foco por teclado, leitor de tela (VoiceOver, TalkBack) e preenchimento automático real do Android
continuam não verificados.
