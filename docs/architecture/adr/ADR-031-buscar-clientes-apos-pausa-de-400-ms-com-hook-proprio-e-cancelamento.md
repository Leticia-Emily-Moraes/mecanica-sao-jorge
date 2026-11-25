---
status: proposto   # 2026-11-19 proposto (F35, CARTOGRAFO); aguarda aceite da pessoa dona do produto antes da fatia (a)
date: 2026-11-19
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: []   # ORLA e ESQUADRO ainda não revisaram
informed: [REGENTE, BUSSOLA, ORLA, ESQUADRO, VIGIA, CRIVO]
---

# Buscar clientes depois de uma pausa de 400 ms na digitação, com hook próprio e cancelamento da busca anterior

Histórico de status:

* 2026-11-19: proposto (F35, etapa do CARTOGRAFO). Pela regra da casa, a fatia (a) da F35 só começa depois do aceite.

Vínculos: F35 (premissa 7; critérios US-CLV-FRONT-02, 04, 16 e 19; tarefa 6). Contrato do `GET /api/v1/clientes` no ADR-017 (`q` até 100 caracteres, vazio lista sem filtro, telefone só com termo numérico). Estado e cancelamento no ADR-030 (D5 e D6). Seção 7 da política de dados (termo fora do log, campo sem sugestão do teclado).

## Contexto e problema

O critério 2 pede que a lista seja filtrada pelo endpoint "com uma única chamada por pausa e não uma por tecla". A F35 não fixa o tamanho da pausa, e nenhum documento do repositório fixa (busca por "debounce", "pausa na digitação" e valores em ms em `docs/` não achou nada). O app não tem biblioteca de debounce instalada (`package.json` lido). Sem regra, três problemas aparecem: chamadas em excesso, resposta de um termo antigo chegando depois da do termo novo, e `q` com mais de 100 caracteres respondendo 400.

Quanto tempo esperar, onde fica essa espera e o que acontece com a busca anterior?

## Fatores de decisão

* B1. Uma chamada por pausa: digitar "ana" em três teclas com intervalo menor que a pausa gera exatamente um `GET` com `q=ana`, verificável com `jest.useFakeTimers`.
* B2. A lista nunca mostra o resultado de um termo que já foi substituído.
* B3. Nenhuma dependência nova.
* B4. Nenhum `q` que a API rejeite: o app nunca envia mais de 100 caracteres.
* B5. Atraso percebido baixo: o resultado começa a carregar menos de meio segundo depois da última tecla.
* B6. O termo nunca vai para log, disco ou rota do app.

## Opções consideradas

* A. Hook próprio `useDebouncedValue(valor, atrasoMs)` com 400 ms, mais cancelamento por `AbortController` e regras de disparo imediato.
* B. Manter como está: chamada a cada tecla.
* C. Biblioteca de debounce (`use-debounce` ou `lodash.debounce`).
* D. Buscar só ao confirmar (tecla de envio do teclado ou botão "Buscar").
* E. Carregar a base e filtrar no app.

## Resultado da decisão

Opção escolhida: "A", porque é a única que atende B1, B2 e B3 juntas. B falha em B1. C atende B1 e B2, mas falha em B3 por algo que cabe em cerca de 15 linhas com teste. D falha no texto do critério 2 ("pausa na digitação"). E contraria a paginação do ADR-017 e traz a base inteira de dados pessoais para a memória, o contrário da coleta mínima.

### Regras

1. O campo de busca é controlado por `useClientList`: `termoDigitado` muda a cada tecla e nunca chama a API sozinho.
2. `termoEfetivo = useDebouncedValue(termoDigitado, ATRASO_BUSCA_MS).trim()`, com `ATRASO_BUSCA_MS = 400` exportado de `src/config/search.ts`. Cada tecla reinicia a espera.
3. A chamada dispara quando `termoEfetivo` difere do último termo pedido. "ana" e "ana " (espaço no fim) não geram chamada nova.
4. Disparo imediato, sem esperar a pausa: ao limpar a busca (ação "Limpar" ou campo zerado pelo botão do campo, critério 19) e ao tocar na tecla de envio do teclado (`onSubmitEditing`).
5. Termo efetivo vazio não envia `q`, e a lista volta ao estado sem filtro (ADR-017: ausente, vazio ou só espaços lista tudo). Não há mínimo de caracteres: o ADR-017 aceita um caractere, e um dígito busca telefone.
6. O campo tem `maxLength={100}`. O `maxLength` do React Native e o `@Size` do backend contam unidades UTF-16, então o limite bate com o do ADR-017 (B4).
7. Termo novo aborta a chamada em voo (ADR-030, D5), zera as páginas acumuladas e mostra `carregando`. Resposta de chamada abortada é descartada (B2).
8. "Tentar novamente" e a recarga ao voltar ao foco usam o `termoEfetivo` atual, sem esperar pausa.
9. O campo tem `autoComplete="off"` e `autoCorrect={false}` (política, seção 7). O termo não entra em rota, log nem armazenamento.
10. O hook não decide texto. `semResultado` (termo presente, zero itens) e `vazio` (sem termo, zero itens) são estados distintos (ADR-030, D6).

