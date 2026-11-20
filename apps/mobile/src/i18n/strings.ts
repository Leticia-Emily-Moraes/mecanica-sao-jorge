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
  'clientes.lista.semResultado.cadastrar': 'Cadastrar "{termo}"',
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
  'clientes.lista.falhaAtualizar':
    'Não foi possível atualizar. Você está vendo a última lista carregada.',
  'clientes.lista.semContato': 'Sem contato cadastrado',
  'clientes.lista.item.dica': 'Abre os dados do cliente',

  'clientes.detalhe.titulo': 'Cliente',
  'clientes.detalhe.editar.rotulo': 'Editar cliente',
  'clientes.detalhe.editar.rotuloComNome': 'Editar cliente {nome}',
  'clientes.detalhe.voltar.rotulo': 'Voltar para clientes',
  'clientes.detalhe.telefone': 'Telefone',
  'clientes.detalhe.email': 'E-mail',
  'clientes.detalhe.cpf': 'CPF',
  'clientes.detalhe.endereco': 'Endereço',
  'clientes.detalhe.naoInformado': 'Não informado',
  /** Lido depois do rótulo "CPF:", sem soletrar os asteriscos da máscara. */
  'clientes.detalhe.cpf.rotuloAcessivel': 'CPF parcialmente oculto',
  'clientes.detalhe.veiculos.titulo': 'Veículos ({quantidade})',
  'clientes.detalhe.veiculos.vazio.titulo': 'Nenhum veículo cadastrado',
  'clientes.detalhe.veiculos.vazio.mensagem': 'Cadastre o primeiro veículo deste cliente.',
  'clientes.detalhe.veiculos.novo': '+ Veículo',
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

  'clientes.formulario.tituloNovo': 'Novo cliente',
  'clientes.formulario.tituloEditar': 'Editar cliente',
  'clientes.formulario.voltar.rotulo': 'Voltar',
  'clientes.formulario.carregando': 'Carregando cliente…',
  'clientes.formulario.nome.rotulo': 'Nome completo *',
  'clientes.formulario.nome.placeholder': 'Ex.: João da Silva',
  'clientes.formulario.telefone.rotulo': 'Telefone (opcional)',
  'clientes.formulario.telefone.placeholder': '(11) 90000-0000',
  'clientes.formulario.email.rotulo': 'E-mail (opcional)',
  'clientes.formulario.email.placeholder': 'nome@example.com',
  'clientes.formulario.cpf.rotulo': 'CPF (opcional)',
  'clientes.formulario.cpf.placeholder': '000.000.000-00',
  'clientes.formulario.cpf.ajuda': 'Só preencha se o cliente pedir nota fiscal.',
  'clientes.formulario.endereco.rotulo': 'Endereço (opcional)',
  'clientes.formulario.endereco.placeholder': 'Rua, número, bairro, cidade',
  'clientes.formulario.privacidade':
    'Usamos seu nome, telefone e e-mail só para atender seu veículo e avisar sobre orçamento e serviço. CPF e endereço só se você pedir nota fiscal. Para corrigir ou apagar seus dados, fale com a oficina.',
  'clientes.formulario.salvarNovo': 'Salvar cliente',
  'clientes.formulario.salvarEdicao': 'Salvar alterações',
  'clientes.formulario.cancelar': 'Cancelar',
  'clientes.formulario.salvando': 'Salvando…',
  'clientes.formulario.erro.faixaPlural': 'Corrija os {quantidade} campos destacados para salvar.',
  'clientes.formulario.erro.faixaSingular': 'Corrija o campo destacado para salvar.',
  'clientes.formulario.erro.envio':
    'Não foi possível salvar. Verifique a internet da oficina e tente de novo.',
  'clientes.formulario.erro.conflito':
    'Não foi possível salvar: os dados conflitam com outro cadastro. Confira e tente de novo.',

  /** Erros de campo de cliente: chave local ou devolvida pela API (ADR-030, D3). */
  'cliente.form.nome.invalido': 'Informe o nome do cliente.',
  'cliente.form.telefone.invalido': 'Telefone incompleto. Use (11) 90000-0000.',
  'cliente.form.email.invalido': 'Informe um e-mail válido.',
  'cliente.form.cpf.invalido': 'CPF inválido. Confira os 11 números.',
  'cliente.form.endereco.invalido': 'Endereço inválido. Confira o que foi digitado.',
  'cliente.form.cpf.duplicado': 'Já existe um cliente com este CPF.',
  'cliente.form.email.duplicado': 'Já existe um cliente com este e-mail.',
  'formulario.campo.invalido': 'Confira este campo.',

  /** Diálogo de descarte dos formulários de cliente e de veículo (ADR-029, D3). */
  'comum.descartar.titulo': 'Descartar alterações?',
  'comum.descartar.mensagem': 'O que você digitou neste formulário será perdido.',
  'comum.descartar.continuar': 'Continuar editando',
  'comum.descartar.confirmar': 'Descartar',

  'veiculos.item.dica': 'Abre os dados do veículo',
  /** A lista do cliente traz só placa, marca e modelo; ano e cor ficam para o detalhe. */
  'veiculos.item.marcaModelo': '{marca} {modelo}',
  'veiculos.item.rotulo': '{placa}, {marca} {modelo}',

  'veiculos.formulario.tituloNovo': 'Novo veículo',
  'veiculos.formulario.tituloEditar': 'Editar veículo',
  'veiculos.formulario.voltar.rotulo': 'Voltar',
  'veiculos.formulario.carregando': 'Carregando veículo…',
  'veiculos.formulario.cliente.rotulo': 'Cliente:',
  'veiculos.formulario.cliente.acessivel': 'Cliente: {nome}',
  'veiculos.formulario.placa.rotulo': 'Placa *',
  'veiculos.formulario.placa.placeholder': 'AAA0A00',
  'veiculos.formulario.marca.rotulo': 'Marca *',
  'veiculos.formulario.marca.placeholder': 'Ex.: Fiat',
  'veiculos.formulario.modelo.rotulo': 'Modelo *',
  'veiculos.formulario.modelo.placeholder': 'Ex.: Uno',
  'veiculos.formulario.ano.rotulo': 'Ano (opcional)',
  'veiculos.formulario.ano.placeholder': '2020',
  'veiculos.formulario.cor.rotulo': 'Cor (opcional)',
  'veiculos.formulario.cor.placeholder': 'Ex.: Prata',
  'veiculos.formulario.salvarNovo': 'Salvar veículo',
  'veiculos.formulario.salvarEdicao': 'Salvar alterações',
  'veiculos.formulario.cancelar': 'Cancelar',
  'veiculos.formulario.salvando': 'Salvando…',
  'veiculos.formulario.erro.faixaPlural': 'Corrija os {quantidade} campos destacados para salvar.',
  'veiculos.formulario.erro.faixaSingular': 'Corrija o campo destacado para salvar.',
  'veiculos.formulario.erro.envio':
    'Não foi possível salvar. Verifique a internet da oficina e tente de novo.',
  'veiculos.formulario.erro.conflito':
    'Não foi possível salvar: os dados conflitam com outro cadastro. Confira e tente de novo.',
  'veiculos.formulario.naoEncontrado.titulo': 'Veículo não encontrado',
  'veiculos.formulario.naoEncontrado.mensagem':
    'Este veículo não existe mais ou foi removido. Volte para o cliente.',
  'veiculos.formulario.naoEncontrado.voltar': 'Voltar para o cliente',

  /**
   * Erros de campo de veículo. Só `placa.erro` e `placa.duplicada` estão no contrato
   * da API (ADR-030); as demais chaves locais seguem o mesmo padrão, por suposição.
   */
  'veiculo.form.placa.erro': 'Placa inválida. Use ABC1D23 ou ABC1234.',
  'veiculo.form.placa.duplicada': 'Esta placa já está cadastrada.',
  'veiculo.form.marca.invalido': 'Informe a marca.',
  'veiculo.form.modelo.invalido': 'Informe o modelo.',
  'veiculo.form.ano.invalido': 'Ano inválido.',
  'veiculo.form.cor.invalido': 'Cor inválida. Confira o que foi digitado.',

  'veiculos.detalhe.titulo': 'Veículo',
  'veiculos.detalhe.editar.rotulo': 'Editar veículo',
  'veiculos.detalhe.editar.rotuloComPlaca': 'Editar veículo {placa}',
  'veiculos.detalhe.voltar.rotulo': 'Voltar para o cliente',
  'veiculos.detalhe.placa': 'Placa',
  'veiculos.detalhe.ano': 'Ano',
  'veiculos.detalhe.cor': 'Cor',
  'veiculos.detalhe.naoInformado': 'Não informado',
  'veiculos.detalhe.historico.titulo': 'Histórico de OS ({quantidade})',
  'veiculos.detalhe.historico.vazio.titulo': 'Nenhuma OS neste veículo',
  'veiculos.detalhe.historico.vazio.mensagem':
    'As ordens de serviço deste veículo vão aparecer aqui.',
  'veiculos.detalhe.historico.item.titulo': 'OS #{id}',
  'veiculos.detalhe.historico.item.rotulo': 'OS #{id}, {status}, {valor}',
  'veiculos.detalhe.carregando': 'Carregando veículo…',
  'veiculos.detalhe.erro.titulo': 'Não foi possível carregar',
  'veiculos.detalhe.erro.mensagem':
    'Não foi possível abrir este veículo. Verifique a internet da oficina e tente de novo.',
  'veiculos.detalhe.erro.tentar': 'Tentar novamente',
  'veiculos.detalhe.erro.voltar': 'Voltar',
  'veiculos.detalhe.naoEncontrado.titulo': 'Veículo não encontrado',
  'veiculos.detalhe.naoEncontrado.mensagem':
    'Este veículo não existe mais ou foi removido. Volte para o cliente.',
  'veiculos.detalhe.naoEncontrado.voltar': 'Voltar para o cliente',
  'veiculos.detalhe.falhaAtualizar':
    'Não foi possível atualizar. Você está vendo a última versão carregada.',
  'veiculos.detalhe.sucesso.editado': 'Alterações salvas.',
} as const;

export type ChaveTexto = keyof typeof strings;

export type ParametrosTexto = Readonly<Record<string, string | number>>;

/** Chave que veio de fora (resposta da API) só vira texto se for uma das conhecidas. */
export function isChaveTexto(chave: string): chave is ChaveTexto {
  return Object.prototype.hasOwnProperty.call(strings, chave);
}

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
