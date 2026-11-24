# Escudo do Login (84 × 96): origem e licença

Registro exigido pelo US-PAR-19 A e pela dúvida S-2 do PRD da F41. Autor: ESQUADRO, 17/11, sessão Figma `832c13c4-9343-493d-b0ff-0546cb9da51b`. Este arquivo separa **o que foi lido** do que **não está registrado**. Nada abaixo foi preenchido por suposição.

## 1. Origem: o que o arquivo do Figma mostra (lido hoje)

| Campo | Valor lido | Como li |
|---|---|---|
| Arquivo | `FPdB8RymAnN81pbKfizdzE` (arquivo de referência da operação, plano "Time Pessoal") | `whoami` e `use_figma` (leitura) |
| Nó no estado vazio do Login | `10:906`, instância "Component 1" dentro de `10:895`, 84 × 96, `x` 110, `y` 0 | `use_figma` |
| Componente principal | `10:9` "variant=1", **local ao arquivo** (`remote: false`, não vem de biblioteca publicada) | `mainComponent` |
| Descrição e links de documentação do componente | vazios | `description` e `documentationLinks` |
| Desenho | 6 camadas vetoriais: escudo branco com contorno petro, faixa vertical Crail, roda de leme com 8 raios e miolo petro; só as cores `#1E3A3F`, `#B5453D` e branco (paleta do projeto) | leitura anterior (`F41-valores-fpdb8.md` §20.4) |
| Reexportação de hoje | SVG de `10:906` com **932 bytes**, igual ao `escudo-login.svg` versionado | `exportAsync` |
| Hashes dos 4 arquivos versionados | batem com os registrados na §20.4 (conferidos hoje com `md5`) | `md5 -r` |

Autor do desenho, data de criação e fonte original: **não constam no arquivo**. A busca por "licen", "crédit", "autor", "direitos", "copyright", "©", "fonte:", "source", "escudo", "brasão" nos textos das 3 páginas (feita em 17/11, §20.4) não achou nada, e hoje a descrição e os links do componente continuam vazios. Não li o histórico de versões do Figma.

Inferência minha, **não é registro**: os nomes "div", "span", "Component 1" e "variant=N" indicam que o desenho entrou por importação de HTML. Isso não diz de onde o desenho veio antes.

## 2. Licença: sem registro

| Campo | Estado |
|---|---|
| Autor ou titular | **sem registro** |
| Licença ou termos de uso | **sem registro** |
| A marca é da Mecânica São Jorge e pode ser usada no app? | **sem resposta da pessoa** |
| Resposta literal da pessoa (S-2) | _(vazia: nenhuma resposta chegou ao ESQUADRO nesta sessão)_ |

Para o portão fechar, a pessoa responde por escrito uma das duas frases e quem a recebe cola o texto literal acima:

- "O escudo é da marca do projeto e pode ser usado no app." ou
- "O escudo veio de (fonte), sob a licença (nome da licença)."

Se a resposta for negativa, os 4 arquivos desta pasta saem com `git rm` e o Login fica sem escudo, com os frames do Figma ajustados na mesma entrega (premissa 2 da feature).

## 3. Uso permitido enquanto a licença está aberta

- Os arquivos desta pasta são **exportação técnica** do que já está no arquivo do Figma da pessoa. Não são um ativo liberado para o app.
- **Não copiar para `apps/mobile`** nem programar o escudo antes da resposta da S-2 (leitura do BUSSOLA no PRD v4.2; a decisão de programar antes ou depois é da pessoa e do REGENTE).
- Depois da resposta positiva, o ORLA usa os PNGs 1x, 2x e 3x (o app não tem `react-native-svg`). O escudo é decorativo: o título "MECÂNICA SÃO JORGE" logo abaixo já nomeia a marca, então fica fora da árvore de acessibilidade.

## 4. Medidas para o ORLA (lidas no Figma hoje)

Bloco da marca `10:905`, 304 × 160, dentro de `10:904` (304 × 174, margem de 14 abaixo):

| Elemento | Nó | x | y | Tamanho |
|---|---|---|---|---|
| Escudo | `10:906` | 110 (centralizado em 304) | 0 | 84 × 96 |
| Título "MECÂNICA SÃO JORGE" | `10:913` / `10:914` | 31,5 | 106 | 241 × 36, Barlow Condensed Bold 30 |
| Subtítulo "Gestão da oficina" | `10:918` / `10:919` | 98,28 | 152 | 107,44 × 8 (caixa), Inter Regular 13 |

Espaço escudo → título: 106 − 96 = **10**; título → subtítulo: 152 − 142 = **10**. O `BrandHeader` já usa `gap: spacing.s10`, então o escudo entra como primeiro filho do contêiner, sem outro espaçamento. O mesmo escudo aparece em `10:895`, L1 `82:1990` e L2 `82:2024` (`variant=1`) e em `10:936` (`variant=2`, SVG idêntico). L3 `82:2058` e L4 `82:2098` e `10:936` têm o bloco em y 126 em vez de 167 (valor lido). Minha inferência, não medida: o conteúdo fica mais alto por causa da caixa de aviso e é centralizado na vertical; o ORLA deve conferir se o `ScreenContainer centered` reproduz isso com o escudo presente.
