/**
 * Dicionário de textos de interface, por chave `area.componente.texto`
 * (convenção fixada em docs/product/F25-prototipo-login-perfil.md, seção 9).
 * Só pt-BR nesta etapa — nenhum componente usa string fixa, sempre `t(chave)`,
 * para que uma chave nova vire tradução sem tocar em tela.
 */
const strings = {
  'login.titulo': 'Mecânica São Jorge',
  'login.campoEmail.rotulo': 'E-mail',
  'login.campoEmail.erroVazio': 'Informe seu e-mail',
  'login.campoSenha.rotulo': 'Senha',
  'login.campoSenha.erroVazio': 'Informe sua senha',
  'login.campoSenha.mostrar': 'Mostrar senha',
  'login.campoSenha.ocultar': 'Ocultar senha',
  'login.botaoEntrar.rotulo': 'Entrar',
  'login.botaoEntrar.carregando': 'Entrando...',
  'login.erroCredencial.mensagem': 'E-mail ou senha incorretos.',
  'login.erroRede.titulo': 'Não foi possível conectar.',
  'login.erroRede.mensagem': 'Verifique sua conexão e tente novamente.',
  'login.erroRede.botaoTentarNovamente': 'Tentar novamente',
  'login.sessaoExpirada.mensagem': 'Sua sessão expirou. Faça login novamente.',

  'perfil.titulo': 'Perfil',
  'perfil.rotuloNome': 'Nome',
  'perfil.rotuloEmail': 'E-mail',
  'perfil.rotuloPerfil': 'Perfil de acesso',
  'perfil.botaoSair.rotulo': 'Sair',
  'perfil.dialogoLogout.titulo': 'Deseja realmente sair?',
  'perfil.dialogoLogout.botaoCancelar': 'Cancelar',
  'perfil.dialogoLogout.botaoConfirmar': 'Sair',

  'sessao.inicializando.anuncio': 'Carregando sessão...',
  'sessao.erroInicializacao.titulo': 'Não foi possível carregar.',
  'sessao.erroInicializacao.mensagem': 'Verifique sua conexão e tente novamente.',
  'sessao.erroInicializacao.botaoTentarNovamente': 'Tentar novamente',
  'sessao.erroInicializacao.botaoEntrarNovamente': 'Entrar novamente',

  'menu.tabbar.perfil.rotulo': 'Perfil',
  'menu.tabbar.perfil.selecionado': 'Perfil, aba selecionada',
  'menu.tabbar.clientesVeiculos.rotulo': 'Clientes e Veículos',
  'menu.tabbar.clientesVeiculos.indisponivel': 'Clientes e Veículos, indisponível nesta versão',
  'menu.tabbar.catalogo.rotulo': 'Catálogo',
  'menu.tabbar.catalogo.indisponivel': 'Catálogo, indisponível nesta versão',
  'menu.tabbar.ordensServico.rotulo': 'Ordens de Serviço',
  'menu.tabbar.ordensServico.indisponivel': 'Ordens de Serviço, indisponível nesta versão',
  'menu.tabbar.financeiro.rotulo': 'Financeiro',
  'menu.tabbar.financeiro.indisponivel': 'Financeiro, indisponível nesta versão',
} as const;

export type ChaveTexto = keyof typeof strings;

export function t(chave: ChaveTexto): string {
  return strings[chave];
}
