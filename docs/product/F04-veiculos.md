# PRD — F04: Veículos (somente API e contrato)

- Prioridade: P1
- Área: **Backend** (o card diz Full-stack; as telas ficam na F35, premissa 8)
- Sprint: Sprint 02: Clientes e Veículos
- Autora: BUSSOLA (Product Owner)
- Data: 2026-11-18 (revisão 2, após a revisão humana de 18/11, 20:33)
- Etapa da rota: **BUSSOLA (1/6)** → VIGIA → CARTOGRAFO → ESPRESSO → PERGAMINHO → CRIVO
- Depende de: F00, F02, F08 (detalhe de cliente), F09 (criar cliente). Bloqueia: F06, F18 e F35.
- Estado: **PRD ajustado pela revisão.** Os critérios novos (N1 a N4, seção 6) **ainda não têm código nem teste**. Decisões abertas na seção 8.

> **Como ler.** Separo o que li do que suponho. Esta etapa é documento: **não rodei código nem teste.** Li, na branch `feat/f03d-clientes-editar` (que contém os commits da F04 até `7250be2`): `VeiculoRequest`, `VeiculoService`, `VeiculoMapper`, `GlobalExceptionHandler`, `ClienteMapper`, os nomes dos testes de `VeiculoIT`, `docs/api/veiculos.md`, `docs/product/F35-recebido-da-F04-veiculos.md`, a política de dados do cliente e o `overview.md`. "O código hoje faz X" vem dessa leitura. O comportamento em execução (por exemplo `2015.9` devolver 201) vem do relato da revisão humana e **eu não reproduzi**.

Legenda dos cenários: **[novo]** nasce da revisão de 18/11; **[ajustado]** mudou de texto; **[proposto]** foi acrescentado por mim (não veio do card nem da revisão) e pode ser cortado; sem marca = veio do card.

## 1. Visão

Quem atende no balcão precisa cadastrar o carro do cliente uma vez, corrigi-lo sem recriar o registro e, mais tarde, abrir a OS com o veículo certo. Esta feature entrega a **API de veículos e o contrato** (OpenAPI e chaves i18n) para a F35 montar as telas. Não há tela aqui.

Prioridade pelo valor para quem usa:

1. **Cadastrar e achar o carro do cliente sem duplicar** (US-VEI-01, US-VEI-04): sem isso a OS (F06) não abre.
2. **Corrigir o cadastro sem trocar o dono** (US-VEI-02).
3. **Detalhe com histórico de OS** (US-VEI-03): o histórico só ganha conteúdo na Sprint 04.
4. **Placa protegida em log e erro por chave e campo** (US-VEI-05): requisito de LGPD e de tradução, não acabamento.

## 2. Escopo

### Dentro
- Veículo com placa, marca, modelo, ano e cor opcional, vinculado a um cliente existente.
- `POST /api/v1/clientes/{clienteId}/veiculos`, `GET /api/v1/clientes/{id}/veiculos`, `GET /api/v1/veiculos/{id}`, `PUT /api/v1/veiculos/{id}`.
- Placa normalizada (maiúscula, sem hífen nem espaço) antes de validar e de checar unicidade; padrão antigo (`ABC1234`) e Mercosul (`ABC1D23`); índice único no banco, violação em 409.
- `marca` e `modelo` gravados sem espaços nas pontas (N1).
- `ano` aceito **só como inteiro JSON**, de 1900 até o ano corrente + 1 (N2).
- Erro de validação de campo com `campo` e `chave` `veiculo.form.*`, sem texto fixo e sem repetir o valor enviado.
- Placa mascarada (`****D23`) em todo log.
- Contrato OpenAPI e chaves i18n publicados para a F35.

### Fora (explícito)
- Telas, estados de vazio, carregamento, erro, teclado e leitor de tela: **F35**.
- Lista própria de veículos, busca por placa (F06), excluir ou inativar, troca de dono, quilometragem, histórico de manutenção como módulo, lógica de OS, diferença de permissão entre ADMIN e FUNCIONARIO.
- Mudar o `ObjectMapper` global ou o contrato do Cliente.
- Erros de rota (400 de parâmetro, 404, 405, 415) virarem chave: seguem texto fixo com `erros[]` vazio. Viram chave se a F35 pedir (N4).

## 3. Glossário

| Termo | Significado aqui |
|---|---|
| Placa normalizada | 7 caracteres ASCII maiúsculos, sem hífen e sem espaço (`ABC1D23`) |
| Padrão antigo | 3 letras + 4 números (`ABC1234`) |
| Padrão Mercosul | 3 letras + 1 número + 1 letra + 2 números (`ABC1D23`) |
| Chave i18n | Identificador de mensagem `veiculo.<componente>.<texto>`; a API devolve a chave, o texto em português é da F35 |
| `erros[]` | Lista do corpo de erro com um item `{campo, chave}` por campo inválido; sempre presente, vazia quando o erro não é de campo |
| PUT total | A edição substitui todos os campos editáveis; campo opcional ausente fica vazio (ADR-024) |
| `historicoOs` | Lista de OS do veículo no detalhe; item `{id, status, valorTotal}`; vazia até a Sprint 04 (ADR-025) |
| Dono | Cliente ao qual o veículo pertence; definido na criação, imutável |

