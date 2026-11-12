# F30 — Revisão AppSec e registro LGPD (Login e Perfil mobile)

Responsável pela revisão: VIGIA (AppSec / LGPD). Data: 2026-11-07.
Escopo revisado: `apps/mobile` na branch `feat/f30-mobile-login-perfil`
(telas de Login e Perfil consumindo `POST /api/v1/auth/login` da F02).
Nada fora de `apps/mobile` foi alterado por esta revisão, exceto este documento.

> Esta revisão cobre apenas o cliente mobile da F30. A superfície do backend
> (emissão/validação de JWT, hash de senha, timing-attack) foi revista na F02
> e não é reaberta aqui.

## 1. Veredito

Aprovado com apontamentos. Nenhum achado Crítico ou Alto no recorte atual
(desenvolvimento interno contra `localhost`). Um achado **Médio** vira **Alto**
no momento do deploy de produção e precisa de gate antes de publicar (ver §4,
F30-SEC-01). Um endurecimento de armazenamento foi aplicado e coberto por teste
nesta revisão (ver §3).

## 2. OWASP Top 10 (2021) — itens avaliados no cliente

| Item | Avaliação no recorte da F30 |
|---|---|
| A01 Broken Access Control | Autorização é responsabilidade do servidor (F02). O cliente só guarda o token em armazenamento protegido pelo SO e o envia em `Authorization: Bearer` (`src/api/http.ts:27`). Sem decisão de permissão no cliente. **OK.** |
| A02 Cryptographic Failures | Token/PII em Keychain/Keystore via `expo-secure-store` (bom). **Achado Médio**: URL base aceita `http://` em claro (§4 F30-SEC-01). |
| A03 Injection | Sem SQL/shell no cliente; corpo do login serializado por `JSON.stringify` (`src/auth/auth-api.ts:45`), sem concatenação. **OK.** |
| A04 Insecure Design | Erro de credencial genérico, logout com diálogo de confirmação, validação de campo vazio sem bater na API. **OK.** |
| A05 Security Misconfiguration | `.env` fora do versionamento; só `.env.example` rastreado, sem segredo. `EXPO_PUBLIC_*` embute no bundle e isso está documentado no README. **OK.** |
| A07 Identification & Auth Failures | Token em store seguro, reidratação de sessão, 401 → sessão expirada (infra), erro genérico. Ressalva de logout só local (§4 F30-SEC-04). **OK com ressalva.** |
| A08 Data Integrity Failures | `parseUsuarioArmazenado` desserializa sem validar forma (§4 F30-SEC-02). **Achado Baixo.** |
| A09 Logging Failures | `grep` por `console.*` em `app/` e `src/`: **nenhuma ocorrência**. Senha nunca é persistida nem logada; token nunca é logado. **OK.** |

## 3. Endurecimento aplicado nesta revisão

**Armazenamento preso ao aparelho (anti-backup).** `SecureStore.setItemAsync`
do token e do resumo do usuário passou a usar
`keychainAccessible: WHEN_UNLOCKED_THIS_DEVICE_ONLY`
(`src/auth/auth-context.tsx:19-21,89-96`). Efeito: o token JWT e o PII
(nome/e-mail/perfil) só são legíveis com o aparelho desbloqueado e **não entram
em backup criptografado (iCloud/iTunes) nem são restauráveis em outro aparelho**.
Reduz a superfície de exposição do dado pessoal além do dispositivo de origem
(LGPD art. 46 — medidas de segurança).
Coberto por teste: `src/auth/auth-context.test.tsx` — *"should store token and
user bound to this device only (no encrypted backup)"*.

## 4. Achados por severidade

### F30-SEC-01 — [Média → Alta em produção] Tráfego em claro (HTTP) não bloqueado
- **Onde**: `src/config/env.ts:3` (`DEFAULT_API_BASE_URL = http://localhost:8080`) e `apps/mobile/.env`.
- **Impacto concreto**: se a mesma configuração `http://` for usada contra um
  host que não seja `localhost`, o e-mail, a senha (corpo do login) e o token
  JWT trafegam em claro e podem ser interceptados na rede (roubo de credencial
  e de sessão). Hoje o alvo é `localhost`, então o risco é baixo **em dev**.
- **Correção específica**:
  1. No gate de produção, exigir `https://` em `EXPO_PUBLIC_API_BASE_URL` e
     rejeitar/avisar quando o host não for `localhost`/`127.0.0.1` e o esquema
     não for `https`.
  2. Manter o ATS da Apple e o `cleartextTrafficPermitted=false` do Android
     (padrões em release) — não criar exceção global de cleartext.
- **Status**: registrado para o gate de produção; não bloqueia a fatia de dev atual.

### F30-SEC-02 — [Baixa] Desserialização do usuário sem validação de forma
- **Onde**: `src/auth/auth-context.tsx` (`parseUsuarioArmazenado`, `JSON.parse(...) as Usuario`).
- **Impacto concreto**: se o valor no Keystore for corrompido/adulterado, um
  objeto arbitrário é renderizado na tela de Perfil. Risco baixo: a origem é o
  store local cifrado; quem escreve lá já comprometeu o aparelho.
- **Correção específica**: validar as chaves esperadas (`id`, `nome`, `email`,
  `perfil ∈ {ADMIN, FUNCIONARIO}`) antes de aceitar; em divergência, tratar como
  sessão ausente e cair no login. (Não aplicado nesta revisão por ser Baixo e
  fora do pedido direto do comandante; recomendado para a próxima fatia.)

