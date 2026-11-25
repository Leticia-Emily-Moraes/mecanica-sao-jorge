---
status: proposto   # 2026-11-19 proposto (F35, CARTOGRAFO); aguarda aceite da pessoa dona do produto antes da fatia (a)
date: 2026-11-19
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (aceite)]
consulted: []   # ORLA e VIGIA ainda não revisaram; ESPRESSO para a pendência B-1
informed: [REGENTE, BUSSOLA, ORLA, ESQUADRO, VIGIA, ESPRESSO, CRIVO, PERGAMINHO]
---

# Contratar serviço e hooks de Clientes e Veículos sobre `fetch`, com erro tipado e estado de tela discriminado

Histórico de status:

* 2026-11-19: proposto (F35, etapa do CARTOGRAFO). Pela regra da casa, a fatia (a) da F35 só começa depois do aceite.

Vínculos: F35 (critérios US-CLV-FRONT-01 a 13, 16 a 18, 20 a 23 e 25; tarefas 3, 11, 13 a 16 e 19). Contratos da API: ADR-011 (formato de erro), ADR-017 (página), ADR-019 (404), ADR-020 e ADR-026 (409 de CPF e email), ADR-021 (`ClienteRequest` único), ADR-023 (`erros[]` com `campo` e `chave`), ADR-024 (veículo pela rota do cliente, `PUT` total) e ADR-025 (`historicoOs` sempre presente). Do ADR-020 em diante, os ADRs estão em ramos fora da `main` (`docs/f04-cartografo-adrs`, `c7e9baa`). Navegação no ADR-029; busca no ADR-031. Fronteiras de lint da F40 em `apps/mobile/.eslintrc.js`.

## Contexto e problema

Verificado por leitura de código:

* Na `main`, `src/services/http-client.ts` tem `fetchAutenticado(caminho, token, init)`, que acrescenta `Authorization: Bearer` e lança `SessaoExpiradaError` no 401. Falha de rede (o `fetch` rejeita) não é tratada: sai como `TypeError` cru. `src/hooks/use-auth.tsx` expõe `tokenAtual` e `tratarSessaoExpirada()`, que apaga a sessão e marca `sessaoExpirada`. **Nenhuma tela chama `fetchAutenticado` hoje**: a premissa 11 da F35 está confirmada no código.
* `src/services/auth-service.ts` define `ErroDeRedeError` com mensagem padrão de login ("Falha de conexão ao autenticar."), e `use-login.ts` traduz erro em estado tipado (`'idle' | 'enviando' | 'erroRede' | 'erroCredencial'`) sem texto. É o padrão que este ADR estende.
* O lint da F40 já proíbe: `fetch` em tela e componente; tela importar `@/services/*`; hook importar componente, i18n ou tema; serviço importar React e usar `console`.
* Contrato da API no ramo `docs/f04-cartografo-adrs` (lido nos DTOs e no controller, não rodado nesta etapa):
  * `GET /api/v1/clientes?q&page&size` devolve `PaginaResponse` `{itens[{id, nome, telefone, email}], pagina, tamanho, totalItens, totalPaginas}`.
  * `GET /api/v1/clientes/{id}` devolve `{id, nome, cpf, telefone, email, endereco}`, com `null` nos ausentes.
  * `POST /api/v1/clientes` devolve 201 com o mesmo corpo do detalhe e `Location`. `PUT /api/v1/clientes/{id}` devolve 200 com o mesmo corpo.
  * `GET /api/v1/clientes/{clienteId}/veiculos` devolve **lista simples, não paginada**, de `{id, placa, marca, modelo}`.
  * `POST /api/v1/clientes/{clienteId}/veiculos` devolve 201, e `PUT /api/v1/veiculos/{id}` devolve 200, os dois com `{id, clienteId, placa, marca, modelo, ano, cor}`.
  * `GET /api/v1/veiculos/{id}` devolve `{id, clienteId, clienteNome, placa, marca, modelo, ano, cor, historicoOs[{id, status, valorTotal}]}`, com `historicoOs` sempre presente.
  * Erro: `{timestamp, status, erro, mensagem, path, erros[{campo, chave}]}`, com `erros` sempre presente. Em veículo, `chave` é `veiculo.form.*`, e o 409 de placa traz `erros[{campo: "placa", chave: "veiculo.form.placa.duplicada"}]`. Em cliente, `chave` vem `null` na validação, e o 409 de CPF ou email vem com `erros: []` e só a `mensagem` fixa ("CPF ja cadastrado", "Email ja cadastrado").

