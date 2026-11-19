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
  /** Aba habilitada pela F35: o papel `tab` e `selected` já dizem o estado. */
  'menu.tabbar.clientes.acessivel': 'Clientes',
  'menu.tabbar.catalogo.rotulo': 'Catálogo',
  'menu.tabbar.catalogo.indisponivel': 'Catálogo, indisponível nesta versão',
  'menu.tabbar.financeiro.rotulo': 'Financeiro',
  'menu.tabbar.financeiro.indisponivel': 'Financeiro, indisponível nesta versão',

  /**
   * F35 · Clientes e Veículos. Textos do Figma F26/F35 (frames L1–L8, D1–D8);
   * os marcados "proposta" não existem no desenho aprovado.
   */
  'comum.aviso.dispensar': 'Fechar aviso',

  'clientes.lista.titulo': 'Clientes',
  'clientes.lista.busca.rotulo': 'Buscar clientes',
  'clientes.lista.busca.placeholder': 'Buscar por nome, telefone ou e-mail',
  'clientes.lista.busca.limpar': 'Limpar busca',
  'clientes.lista.carregando': 'Carregando clientes…',
  'clientes.lista.vazio.titulo': 'Nenhum cliente cadastrado',
  'clientes.lista.vazio.mensagem': 'Cadastre o primeiro cliente para abrir ordens de serviço.',
  'clientes.lista.novo': 'Novo cliente',
  'clientes.lista.semResultado.titulo': 'Nenhum resultado',
  'clientes.lista.semResultado.mensagem': 'Nenhum cliente encontrado para "{termo}".',
  'clientes.lista.semResultado.anuncio': 'Nenhum resultado para a busca.',
  'clientes.lista.resultados.um': '1 cliente encontrado',
  'clientes.lista.resultados.varios': '{quantidade} clientes encontrados',
  'clientes.lista.erro.titulo': 'Não foi possível carregar',
  'clientes.lista.erro.mensagem': 'Verifique a internet da oficina e tente de novo.',
  'clientes.lista.erro.tentar': 'Tentar novamente',
  'clientes.lista.erro.voltar': 'Voltar',
  /** Proposta (L8): o F26 não previa paginação. */
  'clientes.lista.carregarMais': 'Carregar mais',
  'clientes.lista.carregandoMais': 'Carregando mais clientes…',
  'clientes.lista.erroCarregarMais': 'Não foi possível carregar mais clientes. Tente de novo.',
  'clientes.lista.semContato': 'Sem contato cadastrado',
  'clientes.lista.item.dica': 'Abre os dados do cliente',

  'clientes.detalhe.titulo': 'Cliente',
  'clientes.detalhe.editar.rotulo': 'Editar cliente',
  'clientes.detalhe.telefone': 'Telefone',
  'clientes.detalhe.email': 'E-mail',
  'clientes.detalhe.cpf': 'CPF',
  'clientes.detalhe.endereco': 'Endereço',
  'clientes.detalhe.naoInformado': 'Não informado',
  'clientes.detalhe.cpf.rotuloAcessivel': 'CPF, parcialmente oculto, dígitos visíveis: {digitos}',
  'clientes.detalhe.veiculos.titulo': 'Veículos ({quantidade})',
  'clientes.detalhe.veiculos.vazio.titulo': 'Nenhum veículo cadastrado',
  'clientes.detalhe.veiculos.vazio.mensagem': 'Cadastre o primeiro veículo deste cliente.',
  'clientes.detalhe.veiculos.novo': '+ Veículo',
  'clientes.detalhe.veiculos.novo.rotulo': 'Cadastrar veículo',
  'clientes.detalhe.veiculos.carregando': 'Carregando veículos…',
  'clientes.detalhe.veiculos.erro': 'Não foi possível carregar os veículos.',
  'clientes.detalhe.veiculos.tentar': 'Tentar novamente',
  'clientes.detalhe.carregando': 'Carregando cliente…',
  'clientes.detalhe.erro.titulo': 'Não foi possível carregar',
  'clientes.detalhe.erro.mensagem':
    'Não foi possível abrir este cliente. Verifique a internet da oficina e tente de novo.',
  'clientes.detalhe.erro.tentar': 'Tentar novamente',
  'clientes.detalhe.erro.voltar': 'Voltar',
  'clientes.detalhe.naoEncontrado.titulo': 'Cliente não encontrado',
  'clientes.detalhe.naoEncontrado.mensagem':
    'Este cliente não existe mais ou foi removido. Volte para a lista de clientes.',
  'clientes.detalhe.naoEncontrado.voltar': 'Voltar para clientes',
  'clientes.detalhe.falhaAtualizar':
    'Não foi possível atualizar. Você está vendo a última versão carregada.',
  'clientes.detalhe.sucesso.criado': 'Cliente cadastrado.',
  'clientes.detalhe.sucesso.editado': 'Alterações salvas.',
  'clientes.detalhe.sucesso.veiculoCriado': 'Veículo cadastrado.',

  'veiculos.item.dica': 'Abre os dados do veículo',
} as const;

export type ChaveTexto = keyof typeof strings;

export type ParametrosTexto = Readonly<Record<string, string | number>>;

/**
 * Texto da interface por chave. Marcadores `{nome}` são trocados pelos
 * `parametros`; marcador sem valor fica como está, para o erro aparecer no teste.
 */
export function t(chave: ChaveTexto, parametros?: ParametrosTexto): string {
  const texto: string = strings[chave];
  if (!parametros) {
    return texto;
  }
  return texto.replace(/\{(\w+)\}/g, (marcador: string, nome: string) => {
    const valor = parametros[nome];
    return valor === undefined ? marcador : String(valor);
  });
}