## 4. Histórias e fatiamento

- **US-VEI-01.** Como **atendente da oficina**, quero cadastrar o veículo de um cliente, para abrir a OS já com o carro identificado.
- **US-VEI-02.** Como **atendente**, quero corrigir os dados de um veículo, para manter o cadastro certo sem recriar o registro.
- **US-VEI-03.** Como **atendente**, quero abrir o detalhe do veículo, para ver os dados e o histórico de OS dele.
- **US-VEI-04.** Como **atendente**, quero ver os veículos de um cliente, para escolher o carro certo no balcão.
- **US-VEI-05.** Como **responsável pela oficina**, quero a placa protegida nos logs e os erros por chave e campo, para cumprir a LGPD e deixar o app traduzível e acessível.

### Proposta de fatiamento (pedido do comandante)

**Medi o tamanho real** com `git diff --shortstat f119c67 7250be2`: os commits da F04 somam 40 arquivos e 3.309 linhas inseridas (939 em `apps/api/src/main` em 23 arquivos, 1.736 em teste, o resto em documentação e migration). Isso **passa de um PR revisável**. Como o código já existe, a economia do fatiamento está na revisão, não na escrita.

Recomendo **3 PRs empilhados, sem card novo** (o card F04 continua único; PRUMO confirma o quadro):

| PR | Conteúdo | Histórias | Observação |
|---|---|---|---|
| **F04-a: base e criar** | V7 (índice único e `CHECK` da placa), `Veiculo`, `PlacaVeiculo`, `VeiculoRepository`, `MascaraDadoPessoal.placa`, `erros[]` no handler, `POST` e `GET` da lista do cliente | US-VEI-01, 04, 05 | Única fatia que mexe em código compartilhado (handler e `ErrorResponse`, usados também pelo Cliente). Revisão mais cuidadosa |
| **F04-b: editar** | `PUT /veiculos/{id}`, `atualizar` no mapper, unicidade excluindo o próprio id, PUT total, dono imutável | US-VEI-02 | Depende de F04-a |
| **F04-c: detalhe** | `GET /veiculos/{id}`, `VeiculoDetalheResponse`, `HistoricoOsItem` | US-VEI-03 | Depende de F04-a. Menor das três |

A lista do cliente (US-VEI-04) vai no F04-a porque a F35 precisa dela já no fluxo de criação. Alternativa: um PR só, com commits na ordem a, b, c e revisão por commit; o custo é um diff de 3 mil linhas. Decisão em D6.

## 5. Critérios de aceitação (Gherkin)

Cada cenário vira teste de integração (`VeiculoIT`) sem tradução. Os números C1 a C26 seguem a ordem do card; as letras (C7a etc.) são cenários acrescentados.

### US-VEI-01: cadastrar veículo (fatia F04-a)

**C1. Criação com placa no padrão antigo**
```gherkin
Dado um cliente existente
E placa "ABC1234", marca, modelo, ano e cor válidos
Quando envio POST /api/v1/clientes/{clienteId}/veiculos
Então recebo HTTP 201 com o cabeçalho Location /api/v1/veiculos/{id}
E o corpo traz clienteId igual ao do caminho e placa "ABC1234"
```

**C2. Criação com placa Mercosul**
```gherkin
Dado um cliente existente
E placa "ABC1D23", marca, modelo, ano e cor válidos
Quando envio POST /api/v1/clientes/{clienteId}/veiculos
Então recebo HTTP 201 com o veículo vinculado ao cliente e a placa "ABC1D23" no corpo
```

**C3. Normalização da placa**
```gherkin
Esquema do Cenário: placa digitada com máscara, minúscula ou espaço
  Dado a placa digitada como "<digitada>"
  Quando envio o cadastro
  Então o veículo é gravado com a placa "ABC1D23"
  E a validação e a unicidade usam o valor normalizado
  Exemplos:
    | digitada    |
    | abc-1d23    |
    | " ABC1D23 " |
```

**C4. Placa em formato inválido**
```gherkin
Esquema do Cenário: placa fora dos dois padrões
  Dado a placa "<placa>"
  Quando envio o cadastro
  Então recebo HTTP 400
  E erros[] traz {campo: "placa", chave: "veiculo.form.placa.erro"}
  E nenhum veículo é gravado
  Exemplos:
    | placa   |
    | AB12345 |
    | ABCD123 |
    | ABC12D3 |
```

**C5. Placa em branco ou ausente**
```gherkin
Dado placa vazia, só com espaços ou ausente do corpo
Quando envio o cadastro
Então recebo HTTP 400
E erros[] traz {campo: "placa", chave: "veiculo.form.placa.obrigatoria"}
E nenhum veículo é gravado
```

**C6. Placa duplicada**
```gherkin
Dado um veículo já cadastrado com a placa "ABC1D23"
Quando cadastro outro veículo com "abc1d23"
Então recebo HTTP 409
E erros[] traz {campo: "placa", chave: "veiculo.form.placa.duplicada"}
E a mensagem não contém a placa nem "ABC1D23"
E não é criado um segundo registro
```

