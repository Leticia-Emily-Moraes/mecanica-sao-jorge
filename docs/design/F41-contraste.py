"""Contraste WCAG 2.x (AA) dos pares de cor finais de Login, Perfil, diálogo de logout e tab bar.

Valores do Figma FPdB8 (frames 10:895, 10:936, 10:3842, 10:3886, 20:1102/1340, 20:1079), lidos por
`get_variable_defs` em 16/11/2026, com as três cores aprovadas pela pessoa na mesma data:
placeholder = Flint, borda de campo = #8C8780, aba selecionada = #EE8279.

Uso:  python3 docs/design/F41-contraste.py
Saída: uma linha por par e código de saída 1 se algum par obrigatório ficar abaixo do alvo.
Alvos: texto 4,5:1 (WCAG 1.4.3); ícone e borda de controle 3:1 (WCAG 1.4.11).
Pares "isento" e "decorativo" são impressos para registro e não derrubam o script.
Isentos: item desabilitado da tab bar (D1) e campo desabilitado em carregamento (D2 e D3, R-15, decisão de 16/11),
por serem componentes inativos (WCAG 1.4.3 e 1.4.11).
"""

import sys


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
    la = lum(hexrgb(a) if isinstance(a, str) else a)
    lb = lum(hexrgb(b) if isinstance(b, str) else b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def blend(fg, bg, alpha):
    f = hexrgb(fg) if isinstance(fg, str) else fg
    b = hexrgb(bg) if isinstance(bg, str) else bg
    return tuple(round(alpha * f[i] + (1 - alpha) * b[i]) for i in range(3))


PETRO = '#1E3A3F'
CRAIL = '#B5453D'
WHITE = '#FFFFFF'
PAMPAS = '#F7F5F2'
FLINT = '#6E6A66'
WESTAR = '#E2DEDA'
TIDE = '#B7B2AC'
SPECTRA = '#33575D'
ELSALVA = '#923631'
POT = '#F6E7E5'
# Valores aprovados em 16/11 (substituem Dawn, Westar-como-borda-de-campo e Crail-na-aba).
PLACEHOLDER = FLINT
FIELD_BORDER = '#8C8780'
TAB_SELECTED = '#EE8279'
# Campo desabilitado em carregamento (L2, decisão R-15 de 16/11): fundo `color.surface.skeleton` = slate100.
SKELETON = '#F1F5F9'

btn36 = blend(WHITE, PETRO, 0.12)  # botão de ícone 36x36 sobre o cabeçalho (branco a 12% sobre petro)
tab_off_label = blend(TIDE, PETRO, 0.5)  # item desabilitado: 50% de opacidade sobre a barra petro (T2)

# (id, tipo, descrição, primeiro plano, fundo)
# tipo: texto | icone | borda  -> obrigatórios; isento | decorativo -> só registro.
PARES = [
    ('T1', 'texto', 'Marca "MECÂNICA SÃO JORGE" (petro) sobre Pampas', PETRO, PAMPAS),
    ('T2', 'texto', '"Gestão da oficina" e rótulos de campo (Flint) sobre Pampas', FLINT, PAMPAS),
    ('T3', 'texto', 'Placeholder (Flint, aprovado) sobre campo branco', PLACEHOLDER, WHITE),
    ('T4', 'texto', 'Valor digitado (petro) sobre campo branco', PETRO, WHITE),
    ('T5', 'texto', 'Rótulo do botão Entrar e Sair do diálogo (branco) sobre Crail', WHITE, CRAIL),
    ('T6', 'texto', 'Mensagem de erro (El Salva) sobre Pot Pourri', ELSALVA, POT),
    ('T7', 'texto', 'Título do cabeçalho (branco) sobre petro', WHITE, PETRO),
    ('T8', 'texto', 'Iniciais do avatar (branco) sobre Spectra', WHITE, SPECTRA),
    ('T9', 'texto', 'Nome no Perfil (petro) sobre Pampas', PETRO, PAMPAS),
    ('T10', 'texto', 'Selo ADMIN / FUNCIONÁRIO (branco) sobre petro', WHITE, PETRO),
    ('T11', 'texto', 'Rótulos do cartão (Flint) sobre branco', FLINT, WHITE),
    ('T12', 'texto', 'Valores do cartão (petro) sobre branco', PETRO, WHITE),
    ('T13', 'texto', 'Texto "Sair da conta" (Crail) sobre Pampas', CRAIL, PAMPAS),
    ('T14', 'texto', 'Título do diálogo (petro) sobre branco', PETRO, WHITE),
    ('T15', 'texto', 'Mensagem do diálogo (Flint) sobre branco', FLINT, WHITE),
    ('T16', 'texto', 'Cancelar (petro) sobre branco', PETRO, WHITE),
    ('T17', 'texto', 'Rótulo da aba inativa (Tide) sobre petro', TIDE, PETRO),
    ('T18', 'texto', 'Rótulo da aba selecionada (#EE8279, 11 px) sobre petro', TAB_SELECTED, PETRO),
    ('I1', 'icone', 'Ícone da aba inativa (Tide) sobre petro', TIDE, PETRO),
    ('I2', 'icone', 'Ícone da aba selecionada (#EE8279) sobre petro', TAB_SELECTED, PETRO),
    ('I3', 'icone', 'Ícone de usuário e seta de voltar (branco) sobre o botão de 36', WHITE, btn36),
    ('I4', 'icone', 'Círculo e "!" do alerta (El Salva) sobre Pot Pourri', ELSALVA, POT),
    ('B1', 'borda', 'Borda do campo em repouso (#8C8780) contra o interior branco', FIELD_BORDER, WHITE),
    ('B1b', 'borda', 'Borda do campo em repouso (#8C8780) contra o fundo Pampas', FIELD_BORDER, PAMPAS),
    ('B2', 'borda', 'Borda de foco e de erro de 2 px (Crail) contra o interior branco', CRAIL, WHITE),
    ('B3', 'borda', 'Borda de foco e de erro de 2 px (Crail) contra Pampas', CRAIL, PAMPAS),
    ('B4', 'borda', 'Borda do botão Cancelar (petro) sobre branco', PETRO, WHITE),
    ('F1', 'borda', 'Anel de foco do item da tab bar (branco, T1) sobre petro', WHITE, PETRO),
    ('F2', 'borda', 'Anel de foco dos controles em tela clara (petro) sobre branco', PETRO, WHITE),
    # Pares lidos no Figma em 16/11 (P1, P2, L2) e no frame proposto I1:
    ('I5', 'icone', 'Ícone do estado de erro (P2) e do vazio (I1), Spectra, sobre o círculo #EDE9E4', SPECTRA, '#EDE9E4'),
    ('I6', 'icone', 'Indicador de carregamento do P1 (petro) sobre Pampas', PETRO, PAMPAS),
    ('I7', 'icone', 'Indicador de carregamento do botão no L2 (branco) sobre Crail', WHITE, CRAIL),
    # Registro, sem reprovar o script:
    ('B7', 'decorativo', 'Círculo #EDE9E4 do P2 sobre Pampas; o ícone e o texto carregam a informação', '#EDE9E4', PAMPAS),
    ('B5', 'decorativo', 'Borda do botão "Sair da conta" (Westar) sobre Pampas; o texto Crail (T13) identifica o botão', WESTAR, PAMPAS),
    ('B6', 'decorativo', 'Borda do cartão (Westar) sobre Pampas; o conteúdo é texto e não depende da borda', WESTAR, PAMPAS),
    ('D1', 'isento', 'Item desabilitado da tab bar (Tide a 50% sobre petro): componente inativo, isento (WCAG 1.4.3 e 1.4.11)', tab_off_label, PETRO),
    # R-15: o campo `editable={false}` (tela de Login em carregamento) usa o fundo do skeleton. Componente de interface
    # inativo é isento de contraste mínimo (WCAG 1.4.3 e 1.4.11); as razões abaixo são só registro, não derrubam o script.
    ('D2', 'isento', 'Campo desabilitado em carregamento (R-15): valor (petro) sobre o fundo skeleton #F1F5F9', PETRO, SKELETON),
    ('D3', 'isento', 'Campo desabilitado em carregamento (R-15): borda #8C8780 contra o fundo skeleton #F1F5F9', FIELD_BORDER, SKELETON),
]

ALVO = {'texto': 4.5, 'icone': 3.0, 'borda': 3.0}


def main():
    falhas = []
    print('par   tipo        razão    alvo  resultado   descrição')
    for pid, tipo, desc, fg, bg in PARES:
        r = ratio(fg, bg)
        if tipo in ALVO:
            alvo = ALVO[tipo]
            ok = r >= alvo
            resultado = 'passa' if ok else 'REPROVA'
            if not ok:
                falhas.append(pid)
        else:
            alvo = 0.0
            resultado = tipo
        print(f'{pid:5} {tipo:10} {r:6.2f}:1 {alvo:5.1f}  {resultado:10}  {desc}')

    print()
    print('Contraste entre estados da aba (informativo; o selecionado se distingue por cor, peso SemiBold e anúncio):')
    print(f'  #EE8279 contra Tide #B7B2AC = {ratio(TAB_SELECTED, TIDE):.2f}:1')
    print()
    print('Botões B5 e B6 decorativos (WCAG 1.4.11): a borda não é a única pista do controle, o texto é.')
    print(f'  texto do botão "Sair da conta" T13 = {ratio(CRAIL, PAMPAS):.2f}:1 (alvo 4,5:1)')

    print()
    if falhas:
        print('FALHOU: pares obrigatórios abaixo do alvo ->', ', '.join(falhas))
        return 1
    print('OK: todos os pares obrigatórios atingem o alvo.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
