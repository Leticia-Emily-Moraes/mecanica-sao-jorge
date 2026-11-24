# F35 — Recebido da F03b (F08): tela de detalhe do cliente

- Autora: BUSSOLA (Product Owner) · Data: 2026-11-17
- Estado: **proposta de texto para a F35. O card da F35 não foi editado:** features das Sprints 02 a 05 são refinadas pela pessoa (briefing). Este arquivo existe para a tela não ficar sem dono depois que saiu da F08.
- Origem: `docs/product/F03b-clientes-detalhe.md`, seção 4. A tela **não entra no aceite da F08**.

## Contexto

Tela de detalhe do cliente, consumindo `GET /api/v1/clientes/{id}` (F08): 200 com `id, nome, cpf, telefone, email, endereco`; 404, 400 e 401 no formato `timestamp, status, erro, mensagem, path`. A F35 depende de a F08 entregar o endpoint.

Premissas herdadas: CPF e telefone chegam só com dígitos (a formatação é da tela); endereço é campo único (ADR-018, pendente de aceite, D-B da F08); sessão expirada usa `tratarSessaoExpirada` do app. Textos por chaves `clientes.detalhe.*`. A lista de veículos do cliente é chamada própria da F04; o atalho de navegação para veículos é decisão da F35 e da F26.

Decisão aberta que muda o critério 01: **D-C, formato da máscara de CPF.** Card original: `123.***.***-00`. Política e protótipo F26: `***.*56.7**-**` (parecer do VIGIA: este, por mostrar menos e ser a mesma regra do log). Abaixo uso o padrão da política; a pessoa decide com ESQUADRO, e a paridade manda o código seguir o Figma. Telefone na tela: `(11) 91234-5678`.

Valem os 4 estados, acessibilidade (WCAG 2.2 AA), i18n, tokens e paridade com o frame do Figma por captura lado a lado (briefing).

## Critérios (Gherkin)

**US-CLI-DET-01 · Detalhe preenchido**
- Dado o cliente 7 e `GET /api/v1/clientes/7` respondendo **200** com `nome`, `cpf`="12345678900", `telefone`="11912345678", `email` e `endereco`
- Quando abro o detalhe
- Então vejo o nome, o CPF como `***.*56.7**-**` (D-C), o telefone como `(11) 91234-5678`, o e-mail e o endereço
- E o CPF inteiro e o telefone só com dígitos não aparecem na tela

**US-CLI-DET-03 · Opcionais ausentes**
- Dado `GET /api/v1/clientes/8` respondendo **200** com `cpf`, `telefone`, `email` e `endereco` = `null`
- Quando abro o detalhe
- Então cada campo ausente mostra "Não informado" (texto vindo do i18n) e a tela não mostra `null`, `undefined` nem campo em branco
- E a tela não quebra

**US-CLI-DET-10 · CPF fora do formato (borda)**
- Dado **200** com `cpf` vazio, `null` ou com menos ou mais de 11 dígitos
- Quando a tela exibe o campo
- Então aparece "Não informado" e o valor cru nunca é exibido

**US-CLI-DET-07 · Carregando**
- Dado que o detalhe foi solicitado e a resposta não chegou
- Quando a tela está em espera
- Então há um indicador de carregamento com nome acessível, anunciado por leitor de tela

**US-CLI-DET-08 · Erro de rede ou de servidor**
- Dado que a chamada falha por rede ou responde **500**
- Quando a tela processa a falha
- Então aparece o estado de erro anunciado por leitor de tela, com "Tentar novamente" e "Voltar", ambos acessíveis por teclado
- E ao acionar "Tentar novamente" a tela volta a carregar e a mesma chamada é refeita

**US-CLI-DET-09 · Cliente não encontrado**
- Dado que a API respondeu **404**
- Quando a tela processa a resposta
- Então aparece "Cliente não encontrado", distinto do erro de rede, **sem** "Tentar novamente" e com ação de voltar

**US-CLI-DET-18 · Sessão expirada**
- Dado que a API respondeu **401** ao abrir o detalhe
- Quando a tela processa a resposta
- Então o app chama `tratarSessaoExpirada`, apaga o token, volta ao login com o aviso de sessão expirada e não mostra o estado de erro de rede

**US-CLI-DET-12 · Acessibilidade**
- Dado o detalhe preenchido (**200**)
- Quando navego por teclado ou leitor de tela
- Então cada campo tem rótulo associado ao valor, o foco é visível e a informação não depende só de cor
- E o CPF tem rótulo acessível próprio que diz que está parcialmente oculto e **não soletra os asteriscos**, com texto acompanhando o formato de D-C

## Tarefas recebidas (numeração do card F08)

8. Função de máscara de CPF (utilitário puro) com testes de borda: 11 dígitos, vazio, nulo, menos e mais de 11.
9. Serviço de API e hook do detalhe, com chamada, token e conversão fora do JSX.
10. Tela compondo componentes pequenos e tipados (linha rótulo/valor, estados carregando, erro e não encontrado), tokens centralizados, chaves `clientes.detalhe.*`.
11. Rótulos acessíveis (incluindo o do CPF), anúncio dos estados, foco visível e testes de componente.
12. (parte de app) Suíte do app, registrando o que fica sem cobertura (foco de teclado e leitor de tela sem device).
13. Conferência do frame no Figma e captura lado a lado.

Dúvida registrada: a F35 depende de a F26 ter o frame do detalhe aprovado; não abri o Figma nesta etapa.