**C7. Campo obrigatório ausente**
```gherkin
Dado marca, modelo ou ano em branco ou ausente
Quando envio o cadastro
Então recebo HTTP 400 com um item em erros[] por campo inválido, ordenados por campo
E cada item usa a chave veiculo.form.<campo>.obrigatoria ou veiculo.form.<campo>.obrigatorio
E nenhum veículo é gravado
```

**C7a. Marca e modelo com espaços nas pontas são gravados aparados** [novo, N1]
```gherkin
Esquema do Cenário: marca e modelo aparados
  Dado marca "<marcaEnviada>" e modelo "<modeloEnviado>" e os demais campos válidos
  Quando envio o cadastro
  Então recebo HTTP 201
  E o corpo e o banco trazem marca "<marcaGravada>" e modelo "<modeloGravado>"
  Exemplos:
    | marcaEnviada | modeloEnviado | marcaGravada | modeloGravado |
    | " Fiat "     | " Uno "       | Fiat         | Uno           |
    | Fiat         | Uno           | Fiat         | Uno           |
```

**C7b. Marca ou modelo só com espaços** [novo, N1]
```gherkin
Dado marca "   " ou modelo "   "
Quando envio o cadastro
Então recebo HTTP 400 com {campo: "marca", chave: "veiculo.form.marca.obrigatoria"} ou o equivalente de modelo
E nenhum veículo é gravado
```

**C7c. O limite de tamanho conta depois de aparar** [proposto, N1]
```gherkin
Dado uma marca de 100 caracteres com um espaço em cada ponta
Quando envio o cadastro
Então recebo HTTP 201 e a marca é gravada com 100 caracteres
E uma marca de 101 caracteres sem espaço nas pontas recebe HTTP 400 com a chave veiculo.form.marca.tamanho
```

**C8. Ano fora da faixa** [ajustado]
```gherkin
Dado o ano 1899 ou o ano corrente + 2
Quando envio o cadastro
Então recebo HTTP 400
E erros[] traz {campo: "ano", chave: "veiculo.form.ano.faixa"}
E nenhum veículo é gravado
```

**C8a. Limites da faixa são aceitos**
```gherkin
Dado o ano 1900 e, em outro envio, o ano corrente + 1
Quando envio o cadastro de cada um
Então recebo HTTP 201 nos dois
```

**C8b. Virada do ano (teste existente, mantido)**
```gherkin
Dado o relógio da aplicação fixado em 31/12 do ano X
Quando envio o cadastro com ano X+1
Então recebo HTTP 201
E com ano X+2 recebo HTTP 400 com veiculo.form.ano.faixa

Dado o relógio da aplicação fixado em 01/01 do ano X+1
Quando envio o cadastro com ano X+2
Então recebo HTTP 201
```
> A redação é a regra, não a cópia do teste: **li só o nome do teste da virada (commit `7250be2`), não o corpo.** ESPRESSO confere a redação contra o teste e o mantém passando.

**C8c. Ano decimal** [novo, N2]
```gherkin
Dado o corpo com "ano": 2015.9 (número com parte decimal)
Quando envio o cadastro
Então recebo HTTP 400
E erros[] traz {campo: "ano", chave: "veiculo.form.ano.tipo"}
E nenhum veículo é gravado
E o corpo da resposta não repete "2015.9"
```

**C8d. Ano em texto** [novo, N2]
```gherkin
Dado o corpo com "ano": "2015" (texto entre aspas)
Quando envio o cadastro
Então recebo HTTP 400
E erros[] traz {campo: "ano", chave: "veiculo.form.ano.tipo"}
E nenhum veículo é gravado
```

**C8e. Ano com zero decimal** [proposto, N2, decisão em D2]
```gherkin
Dado o corpo com "ano": 2015.0
Quando envio o cadastro
Então recebo HTTP 400 com {campo: "ano", chave: "veiculo.form.ano.tipo"}
```
> Padrão adotado: **rejeitar**, porque "inteiro JSON" é a regra da revisão e `2015.0` não é inteiro JSON.

**C9. Cliente inexistente**
```gherkin
Dado um clienteId que não existe
Quando envio POST /api/v1/clientes/{clienteId}/veiculos com corpo válido
Então recebo HTTP 404 com a mensagem fixa de cliente não encontrado
E nada é gravado
```

**C10. Cadastros simultâneos com a mesma placa**
```gherkin
Dado cadastros enviados ao mesmo tempo com a placa "ABC1D23"
Quando todos são processados
Então exatamente um recebe HTTP 201 e os demais HTTP 409
E existe um único veículo com essa placa
```
> O card diz dois cadastros; o teste existente (pelo nome) usa dez, que é mais forte. Mantenho a regra sem fixar o número.

**C11. Sem autenticação**
```gherkin
Esquema do Cenário: rota sem token válido
  Dado uma requisição sem token ou com token malformado
  Quando chamo "<rota>"
  Então recebo HTTP 401
  E nada é lido nem gravado
  Exemplos:
    | rota                                       |
    | POST /api/v1/clientes/{clienteId}/veiculos |
    | GET /api/v1/clientes/{id}/veiculos         |
    | GET /api/v1/veiculos/{id}                  |
    | PUT /api/v1/veiculos/{id}                  |
```

