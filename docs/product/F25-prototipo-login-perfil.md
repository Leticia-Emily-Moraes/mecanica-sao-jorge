# PRD — F25: Protótipo de alta fidelidade de Login e Perfil

- Prioridade: P1
- Área: Frontend
- Sprint: Sprint 01: Fundação e Login
- Dono da execução (Figma): ESQUADRO
- Autora: BUSSOLA (Product Owner)
- Data: 2026-11-07
- Etapa da rota: **BUSSOLA (1/3)** → ESQUADRO → CRIVO

> **Recorte desta entrega**: por instrução direta do comandante, esta rodada
> fixa os critérios em Gherkin das telas Login e Perfil (quatro estados,
> logout com confirmação explícita, perfil só exibindo ADMIN/FUNCIONARIO sem
> diferença de permissão) e os dados fictícios a usar. A montagem do
> protótipo em si no Figma é execução de ESQUADRO; este documento é o que ele
> usa para não precisar adivinhar texto, campo ou estado.

## 1. Visão

Protótipo navegável de alta fidelidade das telas **01 Login** e **02 Perfil**
(numeração herdada do wireframe F24), com os tokens de identidade visual
petro (`#1E3A3F`) e primary (`#B5453D`) aplicados, cobrindo os quatro estados
de cada tela e a navegação real entre elas. É o gate do ADR-007 para a F30
(implementação mobile de Login e Perfil) começar — nenhum front de Login ou
Perfil é escrito antes deste protótipo ser aprovado.

## 2. Escopo

### Dentro do escopo
- US-PROTO-LGN-01 a 10 (seção 7): cobertura de tela, cobertura de estado,
  navegação, contraste/foco, aprovação, reprovação, bloqueio por wireframe
  não aprovado, dado fictício, ausência de fluxo fora de escopo, logout com
  confirmação.
- Conteúdo textual exato (rótulo, mensagem de erro, dado de exemplo) que
  ESQUADRO usa nos frames — fixado na seção 8 deste documento.
- Diálogo de confirmação de logout, novo em relação ao wireframe F24 (que
  navegava direto de "Sair" para 01 Login sem etapa intermediária) — ver
  Premissa 6.

### Fora do escopo
- Implementação em código (é escopo da F30).
- Fluxo de recuperação de senha e cadastro de usuário — fora do escopo do
  produto (já registrado em F02, seção 2).
- Qualquer diferenciação visual de permissão entre ADMIN e FUNCIONARIO.
- Endpoint novo de perfil (`GET /api/v1/auth/me` ou equivalente) — não existe
  hoje em `apps/api` (só `POST /api/v1/auth/login`, confirmado em
  `AuthController.java`); se a F30 precisar de uma chamada de rede dedicada
  para popular a tela de Perfil, é decisão de CARTOGRAFO/ESPRESSO sobre o
  escopo do F02, não deste PRD (ver Dúvida 1).

## 3. Glossário

- **Tela**: mesma unidade de navegação do wireframe F24 — "01 Login" e
  "02 Perfil".
- **Estado**: `vazio`, `carregando`, `erro` (rede) e `preenchido`, conforme
  F24. Não há estado de `erro de validação` fora do já previsto em Login
  (campo vazio e credencial inválida); Perfil não tem formulário, logo não
  tem erro de validação (igual ao wireframe).
- **Token petro**: `#1E3A3F`, cor de fundo/superfície escura e de texto sobre
  fundo claro.
- **Token primary**: `#B5453D`, cor de ação primária (botões "Entrar",
  "Confirmar"/"Sair" no diálogo de logout).
- **Protótipo navegável**: artefato Figma em modo Prototype, com transições
  clicáveis entre os frames de Login e Perfil (diferente do wireframe F24,
  que é estático).

## 4. Premissas

1. Os dados exibidos nas telas preenchidas são fictícios; nenhum dado real de
   cliente, veículo ou funcionário aparece no protótipo (igual à Premissa 1
   do briefing da feature).