Três pontos ainda abertos: como a tela distingue 401, 404, falha de rede e erro de campo sem conhecer HTTP; como o hook evita que uma resposta atrasada sobrescreva a atual; e onde a lista paginada acumula páginas sem guardar dado pessoal além do que a tela mostra.

## Fatores de decisão

* S1. Nenhuma dependência nova no `package.json`.
* S2. As fronteiras de lint da F40 continuam passando sem exceção nova: tela sem serviço, hook sem i18n e componente, serviço sem React e sem `console`.
* S3. O tipo do erro distingue, sem olhar status HTTP na tela: sessão expirada, não encontrado, falha de conexão ou servidor, erro de campo e requisição cancelada (critérios 18, 21, 22 e 23).
* S4. Resposta atrasada nunca sobrescreve a atual (busca nova, troca de id, tela desmontada), verificável por teste com `fetch` simulado.
* S5. CPF e telefone ficam só na memória do hook da tela que os mostra. Nenhum estado global, nenhum cache entre telas, nenhum disco, nenhum `console` e nenhuma mensagem de erro com corpo, URL ou valor (política, seção 7; critério 16).
* S6. A resposta da API é conferida em tempo de execução antes de chegar à tela. Forma inesperada vira erro, nunca `undefined` renderizado.
* S7. Custo: um módulo de requisição, dois serviços, um hook base e um hook por tela, todos testáveis com `jest` e `fetch` simulado, como os testes atuais de `auth-service`.

## Opções consideradas

* A. Serviços sobre `fetchAutenticado` com erros tipados e guardas de tipo escritas à mão, e hooks por tela com estado em união discriminada e `AbortController`.
* B. Manter como está: cada tela chama `fetchAutenticado` e trata o `Response`.
* C. TanStack Query (`@tanstack/react-query`) para busca, cache, paginação e nova tentativa.
* D. Store global de clientes (Context ou Zustand) alimentado pelos serviços e lido por todas as telas.

## Resultado da decisão

Opção escolhida: "A", porque é a única que atende S1, S2 e S5 juntas. B falha em S2 (tela não pode importar serviço) e espalha o tratamento de 401. C falha em S1 e, com o cache padrão, mantém o detalhe com CPF em memória depois de a tela sair (S5), a menos que se desligue o cache, que é o motivo de usar a biblioteca. D falha em S5 por definição.

### D1. Arquivos e responsabilidade

Nomes de arquivo em inglês e kebab-case; identificadores de domínio em português, como `auth-service.ts`, `autenticar` e `RespostaLogin` já fazem. É o padrão do repositório; o guia da casa pede nomes em inglês, e a divergência fica registrada aqui.

| Arquivo | Responsabilidade |
|---|---|
| `src/services/api-errors.ts` | Classes de erro da D2. TypeScript puro |
| `src/services/api-request.ts` | `chamarApi`: chama `fetchAutenticado`, traduz status e falha de rede em erro tipado, lê o JSON e aplica a guarda de tipo |
| `src/services/clients-types.ts` e `vehicles-types.ts` | Tipos de entrada e saída, espelhando o JSON da API campo a campo |
| `src/services/clients-service.ts` | `listarClientes`, `obterCliente`, `criarCliente`, `atualizarCliente` e as guardas de tipo de cliente |
| `src/services/vehicles-service.ts` | `listarVeiculosDoCliente`, `obterVeiculo`, `criarVeiculo`, `atualizarVeiculo` e as guardas de tipo de veículo |
| `src/hooks/use-authenticated-request.ts` | Hook base: injeta o token, aciona `tratarSessaoExpirada` no 401 e entrega um `AbortSignal` por chamada |
| `src/hooks/use-client-list.ts` | Lista com busca e páginas acumuladas (busca no ADR-031) |
| `src/hooks/use-client-detail.ts` e `use-client-vehicles.ts` | Detalhe do cliente e lista de veículos dele, carregados em paralelo e com estados independentes |
| `src/hooks/use-client-form.ts` | Criar e editar cliente (modo pelo `clienteId` presente ou não) |
| `src/hooks/use-vehicle-detail.ts` e `use-vehicle-form.ts` | Detalhe com `historicoOs` e formulário de criar e editar veículo |
| `src/validators/cpf.ts`, `src/validators/placa.ts` | Funções puras de validação no app (formato e dígito do CPF; padrão antigo e Mercosul da placa) |
| `src/formatters/cpf-mask.ts` | Máscara de CPF e texto acessível, no formato que a D-C fechar (tarefa 4) |