**C11a. O dono vem do caminho, não do corpo** [proposto]
```gherkin
Dado dois clientes, A e B
Quando envio POST /api/v1/clientes/{A}/veiculos com "clienteId": B e "id": 999 no corpo
Então recebo HTTP 201 com clienteId igual a A
E o id gerado não é 999
```

### US-VEI-02: corrigir veículo (fatia F04-b)

**C12. Edição com sucesso**
```gherkin
Dado um veículo cadastrado
Quando envio PUT /api/v1/veiculos/{id} alterando marca, modelo, ano e cor
Então recebo HTTP 200 com os dados atualizados
```

**C13. Troca de placa entre formatos**
```gherkin
Dado um veículo com placa "ABC1234"
Quando altero a placa para "ABC1D23"
Então recebo HTTP 200 e a placa gravada é "ABC1D23"
E o inverso, de "ABC1D23" para "ABC1234", também recebe HTTP 200
```

**C14. Edição mantendo a própria placa**
```gherkin
Dado um veículo com placa "ABC1D23"
Quando envio a edição com a mesma placa e outro modelo
Então recebo HTTP 200
E não há conflito de unicidade do veículo consigo mesmo
```

**C15. Placa já usada por outro veículo**
```gherkin
Dado dois veículos, o primeiro com "ABC1234" e o segundo com "ABC1D23"
Quando altero a placa do primeiro para "ABC1D23"
Então recebo HTTP 409 com {campo: "placa", chave: "veiculo.form.placa.duplicada"}
E o primeiro continua com "ABC1234"
```

**C16. Edição com dados inválidos**
```gherkin
Dado placa inválida, ou marca, modelo ou ano em branco
Quando envio a edição
Então recebo HTTP 400 com um item de erros[] por campo
E o registro permanece inalterado
```

**C16a. Edição aparada e com ano estrito** [novo, N1 e N2]
```gherkin
Dado um veículo cadastrado
Quando envio PUT com marca " Fiat " e modelo " Palio "
Então recebo HTTP 200 com marca "Fiat" e modelo "Palio"

Dado um veículo cadastrado
Quando envio PUT com "ano": 2015.9, e em outro envio com "ano": "2015"
Então recebo HTTP 400 com {campo: "ano", chave: "veiculo.form.ano.tipo"} nos dois
E o registro permanece inalterado
```

**C17. Tentativa de trocar o dono** [ajustado: o caso "PUT sem cor" saiu daqui; atendido segundo a revisão]
```gherkin
Dado um veículo do cliente A
Quando envio PUT /api/v1/veiculos/{id} com "clienteId": B no corpo
Então recebo HTTP 200
E o clienteId do corpo é ignorado
E a resposta e a consulta seguinte mostram o veículo ainda vinculado ao cliente A
```

**C17a. PUT sem o campo cor limpa a cor** [novo, ADR-024, PUT total]
```gherkin
Dado um veículo com cor "Prata"
Quando envio PUT /api/v1/veiculos/{id} sem o campo cor, com os demais campos válidos
Então recebo HTTP 200
E a cor do veículo fica vazia (null) na resposta e no banco
```
> Cobrir com teste de integração. Pela leitura do `VeiculoMapper.atualizar`, o MapStruct copia `null` sobre a entidade, então o comportamento **provavelmente já atende**; falta o teste. Não rodei para confirmar.

**C17b. PUT com cor em branco limpa a cor** [proposto]
```gherkin
Dado um veículo com cor "Prata"
Quando envio PUT com "cor": "   "
Então recebo HTTP 200 e a cor fica vazia
```

**C18. Veículo inexistente na edição**
```gherkin
Dado um id de veículo que não existe
Quando envio PUT /api/v1/veiculos/{id} com corpo válido
Então recebo HTTP 404 com a mensagem fixa de veículo não encontrado
```

### US-VEI-03: detalhe (fatia F04-c)

**C19. Detalhe com histórico de OS vazio**
```gherkin
Dado um veículo cadastrado e sem Ordens de Serviço
Quando envio GET /api/v1/veiculos/{id}
Então recebo HTTP 200 com id, clienteId, clienteNome, placa, marca, modelo, ano e cor
E "historicoOs" é uma lista vazia []
E "historicoOs" nunca vem nulo nem ausente
```

**C19a. O que o detalhe devolve como histórico antes da Sprint 04** (pedido do comandante) [proposto]
```gherkin
Dado qualquer veículo, antes da feature de Ordens de Serviço existir
Quando envio GET /api/v1/veiculos/{id}
Então "historicoOs" é [] em todos os casos
E a API não consulta a tabela ordens_servico
E a lista não traz item de exemplo nem dado inventado
E o tipo do item já está fixado como {id, status, valorTotal} (ADR-025)
```
> O item é só contrato. Quem preenche a lista é a F06/F18, sem mudar o formato. Se a F18 precisar de outro formato de item, é mudança de contrato e volta ao PO. A F35 mostra o estado vazio a partir do `[]`.

**C19b. O detalhe expõe do dono só o necessário** [proposto]
```gherkin
Dado um veículo de um cliente com nome, CPF, telefone, email e endereço
Quando envio GET /api/v1/veiculos/{id}
Então o corpo traz clienteId e clienteNome
E não traz CPF, telefone, email nem endereço do cliente
```

