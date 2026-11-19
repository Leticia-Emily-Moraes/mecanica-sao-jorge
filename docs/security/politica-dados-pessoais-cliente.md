# Política de dados pessoais de cliente: retenção, descarte e mascaramento

Dono: VIGIA (AppSec/LGPD). Criada em 2026-11-14 na F03a, antes de qualquer código do módulo Clientes. Revisada em 2026-11-17 três vezes: revisão 1 (contrato da máscara), revisão 2 (detalhe de cliente da F03b e colunas `cpf` e `endereco` da V4) e revisão 3 (criação de cliente da F03c, card F09: unicidade, CPF opcional, placa e log do POST). Revisão 4 em 2026-11-18 (F09: a premissa 3 do card cai em favor do ADR-020, retenção e descarte consolidados por dado na seção 3.1 e recadastro de titular anonimizado na 2.3). Revisão 5 em 2026-11-18 (F04, Veículos: placa classificada como dado pessoal, placa única com marcador de anonimização por linha, descarte do veículo junto com o cliente e máscara de placa em log). Revisão 6 em 2026-11-18 (F10, F03d, edição de cliente: cobertura da edição confirmada, valor anterior nunca guardado, email único com 409 no POST e no PUT, normalização de email e linhas de log do PUT). Ver seção 11.

Revisão 7 em 2026-11-19 (F10, depois da revisão humana): linha `campo=concorrencia` aprovada como condição de merge, U+200B provado no índice de email, aparo Unicode do email registrado e revisão do código com achados W1 a W6. Ver seção 11.

Vale para: F03a (listar), F03b (detalhe, card F08), F03c (criar, card F09, primeira escrita de CPF e endereço), F03d (editar), F04 (veículos), F35 (telas de cliente) e toda feature que leia ou grave `clientes` ou `veiculos`.

Status:

* Regras técnicas (seções 6 e 7): **vigentes desde já**. Feature que não as cumpre não passa na revisão do VIGIA.
* Base legal e prazos (seções 2 a 5, inclusive o resumo da 3.1): **proposta do VIGIA**, aplicada como hipótese de trabalho até a validação jurídica (D2 da F03a) e a aprovação da oficina, que é a controladora. Mudança de prazo depois da validação altera só este arquivo e a rotina de descarte; nenhum contrato de API depende do prazo.

