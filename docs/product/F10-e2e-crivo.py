"""E2E de caixa-preta da F10 (PUT /api/v1/clientes/{id}) contra a API rodando. Dados 100% ficticios.

Pre-requisitos: API no ar contra um MySQL DESCARTAVEL (o roteiro cria cerca de 450 clientes) e um
usuario de teste ja existente (nao ha seed nas migrations). A chave do JWT e so para forjar tokens
invalidos (expirado, chave errada, alg none) e vem de arquivo, nunca do codigo.

Uso (Python 3.9+, so biblioteca padrao):
  python3 -I docs/product/F10-e2e-crivo.py --base http://localhost:8080 \\
      --secret-file /caminho/jwt-secret.txt --email usuario@exemplo.test --senha-file /caminho/senha.txt
Saida: transcricao de requisicoes/respostas e o resumo; codigo de saida 0 so se tudo passou.
"""
import argparse
import base64
import hashlib
import hmac
import json
import sys
import threading
import time
import urllib.error
import urllib.request
from collections import Counter

_args = argparse.ArgumentParser(description=__doc__.splitlines()[0])
_args.add_argument("--base", default="http://localhost:8080")
_args.add_argument("--secret-file", required=True)
_args.add_argument("--email", required=True)
_args.add_argument("--senha-file", required=True)
ARGS = _args.parse_args()
BASE = ARGS.base.rstrip("/")
with open(ARGS.secret_file, "rb") as _f:
    SECRET = _f.read().strip()
with open(ARGS.senha_file, "r", encoding="utf-8") as _f:
    SENHA = _f.read().strip()
RESULTS = []  # (id, descricao, passou, detalhe)
_seq = [(int(time.time()) % 8000 + 1) * 1000]


def call(method, path, body=None, token=None, raw=None, ctype="application/json", show=True):
    data = raw if raw is not None else (json.dumps(body, ensure_ascii=False).encode() if body is not None else None)
    req = urllib.request.Request(BASE + path, data=data, method=method)
    if data is not None and ctype:
        req.add_header("Content-Type", ctype)
    if token:
        req.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            status, text = r.status, r.read().decode()
    except urllib.error.HTTPError as e:
        status, text = e.code, e.read().decode()
    try:
        parsed = json.loads(text) if text else None
    except ValueError:
        parsed = text
    if show:
        shown = (json.dumps(body, ensure_ascii=False) if body is not None else (raw.decode("utf-8", "replace") if raw else ""))
        auth = " [Bearer]" if token else " [sem token]"
        print(f"  -> {method} {path}{auth} {shown}")
        print(f"  <- {status} {text[:400]}")
    return status, parsed


def b64(b):
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode()


def jwt(claims, key=SECRET, alg="HS256"):
    head = b64(json.dumps({"alg": alg}).encode())
    pay = b64(json.dumps(claims).encode())
    if alg == "none":
        return f"{head}.{pay}."
    sig = hmac.new(key, f"{head}.{pay}".encode(), hashlib.sha256).digest()
    return f"{head}.{pay}.{b64(sig)}"


def check(cid, desc, cond, detalhe=""):
    RESULTS.append((cid, desc, bool(cond), detalhe))
    print(f"  [{'PASSOU' if cond else 'FALHOU'}] {cid} {desc} {detalhe}")


def novo(prefixo="x", **kw):
    _seq[0] += 1
    n = _seq[0]
    c = {
        "nome": f"Cliente QA {prefixo}{n}",
        "cpf": f"9000{n:07d}",
        "telefone": f"(20) 9{n % 10000:04d}-0001",
        "email": f"qa{prefixo}{n}@qa-f10.test",
        "endereco": f"Rua Fictícia {n}",
    }
    c.update(kw)
    return c


def criar(tok, **kw):
    corpo = novo(**kw)
    s, r = call("POST", "/api/v1/clientes", corpo, tok, show=False)
    assert s == 201, (s, r)
    return r["id"], corpo


def get(tok, cid):
    return call("GET", f"/api/v1/clientes/{cid}", token=tok, show=False)


def secao(t):
    print(f"\n=== {t}")


# ---------------------------------------------------------------- login real
s, r = call("POST", "/api/v1/auth/login", {"email": ARGS.email, "senha": SENHA}, show=False)
assert s == 200, (s, r)
TOK = r["token"]
claims = json.loads(base64.urlsafe_b64decode(TOK.split(".")[1] + "=="))
print("login real: 200; claims =", {k: v for k, v in claims.items() if k not in ("exp", "iat")})