**C20. Detalhe de veículo inexistente**
```gherkin
Dado um id de veículo que não existe
Quando envio GET /api/v1/veiculos/{id}
Então recebo HTTP 404 com a mensagem fixa de veículo não encontrado
```

**C20a. Id inválido na rota** [proposto, a confirmar contra o código]
```gherkin
Dado o id "abc" ou "0" na rota
Quando envio GET /api/v1/veiculos/{id}
Então recebo HTTP 400 com mensagem fixa citando só o nome do parâmetro, sem o valor
E erros[] vem vazio
```
> Segue o padrão do detalhe de cliente (F08). **Não verifiquei** se `VeiculoController` valida o id; ESPRESSO confere e, se não valida, decide entre manter ou cortar este cenário.

### US-VEI-04: veículos do cliente (fatia F04-a)

**C21. Veículos do cliente**
```gherkin
Dado um cliente com dois ou mais veículos
Quando envio GET /api/v1/clientes/{id}/veiculos
Então recebo HTTP 200 com id, placa, marca e modelo de cada um
E a lista vem ordenada por placa, sem paginação
```

**C22. Cliente sem veículos**
```gherkin
Dado um cliente sem veículos
Quando envio GET /api/v1/clientes/{id}/veiculos
Então recebo HTTP 200 com lista vazia []
```

**C23. Cliente inexistente na lista**
```gherkin
Dado um id de cliente que não existe
Quando envio GET /api/v1/clientes/{id}/veiculos
Então recebo HTTP 404 com a mensagem fixa de cliente não encontrado
```

**C23a. A lista traz só os veículos do cliente do caminho** [proposto]
```gherkin
Dado dois clientes, cada um com veículos
Quando envio GET /api/v1/clientes/{A}/veiculos
Então a lista não contém nenhum veículo do cliente B
```

### US-VEI-05: log e erro (fatia F04-a)

**C24. Mascaramento da placa em log**
```gherkin
Dado a placa "ABC1D23"
Quando o sistema registra log de criação, edição, consulta ou erro 409
Então o log contém "****D23"
E nenhum log contém "ABC1D23"
E nenhum log contém marca, modelo, ano, cor ou nome do dono
```

**C25. Mensagem de validação de campo por chave i18n** [ajustado: restrito ao 400 de validação de campo]
```gherkin
Dado qualquer erro de validação de campo do corpo de criação ou edição de veículo
Quando a API responde HTTP 400
Então cada item de erros[] traz {campo, chave} com chave no formato veiculo.form.<campo>.<texto>
E nenhuma mensagem de campo é texto fixo escrito no código
E o valor enviado não aparece no corpo da resposta
```

**C25a. O 409 de placa usa chave** (já atendido segundo a revisão)
```gherkin
Dado uma placa já cadastrada
Quando a API responde HTTP 409
Então erros[] traz {campo: "placa", chave: "veiculo.form.placa.duplicada"}
```

**C25b. Erros de rota seguem texto fixo** [novo, N4]
```gherkin
Esquema do Cenário: erro que não é de campo do corpo
  Dado "<situação>"
  Quando chamo uma rota de veículo
  Então recebo HTTP <status> com mensagem de texto fixo
  E erros[] vem presente e vazio
  Exemplos:
    | situação                       | status |
    | id de rota inválido            | 400    |
    | corpo JSON malformado          | 400    |
    | veículo ou cliente inexistente | 404    |
    | método não permitido na rota   | 405    |
    | Content-Type diferente de JSON | 415    |
```
> Esses erros **não** viram chave nesta entrega. O OpenAPI e o `F35-recebido-da-F04-veiculos.md` passam a dizer: "viram chave se a F35 pedir".

**C26. Vários campos inválidos, um erro por campo**
```gherkin
Dado uma criação ou edição com placa inválida, marca em branco e ano 1899
Quando a API responde HTTP 400
Então erros[] traz três itens, ordenados por campo (ano, marca, placa)
E cada item traz o nome do campo e a chave
E nenhum item repete o valor enviado
```

### Acessibilidade e estados de erro na API
- Todo erro sai no formato `timestamp, status, erro, mensagem, path, erros[]`. A F35 anuncia o erro por campo a partir de `campo` e `chave`, não de `mensagem`. Os critérios de tela (`aria-live`, foco no primeiro campo inválido, rótulo, contraste, teclado) estão na lista da seção 7.
- Resposta com `Cache-Control: no-store` nas quatro rotas (já consta no contrato registrado para a F35).

## 6. O que mudou na revisão de 18/11 e como resolvi

