# Política de dados pessoais de cliente: retenção, descarte e mascaramento

Dono: VIGIA (AppSec/LGPD). Criada em 2026-11-14 na F03a, antes de qualquer código do módulo Clientes.

Vale para: F03a (listar), F03b (detalhe), F03c (criar), F03d (editar), F09 (CPF e endereço), F35 (tela de lista) e toda feature que leia ou grave `clientes` ou `veiculos`.

Status:

* Regras técnicas (seções 6 e 7): **vigentes desde já**. Feature que não as cumpre não passa na revisão do VIGIA.
* Base legal e prazos (seções 2 a 5): **proposta do VIGIA**, aplicada como hipótese de trabalho até a validação jurídica (D2 da F03a) e a aprovação da oficina, que é a controladora. Mudança de prazo depois da validação altera só este arquivo e a rotina de descarte; nenhum contrato de API depende do prazo.

Relação com outros documentos: complementa `docs/security/lgpd-registro-dados-pessoais.md` (inventário do schema inteiro, criado na F44 e ainda fora da `main`, no PR #13). Quando os dois estiverem na `main`, as linhas `clientes` e `veiculos` do registro passam a apontar para cá. Nada aqui é jurídico definitivo: é a leitura técnica do VIGIA sobre a LGPD (Lei 13.709/2018) e as leis citadas, para a pessoa validar.

## 1. Papéis

* Controladora: a oficina Mecânica São Jorge.
* Operadores: nenhum terceiro trata o dado hoje. Quando houver hospedagem, backup externo ou integração (WhatsApp está no backlog), o fornecedor vira operador e precisa de contrato com cláusula de proteção de dados antes do primeiro envio.
* Encarregado (art. 41): não nomeado. Hipótese a confirmar: a Resolução CD/ANPD nº 2/2022 dispensa o agente de pequeno porte de nomear encarregado, mas exige canal para o titular. O canal está na pendência P3.

## 2. Inventário por campo

| Campo | Existe hoje? | Coleta | Finalidade | Base legal (art. 7º) | Onde aparece na API | Retenção | Descarte |
|---|---|---|---|---|---|---|---|
| `clientes.nome` | Sim (V2, NOT NULL) | Obrigatória | Identificar o cliente na OS e localizar o cadastro no balcão | V (execução de contrato e procedimentos preliminares, como orçamento) | Lista (F03a), detalhe (F03b), OS | Seção 3 | Substituir por texto fixo (seção 4) |
| `clientes.telefone` | Sim (V2, NULL) | Opcional; só dígitos, 10 ou 11 (F03c) | Contato sobre orçamento, valor final e veículo pronto | V | Lista e detalhe | Seção 3 | NULL |
| `clientes.email` | Sim (V2, NULL) | Opcional | Mesmo do telefone | V | Lista e detalhe | Seção 3 | NULL |
| `clientes.cpf` | **Não** (entra na F09) | Opcional. Só quando o cliente pedir nota fiscal ou a emissão exigir. Proibido coletar "por garantia" | Emissão de documento fiscal | II (obrigação legal fiscal) quando houver nota; sem nota, não se coleta | Só no detalhe (F03b). Nunca na lista, na OS resumida nem em log | Seção 3 | NULL |
| `clientes.endereco` | **Não** (entra na F09) | Opcional. Só quando a nota exigir ou para busca e entrega do veículo | Emissão fiscal ou logística combinada com o cliente | II (nota) ou V (busca e entrega) | Só no detalhe | Seção 3 | NULL |
| `clientes.created_at` | Sim | Automática | Contar o prazo da regra R2 | Acessória às linhas acima | Não exposta na F03a | Junto do cliente | Mantida (sozinha não identifica) |
| `veiculos.placa` | Sim (V2, NOT NULL) | Obrigatória | Identificar o veículo atendido. Identifica o dono de forma indireta | V | Detalhe do cliente e do veículo | Igual ao cliente dono | Substituir por texto fixo |
| `veiculos.modelo/marca/ano/cor/quilometragem` | Sim | Obrigatória ou opcional (V2) | Execução do serviço | V | Detalhe do veículo | Igual ao cliente | Mantidos: sem placa e sem dono não identificam a pessoa |

Quem acessa: qualquer usuário autenticado (ADMIN ou FUNCIONARIO), porque o briefing não prevê diferença de permissão nesta fase. Esse acesso amplo é risco aceito e registrado no achado A3 (seção 8).

Para onde vai: só da API para o app mobile, por HTTPS fora do ambiente local. Nenhum envio a terceiro. O app não grava a lista nem o detalhe em disco (seção 7).

Regra de coleta: campo pessoal novo em `clientes` ou `veiculos` só entra com linha nesta tabela aprovada pelo VIGIA antes da migration. A F09 fecha as linhas de CPF e endereço aqui antes de criar as colunas.

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
2. `clientes.telefone`, `clientes.email` e, depois da F09, `clientes.cpf` e `clientes.endereco` recebem NULL.
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

A máscara fica num utilitário único na API (por exemplo `exception` ou `config`, decisão do CARTOGRAFO), com teste unitário para entrada nula, curta e com máscara de formatação. Nada de máscara copiada em cada classe.

### 6.3 Linha de log da busca (F03a, US-CLI-08)

Uma linha INFO por chamada, com só estes campos: `qLen` (tamanho do termo depois de normalizar; 0 sem termo), `page`, `size`, `total` (quantidade de resultados) e `usuarioId` (quem listou, para rastrear extração da base; é dado de funcionário, base legal art. 7º, IX, controle de acesso).

Exemplo: `clientes.listar qLen=5 page=0 size=20 total=3 usuarioId=7`

Teste obrigatório (tarefa 8 da F03a): capturar o log (Logback `ListAppender` ou `OutputCaptureExtension`) numa busca por nome, por email e por telefone com máscara, e provar que nenhuma das strings buscadas, nem os dígitos do telefone, aparece na saída.

## 7. Configuração que protege a regra (vigente)

API:

* Access log do Tomcat (`server.tomcat.accesslog.enabled`) continua desligado, como está hoje. Se um dia ligar, o padrão usa `%U` (caminho sem query string), nunca `%r` nem `%q`.
* `spring.jpa.show-sql` falso e `org.hibernate.orm.jdbc.bind` nunca em TRACE em perfil versionado: o bind do Hibernate imprime o valor do `q`.
* `org.springframework.web` nunca em DEBUG em perfil versionado e `spring.mvc.log-request-details` nunca verdadeiro: o `DispatcherServlet` em DEBUG imprime a URL da requisição.
* Mensagens de Bean Validation sem `${validatedValue}`: o 400 nunca devolve o valor rejeitado.
* Erro 500: logar só a classe da exceção, o caminho sem query string e um identificador da requisição. Sem `getMessage()` de causa de persistência e sem stack trace que carregue essa mensagem.
* Exceção de persistência nunca vira texto de resposta: o handler global devolve mensagem fixa.

App (F35):

* Não logar a URL da busca nem o termo (`console`, ferramenta de erro futura).
* Não persistir lista nem detalhe de cliente em disco (`AsyncStorage`, cache de arquivo). Só memória, limpa no logout.
* Campo de busca sem sugestão automática do teclado guardando histórico, quando a plataforma permitir (`autoComplete="off"`, `autoCorrect={false}`).

Teste e ambiente local:

* Fixture só com dado fictício: nome inventado, telefone de 11 dígitos inventado, email em `@example.com`. Proibido copiar dado de produção para teste, seed ou captura de tela.

## 8. Achados AppSec do desenho da F03a

Revisão feita por leitura de código na `origin/main` (11f35b3), antes de existir código de Clientes. Nada foi executado contra endpoint de cliente, porque ele ainda não existe.

| ID | Severidade | OWASP | Achado | Impacto concreto | Correção específica | Dono |
|---|---|---|---|---|---|---|
| A0 | Crítica (já conhecida) | A06 | `apps/api/pom.xml` da `main` ainda usa Spring Boot 4.1.0, com CVE crítica (osv-scanner na F44: 7 críticas e 11 altas). A correção para 4.1.2 está no PR #13, fora da `main` | O endpoint novo de clientes nasceria sobre Tomcat e spring-webmvc vulneráveis | Não mergear a F03a antes do PR #13, ou rebasear a F03a sobre ele. Regra da casa: dependência com vulnerabilidade conhecida bloqueia o merge | Pessoa (merge do #13), ESPRESSO (rebase) |
| A1 | Média, bloqueia US-CLI-03a | A05 | `GlobalExceptionHandler` só trata `MethodArgumentNotValidException`. Validação de `@RequestParam` (`HandlerMethodValidationException`, `ConstraintViolationException`), `page=abc` (`MethodArgumentTypeMismatchException`) e parâmetro ausente caem no `@ExceptionHandler(Exception.class)` | `size=0`, `size=101`, `page=-1` ou `q` com 101 caracteres respondem 500 em vez de 400. Mesmo padrão já visto pelo CRIVO na F44 (JSON malformado vira 500) | Handlers para essas exceções devolvendo 400 no formato global, com mensagem fixa ou só nome do parâmetro, nunca o valor rejeitado. Teste MockMvc para cada caso | ESPRESSO |
| A2 | Média | A03 | Busca com `LIKE`: `%`, `_` e `\` no termo viram curinga se não forem escapados. O escape padrão do MySQL é `\` | Termo `%` lista a base inteira; termo com `\` pode quebrar a consulta | Parâmetro sempre ligado (nunca concatenado em JPQL ou SQL nativo); escapar `\`, `%` e `_` no service e declarar `ESCAPE` explícito na consulta. Teste de integração com `%`, `_` e `\` contra MySQL real (US-CLI-01a) | ESPRESSO |
| A3 | Média, risco aceito | A01 / A04 | Sem diferença de perfil (briefing) e com JWT de 7 dias sem revogação (ADR-004), qualquer token válido percorre a base inteira em páginas de 100 | Token vazado ou funcionário desligado com token ativo extrai nome, telefone e email de todos os clientes por até 7 dias | Aceito nesta fase. Mitigação vigente: linha de log com `usuarioId` e `total` (seção 6.3). Revisar expiração do JWT e perfil por endpoint quando entrar controle de permissão (backlog) | Pessoa (aceite), CARTOGRAFO (ADR quando houver permissão) |
| A4 | Média | A09 / LGPD | Dado pessoal na query string (`GET ?q=`) fica em access log, proxy e histórico | Termo com nome ou telefone gravado fora do controle da aplicação | Manter `GET` (contrato REST da casa) com as regras da seção 7: access log sem query string, HTTPS fora do local, app sem log de URL | ESPRESSO, ANCORA (proxy e deploy), ORLA (F35) |
| A5 | Baixa | A09 | `handleUnexpected` não loga nada | 500 sem rastro para investigar | Logar classe, caminho sem query e id da requisição (seção 7), com teste que prova que não sai mensagem de causa | ESPRESSO |
| A6 | Média (LGPD) | — | `ordens_servico` e `pagamentos` sem coluna de data na V2 | Prazo R1 impossível de calcular; dado de cliente com OS ficaria sem descarte | Data de abertura e entrega da OS e data do pagamento em migration aditiva nas features de OS e pagamento. Registrar na matriz do `overview.md` | CARTOGRAFO |
| A7 | Baixa | — | V2 não fixa `CHARACTER SET` nem `COLLATE` em `clientes`; depende do padrão do servidor (`mysql:8.4` usa `utf8mb4_0900_ai_ci`) | Em servidor com outra collation, a busca passa a diferenciar acento ou caixa (premissa P5) | Afirmar a collation no teste de integração ou fixá-la em migration aditiva | CARTOGRAFO |
| A8 | Baixa | A04 | `clientes.telefone` é `VARCHAR(20)` sem `CHECK` | Telefone gravado com máscara por outro caminho não casa na busca por dígitos (premissa P4) | Validação de 10 ou 11 dígitos na F03c e, se o CARTOGRAFO aprovar, `CHECK` em migration aditiva | CARTOGRAFO, ESPRESSO (F03c) |

Conferido sem achado: `SecurityConfig` exige autenticação em tudo fora de `PUBLIC_PATHS` (`anyRequest().authenticated()`), então `/api/v1/clientes` já responde 401 sem token pelo `RestAuthenticationEntryPoint` (US-CLI-06a), desde que a rota não seja incluída em `PUBLIC_PATHS`. O DTO `ClienteListResponse` previsto (id, nome, telefone, email) cumpre a minimização da lista.

## 9. Pendências e donos

| ID | Pendência | Dono | Bloqueia |
|---|---|---|---|
| P1 | Validar base legal e prazos R1 e R2 (D2 da F03a) | Pessoa, com jurídico ou contador da oficina | Rotina automática de descarte. Não bloqueia a F03a (só leitura) |
| P2 | Procedimento manual de anonimização (script SQL revisado pelo VIGIA) e tabela de auditoria | Pessoa decide a feature; ESPRESSO implementa; VIGIA revisa | Primeiro cliente real em produção |
| P3 | Canal do titular e quem responde (seção 5, D3 da F03a) | Pessoa, com BUSSOLA | Primeiro cliente real em produção |
| P4 | Aviso de privacidade ao cliente no cadastro (art. 9º) | BUSSOLA (texto), F03c e F35 (tela) | F03c |
| P5 | Datas de OS e pagamento (A6) | CARTOGRAFO | Rotina automática de R1 |
| P6 | Merge do PR #13 (A0) | Pessoa | Merge da F03a |

## 10. Como verificar esta política na F03a

* `git grep -nE "log\.(info|debug|warn|error|trace)" -- apps/api/src/main` e conferir cada linha nova contra a seção 6.
* Teste de log da tarefa 8 passando, com a saída anexada à PR.
* Teste MockMvc de 400 para `size=0`, `size=101`, `page=-1`, `page=abc` e `q` com 101 caracteres, sem o valor rejeitado no corpo (A1).
* Teste de integração com `%`, `_` e `\` como termo (A2).
* `git grep -nE "show-sql|jdbc.bind|log-request-details|accesslog" -- apps/api` sem ocorrência que viole a seção 7.