CAMPOS_DETALHE = None

# ---------------------------------------------------------------- C1 / criterio 1
secao("Criterio 1 (US-CLI-21) edicao com sucesso")
idA, a0 = criar(TOK, prefixo="a")
novo_a = dict(a0, nome="Ana Atualizada", telefone="(20) 98888-7777", email="  Ana.Nova@QA-F10.test ", endereco="Av. Nova, 200")
s, r = call("PUT", f"/api/v1/clientes/{idA}", novo_a, TOK)
check("C1", "PUT 200", s == 200)
check("C1", "resposta com valores novos normalizados", r and r["nome"] == "Ana Atualizada" and r["telefone"] == "20988887777" and r["email"] == "ana.nova@qa-f10.test" and r["endereco"] == "Av. Nova, 200" and r["id"] == idA, str(r))
s2, d = get(TOK, idA)
check("C1", "GET detalhe devolve os mesmos valores", s2 == 200 and d == r)
CAMPOS_DETALHE = sorted(r.keys())
check("C1", "resposta e DTO (sem campo de entidade/senha)", all(k not in r for k in ("senha", "senhaHash", "veiculos", "ordens")), str(CAMPOS_DETALHE))

# ---------------------------------------------------------------- C2 / criterio 2
secao("Criterio 2 (US-CLI-22) campo invalido")
s, antes = get(TOK, idA)
invalidos = {
    "nome ausente": {k: v for k, v in novo_a.items() if k != "nome"},
    "nome em branco": dict(novo_a, nome="   "),
    "nome 121 chars": dict(novo_a, nome="N" * 121),
    "cpf com 10 digitos": dict(novo_a, cpf="1234567890"),
    "cpf com letra": dict(novo_a, cpf="1234567890a"),
    "cpf ausente": {k: v for k, v in novo_a.items() if k != "cpf"},
    "telefone curto": dict(novo_a, telefone="1234"),
    "telefone ausente": {k: v for k, v in novo_a.items() if k != "telefone"},
    "email invalido": dict(novo_a, email="sem-arroba"),
    "email 121 chars": dict(novo_a, email="a" * 112 + "@qa.test"),
    "endereco 256 chars": dict(novo_a, endereco="E" * 256),
    "corpo vazio {}": {},
}
for nome, corpo in invalidos.items():
    s, r = call("PUT", f"/api/v1/clientes/{idA}", corpo, TOK, show=False)
    campo = nome.split()[0]
    ok = s == 400 and isinstance(r, dict) and set(r) >= {"timestamp", "status", "erro", "mensagem", "path"} and (campo in r["mensagem"] or nome.startswith("corpo"))
    check("C2", f"{nome} -> 400 apontando o campo", ok, f"{s} {r.get('mensagem') if isinstance(r, dict) else r}")
s, depois = get(TOK, idA)
check("C2", "nenhum dado alterado apos 400s", depois == antes)
s, r = call("PUT", f"/api/v1/clientes/{idA}", raw=b'{"nome": "x", ', token=TOK)
check("C2b", "JSON malformado -> 400", s == 400 and isinstance(r, dict) and "path" in r)
s, r = call("PUT", f"/api/v1/clientes/{idA}", raw=b"nome=x", token=TOK, ctype="text/plain")
check("C2b", "Content-Type text/plain -> 415", s == 415, str(s))
s, r = call("PUT", "/api/v1/clientes/abc", novo_a, TOK)
check("C2b", "id nao numerico no caminho -> 400", s == 400, str(s))
s, depois = get(TOK, idA)
check("C2", "ainda inalterado", depois == antes)

# ---------------------------------------------------------------- C3 / criterio 3
secao("Criterio 3 (US-CLI-23) id inexistente")
s, r = call("PUT", "/api/v1/clientes/999999", novo_a, TOK)
check("C3", "id 999999 -> 404 no formato do handler", s == 404 and set(r) >= {"timestamp", "status", "erro", "mensagem", "path"} and r["status"] == 404, str(r))
for pid in ("0", "-1"):
    s, r = call("PUT", f"/api/v1/clientes/{pid}", novo_a, TOK)
    check("C3b", f"id {pid} (nao e inteiro positivo) -> 400 conforme OpenAPI", s == 400 and r["status"] == 400, str(r))