| Critério | Ponto da revisão | Resolução no PRD | Código |
|---|---|---|---|
| 7 | marca e modelo com espaços (`' Fiat '`) | Cenários C7a, C7b, C7c, C16a (N1). **Local ao veículo.** Li o `ClienteMapper`: ele já aplica `strip` em nome e endereço (qualifier `aparado`), então o Cliente não muda e **não há dívida a registrar nem dono de contrato a avisar**. O `VeiculoRequest` hoje só converte branco em `null` e não apara (lido, não executado). Padrão sugerido: o mesmo do Cliente | **Pendente (ESPRESSO)** |
| 8 | ano `2015.9` e `"2015"` retornam 201 | Cenários C8c, C8d, C8e, C16a (N2). A coerção estrita fica só no campo `ano` de `VeiculoRequest`, **sem mudar o `ObjectMapper` global**. Que isso é possível por propriedade eu **suponho**, não provei; a escolha é do ESPRESSO e do CARTOGRAFO (D3). Teste da virada do ano mantido (C8b) | **Pendente (ESPRESSO)** |
| 17 | PUT sem cor saiu do critério | C17 ficou só com o dono. Cenário próprio C17a (PUT total, ADR-024) e C17b (N3) | **Pendente: só teste de integração (ESPRESSO)** |
| 25 | restringir a 400 de campo | C25 restrito a `veiculo.form.*` no 400 de validação de campo; C25a (409); C25b (erros de rota, texto fixo, `erros[]` vazio) (N4) | Contrato e teste; o handler já se comporta assim pela leitura, **a confirmar** |

### Efeito escondido do ponto 8, que exige decisão (D3)
Hoje o `GlobalExceptionHandler.handleUnreadableBody` responde **qualquer** corpo ilegível com mensagem fixa e `erros[]` **vazio**. A revisão pede `erros[]` com `{campo: "ano", chave}` para `2015.9` e `"2015"`. Há conflito direto: se a rejeição vier da desserialização (Jackson), o erro cai no handler de corpo ilegível e **não** traz o campo. Para cumprir C8c e C8d há duas saídas:

- **Opção A (recomendada):** o handler lê o **nome do campo** do caminho do erro de desserialização (nunca o valor) e, só para `VeiculoRequest`, emite `{campo, chave: "veiculo.form.<campo>.tipo"}`. Custo: lógica nova no handler compartilhado com o Cliente. Ganho: contrato uniforme dentro de `erros[]`.
- **Opção B:** receber `ano` num tipo que não falhe na leitura e validar o tipo no Bean Validation. Custo: o DTO perde o `Integer` e o OpenAPI piora.

Chave nova proposta: `veiculo.form.ano.tipo`. **Não existe hoje** (`VeiculoChaves` tem `ano.obrigatorio` e `ano.faixa`). Reusar `ano.faixa` evita chave nova, mas o texto "ano fora da faixa" para `"2015"` engana o atendente; não recomendo.

## 7. Pendências com dono (observação geral da revisão)

| Pendência | Dono | O que falta | Bloqueia |
|---|---|---|---|
| Tarefa 10: critérios de tela de Veículos na F35 | **Dono da F35** | Conferir a lista abaixo. **Eu não consegui conferir**: o card da F35 não está no repositório, só o registro `F35-recebido-da-F04-veiculos.md` | F35 |
| Aceite do risco P8/V7 (o 409 confirma que a placa existe no sistema) | **Pessoa responsável pela oficina**, por escrito, com nome | Registrar quem aceita. **Não escrevi aceite no nome de ninguém** | Deploy |
| Antes de qualquer deploy: contar placas duplicadas e testar a V7 em cópia de dados reais | **Responsável pelo banco, com ANCORA** | A V7 cria índice único: se existir placa repetida, ela **falha**. Rodar `SELECT placa, COUNT(*) FROM veiculos GROUP BY placa HAVING COUNT(*) > 1` na cópia antes | Deploy |
| Rebase sobre a F03c antes de abrir o PR | **ESPRESSO** | A `feat/f04-veiculos` termina em `7250be2`, que é ancestral da `feat/f03d-clientes-editar` (conferi com `git merge-base --is-ancestor`). **Não verifiquei** se a F04 já está sobre a F03c na própria branch | Abrir PR |
| Descarte `ANON<id>` sem código | **Pessoa responsável** decide | Ver D4 | Decisão |
| ADR-022 a 025: aceite formal e gravação no repositório | **CARTOGRAFO** grava, **pessoa responsável** aceita | **Os quatro arquivos não existem em nenhuma branch** (`git log --all` sobre `ADR-022*` a `ADR-025*` não achou nada), embora código, testes e `docs/api/veiculos.md` os citem. O `overview.md` já registra a lacuna e reserva os números | PR da F04 |
| P13, P14, P15 sem dono | **Pessoa responsável nomeia** | Ver D5 | Anonimização (P2) |

### Lista para o dono da F35 (tarefa 10)
Critérios de tela de Veículos que precisam estar escritos no card da F35:
1. Estado **vazio** da lista de veículos do cliente (`[]` do C22) e do histórico de OS (`[]` do C19).
2. Estado **carregando** nas duas listas e no detalhe.
3. Estado de **erro de rede e de servidor** com ação "tentar de novo".
4. **Erro por campo**: associar cada item de `erros[]` ao campo pelo `campo`, mostrar o texto da `chave` (nunca o `mensagem`), anunciar com `aria-live` e levar o foco ao primeiro campo inválido.
5. **409 de placa**: mensagem ligada ao campo placa, sem repetir a placa.
6. **Campo de placa**: aceitar `abc-1d23` (a API normaliza), teclado adequado, rótulo acessível.
7. **Teclado e leitor de tela**: ordem de foco, rótulo e papel em todos os controles, foco visível, contraste AA, erro que não dependa só de cor.
8. **Textos em português por chave** (`veiculo.form.*`, incluindo `veiculo.form.ano.tipo` se D3 for aceita).
9. **Dono imutável** na edição: o cliente não aparece como campo editável.
10. **Paridade com o frame do Figma (F26)** e os quatro estados nos dois lados.