`http-client.ts` continua como está. `auth-service.ts` também; trocar o `ErroDeRedeError` do login pelo erro da D2 fica como dívida registrada, para não mexer na F30 dentro da F35.

### D2. Erros tipados de `chamarApi`

| Situação | Erro lançado | Estado que o hook expõe |
|---|---|---|
| `fetch` rejeita sem `signal.aborted` | `FalhaDeConexaoError('semResposta')` | `erroConexao` |
| `fetch` rejeita com `signal.aborted` | `RequisicaoCanceladaError` | nenhum: o hook ignora |
| 401 | `SessaoExpiradaError` (já existe em `http-client.ts`) | nenhum: o hook base chama `tratarSessaoExpirada` (D5) |
| 404 | `RecursoNaoEncontradoError` | `naoEncontrado` |
| 400 ou 409 com `erros` lista | `ErroDeValidacaoError(status, campos)` | `errosDeCampo` no formulário |
| 400 sem `erros` lista | `FalhaDeConexaoError('respostaInesperada')` | `erroConexao` (é defeito do app, porque ele valida antes) |
| 403, 405, 415, 5xx e qualquer outro não 2xx | `FalhaDeConexaoError('servidor')` | `erroConexao` (critério 18 trata servidor e rede igual) |
| 2xx com JSON inválido ou fora da guarda de tipo | `FalhaDeConexaoError('respostaInesperada')` | `erroConexao` |

Regras:

* `campos` é `ReadonlyArray<{ campo: string; chave: string | null }>`, copiado de `erros[]` depois de conferir que cada item tem `campo` texto e `chave` texto ou `null`. Item fora disso é descartado.
* A `mensagem` do corpo de erro não é copiada para o erro, com uma exceção: a D3. Toda classe da D2 tem `message` fixa, sem status, URL, corpo nem valor. `name` é o nome da classe.
* `chamarApi` monta a URL só com `encodeURIComponent` nos parâmetros e nunca devolve nem guarda a URL.
* `Content-Type: application/json` em `POST` e `PUT`; o corpo é `JSON.stringify` do tipo de entrada, sem campo extra.

### D3. Erro de campo de cliente e de veículo

O app usa o `campo` para saber onde mostrar o erro e escolhe a chave i18n assim:

1. `chave` presente (veículo) é usada como está. As chaves `veiculo.form.*` da API entram no `strings.ts` com o mesmo nome, e chave desconhecida cai em `formulario.campo.invalido`.
2. `chave` `null` (validação de cliente) vira `cliente.form.<campo>.invalido`, com `<campo>` restrito a `nome`, `cpf`, `telefone`, `email` e `endereco`. Campo fora dessa lista vai para o erro geral do formulário.
3. 409 de cliente com `erros: []` é lido **só** em `clients-service.ts`, comparando a `mensagem` com as duas constantes conhecidas: `"CPF ja cadastrado"` vira `{campo: "cpf", chave: "cliente.form.cpf.duplicado"}` e `"Email ja cadastrado"` vira `{campo: "email", chave: "cliente.form.email.duplicado"}`. Outra mensagem vira erro geral de conflito.

O passo 3 é frágil: uma mudança de texto no backend quebra o mapeamento sem erro de compilação. Por isso há a pendência **B-1** para o ESPRESSO: fazer `CpfJaCadastradoException` e `EmailJaCadastradoException` devolverem `ErroCampo` com `campo` e `chave` fixos, como `PlacaJaCadastradaException` já faz. É uma mudança aditiva no corpo do 409, mas amplia o ADR-023, que hoje limita a chave à validação de veículo; por isso precisa de revisão do ADR-023 antes do aceite, ou de um ADR novo. Quando a B-1 entrar, o passo 3 sai do app e o passo 1 cobre os dois casos. Até lá, o teste do serviço fixa as duas mensagens.

O hook devolve `errosDeCampo: Partial<Record<Campo, string>>`, em que o valor é a chave i18n como texto. A tela traduz com `t`. O hook não importa i18n (S2).

### D4. Funções de serviço

