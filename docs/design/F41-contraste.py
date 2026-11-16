"""Contraste WCAG 2.x dos pares de cor lidos no Figma FPdB8 (frames 10:895, 10:936, 10:3842, 10:3886, 20:1102/1340, 20:1079)."""


def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def lum(rgb):
    r, g, b = rgb
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def ratio(a, b):
    la, lb = lum(hexrgb(a) if isinstance(a, str) else a), lum(hexrgb(b) if isinstance(b, str) else b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def blend(fg, bg, alpha):
    f, b = hexrgb(fg), hexrgb(bg)
    return tuple(round(alpha * f[i] + (1 - alpha) * b[i]) for i in range(3))


PETRO = '#1E3A3F'
CRAIL = '#B5453D'
WHITE = '#FFFFFF'
PAMPAS = '#F7F5F2'
FLINT = '#6E6A66'
DAWN = '#A8A39D'
WESTAR = '#E2DEDA'
TIDE = '#B7B2AC'
SPECTRA = '#33575D'
ELSALVA = '#923631'
POT = '#F6E7E5'
ROSE = '#E2B5B0'
btn36 = blend(WHITE, PETRO, 0.12)  # botão de ícone 36x36 sobre o cabeçalho
scrim_over_pampas = blend(PETRO, PAMPAS, 0.55)

pares = [
    ('T1', 'texto', 'Marca "MECÂNICA SÃO JORGE" (petro) sobre Pampas', PETRO, PAMPAS),
    ('T2', 'texto', '"Gestão da oficina" e rótulos de campo (Flint) sobre Pampas', FLINT, PAMPAS),
    ('T3', 'texto', 'Placeholder (Dawn) sobre campo branco', DAWN, WHITE),
    ('T4', 'texto', 'Valor digitado (petro) sobre campo branco', PETRO, WHITE),
    ('T5', 'texto', 'Rótulo do botão Entrar / Sair (branco) sobre Crail', WHITE, CRAIL),
    ('T6', 'texto', 'Mensagem de erro (El Salva) sobre Pot Pourri', ELSALVA, POT),
    ('T7', 'texto', 'Título do cabeçalho (branco) sobre petro', WHITE, PETRO),
    ('T8', 'texto', 'Iniciais do avatar (branco) sobre Spectra', WHITE, SPECTRA),
    ('T9', 'texto', 'Nome no Perfil (petro) sobre Pampas', PETRO, PAMPAS),
    ('T10', 'texto', 'Selo ADMIN (branco) sobre petro', WHITE, PETRO),
    ('T11', 'texto', 'Rótulos do cartão (Flint) sobre branco', FLINT, WHITE),
    ('T12', 'texto', 'Valores do cartão (petro) sobre branco', PETRO, WHITE),
    ('T13', 'texto', '"Sair da conta" (Crail) sobre Pampas', CRAIL, PAMPAS),
    ('T14', 'texto', 'Título do diálogo (petro) sobre branco', PETRO, WHITE),
    ('T15', 'texto', 'Mensagem do diálogo (Flint) sobre branco', FLINT, WHITE),
    ('T16', 'texto', 'Cancelar (petro) sobre branco', PETRO, WHITE),
    ('T17', 'texto', 'Rótulo da aba inativa (Tide) sobre petro', TIDE, PETRO),
    ('T18', 'texto', 'Rótulo da aba selecionada (Crail) sobre petro', CRAIL, PETRO),
    ('I1', 'ícone', 'Ícone da aba inativa (Tide) sobre petro', TIDE, PETRO),
    ('I2', 'ícone', 'Ícone da aba selecionada (Crail) sobre petro', CRAIL, PETRO),
    ('I3', 'ícone', 'Ícone de usuário / seta de voltar (branco) sobre botão 36 (petro + 12% branco)', WHITE, btn36),
    ('B1', 'borda', 'Borda do campo em repouso (Westar) sobre branco, contra o fundo Pampas', WESTAR, PAMPAS),
    ('B1b', 'borda', 'Borda do campo em repouso (Westar) contra o interior branco', WESTAR, WHITE),
    ('B2', 'borda', 'Borda de foco/erro de 2 px (Crail) sobre branco', CRAIL, WHITE),
    ('B3', 'borda', 'Borda do campo em erro (Crail) contra Pampas', CRAIL, PAMPAS),
    ('B4', 'borda', 'Borda do botão Cancelar (petro) sobre branco', PETRO, WHITE),
    ('B5', 'borda', 'Borda do botão Sair da conta (Westar) sobre Pampas', WESTAR, PAMPAS),
    ('B6', 'borda', 'Borda do cartão (Westar) sobre Pampas', WESTAR, PAMPAS),
]

print('par  tipo   razão   alvo  resultado  descrição')
for pid, tipo, desc, fg, bg in pares:
    r = ratio(fg, bg)
    alvo = 4.5 if tipo == 'texto' else 3.0
    ok = 'passa' if r >= alvo else 'REPROVA'
    print(f'{pid:4} {tipo:6} {r:5.2f}:1 {alvo:4.1f}  {ok:8} {desc}')

print()
print('Candidatas para placeholder (sobre branco e sobre Pampas):')
for h in ['#6E6A66', '#756F6A', '#78726C', '#7A746E', '#807A74', '#8C8780']:
    print(h, f'branco {ratio(h, WHITE):.2f}', f'Pampas {ratio(h, PAMPAS):.2f}', f'vs petro {ratio(h, PETRO):.2f}')

print()
print('Candidatas para aba selecionada (texto 11 px e ícone sobre petro):')
for h in ['#E8776E', '#EB7F76', '#EE8279', '#F08C83', '#F2968D', '#F4A29A']:
    print(h, f'petro {ratio(h, PETRO):.2f}', f'vs Tide {ratio(h, TIDE):.2f}', f'vs branco {ratio(h, WHITE):.2f}')

print()
print('Candidatas para borda de campo em repouso (3:1 sobre Pampas e sobre branco):')
for h in ['#8C8780', '#8A857E', '#908B85', '#928D87']:
    print(h, f'Pampas {ratio(h, PAMPAS):.2f}', f'branco {ratio(h, WHITE):.2f}')

print()
print('Código atual (main): pares do app hoje')
for desc, fg, bg in [
    ('error slate? text.error primary600 sobre branco', '#B5453D', WHITE),
    ('border.default slate500 sobre branco', '#64748B', WHITE),
    ('text.secondary slate700 sobre branco', '#334155', WHITE),
    ('texto tab idle branco sobre petro (opacity 0.6 => mistura)', '#FFFFFF', PETRO),
]:
    print(f'{ratio(fg, bg):5.2f}:1  {desc}')
tab_off = blend(WHITE, PETRO, 0.6)
print(f'{ratio(tab_off, PETRO):5.2f}:1  aba indisponível (branco a 60% sobre petro)')
print(f'{ratio(blend(CRAIL, PETRO, 0.6), PETRO):5.2f}:1  (n/a)')