Por que 400 ms: é hipótese de projeto, não medida. Fica no meio da faixa de 300 a 500 ms usada em busca incremental, longa o bastante para não disparar entre teclas de quem digita no balcão e curta o bastante para B5. Por estar numa constante, ajustar depois do uso real é uma linha.

### Consequências

* Bom, porque digitar um nome inteiro custa uma ou duas chamadas, não uma por letra, e o teste prova isso com relógio falso.
* Bom, porque o cancelamento da busca anterior elimina a troca de resultado fora de ordem.
* Bom, porque nenhum termo que a API rejeitaria sai do app.
* Ruim, porque toda busca espera 400 ms antes de começar, mesmo para quem digita uma letra e para.
* Ruim, porque mostrar `carregando` a cada termo novo pisca a lista. Manter a lista anterior com indicador discreto seria outra decisão de tela; fica com o ESQUADRO, e o hook já expõe `atualizando` se ele escolher isso.
* Neutro, porque `trim()` do JavaScript remove o espaço não separável (U+00A0) e o `strip()` do Java não remove. Um termo só de U+00A0 lista tudo no app, em vez de buscar U+00A0 na API. Não há caso real para isso.

### Risco residual

* 400 ms pode ser curto para quem digita devagar ou longo para quem digita rápido. Sem medição de uso, é ajuste posterior.
* Teclado com composição (acento por tecla morta no iOS) pode emitir valores intermediários. A pausa absorve isso, mas não verifiquei em aparelho.

### Confirmação

* Teste de `useDebouncedValue` com `jest.useFakeTimers`: três mudanças em menos de 400 ms produzem um único valor final, 400 ms depois da última.
* Teste de `useClientList` com `fetch` simulado: "a", "an", "ana" em 100 ms cada e avanço de 400 ms dão exatamente um `fetch` com `q=ana`; "ana " depois não chama de novo; limpar chama na hora sem `q`; envio pelo teclado chama na hora.
* Teste de corrida: a resposta de "an" chegando depois da de "ana" não aparece na lista.
* Teste do campo: `maxLength` 100, `autoComplete` "off" e `autoCorrect` falso.
* O teste de log do ADR-030 inclui a busca e procura o termo digitado nas saídas de `console`.

## Prós e contras das opções

### A. Hook próprio com 400 ms e cancelamento (escolhida)

* Bom, porque é pouco código, sem dependência, e testável com o relógio falso do `jest`.
* Bom, porque as regras de disparo imediato (limpar, enviar) ficam explícitas e testadas.
* Ruim, porque o valor de 400 ms é hipótese, e o hook é mais uma peça a manter.

### B. Manter como está (uma chamada por tecla)

* Bom, porque o resultado aparece na hora a cada letra.
* Ruim, porque falha no critério 2 e multiplica as chamadas e as linhas de log do backend (seção 6.3 da política).
* Custo de descartar: nenhum.

### C. Biblioteca de debounce

* Bom, porque a função já vem testada pela comunidade, com opções (`leading`, `maxWait`).
* Ruim, porque é dependência nova para algo pequeno, com versão a acompanhar, e o cancelamento da chamada HTTP continua sendo nosso.
* Custo de descartar: escrever e testar o hook, cerca de 15 linhas.

### D. Buscar só ao confirmar

* Bom, porque é o mais simples e nunca chama sem intenção.
* Ruim, porque contraria a premissa 7 e o critério 2, e obriga um toque a mais em cada busca no balcão.
* Custo de descartar: nenhum; a tecla de envio continua disparando na hora (regra 4).

### E. Filtrar no app

* Bom, porque o filtro é instantâneo depois da carga.
* Ruim, porque exige baixar todas as páginas, guarda dado pessoal de toda a base em memória e duplica no app a regra de busca do ADR-017 (acento, telefone numérico).
* Custo de descartar: nenhum.

## Mais informações

* Revisitar o valor de `ATRASO_BUSCA_MS` depois das primeiras semanas de uso na oficina.
* A busca de peças (F17) e de serviços (F05) no app pode reaproveitar `useDebouncedValue` e estas regras; cada feature confirma o próprio valor.