Todas recebem `token: string` e `signal: AbortSignal` por último, como `fetchAutenticado` já recebe o token. Tipos com os mesmos nomes de campo do JSON; campo opcional da API é `string | null`, nunca `undefined`.

| Função | Endpoint | Devolve |
|---|---|---|
| `listarClientes({ q, page, size })` | `GET /clientes` | `Pagina<ClienteResumo>` com `itens`, `pagina`, `tamanho`, `totalItens`, `totalPaginas` |
| `obterCliente(id)` | `GET /clientes/{id}` | `ClienteDetalhe` |
| `criarCliente(dados)` | `POST /clientes` | `{ id }` (o corpo é descartado; o detalhe busca de novo, ADR-029 D2) |
| `atualizarCliente(id, dados)` | `PUT /clientes/{id}` | `{ id }` |
| `listarVeiculosDoCliente(clienteId)` | `GET /clientes/{clienteId}/veiculos` | `ReadonlyArray<VeiculoResumo>` |
| `obterVeiculo(id)` | `GET /veiculos/{id}` | `VeiculoDetalhe`, com `historicoOs: ReadonlyArray<HistoricoOsItem>` |
| `criarVeiculo(clienteId, dados)` | `POST /clientes/{clienteId}/veiculos` | `{ id }` |
| `atualizarVeiculo(id, dados)` | `PUT /veiculos/{id}` | `{ id }` |

Regras:

* `q` ausente quando o termo efetivo é vazio (ADR-031). `size` fixo em 20, o padrão da API.
* `dados` de cliente é `{ nome, cpf, telefone, email, endereco }` completo (o `PUT` é total, ADR-021). `cpf` e `telefone` vão só com dígitos; texto opcional vazio vai como `null`.
* `dados` de veículo é `{ placa, marca, modelo, ano, cor }` completo (`PUT` total, ADR-024). `ano` é número inteiro; `clienteId` nunca vai no corpo.
* `HistoricoOsItem` é `{ id, status, valorTotal }`, como a API devolve hoje. **Não há número nem data**, que o critério 12 pede; essa divergência é da BUSSOLA e da F06. `status` é texto livre na guarda de tipo, porque o enum completo da OS só fecha na Sprint 04. `valorTotal` chega como número JSON; a guarda aceita número e o formatador de moeda é da tela.

### D5. Hook base e sessão expirada

`useAuthenticatedRequest()` devolve `executar<T>(chamada: (token, signal) => Promise<T>): Promise<Resultado<T>>`, em que `Resultado<T>` é `{ ok: true; valor: T } | { ok: false; erro: ErroDeApi }` e `ErroDeApi` é a união das classes da D2 menos `SessaoExpiradaError`.

* Sem `tokenAtual`, não chama a API e trata como sessão expirada.
* `SessaoExpiradaError` nunca chega ao hook da tela: o hook base chama `tratarSessaoExpirada()` e devolve `{ ok: false, erro: RequisicaoCanceladaError }`, que a tela ignora. A guarda de `(menu)/_layout.tsx` leva ao login e desmonta Clientes (ADR-029, D6).
* Cada `executar` cria um `AbortController`. O hook base aborta todas as chamadas pendentes ao desmontar. O hook da tela aborta a anterior quando dispara uma nova do mesmo tipo (busca nova, outro id, nova tentativa).
* Nenhum `try/catch` de tela engole erro em silêncio: erro fora da D2 (defeito de código) vira `FalhaDeConexaoError('respostaInesperada')` e é visível como erro de conexão.

### D6. Estado de tela

Leitura (detalhe de cliente, lista de veículos do cliente e detalhe de veículo):

```ts
type EstadoCarga<T> =
  | { tipo: 'carregando' }
  | { tipo: 'erroConexao' }
  | { tipo: 'naoEncontrado' }
  | { tipo: 'sucesso'; dados: T; atualizando: boolean };
```

* `atualizando` é a recarga ao voltar ao foco (ADR-029, D4): os dados atuais continuam na tela. Se a recarga falhar, a tela mantém os dados e o hook expõe `falhaAoAtualizar: true`; a forma de avisar é do ESQUADRO.
* `tentarNovamente()` volta a `carregando` e repete a chamada.
* Na lista de veículos do cliente, "sem veículos" é `sucesso` com lista vazia; a tela escolhe o estado vazio (critério 20). Erro na lista de veículos não derruba o detalhe do cliente, e vice-versa. 404 na lista de veículos com o detalhe em sucesso é tratado como `erroConexao` da seção.
* No detalhe do veículo, `historicoOs` vazio é `sucesso` com lista vazia, o estado padrão até a F06 (critério 13). Não há chamada própria de histórico.