Relação com outros documentos: complementa `docs/security/lgpd-registro-dados-pessoais.md` (inventário do schema inteiro, criado na F44 e na `main` desde o merge do PR #14). As linhas `clientes` e `veiculos` do registro apontam para cá; se os dois divergirem, vale esta política. Nada aqui é jurídico definitivo: é a leitura técnica do VIGIA sobre a LGPD (Lei 13.709/2018) e as leis citadas, para a pessoa validar.

## 1. Papéis

* Controladora: a oficina Mecânica São Jorge.
* Operadores: nenhum terceiro trata o dado hoje. Quando houver hospedagem, backup externo ou integração (WhatsApp está no backlog), o fornecedor vira operador e precisa de contrato com cláusula de proteção de dados antes do primeiro envio.
* Encarregado (art. 41): não nomeado. Hipótese a confirmar: a Resolução CD/ANPD nº 2/2022 dispensa o agente de pequeno porte de nomear encarregado, mas exige canal para o titular. O canal está na pendência P3.

## 2. Inventário por campo

| Campo | Existe hoje? | Coleta | Finalidade | Base legal (art. 7º) | Onde aparece na API | Retenção | Descarte |
|---|---|---|---|---|---|---|---|
| `clientes.nome` | Sim (V2, NOT NULL) | Obrigatória | Identificar o cliente na OS e localizar o cadastro no balcão | V (execução de contrato e procedimentos preliminares, como orçamento) | Lista (F03a), detalhe (F03b), OS | Seção 3 | Substituir por texto fixo (seção 4) |
| `clientes.telefone` | Sim (V2, NULL) | **Obrigatória na API de criação** (F03c, revisão 3): 10 ou 11 dígitos ASCII, gravado só com dígitos. A coluna continua `NULL` de propósito, porque a anonimização grava NULL (seção 4): proibido `NOT NULL` em migration. Não é único (2.1) | Contato sobre orçamento, valor final e veículo pronto | V | Lista (F03a), detalhe (F03b) e resposta 201 da criação (F03c), **completo** (só dígitos, como gravado) e só com token válido. A tela também mostra completo, para contato direto. Em log, nunca na F03a a F03c (6.3 a 6.5); só a máscara 6.2.1 se uma linha futura precisar | Seção 3 | NULL |
| `clientes.email` | Sim (V2, NULL) | Opcional (F03c: até 120 caracteres, formato de email; em branco grava NULL). **Único quando preenchido** a partir da revisão 6, no POST e no PUT, gravado com `strip()` e minúsculas só em ASCII (2.1 e 2.5) | Mesmo do telefone | V | Lista, detalhe, resposta 201 da criação e resposta 200 da edição (F03d). Nunca em log, nem mascarado, nem o valor anterior (6.7) | Seção 3 | NULL |
| `clientes.cpf` | **Coluna criada pela V4 da F08 (F03b)**: `VARCHAR(11) NULL` com `CHECK` de 11 dígitos ASCII ([ADR-018](../architecture/adr/ADR-018-guardar-cpf-e-endereco-do-cliente-como-colunas-opcionais.md)). Nenhuma escrita antes da F09 (F03c). **Linha aprovada pelo VIGIA na revisão 2** | **Opcional também na API de criação** (revisão 3, seção 2.2). Só quando o cliente pedir nota fiscal ou a emissão exigir. Proibido coletar "por garantia" e proibido tornar obrigatório sem a decisão P9. **Único quando preenchido**, com índice `uk_clientes_cpf` e 409 já na F03c (2.1, revisão 4) | Emissão de documento fiscal | II (obrigação legal fiscal) quando houver nota; sem nota, não se coleta | Só no detalhe (`GET /api/v1/clientes/{id}`, F03b) e na resposta 201 da criação (F03c, eco do que o próprio usuário enviou), **completo e sem máscara**, só com token válido, porque a edição (F03d) pré-preenche o valor. A máscara é da tela (seção 7). Nunca na lista, na OS resumida, em log (nem mascarado na linha 6.4), em mensagem de erro nem em exemplo do OpenAPI com dado real | Seção 3 (R4) | NULL |
| `clientes.endereco` | **Coluna criada pela V4 da F08 (F03b)**: `VARCHAR(255) NULL`, campo único (ADR-018, decisão D-B). Nenhuma escrita antes da F09. **Linha aprovada pelo VIGIA na revisão 2** | Opcional. Só quando a nota exigir ou para busca e entrega do veículo | Emissão fiscal ou logística combinada com o cliente | II (nota) ou V (busca e entrega) | Só no detalhe, completo, só com token válido. Nunca em log, nem mascarado | Seção 3 (R4) | NULL |
| `clientes.created_at` | Sim | Automática | Contar o prazo da regra R2 | Acessória às linhas acima | Não exposta na F03a | Junto do cliente | Mantida (sozinha não identifica) |
| `veiculos.placa` | Sim (V2, `VARCHAR(10) NOT NULL`). **Índice único `uk_veiculos_placa` e `CHECK` de formato pela V7 da F04** (revisão 5, seção 2.4) | Obrigatória (F04). Gravada normalizada: 7 caracteres ASCII maiúsculos, padrão antigo `ABC1234` ou Mercosul `ABC1D23`. **Única** (2.1) | Identificar o veículo atendido na abertura e no acompanhamento da OS. Identifica o dono de forma indireta (DETRAN e `cliente_id`) | V | Respostas da criação e da edição, detalhe e lista de veículos do cliente (F04), **completa**, só com token válido. Nunca em URL, em mensagem de erro (o 409 não repete a placa), em exemplo do OpenAPI com placa real nem inteira em log; em log, só a máscara da 6.2.2 nas linhas da 6.6 | Igual ao cliente dono (R1 ou R2) | Vira o marcador `ANON<id>` (seção 4). Nunca o texto fixo `ANONIMO`, que o índice único recusa (8.5) |
| `veiculos.marca/modelo/ano/cor` | Sim (V2) | `marca`, `modelo` e `ano` obrigatórios na API da F04 (a coluna `ano` segue `NULL`); `cor` opcional (D3 do PRD; parecer favorável do VIGIA por minimização). `quilometragem` **não é coletada** na F04: fica fora do DTO, e a coluna segue `NULL` | Execução do serviço | V | Detalhe do veículo; a lista do cliente leva só `marca` e `modelo` | Igual ao cliente | Mantidos: são dado pessoal só enquanto ligados à placa ou a um cliente identificado. Sem placa e com o dono anonimizado, não identificam a pessoa (2.4) |

Quem acessa: qualquer usuário autenticado (ADMIN ou FUNCIONARIO), porque o briefing não prevê diferença de permissão nesta fase. Esse acesso amplo é risco aceito e registrado no achado A3 (seção 8).

Para onde vai: só da API para o app mobile, por HTTPS fora do ambiente local. Nenhum envio a terceiro. O app não grava a lista nem o detalhe em disco (seção 7).

Regra de coleta: campo pessoal novo em `clientes` ou `veiculos` só entra com linha nesta tabela aprovada pelo VIGIA antes da migration. As linhas de CPF e endereço foram aprovadas na revisão 2 (2026-11-17), antes da V4 da F08. A aprovação cobre a **coluna** e a **leitura** no detalhe. A **coleta** continua presa à finalidade da linha (CPF só com nota fiscal); quem a implementa e prova é a F09 (F03c). A unicidade foi decidida na revisão 3, e o momento em que ela entra, na revisão 4 (2.1). Base legal e prazos seguem como proposta até a P1.

### 2.1 Unicidade (decisão do VIGIA, revisão 3)

| Campo | Único? | Regra | Por quê |
|---|---|---|---|
| `clientes.cpf` | **Sim, quando preenchido** | Índice `UNIQUE` em `clientes.cpf`. O MySQL aceita vários NULL num índice único, então cliente sem CPF e cliente anonimizado não colidem. CPF repetido **bloqueia** com 409 e mensagem fixa `CPF ja cadastrado`, sem o valor e sem o id do cadastro existente. Não pede confirmação e não só alerta | Um CPF é uma pessoa. Dois cadastros da mesma pessoa fazem o pedido de acesso ou eliminação do titular (art. 18) achar só um, e a anonimização deixa uma cópia viva. Alerta ou confirmação pedem fluxo de dois passos na tela e ainda deixam o duplicado entrar |
| `clientes.email` | **Sim, quando preenchido** (revisão 6, revoga a linha da revisão 3) | Índice `UNIQUE` `uk_clientes_email` sobre o email gravado com `strip()` e minúsculas ASCII. Vários NULL não colidem (8.6). Email de outro cliente **bloqueia** com 409 e mensagem fixa `Email ja cadastrado`, sem o endereço e sem o id do outro cadastro, no POST e no PUT. Depende do aceite da P16 | Um email é a caixa de uma pessoa ou de uma empresa, e dois cadastros com o mesmo email repetem o problema do CPF no pedido do titular. O custo de família ou empresa que divide email é de produto e está no card F10: o segundo cadastro vai sem email (2.5, U7) |
| `clientes.telefone` | Não | Sem índice e sem checagem | Telefone de casa ou da empresa é dividido |
| `veiculos.placa` | **Sim** (revisão 5, revoga a linha da revisão 3) | Índice `UNIQUE` `uk_veiculos_placa` na V7, sobre a placa normalizada. Placa repetida **bloqueia** com 409 e mensagem fixa `Placa ja cadastrada` (chave `veiculo.form.placa.duplicada`), sem a placa, sem o id do veículo existente e sem o nome do dono. A anonimização grava `ANON<id>`, que é único por linha e não colide (seção 4, provado na 8.5) | Uma placa é um veículo. Dois registros da mesma placa dividem o histórico de OS entre cadastros e, se ficarem em clientes diferentes, a placa de uma pessoa aparece no cadastro de outra. O motivo antigo para não ser única (`ANONIMO` repetido) cai com o marcador por linha. O caso do veículo vendido fica na 2.4 |

Como a regra do CPF entra:

1. **Decisão do VIGIA na revisão 4 (2026-11-18): a premissa 3 da F09 cai em favor do ADR-020.** A F03c entrega o índice e o 409 na mesma PR do POST: migration `V6__adicionar_indice_unico_cpf_em_clientes.sql` (a V5 é o `CHECK` de telefone), exceções, handler e o método único de gravação do ADR-020. Dois POST com o mesmo CPF respondem 201 e depois 409, e o `COUNT(*)` fica em 1. A revisão 3 deixava a F03c aceitar duplicado e empurrava a regra para outra fatia. Isso deixa de valer.
2. Por que agora, e não numa fatia própria antes do primeiro cliente real:
   * A premissa 3 e a dúvida 1 do card prendem a ausência de checagem à "política do VIGIA, ainda não definida". A regra foi definida na revisão 3, e só faltava a data. O US-CLI-20.6 se declara provisório "até a decisão do VIGIA", e a decisão é esta.
   * A F03c é a primeira rota que grava CPF. Enquanto não houver índice, todo duplicado que entrar (teste manual, demonstração, primeiro uso) faz a migration do índice falhar no boot, e o Flyway escreve o CPF no log (ADR-020, Consequências).
   * A trava "antes do primeiro cliente real" (P10) depende de alguém lembrar. O uso é interno e não há homologação entre o merge da F35 e o balcão da oficina. Trava que depende de memória não é controle.
   * O teste de "dois 201" seria escrito para ser apagado na fatia seguinte. Com a regra agora, o teste de CPF repetido já nasce definitivo, e a F03d herda o método de gravação sem código de unicidade (ADR-020, F4).
   * Custo: uma migration de uma linha, duas exceções, um handler e o IT que o ADR-020 já especifica (Confirmação). É proporcional ao tamanho da feature.
3. Quem garante é o índice, não um `existsByCpf` antes do `save`: dois POST simultâneos passariam pela consulta. O service pode consultar antes para responder mais cedo, mas o 409 também tem de sair do `DataIntegrityViolationException` do índice, com mensagem fixa e sem `getMessage()`. O MySQL escreve `Duplicate entry '<cpf>' for key ...` nessa mensagem.
4. Antes da migration do índice, procurar duplicados com uma consulta que só conta: `SELECT COUNT(*) FROM (SELECT cpf FROM clientes WHERE cpf IS NOT NULL GROUP BY cpf HAVING COUNT(*) > 1) d`. Nunca `SELECT cpf ...`. Se a migration falhar por duplicado, o Flyway escreve o CPF no log do boot. Duplicado se resolve caso a caso com a pessoa, antes da migration. Na F03c, se o banco local tiver duplicado de teste manual anterior, recria-se o volume local (só tem dado fictício) em vez de editar o CPF à mão.
5. A edição (F03d) segue a mesma regra no PUT.
6. O 409 confirma que o CPF já está na base. Risco aceito: qualquer token válido já lê o CPF inteiro pelo detalhe (B2).

Efeito da revisão 4 no card e na revisão humana: o critério 9 da revisão de 17/11 pediu "ambos criados com 201", com o comportamento registrado como provisório "até a decisão do VIGIA (dúvida 1)". Com a decisão, a prova pedida passa a ser outra: o segundo POST responde 409 com `mensagem` exatamente `CPF ja cadastrado`, sem o CPF nas duas formas e sem o id do primeiro, e nada é gravado. O texto final do critério é do BUSSOLA, e a pessoa confirma no aceite do ADR-020. Se ela recusar, vale a opção D do ADR-020 (201 provisório), a P10 volta a bloquear o primeiro cliente real e o PR perde só a migration, o `catch` e o handler do 409 (ADR-020, F6).

A revisão 4 não muda a P9: o CPF segue opcional pelo parecer da 2.2. Vários cadastros sem CPF não colidem no índice (provado na 2.3).

Troca de dono de veículo (F04, revisão 5): **proibido alterar `veiculos.cliente_id` depois da criação, por qualquer rota.** O PUT da F04 ignora `clienteId` no corpo (premissa 6 do card), e o mapper de edição não tem destino para `cliente` (seção 7, "API, veículos"). Se o `cliente_id` mudasse, as OS do dono antigo apareceriam no histórico do dono novo (o histórico filtra por `veiculo_id`), e a anonimização do dono antigo (seção 4, passo 3) não alcançaria mais a placa ligada às OS dele. O veículo vendido com o dono antigo ainda ativo é a P13 (2.4).

### 2.2 CPF obrigatório ou opcional na criação (parecer do VIGIA, revisão 3)

O card da F09 põe o CPF entre os obrigatórios (tarefa 3 e exemplo `CPF` do US-CLI-16) e dá base legal V. A política diz outra coisa. **Parecer: o CPF continua opcional na API de criação.**

* Necessidade (art. 6º, III): atendimento, OS e contato não usam CPF. Ele só serve à nota fiscal.
* A base V não cobre CPF de quem não pediu nota, e a II só cobre quando a emissão exige. CPF obrigatório para todo cadastro é coleta "por garantia", e a seção 2 proíbe isso. Vale também para o cliente que só fez orçamento (R2).
* Hipótese a validar com o contador (P1): a nota de serviço do município da oficina pode exigir CPF do tomador em toda emissão. Mesmo nesse caso, o CPF seria necessário quando a nota é emitida, não no cadastro.
* Se a pessoa decidir pelo CPF obrigatório, contra este parecer, o fundamento escrito (norma da nota, com o contador) entra nesta seção antes do merge da F03c. A base do CPF passa a ser II para todos, e a retenção não muda.
* Contrato enquanto a P9 não fecha: a validação de formato (US-CLI-17) é igual nos dois casos. Só muda a obrigatoriedade. Com CPF opcional, CPF ausente, `null`, `""` ou só espaços grava NULL e responde 201. Com CPF obrigatório, esses casos respondem 400. Dá para escrever o código, mas o aceite do exemplo `CPF` do US-CLI-16 espera a P9.

### 2.3 Recadastro de titular anonimizado (revisão 4)

O índice único (2.1) e a anonimização (seções 4 e 5) mexem na mesma coluna. Provei a interação em MySQL 8.4 descartável, com V1 a V5 deste ramo, o índice do ADR-020 e dois clientes fictícios (saída real na 8.4):

| Situação do cadastro antigo | CPF no cadastro antigo | Novo cadastro do mesmo titular, com o mesmo CPF |
|---|---|---|
| Anonimizado por completo (seção 4: prazo vencido, ou pedido do titular sem OS dentro de R1) | NULL | Aceito (201). O cadastro antigo não identifica mais ninguém, e o novo é outro contrato |
| Anonimizado em parte (pedido de eliminação dentro de R1, seção 5): contato NULL, nome e CPF retidos para a obrigação fiscal | Retido | **Recusado pelo índice** (erro 1062), que vira 409 `CPF ja cadastrado` |
| Dois ou mais cadastros anonimizados por completo | NULL em todos | Não colidem entre si |

Conduta no segundo caso. Ela vale quando existirem a F03d e o procedimento da P2; antes disso não existe anonimização parcial.

* O funcionário não cria outro cadastro. Acha o cadastro retido pelo nome na lista (F03a; o nome também foi retido) e grava pela edição (F03d) o contato que o titular acabou de informar.
* Base: o titular voltou para um serviço novo, que é contrato novo (art. 7º, V). O contato volta a ter finalidade, e o prazo de R1 recomeça com a nova OS. O pedido de eliminação anterior continua no registro de auditoria da seção 4.
* Proibido contornar o 409. Apagar o CPF do cadastro retido quebra a obrigação fiscal que justificou retê-lo (art. 16, I). Gravar o novo cadastro sem CPF cria dois registros da mesma pessoa, que é o que a 2.1 evita.
* A tela (F35) mostra o 409 no campo `cpf` e sugere buscar pela lista, sem dizer qual cliente tem o CPF (`docs/product/F35-recebido-da-F03c-criar-cliente.md`). A API não muda.

### 2.4 Veículos (F04, revisão 5)

**Classificação.** A placa é dado pessoal do titular dono do veículo: identifica a pessoa de forma indireta, pelo registro do DETRAN e, dentro do sistema, pelo `cliente_id`. Marca, modelo, ano e cor são dado pessoal por associação enquanto estiverem ligados à placa ou a um cliente não anonimizado, porque descrevem um bem de pessoa identificada. Nenhum deles é dado sensível (art. 5º, II). Base legal de todos: execução de contrato e procedimentos preliminares, como o orçamento (art. 7º, V). Finalidade: identificar o veículo na abertura e no acompanhamento da OS e no histórico de OS por veículo.

**Ciclo do dado.**

| Etapa | Regra |
|---|---|
| Coleta | No balcão, pelo funcionário, no `POST /api/v1/clientes/{clienteId}/veiculos`: placa, marca, modelo, ano e, se informada, cor. Nada além disso: sem quilometragem, chassi, RENAVAM ou foto |
| Quem acessa | Qualquer usuário autenticado, ADMIN ou FUNCIONARIO (premissa 3 do card). Riscos aceitos A3, B2 e V7 |
| Para onde vai | Só da API para o app, por HTTPS fora do ambiente local. Nenhum terceiro. Placa nunca em URL (as rotas da F04 só levam ids), inteira em log, em mensagem de erro ou em exemplo do OpenAPI com placa real |
| Retenção | Segue o cliente dono (R1 ou R2). A OS do veículo conta como evento do cliente para o R1 (seção 3) |
| Descarte | Junto com o cliente, na mesma transação (seção 4, passo 3): a placa vira `ANON<id>`; marca, modelo, ano, cor e quilometragem ficam; a linha de `veiculos` nunca é apagada (FK `ordens_servico.veiculo_id`) |

**O que acontece com o veículo quando o cliente é descartado.**

| Gatilho do descarte do cliente | Veículo |
|---|---|
| Prazo R1 ou R2 vencido | Todos os veículos do cliente, com ou sem OS: `placa` = `ANON` + `id` do veículo (o veículo 42 vira `ANON42`). Demais colunas mantidas. OS, junções, parcelas e pagamentos do veículo ficam intactos |
| Pedido de eliminação do titular, cliente sem OS ou com último evento fora de R1 | Igual à linha acima, na hora |
| Pedido de eliminação do titular com OS dentro de R1 | A placa vira `ANON<id>` **na hora** (revisão 4, mantida), mesmo com nome e CPF retidos: a placa não serve à obrigação fiscal nem a contato |
| Depois do descarte | A placa original fica livre no índice. Se o mesmo carro voltar, com o mesmo dono ou com outro, é cadastro novo (201), sem ligação com o histórico anonimizado. A busca de OS por placa (F06) não acha o histórico antigo |

Por que `ANON<id>` e não `ANONIMO`: com o índice único, o texto fixo repetido falha já no primeiro cliente com dois veículos (erro 1062, provado na 8.5). `ANON<id>` é único por linha, não carrega dado do titular (o id é interno), cabe no `VARCHAR(10)` até o veículo 999999 e nunca casa com placa válida, porque nos dois padrões o 4º caractere é dígito. Acima de 999999 a gravação falha com erro 1406 em vez de truncar (provado na 8.5); antes disso, a coluna precisa crescer em migration aditiva (P14). Por que não `NULL`: exigiria tirar o `NOT NULL` da coluna, e a única barreira contra placa ausente passaria a ser o Bean Validation.

Regras do marcador:

* É reservado à rotina de anonimização (P2). A API nunca aceita `ANON...` na entrada: o validador da F04 só aceita os dois padrões, e o `CHECK` da V7 aceita os dois padrões e o marcador.
* A máscara de log (6.2.2) trata o marcador como valor inválido e escreve `*******`.
* Como o app mostra um veículo anonimizado é decisão da feature da P2. Até lá não existe veículo anonimizado.

**Veículo vendido com o dono antigo ativo (P13).** Com a placa única, o cadastro do dono novo recebe 409 enquanto existir o registro do dono antigo com a placa. A troca de dono está fora do escopo da F04. Conduta até a P13:

* Proibido contornar: cadastrar a placa com caractere a mais ou trocado, gravar o carro do dono novo no cadastro do dono antigo ou editar a placa do registro antigo para outra placa real. Todos esses misturam o histórico e o contato de duas pessoas.
* O funcionário registra o caso e encaminha ao ADMIN.
* Direção recomendada para a P13 (decisão do BUSSOLA e do CARTOGRAFO, com revisão do VIGIA): "baixa" do registro do dono antigo, que grava `ANON<id>` na placa dele e mantém as OS dele ligadas a esse registro, e depois cadastro novo para o dono novo. Cada dono vê só o próprio histórico, e o índice continua simples.

**Veículo de cliente anonimizado (P15).** Criar ou editar veículo de cliente anonimizado religaria dado novo a um cadastro que deixou de identificar alguém. Hoje não existe cliente anonimizado nem marcador para reconhecê-lo. A feature da P2 traz o marcador e faz o POST e o PUT de veículo desse cliente responderem erro. A F04 não precisa tratar.

**`clienteNome` no detalhe do veículo (D4 do PRD): parecer favorável**, com condições: só `clienteId` e `clienteNome` (nunca telefone, email, CPF ou endereço), nome nunca em log e `toString()` do DTO sem o nome (seção 7). O mesmo token já lê o nome pelo detalhe do cliente, então nada novo é exposto, e a tela evita uma segunda chamada.

### 2.5 Edição de cliente (F03d, card F10, revisão 6)

**Parecer: a política cobre a edição.** A finalidade, a base legal, os prazos e o descarte de nome, CPF, telefone, email e endereço já estão escritos (seções 2, 3, 3.1 e 4). A edição não coleta campo novo, não cria destino novo e não muda prazo. O que faltava era a regra do valor anterior, a unicidade de email pedida pelo card, as linhas de log do PUT (6.7) e as regras de API da edição (seção 7). Esta revisão fecha esses quatro pontos. O ESPRESSO pode começar, com as condições da 6.7, da seção 7 ("API, edição") e o aceite da P16 para os critérios de email.

**Ciclo do dado na edição.**

| Etapa | Regra |
|---|---|
| Coleta | `PUT /api/v1/clientes/{id}` com o mesmo `ClienteRequest` da criação (ADR-021). Os mesmos cinco campos, nada além. O pedido de correção do titular (art. 18, III) entra por aqui (seção 5) |
| Finalidade e base legal | As da seção 2, campo a campo: nome, telefone e email com base V. CPF com base II (nota fiscal). Endereço com base II ou V. A correção também cumpre o dever de qualidade do dado (art. 6º, V) |
| Quem acessa | Qualquer usuário autenticado, ADMIN ou FUNCIONARIO. Não existe dono por cliente: todo funcionário atende todo cliente. A escrita ampla é risco a aceitar (U5, P8) |
| Para onde vai | Só da API para o app. A resposta 200 é o `ClienteDetalheResponse`, com os valores novos. Nenhum terceiro |
| Valor anterior | **Sobrescrito e não guardado em lugar nenhum**: nem em log, nem em coluna, tabela de histórico, resposta, mensagem de erro ou registro de auditoria. Só o backup (backlog) o carrega, até expirar em 35 dias (3.1) |
| Retenção | Não muda. A edição **não é evento** para R1 e R2 (seção 3): o prazo conta do cadastro, da OS e do pagamento. `created_at` é `updatable = false` na entidade e o PUT não o toca (conferido em `entity/Cliente.java`) |
| Descarte | O da seção 4. Valor apagado pelo PUT (opcional omitido grava NULL, ADR-021) some na hora, sem cópia |

Por que a edição não reinicia o prazo: se reiniciasse, qualquer correção de telefone manteria o cadastro para sempre, sem contrato novo. O titular que volta para um serviço novo reinicia o R1 pela OS nova (2.3), não pela edição.

Por que o valor anterior não fica: histórico de alteração está fora do escopo do card e não tem finalidade escrita. Guardar o CPF ou o telefone antigos seria uma segunda cópia sem prazo e sem descarte, e o pedido de eliminação (seção 5) teria de achá-la. **R6.** Histórico de alteração de cliente ou veículo só entra com linha nesta política antes da migration, dizendo o que guarda, por quanto tempo e como a anonimização da seção 4 o alcança.

**Unicidade de email (decisão do VIGIA na revisão 6, revoga a linha de email da revisão 3).** O card F10 pede 409 para email de outro cliente (US-CLI-31 e US-CLI-32) e, na premissa 6, a mesma regra na criação. Parecer favorável, com condições:

* Pelo lado do titular, o argumento é o do CPF (2.1): um endereço de email é uma caixa de uma pessoa ou de uma empresa. Dois cadastros com o mesmo email fazem o pedido de acesso ou de eliminação achar um só, e o contato de um titular aparece no cadastro de outro.
* O custo é de produto e já está no card: família ou empresa que divide email não cadastra o mesmo email em dois clientes. O segundo cadastro vai **sem email**, que é opcional, e o telefone continua obrigatório. Proibido inventar email para contornar o 409 (U7).
* Regra: índice `UNIQUE` `uk_clientes_email` sobre o email gravado. Vários NULL não colidem (provado na 8.6), então o cliente sem email e o anonimizado passam. A anonimização já grava NULL no email (seção 4), então nada muda no descarte.
* Vale para **POST e PUT juntos**, na mesma PR (premissa 6 do card). Se só o PUT checar, o POST grava o duplicado que o PUT recusa, e a migration do índice nem roda. A mudança no POST altera o contrato aprovado da F09: o POST passa a responder 409 `Email ja cadastrado`. É decisão da pessoa (P16).
* Resposta 409 com `mensagem` exatamente `Email ja cadastrado`, sem o endereço, sem o id e sem o nome do outro cliente. O CPF continua `CPF ja cadastrado`. Quando os dois conflitam, a resposta aponta só o primeiro índice que o MySQL recusar. O card só pede que a mensagem indique um campo.
* Se a pessoa recusar a P16, vale a revisão 3 para o email (não único). Os critérios 6 e 7 e a parte de email do 8 caem, e o PUT checa só o CPF.

**Normalização do email e o que o banco compara (provado na 8.6).**

* A coluna `clientes.email` está em `utf8mb4_0900_ai_ci` (V3). O índice único compara **sem caixa e sem acento**: `Ana@Example.com` colide com `ana@example.com`, e `joão@example.com` colide com `joao@example.com`. O sinal Kelvin (U+212A) colide com `k`. Espaço no fim **não** é ignorado (a collation é NO PAD).
* Quem decide o conflito é o índice, não o Java. A edição não precisa de consulta prévia: um `UPDATE` da própria linha com o mesmo valor não viola o índice, então US-CLI-28 e US-CLI-32 passam sem código de exclusão do próprio id. Se o ESPRESSO quiser responder antes do `flush`, a consulta prévia roda no banco (`existsBy...AndIdNot`), com a mesma collation. Proibido comparar email em memória no Java, que discorda da collation nos casos acima.
* Gravação: `strip()` (já faz, mapper da F03c) e minúsculas **só nas letras ASCII de `A` a `Z`**, como a placa (6.2.2). Proibido `String.toLowerCase`, inclusive com `Locale.ROOT`: no JDK 21 ele troca o Kelvin por `k` ASCII e transforma `İ` (U+0130) em dois caracteres (provado na 8.6), o que grava um email que o funcionário não digitou e pode passar das 190 posições da coluna (U4). Isso é normalização, não regra de formato nova (premissa 1 do card).
* O `strip()` remove só espaço Unicode reconhecido pelo Java. O espaço não separável (U+00A0) fica (provado na 8.6). O `@Email` decide se aceita: comportamento a provar no teste (U4), não verificado nesta revisão.
* **Revisão 7 (2026-11-19): o aparo do email mudou depois da revisão 6.** O commit `0c78365` trocou o `strip()` do email por `AparoUnicode.aparar`, que remove das pontas todo caractere com `Character.isWhitespace` ou `Character.isSpaceChar`, inclusive U+00A0, U+2007 e U+202F. O aparo roda no construtor do `ClienteRequest`, antes do `@Email`, e de novo no mapper. Vale só para as pontas e só para o email; `nome` e `endereco` seguem com `strip()`. O item acima ("o espaço não separável fica") descreve o `strip()` e não vale mais para o email. Emails gravados pela F03c antes da V8 não são regravados: só existe dado fictício (conferido por leitura em `dto/AparoUnicode.java`, `dto/ClienteRequest.java` e `mapper/ClienteMapper.java` no commit `738f04b`).
* **Caracteres de largura zero (revisão 7, provado na 8.7).** O aparo não remove U+200B, porque ele não é espaço para o Java. Mesmo assim, o índice `uk_clientes_email` **ignora** U+200B, U+200D, U+FEFF e U+00AD em qualquer posição: o email de outro cliente com um desses caracteres dá erro 1062, e o PUT responde 409 `Email ja cadastrado`. A frase "`x@y.com` + U+200B vira outro email e passa na unicidade" está errada. O risco que sobra é de qualidade do dado: um email novo com caractere invisível, se o `@Email` aceitar (não verificado), fica gravado assim e não recebe mensagem. Risco aceito na F10 (W5); a premissa 1 do card proíbe regra de formato nova.

**Respostas às dúvidas do card.**

1. "Cliente ativo" não existe e não vai existir nesta fase (D2 da F03a). O fim da retenção é o da seção 3: R1 (5 anos após o último evento, com OS) ou R2 (12 meses após o cadastro, sem OS), mais o pedido do titular (seção 5). A frase do card diz o mesmo sem prazo contável. Vale a política.
2. Emails repetidos na base: não existe cliente real em nenhum ambiente, porque o primeiro cadastro real está bloqueado pelas P2, P3 e P4. Isso é o que os documentos dizem (não existe deploy registrado), não uma consulta a produção. Antes da migration do índice, em cada banco que já tenha dado: contar com `SELECT COUNT(*) FROM (SELECT TRIM(email) e FROM clientes WHERE email IS NOT NULL GROUP BY e HAVING COUNT(*) > 1) d`, nunca com `SELECT email`. Com a collation da V3, o `GROUP BY` já junta caixa e acento (provado na 8.6). Banco local ou de teste com duplicado tem só dado fictício e é recriado. Se um dia houver duplicado real, ele se resolve caso a caso com a pessoa, antes da migration: quem fica com o email é quem o titular confirmar, e o outro cadastro fica sem email. Se a migration falhar por duplicado, o Flyway escreve o email no log do boot (provado: o 1062 traz o valor).
3. O email é opcional (ADR-021, `@Email` e `@Size` sem `@NotBlank`, e em branco vira NULL no construtor do `ClienteRequest`, conferido no código). O índice aceita vários NULL (provado na 8.6).

**CPF na edição.** O PUT herda o `@NotBlank` do CPF da F03c (overview, contrato do POST). Com isso, o titular não consegue pedir a retirada do CPF pela correção, só pela eliminação (seção 5). Isso contraria o parecer da 2.2 e continua na P9. A F10 não decide a P9: se a pessoa a fechar como opcional, o mesmo DTO passa a aceitar CPF ausente no PUT, que grava NULL.

**Cliente anonimizado.** Hoje não existe. Quando a P2 existir, o PUT de cliente anonimizado por completo tem de responder erro, porque religaria dado novo a um cadastro que deixou de identificar alguém. No cadastro anonimizado em parte (2.3), o PUT pode regravar o contato, mas não pode trocar nem apagar o CPF retido. Fica na P15, ampliada nesta revisão. A F10 não precisa tratar.

## 3. Retenção

Último evento do cliente: a data mais recente entre o cadastro (`clientes.created_at`), a abertura ou entrega da última OS e o último pagamento ligado a ele.

* **R1. Cliente com pelo menos uma OS:** 5 anos após o último evento. Fundamento proposto: prazo de 5 anos do CDC art. 27 (reparação por defeito do serviço), do Código Civil art. 206, § 5º, I (cobrança de dívida líquida) e do CTN arts. 173 e 174 (crédito tributário). A LGPD art. 16, I, permite conservar o dado para cumprir obrigação legal.
* **R2. Cliente sem nenhuma OS** (cadastro ou orçamento que não virou serviço): 12 meses após o cadastro. Sem contrato executado, não há obrigação legal que justifique prazo maior.
* **R3. Pedido de eliminação do titular:** seção 5.
* **R4. CPF e endereço:** seguem o cliente (R1 ou R2). Se o CPF foi coletado só para uma nota, o prazo fiscal já está coberto por R1.

Bloqueio técnico de R1: na V2, `ordens_servico` e `pagamentos` **não têm coluna de data** (conferido em `V2__criar_schema_oficina.sql` na `main`, commit 11f35b3). Sem ela não dá para calcular o último evento. A feature de OS (Sprint 04) e a de pagamento (Sprint 05) precisam trazer a data em migration aditiva. Até lá, o último evento conhecido é só o `created_at` do cliente, e nenhum descarte automático por R1 pode rodar. Ver achado A6.

Pendente: os prazos são hipótese. "Enquanto ativo" não se aplica porque não existe inativação de cliente (D2 da F03a). Validar com jurídico ou contador da oficina.

Divergência do card da F09 (revisão 3): o card diz "enquanto o cliente estiver ativo; descartado sob pedido, exceto dado ligado a OS com obrigação fiscal (5 anos)". Vale R1 a R4 e a seção 5, que dizem o mesmo com prazo contável. A placa segue o dono (seção 2).

### 3.1 Resumo de retenção e descarte por dado (revisão 4)

Esta é a política de descarte que o "Pronto" da Sprint 02 exige antes da F09. Ela junta as seções 2 a 5 num lugar só. Se divergir delas, valem as seções de origem. Prazos e bases seguem como proposta até a P1.

O descarte tem dois gatilhos: (a) prazo vencido (R1 ou R2), contado do último evento; (b) pedido de eliminação do titular (seção 5).

| Dado | Base legal (art. 7º) | Prazo | O que acontece no descarte | Pedido do titular com OS dentro de R1 |
|---|---|---|---|---|
| `clientes.nome` | V | R1 ou R2 | Vira o texto fixo `Cliente anonimizado` | Retido até o fim de R1, sem uso para contato (art. 16, I) |
| `clientes.telefone` | V | R1 ou R2 | NULL | NULL na hora |
| `clientes.email` | V | R1 ou R2 | NULL | NULL na hora |
| `clientes.cpf` | II, só com nota fiscal | Segue o cliente (R4) | NULL, o que libera o valor no índice `uk_clientes_cpf` (2.3) | Retido até o fim de R1, sem uso para contato. Continua ocupando o índice (2.3) |
| `clientes.endereco` | II (nota) ou V (busca e entrega) | Segue o cliente (R4) | NULL | NULL na hora |
| `clientes.created_at` | Acessória | Junto do cliente | Mantida: sozinha não identifica e conta o prazo | Mantida |
| `veiculos.placa` | V | Igual ao dono | Vira o marcador `ANON<id>` (2.4), o que libera a placa no índice `uk_veiculos_placa` | `ANON<id>` na hora (revisão 4, com o marcador da revisão 5): a placa identifica o dono e não serve a contato nem, pela hipótese da P1, à nota de serviço. Se o titular voltar com o mesmo carro, o veículo é registro novo (2.4) |
| Demais colunas de `veiculos` | V | Igual ao dono | Mantidas | Mantidas |
| OS, junções, parcelas, pagamentos, financeiro | V e II (escrituração) | 5 anos (fiscal) | Mantidos: sem os campos acima, não identificam a pessoa | Mantidos |
| Registro de auditoria da anonimização (`cliente_id`, data, motivo, `usuario_id`) | II (art. 37, registro das operações) | 5 anos após a anonimização (hipótese da P1) | `DELETE` da linha. Nunca guarda o valor antigo | Não se aplica |
| Log de aplicação (linhas 6.3 a 6.7) | IX (`usuarioId`, controle de acesso) | 90 dias (P7) | Rotação do coletor. Hoje some quando o contêiner é recriado | Não se edita log: o `clienteId` passa a apontar para um cadastro anonimizado |
| Backup (backlog) | Igual à do dado de origem | 35 dias | Expira. Depois de qualquer restauração, reaplicar todas as anonimizações do registro de auditoria antes de abrir o sistema | Igual |
| Dado de cliente no app | Igual à do dado de origem | Enquanto a tela está aberta | Sai da memória ao sair da tela, depois do 201 e no logout (seção 7). Nada em disco | Igual |
| Banco de teste e banco local | Não se aplica: só dado fictício (seção 7) | Duração do teste | O contêiner do Testcontainers é removido no fim. O volume local é recriado, sem dado real | Não se aplica |

**R5. Texto livre.** Coluna de texto livre ligada a cliente, veículo ou OS entra com linha nesta política antes da migration, e a linha diz se a coluna ganha passo próprio na anonimização da seção 4 (texto fixo ou NULL). Hoje só existe `movimentacoes_estoque.motivo`; no futuro, por exemplo, diagnóstico ou observação da OS. `movimentacoes_estoque.motivo` fica fora da anonimização, porque é auditoria de estoque, e o app orienta a não digitar dado pessoal nele (P5 do registro LGPD).

**O que o descarte não faz:** não apaga linha de `clientes` (FK da OS, seção 4); não guarda o valor antigo em outra coluna, tabela ou log, nem em backup por mais de 35 dias; e não depende de flag de "inativo", que não existe (D2 da F03a).

**O que a F09 precisa entregar para o descarte funcionar depois.** A F09 só grava dado fictício, então nenhum descarte roda nela. Mas ela precisa:

* gravar CPF, email e endereço ausentes como NULL, nunca como string vazia (string vazia passaria por dado presente na anonimização e na contagem);
* gravar o `nome` sem espaços nas pontas;
* entregar o índice único junto com o POST (2.1).

A rotina de anonimização é a P2, que bloqueia o primeiro cliente real.

## 4. Descarte: anonimização, não exclusão

Por que não `DELETE`: `veiculos.cliente_id` e `ordens_servico.cliente_id` são FK sem `ON DELETE`, e a OS precisa ficar para o relatório histórico de faturamento (CLAUDE.md, modelo de dados) e para a obrigação fiscal. Apagar o cliente apagaria ou quebraria a OS.

Procedimento, numa transação só, por cliente:

1. `clientes.nome` recebe o texto fixo `Cliente anonimizado`, sem id nem parte do nome original.
2. `clientes.telefone`, `clientes.email` e, depois da V4 da F08, `clientes.cpf` e `clientes.endereco` recebem NULL. O detalhe de cliente anonimizado devolve `nome` = `Cliente anonimizado` e os outros quatro campos pessoais `null` (US-CLI-DET-15).
3. `veiculos.placa` de todos os veículos do cliente recebe o marcador `ANON` seguido do `id` do veículo (`UPDATE veiculos SET placa = CONCAT('ANON', id) WHERE cliente_id = ?`), nunca um texto fixo repetido, que o índice `uk_veiculos_placa` recusa (2.4, revisão 5). Modelo, marca, ano, cor e quilometragem ficam (estatística de serviço). A linha de `veiculos` não é apagada.
4. OS, parcelas, pagamentos e financeiro ficam intactos: sem os campos acima, deixam de identificar a pessoa.
5. Registro de auditoria sem dado pessoal: `cliente_id`, data, motivo (`PRAZO` ou `PEDIDO_TITULAR`) e `usuario_id` de quem executou. Nunca o valor antigo.

Regras:

* Irreversível. Proibido "soft delete" que guarde o valor original em outra coluna, tabela ou log.
* Busca da F03a não encontra cliente anonimizado por nome, telefone ou email antigo, porque o valor não existe mais.
* Backup (backlog): quando existir, guardar no máximo 35 dias e, depois de qualquer restauração, reaplicar todas as anonimizações do registro de auditoria antes de abrir o sistema.

Situação hoje: não existe rotina nem tabela de auditoria. Prazo para existir:

* Procedimento manual (script SQL revisado pelo VIGIA, executado por ADMIN, com registro): antes do primeiro cliente real gravado em produção, porque um pedido do titular pode chegar no primeiro dia.
* Rotina automática de R2: antes de completar 12 meses do primeiro cadastro real.
* Rotina automática de R1: depende das datas de OS e pagamento (achado A6).

## 5. Direitos do titular (proposta para a D3)

* Canal: o atendimento da oficina (balcão, telefone ou email da empresa). Quem recebe registra o pedido e encaminha ao ADMIN.
* Confirmação e acesso (art. 18, I e II; art. 19, II): resposta completa em até 15 dias.
* Correção (art. 18, III): pela edição de cliente (F03d).
* Eliminação (art. 18, VI), duas situações:
  * Cliente sem OS, ou com último evento há mais de 5 anos: anonimização completa (seção 4) na hora.
  * Cliente com OS dentro do prazo de R1: anonimizar já telefone, email, endereço e a placa dos veículos dele (placa incluída na revisão 4, seção 3.1); manter nome e CPF só para a obrigação legal (art. 16, I) até o fim de R1, sem uso para contato; anonimizar o resto no fim do prazo. Informar isso ao titular por escrito. Se o titular voltar como cliente nesse intervalo, vale a 2.3.
* Implementação: precisa de feature própria (procedimento manual primeiro, tela depois). Criar ou não essa feature é decisão da pessoa com BUSSOLA; o VIGIA não cria feature.

## 6. Mascaramento em log (vigente)

### 6.1 Nunca vai para log, em nenhum nível e em nenhum perfil versionado

* Termo de busca (`q`), inteiro ou em parte, nem normalizado.
* Nome, email e endereço de cliente.
* Corpo de request ou response de `/api/v1/clientes/**`.
* Placa inteira, normalizada ou não, e corpo de request ou response de `/api/v1/veiculos/**` (revisão 5). Na F04 a placa só aparece com a máscara da 6.2.2, nas linhas da 6.6.
* URL com query string (o `q` está nela).
* Token JWT, senha, `JWT_SECRET` (regra já vigente desde a F02 e a F44).
* Mensagem de exceção de persistência (`DataAccessException`, `SQLException` e causas): o MySQL põe o valor na mensagem, por exemplo em `Duplicate entry` de chave única.

### 6.2 Quando um identificador precisa aparecer

Usar o `id` interno (`clienteId`, `veiculoId`, `usuarioId`). Quando o dado em si for indispensável, só com máscara:

| Dado | Máscara | Exemplo com valor fictício |
|---|---|---|
| Telefone | Só os 4 últimos dígitos | `11987654321` vira `*******4321` |
| CPF | Só os 3 dígitos do meio (posições 5 a 7 dos 11) | `123.456.789-09` vira `***.*56.7**-**` |
| Email | Nunca, nem mascarado | usar `clienteId` |
| Nome | Nunca, nem mascarado | usar `clienteId` |
| Placa | Só os 3 últimos caracteres da placa normalizada, pelo contrato da 6.2.2 (revisão 5; antes era "nunca, nem mascarada"). O `veiculoId` continua sendo o identificador da linha | `ABC1D23` vira `****D23` |

A máscara fica no utilitário único `security.MascaraDadoPessoal` (decisão do CARTOGRAFO em `docs/architecture/overview.md`, divergência 8: classe `final`, métodos estáticos, sem bean), seguindo o contrato da seção 6.2.1. Nada de máscara copiada em cada classe.

#### 6.2.1 Contrato exato da máscara (vigente desde 2026-11-17)

Vale para os dois métodos do utilitário, aqui chamados `telefone(String)` e `cpf(String)` (o nome final do método é do ESPRESSO):

1. Aceitam qualquer `String`, inclusive `null`. Nunca lançam exceção e nunca escrevem em log.
2. Antes de contar, removem tudo que não for dígito ASCII de 0 a 9. Não usar `Character.isDigit` nem `\d` em modo Unicode, que aceitam dígitos de outros alfabetos.
3. Telefone: se sobrarem exatamente 10 ou 11 dígitos, a saída é `*` repetido (quantidade de dígitos menos 4) seguido dos 4 últimos dígitos, sem formatação. Qualquer outro caso (`null`, vazio, só letras, menos de 10 ou mais de 11 dígitos) devolve o texto fixo `***`.
4. CPF: se sobrarem exatamente 11 dígitos, a saída é `***.*` + 5º e 6º dígitos + `.` + 7º dígito + `**-**`. Qualquer outro caso devolve o texto fixo `***.***.***-**`.
5. Por que a saída fixa no caso inválido: num valor curto, os 4 finais seriam quase o dado inteiro, e repetir o tamanho do valor inválido também vaza informação.

Tabela que o teste unitário cobre linha a linha (todos os valores são fictícios):

| Método | Entrada | Saída |
|---|---|---|
| telefone | `11987654321` | `*******4321` |
| telefone | `(11) 98765-4321` | `*******4321` |
| telefone | `1133334444` | `******4444` |
| telefone | `null` | `***` |
| telefone | vazio | `***` |
| telefone | `4321` | `***` |
| telefone | `ana` | `***` |
| telefone | `551198765432` (12 dígitos) | `***` |
| telefone | 11 dígitos arábico-índicos (U+0661 etc.) | `***` |
| cpf | `12345678909` | `***.*56.7**-**` |
| cpf | `123.456.789-09` | `***.*56.7**-**` |
| cpf | `null` | `***.***.***-**` |
| cpf | `1234567890` (10 dígitos) | `***.***.***-**` |
| cpf | `abc` | `***.***.***-**` |

Uso na F03a: a linha de log da seção 6.3 não leva telefone nem CPF, então a F03a só cria o utilitário com o teste acima (tarefa 8). O primeiro uso real em log é da F03c em diante. Se uma classe precisar logar telefone ou CPF sem passar por este utilitário, a revisão do VIGIA reprova.

#### 6.2.2 Contrato da máscara de placa (revisão 5, vigente)

Método `placa(String)` no mesmo `security.MascaraDadoPessoal`, com as regras 1 e 5 da 6.2.1:

1. Aceita `null`, nunca lança exceção e nunca escreve em log.
2. Remove só o espaço ASCII (U+0020) e o hífen ASCII (U+002D) e converte para maiúscula só as letras ASCII de `a` a `z`. Não usa `toUpperCase`, `Character.isLetterOrDigit`, `Character.isDigit` nem `\d` em modo Unicode (8.5, V4).
3. Se o resultado tiver exatamente 7 caracteres e casar com `[A-Z]{3}[0-9][A-Z0-9][0-9]{2}` (só ASCII), a saída é `****` seguido dos 3 últimos caracteres.
4. Qualquer outro caso (`null`, vazio, formato inválido, marcador `ANON<id>`, caractere fora do ASCII) devolve o texto fixo `*******`.

Por que a placa pode aparecer mascarada e o CPF e o telefone não: o critério 24 do card pede a máscara, e o risco é menor. Fixados os 3 últimos caracteres, sobram 175.760 placas possíveis em cada padrão (antigo: 26³ × 10⁴ ÷ 10³; Mercosul: 26⁴ × 10³ ÷ 2.600), e o trecho sozinho não chega ao titular. Na linha do 409 a máscara tem finalidade própria: é o único jeito de ligar uma reclamação do balcão ("não consigo cadastrar o carro de final D23") à linha, porque no 409 não existe `veiculoId` do chamador. Nas outras linhas ela é redundante com o `veiculoId`. Fica porque o card pede, e tirá-la depois não quebra contrato.

| Entrada (fictícia) | Saída |
|---|---|
| `ABC1D23` | `****D23` |
| `ABC1234` | `****234` |
| `abc-1d23` | `****D23` |
| ` ABC1D23 ` | `****D23` |
| `null` | `*******` |
| vazio | `*******` |
| `AB12345` | `*******` |
| `ABC12D3` | `*******` |
| `ABCD123` | `*******` |
| `ABC1D234` (8 caracteres) | `*******` |
| `ANON42` | `*******` |
| `ıBC1D23` (U+0131 no lugar do `A`) | `*******` |
| `ABC` + U+0661 + `D23` (dígito arábico-índico no lugar do `1`) | `*******` |
| Letras de largura total (U+FF21 e seguintes) | `*******` |

### 6.3 Linha de log da busca (F03a, US-CLI-08)

Uma linha INFO por chamada, com só estes campos: `qLen` (tamanho do termo depois de normalizar; 0 sem termo), `page`, `size`, `total` (quantidade de resultados) e `usuarioId` (quem listou, para rastrear extração da base; é dado de funcionário, base legal art. 7º, IX, controle de acesso).

Exemplo: `clientes.listar qLen=5 page=0 size=20 total=3 usuarioId=7`

Teste obrigatório (tarefa 8 da F03a): capturar o log (Logback `ListAppender` ou `OutputCaptureExtension`) numa busca por nome, por email e por telefone com máscara, e provar que nenhuma das strings buscadas, nem os dígitos do telefone, aparece na saída.

### 6.4 Linhas de log do detalhe (F03b, US-CLI-DET-11, vigente)

As seções 6.1 a 6.3 valem para `GET /api/v1/clientes/{id}` sem exceção: a rota está sob `/api/v1/clientes/**` e o corpo da resposta (com CPF e telefone completos) nunca vai para log.

Linhas permitidas, ambas INFO, emitidas pelo service, só com estes campos:

| Situação | Linha exata | Por quê |
|---|---|---|
| 200 (cliente achado) | `clientes.detalhar clienteId={} usuarioId={}` | Rastrear quem leu o CPF inteiro de quem (repúdio, risco A3). É a única rota que devolve CPF inteiro |
| 404 (id numérico sem cliente) | `clientes.detalhar.naoEncontrado clienteId={} usuarioId={}` | Detectar varredura de ids por um mesmo `usuarioId`. O id já passou pela conversão para `Long` positivo, então não carrega texto do atacante nem dado pessoal |

Sem linha nos outros casos: 400 (o valor rejeitado pode ser qualquer texto), 401 (antes do controller), 405 (igual ao ADR-017) e 404 de rota. O 500 segue a seção 7 (classe da exceção e caminho, nada mais).

Regras da linha:

* `clienteId` é o `Long` do caminho depois da conversão; `usuarioId` é o `sub` do JWT, como na 6.3. Base legal do `usuarioId`: art. 7º, IX (controle de acesso).
* Nunca nome, CPF (nem mascarado), telefone (nem mascarado), email, endereço, DTO, entidade, `Optional` ou `toString()` de nenhum deles. A máscara da 6.2.1 não é usada nesta fatia, porque nenhum desses campos entra na linha.
* `clienteId` é dado pessoal por associação enquanto o cliente não for anonimizado. A linha herda a retenção de log da seção 7.
* Formatos de máscara diferentes da 6.2.1, como `123.***.***-00` (3 primeiros e 2 últimos dígitos, a do card da F08) ou `(**) *****-5678`, reprovam na revisão: mostram 5 dos 11 dígitos do CPF.

Teste obrigatório: o do US-CLI-DET-11 do PRD, com `ListAppender` ou `OutputCaptureExtension`, cobrindo 200, 404, 400, 401 e 500. Além das strings já listadas no PRD, nenhuma linha pode conter `123.***.***-00` e as duas linhas acima têm de aparecer exatamente no formato da tabela.

### 6.5 Linhas de log da criação (F03c, card F09, US-CLI-19, vigente)

As seções 6.1 e 6.2 valem para `POST /api/v1/clientes` sem exceção. O corpo da requisição e o da resposta 201 nunca vão para log.

| Situação | Linha exata | Por quê |
|---|---|---|
| 201 (cliente criado) | `clientes.criar clienteId={} usuarioId={}`, INFO, no service, depois do `save` | Rastrear quem criou cada cadastro e perceber criação em massa por um mesmo token (B2, E6) |

Sem linha nos outros casos: 400 de validação, 400 ou 415 de corpo ilegível (E2), 401 (antes do controller), 409 (2.1 e ADR-020; entra na F03c pela revisão 4) e 405. O 500 segue a seção 7: classe da exceção e caminho, nada mais.

Regras da linha:

* `clienteId` é o id gerado pelo banco e `usuarioId` é o `sub` do JWT, como na 6.3. Base legal do `usuarioId`: art. 7º, IX.
* Nunca nome, CPF, telefone, email ou endereço, **nem mascarados**, nem DTO, entidade, `BindingResult` ou exceção de validação. O `getMessage()` de `MethodArgumentNotValidException` e o `toString()` do `BindingResult` trazem `rejected value [...]`. Pelo mesmo motivo, toda exceção do POST tem de ser tratada no `GlobalExceptionHandler`: o `DefaultHandlerExceptionResolver` do Spring escreve um WARN `Resolved [...]` com a mensagem inteira quando nenhum handler da aplicação pega a exceção.
* **Divergência do card** (US-CLI-19 e tarefa 11 pedem CPF e telefone mascarados no log): é o mesmo caso da D-F da F08, e vale a política, que manda não logar. O critério se cumpre provando que o dado não aparece no log de jeito nenhum: inteiro, com máscara de digitação ou com a máscara 6.2.1. A máscara 6.2.1 não tem uso na criação, porque o `clienteId` já liga a linha ao cadastro, e 3 dígitos do CPF mais 4 do telefone num log sem rotina de descarte (B6, P7) não servem a nenhuma finalidade.
* Se mesmo assim a pessoa exigir a máscara no log, só vale este formato: `clientes.criar clienteId={} usuarioId={} cpf={} telefone={}`, com `MascaraDadoPessoal.cpf` e `MascaraDadoPessoal.telefone`. O email fica fora. Qualquer outra máscara reprova (6.4).
* "Configurar mascaramento nos logs" (tarefa 11 da F09) **não** é conversor do Logback com regex. Ele está proibido: uma regex de 11 dígitos mascara id e horário e deixa passar CPF com ponto, espaço ou hífen, o que só dá falsa segurança. Quem controla é a regra de não logar, provada pelo teste de captura de log, pelo `git grep` e pelo log real (seção 10.2).

### 6.6 Linhas de log de veículos (F04, revisão 5, vigente)

As seções 6.1 e 6.2 valem para as quatro rotas da F04 sem exceção. Linhas permitidas, todas INFO, emitidas pelo `VeiculoService`, só com estes campos:

| Situação | Linha exata |
|---|---|
| POST 201 | `veiculos.criar veiculoId={} clienteId={} usuarioId={} placa={}` |
| POST 409 (placa repetida, inclusive na corrida) | `veiculos.criar.placaDuplicada clienteId={} usuarioId={} placa={}` |
| POST 404 (cliente inexistente) | `veiculos.criar.clienteNaoEncontrado clienteId={} usuarioId={}` |
| PUT 200 | `veiculos.editar veiculoId={} usuarioId={} placa={} placaAlterada={}` |
| PUT 409 | `veiculos.editar.placaDuplicada veiculoId={} usuarioId={} placa={}` |
| PUT 404 | `veiculos.editar.naoEncontrado veiculoId={} usuarioId={}` |
| GET detalhe 200 | `veiculos.detalhar veiculoId={} usuarioId={} placa={}` |
| GET detalhe 404 | `veiculos.detalhar.naoEncontrado veiculoId={} usuarioId={}` |
| GET lista do cliente 200 | `veiculos.listarPorCliente clienteId={} total={} usuarioId={}` |
| GET lista do cliente 404 | `veiculos.listarPorCliente.clienteNaoEncontrado clienteId={} usuarioId={}` |

Regras:

* `placa={}` é sempre `MascaraDadoPessoal.placa(...)` aplicada à placa normalizada: a gravada (201, 200 e detalhe) ou a pedida (409). No PUT, a placa nova. Nunca a placa inteira, e nunca a anterior e a nova juntas: `placaAlterada` é só `true` ou `false`.
* A lista não leva placa, nem mascarada: seriam várias placas numa linha só, sem finalidade.
* Ids depois da conversão para `Long` positivo. `usuarioId` é o `sub` do JWT (art. 7º, IX).
* Nunca marca, modelo, ano, cor, `clienteNome`, DTO, entidade, `BindingResult`, `getMessage()` de exceção de persistência ou `toString()` de nenhum deles. O erro 1062 do MySQL traz a placa inteira (8.5).
* Sem linha no 400 de validação (o valor rejeitado pode ser qualquer texto), no 400 ou 415 de corpo ilegível, no 401 e no 405. O 500 segue a seção 7.
* `org.hibernate.orm.jdbc.error` e `org.hibernate.engine.jdbc.spi.SqlExceptionHelper` continuam `OFF` no `application.yml` (F03c). Sem isso, o Hibernate escreve o `Duplicate entry '<placa>'` antes de o service traduzir o 409. Proibido religar em perfil versionado.
* Conversor do Logback com regex de mascaramento continua proibido (6.5).

### 6.7 Linhas de log da edição (F03d, card F10, US-CLI-25, revisão 6, vigente)

As seções 6.1 e 6.2 valem para `PUT /api/v1/clientes/{id}` sem exceção. O corpo da requisição e o da resposta 200 nunca vão para log, nem em parte. Linhas permitidas, todas INFO, emitidas pelo `ClienteService`, só com estes campos:

| Situação | Linha exata | Por quê |
|---|---|---|
| 200 (cliente editado) | `clientes.editar clienteId={} usuarioId={}`, depois do `saveAndFlush` | Rastrear quem corrigiu cada cadastro (art. 37) e perceber troca em massa de contato por um mesmo token (U5) |
| 404 (id numérico sem cliente) | `clientes.editar.naoEncontrado clienteId={} usuarioId={}` | Detectar varredura de ids, como na 6.4 |
| 409 (CPF ou email de outro cliente, inclusive na corrida) | `clientes.editar.conflito clienteId={} usuarioId={} campo={}` | Detectar uso da edição como oráculo de CPF ou email (U8): o mesmo `usuarioId` com muitos 409 em sequência |
| 409 (deadlock ou espera de lock na gravação, ADR-027; revisão 7) | `clientes.editar.conflito clienteId={} usuarioId={} campo=concorrencia` | Tornar observável o gatilho "revisitar quando o log mostrar `campo=concorrencia` com frequência" do ADR-027. Sem a linha, esse 409 não deixa rastro, porque o handler não loga por desenho (A09) |

Regras:

* `clienteId` é o `Long` do caminho depois da conversão. `usuarioId` é o `sub` do JWT (art. 7º, IX).
* `campo` é só o texto fixo `cpf` ou `email`, tirado do **tipo** da exceção (`CpfJaCadastradoException` ou a de email), nunca da mensagem do MySQL nem de `getConstraintName()` impresso.
* **Revisão 7: terceiro valor de `campo`, `concorrencia`, aprovado pelo VIGIA** (ADR-027, regra 3). É texto fixo, tirado do tipo `PessimisticLockingFailureException` capturado em `ClienteService.atualizar`, que relança a mesma instância. Nunca `ex`, `getMessage()` nem a causa no logger: a mensagem do driver pode citar a consulta e o valor. O handler global continua sem log. O `criar` não ganha a linha (6.5). **Condição de merge da F10:** a linha não existe no código em `738f04b` (achado W2). Ela entra com o teste unitário da 10.4 antes do merge. Se a pessoa preferir não acrescentar código, a regra 3 do ADR-027 muda para "sem linha" e o gatilho de revisão passa a ser a reclamação de usuário. A decisão é do CARTOGRAFO e não muda nada nesta política além de remover esta linha.
* **Valor anterior: nunca.** Nem o antigo, nem o novo, nem os dois juntos, nem mascarados, nem indicador de campo alterado (`cpfAlterado`, lista de campos). Saber qual campo mudou num cadastro identificado é um pedaço do histórico que a R6 (2.5) não autoriza.
* Nunca nome, CPF, telefone, email ou endereço, **nem mascarados**, nem DTO, entidade, `BindingResult`, `getMessage()` de exceção de persistência ou `toString()` de nenhum deles. O erro 1062 do MySQL traz o email ou o CPF inteiro (provado na 8.6 e na 8.4).
* Sem linha no 400 de validação, no 400 ou 415 de corpo ilegível, no 401 e no 405. O 500 segue a seção 7: classe da exceção e caminho, nada mais.
* `org.hibernate.orm.jdbc.error` e `org.hibernate.engine.jdbc.spi.SqlExceptionHelper` continuam `OFF` (conferido no `application.yml`). Proibido religar em perfil versionado.
* **Divergência do card** (US-CLI-25 e tarefa 7 pedem CPF, telefone e email mascarados no log): vale a política, pelo mesmo motivo da 6.5. O `clienteId` já liga a linha ao cadastro, e a máscara não tem finalidade. O critério se cumpre provando que nenhum dos três aparece no log, nem inteiro, nem com máscara de digitação, nem com a máscara 6.2.1. Email nunca vai para log, nem mascarado (6.2). Se mesmo assim a pessoa exigir máscara, só vale `clientes.editar clienteId={} usuarioId={} cpf={} telefone={}` com os valores **novos** e `MascaraDadoPessoal`, sem email e sem valor anterior.
* A criação (6.5) continua sem linha no 409. Acrescentar `clientes.criar.conflito` é opcional e fica para quem mexer no POST pela P16, sem quebrar o teste da F03c que procura `clientes.criar`.

## 7. Configuração que protege a regra (vigente)

API:

* Access log do Tomcat (`server.tomcat.accesslog.enabled`) continua desligado, como está hoje. Se um dia ligar, o padrão usa `%U` (caminho sem query string), nunca `%r` nem `%q`.
* `spring.jpa.show-sql` falso e `org.hibernate.orm.jdbc.bind` nunca em TRACE em perfil versionado: o bind do Hibernate imprime o valor do `q`.
* `org.springframework.web` nunca em DEBUG em perfil versionado e `spring.mvc.log-request-details` nunca verdadeiro: o `DispatcherServlet` em DEBUG imprime a URL da requisição.
* Mensagens de Bean Validation sem `${validatedValue}`: o 400 nunca devolve o valor rejeitado.
* Erro 500: logar só a classe da exceção, o caminho sem query string e um identificador da requisição. Sem `getMessage()` de causa de persistência e sem stack trace que carregue essa mensagem.
* Exceção de persistência nunca vira texto de resposta: o handler global devolve mensagem fixa.
* Corpo ilegível (`HttpMessageNotReadableException`, JSON malformado ou tipo errado) e `Content-Type` não suportado (`HttpMediaTypeNotSupportedException`) respondem 400 e 415 com mensagem fixa, sem log. Nunca usar o `getMessage()` do Jackson, que cita o valor (`from String "..."`). Achado E2.
* `record` de DTO que carrega CPF ou endereço sobrescreve `toString()` para mostrar só o `id` (vigente desde a revisão 2; primeiro caso: `ClienteDetalheResponse` da F03b). O `toString()` gerado pelo Java imprime todos os campos, e o Spring MVC em DEBUG escreve o corpo da resposta com ele. Teste unitário prova que a saída não contém o CPF nem o endereço fictícios (achado B1).
* Entidade `Cliente` continua sem `@ToString` e sem `@Data`. O `@Builder` do Lombok gera `toString()` no builder; com `cpf` e `endereco` na entidade, um builder logado por engano imprime os dois. Proibido logar builder; o teste de B1 cobre também `Cliente.builder()...toString()` e, se a saída trouxer o CPF, o campo leva `@ToString.Exclude` (comportamento do Lombok a provar no teste, não verificado nesta revisão).
* Resposta de `/api/v1/clientes/**` sai com `Cache-Control: no-cache, no-store, max-age=0, must-revalidate` (cabeçalho padrão do Spring Security, que o `SecurityConfig` não desliga). Proibido desligar `headers()` ou sobrescrever o `Cache-Control` nessas rotas. O teste de controller do detalhe afirma o cabeçalho no 200.
* Retenção de log de aplicação (proposta, entra na P1): hoje o log só existe na saída padrão do contêiner, sem coletor nem arquivo, e some quando o contêiner é recriado. Quando houver coletor ou arquivo (ANCORA), guardar no máximo 90 dias, com acesso restrito a ADMIN. As linhas 6.3 e 6.4 têm `usuarioId` e `clienteId`, que são dado pessoal por associação.

API, criação (F03c, card F09, vigente):

* Mensagem do 400: cita o campo pelo nome do JSON (`nome`, `cpf`, `telefone`, `email`, `endereco`) num texto fixo, escrito no `message` da anotação, como no `LoginRequest` (`"cpf deve ter 11 digitos"`). O handler de hoje usa só `getDefaultMessage()`, e a mensagem padrão do Bean Validation ("não deve estar em branco") não diz qual campo falhou. A do `@Pattern` ainda mostra a regex. Proibido usar `${validatedValue}`, `{regexp}`, `FieldError.getRejectedValue()` e `buildConstraintViolationWithTemplate` com texto que venha da entrada, porque isso abre injeção de Expression Language no Hibernate Validator (achado E5).
* Caracteres aceitos antes de normalizar: no CPF, dígitos ASCII, `.`, `-` e espaço; no telefone, dígitos ASCII, `(`, `)`, `-`, `.` e espaço. Qualquer outro caractere dá 400: letra, dígito de outro alfabeto, dígito de largura total, `+`. Só depois se removem os separadores e se conferem 11 dígitos (CPF) ou 10 a 11 (telefone). Proibido "remover tudo que não é dígito e contar": `123abc45678901` sobraria com 11 dígitos e passaria, contra o US-CLI-17 (achado E3). A máscara de log da 6.2.1 remove tudo porque só precisa não vazar. A validação de entrada não pode fazer isso.
* A normalização acontece no servidor (mapper ou service), mesmo que o app já mande só dígitos. O `CHECK` da V4 é a última barreira do CPF. O telefone ganha `CHECK` equivalente numa migration aditiva da F03c (achado A8, linha da matriz do `overview.md`), sem `NOT NULL` (seção 2).
* Opcional em branco (`""` ou só espaços em `email`, `endereco` e, se a P9 mantiver opcional, `cpf`) grava NULL, nunca string vazia. O `nome` é gravado depois de `strip()`.
* Atribuição em massa (A01/A08): o DTO de entrada não tem `id` nem `createdAt`. O mapper de criação ignora os dois de forma explícita e usa `unmappedTargetPolicy = ReportingPolicy.ERROR`. Teste do lado de quem ataca: POST com `"id"` de um cliente existente cria um cliente novo e não altera o existente. Se o `id` chegasse à entidade, o `save` faria `merge` e sobrescreveria o cadastro de outra pessoa (achado E4).
* O `record` de entrada carrega CPF, telefone e endereço, então sobrescreve `toString()` e mostra só o nome do tipo. A regra do B1 também vale para DTO de entrada, com teste unitário.
* A resposta 201 tem o formato do detalhe (`ClienteDetalheResponse`, que já tem o `toString()` do B1), com `Cache-Control: no-store` afirmado no teste. O CPF volta inteiro porque é o eco do que o próprio usuário acabou de enviar: nenhum dado novo sai. O `Location` é montado com o id gerado pelo banco (`/api/v1/clientes/{id}`), nunca com texto do corpo.

API, veículos (F04, revisão 5, vigente):

* **Normalização e validação da placa (V4).** Ordem obrigatória: (1) rejeitar com 400 a entrada bruta com mais de 20 caracteres ou com qualquer caractere fora de letras ASCII, dígitos ASCII, espaço U+0020 e hífen U+002D; (2) remover espaços e hífens; (3) converter `a` a `z` para maiúscula, só no ASCII; (4) conferir `^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$`. Só depois vem a unicidade. Proibido converter para maiúscula antes do passo 1: no JDK 21, `"ıbc1d23".toUpperCase(Locale.ROOT)` dá `IBC1D23`, que passaria (8.5, V4). Tab, espaço não separável e outros espaços Unicode dão 400.
* **`CHECK` de formato na V7** (`ck_veiculos_placa_formato`), com `REGEXP_LIKE(..., 'c')` para diferenciar maiúscula: a collation da coluna é `utf8mb4_0900_ai_ci` e, sem o `'c'`, minúscula passaria. Aceita os dois padrões e o marcador `ANON[0-9]{1,6}`. É a última barreira, como o `CHECK` de CPF da V4. Antes da V7, contar duplicados e linhas fora do formato só com `COUNT(*)`, nunca com `SELECT placa`.
* **409 (V3).** Um único ponto de gravação no service, com `saveAndFlush` dentro de `try`, como o `ClienteService.gravar` da F03c. Traduzir para `PlacaJaCadastradaException` (subclasse de `ConflitoException`) só a violação de `uk_veiculos_placa`, pelo nome da restrição, com exceção sem causa e sem `getMessage()`. Uma consulta prévia de existência pode responder mais cedo, mas o 409 da corrida (critério 10) sai do índice. Na edição, a consulta prévia exclui o próprio `id` (critério 14).
* **Atribuição em massa (V1 e V2).** `VeiculoRequest` só com `placa`, `marca`, `modelo`, `ano` e `cor`: sem `id`, `clienteId`, `cliente` e `quilometragem`. O cliente vem só do caminho do POST. O PUT carrega a entidade por `findById` e copia os campos com `@MappingTarget`, ignorando `id`, `cliente` e `quilometragem` de forma explícita, com `unmappedTargetPolicy = ReportingPolicy.ERROR`. Proibido montar `new Veiculo` com o `id` do caminho e chamar `save`: o `merge` apagaria a quilometragem ou trocaria o dono.
* **`toString()` (V8).** `VeiculoRequest` mostra só o nome do tipo. Os DTOs de resposta (detalhe, lista e criação) mostram só o nome do tipo e o `id`. O builder de `Veiculo` não imprime a placa. Teste unitário com placa fictícia, como o do B1.
* **Erro por campo (critérios 25 e 26).** O formato com `erros[]` é decisão do CARTOGRAFO (D2 do PRD). Condições do VIGIA: `campo` vem de `FieldError.getField()` de DTO sem `Map` e sem lista, para que o nome do campo não seja controlado por quem ataca; `chave` é texto fixo no `message` da anotação, sem `{}` e sem `${}`, o que evita interpolação de Expression Language (E5); nenhum `rejectedValue`; a `mensagem` atual continua sem valor. No corpo ilegível (`"ano": "abc"`), se o handler apontar o campo, usa só o nome da propriedade já mapeada no DTO, nunca o valor nem o `getMessage()` do Jackson.
* **Respostas.** 409 com `mensagem` exatamente `Placa ja cadastrada` e chave `veiculo.form.placa.duplicada`; 404 com mensagem fixa (`Veiculo nao encontrado`, `Cliente nao encontrado`), sem repetir o id. O `Location` do 201 é montado com o id gerado (`/api/v1/veiculos/{id}`). `Cache-Control: no-store` nas quatro rotas, afirmado em teste.
* **Exemplos do OpenAPI.** Placa inventada, marcada como fictícia (`ABC1D23` e `ABC1234`, as do card). Nunca placa vista na rua ou em foto.

API, edição (F03d, card F10, revisão 6, vigente):

* **Carregar e copiar, nunca montar (U1).** O service faz `findById(id)` primeiro: ausente dá 404 `Cliente nao encontrado`, com mensagem fixa e sem o id. Depois copia os campos para a entidade carregada com um método do `ClienteMapper` com `@MappingTarget`, ignorando `id` e `createdAt` de forma explícita e com `unmappedTargetPolicy = ReportingPolicy.ERROR`, com as mesmas normalizações do `toEntity` (sem copiar o código). Proibido `new Cliente` ou `toEntity(request)` com `setId(id)` seguido de `save`: no id inexistente o `merge` não dá 404, e no existente passa a depender do mapper para não zerar o que não veio.
* **Id só do caminho (US-CLI-30).** `@PathVariable @Positive Long id`. O `ClienteRequest` não tem `id`, e o Jackson do Boot ignora propriedade desconhecida. Teste do lado de quem ataca: PUT no cliente A com `"id"` do cliente B, `"createdAt"` e `"cliente": {"id": ...}` no corpo responde 200, altera só A e, pelo `JdbcTemplate`, B fica intacto e o `created_at` de A não muda. Se alguém ligar `FAIL_ON_UNKNOWN_PROPERTIES`, esse teste quebra, e a decisão volta para o CARTOGRAFO.
* **409 pelo índice (U2, U3, U6).** O mesmo ponto único de gravação do ADR-020 (`gravar`, com `saveAndFlush` dentro de `try`), agora traduzindo `uk_clientes_cpf` para `CpfJaCadastradoException` e `uk_clientes_email` para a exceção de email (subclasse de `ConflitoException`), pelo nome da restrição, com exceção sem causa e sem `getMessage()`. Violação de outra restrição segue como hoje. A transação faz rollback, e o cliente fica como estava (critérios 4 e 6), provado pelo `JdbcTemplate`.
* **Corrida (critério 8, U6).** O IT dispara PUT simultâneos de clientes diferentes para o mesmo CPF, para o mesmo email e no caso cruzado (A recebe o CPF de B enquanto B recebe o email de A). Nenhum pode dar 500. Se aparecer deadlock (MySQL 1213, `CannotAcquireLockException`), ele é tratado no handler global com mensagem fixa e sem `getMessage()`. O status (409 ou nova tentativa no service) é decisão do CARTOGRAFO.
* **Email gravado normalizado (U4).** `strip()` e minúsculas só em `A` a `Z` ASCII, no POST e no PUT, pelo mesmo método do mapper. Proibido `toLowerCase`.
* **Respostas.** 200 com `ClienteDetalheResponse` (que já tem o `toString()` do B1) e `Cache-Control: no-store` afirmado no teste. 409 com `mensagem` exatamente `CPF ja cadastrado` ou `Email ja cadastrado`, corpo e cabeçalhos sem o valor nas duas formas (como enviado e como gravado) e sem o id do outro cliente. 400 com o campo pelo nome do JSON, sem valor rejeitado (E5). 401 antes do controller, sem linha de log.
* **Exemplos do OpenAPI.** No `ClienteRequest`, o CPF (`123.456.789-00`, dígito verificador inválido) e o email (`@example.com`) já são fictícios. O telefone troca para DDD que não existe (U9). O exemplo de 409 usa só as mensagens fixas.

App (F35):

* Não logar a URL da busca nem o termo (`console`, ferramenta de erro futura).
* Não persistir lista nem detalhe de cliente em disco (`AsyncStorage`, cache de arquivo). Só memória, limpa no logout.
* Campo de busca sem sugestão automática do teclado guardando histórico, quando a plataforma permitir (`autoComplete="off"`, `autoCorrect={false}`).

App, detalhe (F03b ou F35, conforme a decisão D-A do PRD):

* CPF na tela sempre mascarado. O formato é a decisão D-C (pessoa, com ESQUADRO). Parecer do VIGIA: usar o mesmo da 6.2.1, `***.*56.7**-**`, que mostra 3 dígitos contra 5 do formato do card (`123.***.***-00`) e deixa uma regra só para tela e log. A função da tela segue as mesmas regras de entrada da 6.2.1: só dígitos ASCII, exatamente 11, senão "Não informado" e nunca o valor cru (US-CLI-DET-10).
* Rótulo acessível do CPF sem soletrar os dígitos ocultos e sem ler o CPF inteiro (o leitor de tela fala em voz alta). O texto exato é do ESQUADRO e precisa acompanhar o formato escolhido em D-C; o exemplo do card ("começa em 123 e termina em 00") só serve se a pessoa escolher o formato do card.
* O CPF completo recebido da API fica só na memória do hook do detalhe. Não vai para estado global persistido, `AsyncStorage`, cache de arquivo, `console`, parâmetro de rota nem deep link. Sai da memória ao sair da tela e no logout.

App, criação (F35, vinda da F03c; insumo do VIGIA para a tarefa 17 da F09):

* O formulário não grava rascunho em disco (`AsyncStorage`, `SecureStore`, cache de arquivo). No erro 500 ou na queda de rede, os dados ficam só na memória da tela. É isso que "erro 500 mantendo dados" quer dizer. A memória é limpa ao sair da tela, depois do 201 e no logout.
* Campos de CPF, telefone e email sem sugestão automática que guarde histórico (`autoComplete="off"`, `autoCorrect={false}`, `importantForAutofill="no"` no Android e `textContentType="none"` no iOS), quando a plataforma permitir.
* Nada do formulário vai para `console`, ferramenta de erro, parâmetro de rota ou deep link. Depois do 201, a tela navega para o detalhe só com o `id` da resposta.
* A tela mostra a mensagem do 400 por campo, como veio da API. Não monta mensagem com o valor digitado.
* Enquanto o funcionário digita, o CPF aparece inteiro, porque precisa ser conferido com o cliente. Depois do 201 vale a máscara da D-C no detalhe. A máscara de digitação é do ESQUADRO (F26).
* Aviso de privacidade (P4): quem usa o app é o funcionário, não o titular, então o aviso ao cliente vai no balcão (cartaz ou texto entregue) e, quando existir, na OS impressa (backlog). Conteúdo mínimo pelo art. 9º: quem é a controladora e o contato dela; para que serve cada dado (telefone e email para contato; CPF e endereço só para nota ou entrega); que CPF, email e endereço são opcionais; por quanto tempo o dado fica (seção 3); que não há compartilhamento; e como pedir acesso, correção ou eliminação (seção 5). O texto é do BUSSOLA. Um lembrete ao funcionário na tela é opcional e fica com o ESQUADRO.

App, veículos (F35, insumo da F04):

* Placa, marca, modelo e `clienteNome` ficam só na memória da tela. Nada em `AsyncStorage`, cache de arquivo, `console`, parâmetro de rota ou deep link: a rota do detalhe leva só o `veiculoId`.
* Campo de placa sem sugestão que guarde histórico (`autoComplete="off"`, `autoCorrect={false}`, `importantForAutofill="no"` e `textContentType="none"`), quando a plataforma permitir.
* A tela mostra a placa inteira, porque o funcionário confere com o carro. A máscara da 6.2.2 vale só para log.

Teste e ambiente local:

* Fixture só com dado fictício: nome inventado, telefone de 11 dígitos inventado, email em `@example.com`. Proibido copiar dado de produção para teste, seed ou captura de tela.
* Prefira telefone com DDD que não existe (20, 23, 25, 26 ou 29, por exemplo `20912345678`) e CPF com dígito verificador inválido (`12345678900`). Um celular de 11 dígitos inventado pode ser de alguém, e um CPF com dígito válido pode existir. Isso pesa mais em captura de tela, demonstração e na futura integração com WhatsApp.
* Placa de teste inventada, nunca de carro real nem tirada de foto ou de captura de tela.

## 8. Achados AppSec do desenho da F03a

Revisão feita por leitura de código na `origin/main` (11f35b3), antes de existir código de Clientes. Nada foi executado contra endpoint de cliente, porque ele ainda não existe. Reconferido por leitura em 2026-11-17 na `origin/main` dfab787: A0 (pom com Boot 4.1.0) e A1 (handler sem tratamento de validação de parâmetro) continuam abertos.

Reconferido por leitura do código na revisão 2 (2026-11-17, `origin/main` b1f29fc): **A0 fechado**, o pom da `main` está em Boot 4.1.2 (PR #14). **A1 fechado**, o `GlobalExceptionHandler` trata `HandlerMethodValidationException`, `ConstraintViolationException` e `MethodArgumentTypeMismatchException` com mensagem só com o nome do parâmetro (PR #18; o 400 em si não foi executado por mim, a prova é do CRIVO na F03a). **A5 fechado**, o `handleUnexpected` loga só a classe e o caminho. A2, A3, A4, A6, A7 e A8 não foram reavaliados nesta revisão.

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| A0 | Crítica (já conhecida) | A06 | `apps/api/pom.xml` da `main` ainda usa Spring Boot 4.1.0, com CVE crítica (osv-scanner na F44: 7 críticas e 11 altas). A correção para 4.1.2 entrou no ramo `fix/f44-main-compilando` pelo PR #13, mas a `main` só recebe com o merge do PR #14 | O endpoint novo de clientes nasceria sobre Tomcat e spring-webmvc vulneráveis | Não mergear o código da F03a antes do PR #14, ou rebasear a F03a sobre ele. Regra da casa: dependência com vulnerabilidade conhecida bloqueia o merge | Pessoa (merge do #14), ESPRESSO (rebase) |
| A1 | Média, bloqueia US-CLI-03a | A05 | `GlobalExceptionHandler` só trata `MethodArgumentNotValidException`. Validação de `@RequestParam` (`HandlerMethodValidationException`, `ConstraintViolationException`), `page=abc` (`MethodArgumentTypeMismatchException`) e parâmetro ausente caem no `@ExceptionHandler(Exception.class)` | `size=0`, `size=101`, `page=-1` ou `q` com 101 caracteres respondem 500 em vez de 400. Mesmo padrão já visto pelo CRIVO na F44 (JSON malformado vira 500) | Handlers para essas exceções devolvendo 400 no formato global, com mensagem fixa ou só nome do parâmetro, nunca o valor rejeitado. Teste MockMvc para cada caso | ESPRESSO |
| A2 | Média | A03 | Busca com `LIKE`: `%`, `_` e `\` no termo viram curinga se não forem escapados. O escape padrão do MySQL é `\` | Termo `%` lista a base inteira; termo com `\` pode quebrar a consulta | Parâmetro sempre ligado (nunca concatenado em JPQL ou SQL nativo); escapar `\`, `%` e `_` no service e declarar `ESCAPE` explícito na consulta. Teste de integração com `%`, `_` e `\` contra MySQL real (US-CLI-01a) | ESPRESSO |
| A3 | Média, risco aceito | A01 / A04 | Sem diferença de perfil (briefing) e com JWT de 7 dias sem revogação (ADR-004), qualquer token válido percorre a base inteira em páginas de 100 | Token vazado ou funcionário desligado com token ativo extrai nome, telefone e email de todos os clientes por até 7 dias | Aceito nesta fase. Mitigação vigente: linha de log com `usuarioId` e `total` (seção 6.3). Revisar expiração do JWT e perfil por endpoint quando entrar controle de permissão (backlog) | Pessoa (aceite), CARTOGRAFO (ADR quando houver permissão) |
| A4 | Média | A09 / LGPD | Dado pessoal na query string (`GET ?q=`) fica em access log, proxy e histórico | Termo com nome ou telefone gravado fora do controle da aplicação | Manter `GET` (contrato REST da casa) com as regras da seção 7: access log sem query string, HTTPS fora do local, app sem log de URL | ESPRESSO, ANCORA (proxy e deploy), ORLA (F35) |
| A5 | Baixa | A09 | `handleUnexpected` não loga nada | 500 sem rastro para investigar | Logar classe, caminho sem query e id da requisição (seção 7), com teste que prova que não sai mensagem de causa | ESPRESSO |
| A6 | Média (LGPD) | — | `ordens_servico` e `pagamentos` sem coluna de data na V2 | Prazo R1 impossível de calcular; dado de cliente com OS ficaria sem descarte | Data de abertura e entrega da OS e data do pagamento em migration aditiva nas features de OS e pagamento. Registrar na matriz do `overview.md` | CARTOGRAFO |
| A7 | Baixa | — | V2 não fixa `CHARACTER SET` nem `COLLATE` em `clientes`; depende do padrão do servidor (`mysql:8.4` usa `utf8mb4_0900_ai_ci`) | Em servidor com outra collation, a busca passa a diferenciar acento ou caixa (premissa P5) | Afirmar a collation no teste de integração ou fixá-la em migration aditiva | CARTOGRAFO |
| A8 | Baixa | A04 | `clientes.telefone` é `VARCHAR(20)` sem `CHECK` | Telefone gravado com máscara por outro caminho não casa na busca por dígitos (premissa P4) | Validação de 10 ou 11 dígitos na F03c e, se o CARTOGRAFO aprovar, `CHECK` em migration aditiva | CARTOGRAFO, ESPRESSO (F03c) |

Conferido sem achado: `SecurityConfig` exige autenticação em tudo fora de `PUBLIC_PATHS` (`anyRequest().authenticated()`), então `/api/v1/clientes` já responde 401 sem token pelo `RestAuthenticationEntryPoint` (US-CLI-06a), desde que a rota não seja incluída em `PUBLIC_PATHS`. O DTO `ClienteListResponse` previsto (id, nome, telefone, email) cumpre a minimização da lista.

## 8.1 Parecer e achados AppSec do detalhe (F03b, revisão 2)

Escopo revisado: PRD `docs/product/F03b-clientes-detalhe.md` (21a8b9c), ADR-018, ADR-019 e contrato e threat model do detalhe em `docs/architecture/overview.md` (2b25de1), e o código da `main` b1f29fc que o detalhe herda (`SecurityConfig`, `JwtConfig`, `GlobalExceptionHandler`, `ClienteService`, `Cliente`, `MascaraDadoPessoal`, `application.yml`). O endpoint do detalhe ainda não existe; nada foi testado contra ele.

### Parecer

1. **CPF e telefone completos no detalhe autenticado: cobertos pela política** (seção 2 revisada). O CPF inteiro sai só em `GET /api/v1/clientes/{id}`, para token válido, porque a F03d pré-preenche a edição com ele. Separar o CPF numa chamada própria (dúvida 3 do card) não reduz a exposição: o mesmo token chamaria a outra rota. Condições, todas obrigatórias na F08: linha de log 6.4 no 200 e no 404, `Cache-Control: no-store` provado no teste de controller, `toString()` do DTO sem dado pessoal (B1), app sem persistir o detalhe (seção 7) e aceite do risco B2 pela pessoa.
2. **O mascaramento de log vale para o endpoint novo**: as seções 6.1 a 6.3 cobrem `/api/v1/clientes/**` e a 6.4 fixa as linhas exatas do detalhe.
3. **Linhas de `cpf` e `endereco` aprovadas** (seção 2) e registradas no `lgpd-registro-dados-pessoais.md`. A V4 pode ser escrita pelo ESPRESSO depois do aceite do ADR-018 pela pessoa.
4. **Divergências do card, vale a política**: máscara de log (card `123.***.***-00` e `(**) *****-5678`; política `***.*56.7**-**` e `*******5678`), base legal do CPF (card art. 7º, V; política II) e retenção (card "enquanto ativo"; política R1 e R2). O CRIVO testa contra a política e o PRD, não contra o card.
5. **D-C (máscara na tela)**: parecer na seção 7, "App, detalhe". A decisão é da pessoa com o ESQUADRO.

### Evidência executada (2026-11-17)

Ambiente descartável: imagem da API construída pelo `apps/api/Dockerfile` a partir do código da `main` b1f29fc, `mysql:8.4` com as migrations V1 a V3 aplicadas pelo Flyway, `JWT_SECRET` aleatório gerado na hora e apagado depois, dois clientes fictícios. Tokens montados à mão para o lado de quem não deveria entrar. Contêineres, rede e imagem removidos ao final.

| Tentativa | Resultado observado |
|---|---|
| `GET /api/v1/clientes/1` sem token | 401 no formato do ADR-011, `mensagem` "Nao autenticado" |
| Mesmo, com token assinado por outra chave | 401 |
| Mesmo, com token expirado | 401 |
| Mesmo, com token `alg: none` sem assinatura | 401 |
| `GET /api/v1/clientes?size=5` com token válido | 200; `Cache-Control: no-cache, no-store, max-age=0, must-revalidate`; `email` nulo sai como `"email":null` |
| `GET /api/v1/clientes/1` e `DELETE /api/v1/clientes/1` com token válido (rota ainda não existe) | 404 "Recurso nao encontrado", com `no-store` |
| `GET /api/v1/clientes/%2e%2e/1` e `/api/v1/clientes/1;x=1` com token válido | 401 com `path` `/error` e **sem** cabeçalhos de segurança (achado B3) |
| Log da API depois das chamadas | uma linha `clientes.listar qLen=0 page=0 size=5 total=2 usuarioId=7`; `grep -c` de nome, telefone e email fictícios no log: 0 |
| `osv-scanner` no `api.jar` construído (108 pacotes de runtime) | nenhuma vulnerabilidade |
| `osv-scanner` no `pom.xml` | 2 médias em `commons-compress` 1.24.0 (achado B5); 15 pacotes sem versão no pom não foram resolvidos por essa leitura |

O que isso prova para o detalhe: a cadeia de segurança e os cabeçalhos que ele herda. Que o 200 do detalhe leva `no-store` e nulos presentes é inferência a partir da lista, até o teste da F08 provar (US-CLI-DET-02 e 14).

### Achados

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| B1 | Baixa, **fechado** na revisão do código da F08 (8.2) | A09 / LGPD | `ClienteDetalheResponse` e `ClienteListResponse` são `record`, e o `toString()` gerado imprimia todos os campos (CPF e endereço no detalhe; nome, telefone e email na lista) | Um log em DEBUG do DTO, ou o Spring MVC em DEBUG, que escreve o corpo com `toString()`, gravaria o CPF inteiro em log | Feito: os dois `record` sobrescrevem `toString()` e mostram só o nome do tipo e o id, e o builder de `Cliente` devolve texto fixo. Testes: `ClienteDetalheResponseTest`, `ClienteListResponseTest` e `ClienteDetalheServiceTest.shouldHideCpfAndAddressFromBuilderToString` | ESPRESSO (F08, commits `598962e`, `b180f9b` e `c063e8c`) |
| B2 | Média, risco a aceitar | A01 / A04 | Extensão do A3: com o detalhe, qualquer token válido (FUNCIONARIO ou ADMIN, até 7 dias, sem revogação) lê CPF e endereço inteiros, um id por vez; ids sequenciais permitem varrer a base | Token vazado ou de funcionário desligado extrai CPF e endereço de todos os clientes com CPF gravado (a partir da F09) | Aceite da pessoa registrado na PR da F08. Mitigação vigente: linhas 6.4 com `usuarioId` no 200 e no 404. Quando entrar permissão por perfil (backlog): CPF inteiro só para quem edita, e revisar a expiração do JWT (ADR-004) | Pessoa (aceite), CARTOGRAFO (ADR futuro) |
| B3 | Baixa (já existia) | A05 | Requisição recusada pelo `StrictHttpFirewall` (`%2e%2e`, `;` no caminho) vira 401 em `/error`, mesmo com token válido, e a resposta sai sem `Cache-Control`, `X-Frame-Options` e `X-Content-Type-Options` | Status enganoso (devia ser 400) e resposta sem cabeçalho de segurança. O corpo não tem dado pessoal, por isso a severidade é baixa | Bean `RequestRejectedHandler` que responde 400 no formato do ADR-011, reaproveitando o escritor de JSON do `RestAuthenticationEntryPoint`, com teste MockMvc para os dois caminhos. Não bloqueia a F08 | ESPRESSO, numa fatia de hardening a decidir pela pessoa |
| B4 | Baixa | A04 | O `CHECK` da V4 valida formato (11 dígitos), não o dígito verificador | Script direto no banco grava CPF inválido; a tela mostra um CPF que não existe | Validação de dígito verificador na API da F09 (Bean Validation própria) com teste. Nada a fazer na F08, que não escreve | ESPRESSO (F09) |
| B5 | Baixa | A06 | `commons-compress` 1.24.0 (GHSA-4265-ccf5-phj5, CVSS 6.7; GHSA-4g9r-vxhx-9pgx, CVSS 5.9; corrigidas na 1.26.0), resolvida pelo `osv-scanner` a partir do `pom.xml`. Não está no jar de runtime; a origem provável é o Testcontainers (escopo de teste), não confirmada com `dependency:tree` | Só a máquina de build e o CI ficam expostos, e só com arquivo comprimido malicioso. Pela regra da casa, média não bloqueia o merge | Fixar `commons-compress` 1.26.0 ou superior no `dependencyManagement`, depois de confirmar a origem com `./mvnw dependency:tree -Dincludes=org.apache.commons:commons-compress` | ANCORA |
| B6 | Baixa | LGPD | Não havia prazo de retenção para log de aplicação; as linhas 6.3 e 6.4 têm `usuarioId` e `clienteId` | Log guardado sem prazo vira cópia de rastreio sem descarte | Prazo proposto na seção 7 (90 dias, acesso só ADMIN), pendência P7 | ANCORA, pessoa |

Conferido sem achado: o `JwtDecoder` fixa HS256 e recusa `alg: none` (provado acima); o caminho do detalhe fica fora de `PUBLIC_PATHS`; o `@PathVariable Long` com `@Positive` só deixa passar número positivo, e o `findById` do Spring Data é consulta parametrizada pela chave (sem SQL montado à mão); a mensagem fixa do 404 do ADR-019 não repete o id; o 500 não loga `getMessage()`; `show-sql`, bind do Hibernate e access log continuam desligados no `application.yml`; o DDL da V4 recusa valor inválido sem ecoar o valor na mensagem do MySQL (prova do CARTOGRAFO no ADR-018, não refeita por mim).

### 8.2 Revisão do código da F08 (2026-11-17)

Ramo `feat/f03b-clientes-detalhe` no commit `eb62813`. A PR #22 aponta para `a1295e1`, e os commits `c063e8c`, `735d3e4`, `eb62813` e o desta revisão ainda estão sem push. Ambiente: imagem do `Dockerfile` da API, `mysql:8.4` em rede Docker isolada, `JWT_SECRET` aleatório descartável, usuário FUNCIONARIO e dois clientes fictícios, um com CPF `12345678900`, telefone `11912345678`, email e endereço, e outro só com nome. O token veio do login real.

| Chamada | Resultado |
|---|---|
| `GET /api/v1/clientes/1` com token | 200 com os seis campos, CPF e telefone inteiros, `Cache-Control: no-cache, no-store, max-age=0, must-revalidate` |
| `GET /api/v1/clientes/2` (sem opcionais) | 200 com `cpf`, `telefone`, `email` e `endereco` presentes como `null` |
| `GET /api/v1/clientes/999999` | 404 "Cliente nao encontrado" no formato do ADR-011, com `no-store`, sem dado pessoal |
| `GET /api/v1/clientes/%20` e `/abc` | 400 "Parametro invalido: id", sem o valor rejeitado (F-1 corrigido) |
| `GET /api/v1/clientes/%2520` | 401 em `/error`, sem cabeçalhos de segurança: é o B3, que já existia, e não o 400 de corpo vazio que o MockMvc mostrou ao ESPRESSO |
| Sem token e com token de assinatura inválida | 401 "Nao autenticado" |
| Token do mesmo usuário depois de `ativo=0` no banco | **200 com o CPF inteiro**: o JWT não é revogado e vale até expirar (7 dias). Agrava o B2, e entra no aceite P8 |
| Log depois das chamadas | cinco linhas de cliente, só com `clienteId`, `usuarioId` e `qLen`: `clientes.detalhar` no 200, `clientes.detalhar.naoEncontrado` no 404, `clientes.listar` na busca por telefone. O 400 e o 401 não geram linha. O `grep -c` de CPF, de telefone (completo, trecho e mascarado), de `***`, do nome, do email, do endereço e das credenciais fictícias deu 0 |
| `git grep` das chamadas de log em `apps/api/src/main` | só as três do `ClienteService` e o erro inesperado do handler |
| `osv-scanner` no `pom.xml` | igual à revisão 2: só o B5 (2 médias em `commons-compress` 1.24.0), e 15 pacotes sem versão no pom não foram resolvidos. O ramo não muda nenhuma dependência em relação à `main` |

Achados novos desta revisão, já corrigidos pelo ESPRESSO a pedido do VIGIA, com teste:

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção | Commit |
|---|---|---|---|---|---|---|
| C1 | Baixa | A09 / LGPD | B1 incompleto: o `ClienteListResponse` seguia com o `toString()` gerado | Um log em DEBUG da lista gravaria nome, telefone e email de até 100 clientes por página | `toString()` só com o id e `ClienteListResponseTest` | `c063e8c` |
| C2 | Baixa | A09 / A05 | O handler do F-1 transformava em 400 todo `MissingPathVariableException`, inclusive o do mapeamento de rota errado, que é defeito do servidor | Um erro de rota futuro sairia como 400 "Parametro invalido", sem log ERROR, e ninguém veria | Só `isMissingAfterConversion()` vira 400. O resto segue para o erro inesperado (500 com log da classe e do caminho). Teste novo no `GlobalExceptionHandlerTest`, e o IT do `%20` continua verde | `735d3e4` |

Conferido sem achado: o caminho do detalhe fica fora de `PUBLIC_PATHS`, o `findById` é parametrizado, o 404 não repete o id, o exemplo de CPF do OpenAPI tem dígito verificador inválido e nenhuma linha de log tem `getMessage()`. O CPF completo no detalhe segue a decisão da seção 2 e o aceite P8.

O critério US-CLI-DET-11 do card pede máscara no log. A política manda não logar, e o log real mostrou zero ocorrências, nem mascaradas. Confirmar esse desvio do card é decisão da pessoa (D-F do PRD), e não muda esta política.

### 8.3 Parecer e achados AppSec da criação (F03c, card F09, revisão 3)

Escopo revisado por leitura, no ramo `feat/f03b-clientes-detalhe` (`e7cf509`, com o B1 e a C2 da F08): o card da F09 com os ajustes da revisão humana de 17/11, `V2` e `V4`, `GlobalExceptionHandler`, `SecurityConfig`, `ClienteController`, `Cliente`, `MascaraDadoPessoal`, `LoginRequest`, `application.yml` e a matriz de reconciliação do `overview.md`. **O endpoint de criação ainda não existe**: nenhum commit da F03c neste ramo nem em outro ramo local. Então nada foi executado contra o POST, e os achados abaixo são de desenho, para o ESPRESSO corrigir antes de escrever o código.

Premissa 6 do card ("CPF e endereço não existem na V2", "migration com as colunas que faltam"): **desatualizada, conferido por leitura.** A V2 já tem `telefone VARCHAR(20) NULL` e `email VARCHAR(190) NULL`, e a V4 da F08 criou `cpf VARCHAR(11) NULL` com `CHECK` e `endereco VARCHAR(255) NULL`. Não falta coluna. A única migration nova da F03c é o `CHECK` do telefone (A8, E8), mais o índice único do CPF quando a P10 entrar. Provar que ela roda sobre V1 a V4 é do ESPRESSO, com Testcontainers, como no `ClienteDetalheIT`. As colunas aguentam os limites do card: `nome` 150 e `email` 190 no banco, contra 120 no DTO.

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| E1 | Média | LGPD (art. 6º, III) | O card põe o CPF como obrigatório (tarefa 3, US-CLI-16), contra a política (opcional, base II) | CPF de todo cliente, inclusive de quem só pediu orçamento, sem finalidade. O dado mais sensível da tabela passaria a existir para todo cadastro e ficaria legível por qualquer token (B2) | CPF opcional na API e fora dos exemplos de obrigatório do US-CLI-16. Ou o fundamento fiscal escrito, se a pessoa decidir o contrário (2.2, P9) | Pessoa, BUSSOLA |
| E2 | Média | A05 | `HttpMessageNotReadableException` e `HttpMediaTypeNotSupportedException` não têm handler e caem no 500 (achado da F44 no login e RH-A3 do ADR-017, conferido por leitura e não reexecutado aqui) | POST com JSON malformado ou com objeto no lugar de texto em `cpf` responde 500 e gera log ERROR. A F35 trataria como erro do servidor, e o 500 vira ruído fácil de provocar | Handlers de 400 e 415 com mensagem fixa (`Corpo da requisicao invalido` e `Tipo de conteudo nao suportado`), sem log e sem `getMessage()`, com teste MockMvc. Na F03c, porque o POST é a primeira rota com corpo depois do login | ESPRESSO |
| E3 | Média | A03 / A04 | Risco de desenho: normalizar com "remove tudo que não é dígito", como faz a máscara de log, aceita letras | `123abc45678901` passa como CPF de 11 dígitos, contra o US-CLI-17, e grava um CPF que o titular não informou | Lista de caracteres aceitos antes de normalizar (seção 7, "API, criação"), com testes de letra no meio, dígito arábico-índico e dígito de largura total | ESPRESSO |
| E4 | Alta se acontecer (preventivo) | A01 / A08 | Atribuição em massa: se o DTO ou o mapper deixar `id` chegar à entidade, `save` vira `merge` | Qualquer token sobrescreve nome, CPF e telefone de outro cliente mandando `"id"` no POST: acesso ao objeto de outra pessoa, que o teste de 401 não pega | DTO sem `id`, `@Mapping(target = "id", ignore = true)`, `unmappedTargetPolicy = ERROR` e teste de ataque (seção 7) | ESPRESSO |
| E5 | Baixa | A04 / A09 | O 400 de corpo usa só `getDefaultMessage()`. A mensagem padrão não identifica o campo, e a do `@Pattern` expõe a regex | US-CLI-16 a 20.4 não conseguem identificar o campo, e a F35 não consegue apontar o erro | `message` explícito com o nome do campo em toda anotação do DTO de criação, sem mudar o handler (o login já segue esse padrão) | ESPRESSO |
| E6 | Média, risco a aceitar | A01 / A07 | O B2 vale para escrita: o token de usuário com `ativo=0` continua válido até expirar (7 dias). A leitura foi provada na 8.2. A escrita passa pela mesma cadeia, mas é inferência, porque o POST não existe | Ex-funcionário cria cadastros falsos ou grava dado de terceiros por até 7 dias | Aceite junto com a P8. Correção de verdade: no conversor do JWT, conferir `usuarios.ativo` a cada requisição (uma consulta pela chave). ADR do CARTOGRAFO antes do primeiro cliente real. A linha 6.5 com `usuarioId` mitiga | Pessoa, CARTOGRAFO |
| E7 | Baixa, **decidido na revisão 4** | LGPD | O CPF repetido era aceito de propósito na F03c (US-CLI-20.6, provisório) | Se fosse para produção assim, o pedido do titular acharia um cadastro só e a anonimização deixaria cópia viva | Índice único e 409 na própria F03c, pelo ADR-020 (2.1, itens 1 e 2) | ESPRESSO (código e IT), pessoa (aceite do ADR-020) |
| E8 | Baixa | A04 | Confirma o A8: `clientes.telefone` sem `CHECK` | Outro caminho (script, F03d) grava telefone com máscara, e a busca por dígitos da F03a não acha | `CHECK (CHAR_LENGTH(telefone) BETWEEN 10 AND 11 AND telefone NOT REGEXP '[^0-9]')`, que deixa passar NULL como o da V4. Antes, contar as linhas fora do formato sem mostrar o valor | ESPRESSO, CARTOGRAFO |

Conferido sem achado, por leitura:

* `SecurityConfig`: `/api/v1/clientes` fica fora de `PUBLIC_PATHS`, e `anyRequest().authenticated()` cobre o POST. A cadeia de 401 (sem token, outra chave, expirado, `alg: none`) foi provada com GET na revisão 2. A prova no POST é do CRIVO.
* CSRF desligado está correto: o token vai no cabeçalho `Authorization`, sem cookie de sessão. Sem CORS configurado, navegador de outra origem é bloqueado, e o app nativo não é afetado.
* `veiculos.placa` não tem índice único, então a anonimização pode repetir `ANONIMO` (superado na revisão 5: placa única e marcador `ANON<id>`, 2.4). `clientes.telefone` é NULL, então a anonimização pode gravar NULL.
* Segredo: `gitleaks git --log-opts=main..HEAD` em 111 commits não achou vazamento.
* Dependências: a F03c não precisa de dependência nova (Bean Validation, MapStruct e Flyway já estão no pom). Vale o `osv-scanner` da 8.2 (só o B5) enquanto o `pom.xml` não mudar. O `osv-scanner` não está instalado nesta máquina hoje: se o pom mudar, o CRIVO ou o ANCORA roda de novo.

### 8.4 Revisão 4 (F09, 2026-11-18): índice único contra a anonimização

Escopo: decidir se a premissa 3 da F09 cai em favor do ADR-020 (decidido: cai, seção 2.1) e consolidar retenção e descarte (3.1). Não revisei nem executei o código da F03c, que segue sem commit neste ramo. Li só o `ClienteService` em andamento (diff local, ver observação abaixo).

Ambiente: contêiner `mysql:8.4` (8.4.13) descartável, `--network none`, sem porta publicada, sem volume, removido no fim com `docker rm -f`. Apliquei V1 a V5 deste ramo pelo cliente `mysql`, a partir dos arquivos; a V5 ainda está sem commit. Não usei o Flyway: a prova de que a V6 roda pelo Flyway com `ddl-auto: validate` é do IT do ESPRESSO. Dados fictícios, com DDD 20, que não existe: `Ana Exemplo` (CPF `12345678900`, telefone `20912345678`) e `Bia Exemplo` (CPF `98765432100`, telefone `20987654321`).

| Passo | Saída real |
|---|---|
| Contagem de duplicados antes do índice (2.1, item 4) | `cpf_duplicados 0` |
| `ALTER TABLE clientes ADD CONSTRAINT uk_clientes_cpf UNIQUE (cpf)` | Aplicado. Restrições de `clientes`: `ck_clientes_cpf_digitos CHECK`, `ck_clientes_telefone_digitos CHECK`, `PRIMARY`, `uk_clientes_cpf UNIQUE` |
| Ana anonimizada por completo; Bia em parte (contato NULL, nome e CPF retidos) | `1 Cliente anonimizado tel_null=1 cpf_null=1` e `2 Bia Exemplo tel_null=1 cpf_null=0` |
| Ana volta com o mesmo CPF | `caso1_inseridas 1` |
| Bia volta com o mesmo CPF | `ERROR 1062 (23000) at line 1: Duplicate entry '98765432100' for key 'clientes.uk_clientes_cpf'` |
| A nova Ana também anonimizada por completo | `linhas_cpf_null 2` e `total 3`: dois NULL convivem no índice |

A mensagem 1062 repete o CPF inteiro, como o CARTOGRAFO já tinha visto no ADR-020. Isso reforça as regras 4 e 6 do ADR: nada de `getMessage()`, e a exceção do 409 vai sem causa.

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| E9 | Baixa | LGPD / A04 | Com o índice, o titular anonimizado em parte (CPF retido dentro de R1) que volta como cliente recebe 409 | O funcionário contorna o 409 gravando o cadastro sem CPF (duplicado da mesma pessoa) ou apagando o CPF retido (quebra a obrigação fiscal) | Conduta da 2.3: reusar o cadastro retido pela edição (F03d). A API não muda. Entra no procedimento da P2 e no texto do BUSSOLA para a F35 (P12) | BUSSOLA (texto), ESPRESSO (P2) |

Observação de leitura sobre o código em andamento, sem execução: o `criar` do `ClienteService` grava com `clienteRepository.save(...)` direto, e o Javadoc diz "Nao checa CPF repetido: comportamento provisorio ate a decisao D2/P10". Com a revisão 4, o método passa a seguir as regras 3 a 6 do ADR-020: método privado único com `saveAndFlush` dentro de `try`, tradução só de `uk_clientes_cpf`, sem causa e sem `getMessage()`, e Javadoc atualizado.

### 8.5 Parecer e achados AppSec de Veículos (F04, revisão 5)

Escopo revisado por leitura, no ramo `feat/f03c-clientes-criar` (`f119c67`): o card da F04, o repasse do BUSSOLA, `V2` a `V6`, `Veiculo`, `MascaraDadoPessoal`, `GlobalExceptionHandler`, `ClienteService` (método `gravar`), `SecurityConfig`, `application.yml` e a matriz do `overview.md`. O código da F04 ainda não existe, então nada foi executado contra endpoint de veículo. Os achados são de desenho, para o ESPRESSO resolver no código.

Decisão do D1 do PRD (contradição entre o card e a política): **vale o card na unicidade** (placa única com 409) e na máscara de log (`****D23`, pelo contrato da 6.2.2). **Vale a política no descarte**, com o marcador `ANON<id>` no lugar de `ANONIMO`. Ficam revogados a linha `veiculos.placa` da 2.1 da revisão 3 e o "placa nunca em log, nem mascarada" da 6.2.

Evidência executada em 2026-11-18. MySQL 8.4 descartável (`mysql:8.4`, `--network none`, sem porta publicada e sem volume, removido com `docker rm -f`). V1 a V6 do ramo aplicadas pelo cliente `mysql`, não pelo Flyway, mais a V7 candidata abaixo. Dados fictícios: clientes `Ana Exemplo`, `Bia Exemplo` e `Caio Exemplo`, com DDD 20.

```sql
ALTER TABLE veiculos
  ADD CONSTRAINT uk_veiculos_placa UNIQUE (placa),
  ADD CONSTRAINT ck_veiculos_placa_formato
    CHECK (REGEXP_LIKE(placa, '^([A-Z]{3}[0-9][A-Z0-9][0-9]{2}|ANON[0-9]{1,6})$', 'c'));
```

| Passo | Saída real |
|---|---|
| Contagem de duplicados antes da V7 | `P0 0` |
| V7 aplicada | Restrições de `veiculos`: `ck_veiculos_placa_formato CHECK`, `fk_veiculos_cliente FOREIGN KEY`, `PRIMARY`, `uk_veiculos_placa UNIQUE`. Collation de `placa`: `utf8mb4_0900_ai_ci` |
| `ABC1234` e `BCD2E34` no cliente 1, `ABC1D23` no cliente 2 | `P2 3` |
| `ABC1D23` de novo | `ERROR 1062 (23000): Duplicate entry 'ABC1D23' for key 'veiculos.uk_veiculos_placa'`. A mensagem traz a placa inteira |
| `abc1d23`, `abc9z99`, `AB12345`, `ABC12D3`, `ABCD123`, `ANONIMO` e `ABC-1D2` | `ERROR 3819 (HY000): Check constraint 'ck_veiculos_placa_formato' is violated.` nos sete, sem o valor. `total 3` |
| Anonimização com texto fixo (`ANON0`) nos dois veículos do cliente 1 | `ERROR 1062 ... Duplicate entry 'ANON0'`. Nenhuma linha alterada |
| `CONCAT('ANON', id)` no cliente 1 e depois no cliente 2 | 2 linhas no cliente 1. Resultado: `ANON1`, `ANON2`, `ANON3`, com marca e modelo mantidos |
| `ABC1234` cadastrada de novo, para o cliente 3 | Aceita (`total 4`, `abc1234 1`): a placa foi liberada |
| Marcador do veículo de id 1000000 | `ERROR 1406 (22001): Data too long for column 'placa'`. Placa original mantida (`sql_mode` com `STRICT_TRANS_TABLES`) |

JDK 21.0.10, no `jshell`: `((char) 0x131 + "bc1d23").toUpperCase(Locale.ROOT)` dá `IBC1D23`; `Character.isLetterOrDigit(0xFF21)` e `Character.isDigit(0x661)` dão `true`; `"ABC" + (char) 0x661 + "D23"` casa com `\d` só em modo Unicode (`(?U)`).

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| V1 | Alta se acontecer (preventivo) | A01 / A08 | PUT montado como entidade nova com o `id` do caminho e `save` (`merge`), ou DTO com `clienteId` mapeado | Com `clienteId` mapeado, qualquer token move o veículo e todo o histórico de OS de uma pessoa para o cadastro de outra: o dono novo passa a ver as OS do antigo, e a anonimização do antigo deixa de alcançar a placa. Sem `clienteId`, o `merge` grava `cliente` nulo (500) e apaga a `quilometragem` em silêncio | Seção 7, "API, veículos", atribuição em massa. Teste do lado de quem ataca: PUT com `"clienteId"` de outro cliente, `"cliente": {"id": ...}` e `"id"` de outro veículo; depois, pelo `JdbcTemplate`, `cliente_id` original, o outro veículo intacto e a `quilometragem` semeada no banco mantida | ESPRESSO |
| V2 | Alta se acontecer (preventivo) | A01 / A08 | O mesmo risco no POST, como o E4: `"id"` de veículo existente no corpo vira `merge` | Qualquer token sobrescreve placa, marca e modelo do veículo de outro cliente | DTO sem `id`; mapper de criação com `id` e `cliente` ignorados; cliente só do caminho. Teste: POST com `"id"` de veículo existente e `"clienteId"` diferente do caminho cria veículo novo no cliente do caminho e não altera o existente | ESPRESSO |
| V3 | Média | A09 / LGPD | O erro 1062 do MySQL traz a placa inteira (provado acima) | Se o 409 usar `getMessage()`, propagar a causa ou se o log do Hibernate for religado, a placa inteira vai para o log ou para a resposta, contra o critério 24 | Seção 7 (409) e 6.6. Teste de captura de log no 409 e na corrida de 10 POST: nenhuma ocorrência da placa inteira, só `****D23` | ESPRESSO |
| V4 | Média | A03 / A04 | Normalização com `toUpperCase` ou `Character.isLetterOrDigit` antes de restringir os caracteres (provado no JDK acima) | `ıBC1D23` grava `IBC1D23`, placa que o funcionário não digitou. Letra de largura total e dígito de outro alfabeto criam ambiguidade na unicidade e na busca por placa da F06 | Ordem da seção 7. Teste em tabela com `ıBC1D23`, letras de largura total, `ABC` + U+0661 + `D23`, tab, espaço não separável e 21 caracteres: 400 em todos, sem o valor no corpo | ESPRESSO |
| V5 | Média | LGPD | A anonimização da política gravava `ANONIMO`, incompatível com o índice único (provado: falha no primeiro cliente com dois veículos) | A rotina da P2 falharia, e o titular ficaria sem descarte | Marcador `ANON<id>` (2.4 e seção 4), decidido nesta revisão. O script da P2 é revisado pelo VIGIA | VIGIA (feito), ESPRESSO (P2) |
| V6 | Baixa | A04 | `veiculos.placa` sem `CHECK` na V2 | Um script ou uma rota futura grava `ABC-1D23` ou placa com espaço. O índice compara o texto, então essa linha não colide com `ABC1D23` e o duplicado entra | `CHECK` da V7 com `'c'` (seção 7), provado acima | ESPRESSO, CARTOGRAFO |
| V7 | Baixa, risco a aceitar | A01 | O 409 responde se uma placa é de cliente da oficina | Qualquer token confirma se um carro é atendido ali. Não abre nada novo: o mesmo token lê todos os veículos percorrendo os ids (B2) | Aceite junto com a P8. Mitigação: linha 6.6 do 409 com `usuarioId` | Pessoa |
| V8 | Baixa | A09 / LGPD | `record` de entrada e de saída e o builder de `Veiculo` imprimem placa e `clienteNome` no `toString()` gerado | Um log em DEBUG, ou o Spring MVC em DEBUG, grava a placa inteira | Seção 7 (`toString()`), com teste | ESPRESSO |
| V9 | Média, risco a aceitar até a P13 | LGPD / A04 | Placa única sem troca de dono: o veículo vendido com o dono antigo ativo dá 409 para o dono novo | Pressão no balcão para contornar (placa alterada, carro no cadastro errado), o que mistura dado e histórico de duas pessoas | Conduta da 2.4 e P13 | Pessoa (aceite), BUSSOLA e CARTOGRAFO (P13) |
| V10 | Baixa | A04 | Edição simultânea sem `@Version`: a última gravação vence | Uma correção de placa pode ser desfeita por outra edição aberta antes, sem aviso | Aceitável no porte atual. Se o CARTOGRAFO quiser, `@Version` em migration aditiva numa fatia futura | CARTOGRAFO |

Conferido sem achado, por leitura:

* `SecurityConfig`: `anyRequest().authenticated()` e `PUBLIC_PATHS` só com login, OpenAPI e `health`. `/api/v1/veiculos/**` e `/api/v1/clientes/{id}/veiculos` exigem token sem configuração nova. A prova do 401 nas quatro rotas, com o `COUNT(*)` sem mudar, é do IT da F04 (critério 11).
* O `application.yml` da F03c já desliga o log de erro JDBC do Hibernate, que escreveria o 1062.
* A F04 não precisa de dependência nova: Bean Validation, MapStruct e Flyway já estão no pom. Vale o `osv-scanner` da 8.2 enquanto o `pom.xml` não mudar. Não reexecutei.
* Segredo: a F04 não cria configuração nova. Vale o ADR-009.

### 8.6 Parecer e achados AppSec da edição (F03d, card F10, revisão 6)

Escopo revisado por leitura no ramo `feat/f04-veiculos` (commit `7250be2`, que contém a F03c e a F04): `ClienteRequest`, `ClienteService`, `ClienteMapper`, `Cliente`, `ConflitoException`, `GlobalExceptionHandler` (só o ponto do 409), migrations V2, V3 e V6, `application.yml` (loggers de JDBC) e ADR-021. O PUT ainda não existe. Nada foi executado contra ele.

#### Evidência executada (2026-11-18)

MySQL 8.4 descartável em contêiner, com a tabela `clientes` da V2 (colunas `id`, `nome`, `email`) e o `CONVERT` da V3, e só emails fictícios em `@example.com`. Contêiner removido ao final.

| Tentativa | Resultado observado |
|---|---|
| Inserir `ana@example.com` e `Ana@Example.com`, `joão@example.com` e `joao@example.com`, e dois NULL, e contar duplicados com `GROUP BY email HAVING COUNT(*) > 1` | 2 grupos: `A,B` e `E,F`. A collation junta caixa e acento |
| `ADD CONSTRAINT uk_clientes_email UNIQUE (email)` com os duplicados | `ERROR 1062 (23000): Duplicate entry 'ana@example.com' for key 'clientes.uk_clientes_email'`. A mensagem traz o email inteiro |
| Mesmo índice depois de remover os duplicados | Criado. Com 2 NULL, e depois com 3 |
| Inserir `ana@example.com ` (espaço no fim) com o índice | Aceito como valor diferente (NO PAD) |
| Inserir `kai@example.com` e depois o mesmo com U+212A (Kelvin) no lugar do `k` | `ERROR 1062`, com o valor na mensagem |

JDK 21.0.10 (`jshell`):

| Expressão | Resultado |
|---|---|
| `"  Ana@Example.COM ".strip().toLowerCase(Locale.ROOT)` | `ana@example.com` |
| U+212A `.toLowerCase(Locale.ROOT)` | U+006B (`k` ASCII) |
| U+0130 (`İ`) `.toLowerCase(Locale.ROOT)` | 2 caracteres |
| `"a" + U+00A0`, `.strip()` | 2 caracteres (o espaço não separável fica) |

Não executado: `osv-scanner` (não está instalado nesta máquina) e o comportamento do `@Email` do Hibernate Validator com caracteres fora do ASCII (o jar fica fora da pasta da operação). A F10 não acrescenta dependência, então vale a última varredura registrada (8.1).

#### Achados

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| U1 | Alta se acontecer (preventivo) | A01 / A08 | PUT montado como entidade nova com o id do caminho e `save` (`merge`), em vez de `findById` e `@MappingTarget` | No id inexistente, o `merge` não responde 404 (critério 3). No existente, qualquer campo que o mapper esquecer volta como `null` sem aviso | Seção 7, "API, edição": `findById` primeiro, `@MappingTarget` com `id` e `createdAt` ignorados e `ReportingPolicy.ERROR`. Teste de ataque com `"id"` de outro cliente, conferido pelo `JdbcTemplate` | ESPRESSO |
| U2 | Média | A09 / LGPD | O erro 1062 traz o email inteiro (provado acima), como já trazia o CPF (8.4) | Se o 409 de email usar `getMessage()`, propagar a causa ou se o log do Hibernate for religado, o email vai para o log ou para a resposta, contra o critério 11 e a 6.1 | Tradução pelo nome `uk_clientes_email`, exceção sem causa, loggers JDBC `OFF`. Captura de log no 409 de email e na corrida: nenhuma ocorrência do email, nem com outra caixa | ESPRESSO |
| U3 | Média | A04 | A collation `utf8mb4_0900_ai_ci` junta caixa e acento e não ignora o espaço final (provado). Uma checagem de unicidade feita em memória no Java discorda dela | O Java aprova, o índice recusa, e sem a tradução sai 500. Ou o Java recusa um email que o banco aceitaria | O índice decide, e a consulta prévia, se houver, roda no banco (2.5). Teste com `Ana@Example.com` contra `ana@example.com` (409) e com o próprio email em outra caixa (200). Risco aceito: dois emails que só diferem por acento contam como um, o que é raro e só faz o segundo cadastro ir sem email | ESPRESSO |
| U4 | Baixa | A03 / A04 | `String.toLowerCase` troca o Kelvin por `k` e transforma `İ` em dois caracteres (provado no JDK 21) | Grava um email que ninguém digitou. Um email de 120 caracteres com `İ` pode passar das 190 posições da coluna e virar 500 (erro 1406), se o `@Email` aceitar `İ` (não verificado) | Minúsculas só em `A` a `Z` ASCII (2.5). Teste com U+212A, U+0130 e U+00A0 no email: o resultado é 400 ou 200 com o valor gravado igual ao enviado fora do ASCII, e nunca 500 | ESPRESSO |
| U5 | Média, risco a aceitar | A01 / A04 | Extensão do B2 e do E6 à edição: qualquer token válido, inclusive o de usuário desativado até o JWT expirar (8.2), sobrescreve telefone, email, CPF e endereço de qualquer cliente. Não existe dono por objeto, por desenho | Token vazado troca o contato de clientes: orçamento e aviso de veículo pronto vão para o número de quem atacou (e, com o WhatsApp do backlog, sem ninguém perceber). Correção legítima do titular e sabotagem ficam iguais no banco | Aceite da pessoa na P8, estendido à escrita da edição. Mitigação vigente: linha `clientes.editar` com `usuarioId` (6.7). Quando entrar permissão por perfil, revisar quem edita CPF e a expiração do JWT (ADR-004). Teste do 401 com token ausente, malformado, expirado, de outra chave e `alg: none`, com os valores de A intactos pelo `JdbcTemplate` | Pessoa (aceite), CARTOGRAFO (ADR futuro) |
| U6 | Média, a provar | A04 | Dois `UPDATE` concorrentes que gravam o mesmo valor em índice único, ou valores cruzados em dois índices, podem receber deadlock (1213) em vez de 1062. Hoje nada trata `CannotAcquireLockException` (conferido por `grep`). Não provei o deadlock nesta revisão | Um dos PUT da corrida responde 500, contra o critério 8 | IT da corrida com os três casos da seção 7. Se aparecer 1213, tratamento no handler com mensagem fixa | ESPRESSO, CARTOGRAFO (status) |
| U7 | Baixa | LGPD | Email único (2.5) num público em que família e empresa dividem email | Pressão no balcão para inventar email (`ana2@...`), que é dado falso no cadastro e contato que não chega | Conduta: o segundo cadastro vai sem email. Texto do BUSSOLA na F35, junto com o do 409 de CPF (2.3) | BUSSOLA |
| U8 | Baixa, risco a aceitar | A01 | O 409 confirma que um CPF ou email é de cliente da oficina | Nada novo: o mesmo token já lê email pela lista e CPF pelo detalhe (B2). É o mesmo caso do V7 | Aceite junto com a P8. Mitigação: linha `clientes.editar.conflito` com `usuarioId` e `campo` (6.7) | Pessoa |
| U9 | Baixa | LGPD | O exemplo de telefone do `ClienteRequest` no OpenAPI é `(11) 91234-5678`, com DDD que existe (conferido no código) | Pode ser o celular de alguém, e o exemplo vai para captura de tela e demonstração | Trocar por DDD que não existe, como `(20) 91234-5678` (seção 7, teste e ambiente local), na PR da F10, que mexe no mesmo DTO por reuso | ESPRESSO |

Conferido sem achado, por leitura:

* `ClienteRequest` não tem `id`, e o `toString()` devolve só `ClienteRequest`. Em branco vira NULL no construtor, então email ausente grava NULL e não colide no índice.
* `Cliente.createdAt` é `insertable = false, updatable = false`, e o builder tem `toString()` fixo.
* `ClienteService.gravar` já é o ponto único do ADR-020, com `saveAndFlush` e tradução pelo nome da restrição, sem `getMessage()`. A F10 só acrescenta o índice de email.
* `application.yml`: `org.hibernate.orm.jdbc.error` e `SqlExceptionHelper` em `OFF`.
* CSRF: a API é stateless com JWT no cabeçalho, sem cookie de sessão, como na 8.1. Não reexecutei.
* Segredo: a F10 não cria configuração nova. Vale o ADR-009.

### 8.7 Revisão do código da F10 depois da revisão humana (revisão 7, 2026-11-19)

Escopo revisado por leitura no ramo `feat/f03d-clientes-editar`, commit `738f04b`: os 10 commits da F10 desde `7250be2` (`git diff --stat 7250be2..HEAD`, 21 arquivos), `ClienteService`, `ClienteMapper`, `ClienteRequest`, `AparoUnicode`, `ClienteController` (PUT), `GlobalExceptionHandler`, `SecurityConfig`, a V8, os testes `ClienteAtualizarIT` e `ClienteAtualizarControllerTest`, `CHANGELOG.md` e o rascunho do corpo da PR do ESPRESSO, que não está versionado.

#### Evidência executada (2026-11-19)

MySQL 8.4.13 descartável em contêiner, com uma tabela `clientes` reduzida (`id`, `email VARCHAR(190)` em `utf8mb4_0900_ai_ci` e `uk_clientes_email`) e só `ana@example.com`, que é fictício. O contêiner foi removido no fim. Na saída do 1062 troquei o valor por `<valor>`.

| Tentativa | Resultado observado |
|---|---|
| Comparar `ana@example.com` com o mesmo valor mais U+200B no fim, no início e no meio, e mais U+200D, U+FEFF e U+00AD | `1` (igual) nos seis casos |
| `INSERT` do valor com U+200B no fim, com `ana@example.com` já gravado | `ERROR 1062 (23000): Duplicate entry '<valor>' for key 'clientes.uk_clientes_email'` |
| `INSERT` com U+200B no meio do domínio | `ERROR 1062`, igual ao anterior |
| `COUNT(*)` no fim | `1` |

Leitura e comandos:

* `git grep -nE "LOG\.(info|debug|warn|error|trace)" -- apps/api/src/main`: no `ClienteService`, as linhas de log do PUT são só as três da 6.7 (linhas 124, 139 e 144). Nenhuma carrega valor.
* `git diff 7250be2..HEAD -- apps/api/pom.xml apps/mobile/package.json`: vazio. A F10 não acrescenta dependência.

Não executado:

* `osv-scanner`: não está instalado nesta máquina. Vale a última varredura registrada (8.1).
* O comportamento do `@Email` (Hibernate Validator 9.1.5) com U+200B: o ambiente bloqueou a gravação do programa de teste. Ficou para o teste do W5.
* Nenhuma chamada à API rodando. Não rodei a suíte: esta revisão não muda código.

#### Autorização pelo lado de quem não deveria ter acesso

| Quem tenta | O que acontece | Como foi conferido |
|---|---|---|
| Sem token ou com token malformado | 401 antes do controller; A intacto | `ClienteAtualizarIT`, US-CLI-29 (teste existente; não reexecutei) |
| Token expirado, de outra chave ou com `alg: none` | Deve dar 401 pela mesma cadeia (`anyRequest().authenticated()` e o mesmo `JwtDecoder` do POST, que tem o expirado testado) | Só leitura de `SecurityConfig`. **Não há teste no PUT** (W3) |
| Usuário autenticado editando o cliente de outro funcionário | 200: todo token edita todo cliente. Não existe dono por objeto, por desenho do briefing | Leitura. É o U5, risco a aceitar na P8 antes do merge |
| Token de usuário desativado, até o JWT expirar | 200, como no 8.2 | Herdado do 8.2. P8 |
| Corpo com `id` de B, `createdAt` ou objeto aninhado | Só A muda; B e o `created_at` de A ficam intactos | `ClienteAtualizarIT`, US-CLI-30 (existente) e o mapper com `@MappingTarget`, `id` e `createdAt` ignorados e `ReportingPolicy.ERROR` |
| Uso do 409 como oráculo de CPF ou email | Confirma que o valor é de algum cliente, sem dizer qual | Mensagens fixas, exceções sem causa. U8, P8 |

#### Achados

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| W1 | Média | A09 / LGPD | O rascunho do corpo da PR manda checar a V8 com `SELECT email, COUNT(*) FROM clientes WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1`. A consulta lista os emails, contra a 2.5 (dúvida 2) e a 6.1 | Em banco com dado real, os emails duplicados aparecem no terminal, no histórico do cliente SQL e, se rodar em pipeline, no log do CI | Trocar pela contagem pura: `SELECT COUNT(*) FROM (SELECT email FROM clientes WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1) d;`. Sem `TRIM`, ela usa a mesma expressão e a mesma collation do índice, então prevê a falha da V8 com exatidão. A variante com `TRIM` da 2.5 é conservadora: conta também pares que só diferem por espaço ASCII nas pontas, que a V8 aceita (NO PAD). As duas só contam | ESPRESSO (corpo da PR). Bloqueia a abertura da PR |
| W2 | Baixa | A09 | A linha `campo=concorrencia` do ADR-027 (regra 3) **não existe no código**: o `try` de `ClienteService.atualizar` (linhas 130 a 138) só captura as exceções de CPF e de email. O changelog e o corpo da PR dizem que ela "não foi vista rodando", quando ela nem foi implementada | O 409 de deadlock sai sem rastro nenhum, e o gatilho de revisão do ADR-027 fica cego. Não há dado pessoal em jogo | `catch (PessimisticLockingFailureException ex)` depois do catch de email, chamando `logarConflito(id, usuarioId, "concorrencia")` e relançando `ex`. Teste unitário da 10.4. Corrigir o changelog (linhas 84 e 85) e o corpo da PR para dizer "não implementada" até o commit | ESPRESSO; PERGAMINHO (textos). Condição de merge da F10 (6.7) |
| W3 | Baixa | A07 | O 401 do PUT só tem teste com token ausente e malformado. A 10.4 e o U5 pedem também expirado, de outra chave e `alg: none` | Hoje não há falha: a cadeia é a mesma do POST. O risco é de regressão. Uma mudança futura no `SecurityConfig` que libere o PUT, ou um decoder por rota, passaria sem teste vermelho | Ampliar `shouldReturn401AndChangeNothingWhenTokenIsMissingOrInvalid` com os três tokens, cada um com A intacto pelo `JdbcTemplate` e sem linha `clientes.editar` | ESPRESSO |
| W4 | Baixa | LGPD | O U9 continua aberto. O exemplo do `@Schema` de `ClienteRequest.telefone` é `(11) 91234-5678`, e o PUT o mostra no schema do corpo. O exemplo do POST (`ClienteController`, linha 104) é igual, e os de resposta (`ClienteDetalheResponse` e `ClienteListResponse`) são `11912345678`. Só o exemplo do PUT (linha 218) usa `(00)` | O número pode ser o celular de alguém e vai para captura de tela, demonstração e, no futuro, para a integração com WhatsApp | `(20) 91234-5678` e `20912345678`, como pede a seção 7 ("Teste e ambiente local") | ESPRESSO |
| W5 | Baixa, risco aceito | A04 / qualidade do dado | U+200B não é aparado. O duplicado com caractere invisível dá 409 (provado acima), mas um email novo com U+200B, se o `@Email` aceitar (não verificado), é gravado com o caractere | O contato não recebe mensagem, e o funcionário vê um email que parece certo. Não há vazamento e não há quebra de unicidade | Na F10, nada no código (premissa 1). Teste de caracterização no `ClienteAtualizarIT`: email de A com U+200B no fim, no início e no meio, enviado no PUT de B, dá 409 ou 400 e nunca 200 nem 500. No caso sem conflito, o teste registra o status real. Revisitar quando entrar envio por email ou WhatsApp: aí recusar com 400 os caracteres da categoria Format (Cf) no email | ESPRESSO (teste); BUSSOLA (revisita) |
| W6 | Informativo | — | O rascunho do corpo da PR diz que o PUT "responde 200 com `ClienteResponse`" | Texto errado na PR: o tipo é `ClienteDetalheResponse` | Corrigir o texto | ESPRESSO |

Conferido sem achado, por leitura em `738f04b`:

* O 409 tem `mensagem` fixa (`CPF ja cadastrado` ou `Email ja cadastrado`). As exceções não têm causa, e o nome da restrição só serve para escolher a exceção: o `toLowerCase(Locale.ROOT)` do `ClienteService` roda sobre esse nome, nunca sobre o email.
* A normalização do email no mapper troca só `A` a `Z` ASCII, sem `toLowerCase` (2.5, U4).
* O PUT faz `findById` antes de tudo (404 sem o id na mensagem) e depois `@MappingTarget`, sem `new Cliente` nem `setId` (U1).
* O controller é fino: `@Positive` no id, `@Valid` no corpo e o `usuarioId` tirado do `sub` do JWT.
* O handler de `PessimisticLockingFailureException` responde 409 com mensagem fixa, sem log e sem ler a exceção.
* `SecurityConfig`: `PUBLIC_PATHS` continua só com o login e a documentação.
* Segredo: a F10 não cria configuração nova, e os testes usam segredo fictício de teste (ADR-009).

### 8.8 Revisão do código da segunda rodada da F10 (2026-11-19)

Escopo: os commits `4f7a127` a `bd7962d` do ESPRESSO (W2, W3, W4, W5, CHANGELOG e evidência das 100 rodadas), revisados no ramo `feat/f03d-clientes-editar`. Os testes e o estilo que acrescentei estão em `8fa0d3c` e `3caf42c`. Coleta, base legal, retenção e descarte não mudam, por isso esta seção não abre revisão nova da política.

#### Evidência executada (2026-11-19)

| Comando | Resultado observado |
|---|---|
| `apps/api/mvnw -f apps/api/pom.xml verify -Dtest=NONE -Dsurefire.failIfNoSpecifiedTests=false -Dit.test=ClienteAtualizarIT` | `Tests run: 33, Failures: 0, Errors: 0, Skipped: 0`, `BUILD SUCCESS` (MySQL 8.4 via Testcontainers) |
| `apps/api/mvnw -f apps/api/pom.xml checkstyle:check` | `You have 0 Checkstyle violations.`, `BUILD SUCCESS` |
| `apps/api/mvnw -f apps/api/pom.xml spotless:check`, antes de `3caf42c` | `BUILD FAILURE`: a única violação é `AparoUnicodeTest.java`, criado na F10 (`4b680c8`) |
| O mesmo comando, depois de `3caf42c` | `BUILD SUCCESS`. U+00A0, U+2007 e U+202F do arquivo contados antes e depois: 4, 2 e 1 nos dois casos |
| `apps/api/mvnw -f apps/api/pom.xml clean verify` | 249 testes unitários e 142 de integração, 0 falhas, `BUILD SUCCESS` |
| `gitleaks git --log-opts="7250be2..HEAD" --config .gitleaks.toml --redact .` | `15 commits scanned`, `no leaks found` (antes dos meus dois commits, que só mexem em teste) |
| `git diff --stat 7250be2..HEAD -- apps/api/pom.xml apps/mobile/package.json apps/mobile/package-lock.json` | vazio: a F10 não acrescenta dependência |
| `git grep -n "PessimisticLockingFailureException" -- apps/api/src/main` | só o `GlobalExceptionHandler` e o `ClienteService` (Confirmação do ADR-027) |
| `git merge-base --is-ancestor 03e7646 <base>` | `03e7646` está no ramo e em `origin/feat/f03c-clientes-criar` e em `feat/f04-veiculos`. Não está na `main` |

Não executado: `osv-scanner`, que não está instalado (vale a última varredura registrada, 8.1); deadlock real do MySQL, que continua não provado.

#### Conferido sem achado

* **W2.** O `catch (PessimisticLockingFailureException ex)` em `ClienteService.atualizar` vem depois dos catches de CPF e de email, que são `ConflitoException`, e por isso não esconde nenhum deles. A linha logada é só `clientes.editar.conflito clienteId= usuarioId= campo=concorrencia`, sem `ex` nem `getMessage()`, e a mesma instância é relançada para o handler, que responde 409 com mensagem fixa e sem log. O teste unitário cobre o roteiro da 10.4: mesma instância, linha exata, nenhum `Deadlock` nem email e nenhuma linha de sucesso. Limite: um deadlock que estourasse só no commit, fora do `saveAndFlush`, teria 409, mas não teria essa linha. Com o `saveAndFlush`, o `UPDATE` roda dentro do `try`. Isso não foi provado com deadlock real.
* **Critério 11.** Nenhuma linha do PUT carrega valor, nem mascarado. É mais restritivo que o card, que pede CPF, telefone e email mascarados. Parecer do VIGIA: manter. A divergência vai para a PR, para o aceite da pessoa.
* **W4.** Nenhum exemplo do OpenAPI em `apps/api/src/main` usa DDD 11.
* **W1.** Nenhum `SELECT` lista email em código ou doc versionado. As únicas ocorrências são a contagem do ADR-026 e as consultas de teste com dado fictício.
* **Evidência das 100 rodadas.** O arquivo `docs/product/F10-evidencia-corrida-100-rodadas.md` só tem códigos HTTP e contagens, sem dado pessoal nem segredo.

#### Achados

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| X1 | Média (processo, bloqueia a PR pela regra da pessoa) | — | O handoff diz que o `03e7646` (com `Co-Authored-By`) "não entrou", mas ele é ancestral do `HEAD`: dos 167 commits do ramo sobre a `main`, 101 descendem dele. Também está em `feat/f03c-clientes-criar` e em `feat/f04-veiculos`, mas não na `main` | Uma PR deste ramo para a `main` leva o commit. Uma PR empilhada sobre a F03c ou a F04 não o mostra no diff, mas ele entra na `main` quando a base entrar | A pessoa escolhe: reescrever o histórico desde o `03e7646` (rebase que muda o hash dos 101 commits posteriores neste ramo, e dos 73 de `origin/feat/f03c-clientes-criar`, e exige force-push de ramos já publicados) ou levar o commit sabendo disso. Ninguém reescreve o histórico sem a decisão dela | Pessoa |
| X2 | Baixa | A07 | Os três 401 do W3 não tinham controle positivo. Com o decoder HS256 do `JwtConfig` (só os validadores padrão de tempo), um 401 por qualquer outro defeito do token feito pelo teste também passaria | O teste de "expirado" podia passar sem provar o vencimento | **Corrigido em `8fa0d3c`**: o mesmo `tokenHs256`, com data válida e a chave do teste, dá 200 e grava a linha `clientes.editar clienteId=<A> usuarioId=1`. Os três 401 afirmam também que não há linha `clientes.editar` (10.4) | VIGIA |
| X3 | Baixa, risco aceito (W5) | A04 / qualidade do dado | O W5 só cobria o U+200B no fim. Agora, no conflito, ele no início, no fim e no meio do domínio dá 409 `Email ja cadastrado`. **Sem conflito, o PUT responde 200 e grava o email com o U+200B** (status real, `8fa0d3c`). O `@Email` aceita o caractere | Confirma o risco do W5: o email parece certo na tela e não recebe mensagem. Não há vazamento e não há quebra de unicidade | Na F10, nada no código (premissa 1). Na entrada do envio por email ou WhatsApp: recusar com 400 os caracteres da categoria Cf no email, no `ClienteRequest` | BUSSOLA (revisita) |
| X4 | Baixa | — | O `spotless:check` estava vermelho no `AparoUnicodeTest`. O handoff tratou o arquivo como de fora da feature, mas ele é da F10 | Lint isolado vermelho na PR | **Corrigido em `3caf42c`**, só com formatação. O lint isolado agora está verde (tabela acima) | VIGIA |
| X5 | Informativo | LGPD (seção 7) | As fixtures de teste ainda usam telefone com DDD 11 (`11912345678`, `(11) 3456-7890`) em 16 arquivos de `apps/api/src/test`. A seção 7 diz "prefira" DDD que não existe | Um número inventado pode ser de alguém, e as fixtures aparecem em log de CI e em captura de tela | Trocar por DDD 20 numa fatia de limpeza, sem misturar com a F10. Os testes novos desta seção já usam `20912345678` | ESPRESSO |
| X6 | Informativo | A09 | A evidência das 100 rodadas é a saída do log, mas o teste temporário não foi versionado. A execução não se reproduz a partir do repositório | O CRIVO não consegue reexecutar o mesmo teste | Anexar o código do teste temporário ao arquivo de evidência, ou versioná-lo com `@Tag("corrida")` e fora da execução padrão | ESPRESSO, CRIVO |

#### Parecer sobre as perguntas da pessoa

* **Email só com NBSP virar `null`.** Recomendo manter. É o mesmo tratamento que o email só com espaço ASCII já recebe (`emBrancoParaNulo`). Como o PUT substitui tudo, `null` já quer dizer "apagar o email". Recusar com 400 só o NBSP criaria uma regra diferente para cada tipo de espaço. O efeito colateral é que a F35, ao reenviar um campo que só tem NBSP, apaga o email, exatamente como faria com o campo vazio. Não há impacto em LGPD: apagar reduz dado. A decisão é da pessoa.
* **Qual corpo vale.** O rascunho do ESPRESSO não está versionado, então não consigo conferir nele o W1 nem o W6. Recomendo o corpo consolidado e versionado em `docs/product/F10-pr-rascunho-corpo.md`, que traz a contagem do W1 e o tipo certo da resposta (W6). A confirmação é da pessoa.

## 9. Pendências e donos

| ID | Pendência | Dono | Bloqueia |
|---|---|---|---|
| P1 | Validar base legal e prazos R1 e R2 (D2 da F03a) | Pessoa, com jurídico ou contador da oficina | Rotina automática de descarte. Não bloqueia a F03a (só leitura) |
| P2 | Procedimento manual de anonimização (script SQL revisado pelo VIGIA) e tabela de auditoria | Pessoa decide a feature; ESPRESSO implementa; VIGIA revisa | Primeiro cliente real em produção |
| P3 | Canal do titular e quem responde (seção 5, D3 da F03a) | Pessoa, com BUSSOLA | Primeiro cliente real em produção |
| P4 | Aviso de privacidade ao cliente no cadastro (art. 9º), com o conteúdo mínimo da seção 7 ("App, criação") | BUSSOLA (texto), pessoa (balcão), F35 | Primeiro cadastro real. Não bloqueia a F03c, que é só API (revisão 3) |
| P5 | Datas de OS e pagamento (A6) | CARTOGRAFO | Rotina automática de R1 |
| P6 | ~~Merge do PR #14 na `main` (A0)~~. **Fechada** na revisão 2: a `main` b1f29fc está em Boot 4.1.2 | Pessoa | — |
| P7 | Retenção de log de aplicação (seção 7, achado B6): validar os 90 dias e definir onde o log fica quando houver deploy | Pessoa, ANCORA | Primeiro deploy com coletor ou arquivo de log |
| P8 | Aceite do risco B2 (CPF e endereço inteiros para qualquer token válido, inclusive o de usuário já desativado até o JWT expirar, provado na 8.2) registrado na PR da F08. Na revisão 3, estendido à escrita (E6). Na revisão 5, estendido ao oráculo de placa do 409 (V7). Na revisão 6, estendido à edição de qualquer cliente por qualquer token (U5) e ao oráculo de CPF e email do 409 (U8), com aceite antes do merge da F10 | Pessoa | Merge da F08; a parte de escrita, o merge da F03c |
| P9 | CPF obrigatório ou opcional na criação (2.2, E1). Parecer do VIGIA: opcional | Pessoa, com BUSSOLA (e o contador, se for obrigatório) | Aceite do exemplo `CPF` do US-CLI-16 da F03c |
| P10 | ~~Índice único em `clientes.cpf` e 409 em fatia própria ou na F03d~~. **Decidida na revisão 4**: entra na própria F03c (2.1, E7). Falta o aceite do ADR-020 pela pessoa. Se ela recusar, a P10 volta a valer como era, bloqueando o primeiro cliente real | ESPRESSO (código e IT), pessoa (aceite) | Merge da F03c |
| P11 | ~~Regra de troca de dono de veículo (2.1) no card da F04~~. **Fechada na revisão 5**: `cliente_id` imutável depois da criação (2.1), como a premissa 6 do card | BUSSOLA, CARTOGRAFO | — |
| P12 | Conduta de recadastro do titular anonimizado em parte (2.3, E9) no procedimento da P2 e no texto da F35 | BUSSOLA, ESPRESSO | Primeira anonimização parcial |
| P13 | Troca de dono de veículo vendido com o dono antigo ativo (2.4, V9). Feature própria; direção recomendada: "baixa" do registro antigo com `ANON<id>` | BUSSOLA e CARTOGRAFO decidem; VIGIA revisa | Primeiro carro vendido entre clientes. Não bloqueia a F04 |
| P14 | O marcador `ANON<id>` cabe até o veículo 999999 (2.4). Ampliar `placa` em migration aditiva antes disso | CARTOGRAFO | Nada hoje |
| P15 | Marcador de cliente anonimizado e bloqueio do POST e do PUT de veículo desse cliente (2.4), dentro da feature da P2. Na revisão 6, também o bloqueio do PUT de cliente anonimizado por completo e da troca ou retirada do CPF retido do anonimizado em parte (2.5) | ESPRESSO, VIGIA | P2 |
| P16 | Aceite do email único com 409 no POST e no PUT (2.1 e 2.5). Muda o contrato aprovado da F09: o POST passa a responder 409 `Email ja cadastrado`. Parecer do VIGIA: favorável. Se a pessoa recusar, vale a revisão 3 para o email e os critérios 6, 7 e a parte de email do 8 da F10 caem | Pessoa, com BUSSOLA | Critérios de email da F10 e a migration do índice de email |

## 10. Como verificar esta política na F03a

* `git grep -nE "log\.(info|debug|warn|error|trace)" -- apps/api/src/main` e conferir cada linha nova contra a seção 6.
* Teste de log da tarefa 8 passando, com a saída anexada à PR.
* Teste MockMvc de 400 para `size=0`, `size=101`, `page=-1`, `page=abc` e `q` com 101 caracteres, sem o valor rejeitado no corpo (A1).
* Teste de integração com `%`, `_` e `\` como termo (A2).
* `git grep -nE "show-sql|jdbc.bind|log-request-details|accesslog" -- apps/api` sem ocorrência que viole a seção 7.
* Teste unitário de `MascaraDadoPessoal` cobrindo todas as linhas da tabela da seção 6.2.1.
* `git show origin/main:apps/api/pom.xml | grep -A1 spring-boot-starter-parent` mostrando 4.1.2 ou superior antes do merge do código da F03a (A0).

### 10.1 Na F03b (detalhe)

* `git grep -nE "log\.(info|debug|warn|error|trace)|LOG\.(info|debug|warn|error|trace)" -- apps/api/src/main` e conferir que as linhas novas são só as duas da 6.4.
* Teste do US-CLI-DET-11 passando, com a captura de log anexada à PR, incluindo a ausência de `123.***.***-00`.
* Teste de controller do 200 afirmando `Cache-Control` com `no-store` e os seis campos, com nulos presentes.
* Teste unitário de B1: `toString()` do `ClienteDetalheResponse` e do `ClienteListResponse` sem dado pessoal fictício.
* `git grep -n "PUBLIC_PATHS" -A8 -- apps/api/src/main` sem nenhuma rota de `clientes`.
* Exemplo do OpenAPI só com dado fictício (CPF com dígito verificador inválido, como o do `overview.md`).
* Linha de `cpf` e `endereco` no `lgpd-registro-dados-pessoais.md` igual à seção 2 desta política.

### 10.2 Na F03c (criar, card F09)

Cada item gera evidência executada, com comando e saída na entrega:

* `git grep -nE "LOG\.(info|debug|warn|error|trace)" -- apps/api/src/main`: a única linha nova é a `clientes.criar` da 6.5.
* Teste de captura de log (`ListAppender` ou `OutputCaptureExtension`) no 201, no 400 (CPF com letra, telefone de 9 dígitos, nome com 121 caracteres, email sem arroba), no 401 e no JSON malformado. No 201, a linha `clientes.criar clienteId=<n> usuarioId=<m>` aparece exatamente assim. Nenhuma linha contém o CPF enviado (só dígitos e com máscara), `***.*`, `*******`, o telefone enviado (só dígitos, com máscara e os 8 últimos), o nome, o email ou o endereço.
* No corpo de cada 400, `mensagem` contém o nome do campo e não contém o valor enviado. Use valores fáceis de distinguir, como `98765abc432` e `209123456`, para o `not(containsString(...))` não passar por acaso.
* Teste de integração com MySQL real (Testcontainers, como o `ClienteDetalheIT`): depois do POST com máscara, uma leitura direta pelo `JdbcTemplate` mostra `cpf` e `telefone` só com dígitos. Depois de cada 400 e 401, o `COUNT(*)` de `clientes` não muda. Os opcionais em branco ficam NULL.
* Teste de ataque de atribuição em massa (E4), com o cliente existente intacto no banco.
* 401 com token ausente, malformado, expirado, assinado com outra chave e `alg: none`, e o `COUNT(*)` sem mudar.
* `Cache-Control: no-store` no 201, e `toString()` do DTO de entrada sem CPF, telefone e endereço fictícios.
* Log real da API em contêiner depois de um 201 e de um 400, como na 8.2: `grep -c` dos valores fictícios igual a 0, e uma linha `clientes.criar`.
* Exemplos do OpenAPI só com dado fictício (CPF `12345678900`, telefone com DDD que não existe, email `@example.com`), e os exemplos de 400 sem valor rejeitado.
* Revisão 4 (índice e 409 na F03c), pelo IT com Testcontainers:
  * o Flyway aplica V1 a V6 e a API sobe com `ddl-auto: validate`;
  * POST com `12345678900` e depois com `123.456.789-00` dá 201 e 409, com `mensagem` exatamente `CPF ja cadastrado`, corpo e cabeçalhos sem o CPF nas duas formas e sem o id do primeiro, e `COUNT(*)` igual a 1;
  * 10 POST simultâneos dão um 201, nove 409 e nenhum 500;
  * dois POST sem CPF dão 201.
* Captura de log no 409: nenhuma linha `clientes.criar`, nenhum ERROR e nenhuma ocorrência do CPF (6.5).
* `git grep -nE "existsByCpf|findByCpf" -- apps/api/src/main` sem ocorrência, e nenhum `getMessage` no `ClienteService` (ADR-020, Confirmação).
* Nenhum teste da suíte afirma 201 para CPF repetido: o teste de "dois 201" é substituído pelo do 409.

### 10.3 Na F04 (veículos)

Cada item gera evidência executada, com comando e saída na entrega:

* O Flyway aplica V1 a V7 com `ddl-auto: validate` (IT com Testcontainers). Antes da V7, `COUNT(*)` de placas duplicadas e de placas fora do formato, sem `SELECT placa`.
* `git grep -nE "LOG\.(info|debug|warn|error|trace)" -- apps/api/src/main`: as linhas novas são só as da 6.6.
* Teste unitário de `MascaraDadoPessoal.placa` com todas as linhas da tabela da 6.2.2.
* Teste de normalização em tabela (V4), incluindo os casos do card (critérios 3 a 5).
* Captura de log (`ListAppender` ou `OutputCaptureExtension`) no 201, no 200 da edição, no detalhe, no 409, no 404, no 400 e no 401: as linhas da 6.6 aparecem exatamente no formato da tabela; nenhuma linha contém a placa inteira (com e sem hífen, maiúscula e minúscula) nem marca, modelo ou `clienteNome` fictícios; no 400 e no 401 não há linha de veículo.
* IT do 409: o segundo POST, com `abc1d23` depois de `ABC1D23`, dá 409 com `mensagem` exatamente `Placa ja cadastrada`, corpo e cabeçalhos sem a placa nas duas formas e sem o id do primeiro, e `COUNT(*)` igual a 1. Dez POST simultâneos: um 201, nove 409 e nenhum 500.
* Testes de ataque V1 e V2, com conferência pelo `JdbcTemplate`.
* 401 nas quatro rotas com token ausente, malformado, expirado, assinado com outra chave e `alg: none`, com o `COUNT(*)` sem mudar.
* `Cache-Control: no-store` nas quatro rotas, e `toString()` dos DTOs e do builder sem a placa fictícia (V8).
* Log real da API em contêiner depois de um 201 e de um 409, como na 8.2: `grep -c` da placa inteira igual a 0.
* `git grep -n "ANONIMO" -- apps/api` sem uso como valor de anonimização.

### 10.4 Na F03d (editar, card F10)

Cada item gera evidência executada, com comando e saída na entrega:

* O Flyway aplica V1 até a migration nova do índice de email com `ddl-auto: validate` (IT com Testcontainers). Antes dela, a contagem de duplicados da 2.5 (dúvida 2), sem `SELECT email`.
* `git grep -nE "LOG\.(info|debug|warn|error|trace)" -- apps/api/src/main`: as linhas novas são só as três da 6.7.
* Captura de log (`ListAppender` ou `OutputCaptureExtension`) no 200, no 404, no 409 de CPF, no 409 de email, na corrida, no 400 e no 401: as linhas da 6.7 aparecem exatamente no formato da tabela. Nenhuma linha contém o CPF, o telefone ou o email **novos nem os anteriores** (só dígitos, com máscara de digitação, com a máscara 6.2.1, em outra caixa), nem o nome ou o endereço. No 400 e no 401 não há linha `clientes.editar`. Use valores anteriores e novos fáceis de distinguir, para o `not(containsString(...))` não passar por acaso.
* No corpo de cada 409, `mensagem` exatamente `CPF ja cadastrado` ou `Email ja cadastrado`, sem o valor nas duas formas e sem o id do outro cliente. Depois de cada 400, 401, 404 e 409, os cinco campos de A, lidos pelo `JdbcTemplate`, não mudam.
* US-CLI-28 e US-CLI-32: o próprio CPF com outra pontuação e o próprio email com outra caixa e espaço nas pontas dão 200, e o email fica gravado em minúsculas.
* Corrida (U6): os três casos da seção 7, sem nenhum 500.
* Teste de ataque U1 e US-CLI-30, com B intacto e o `created_at` de A igual ao de antes.
* Teste U4 com U+212A, U+0130 e U+00A0 no email: nunca 500 e nunca valor gravado diferente do enviado fora do ASCII.
* POST com email de outro cliente dá 409 `Email ja cadastrado` (P16, premissa 6 do card), e dois POST sem email dão 201.
* 401 com token ausente, malformado, expirado, de outra chave e `alg: none`.
* `Cache-Control: no-store` no 200.
* `git grep -nE "toLowerCase|equalsIgnoreCase" -- apps/api/src/main/java/br/com/mecanicasaojorge/api/mapper apps/api/src/main/java/br/com/mecanicasaojorge/api/service/ClienteService.java`: só o `toLowerCase(Locale.ROOT)` do nome da restrição, que já existe, e nenhum sobre email.
* Exemplo do OpenAPI do telefone com DDD que não existe (U9).
* Revisão 7, antes do merge (8.7):
  * Teste unitário do W2 em `ClienteAtualizarServiceTest`. O `saveAndFlush` lança uma `CannotAcquireLockException` cuja mensagem tem `Deadlock found` e um email fictício. O teste afirma que a mesma instância é relançada, que existe exatamente a linha `clientes.editar.conflito clienteId=<id> usuarioId=<u> campo=concorrencia`, que nenhuma linha contém `Deadlock` nem o email e que não há linha `clientes.editar clienteId=` de sucesso.
  * `git grep -n "PessimisticLockingFailureException" -- apps/api/src/main` mostra só o `GlobalExceptionHandler` e o `ClienteService` (Confirmação do ADR-027).
  * IT do W3 (401 do PUT com token expirado, de outra chave e `alg: none`) e IT do W5 (U+200B), com o status real observado.
  * Exemplos do OpenAPI do W4 com DDD 20.
  * O corpo da PR usa a contagem do W1 e não tem nenhum `SELECT email`.

## 11. Histórico

| Data | Mudança | Onde |
|---|---|---|
| 2026-11-14 | Criação, antes de qualquer código de Clientes | commit 2488c75 |
| 2026-11-16 | Entrou na `main` junto com o ADR-017, mergeado pela pessoa (sem review formal registrado no GitHub) | PR #15, merge 348a43e |
| 2026-11-17 | Revisão 1: A0 e P6 apontam para o PR #14 (o #13 foi mergeado no ramo do #14, e a `main` segue em Boot 4.1.0); local do utilitário de máscara fixado em `security.MascaraDadoPessoal`; contrato exato da máscara (6.2.1); A0 e A1 reconferidos abertos na `main` dfab787. Base legal e prazos seguem como proposta (P1) | PR #17, merge 20fb438 |
| 2026-11-17 | Revisão 2 (F03b): linhas de `cpf` e `endereco` aprovadas para a V4 da F08; CPF e telefone completos no detalhe autenticado registrados na seção 2; linhas de log do detalhe (6.4), incluindo o 404; regras de `toString()`, `Cache-Control` e retenção de log (seção 7); regras do app para o detalhe; parecer, evidência executada e achados B1 a B6 (8.1); A0, A1, A5 e P6 fechados; P7 e P8 novas. Base legal e prazos seguem como proposta (P1) | commit `b42d71b` |
| 2026-11-17 | Revisão do código da F08 (8.2): log real do 200 e do 404 sem CPF nem telefone; B1 fechado, com C1 (`toString` da lista) e C2 (500 preservado no `MissingPathVariableException` de rota) corrigidos; token de usuário desativado lendo CPF inteiro registrado no B2 e no P8. Nada muda em coleta, base legal ou retenção | commit `42d9193` |
| 2026-11-17 | Revisão 3 (F03c, card F09): unicidade decidida (CPF único quando preenchido, com 409, entrando antes do primeiro cliente real; email, telefone e placa não únicos) e regra de troca de dono de veículo (2.1); parecer de CPF opcional na criação (2.2); telefone obrigatório na API com a coluna NULL; linha de log da criação sem dado, nem mascarado (6.5); regras de validação, normalização, atribuição em massa e corpo ilegível do POST (seção 7); insumo do app para a F35 e aviso de privacidade; achados E1 a E8 (8.3); P4 revista e P9 a P11 novas; roteiro de verificação da F03c (10.2). Base legal e prazos seguem como proposta (P1) | commit `01af04f` |
| 2026-11-18 | Revisão 4 (F09): a premissa 3 cai e o índice único de CPF com 409 entra na própria F03c (2.1; decisão do VIGIA registrada no ADR-020); resumo de retenção e descarte por dado, regra R5 de texto livre, o que o descarte não faz e o que a F09 entrega para ele (3.1); recadastro de titular anonimizado, provado em MySQL 8.4 (2.3 e 8.4); placa anonimizada na hora no pedido do titular dentro de R1 (seção 5); E7 decidido, E9 novo, P10 decidida, P12 nova e roteiro da 10.2 ampliado. Base legal e prazos seguem como proposta (P1) | commits `1cfecdb` e `ec8de65` |
| 2026-11-18 | Revisão 5 (F04, Veículos): placa classificada como dado pessoal, e marca, modelo, ano e cor como dado pessoal por associação, com o ciclo do dado (2.4); placa única com 409 e `CHECK` de formato na V7, revogando a linha da revisão 3 (2.1); descarte do veículo junto com o cliente pelo marcador `ANON<id>` no lugar de `ANONIMO`, provado em MySQL 8.4 (2.4, 3.1, seção 4 e 8.5); `cliente_id` imutável depois da criação; máscara de placa `****D23` (6.2.2) e linhas de log da F04 (6.6); regras de API e de app para veículos (seção 7); achados V1 a V10 (8.5); P11 fechada, P13 a P15 novas; roteiro da 10.3. Base legal e prazos seguem como proposta (P1) | commits `6886e61` e `d253503` |
| 2026-11-18 | Revisão 6 (F10, F03d, edição de cliente): cobertura da edição confirmada, com o ciclo do dado no PUT, valor anterior nunca guardado, edição que não reinicia R1 nem R2 e regra R6 de histórico de alteração (2.5). Email único quando preenchido, com 409 no POST e no PUT, revogando a linha de email da revisão 3 (2.1 e 2.5, aceite na P16). Normalização do email só em ASCII. Respostas às três dúvidas do card. Linhas de log do PUT sem valor, nem mascarado, nem anterior (6.7). Regras de API da edição (seção 7). Evidência em MySQL 8.4 e JDK 21 e achados U1 a U9 (8.6). P8 e P15 ampliadas, P16 nova e roteiro da 10.4. Base legal e prazos seguem como proposta (P1) | commits `1161f9a` e `c4d112e` |
| 2026-11-19 | Revisão 7 (F10, depois da revisão humana): a linha `campo=concorrencia` foi aprovada e vira condição de merge, porque não existe no código (6.7). Provado em MySQL 8.4.13 que o índice de email ignora U+200B, U+200D, U+FEFF e U+00AD (2.5 e 8.7). O aparo Unicode do email (`AparoUnicode`) substitui o `strip()` da revisão 6 (2.5). Revisão do código em `738f04b`, com a autorização conferida pelo lado de quem ataca (por leitura e pelos testes existentes) e os achados W1 a W6 (8.7). Roteiro da 10.4 ampliado. Coleta, base legal, retenção e descarte não mudam. Base legal e prazos seguem como proposta (P1) | esta revisão |
| 2026-11-19 | Revisão do código da segunda rodada da F10 (8.8), sem revisão nova da política: W2 conferido; controle positivo de token e U+200B em três posições e sem conflito (200, gravado) acrescentados; lint isolado verde; achados X1 a X6; parecer sobre o NBSP e sobre o corpo da PR. Coleta, base legal, retenção e descarte não mudam | commits `8fa0d3c`, `3caf42c` e este |