s, r = call("PUT", "/api/v1/clientes/999999", {}, TOK)
print("  (info) id inexistente + corpo invalido ->", s)

# ---------------------------------------------------------------- C4 / criterio 4
secao("Criterio 4 (US-CLI-27) CPF duplicado")
idB, b0 = criar(TOK, prefixo="b")
s, antes = get(TOK, idA)
s, r = call("PUT", f"/api/v1/clientes/{idA}", dict(novo_a, cpf=b0["cpf"]), TOK)
msg = r["mensagem"] if isinstance(r, dict) else ""
check("C4", "409 formato do handler", s == 409 and set(r) >= {"timestamp", "status", "erro", "mensagem", "path"})
check("C4", "mensagem cita CPF", "cpf" in msg.lower(), msg)
check("C4", "mensagem sem o numero, sem nome nem id do outro", b0["cpf"] not in json.dumps(r) and "Cliente QA b" not in json.dumps(r) and str(idB) not in msg, msg)
s, depois = get(TOK, idA)
check("C4", "dados do primeiro inalterados", depois == antes)
s, r = call("PUT", f"/api/v1/clientes/{idA}", dict(novo_a, cpf=b0["cpf"][:3] + "." + b0["cpf"][3:6] + "." + b0["cpf"][6:9] + "-" + b0["cpf"][9:]), TOK, show=False)
check("C4b", "CPF do outro com mascara tambem -> 409", s == 409, str(s))

# ---------------------------------------------------------------- C5 / criterio 5
secao("Criterio 5 (US-CLI-28) CPF mantido com pontuacao diferente")
cpf = a0["cpf"]
com_mascara = cpf[:3] + "." + cpf[3:6] + "." + cpf[6:9] + "-" + cpf[9:]
s, r = call("PUT", f"/api/v1/clientes/{idA}", dict(novo_a, cpf=com_mascara, telefone="(20) 97777-6666"), TOK)
check("C5", "200 sem conflito", s == 200 and r["telefone"] == "20977776666" and r["cpf"] == cpf, str(r))

# ---------------------------------------------------------------- C6 / criterio 6
secao("Criterio 6 (US-CLI-31) email duplicado")
s, antes = get(TOK, idA)
for var in (b0["email"].upper(), "   " + b0["email"] + "  ", " " + b0["email"].title() + " "):
    s, r = call("PUT", f"/api/v1/clientes/{idA}", dict(novo_a, email=var), TOK)
    msg = r["mensagem"] if isinstance(r, dict) else ""
    check("C6", f"email variante {var!r} -> 409", s == 409 and set(r) >= {"timestamp", "status", "erro", "mensagem", "path"})
    check("C6", "mensagem cita email, sem endereco nem outro cliente", "email" in msg.lower() and "qa-f10" not in json.dumps(r) and "Cliente QA b" not in json.dumps(r) and str(idB) not in msg, msg)
s, depois = get(TOK, idA)
check("C6", "dados do primeiro inalterados", depois == antes)

# ---------------------------------------------------------------- C7 / criterio 7
secao("Criterio 7 (US-CLI-32) email mantido com caixa diferente")
s, atual = get(TOK, idA)
s, r = call("PUT", f"/api/v1/clientes/{idA}", dict(novo_a, email=atual["email"].upper(), telefone="(20) 96666-5555"), TOK)
check("C7", "200 sem conflito e email gravado normalizado", s == 200 and r["email"] == atual["email"], str(r))

# ---------------------------------------------------------------- C8 / criterio 8
secao("Criterio 8 (US-CLI-33) corrida entre edicoes")


def corrida(tipo, rodadas):
    cont = Counter()
    cinco_xx = 0
    for i in range(rodadas):
        x, _ = criar(TOK, prefixo="rx")
        y, _ = criar(TOK, prefixo="ry")
        _seq[0] += 1
        alvo_cpf = f"9100{_seq[0]:07d}"
        alvo_email = f"alvo{_seq[0]}@qa-f10.test"
        out = [None, None]
        bar = threading.Barrier(2)

        def run(k, cid):
            corpo = novo(prefixo="rr")
            if tipo == "cpf":
                corpo["cpf"] = alvo_cpf
            else:
                corpo["email"] = alvo_email
            bar.wait()
            out[k] = call("PUT", f"/api/v1/clientes/{cid}", corpo, TOK, show=False)

        ts = [threading.Thread(target=run, args=(0, x)), threading.Thread(target=run, args=(1, y))]
        [t.start() for t in ts]
        [t.join() for t in ts]
        codigos = tuple(sorted(o[0] for o in out))
        cont[codigos] += 1
        if any(c >= 500 for c in codigos):
            cinco_xx += 1
        for o in out:
            if o[0] == 409:
                assert set(o[1]) >= {"timestamp", "status", "erro", "mensagem", "path"}, o
    return cont, cinco_xx