Lista de clientes:

```ts
type EstadoLista =
  | { tipo: 'carregando' }
  | { tipo: 'erroConexao' }
  | { tipo: 'vazio' }          // termo efetivo vazio e totalItens 0 (critério 3)
  | { tipo: 'semResultado' }   // termo efetivo presente e totalItens 0 (critério 19)
  | { tipo: 'sucesso'; itens: ReadonlyArray<ClienteResumo>; temMais: boolean;
      carregandoMais: boolean; falhaAoCarregarMais: boolean; atualizando: boolean };
```

* `carregarMais()` pede `pagina + 1` com o mesmo termo, só se `temMais` e nada estiver em voo. `temMais` é `pagina + 1 < totalPaginas`.
* Páginas acumulam em memória; item repetido pelo `id` (cliente criado entre duas páginas desloca o deslocamento) é descartado. Termo novo ou recarga zeram a lista e voltam à página 0.
* O gatilho de `carregarMais` (botão "Carregar mais", que a BUSSOLA adotou, ou rolagem infinita, recomendada na D10 da F26) é da tela. O contrato do hook é o mesmo nos dois, então a decisão da pessoa sobre a D10 não muda este ADR.
* O hook não expõe `totalItens` à tela: não há frame que o mostre.

Formulário (cliente e veículo):

```ts
type EstadoEnvio = 'idle' | 'enviando' | 'erroConexao' | 'erroValidacao' | 'naoEncontrado' | 'salvo';
```

* Os valores digitados ficam no estado do hook e não mudam em nenhum erro (critérios 18 e 22). `tentarNovamente()` reenvia os mesmos valores.
* A validação local (CPF com 11 dígitos e dígito verificador; placa no padrão antigo ou Mercosul; obrigatórios) roda antes de chamar a API e usa as mesmas chaves i18n do erro da API quando existem (`veiculo.form.placa.erro`). Com erro local, a API não é chamada (critério 8).
* Em edição, o hook carrega o registro pelo id com o `EstadoCarga` acima antes de mostrar o formulário. `temAlteracao` compara com os valores carregados; é a entrada da guarda do ADR-029, D3.
* `salvo` carrega o `id` devolvido, e a tela navega (ADR-029, D2).
* O CPF obrigatório segue a API atual (`@NotBlank`). A pendência P9 da política (CPF opcional) muda só a validação local e a guarda de tipo, não este contrato.

### D7. Dado pessoal: onde entra, circula e sai

| Dado | Entra | Circula | Sai | Nunca vai para |
|---|---|---|---|---|
| Nome, telefone, email (lista) | resposta do `GET /clientes` | estado de `useClientList` | tela da lista | log, disco, rota |
| Termo de busca | digitação | estado do hook e query string `q` (HTTPS fora do local) | API | log, disco, rota do app |
| CPF, telefone, email, endereço (detalhe) | resposta do `GET /clientes/{id}` | estado de `useClientDetail` | tela, com CPF mascarado | log, disco, rota, estado global |
| Os mesmos campos (formulário) | digitação ou `GET` da edição | estado de `useClientForm` | corpo do `POST`/`PUT` (HTTPS) | log, disco, rota, mensagem de erro |
| Placa, marca, modelo, ano, cor, `clienteNome` | resposta da API ou digitação | estado do hook de veículo | tela e corpo do `POST`/`PUT` | log, disco, rota |

Finalidade: identificação e contato do cliente para a prestação do serviço de mecânica. Base legal: execução de contrato (art. 7º, V, LGPD), a mesma do backend. Retenção no app: só a vida da tela; o estado sai com a desmontagem, inclusive no logout e no 401. O app não cria coleta nova. A placa é tratada como dado pessoal por associação ao dono.

