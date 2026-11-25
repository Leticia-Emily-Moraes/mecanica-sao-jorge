# F35 — Recebido da F03c (F09): formulário de criação de cliente

- Autor: CARTOGRAFO (Arquiteto) · Data: 2026-11-17 · Tarefa 17 do card F09
- Estado: **proposta de texto para a F35. O card da F35 não foi editado:** features das Sprints 02 a 05 são refinadas pela pessoa (briefing). Este arquivo existe para os pontos de tela da criação não ficarem sem dono quando a F09 fechar só com a API.
- Origem: revisão humana da F09 (17/11 21:34, tarefa 17), política de dados do cliente (seção 7, "App, criação", revisão 3 do VIGIA) e contrato "Clientes criar (F03c)" em `docs/architecture/overview.md`. A tela **não entra no aceite da F09**.
- Fora deste arquivo de propósito: cenários Gherkin. Escrever os cenários e os critérios é do BUSSOLA no refinamento da F35. Aqui ficam só os requisitos que a tela herda e o porquê de cada um.

## Contexto

Formulário que consome `POST /api/v1/clientes` (F09). A requisição leva `nome`, `telefone`, `cpf`, `email` e `endereco`. As respostas são: 201 com os 6 campos do detalhe e `Location: /api/v1/clientes/{id}`; 400, 401, 415 e 500 no formato `timestamp, status, erro, mensagem, path`; e 409 `CPF ja cadastrado` (ADR-020, ativo). A F35 depende de a F09 entregar o endpoint e de a F26 ter o frame aprovado. Este arquivo não abriu o Figma.

Premissas herdadas:

* O app envia CPF e telefone com ou sem máscara; a API grava só dígitos (ADR-021).
* `nome`, `cpf` e `telefone` são **obrigatórios**; `email` e `endereco` são opcionais. Verificado pelo CRIVO contra a API real (F09, 18/11): sem `cpf` ou com `cpf` só com espaços a API responde 400 `cpf e obrigatorio`. A P9 (CPF obrigatório ou opcional) segue aberta para a pessoa; se ela decidir "opcional", muda uma anotação na API e o rótulo na tela.
* A sessão expirada usa `tratarSessaoExpirada` do app.
* Os textos vêm das chaves `clientes.criar.*`.

## Requisitos recebidos (os cinco pontos da tarefa 17 e os que vêm com eles)

### R1. Toque duplo

A API **não é idempotente**, mas o CPF é único no banco (V6, ADR-020): o segundo `POST` com o mesmo CPF responde 409 `CPF ja cadastrado` e não cria nada (verificado pelo CRIVO contra a API real e com 10 chamadas concorrentes no teste de integração). A tela ainda precisa evitar o duplo toque, para o funcionário não ver um 409 depois de um 201 que ele mesmo causou:

* O botão "Salvar" fica desabilitado e com estado de carregando acessível do envio até a resposta.
* O hook tem uma trava própria (estado "enviando" checado antes de chamar o serviço), independente do botão, para cobrir Enter no teclado e toque rápido antes de a interface repintar.
* Sem repetição automática do `POST` em erro de rede. Repetir é sempre ação explícita do funcionário.
* Caso de resposta perdida na rede depois do `INSERT`: o funcionário tenta de novo e recebe 409 `CPF ja cadastrado`, sem duplicata. A tela deve sugerir buscar o cliente na lista (a API não informa o id do cadastro existente). Fica sem chave de idempotência, o que não é mais necessário para evitar duplicata de CPF.

### R2. Erro 500 ou queda de rede mantendo os dados

* Em 500, rede caída ou tempo esgotado, o formulário continua preenchido e mostra o estado de erro anunciado por leitor de tela, com "Tentar novamente".
* Os dados ficam **só na memória da tela**. Nada de rascunho em `AsyncStorage`, `SecureStore` ou cache de arquivo (política, seção 7). A memória é limpa ao sair da tela, depois do 201 e no logout.
* No 401, chama `tratarSessaoExpirada`. Os dados digitados se perdem de propósito, porque não há rascunho em disco. Essa troca foi aceita pela política e deve aparecer no texto da tela, se o ESQUADRO julgar necessário.
* Depois do 201, navega para o detalhe só com o `id` da resposta (nunca dado do formulário em parâmetro de rota ou deep link).

### R3. Acessibilidade do formulário (WCAG 2.2 AA, briefing)