for tipo in ("cpf", "email"):
    cont, c5 = corrida(tipo, 100)
    print(f"  corrida {tipo}: {dict(cont)}  respostas 5xx={c5}")
    check("C8", f"100 rodadas de {tipo}: sempre um 200 e um 409, sem 5xx", dict(cont) == {(200, 409): 100} and c5 == 0, str(dict(cont)))

# ---------------------------------------------------------------- C9 / criterio 9
secao("Criterio 9 (US-CLI-29) 401")
s, antes = get(TOK, idA)
agora = int(time.time())
base_claims = {k: v for k, v in claims.items()}
variantes = {
    "sem token": None,
    "token lixo": "abc.def.ghi",
    "expirado, chave correta": jwt(dict(base_claims, iat=agora - 7200, exp=agora - 3600)),
    "chave errada": jwt(dict(base_claims, exp=agora + 3600), key=b"outra-chave-outra-chave-outra-chave-xx"),
    "alg none": jwt(dict(base_claims, exp=agora + 3600), alg="none"),
}
for nome, tk in variantes.items():
    s, r = call("PUT", f"/api/v1/clientes/{idA}", dict(novo_a, nome="INVASOR"), tk)
    check("C9", f"{nome} -> 401 no formato do handler", s == 401 and isinstance(r, dict) and set(r) >= {"timestamp", "status", "erro", "mensagem", "path"} and r["status"] == 401, str(r))
ctrl = jwt(dict(base_claims, exp=agora + 3600))
s, r = call("PUT", f"/api/v1/clientes/{idA}", dict(novo_a, email=None, telefone="(20) 96666-5555"), ctrl)
check("C9", "controle positivo: mesmo construtor com exp futuro -> 200", s == 200, str(s))
s, depois = get(TOK, idA)
check("C9", "nada alterado pelos 401 (nome nao e INVASOR)", depois["nome"] != "INVASOR")
s, r = call("PUT", "/api/v1/clientes/999999", novo_a, None, show=False)
check("C9", "401 antes do 404 (sem token em id inexistente)", s == 401, str(s))

# ---------------------------------------------------------------- C10 / criterio 10
secao("Criterio 10 (US-CLI-30) id divergente no corpo")
idC, c0 = criar(TOK, prefixo="c")
idD, d0 = criar(TOK, prefixo="d")
s, d_antes = get(TOK, idD)
s, r = call("PUT", f"/api/v1/clientes/{idC}", dict(novo(prefixo="cc"), id=idD), TOK)
s_c, c_dep = get(TOK, idC)
s_d, d_dep = get(TOK, idD)
check("C10", "200 e id da resposta e o do caminho", s == 200 and r["id"] == idC, str(r))
check("C10", "cliente do corpo (D) intacto", d_dep == d_antes)
check("C10", "cliente do caminho (C) alterado", c_dep["nome"].startswith("Cliente QA cc"))
s, r = call("PUT", f"/api/v1/clientes/{idC}", dict(novo(prefixo="cd"), id=999999, createdAt="2000-01-01T00:00:00"), TOK, show=False)
s2, c2 = get(TOK, idC)
check("C10", "id inexistente no corpo tambem ignorado (createdAt nao e exposto pela API: nao verificavel por HTTP)", s == 200 and r["id"] == idC and c2["id"] == idC)

