# F39 — Redesenho de wireframes com inspiração de navegação (Figma)

- Autor: ESQUADRO (etapa 2 de 3: BUSSOLA → ESQUADRO → CRIVO)
- Data: 2026-11-12
- PRD: `docs/product/F39-redesenho-wireframes-navegacao-figma.md` (critérios US-WFR-01 a 08)
- Status: **BLOQUEADO — nenhuma tela foi redesenhada**

## 1. Por que está bloqueado

A feature pede navegação "reorganizada a partir da referência" (US-WFR-02). O
link do Figma de referência não foi entregue a nenhuma etapa da rota:

| Onde procurei | Resultado |
|---|---|
| Briefing desta etapa | Só traz a pasta de destino (`681115069`), que é onde criar arquivo, não a referência. |
| PRD da F39, seção 6 | Registra o link como "pendência operacional" (BUSSOLA, 2026-11-11). |
| Handoff de BUSSOLA (2026-11-12) | Confirma que não achou o link e devolveu a feature como bloqueada. |
| Repositório inteiro, em texto e em todas as branches locais | O único link `figma.com` é `DLqbSzzKRxiN2eyvXG73Lr`, o próprio arquivo do wireframe F24 (`docs/design/figma.md`). |
| Autenticação no Figma (`whoami`) | Funciona (plano `team::1274094162661077353`). O bloqueio **não** é de acesso. |

O arquivo F24 é o que será revisado, não a referência. Usá-lo no lugar dela
transformaria a "inspiração" num retrabalho do que já existe e deixaria
US-WFR-02 impossível de conferir. A ferramenta do Figma também não lista o
conteúdo de uma pasta, então não dá para procurar a referência por conta
própria, e eu só posso alterar arquivos que criei ou o indicado no briefing.

Não li o arquivo de referência, não deduzi sua estrutura e não desenhei nada
com base em suposição.

## 2. O que destrava

Alguém precisa informar o link do Figma de referência (`figma.com/design/<chave>/...`,
de preferência com `node-id` da página ou seção de menu/navegação que serve
de modelo) e dar acesso de leitura à conta autenticada (`Leticia Moraes`).
BUSSOLA registra o link no PRD (seção 6) e a execução segue.

## 3. Plano de execução assim que o link chegar

Fiel ao pedido do comandante, sem alterar o inventário fechado de 24 telas:

1. `create_session` no arquivo de referência (só leitura) e leitura com
   `get_metadata`, `get_design_context` e `get_screenshot`. Registrar aqui
   ids dos nós e a lógica de agrupamento e hierarquia (não cor, fonte ou
   componente visual).
2. Criar **página nova** no arquivo `DLqbSzzKRxiN2eyvXG73Lr` (um arquivo por
   operação, ver `docs/design/figma.md`), preservando a página
   `F24 · Wireframe baixa fidelidade` intacta.
3. Redesenhar as 24 telas × estados aplicáveis (matriz da seção 5.4 do PRD
   da F24), com o **X** nos modais e o **olho** no campo de senha definidos
   na F38.
4. Para cada bottom sheet, modal ou drawer usado, registrar o motivo
   estrutural junto da tela (US-WFR-08).
5. Atualizar o mapa `docs/architecture/diagrams/navegacao-wireframe-f24.md`
   sem tela órfã nem sem saída, fechando os seis gaps originais (US-WFR-03).
6. Entregar tabela tela × estado com os node ids, e legenda de ordem de
   foco e leitura em cada estado de erro e vazio (US-WFR-06).
7. Registrar na seção 10 do PRD qualquer divergência com o F33 (1 aba
   habilitada + 4 desabilitadas) como débito ao REGENTE, sem tocar o código
   do app nem o PRD do F33 (US-WFR-04/05).

## 4. O que não foi feito

Todos os critérios US-WFR-01 a 08 seguem **sem cobertura** nesta etapa. Nenhum
nó foi criado ou alterado no Figma, nenhum arquivo em `apps/mobile/**` e o PRD
do F33 não foram tocados.
