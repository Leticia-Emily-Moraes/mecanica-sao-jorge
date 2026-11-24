# F40 · Evidência de "sem mudança visual" (ORLA, 2026-11-13)

Critério: US-COMP-11. Resultado: **parcial**. Só um estado foi provado; o resto ficou sem prova visual.

## Ambiente

- iPhone 17, iOS 27.0, Simulator, Expo Go 54.0.7, Metro em modo dev (porta 8082).
- API: **não era a real**. Um servidor stub local respondia `POST /api/v1/auth/login`, só para dirigir os estados. Ele não foi versionado.
- Dois commits comparados: antes da refatoração `c815235` e depois dela `a153494`. Mesmo simulador, mesma janela, mesmo bundle em cache.

## O que foi provado

| Estado | Antes (`c815235`) | Depois (`a153494`) | Método | Resultado |
|---|---|---|---|---|
| Login vazio | `f40-capturas/login-vazio-antes-c815235.png` | `f40-capturas/login-vazio-depois-a153494.png` | comparação byte a byte dos pixels, linhas 200–2621 de 2622 (barra de status fora: relógio e ilha dinâmica são da plataforma) | idêntico |

Visto por mim também a olho: título, rótulos, campos, "Mostrar senha" e botão "Entrar" na mesma posição e com os mesmos tokens.

## O que NÃO foi provado

Nenhuma captura válida destes estados, antes ou depois:

- Login com foco no campo, erro de validação, preenchido, senha visível, erro de credencial, carregando e erro de rede.
- Perfil, diálogo de saída, tab bar, retorno ao login.
- Em 360, 768 e 1280 px (só um tamanho de aparelho).

Motivo: a digitação e parte dos toques automatizados (`cliclick` sobre a janela do Simulator) não chegaram de forma confiável ao app depois de relançar o Expo Go. Sem como tocar e digitar, não foi possível chegar a esses estados. Esses estados ficam cobertos só pela suíte Jest/RNTL (que passou) e pelas buscas estáticas, não por captura.

## Correção de uma conclusão errada

Numa verificação intermediária, a comparação de 02 (foco) e 03 (erro de validação) deu "idêntico". Estava errada: conferido por hash, as três fotos de cada execução eram o mesmo arquivo (login vazio, os toques não tiveram efeito). Essa comparação foi descartada e não conta como evidência.

## Para fechar US-COMP-11

Alguém com um aparelho ou simulador operável à mão (ou uma ferramenta de automação de UI como Maestro/idb, que esta sessão não tinha) repete os estados acima nos dois commits e compara. O estado "carregando" precisa de latência controlada na API.

## README principal

README sem mudança: a F40 não muda como instalar, rodar, testar ou configurar. O README de `apps/mobile` já foi atualizado em `a153494`.

## Rodada 2 (ORLA, 2026-11-13, após a revisão humana das 14:41)

Resultado do US-COMP-11: **continua bloqueado, 0 de 13 linhas provadas.** Nada foi capturado nesta rodada.

Verificado nesta sessão:
- Simulador iPhone 17 (iOS 27.0) está ligado, na tela inicial, sem o app aberto. `command -v maestro idb adb` não encontrou nenhuma das três ferramentas; só `cliclick` (`/opt/homebrew/bin/cliclick`), que a rodada 1 mostrou não entregar toque nem digitação de forma confiável. `docker` existe e o daemon responde.
- Sem uma ferramenta que toque e digite, não há como chegar a foco, validação, preenchido, senha visível, carregando, erro, Perfil, diálogo e tab bar. Subir API real (MySQL + Spring) e Metro seria possível, mas não resolve a entrada.
- Instalar Maestro ou `idb` é a dúvida 7 do PRD, que a pessoa decide (muda o README principal). Não instalei.

Mudou no código nesta rodada (por isso as capturas "depois" devem ser tiradas no commit final, premissa 9 do PRD): `TabBarItem` (tab bar) e `MenuShell` (layout do menu). Ambos mantêm os mesmos tokens e a mesma estrutura de nós; a equivalência visual é **não provada por captura**, só coberta por teste de componente e pela suíte de F33.

## README principal

README sem mudança: a F40 não muda como instalar, rodar, testar ou configurar. Mudaria se a dúvida 7 trouxer Maestro ou `idb` ao repositório.

## Rodada 3 (ORLA, 2026-11-13, após a revisão humana das 20:01)

Resultado do US-COMP-11: **continua parcial, 1 de 13 linhas provadas** (login vazio). Nada novo foi capturado.

Separação das branches: a `feat/f40-componentizacao-mobile` local trazia commits da F41 empilhados (de `03bcb51` a `88c586c`) e um commit da F39 (`c815235`) por baixo. Foi recriada a partir de `main` (3067954) só com os 12 commits da F40 (`7a8fd2c` a `6fe21cc`). O estado antigo continua em `feat/f41-paridade-correcoes`.

Verificado nesta sessão, na branch limpa: 25 suítes e 119 testes passam, `tsc --noEmit` e `eslint .` sem erro. Simulador iPhone 17 (iOS 27.0) ligado; `maestro` e `idb` seguem ausentes, só `cliclick`, que a rodada 1 mostrou não ser confiável. Nenhuma captura tentada.

Linha de base da F41: as capturas de `docs/design/f41-capturas/` (branch da F41) já incluem as correções de paridade da F41, então não provam que a F40 não mudou nada. Comparação válida: `c815235` (antes da F40) contra o tip desta branch, nos 13 estados, com ferramenta de toque.

Decisão proposta: o US-COMP-11 não é aceito como completo. O PR #10 fica em rascunho até a captura dos demais estados; a pessoa decide se aceita o parcial para mesclar.