## 8. Premissas e dúvidas em aberto

### Premissas
1. A F04 depende de F09 (cadastro de cliente) e F08 (detalhe de cliente). A lista de veículos do cliente vem do endpoint próprio, não do detalhe do cliente.
2. Veículo pertence a exatamente um cliente, definido na criação; trocar o dono está fora do escopo e proibido pela política.
3. ADMIN e FUNCIONARIO têm o mesmo acesso; todas as rotas exigem usuário autenticado.
4. `historicoOs` é `[]` até a Sprint 04.
5. Placa aceita só os dois padrões vigentes; o marcador `ANON<id>` é reservado à anonimização e nunca entra pela API.
6. A edição aceita só placa, marca, modelo, ano e cor; `clienteId`, `id` e `quilometragem` no corpo são ignorados.
7. Retenção da placa segue o prazo do cliente, **pendente de validação jurídica formal**.
8. Decisão do PO: critérios de tela ficam só na F35.
9. **[nova]** A edição é PUT total (ADR-024): campo opcional ausente limpa o valor. Hoje só `cor` é opcional.
10. **[nova]** Cor é opcional e vazia é `null` (resposta à dúvida 2 do card).
11. **[nova]** Faixa do ano: 1900 até o ano corrente + 1, pelo relógio da aplicação (resposta à dúvida 3 do card).
12. **[nova]** Os erros de rota seguem texto fixo; só o 400 de campo e o 409 de placa usam chave.
13. **[nova]** Schema: a dúvida 1 do card (colunas `cor` e `ano`, índice único) está respondida pela V2 e pela V7 (`V7__adicionar_indice_unico_e_check_de_placa_em_veiculos.sql` existe no repositório) e a tarefa 1 já consta como feita. Não reabri.

### Dúvidas em aberto (cada uma com o padrão adotado até haver resposta)
- **D1.** `cor` também deve ser aparada? **Padrão adotado: sim**, por consistência com marca e modelo. A revisão pediu só marca e modelo; incluir a cor amplia o critério. Decisão de quem revisou.
- **D2.** `"ano": 2015.0` é rejeitado? **Padrão adotado: sim** (C8e).
- **D3.** Como o erro de tipo do `ano` devolve o campo: opção A ou B (seção 6)? **Padrão: A**, com a chave nova `veiculo.form.ano.tipo`. Decisão técnica do CARTOGRAFO; como PO, aceito a chave (a F35 vai consumi-la).
- **D4.** Descarte `ANON<id>` sem código: bloquear a F04 ou abrir card com prazo? **Recomendo abrir card com prazo e não bloquear**: a F04 só cria e edita veículo, e hoje não existe cliente anonimizado nem rotina de descarte; o risco aparece quando a P2 existir. Condição: o card nasce com **data**, senão a promessa de descarte da política fica sem entrega. A decisão é da pessoa responsável.
- **D5.** Donos de P13 (veículo vendido com o dono antigo ativo: hoje 409 sem saída), P14 (`placa` em `VARCHAR(10)` esgota acima do veículo 999999) e P15 (veículo de cliente anonimizado). **Sugestão**: P13 com PO e CARTOGRAFO (a política já indica essa dupla), P14 com o CARTOGRAFO (é migration), P15 com quem pegar a P2. **Não nomeei ninguém**: nomear é da pessoa responsável.
- **D6.** Um PR ou três empilhados (seção 4)? **Recomendo três.**
- **D7.** Aceite do risco P8/V7 por escrito, com nome (seção 7). Sem o nome, o risco segue aberto.

## 9. Dados pessoais (LGPD)

| Dado | Finalidade | Base legal | Retenção | Descarte |
|---|---|---|---|---|
| `veiculos.placa` | Identificar o veículo na abertura e no acompanhamento da OS. Pode identificar o titular indiretamente (consulta a órgão de trânsito e vínculo por `cliente_id`) | Execução de contrato, LGPD art. 7º, V | Segue o cliente dono: ativo + 5 anos, **pendente de validação jurídica formal** | Junto com o cliente, na mesma transação: vira `ANON<id>`. A linha nunca é apagada (FK de OS) |
| `veiculos.marca`, `modelo`, `ano`, `cor` | Mesma finalidade; dado pessoal só **por associação** ao dono | Execução de contrato, art. 7º, V | Igual ao cliente | Mantidos após o descarte, pois deixam de identificar alguém quando a placa é anonimizada |
| Quilometragem, chassi, RENAVAM, foto | **Não coletados** (minimização) | n/a | n/a | n/a |
| `clienteNome` no detalhe do veículo | Evitar segunda chamada na tela | Execução de contrato | Dado do cliente, já coberto | Segue o cliente |