* Cada campo tem rótulo visível associado (não só placeholder) e indicação de obrigatório em texto, não só por cor ou asterisco.
* Erro por campo: a mensagem fica junto do campo, ligada a ele (descrição acessível do campo) e anunciada por leitor de tela quando aparece.
* No envio com erro (da validação local ou do 400 da API), o foco vai para o **primeiro campo inválido** na ordem visual.
* Ordem de foco igual à ordem visual; "Salvar" alcançável por teclado; teclado numérico em CPF e telefone; foco visível; alvo de toque no tamanho mínimo do design system.
* O CPF aparece inteiro enquanto se digita (R5), então o leitor de tela lê os dígitos. Isso é esperado: quem usa é o funcionário conferindo com o cliente no balcão.

### R4. i18n e mensagens da API

* Todo texto da tela por chave `clientes.criar.*` (rótulos, dicas, erros locais, estados, sucesso).
* Formato do 400 da API: `mensagem` é uma string só, com uma mensagem por campo unida por `"; "`, **sem ordem garantida**. Cada mensagem começa pelo nome do campo JSON, em português sem acento (ex.: `telefone deve ter 10 ou 11 digitos`). Lista completa na tabela do ADR-021.
* Proposta do CARTOGRAFO: separar por `"; "`, ler a primeira palavra como nome do campo e mostrar o texto da chave `clientes.criar.erro.<campo>` no campo certo. Se a primeira palavra não for um dos 5 campos, mostrar a mensagem da API inteira num erro geral do formulário. Assim a tela fica acentuada e traduzível sem depender da ordem. **Divergência a decidir com VIGIA e BUSSOLA:** a política (seção 7) diz "mostra a mensagem do 400 por campo, como veio da API". A regra que importa nos dois casos é a mesma: nunca montar mensagem com o valor digitado.
* 400 de corpo ilegível ("Corpo da requisicao invalido") e 415 indicam defeito do app, não do funcionário: erro geral, sem campo.

### R5. Máscara de CPF na digitação

* Enquanto o funcionário digita, o CPF aparece **inteiro**, com a máscara de digitação `000.000.000-00` (formato e componente do ESQUADRO, F26). Depois do 201, vale a máscara de exibição da D-C no detalhe.
* A tela pode enviar com ou sem máscara; a API aceita só dígitos ASCII com espaço, ponto e hífen (ADR-021). Colar texto com outro caractere (ex.: `/`) gera 400 do campo `cpf`.
* O telefone segue a mesma ideia: máscara `(00) 00000-0000` ou `(00) 0000-0000`, enviado como estiver.
* A validação local só antecipa o 400 (11 dígitos para CPF; 10 ou 11 para telefone). Quem decide é a API. O dígito verificador do CPF está em aberto (pendência B4 no ADR-021): se a API passar a validá-lo, a tela antecipa a mesma regra e mostra o 400 `cpf invalido` no campo.

### R6. Campos sem histórico do teclado

CPF, telefone e e-mail sem sugestão automática que guarde histórico, com as propriedades listadas na política, seção 7, "App, criação", quando a plataforma permitir. Nada do formulário vai para `console`, ferramenta de erro, parâmetro de rota nem deep link.

### R7. 409 no campo CPF

O 409 `CPF ja cadastrado` já está ativo na API (V6, ADR-020; o ADR continua "proposto" até a pessoa aceitar). Ele aparece como erro do campo `cpf` (chave `clientes.criar.erro.cpfDuplicado`), com o foco nele. Os outros dados ficam preenchidos. Ação sugerida: buscar o cliente existente pela lista. A tela não mostra qual cliente tem o CPF, e a API também não diz. Se a pessoa recusar o ADR-020, CPF repetido volta a responder 201 e este requisito cai.

### R8. Aviso de privacidade (P4)

O aviso ao titular é **no balcão** (cartaz ou texto entregue), não na tela, porque quem usa o app é o funcionário. O conteúdo mínimo está na política, seção 7, e o texto é do BUSSOLA. O lembrete ao funcionário na tela é opcional e fica com o ESQUADRO. A P4 não bloqueia a F09, mas bloqueia o primeiro cadastro real.

## Tarefas sugeridas para a F35 (sem numeração do card)

1. Serviço de API e hook de criação, com trava de envio (R1), estado em memória (R2) e conversão do 400 por campo (R4), fora do JSX.
2. Formulário com componentes pequenos e tipados, máscaras de digitação do ESQUADRO (R5), propriedades sem histórico (R6) e chaves `clientes.criar.*`.
3. Acessibilidade: rótulos, erro anunciado, foco no primeiro inválido (R3), com testes de componente. O que depende de device (leitor de tela real) fica registrado como sem cobertura.
4. Conferência com o frame da F26 e captura lado a lado.

Dúvidas registradas: frame de criação na F26 (não conferido); divergência da R4 com a política; chave de idempotência para o risco residual da R1 (sem dono).
