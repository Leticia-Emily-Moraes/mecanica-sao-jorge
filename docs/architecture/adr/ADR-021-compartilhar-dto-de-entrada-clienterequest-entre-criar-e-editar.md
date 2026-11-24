---
status: proposto   # 2026-11-17 proposto (F03c, card F09)
date: 2026-11-17
decision-makers: [CARTOGRAFO (Arquiteto), pessoa dona do produto (P9 da política, CPF obrigatório ou opcional)]
consulted: [VIGIA (política de dados do cliente, revisão 3, seções 2.2 e 7), BUSSOLA (handoff da F09)]
informed: [ESPRESSO, CRIVO, ORLA, ESQUADRO, PERGAMINHO, REGENTE]
---

# Compartilhar um único DTO de entrada `ClienteRequest` entre criar (F09) e editar (F10)

## Contexto e problema

A criação (F09, `POST /api/v1/clientes`) e a edição (F10, `PUT /api/v1/clientes/{id}`) recebem os mesmos cinco campos (`nome`, `cpf`, `telefone`, `email`, `endereco`), com as mesmas regras da política (seção 7, "API, criação"):

* lista de caracteres aceitos antes de normalizar (achado E3);
* mensagem fixa que cita o campo (E5);
* opcional em branco grava `NULL`;
* nada de `id` vindo do corpo (E4);
* `toString()` sem dado pessoal (B1).

O card da F09 pede `ClienteCreateDTO` na entrada e `ClienteDTO` na saída. O ADR-007 (aceito) manda `*Request` e `*Response`, e a saída do detalhe já existe como `ClienteDetalheResponse` (F03b). A ordem entre validar e normalizar também importa. Se o DTO normalizar antes de o Bean Validation rodar, `123abc45678901` vira 11 dígitos e passa, contra o US-CLI-17. A pergunta: um DTO ou dois? E onde ficam a validação, o tratamento de branco e a normalização?

Conferido no repositório em 2026-11-17: as colunas já existem e aguentam os limites. `nome` é `VARCHAR(150)` e `email` é `VARCHAR(190)` (V2), `cpf` é `VARCHAR(11)` com `CHECK` e `endereco` é `VARCHAR(255)` (V4). O `pom.xml` já tem MapStruct 1.6.3 com `lombok-mapstruct-binding` (linha 185), então o mapper consegue usar o builder de `Cliente`. A F09 não precisa de dependência nova.

## Fatores de decisão

* F1. Cada regra escrita uma vez só. Medida: a regex de CPF e a de telefone aparecem exatamente 1 vez em `apps/api/src/main`.
* F2. Atribuição em massa impossível: a entrada não tem `id` nem `createdAt`, e campo de destino não mapeado quebra a compilação.
* F3. Validar antes de normalizar: `123abc45678901` e `98765abc432` respondem 400.
* F4. Semântica de edição que a F35 implementa sem estado de três valores (ausente, `null`, valor).
* F5. Nenhuma dependência nova.
* F6. Mensagem fixa por campo, começando pelo nome do campo no JSON e sem o valor enviado (E5).

## Opções consideradas

* A. Um `record` `dto.ClienteRequest` para POST e PUT. O PUT substitui o recurso inteiro. Validação por anotação no `record`, branco vira `null` no construtor compacto, e normalização (dígitos e `strip`) no mapper, depois da validação.
* B. Dois `record`, `ClienteCreateRequest` e `ClienteUpdateRequest` (ou os nomes do card, `ClienteCreateDTO` e um DTO de edição), com as anotações repetidas.
* C. Um `record` com grupos de validação (`OnCreate` e `OnUpdate`) e `@Validated(grupo)` no controller.
* D. Edição por `PATCH` parcial, com DTO de campos de três estados (`JsonNullable<String>` ou `Optional`).

## Resultado da decisão

Opção escolhida: "A. Um `ClienteRequest` para POST e PUT, com PUT de substituição inteira", porque é a única que atende F1, F4 e F5 juntas. Hoje nenhuma regra difere entre criar e editar, então dois DTOs ou grupos de validação só criam lugar para as regras divergirem. Na saída, o 201 da F09 e o 200 da F10 usam o `ClienteDetalheResponse` que já existe (política, seção 7). O `ClienteDTO` do card é esse DTO.

### Especificação normativa do `dto.ClienteRequest`

`record` com exatamente cinco componentes, todos `String`. Não tem `id`, `createdAt` nem nenhum outro campo.

