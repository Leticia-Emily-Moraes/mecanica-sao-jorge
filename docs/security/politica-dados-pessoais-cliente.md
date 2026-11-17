# Política de dados pessoais de cliente: retenção, descarte e mascaramento

Dono: VIGIA (AppSec/LGPD). Criada em 2026-11-14 na F03a, antes de qualquer código do módulo Clientes. Revisada em 2026-11-17 duas vezes: revisão 1 (contrato da máscara) e revisão 2 (detalhe de cliente da F03b e colunas `cpf` e `endereco` da V4). Ver seção 11.

Vale para: F03a (listar), F03b (detalhe), F03c (criar), F03d (editar), F09 (CPF e endereço), F35 (tela de lista) e toda feature que leia ou grave `clientes` ou `veiculos`.

Status:

* Regras técnicas (seções 6 e 7): **vigentes desde já**. Feature que não as cumpre não passa na revisão do VIGIA.
* Base legal e prazos (seções 2 a 5): **proposta do VIGIA**, aplicada como hipótese de trabalho até a validação jurídica (D2 da F03a) e a aprovação da oficina, que é a controladora. Mudança de prazo depois da validação altera só este arquivo e a rotina de descarte; nenhum contrato de API depende do prazo.

Relação com outros documentos: complementa `docs/security/lgpd-registro-dados-pessoais.md` (inventário do schema inteiro, criado na F44 e na `main` desde o merge do PR #14). As linhas `clientes` e `veiculos` do registro apontam para cá; se os dois divergirem, vale esta política. Nada aqui é jurídico definitivo: é a leitura técnica do VIGIA sobre a LGPD (Lei 13.709/2018) e as leis citadas, para a pessoa validar.

## 1. Papéis

* Controladora: a oficina Mecânica São Jorge.
* Operadores: nenhum terceiro trata o dado hoje. Quando houver hospedagem, backup externo ou integração (WhatsApp está no backlog), o fornecedor vira operador e precisa de contrato com cláusula de proteção de dados antes do primeiro envio.
* Encarregado (art. 41): não nomeado. Hipótese a confirmar: a Resolução CD/ANPD nº 2/2022 dispensa o agente de pequeno porte de nomear encarregado, mas exige canal para o titular. O canal está na pendência P3.

## 2. Inventário por campo

| Campo | Existe hoje? | Coleta | Finalidade | Base legal (art. 7º) | Onde aparece na API | Retenção | Descarte |
|---|---|---|---|---|---|---|---|
| `clientes.nome` | Sim (V2, NOT NULL) | Obrigatória | Identificar o cliente na OS e localizar o cadastro no balcão | V (execução de contrato e procedimentos preliminares, como orçamento) | Lista (F03a), detalhe (F03b), OS | Seção 3 | Substituir por texto fixo (seção 4) |
| `clientes.telefone` | Sim (V2, NULL) | Opcional; só dígitos, 10 ou 11 (F03c) | Contato sobre orçamento, valor final e veículo pronto | V | Lista (F03a) e detalhe (F03b), **completo** (só dígitos, como gravado) e só com token válido. A tela também mostra completo, para contato direto. Em log, só pela máscara 6.2.1 | Seção 3 | NULL |
| `clientes.email` | Sim (V2, NULL) | Opcional | Mesmo do telefone | V | Lista e detalhe | Seção 3 | NULL |
| `clientes.cpf` | **Coluna criada pela V4 da F08 (F03b)**: `VARCHAR(11) NULL` com `CHECK` de 11 dígitos ASCII ([ADR-018](../architecture/adr/ADR-018-guardar-cpf-e-endereco-do-cliente-como-colunas-opcionais.md)). Nenhuma escrita antes da F09 (F03c). **Linha aprovada pelo VIGIA na revisão 2** | Opcional. Só quando o cliente pedir nota fiscal ou a emissão exigir. Proibido coletar "por garantia" | Emissão de documento fiscal | II (obrigação legal fiscal) quando houver nota; sem nota, não se coleta | Só no detalhe (`GET /api/v1/clientes/{id}`, F03b), **completo e sem máscara**, só com token válido, porque a edição (F03d) pré-preenche o valor. A máscara é da tela (seção 7). Nunca na lista, na OS resumida, em log (nem mascarado na linha 6.4), em mensagem de erro nem em exemplo do OpenAPI com dado real | Seção 3 (R4) | NULL |
| `clientes.endereco` | **Coluna criada pela V4 da F08 (F03b)**: `VARCHAR(255) NULL`, campo único (ADR-018, decisão D-B). Nenhuma escrita antes da F09. **Linha aprovada pelo VIGIA na revisão 2** | Opcional. Só quando a nota exigir ou para busca e entrega do veículo | Emissão fiscal ou logística combinada com o cliente | II (nota) ou V (busca e entrega) | Só no detalhe, completo, só com token válido. Nunca em log, nem mascarado | Seção 3 (R4) | NULL |
| `clientes.created_at` | Sim | Automática | Contar o prazo da regra R2 | Acessória às linhas acima | Não exposta na F03a | Junto do cliente | Mantida (sozinha não identifica) |
| `veiculos.placa` | Sim (V2, NOT NULL) | Obrigatória | Identificar o veículo atendido. Identifica o dono de forma indireta | V | Detalhe do cliente e do veículo | Igual ao cliente dono | Substituir por texto fixo |
| `veiculos.modelo/marca/ano/cor/quilometragem` | Sim | Obrigatória ou opcional (V2) | Execução do serviço | V | Detalhe do veículo | Igual ao cliente | Mantidos: sem placa e sem dono não identificam a pessoa |

Quem acessa: qualquer usuário autenticado (ADMIN ou FUNCIONARIO), porque o briefing não prevê diferença de permissão nesta fase. Esse acesso amplo é risco aceito e registrado no achado A3 (seção 8).

Para onde vai: só da API para o app mobile, por HTTPS fora do ambiente local. Nenhum envio a terceiro. O app não grava a lista nem o detalhe em disco (seção 7).

Regra de coleta: campo pessoal novo em `clientes` ou `veiculos` só entra com linha nesta tabela aprovada pelo VIGIA antes da migration. As linhas de CPF e endereço foram aprovadas na revisão 2 (2026-11-17), antes da V4 da F08. A aprovação cobre a **coluna** e a **leitura** no detalhe. A **coleta** continua presa à finalidade da linha (CPF só com nota fiscal); quem a implementa e prova é a F09, que também decide `UNIQUE` em `cpf`. Base legal e prazos seguem como proposta até a P1.

## 3. Retenção

Último evento do cliente: a data mais recente entre o cadastro (`clientes.created_at`), a abertura ou entrega da última OS e o último pagamento ligado a ele.

* **R1. Cliente com pelo menos uma OS:** 5 anos após o último evento. Fundamento proposto: prazo de 5 anos do CDC art. 27 (reparação por defeito do serviço), do Código Civil art. 206, § 5º, I (cobrança de dívida líquida) e do CTN arts. 173 e 174 (crédito tributário). A LGPD art. 16, I, permite conservar o dado para cumprir obrigação legal.
* **R2. Cliente sem nenhuma OS** (cadastro ou orçamento que não virou serviço): 12 meses após o cadastro. Sem contrato executado, não há obrigação legal que justifique prazo maior.
* **R3. Pedido de eliminação do titular:** seção 5.
* **R4. CPF e endereço:** seguem o cliente (R1 ou R2). Se o CPF foi coletado só para uma nota, o prazo fiscal já está coberto por R1.

Bloqueio técnico de R1: na V2, `ordens_servico` e `pagamentos` **não têm coluna de data** (conferido em `V2__criar_schema_oficina.sql` na `main`, commit 11f35b3). Sem ela não dá para calcular o último evento. A feature de OS (Sprint 04) e a de pagamento (Sprint 05) precisam trazer a data em migration aditiva. Até lá, o último evento conhecido é só o `created_at` do cliente, e nenhum descarte automático por R1 pode rodar. Ver achado A6.

Pendente: os prazos são hipótese. "Enquanto ativo" não se aplica porque não existe inativação de cliente (D2 da F03a). Validar com jurídico ou contador da oficina.

## 4. Descarte: anonimização, não exclusão

Por que não `DELETE`: `veiculos.cliente_id` e `ordens_servico.cliente_id` são FK sem `ON DELETE`, e a OS precisa ficar para o relatório histórico de faturamento (CLAUDE.md, modelo de dados) e para a obrigação fiscal. Apagar o cliente apagaria ou quebraria a OS.

Procedimento, numa transação só, por cliente:

1. `clientes.nome` recebe o texto fixo `Cliente anonimizado`, sem id nem parte do nome original.
2. `clientes.telefone`, `clientes.email` e, depois da V4 da F08, `clientes.cpf` e `clientes.endereco` recebem NULL. O detalhe de cliente anonimizado devolve `nome` = `Cliente anonimizado` e os outros quatro campos pessoais `null` (US-CLI-DET-15).
3. `veiculos.placa` de todos os veículos do cliente recebe o texto fixo `ANONIMO`. Modelo, marca, ano, cor e quilometragem ficam (estatística de serviço).
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
  * Cliente com OS dentro do prazo de R1: anonimizar já telefone, email e endereço; manter nome e CPF só para a obrigação legal (art. 16, I) até o fim de R1, sem uso para contato; anonimizar o resto no fim do prazo. Informar isso ao titular por escrito.
* Implementação: precisa de feature própria (procedimento manual primeiro, tela depois). Criar ou não essa feature é decisão da pessoa com BUSSOLA; o VIGIA não cria feature.

## 6. Mascaramento em log (vigente)

### 6.1 Nunca vai para log, em nenhum nível e em nenhum perfil versionado

* Termo de busca (`q`), inteiro ou em parte, nem normalizado.
* Nome, email e endereço de cliente.
* Corpo de request ou response de `/api/v1/clientes/**`.
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
| Placa | Nunca, nem mascarada | usar `veiculoId` |

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

## 7. Configuração que protege a regra (vigente)

API:

* Access log do Tomcat (`server.tomcat.accesslog.enabled`) continua desligado, como está hoje. Se um dia ligar, o padrão usa `%U` (caminho sem query string), nunca `%r` nem `%q`.
* `spring.jpa.show-sql` falso e `org.hibernate.orm.jdbc.bind` nunca em TRACE em perfil versionado: o bind do Hibernate imprime o valor do `q`.
* `org.springframework.web` nunca em DEBUG em perfil versionado e `spring.mvc.log-request-details` nunca verdadeiro: o `DispatcherServlet` em DEBUG imprime a URL da requisição.
* Mensagens de Bean Validation sem `${validatedValue}`: o 400 nunca devolve o valor rejeitado.
* Erro 500: logar só a classe da exceção, o caminho sem query string e um identificador da requisição. Sem `getMessage()` de causa de persistência e sem stack trace que carregue essa mensagem.
* Exceção de persistência nunca vira texto de resposta: o handler global devolve mensagem fixa.
* `record` de DTO que carrega CPF ou endereço sobrescreve `toString()` para mostrar só o `id` (vigente desde a revisão 2; primeiro caso: `ClienteDetalheResponse` da F03b). O `toString()` gerado pelo Java imprime todos os campos, e o Spring MVC em DEBUG escreve o corpo da resposta com ele. Teste unitário prova que a saída não contém o CPF nem o endereço fictícios (achado B1).
* Entidade `Cliente` continua sem `@ToString` e sem `@Data`. O `@Builder` do Lombok gera `toString()` no builder; com `cpf` e `endereco` na entidade, um builder logado por engano imprime os dois. Proibido logar builder; o teste de B1 cobre também `Cliente.builder()...toString()` e, se a saída trouxer o CPF, o campo leva `@ToString.Exclude` (comportamento do Lombok a provar no teste, não verificado nesta revisão).
* Resposta de `/api/v1/clientes/**` sai com `Cache-Control: no-cache, no-store, max-age=0, must-revalidate` (cabeçalho padrão do Spring Security, que o `SecurityConfig` não desliga). Proibido desligar `headers()` ou sobrescrever o `Cache-Control` nessas rotas. O teste de controller do detalhe afirma o cabeçalho no 200.
* Retenção de log de aplicação (proposta, entra na P1): hoje o log só existe na saída padrão do contêiner, sem coletor nem arquivo, e some quando o contêiner é recriado. Quando houver coletor ou arquivo (ANCORA), guardar no máximo 90 dias, com acesso restrito a ADMIN. As linhas 6.3 e 6.4 têm `usuarioId` e `clienteId`, que são dado pessoal por associação.

App (F35):

* Não logar a URL da busca nem o termo (`console`, ferramenta de erro futura).
* Não persistir lista nem detalhe de cliente em disco (`AsyncStorage`, cache de arquivo). Só memória, limpa no logout.
* Campo de busca sem sugestão automática do teclado guardando histórico, quando a plataforma permitir (`autoComplete="off"`, `autoCorrect={false}`).

App, detalhe (F03b ou F35, conforme a decisão D-A do PRD):

* CPF na tela sempre mascarado. O formato é a decisão D-C (pessoa, com ESQUADRO). Parecer do VIGIA: usar o mesmo da 6.2.1, `***.*56.7**-**`, que mostra 3 dígitos contra 5 do formato do card (`123.***.***-00`) e deixa uma regra só para tela e log. A função da tela segue as mesmas regras de entrada da 6.2.1: só dígitos ASCII, exatamente 11, senão "Não informado" e nunca o valor cru (US-CLI-DET-10).
* Rótulo acessível do CPF sem soletrar os dígitos ocultos e sem ler o CPF inteiro (o leitor de tela fala em voz alta). O texto exato é do ESQUADRO e precisa acompanhar o formato escolhido em D-C; o exemplo do card ("começa em 123 e termina em 00") só serve se a pessoa escolher o formato do card.
* O CPF completo recebido da API fica só na memória do hook do detalhe. Não vai para estado global persistido, `AsyncStorage`, cache de arquivo, `console`, parâmetro de rota nem deep link. Sai da memória ao sair da tela e no logout.

Teste e ambiente local:

* Fixture só com dado fictício: nome inventado, telefone de 11 dígitos inventado, email em `@example.com`. Proibido copiar dado de produção para teste, seed ou captura de tela.

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

## 9. Pendências e donos

| ID | Pendência | Dono | Bloqueia |
|---|---|---|---|
| P1 | Validar base legal e prazos R1 e R2 (D2 da F03a) | Pessoa, com jurídico ou contador da oficina | Rotina automática de descarte. Não bloqueia a F03a (só leitura) |
| P2 | Procedimento manual de anonimização (script SQL revisado pelo VIGIA) e tabela de auditoria | Pessoa decide a feature; ESPRESSO implementa; VIGIA revisa | Primeiro cliente real em produção |
| P3 | Canal do titular e quem responde (seção 5, D3 da F03a) | Pessoa, com BUSSOLA | Primeiro cliente real em produção |
| P4 | Aviso de privacidade ao cliente no cadastro (art. 9º) | BUSSOLA (texto), F03c e F35 (tela) | F03c |
| P5 | Datas de OS e pagamento (A6) | CARTOGRAFO | Rotina automática de R1 |
| P6 | ~~Merge do PR #14 na `main` (A0)~~. **Fechada** na revisão 2: a `main` b1f29fc está em Boot 4.1.2 | Pessoa | — |
| P7 | Retenção de log de aplicação (seção 7, achado B6): validar os 90 dias e definir onde o log fica quando houver deploy | Pessoa, ANCORA | Primeiro deploy com coletor ou arquivo de log |
| P8 | Aceite do risco B2 (CPF e endereço inteiros para qualquer token válido, inclusive o de usuário já desativado até o JWT expirar, provado na 8.2) registrado na PR da F08 | Pessoa | Merge da F08 |

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

## 11. Histórico

| Data | Mudança | Onde |
|---|---|---|
| 2026-11-14 | Criação, antes de qualquer código de Clientes | commit 2488c75 |
| 2026-11-16 | Entrou na `main` junto com o ADR-017, mergeado pela pessoa (sem review formal registrado no GitHub) | PR #15, merge 348a43e |
| 2026-11-17 | Revisão 1: A0 e P6 apontam para o PR #14 (o #13 foi mergeado no ramo do #14, e a `main` segue em Boot 4.1.0); local do utilitário de máscara fixado em `security.MascaraDadoPessoal`; contrato exato da máscara (6.2.1); A0 e A1 reconferidos abertos na `main` dfab787. Base legal e prazos seguem como proposta (P1) | PR #17, merge 20fb438 |
| 2026-11-17 | Revisão 2 (F03b): linhas de `cpf` e `endereco` aprovadas para a V4 da F08; CPF e telefone completos no detalhe autenticado registrados na seção 2; linhas de log do detalhe (6.4), incluindo o 404; regras de `toString()`, `Cache-Control` e retenção de log (seção 7); regras do app para o detalhe; parecer, evidência executada e achados B1 a B6 (8.1); A0, A1, A5 e P6 fechados; P7 e P8 novas. Base legal e prazos seguem como proposta (P1) | commit `b42d71b` |
| 2026-11-17 | Revisão do código da F08 (8.2): log real do 200 e do 404 sem CPF nem telefone; B1 fechado, com C1 (`toString` da lista) e C2 (500 preservado no `MissingPathVariableException` de rota) corrigidos; token de usuário desativado lendo CPF inteiro registrado no B2 e no P8. Nada muda em coleta, base legal ou retenção | esta revisão |