# ---------------------------------------------------------------- bordas
secao("Bordas extras")
idE, e0 = criar(TOK, prefixo="e")
s, r = call("PUT", f"/api/v1/clientes/{idE}", {k: v for k, v in novo(prefixo="ee").items() if k != "email"}, TOK, show=False)
check("E1", "email ausente no PUT apaga o email (PUT substitui tudo) -> 200 com email null", s == 200 and r["email"] is None, str(r))
idF, _ = criar(TOK, prefixo="f", email=None)
s, r = call("PUT", f"/api/v1/clientes/{idF}", {k: v for k, v in novo(prefixo="ff").items() if k != "email"}, TOK, show=False)
check("E2", "dois clientes sem email nao conflitam", s == 200, str(s))
s, r = call("PUT", f"/api/v1/clientes/{idE}", dict(novo(prefixo="eg"), email="  "), TOK, show=False)
check("E3", "email so com NBSP vira null (pendente de confirmacao da pessoa)", s == 200 and r["email"] is None, str(r))
s, r = call("PUT", f"/api/v1/clientes/{idE}", dict(novo(prefixo="eh"), nome="x'; DROP TABLE clientes;-- <script>alert(1)</script>"), TOK, show=False)
s2, g = get(TOK, idE)
check("E4", "entrada hostil gravada como texto, tabela intacta", s == 200 and g["nome"].startswith("x'; DROP") and call("GET", "/api/v1/clientes?q=", token=TOK, show=False)[0] == 200)
s, r = call("PUT", f"/api/v1/clientes/{idE}", novo(prefixo="ei", cpf=f"9200{_seq[0]:07d}"), TOK, show=False)
s_igual, r_igual = call("PUT", f"/api/v1/clientes/{idE}", {k: r[k] for k in ("nome", "cpf", "telefone", "email", "endereco")}, TOK, show=False)
check("E5", "reenviar o proprio corpo (idempotente) -> 200 igual", s_igual == 200 and r_igual == r)
# U+200B
idG, g0 = criar(TOK, prefixo="g")
idH, h0 = criar(TOK, prefixo="h")
zw = "​"
s, r = call("PUT", f"/api/v1/clientes/{idG}", dict(novo(prefixo="gg"), email=h0["email"] + zw), TOK, show=False)
check("E6", "U+200B no fim de email de outro cliente -> 409 (indice ignora o caractere)", s == 409, str(s))
nome_e, dom = h0["email"].split("@")
s, r = call("PUT", f"/api/v1/clientes/{idG}", dict(novo(prefixo="gh"), email=f"{nome_e}@qa{zw}-f10.test"), TOK, show=False)
check("E6", "U+200B no meio do dominio de email alheio -> 409", s == 409, str(s))
s, r = call("PUT", f"/api/v1/clientes/{idG}", dict(novo(prefixo="gi"), email=f"unico{_seq[0]}{zw}@qa-f10.test"), TOK, show=False)
s2, gg = get(TOK, idG)
check("E7", "U+200B sem conflito: 200 e o caractere invisivel e GRAVADO (risco X3 aceito)", s == 200 and zw in (gg["email"] or ""), repr(gg["email"]))
# vinculo com veiculo
idV, v0 = criar(TOK, prefixo="v")
_t = int(time.time())
PLACA = "Q%s%s%d%s%02d" % (chr(65 + _t % 26), chr(65 + _t // 26 % 26), _t // 676 % 10, chr(65 + _t // 6760 % 26), _t // 175760 % 100)
sv, rv = call("POST", f"/api/v1/clientes/{idV}/veiculos", {"placa": PLACA, "marca": "Fiat", "modelo": "Uno", "ano": 2015, "cor": "Prata"}, TOK, show=False)
s, r = call("PUT", f"/api/v1/clientes/{idV}", novo(prefixo="vv"), TOK, show=False)
sl, lista = call("GET", f"/api/v1/clientes/{idV}/veiculos", token=TOK, show=False)
txt = json.dumps(lista)
check("E8", "veiculo continua vinculado apos a edicao (POST veiculo=%s)" % sv, sv == 201 and s == 200 and sl == 200 and PLACA in txt, f"placa={PLACA} {txt[:200]}")
# 409 com CPF e email ambos em conflito + id imutavel
s, r = call("PUT", f"/api/v1/clientes/{idG}", dict(novo(prefixo="gj"), cpf=h0["cpf"], email=h0["email"]), TOK, show=False)
print("  (info) CPF e email ambos conflitantes ->", s, r["mensagem"] if isinstance(r, dict) else r)
s, lst = call("GET", "/api/v1/clientes?q=Cliente%20QA%20gg&size=5", token=TOK, show=False)
check("E9", "busca (F03a) segue funcionando apos edicoes", s == 200)

# ---------------------------------------------------------------- resumo
print("\n=== RESUMO")
ok = sum(1 for r in RESULTS if r[2])
print(f"verificacoes: {len(RESULTS)}  passou: {ok}  falhou: {len(RESULTS) - ok}")
for r in RESULTS:
    if not r[2]:
        print("FALHOU:", r)
sys.exit(0 if ok == len(RESULTS) else 1)