```mermaid
sequenceDiagram
    participant Tela as Tela (detalhe do cliente)
    participant Hook as useClientDetail
    participant Base as useAuthenticatedRequest
    participant Svc as clients-service / api-request
    participant API as API /api/v1 (HTTPS)
    Tela->>Hook: monta com clienteId (só o id vem da rota)
    Hook->>Base: executar(obterCliente(id))
    Base->>Svc: obterCliente(id, token, signal)
    Svc->>API: GET /clientes/{id} com Bearer
    alt 200
        API-->>Svc: {id, nome, cpf, telefone, email, endereco}
        Svc->>Svc: guarda de tipo; forma inválida vira FalhaDeConexaoError
        Svc-->>Hook: ClienteDetalhe (só em memória)
        Hook-->>Tela: sucesso; CPF mascarado na tela
    else 401
        API-->>Svc: 401
        Svc-->>Base: SessaoExpiradaError
        Base->>Base: tratarSessaoExpirada(); guarda do (menu) desmonta Clientes
    else 404 ou rede ou 5xx
        Svc-->>Hook: RecursoNaoEncontradoError ou FalhaDeConexaoError (message fixa)
        Hook-->>Tela: naoEncontrado ou erroConexao
    end
```

### D8. Modelo de ameaça dos fluxos

| Ameaça (STRIDE) | Onde | Mitigação nesta decisão | Risco residual |
|---|---|---|---|
| Divulgação: CPF ou telefone em log | serviço, hook, erro | `no-console` no serviço (lint já existe); estende-se a `src/hooks`; `message` fixa em toda classe da D2; teste que espiona `console.*` em todo o fluxo (critério 16) | biblioteca de terceiro que logue props em modo de desenvolvimento; não observado |
| Divulgação: dado pessoal na URL do app | navegação | só id na rota (ADR-029, N2) | nenhum identificado |
| Divulgação: termo de busca na query string da API | `GET /clientes?q=` | HTTPS fora do local e app sem log de URL (achado A4 da política, aceito) | proxy ou provedor que registre a query string |
| Divulgação: dado em disco | app | nenhum `AsyncStorage` (não está instalado), nenhum cache de arquivo; `expo-secure-store` só com a sessão | captura do sistema na troca de app mostra a última tela; fora do escopo, para o VIGIA |
| Divulgação: tráfego sem TLS | `apiBaseUrl` | nenhuma nesta decisão; `env.ts` aceita qualquer URL | `http://` fora do ambiente local; pendência para VIGIA e ANCORA |
| Falsificação: token roubado | cabeçalho | token só no cabeçalho `Authorization`, nunca na URL; expira no backend | mesmo da F30 |
| Adulteração: resposta inesperada | `api-request` | guarda de tipo antes da tela; React Native renderiza texto, sem HTML | nenhum identificado |
| Integridade: resposta atrasada de outro cliente na tela | hooks | `AbortController` e descarte de resposta de chamada substituída (S4) | nenhum identificado |
| Elevação: deep link para `/clientes/{id}` sem sessão | navegação | guarda do `(menu)` e 401 da API | nenhum identificado |
| Elevação: qualquer usuário autenticado vê qualquer cliente | API | regra atual do projeto (sem diferença de perfil) | aceito pela pessoa |

### Consequências

* Bom, porque a tela só conhece estados com nome (`naoEncontrado`, `erroConexao`, `semResultado`) e nunca status HTTP, então os quatro estados de cada tela viram testes de hook simples.
* Bom, porque o 401 é tratado num lugar só, e a primeira tela autenticada (detalhe do cliente) já usa o mecanismo da F30 sem código repetido.
* Bom, porque nenhum dado de cliente sobrevive à tela que o mostra, o que cumpre a seção 7 da política sem regra extra.
* Bom, porque as próximas features de front (F36, F42, F43) reaproveitam `chamarApi`, o hook base e o `EstadoCarga`.
* Ruim, porque guardas de tipo escritas à mão são código a manter, e um campo novo na API exige mexer na guarda. Em troca, não entra biblioteca de validação.
* Ruim, porque sem cache cada volta ao foco faz uma chamada, e a lista volta à página 0.
* Ruim, porque o 409 de CPF e email depende do texto da `mensagem` até a B-1 entrar.
* Neutro, porque o erro de login continua com a classe própria da F30 até alguém migrá-lo.

### Risco residual