| Campo | Anotações, com `message` fixo | Antes de validar | Gravado como |
|---|---|---|---|
| `nome` | `@NotBlank` "nome e obrigatorio"; `@Size(max = 120)` "nome deve ter no maximo 120 caracteres" | branco vira `null` | `strip()` |
| `cpf` | `@Pattern` CPF, "cpf deve ter 11 digitos". Só se a P9 decidir "obrigatório": mais `@NotBlank` "cpf e obrigatorio" | branco vira `null` | só dígitos; ausente ou branco grava `NULL` |
| `telefone` | `@NotBlank` "telefone e obrigatorio"; `@Pattern` TEL, "telefone deve ter 10 ou 11 digitos" | branco vira `null` | só dígitos |
| `email` | `@Size(max = 120)` "email deve ter no maximo 120 caracteres"; `@Email` "email invalido" | branco vira `null` | `strip()`; ausente ou branco grava `NULL` |
| `endereco` | `@Size(max = 255)` "endereco deve ter no maximo 255 caracteres" | branco vira `null` | `strip()`; ausente ou branco grava `NULL` |

Regex, escritas uma vez só, como constantes do próprio `record` (no literal Java, cada `\` vira `\\`):

* CPF: `^(?:[ .\-]*[0-9]){11}[ .\-]*$`. Aceita dígitos ASCII e os separadores `.`, `-` e espaço, com exatamente 11 dígitos.
* TEL: `^(?:[ ().\-]*[0-9]){10,11}[ ().\-]*$`. Aceita dígitos ASCII e os separadores `(`, `)`, `.`, `-` e espaço, com 10 ou 11 dígitos.

Regras:

1. **Branco vira `null` no construtor compacto** do `record`, para os cinco campos, com `String.isBlank()`. Isso roda antes do Bean Validation. Assim, o campo obrigatório em branco cai só no `@NotBlank`, com uma mensagem, e o opcional em branco passa e grava `NULL`. O construtor compacto **não** remove separadores nem faz `strip`: isso é normalização, e ela só roda depois da validação (F3).
2. **O limite de tamanho conta o valor bruto**, antes do `strip`. `@Size` conta unidades UTF-16. Um valor de 120 unidades sempre cabe em `VARCHAR(150)`, que no `utf8mb4` conta caracteres.
3. **Normalização no `ClienteMapper`, depois da validação**, por dois métodos `@Named`:
   * `somenteDigitos` mantém `null` como `null` e remove **só** os separadores aceitos, `[ ().\-]`. Não usa "remove tudo que não é dígito". Se um dia algum caminho chamar o mapper sem validar, a letra fica no valor e o `CHECK` do banco recusa: falha fechada.
   * `aparado` mantém `null` como `null` e aplica `strip()`.
4. **Mapper de escrita.** `Cliente toEntity(ClienteRequest request)` com `@BeanMapping(unmappedTargetPolicy = ReportingPolicy.ERROR)`, `@Mapping(target = "id", ignore = true)` e `@Mapping(target = "createdAt", ignore = true)`, mais o `qualifiedByName` de cada campo (regra 3). A F10 acrescenta `void atualizar(ClienteRequest request, @MappingTarget Cliente cliente)` com as **mesmas** anotações, repetidas de forma explícita. **Não verificado:** se `@InheritConfiguration` herda o `@BeanMapping`. Repetir as anotações evita depender disso.
5. **`toString()` sobrescrito** no `record`, devolvendo só o nome do tipo (regra do B1 na política, seção 7). Teste unitário prova que a saída não contém nenhum dos valores fictícios.
6. **Semântica do PUT (F10): substituição inteira.** Mesmo DTO e mesmas validações do POST. Campo opcional omitido ou em branco no PUT grava `NULL`, ou seja, apaga o valor. A F35 sempre envia os cinco campos, com o valor atual pré-preenchido pelo detalhe.
7. **P9 é uma anotação.** CPF opcional (parecer do VIGIA) ou obrigatório (card) muda só o `@NotBlank` do `cpf`. Formato, normalização e mapper são iguais nos dois casos. O aceite do exemplo `CPF` do US-CLI-16 espera a P9.
8. **Divergência de nomes registrada.** Os nomes do card (`ClienteCreateDTO` e `ClienteDTO`) cedem ao ADR-007: `ClienteRequest` na entrada e `ClienteDetalheResponse` na saída. As tarefas 3, 5 e 6 do card ficam cumpridas com esses nomes.

### Consequências

* Bom, porque CPF e telefone têm uma regex cada, num lugar só. A F10 não escreve validação nova, e uma correção vale para as duas rotas.
* Bom, porque `id` não existe no DTO e o mapper não compila com campo de destino esquecido. Um `"id"` no corpo é ignorado pelo Jackson, e o `save` faz `INSERT`, nunca `merge` (E4).
* Bom, porque a ordem fica explícita e testável: branco para `null`, depois validação, depois normalização. É ela que impede `123abc45678901` de passar (F3).
* Ruim, porque o PUT de substituição apaga o opcional que o app esquecer de enviar. Mitigação: o contrato está escrito aqui e na F35, e o IT da F10 prova que email omitido vira `NULL`.
* Ruim, porque um campo que exista só na edição, como um `ativo` futuro, obriga a separar o DTO. Custo estimado: um `record` novo e um método de mapper, menos de uma hora, com novo ADR substituindo este.
* Neutro, porque o nome diverge do card (regra 8), o que já é prática da casa (ADR-007).

### Confirmação

* `git grep -nE "ClienteCreateDTO|ClienteCreateRequest|ClienteUpdateRequest|ClienteDTO\b" -- apps/api/src` sem ocorrência.
* `git grep -c "0-9\]){11}" -- apps/api/src/main` e `git grep -c "0-9\]){10,11}" -- apps/api/src/main` iguais a 1 (F1).
* O build compila o `ClienteMapper` com `ReportingPolicy.ERROR`.
* Teste unitário do `ClienteRequest` com o `Validator` do Bean Validation, cobrindo:
  * cada linha da tabela;
  * CPF `123abc45678901`, `98765abc432`, 10 e 12 dígitos, dígito arábico-índico e dígito de largura total;
  * telefone com 9 e 12 dígitos e com `+55`;
  * nome com 120 e com 121 caracteres;
  * branco e só espaços nos cinco campos.
  Toda mensagem começa pelo nome do campo e não contém o valor enviado.
* Teste unitário do `ClienteMapper`: `123.456.789-00` vira `12345678900` e `(20) 91234-5678` vira `20912345678`, e um valor com letra **não** é limpo (regra 3).
* Teste de ataque (E4), com MySQL real: POST com `"id"` de um cliente existente cria um cliente novo, e o existente fica intacto na leitura por `JdbcTemplate`.
* Teste unitário de `toString()` do `ClienteRequest` sem CPF, telefone e endereço fictícios.
* Na F10: IT do PUT omitindo `email` grava `NULL`.
* Revisão do CARTOGRAFO nas PRs da F09 e da F10.

## Prós e contras das opções

### A. Um `ClienteRequest` para POST e PUT (escolhida)

* Bom, porque atende F1 (uma regex de cada), F2 (sem `id` e com `ERROR` no mapper), F3 (normaliza depois de validar), F5 (sem dependência) e F6 (mensagem fixa na anotação).
* Bom, porque atende F4: o formulário da F35 é um só para criar e editar, e sempre envia tudo.
* Ruim, porque o PUT apaga o opcional omitido (consequência acima).
* Ruim, porque separar o DTO mais tarde exige novo ADR.

### B. Dois DTOs com anotações repetidas

* Bom, porque cada rota pode evoluir sem afetar a outra.
* Ruim, porque não atende F1. São duas cópias de cada regex e de cada mensagem, e uma correção feita só numa delas deixa a edição aceitar um CPF que a criação recusa.
* Ruim, porque dobra os testes de validação. Custo estimado: umas 60 linhas de anotação e uma classe de teste a mais, sem nenhuma regra diferente que justifique.

### C. Um DTO com grupos de validação

* Bom, porque fica um tipo só, com espaço para regras diferentes por rota.
* Ruim, porque hoje não existe regra diferente para os grupos separarem. Os grupos são duas interfaces marcadoras e um `groups` em cada anotação, sem nada para distinguir.
* Ruim, porque `@Valid` ignora grupos. Quem trocar por `@Valid` ou esquecer o `groups` de uma anotação deixa o campo sem validação, sem erro de compilação.

### D. PATCH parcial com campos de três estados

* Bom, porque a edição muda só o que veio, e o app pode mandar um campo sozinho.
* Ruim, porque não atende F5: diferenciar ausente de `null` pede `jackson-databind-nullable` (com ADR e porta próprios) ou `Optional` em componente de `record`, que o Jackson não distingue de forma confiável.
* Ruim, porque exige mesclar campo a campo no service, com um teste por campo, e o formulário da F35 edita tudo de uma vez. Custo: dependência nova mais umas 5 regras de mescla, para nenhuma necessidade do briefing.

## Mais informações

**Evidência (CARTOGRAFO, 2026-11-17).** As duas regex da especificação rodaram no `jshell` do OpenJDK 21.0.10 desta máquina. Saída real, resumida (código não ASCII mostrado como `U+XXXX`):

```text
CPF aceita 12345678900 | 123.456.789-00 | " 123.456.789-00 " | 123 456 789 00
CPF recusa 123abc45678901 | 98765abc432 | 1234567890 | 123456789012 | U+0661...U+0660 (arabico-indico) | U+FF11...U+FF10 (largura total) | +12345678900 | 123/456/789-00
TEL aceita 2091234567 | 20912345678 | (20) 91234-5678 | (20) 3123-4567 | 20.91234.5678
TEL recusa 209123456 | 209123456789 | +55 20 91234-5678 | 20 9a234-5678
patologico 200k separadores: false em 12 ms ; 10 digitos + 200k hifens: false em 9 ms
isBlank: "" true | "   " true | U+2003 true | U+00A0 false | TAB true
```

Os grupos `[separadores]*[0-9]` não se sobrepõem (separador e dígito são classes disjuntas), então a regex não tem retrocesso exponencial. A entrada de 200 mil caracteres foi recusada em cerca de 10 ms.

**Não verificado nesta etapa:** o comportamento do `@NotBlank` e do `@Email` do Hibernate Validator da versão em uso, a ordem das mensagens quando há mais de um erro e o `@InheritConfiguration` do MapStruct. Essas provas são dos testes do ESPRESSO.

**Risco residual.**

* Nome feito só de espaço sem quebra (U+00A0) não é branco para `isBlank()` (provado acima) e, pelo que se espera do `@NotBlank`, passaria e seria gravado. Severidade baixa: é lixo visível na lista, não vazamento. Teste do ESPRESSO registra o comportamento real. Se passar, decide-se com o BUSSOLA se vale barrar.
* `@Email` do Hibernate aceita endereços sem domínio de topo, como `a@b`. O critério só exige recusar email sem arroba.
* Por padrão o Jackson converte número em texto, então `"cpf": 12345678900` sem aspas passa como CPF válido. É aceitável, porque o valor é o mesmo. Objeto ou lista no lugar de texto cai no `HttpMessageNotReadableException`, que é o 400 do achado E2.
* O `getFieldErrors()` do Spring não garante ordem. Com vários campos inválidos, a `mensagem` do ADR-011 junta os textos com `; ` numa ordem que pode variar. Teste e app procuram cada texto e não comparam a mensagem inteira.

**Pendência B4 (dígito verificador do CPF), não decidida neste ADR.** A tabela acima valida só o formato. A política (seção 8.1, achado B4) atribui à F09 a validação do dígito verificador, com Bean Validation e teste, e o ESPRESSO como dono. Essa regra conflita com a regra de dado de teste da mesma política (seção 7, "Teste e ambiente local"), que manda usar CPF com dígito verificador **inválido** (`12345678900`), e com os exemplos do `overview.md` e da F26.

* Opção 1: acrescentar `@CPF` do Hibernate Validator (`org.hibernate.validator.constraints.br.CPF`) ao `cpf`. Custo: uma anotação e uma mensagem fixa ("cpf invalido"). Mas todo teste de `POST` com CPF passa a precisar de CPF com dígito válido, que pode ser de uma pessoa real, e os exemplos com `123.456.789-00` passam a responder 400. **Não verificado:** se o `@CPF` da versão em uso aceita os mesmos separadores da regex e se recusa sequências repetidas como `11111111111`.
* Opção 2: manter só o formato e fechar o B4 como risco aceito. O CPF digitado errado só aparece na emissão da nota, que ainda não existe no sistema.

Recomendação do CARTOGRAFO: opção 1, porque o CPF só existe para a nota fiscal e o erro mais provável no balcão é a digitação. A condição é o VIGIA definir o conjunto de CPFs de teste com dígito válido (sem nenhum outro dado associado), que substitui a regra atual de dado de teste. Quem decide é o VIGIA com a pessoa, antes de o ESPRESSO escrever o `ClienteRequest`. Se for a opção 1, muda a linha `cpf` da tabela (mais uma anotação), a confirmação ganha casos de dígito inválido e o exemplo do contrato da F03c no `overview.md` troca de CPF.

**Vínculos.** Card F09 (F03c): tarefas 3 a 6 e 9, US-CLI-15 a US-CLI-20.4. Card F10 (F03d). Política, seções 2, 2.2 e 7 (achados E1 a E5, pendência P9). Complementa o ADR-007 (DTO e nomes), o ADR-011 (formato do 400) e o ADR-018 (colunas). O ADR-020 usa o formato normalizado definido aqui.

**Revisitar quando:** a edição precisar de campo que a criação não tem; a P9 for decidida; o endereço ficar estruturado (ADR-018); ou o app passar a editar um campo por vez.

## Histórico

| Data | Status | Mudança |
|---|---|---|
| 2026-11-17 | Proposto | Criação na F03c (CARTOGRAFO), com as regex provadas no JDK 21. Aguarda o aceite da pessoa e a P9 |
| 2026-11-17 | Proposto | Pendência B4 registrada (dígito verificador do CPF, atribuído à F09 pela política e não tratado na criação), com duas opções e a recomendação do CARTOGRAFO. A decisão é do VIGIA com a pessoa |