### F30-SEC-03 — [Baixa] PII do usuário é persistida no cliente
- **Onde**: `src/auth/auth-context.tsx` — guarda `nome`/`email`/`perfil` junto do token.
- **Impacto concreto**: PII em repouso no aparelho. Mitigado por `expo-secure-store`
  (Keychain/Keystore) + `THIS_DEVICE_ONLY` (§3) + limpeza no logout/401/desinstalação.
- **Correção específica**: aceitável no recorte atual (Perfil não tem endpoint
  próprio, ver README do mobile). Quando existir `GET /auth/me`, preferir buscar
  o PII sob demanda e guardar só o token, reduzindo o dado em repouso.

### F30-SEC-04 — [Informativo] Logout é só local (JWT stateless)
- **Onde**: `src/auth/auth-context.tsx` (`logout`) — apaga o token; não invalida no servidor (F02, premissa 8).
- **Impacto concreto**: um token exfiltrado antes do logout continua válido até
  expirar (TTL padrão de 7 dias — `apps/api/.../application.yml:32`,
  `JWT_EXPIRATION_MINUTES:10080`). É o trade-off conhecido de JWT sem revogação.
- **Correção específica**: decisão de backend — reduzir o TTL e/ou introduzir
  revogação (lista de negação / rotação) se o modelo de risco exigir. Sem ação
  no cliente nesta fatia.

### Verificado e correto (não são achados)
- `expo-secure-store`, **nunca** `AsyncStorage` (`grep` por `AsyncStorage`: zero ocorrências).
- 401 → mensagem genérica *"E-mail ou senha incorretos."* sem indicar o campo
  (`src/i18n/strings.ts:17`, `app/login.tsx:79,102-110`) — atende US-LGN-FRONT-02.
- Nenhum `console.*` em `app/`/`src/`; senha nunca persistida nem logada.

## 5. Ciclo de vida do dado pessoal (LGPD)

Contexto: sistema de **uso interno** da oficina; os titulares são funcionários
(perfis ADMIN/FUNCIONARIO). Não há titular consumidor final nesta fatia.

| Dimensão | Registro |
|---|---|
| **O que é coletado** | No login: **e-mail** e **senha** (credencial). A API devolve e o app guarda: **id**, **nome**, **e-mail**, **perfil** (`LoginResponse`/`UsuarioResumo`). Dados pessoais = nome e e-mail; `perfil`/`id` são funcionais. |
| **Senha** | Tratada como segredo: trafega só no corpo do `POST /auth/login`, **nunca** é persistida no cliente e **nunca** é logada. O backend guarda apenas `senha_hash` (BCrypt, F02); o DTO de saída nunca inclui senha/hash. |
| **Base legal (proposta)** | Art. 7, V da LGPD — **execução de contrato** do qual o titular (funcionário) é parte: o acesso autenticado é necessário para ele operar a ferramenta de trabalho. Registro de acesso/segurança apoia-se também no art. 7, IX (legítimo interesse). **A confirmar pelo controlador/DPO** — a definição final da base legal é decisão jurídica, não de engenharia. |
| **Quem acessa** | No aparelho: apenas o processo do app e o usuário logado, via store protegido pelo SO (Keychain iOS / Keystore Android), preso ao aparelho (`THIS_DEVICE_ONLY`). Em trânsito: a API da F02. Não há terceiro, analytics ou SDK de rastreamento no cliente. |
| **Para onde vai** | Cliente → API (`POST /auth/login`). Em repouso no cliente: `expo-secure-store`. Sem envio a serviço externo. **Exigir HTTPS em produção** (F30-SEC-01) para proteger o dado em trânsito. |
| **Por quanto tempo fica** | Token e PII ficam no store até: (a) logout, (b) 401 em chamada autenticada (sessão expirada), ou (c) desinstalação do app. O token tem validade própria de **7 dias** (TTL do backend). Não há retenção além do necessário para a sessão. |
| **Como é apagado** | `logout()` e `tratarSessaoExpirada()` chamam `deleteItemAsync` do token e do usuário (`src/auth/auth-context.tsx`). A desinstalação remove o Keychain/Keystore do app. Sem cópia residual (sem AsyncStorage, sem cache de arquivo, sem log). |
| **Mascaramento em log/teste** | Sem log de dado pessoal (nenhum `console.*`). Dados de teste são fictícios (`ana.souza@exemplo-ficticio.com.br`), não dado real. |

### Pendências de governança LGPD (fora do alcance do código)
- Confirmar a **base legal** com o controlador/DPO (a tabela acima é proposta).
- Definir **política de retenção do lado servidor** (logs de autenticação, tabela
  Usuarios) — esta revisão cobre só o ciclo no cliente mobile.

## 6. Como validar

```bash
cd apps/mobile
npm test        # 28/28 — inclui o teste de armazenamento preso ao aparelho
npm run typecheck
npm run lint
```

Verificações manuais de AppSec feitas nesta revisão (shell real):
- `grep` por `console.*` e `AsyncStorage` em `app/`/`src/`: zero ocorrências.
- `git check-ignore apps/mobile/.env` → ignorado; `git ls-files` só rastreia `.env.example`.
- Confirmado no backend: `UsuarioResumo` não expõe senha/hash; TTL do JWT = 10080 min.