* Se o backend mudar o texto de "CPF ja cadastrado" ou "Email ja cadastrado" antes da B-1, o erro some do campo e vira erro geral de conflito. O teste do serviço não pega mudança do backend; só o teste de ponta a ponta contra a API real pega.
* Os contratos foram lidos no ramo `docs/f04-cartografo-adrs` (`c7e9baa`), não na `main` nem no `/v3/api-docs`. Quando as rotas entrarem na `main`, o contrato precisa ser conferido de novo contra o OpenAPI (handoff da BUSSOLA).
* `historicoOs` sem número nem data diverge do critério 12. O tipo segue a API; se a F06 acrescentar campos, a guarda de tipo e o tipo crescem juntos.
* Strings de dado pessoal continuam na memória do processo até o coletor de lixo do JavaScript. Não há como zerar string em JS; o risco é aceito.

### Confirmação

* Teste de `api-request` com `fetch` simulado: cada linha da tabela D2 produz o erro esperado, e `message` de cada erro não contém o corpo, a URL nem o status.
* Teste de `clients-service`: o 409 com cada uma das duas mensagens vira o erro de campo certo; outra mensagem vira conflito geral.
* Teste de guarda de tipo: corpo sem `historicoOs`, com `cpf` numérico ou com `itens` que não é lista vira `FalhaDeConexaoError('respostaInesperada')`.
* Teste de cada hook nos estados da D6, inclusive: troca de id durante a carga não mostra o cliente antigo; desmontar aborta; 401 chama `tratarSessaoExpirada` uma vez.
* Teste de log (critério 16): `jest.spyOn` em `console.log`, `info`, `warn`, `error` e `debug` durante lista, busca, detalhe, criar e editar com 200, 400, 401, 404, 409, 500 e falha de rede; nenhuma chamada contém o CPF nem o telefone da fixture, nem em claro nem só com dígitos.
* Lint: acrescentar `no-console: error` ao override de `src/hooks/**`; o restante já existe.
* Revisão de PR: `git grep -nE "AsyncStorage|localStorage|SecureStore" -- apps/mobile/src` só acha `session-storage.ts`; `git diff main -- apps/mobile/package.json` sem dependência nova.

## Prós e contras das opções

### A. Serviços com erro tipado e hooks com estado discriminado (escolhida)

* Bom, porque segue o padrão que `auth-service.ts` e `use-login.ts` já estabeleceram, com as fronteiras de lint da F40.
* Bom, porque nenhum estado vive além da tela, o que é a regra da política de dados.
* Neutro, porque paginação, cancelamento e recarga ao foco são escritos à mão, em um hook base e um hook de lista.
* Ruim, porque guardas de tipo e acumulação de páginas são código próprio a manter e testar.

### B. Manter como está (tela chama `fetchAutenticado`)

* Bom, porque é o menor número de arquivos.
* Ruim, porque o lint da F40 proíbe tela importando serviço (S2), cada tela trataria 401, 404 e rede do seu jeito, e o critério 25 falha.
* Custo de descartar: nenhum.

### C. TanStack Query

* Bom, porque traz cancelamento, nova tentativa, paginação (`useInfiniteQuery`) e recarga ao foco prontos e testados.
* Ruim, porque é dependência nova (S1), com versão a acompanhar. O cache por chave mantém o detalhe com CPF em memória depois de a tela sair, até o `gcTime` (5 minutos por padrão), o que contraria a seção 7 da política; desligar o cache tira o principal ganho.
* Ruim, porque o 401 central exige configurar o `QueryClient` com o `useAuth`, e o `QueryClient` precisa ser limpo no logout.
* Custo de descartar: escrever à mão cerca de três responsabilidades (cancelamento, páginas, recarga ao foco). Revisitar se F36, F42 e F43 começarem a repetir esse código.

### D. Store global de clientes

* Bom, porque evita o `GET` extra depois de criar ou editar.
* Ruim, porque guarda dado pessoal além da tela que o mostra (falha em S5) e exige invalidação manual a cada mutação.
* Custo de descartar: um `GET` a mais por navegação.

## Mais informações

* B-1 (ESPRESSO, depois de revisar o ADR-023): `erros[{campo, chave}]` no 409 de CPF e email. Chaves sugeridas: `cliente.form.cpf.duplicado` e `cliente.form.email.duplicado`.
* O formato exato do CPF mascarado e do texto acessível depende da D-C (pessoa, com VIGIA e ESQUADRO). O lugar da função (`src/formatters/cpf-mask.ts`) não depende.
* Se o ADR-015 for aceito, nada muda neste ADR: ele trata de `app/`, telas e estilo, não de serviço e hook.
* Revisitar a opção C quando a terceira feature de front repetir a acumulação de páginas ou a recarga ao foco.
