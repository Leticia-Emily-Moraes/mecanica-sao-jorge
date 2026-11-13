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