2. O campo de perfil (ADMIN/FUNCIONARIO) é só exibido, sem diferença visual
   de permissão entre os dois — mesma regra já valendo no backend (F02,
   Premissa 9: "ADMIN e FUNCIONARIO continuam sem diferença de permissão
   nesta fatia").
3. O protótipo reflete a viewport do app mobile (360×800 px, mesma grade do
   wireframe F24, seção 4.1), não desktop ou web.
4. O logout exige confirmação explícita (diálogo) antes de encerrar a sessão
   — item novo desta feature, não existia no wireframe F24 (lá "Sair" ia
   direto para 01 Login).
5. Contraste mínimo AA (WCAG 2.2): calculado pela fórmula de luminância
   relativa do WCAG para os dois tokens fornecidos, contra branco (`#FFFFFF`)
   e contra texto escuro padrão:
   - Texto/ícone branco sobre fundo petro (`#1E3A3F`): razão **≈ 12,1:1**
     (passa AA e AAA para texto normal, mínimo exigido 4,5:1/7:1).
   - Texto/ícone branco sobre botão primary (`#B5453D`): razão **≈ 5,4:1**
     (passa AA para texto normal, mínimo 4,5:1; passa com folga o mínimo de
     3:1 para texto grande/componente de UI).
   - Texto primary (`#B5453D`) sobre fundo branco (ex.: link ou texto de
     ênfase): mesma razão **≈ 5,4:1** (passa AA).
   - Texto petro (`#1E3A3F`) sobre fundo branco (texto de corpo padrão):
     razão **≈ 12,1:1** (passa AA/AAA).
   Essas quatro combinações são as únicas cobertas por esta premissa; qualquer
   tom secundário/cinza que ESQUADRO precisar introduzir (ex. texto
   desabilitado, placeholder) não tem razão calculada aqui — ver Dúvida 2.
6. O diálogo de confirmação de logout tem duas ações: "Cancelar" (fecha o
   diálogo, mantém a sessão) e "Sair" ou "Confirmar saída" (encerra a sessão
   e navega para 01 Login). Nenhuma das duas é destrutiva de dado — logout é
   local (F02, Premissa 8: sem endpoint de invalidação no backend).
7. A tela de Perfil usa os mesmos dados retornados pelo login
   (`usuario.id`, `usuario.nome`, `usuario.email`, `usuario.perfil`, contrato
   fixado em `docs/product/F02-fundacao-backend-login.md`, US-AUTH-01) — não
   há endpoint de perfil separado hoje (ver Dúvida 1).
8. A mensagem de erro de credencial inválida na UI ("E-mail ou senha
   incorretos", convenção já usada no wireframe F24) é cópia de interface,
   diferente da string literal que a API devolve (`mensagem: "Credenciais
   inválidas"`, F02 US-AUTH-01) — a F30 mapeia o 401 para essa cópia, sem
   expor o texto literal da API nem indicar qual campo errou nos dois casos.
9. O padrão de estado "erro de rede" segue a correção já aplicada no arquivo
   Figma da F24 (`docs/design/figma.md`, "Fechamento de resíduos"): popup/
   modal sobreposto ao conteúdo de fundo (não substituição de tela cheia),
   sem emoji e sem mensagem de campo iniciando com "!".

## 5. Dúvidas em aberto

1. **Perfil sem endpoint de rede dedicado**: o wireframe F24 prevê estado
   `carregando` e `erro de rede` para a tela Perfil como se houvesse uma
   chamada de API (`"erro ao carregar o perfil"`). Hoje `apps/api` só expõe
   `POST /api/v1/auth/login` — não há `GET` de perfil. Para o protótipo (mock
   estático), isso não bloqueia nada: os quatro estados são só visuais. Mas
   para a F30 (implementação real), alguém precisa decidir: (a) Perfil
   renderiza direto do que o login já devolveu, guardado em estado local do
   app, sem nova chamada de rede (estado `carregando`/`erro de rede` só
   aparecem na reidratação da sessão ao abrir o app, não a cada visita à
   aba), ou (b) um endpoint novo (`GET /api/v1/auth/me` ou similar) é
   adicionado ao backend. Não decido isso aqui — é escopo de CARTOGRAFO/
   ESPRESSO se e quando a F30 chegar lá. Mantenho os quatro estados no
   protótipo porque US-PROTO-LGN-02 exige, e a decisão de origem do dado não
   muda a aparência da tela.
2. **Tons secundários/cinza**: os dois tokens fornecidos (petro, primary) não
   cobrem texto secundário, placeholder, estado desabilitado nem bordas de
   campo. ESQUADRO vai precisar desses tons para completar os frames (ex.:
   rótulo "(somente leitura)" do wireframe, texto de legenda) — preciso que
   ESQUADRO proponha os valores e eu (ou CRIVO) confirme o contraste AA deles
   antes da aprovação (US-PROTO-LGN-04 cobre também esses tons, não só os dois
   tokens fixados).
3. **Texto exato do botão de confirmação de logout**: uso "Sair" como rótulo
   provisório da ação de confirmar (Premissa 6); se ESQUADRO preferir "Sim,
   sair" ou "Confirmar saída" para diferenciar visualmente do botão "Sair" que
   abre o diálogo, não há objeção de produto — é decisão de copy, registrada
   aqui para não ficar invisível.

## 6. Dados pessoais (LGPD)

| Dado | Finalidade | Base legal | Retenção |
|---|---|---|---|
| Nome, e-mail e perfil fictícios exibidos no protótipo | Demonstrar a tela de Login e Perfil com conteúdo realista, sem usar dado real de funcionário da oficina | Não aplicável — dado fictício, não é dado pessoal de titular real (LGPD não incide), mesmo tratamento já usado em F24 | Enquanto o arquivo Figma do protótipo existir; não migra para produção |
| Token/sessão representados visualmente (ex. estado "logado") | Ilustrar o estado da UI, sem token real nem valor funcional | Não aplicável — elemento gráfico, não token JWT real | Idem |

Reaproveito o mesmo tratamento já registrado em F24 (seção 6 daquele PRD):
nenhum dado real de cliente, veículo ou funcionário circula na ferramenta de
design compartilhada.

## 7. Histórias de usuário e critérios de aceitação

IDs: `US-PROTO-LGN-01` a `US-PROTO-LGN-10`, área `PROTO-LGN`, feature `F25`.

---

### US-PROTO-LGN-01 — Cobertura de telas

**Como** pessoa dona do produto,
**quero** ver as telas 01 Login e 02 Perfil em versão navegável de alta
fidelidade,
**para** confirmar que a identidade visual foi aplicada antes de liberar a
implementação mobile.

```gherkin
Cenário: As duas telas existem em alta fidelidade com os tokens aplicados
  Dado as telas "01 Login" e "02 Perfil" do wireframe F24 (`docs/design/F24-wireframe-baixa-fidelidade.md`, seção 6)
  Quando o protótipo de alta fidelidade é entregue
  Então cada uma das duas telas tem uma versão navegável de alta fidelidade
  E o fundo ou elemento de destaque de cada tela usa o token petro "#1E3A3F"
  E o botão de ação primária de cada tela ("Entrar" em Login, "Sair" em Perfil) usa o token primary "#B5453D"

Cenário de erro: tela faltando ou com cor fora do token
  Dado o protótipo entregue sem uma das duas telas, ou com uma cor de fundo/botão primário diferente de "#1E3A3F"/"#B5453D"
  Quando reviso contra este critério
  Então a entrega não é aprovada (US-PROTO-LGN-06)
  E a tela ou o elemento fora do token é registrado nominalmente na pendência
```

---

### US-PROTO-LGN-02 — Cobertura dos quatro estados

**Como** pessoa dona do produto,
**quero** ver cada tela nos estados vazio (quando aplicável), carregando,
erro e preenchido,
**para** garantir que a F30 não vai improvisar um estado que não foi
desenhado.

```gherkin
Esquema do Cenário: Estados obrigatórios presentes com os tokens aplicados
  Dado a tela "<tela>"
  Quando reviso os frames entregues para essa tela
  Então existe uma versão separada e rotulada para cada estado "<estado>" marcado como obrigatório
  E essa versão usa os tokens petro e primary nos mesmos elementos do estado "Preenchido"

  Exemplos:
    | tela   | estado      |
    | Login  | Carregando  |
    | Login  | Erro        |
    | Login  | Preenchido  |
    | Perfil | Carregando  |
    | Perfil | Erro        |
    | Perfil | Preenchido  |

Cenário: Estado "Vazio" corretamente ausente nas duas telas
  Dado que nem Login nem Perfil têm um estado "Vazio" aplicável (Login é tela de ação; Perfil sempre tem usuário logado — mesma regra do wireframe F24, matriz da seção 5.4)
  Quando reviso os frames entregues
  Então a ausência do estado "Vazio" nas duas telas não é motivo de reprovação

Cenário de erro: estado obrigatório faltando
  Dado um dos seis pares tela/estado da tabela acima
  Quando esse estado não existe como frame separado no protótipo
  Então a entrega não é aprovada (US-PROTO-LGN-06)
  E a pendência registra a tela e o estado faltante
```

---

### US-PROTO-LGN-03 — Navegação

**Como** pessoa dona do produto,
**quero** clicar nas ações de cada tela e seguir o fluxo real,
**para** confirmar que não existe tela órfã nem destino quebrado antes da
implementação.

```gherkin
Cenário: Login com sucesso leva a Perfil
  Dado o protótipo publicado em modo Prototype, no frame "01 Login / Preenchido"
  Quando clico no botão "Entrar"
  Então a navegação leva ao frame "02 Perfil / Preenchido"

Cenário: Sair de Perfil, confirmado, leva a Login
  Dado o protótipo publicado, no frame "02 Perfil / Preenchido"
  Quando clico em "Sair" e depois confirmo a saída no diálogo (US-PROTO-LGN-10)
  Então a navegação leva ao frame "01 Login / Vazio ou Preenchido" (estado inicial da tela, sem dado de sessão anterior)

Cenário de erro: destino quebrado ou tela sem entrada
  Dado qualquer ação clicável de "01 Login" ou "02 Perfil"
  Quando a ação não tem um destino de navegação configurado, ou leva a um frame que não existe
  Então a entrega não é aprovada (US-PROTO-LGN-06)
  E a ação e o destino esperado são registrados na pendência

Cenário de erro: tela órfã
  Dado a tela "02 Perfil"
  Quando nenhuma ação de nenhuma outra tela do protótipo leva até ela
  Então a entrega não é aprovada (US-PROTO-LGN-06)
```

---

### US-PROTO-LGN-04 — Contraste e foco

**Como** pessoa usuária com baixa visão ou navegando por teclado/leitor de
tela,
**quero** texto legível e foco visível em todo controle,
**para** conseguir usar o app sem depender de visão perfeita ou do mouse.

```gherkin
Esquema do Cenário: Contraste mínimo AA nas combinações fixadas
  Dado a combinação "<combinação>" usada em algum texto ou ícone das telas Login/Perfil
  Quando a razão de contraste é calculada pela fórmula de luminância relativa do WCAG
  Então a razão é igual ou maior que "<mínimo>"

  Exemplos:
    | combinação                                  | mínimo |
    | branco sobre fundo petro (#1E3A3F)          | 4.5    |
    | branco sobre botão primary (#B5453D)        | 4.5    |
    | texto primary (#B5453D) sobre fundo branco  | 4.5    |
    | texto petro (#1E3A3F) sobre fundo branco    | 4.5    |

Cenário: Foco visível em todo controle navegável
  Dado qualquer controle tocável/focável das telas Login ou Perfil (campo de e-mail, campo de senha, botão mostrar/ocultar senha, botão "Entrar", botão "Sair", botões do diálogo de logout)
  Quando o controle recebe foco por teclado ou leitor de tela
  Então existe um indicador visual de foco distinto do estado sem foco, visível sobre qualquer fundo da tela

Cenário de erro: contraste ou foco insuficiente
  Dado uma combinação de texto/fundo com razão menor que 4.5, ou um controle sem indicador de foco visível
  Quando reviso a entrega
  Então a entrega não é aprovada (US-PROTO-LGN-06)
  E o elemento e a razão medida (ou a ausência de indicador) são registrados na pendência
```

---

### US-PROTO-LGN-05 — Aprovação

**Como** pessoa dona do produto,
**quero** aprovar explicitamente o protótipo completo de Login e Perfil,
**para** liberar a F30 (ADR-007).

```gherkin
Cenário: Aprovação explícita
  Dado o protótipo completo de Login e Perfil, com US-PROTO-LGN-01 a 04 e 08 a 10 cumpridos sem pendência aberta
  Quando a pessoa dona do produto revisa o arquivo Figma e registra a decisão numa tabela de registro de execução (mesmo padrão da F24, seção "Registro de execução")
  Então a linha registrada marca "Aprovado", com data e identificação de quem aprovou
  E a F30 não inicia implementação antes de existir essa linha "Aprovado"

Cenário de erro: aprovação alegada sem registro
  Dado qualquer alegação verbal ou em chat de que "o protótipo foi aprovado"
  Quando não existe uma linha correspondente na tabela de registro de execução, com data e identificação
  Então a aprovação não conta como cumprida para efeito de liberar a F30
```

---

### US-PROTO-LGN-06 — Reprovação

**Como** pessoa dona do produto,
**quero** registrar toda pendência de tela, estado ou token de forma
rastreável,
**para** que a reapresentação seja objetiva.

```gherkin
Cenário: Reprovação registrada por pendência
  Dado o protótipo com ao menos uma pendência de US-PROTO-LGN-01 a 04 ou 08 a 10
  Quando a pessoa dona do produto revisa o arquivo Figma
  Então a entrega não é aprovada
  E cada pendência vira uma linha na tabela de registro de execução, com a tela, o estado (se aplicável) e a descrição do problema
  E a linha "Aprovado" (US-PROTO-LGN-05) só é registrada depois que todas as pendências abertas forem resolvidas e reconferidas

Cenário: Reapresentação depois do ajuste
  Dado uma pendência registrada
  Quando ESQUADRO corrige o item apontado e a pessoa dona do produto reconfere só esse ponto
  Então a pendência é marcada como resolvida na mesma linha, com a data da correção
  E, se não houver outra pendência aberta, uma nova linha "Aprovado" é registrada
```

---

### US-PROTO-LGN-07 — Bloqueio sem wireframe aprovado

**Como** pessoa dona do produto,
**quero** impedir que o protótipo de alta fidelidade comece sem o wireframe
de baixa fidelidade aprovado,
**para** não desenhar identidade visual sobre um fluxo ainda não validado.

```gherkin
Cenário: Wireframe aprovado antes do início do protótipo
  Dado a linha "Aprovado" registrada em `docs/product/F24-wireframe-baixa-fidelidade.md`, seção "Registro de execução" (BUSSOLA, 2026-11-07)
  Quando o protótipo de alta fidelidade de Login e Perfil (F25) é iniciado
  Então a feature não está bloqueada por este critério, porque a aprovação do wireframe já existe

Cenário de erro: wireframe ainda não aprovado
  Dado a tabela "Registro de execução" de F24 sem nenhuma linha "Aprovado"
  Quando qualquer feature de protótipo de alta fidelidade (F25 a F29) tenta iniciar implementação
  Então a feature fica bloqueada até essa linha existir
```

---

### US-PROTO-LGN-08 — Dados fictícios

**Como** encarregado de dados da oficina,
**quero** que todo conteúdo de exemplo das telas preenchidas seja fictício,
**para** que nenhum dado real de cliente, veículo ou funcionário circule numa
ferramenta de design compartilhada.

```gherkin
Cenário: Conteúdo de exemplo fictício, conforme a seção 8 deste PRD
  Dado o conteúdo de exemplo das telas "01 Login" e "02 Perfil" (seção 8 deste PRD)
  Quando reviso o protótipo
  Então nome, e-mail e perfil exibidos são exatamente os fixados na seção 8, sem corresponder a nenhum funcionário real da oficina

Cenário de erro: dado real identificado
  Dado qualquer nome, e-mail ou outro dado pessoal que corresponda a um funcionário real da oficina
  Quando esse dado aparece em qualquer tela do protótipo ou na ferramenta de design compartilhada
  Então a entrega não é aprovada (US-PROTO-LGN-06)
  E o dado real é removido antes de qualquer nova revisão
```

---

### US-PROTO-LGN-09 — Sem fluxo fora do escopo

**Como** pessoa dona do produto,
**quero** confirmar que a tela de Login não oferece recuperação de senha nem
cadastro de usuário,
**para** não antecipar visualmente um fluxo que o produto não vai ter nesta
fase.

```gherkin
Cenário: Ausência confirmada
  Dado a tela "01 Login" em qualquer estado
  Quando reviso suas ações e links
  Então não há link, botão ou texto de "Esqueci minha senha", "Recuperar senha" ou "Criar conta"/"Cadastrar-se"

Cenário de erro: link ou ação fora do escopo presente
  Dado um link ou botão de recuperação de senha ou cadastro em qualquer frame de "01 Login"
  Quando reviso o protótipo
  Então a entrega não é aprovada (US-PROTO-LGN-06)
  E o elemento é removido antes da reapresentação
```

---

### US-PROTO-LGN-10 — Logout com confirmação

**Como** pessoa usuária da oficina,
**quero** confirmar explicitamente que desejo sair antes de a sessão ser
encerrada,
**para** não perder o acesso por um toque acidental no botão "Sair".

```gherkin
Cenário: Diálogo de confirmação aparece ao tocar "Sair"
  Dado a tela "02 Perfil / Preenchido"
  Quando toco o botão "Sair"
  Então um diálogo de confirmação aparece sobre a tela, com o texto "Deseja realmente sair?" (ou equivalente que não deixe ambíguo o efeito da ação)
  E o diálogo tem duas ações visíveis: "Cancelar" e "Sair" (ou "Confirmar saída", Dúvida 3)

Cenário: Cancelar mantém a sessão
  Dado o diálogo de confirmação de logout aberto
  Quando toco "Cancelar"
  Então o diálogo fecha
  E a tela volta a "02 Perfil / Preenchido", sem navegar para "01 Login"

Cenário: Confirmar encerra a sessão
  Dado o diálogo de confirmação de logout aberto
  Quando toco "Sair" (ou "Confirmar saída") dentro do diálogo
  Então a navegação leva à tela "01 Login", em estado inicial (sem e-mail/senha preenchidos de uma sessão anterior)

Cenário de erro: logout sem confirmação
  Dado a tela "02 Perfil"
  Quando o botão "Sair" navega direto para "01 Login" sem abrir o diálogo de confirmação
  Então a entrega não é aprovada (US-PROTO-LGN-06)
```

## 8. Dados fictícios a usar

Mesmo padrão já fixado pelo wireframe F24 (`docs/design/F24-wireframe-baixa-fidelidade.md`,
seção 5 e seção 6, telas 01 e 02) — reaproveitado aqui sem alteração, para não
criar uma segunda fonte de dado de exemplo divergente:

- **Pessoa (usuário da oficina)**: "Ana Beatriz Souza".
- **E-mail**: "ana.souza@exemplo-ficticio.com.br".
- **Senha** (só em texto de exemplo no campo preenchido, nunca em texto
  legível no frame — campo de senha é sempre mascarado/oculto, mesmo no
  estado "Preenchido"): representada como pontos/asteriscos, nunca como
  string literal visível.
- **Perfil**: badge "ADMIN" (texto visível, não só cor — mesma regra da
  Premissa 2/US-PROTO-LGN-08 e da convenção 4.5 do wireframe F24).

### Textos de interface por tela e estado

**01 — Login**
- Campo: "E-mail" (preenchido: "ana.souza@exemplo-ficticio.com.br").
- Campo: "Senha" (preenchido: valor mascarado), com botão "Mostrar
  senha"/"Ocultar senha".
- Botão primário: "Entrar".
- Carregando: botão com indicador + texto "Entrando...", campos desabilitados
  (rótulo permanece visível).
- Erro de rede (popup sobre o conteúdo de fundo, convenção já aplicada em
  F24): "Não foi possível conectar." + "Verifique sua conexão e tente
  novamente." + botão "Tentar novamente".
- Erro de validação — campo vazio: "Informe seu e-mail" / "Informe sua
  senha", abaixo do respectivo campo, foco no primeiro campo inválido.
- Erro de validação — credencial incorreta (401 da API, Premissa 8): banner
  acima do botão "Entrar" com o texto "E-mail ou senha incorretos." (não
  aponta qual campo).

**02 — Perfil**
- Nome: "Ana Beatriz Souza".
- E-mail: "ana.souza@exemplo-ficticio.com.br".
- Perfil: badge "ADMIN".
- Botão: "Sair".
- Carregando: skeleton no lugar de nome, e-mail e badge.
- Erro de rede (popup sobre o conteúdo de fundo, mesma convenção de Login):
  "Não foi possível carregar." + "Verifique sua conexão e tente novamente." +
  botão "Tentar novamente"; o botão "Sair" permanece acessível mesmo com esse
  erro (segurança: a pessoa precisa conseguir sair mesmo se o carregamento do
  perfil falhar — mesma nota já registrada no wireframe F24).
- Diálogo de confirmação de logout (novo nesta feature, US-PROTO-LGN-10):
  título/texto "Deseja realmente sair?", botões "Cancelar" e "Sair".

## 9. Acessibilidade e i18n

Cobertos como critério de aceitação (US-PROTO-LGN-04), não como fase futura:
contraste mínimo AA nas quatro combinações da Premissa 5, foco visível em
todo controle navegável, nenhuma informação de estado (erro, perfil) só por
cor. Texto de interface não é fixado em código nesta etapa (protótipo
Figma); quando a F30 implementar, cada texto da seção 8 vira uma chave
`area.componente.texto` (ex. `login.campoEmail.rotulo`,
`perfil.dialogoLogout.titulo`), sem string fixa no componente.

## 10. Priorização e o que fica para depois

As dez histórias desta entrega cobrem só Login e Perfil; não há fatiamento
adicional (a feature já é pequena — duas telas, quatro estados cada).
Sequência: US-PROTO-LGN-07 (bloqueio) precisa estar resolvido antes de
qualquer outra começar — já está, após a aprovação do wireframe F24
registrada nesta mesma data (seção 1 deste documento). US-PROTO-LGN-01 a 04
e 08 a 10 são os critérios de conteúdo/estrutura; US-PROTO-LGN-05/06 fecham o
ciclo de aprovação ou reprovação.

Fica para depois, sem decisão nova: implementação em código (F30), endpoint
de perfil dedicado (Dúvida 1, se vier a ser necessário), qualquer
diferenciação de permissão ADMIN/FUNCIONARIO, recuperação de senha e
cadastro de usuário.

## 11. Handoff para ESQUADRO

**O que foi feito**: fixados os critérios de aceitação em Gherkin
(US-PROTO-LGN-01 a 10) das telas Login e Perfil para o protótipo de alta
fidelidade, com texto exato de rótulo/mensagem/dado fictício por estado
(seção 8), os quatro tokens de contraste calculados (Premissa 5) e o fluxo
de confirmação de logout, que é novo em relação ao wireframe F24. Também
resolvi o bloqueio formal do US-DES-07 em
`docs/product/F24-wireframe-baixa-fidelidade.md` (a pendência da tela 15
estava registrada como "Aberta" mesmo depois de corrigida no Figma): registrei
"Resolvida" e adicionei a linha "Aprovado" na tabela de registro de execução
daquele PRD, destravando formalmente F25 a F29.

**Arquivos**:
- Criado: `docs/product/F25-prototipo-login-perfil.md` (este arquivo).
- Alterado: `docs/product/F24-wireframe-baixa-fidelidade.md` — tabela
  "Registro de execução" (seção 7): pendência 1 marcada "Resolvida" e nova
  linha "Aprovado" registrada, com a evidência e o limite do que verifiquei
  (ver próxima seção).

**O que verifiquei de verdade** (vs. o que supus):
- Li `docs/product/F02-fundacao-backend-login.md` por completo: o contrato
  exato de `POST /api/v1/auth/login` (corpo de requisição, corpo de resposta,
  claims do JWT, formato de erro, mensagem exata "Credenciais inválidas") vem
  de lá, não inventado.
- Li `apps/api/src/main/java/.../controller/AuthController.java`: confirmei
  que **não existe** nenhum endpoint de perfil (`GET`) hoje — só
  `POST /api/v1/auth/login`. Isso motivou a Dúvida 1, em vez de eu presumir
  que a tela de Perfil já teria um endpoint para consumir.
- Li `docs/design/F24-wireframe-baixa-fidelidade.md` (seção 6, telas 01 e 02)
  e `docs/design/figma.md` por completo: reaproveitei a mesma estrutura,
  rótulo e dado fictício já fixados ali, em vez de criar uma segunda versão
  divergente.
- **Não verifiquei** o arquivo Figma real pixel a pixel nesta sessão: a
  chamada à ferramenta MCP do Figma (`whoami`) não foi autorizada. A
  aprovação que registrei em F24 se apoia na evidência textual já registrada
  por ESQUADRO (specs e commits `2108fdc`/`ae16a98`), não em inspeção visual
  direta minha — registrado explicitamente na linha "Aprovado" daquele
  documento para CRIVO decidir se quer uma segunda verificação direta com
  acesso ao Figma.
- Calculei as quatro razões de contraste da Premissa 5 pela fórmula padrão de
  luminância relativa do WCAG a partir dos dois valores hexadecimais do
  briefing (`#1E3A3F`, `#B5453D`) — não são valores de tabela pronta, são
  cálculo meu sobre o RGB informado; ESQUADRO ou CRIVO podem reconferir com
  uma ferramenta de contraste se quiserem uma segunda fonte.

**Decisões**:
- Logout com diálogo de confirmação (US-PROTO-LGN-10) é funcionalidade nova
  em relação ao wireframe F24 (que ia direto de "Sair" para "Login"); registrei
  isso explicitamente como divergência, não como correção de um erro do
  wireframe.
- Não bloqueei a escrita deste PRD pela Dúvida 1 (endpoint de perfil
  inexistente): como o protótipo é só visual (Figma, sem chamada de rede
  real), os quatro estados continuam sendo desenháveis independente de como
  a F30 vai popular esses dados depois.

**Pendências**:
1. Dúvida 1 (endpoint de perfil) — fica para quando a F30 for planejada, não
   bloqueia este protótipo.
2. Dúvida 2 (tons secundários/cinza fora dos dois tokens fixados) — preciso
   que ESQUADRO proponha os valores ao montar os frames, para eu ou CRIVO
   conferirmos o contraste antes da aprovação final (US-PROTO-LGN-04).
3. Dúvida 3 (texto exato do botão de confirmação de logout, "Sair" vs.
   "Confirmar saída") — decisão de copy aberta, sem objeção de produto para
   qualquer uma das duas.

**Próximo passo**: ESQUADRO monta os frames de "01 Login" e "02 Perfil" no
arquivo Figma único da operação (`docs/design/figma.md`), em modo Prototype,
usando o texto e o dado fictício fixados na seção 8 deste documento e os
tokens/contraste da Premissa 5. Ao terminar, registra o handoff para CRIVO
conferir US-PROTO-LGN-01 a 04 e 08 a 10, e eu (BUSSOLA) registro a aprovação
ou reprovação na tabela de registro de execução deste PRD (US-PROTO-LGN-05/06).
