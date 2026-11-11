---
status: aceito
date: 2026-11-07
decision-makers: [CARTOGRAFO (Arquiteto)]
consulted: [ESPRESSO (Dev Java), VIGIA (AppSec/LGPD)]
informed: [REGENTE, ORLA, CRIVO, ANCORA]
---

# Autenticação stateless via JWT HS256 com spring-security-oauth2-resource-server

## Contexto e problema

O sistema é de uso interno da oficina, com login por email e senha e perfis
ADMIN/FUNCIONARIO (sem diferença de permissão nesta fatia). O app mobile precisa
manter a sessão sem estado de servidor. A F00 adicionou `io.jsonwebtoken` (jjwt)
ao `pom.xml` como biblioteca candidata de JWT (comentário no código cita
"ADR-004"), mas **nenhum ADR foi gravado** e **nenhum código de autenticação
usa a jjwt** (o `SecurityConfig` atual não tem filtro nem `UserDetailsService`).
O escopo da F02 pede explicitamente `JwtEncoder`/`JwtDecoder` via
`spring-security-oauth2-resource-server`. Qual mecanismo de autenticação adotar?

## Fatores de decisão

* Postura stateless (briefing: sem sessão, sem estado de servidor).
* Integração nativa com Spring Security (filtro de bearer token, entry point).
* Formato de erro 401 no padrão do handler global (ADR-011), não o desafio
  `WWW-Authenticate` padrão do Spring.
* A própria API emite e valida o token (sem servidor de autorização externo nem
  JWKS remoto); chave simétrica fora do código e do log.
* Expiração configurável por propriedade (7 dias nesta fatia), não hardcoded.

## Opções consideradas

* **Opção A — spring-security-oauth2-resource-server + oauth2-jose (Nimbus), HS256.**
* **Opção B — io.jsonwebtoken (jjwt) com `OncePerRequestFilter` manual** (o que a F00 pré-cableou).
* **Opção C — Sessão com estado no servidor** (cookie de sessão, `HttpSession`).

## Resultado da decisão

Opção escolhida: **"Opção A — oauth2-resource-server com HS256"**, porque dá a
postura de Resource Server idiomática do Spring: `JwtEncoder`/`JwtDecoder`
(implementações Nimbus) sobre uma `SecretKeySpec` HS256, `BearerTokenAuthenticationFilter`
automático, e um `AuthenticationEntryPoint`/`AccessDeniedHandler` customizável
para devolver o 401/403 no formato do handler global. Como a jjwt nunca foi
usada, trocá-la é limpo.

Parâmetros da decisão:
* **Dependência**: adicionar `spring-boot-starter-oauth2-resource-server`;
  **remover** `jjwt-api`/`jjwt-impl`/`jjwt-jackson` do `pom.xml`.
* **Algoritmo**: HS256 (chave simétrica), via propriedade `jwt.secret` (mín. 256
  bits / 32 bytes), nunca em código nem em log. `JwtEncoder` =
  `NimbusJwtEncoder` com `ImmutableSecret`; `JwtDecoder` =
  `NimbusJwtDecoder.withSecretKey(...)`.
* **Expiração**: `jwt.expiration-minutes` (ADR-009/JwtProperties), **padrão 10080
  (7 dias)** — altera o default atual de 120. O claim `exp` reflete exatamente
  `iat + expiration-minutes`.
* **Claims**: `sub` = id do usuário (estável), `perfil` = ADMIN|FUNCIONARIO,
  `iss` = `mecanica-sao-jorge-api`, `iat`, `exp`. **Nunca** inclui senha/hash.
* **Senha**: comparada com `BCryptPasswordEncoder` (bean); `senha_hash` só é
  lida para comparação, nunca retornada.
* **Erro 401**: `AuthenticationEntryPoint` customizado escreve o corpo do
  ADR-011 (timestamp, status, erro, mensagem, path).

## Consequências

### Consequências
* Bom, porque usa o caminho suportado do Spring Security: menos código próprio de parsing/validação de token, menos superfície de bug de segurança.
* Bom, porque `JwtDecoder` valida assinatura e `exp` automaticamente; token expirado/ inválido/ malformado vira 401 sem código manual.
* Bom, porque o mesmo mecanismo (resource server) serve todos os endpoints protegidos das próximas features.
* Ruim, porque exige remover a jjwt que a F00 deixou (mudança de pom e de qualquer referência a ADR-004 no código).
* Ruim, porque HS256 usa chave única de assinatura/validação: se vazar, permite forjar token — mitigado por guardar o segredo fora de código/log e rotacioná-lo em incidente (invalidando todos os tokens, aceitável sem refresh nesta fatia).
* Neutro, porque não há refresh token nem blacklist: logout é local no app (descarta o token); revogação só por expiração ou troca de segredo.

### Confirmação
* Teste de controller (MockMvc): `POST /api/v1/auth/login` com credencial válida retorna 200 e um JWT cujo `exp - iat == 7 dias`.
* Teste de segurança: endpoint protegido sem `Authorization` → 401 no formato ADR-011; token assinado com outra chave / expirado / malformado → 401.
* Teste: corpo de login não contém `senha`/`senha_hash` em nenhum campo.
* VIGIA valida o threat model do fluxo de login (ver `overview.md`).

## Prós e contras das opções

### Opção A — oauth2-resource-server (HS256)
* Bom, porque é a abstração oficial do Spring para validar bearer JWT.
* Bom, porque integra entry point, filtro e decoder prontos.
* Neutro, porque HS256 compartilha a chave (adequado para emissor = validador, que é o caso).

### Opção B — jjwt com filtro manual
* Bom, porque a dependência já está no pom (menos mudança imediata).
* Ruim, porque exige escrever e manter o filtro, o parsing e o tratamento de exceções de token à mão — mais superfície de erro de segurança.
* Ruim, porque contraria o pedido explícito da fatia (`JwtEncoder`/`JwtDecoder`).

### Opção C — Sessão com estado
* Bom, porque é simples de invalidar no servidor (logout real).
* Ruim, porque contraria a restrição stateless do briefing e complica o cliente mobile (gestão de cookie/sessão), sem ganho para o caso de uso.

## Mais informações

Supersede o uso pré-cableado de jjwt pela F00 (sem ADR gravado). Depende de
[[ADR-009-configuracao-por-variavel-de-ambiente-e-segredos-fora-do-codigo]]
(segredo e expiração em propriedade) e de
[[ADR-011-handler-global-de-erro-e-mapeamento-de-status]] (formato do 401).
Contrato do endpoint de login e threat model em `../overview.md`. Refresh token
e blacklist ficam fora desta fatia (decisão nova quando entrarem).
