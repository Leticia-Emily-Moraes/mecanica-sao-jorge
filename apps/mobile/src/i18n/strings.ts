/**
 * Dicionário de textos de interface, por chave `area.componente.texto`
 * (convenção fixada em docs/product/F25-prototipo-login-perfil.md, seção 9).
 * Só pt-BR nesta etapa — nenhum componente usa string fixa, sempre `t(chave)`,
 * para que uma chave nova vire tradução sem tocar em tela.
 *
 * Textos de Login, Perfil, diálogo de logout e tab bar seguem o Figma
 * `FPdB8RymAnN81pbKfizdzE` (F41). As chaves `login.campoEmail.*` mantêm o
 * nome porque o campo continua enviando o e-mail (D-03); só o rótulo mudou.
 */
const strings = {
  'login.titulo': 'MECÂNICA SÃO JORGE',
  'login.subtitulo': 'Gestão da oficina',
  'login.campoEmail.rotulo': 'Usuário',
  'login.campoEmail.placeholder': 'Seu usuário',
  'login.campoEmail.erroVazio': 'Informe seu usuário',
  'login.campoSenha.rotulo': 'Senha',
  'login.campoSenha.placeholder': 'Sua senha',
  'login.campoSenha.erroVazio': 'Informe sua senha',
  /** Texto visível da ação (L1) e nome acessível completo (WCAG 2.5.3). */
  'login.campoSenha.mostrarTexto': 'Mostrar',
  'login.campoSenha.ocultarTexto': 'Ocultar',
  'login.campoSenha.mostrar': 'Mostrar senha',
  'login.campoSenha.ocultar': 'Ocultar senha',
  'login.botaoEntrar.rotulo': 'Entrar',
  'login.botaoEntrar.carregando': 'Entrando…',
  'login.erroCredencial.mensagem':
    'Usuário ou senha incorretos. Confira os dados e tente novamente.',
  /** L3: caixa de erro entre a senha e o botão. Redação proposta pelo ESQUADRO, frame não relido. */
  'login.erroRede.mensagem': 'Sem conexão. Verifique a internet da oficina e tente de novo.',
  'login.sessaoExpirada.mensagem': 'Sua sessão expirou. Faça login novamente.',

  'cabecalho.usuario.rotulo': 'Perfil',
  'cabecalho.voltar.rotulo': 'Voltar',

  'inicio.titulo': 'Início',
  'inicio.vazio.titulo': 'Em breve',
  'inicio.vazio.mensagem': 'Os módulos da oficina chegam nas próximas versões.',

  'perfil.titulo': 'Perfil',
  'perfil.rotuloUsuario': 'Usuário',
  'perfil.rotuloPerfil': 'Perfil de acesso',
  'perfil.rotuloVersao': 'Versão do app',
  'perfil.versaoIndisponivel': 'Não informada',
  'perfil.perfilAdmin.selo': 'ADMIN',
  'perfil.perfilAdmin.texto': 'Administrador',
  'perfil.perfilFuncionario.selo': 'FUNCIONÁRIO',
  'perfil.perfilFuncionario.texto': 'Funcionário',
  'perfil.botaoSair.rotulo': 'Sair da conta',
  'perfil.dialogoLogout.titulo': 'Sair da conta?',
  'perfil.dialogoLogout.mensagem': 'Você vai precisar do usuário e senha para entrar de novo.',
  'perfil.dialogoLogout.botaoCancelar': 'Cancelar',
  'perfil.dialogoLogout.botaoConfirmar': 'Sair',

  /** P1: texto visível sob o indicador e também o nome acessível da região. */
  'sessao.inicializando.rotulo': 'Carregando sessão…',
  /** P2 (`83:754`): textos transcritos da planilha F41; o frame não foi relido. */
  'sessao.erroInicializacao.titulo': 'Não foi possível carregar',
  'sessao.erroInicializacao.mensagem':
    'Verifique a internet da oficina e tente de novo. Se continuar, entre novamente.',
  'sessao.erroInicializacao.botaoTentarNovamente': 'Tentar novamente',
  'sessao.erroInicializacao.botaoEntrarNovamente': 'Entrar novamente',

  'menu.tabbar.ordens.rotulo': 'Ordens',
  'menu.tabbar.ordens.indisponivel': 'Ordens, indisponível nesta versão',
  'menu.tabbar.clientes.rotulo': 'Clientes',
  'menu.tabbar.clientes.indisponivel': 'Clientes, indisponível nesta versão',
  'menu.tabbar.catalogo.rotulo': 'Catálogo',
  'menu.tabbar.catalogo.indisponivel': 'Catálogo, indisponível nesta versão',
  'menu.tabbar.financeiro.rotulo': 'Financeiro',
  'menu.tabbar.financeiro.indisponivel': 'Financeiro, indisponível nesta versão',
} as const;

export type ChaveTexto = keyof typeof strings;

export function t(chave: ChaveTexto): string {
  return strings[chave];
}