Fonte: política de dados do cliente, revisão 5 (`docs/security/politica-dados-pessoais-cliente.md`) e inventário (`docs/security/lgpd-registro-dados-pessoais.md`). Regras que a feature cumpre:
- Placa **mascarada em log** (`****D23`), nunca na URL, nunca no corpo de erro, nunca em exemplo real de OpenAPI ou de teste. Os testes usam placas fictícias.
- O 409 não repete a placa. **Risco a registrar (P8/V7):** o 409 em si confirma que aquela placa existe no sistema. Aceite pendente (D7).
- As mudanças desta revisão **não coletam dado novo**: aparar espaço e restringir o tipo do `ano` só reduzem entrada inválida. O erro de tipo do ano não repete o valor enviado (C8c). **VIGIA deve confirmar** que ler o nome do campo no erro de desserialização (D3, opção A) não vaza trecho do corpo.

## 10. Dependências e duplicação

- **F08, F09, F10 (Clientes):** a F04 reaproveita o utilitário de máscara, o formato de erro e o 404 por exceção de domínio. Não repete escopo. A `feat/f03d-clientes-editar` tem a F04 como ancestral (conferido), então o contrato `erros[]` da F04-a **precisa estar na `main` antes ou junto da F10**. Conferir com PRUMO.
- **F06 e F18 (OS):** consomem o veículo e preenchem `historicoOs`. Fora da F04.
- **F35 (telas):** dona dos critérios de tela; consome este contrato.
- **Duplicação:** nenhuma com outra feature do panorama. Ponto de atenção: o handler global é compartilhado com Clientes (seção 6, critério 8).

## 11. Rastreabilidade

Nomes de teste lidos em `VeiculoIT`; **não executei a suíte nesta etapa.**

| Critério | Teste existente (nome lido) | Estado |
|---|---|---|
| C1, C2 | `shouldReturn201LinkedToClientWhenPlateIsInOldFormat`, `shouldReturn201WhenPlateIsMercosul` | existe |
| C3 | `shouldStoreNormalizedPlateWhenPlateIsTypedWithMaskOrLowerCase` | existe |
| C4, C5 | `shouldReturn400OnPlateFieldAndStoreNothingWhenPlateFormatIsInvalid`, `shouldReturn400OnPlateFieldWhenPlateIsBlankOrAbsent` | existe |
| C6 | `shouldReturn409WithoutFullPlateWhenPlateIsRepeatedInAnyCase` | existe |
| C7 | `shouldReturn400WithOneErrorPerFieldWhenBrandModelAndYearAreBlank` | existe |
| **C7a, C7b, C7c** | nenhum | **falta teste e código (N1)** |
| C8, C8a | `shouldRejectYearOutsideRangeAndAcceptNextYear` | existe |
| C8b | teste da virada do ano (`7250be2`) | existe; redação a conferir |
| **C8c, C8d, C8e, C16a** | só `"ano":"abc"` coberto (`shouldReturn400WithoutStoringWhenBodyIsMalformedOrYearIsNotNumber`), **sem exigir o campo em `erros[]`** | **falta teste e código (N2)** |
| C9, C10, C11 | `shouldReturn404AndStoreNothingWhenClientDoesNotExist`, `shouldCreateExactlyOneWhenTenRequestsWithSamePlateRunConcurrently`, `shouldReturn401AndChangeNothingOnAllFourRoutesWhenTokenIsMissingOrMalformed` | existe |
| C11a | `shouldCreateNewVehicleInPathClientWhenBodyCarriesIdAndOtherOwner` | existe (pelo nome) |
| C12 a C16 | `shouldReturn200WithUpdatedDataWhenEditingBrandModelYearAndColor`, `shouldAcceptPlateChangeBetweenOldAndMercosulFormatsAndKeepSamePlate`, `shouldReturn409AndKeepOriginalPlateWhenPlateBelongsToAnotherVehicle`, `shouldReturn400AndKeepRecordUnchangedWhenEditBodyIsInvalid` | existe |
| C17 | `shouldKeepOwnerAndMileageWhenEditBodyCarriesOtherOwnerIdAndMileage` | existe |
| **C17a, C17b** | nenhum | **falta teste (N3)** |
| C18 | `shouldReturn404WhenEditingMissingVehicle` | existe |
| C19, C20 | `shouldReturnDetailWithOwnerAndEmptyHistoryWhenVehicleHasNoOrders`, `shouldReturn404WhenDetailingMissingVehicle` | existe |
| C19a, C19b, C20a | nenhum específico | a confirmar |
| C21 a C23 | `shouldListClientVehiclesOrderedByPlateWithoutPagination`, `shouldReturnEmptyListWhenClientHasNoVehiclesAnd404WhenClientIsMissing` | existe |
| C24 | `shouldLogOnlyMaskedPlateOnCreateEditDetailListAndConflict` | existe |
| C25, C26 | `shouldReturnEveryInvalidFieldWithKeyAndNeverRepeatSentValues` | existe |
| **C25b** | nenhum específico | **a conferir (N4)** |

**N1** = aparar marca e modelo. **N2** = ano inteiro estrito. **N3** = teste de PUT sem cor. **N4** = escopo da chave i18n e registro no contrato.
