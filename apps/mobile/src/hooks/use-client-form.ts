import { useCallback, useEffect, useRef, useState } from 'react';

import { formatarCpf } from '@/formatters/cpf-format';
import { apenasDigitos } from '@/formatters/digits';
import { formatarTelefone } from '@/formatters/phone-format';
import {
  ErroDeValidacaoError,
  RecursoNaoEncontradoError,
  RequisicaoCanceladaError,
} from '@/services/api-errors';
import {
  atualizarCliente,
  type ClienteEntrada,
  criarCliente,
  obterCliente,
} from '@/services/clients-service';
import type { ClienteDetalhe } from '@/services/clients-types';
import { isCpfValido } from '@/validators/cpf';

import { useAuthenticatedRequest } from './use-authenticated-request';
import { useResource } from './use-resource';

export const CAMPOS_DO_CLIENTE = ['nome', 'telefone', 'email', 'cpf', 'endereco'] as const;

export type CampoDoCliente = (typeof CAMPOS_DO_CLIENTE)[number];

export type ValoresDoCliente = Readonly<Record<CampoDoCliente, string>>;

/** Chave i18n por campo, como texto; a tela traduz (o hook não conhece i18n, ADR-030 D3). */
export type ErrosDeCampo = Readonly<Partial<Record<CampoDoCliente, string>>>;

export type EstadoEnvio =
  'idle' | 'enviando' | 'erroConexao' | 'erroValidacao' | 'naoEncontrado' | 'salvo';

/** Leitura do cliente em edição; no cadastro novo o formulário já está `pronto`. */
export type CargaDoFormulario = 'carregando' | 'erroConexao' | 'naoEncontrado' | 'pronto';

const VALORES_VAZIOS: ValoresDoCliente = {
  nome: '',
  telefone: '',
  email: '',
  cpf: '',
  endereco: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONE_MIN_DIGITOS = 10;

function chaveDoErro(campo: CampoDoCliente): string {
  return `cliente.form.${campo}.invalido`;
}

/** Validação local, só do que o desenho pede (ADR-030): vazio opcional não é erro. */
export function validarCliente(valores: ValoresDoCliente): ErrosDeCampo {
  const erros: Partial<Record<CampoDoCliente, string>> = {};
  if (valores.nome.trim() === '') {
    erros.nome = chaveDoErro('nome');
  }
  const telefone = apenasDigitos(valores.telefone);
  if (telefone !== '' && telefone.length < TELEFONE_MIN_DIGITOS) {
    erros.telefone = chaveDoErro('telefone');
  }
  const email = valores.email.trim();
  if (email !== '' && !EMAIL_PATTERN.test(email)) {
    erros.email = chaveDoErro('email');
  }
  if (valores.cpf.trim() !== '' && !isCpfValido(valores.cpf)) {
    erros.cpf = chaveDoErro('cpf');
  }
  return erros;
}

function isCampoDoCliente(campo: string): campo is CampoDoCliente {
  return CAMPOS_DO_CLIENTE.some((conhecido) => conhecido === campo);
}

interface ErrosDaApi {
  readonly campos: ErrosDeCampo;
  /** Erro que não é de um campo conhecido (409 sem campo, campo fora da lista). */
  readonly geral: boolean;
}

function lerErrosDaApi(erro: ErroDeValidacaoError): ErrosDaApi {
  const campos: Partial<Record<CampoDoCliente, string>> = {};
  let geral = erro.campos.length === 0;
  erro.campos.forEach((item) => {
    if (isCampoDoCliente(item.campo)) {
      campos[item.campo] = item.chave ?? chaveDoErro(item.campo);
    } else {
      geral = true;
    }
  });
  return { campos, geral };
}

function doDetalhe(cliente: ClienteDetalhe): ValoresDoCliente {
  return {
    nome: cliente.nome,
    telefone: formatarTelefone(cliente.telefone ?? ''),
    email: cliente.email ?? '',
    cpf: formatarCpf(cliente.cpf ?? ''),
    endereco: cliente.endereco ?? '',
  };
}

function aplicarMascara(campo: CampoDoCliente, valor: string): string {
  if (campo === 'telefone') {
    return formatarTelefone(valor);
  }
  return campo === 'cpf' ? formatarCpf(valor) : valor;
}

export interface ClientForm {
  readonly valores: ValoresDoCliente;
  readonly alterar: (campo: CampoDoCliente, valor: string) => void;
  readonly carga: CargaDoFormulario;
  readonly estadoEnvio: EstadoEnvio;
  readonly errosDeCampo: ErrosDeCampo;
  /** 409 ou campo sem lugar no formulário: a tela mostra a faixa de conflito. */
  readonly conflitoGeral: boolean;
  /** Sobe a cada envio recusado; a tela usa para devolver o foco ao primeiro campo inválido. */
  readonly recusas: number;
  readonly temAlteracao: boolean;
  /** `id` do cliente salvo, para a navegação (ADR-029, D2). */
  readonly clienteSalvoId: number | null;
  readonly enviar: () => Promise<void>;
  readonly recarregar: () => void;
}

export type AlvoDoFormulario =
  | { readonly modo: 'novo' }
  /** `clienteId` nulo é parâmetro de rota inválido: "não encontrado", sem chamada à API. */
  | { readonly modo: 'editar'; readonly clienteId: number | null };

/**
 * Formulário de cliente. No modo `editar` o hook lê o cliente antes de liberar
 * a edição (sem recarga ao voltar ao foco, para não pisar no que foi digitado).
 * Os valores digitados nunca mudam em erro; CPF e telefone ficam só neste
 * estado, fora de log e de armazenamento.
 */
export function useClientForm(alvo: AlvoDoFormulario): ClientForm {
  const modoEdicao = alvo.modo === 'editar';
  const clienteId = alvo.modo === 'editar' ? alvo.clienteId : null;
  const { executar } = useAuthenticatedRequest();
  const leitura = useResource<ClienteDetalhe>(clienteId, obterCliente);

  const [valores, setValores] = useState<ValoresDoCliente>(VALORES_VAZIOS);
  const [iniciais, setIniciais] = useState<ValoresDoCliente>(VALORES_VAZIOS);
  const [carregou, setCarregou] = useState(!modoEdicao);
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio>('idle');
  const [errosDeCampo, setErrosDeCampo] = useState<ErrosDeCampo>({});
  const [conflitoGeral, setConflitoGeral] = useState(false);
  const [recusas, setRecusas] = useState(0);
  const [clienteSalvoId, setClienteSalvoId] = useState<number | null>(null);
  const enviandoRef = useRef(false);

  const estadoLeitura = leitura.estado;
  useEffect(() => {
    if (modoEdicao && !carregou && estadoLeitura.tipo === 'sucesso') {
      const carregados = doDetalhe(estadoLeitura.dados);
      setValores(carregados);
      setIniciais(carregados);
      setCarregou(true);
    }
  }, [modoEdicao, carregou, estadoLeitura]);

  const alterar = useCallback((campo: CampoDoCliente, valor: string): void => {
    setValores((atuais) => ({ ...atuais, [campo]: aplicarMascara(campo, valor) }));
    setErrosDeCampo((atuais) => {
      if (atuais[campo] === undefined) {
        return atuais;
      }
      const resto: Partial<Record<CampoDoCliente, string>> = { ...atuais };
      delete resto[campo];
      return resto;
    });
  }, []);

  const recusar = useCallback((erros: ErrosDeCampo, geral: boolean): void => {
    setErrosDeCampo(erros);
    setConflitoGeral(geral);
    setRecusas((total) => total + 1);
    setEstadoEnvio('erroValidacao');
  }, []);

  const enviar = useCallback(async (): Promise<void> => {
    if (enviandoRef.current || estadoEnvio === 'salvo') {
      return;
    }
    const locais = validarCliente(valores);
    if (Object.keys(locais).length > 0) {
      recusar(locais, false);
      return;
    }

    enviandoRef.current = true;
    setErrosDeCampo({});
    setConflitoGeral(false);
    setEstadoEnvio('enviando');
    const entrada: ClienteEntrada = valores;
    const resultado = await executar(
      (token, signal) =>
        modoEdicao && clienteId !== null
          ? atualizarCliente(clienteId, entrada, token, signal)
          : criarCliente(entrada, token, signal),
      'envio',
    );
    enviandoRef.current = false;

    if (resultado.ok) {
      setClienteSalvoId(resultado.valor.id);
      setEstadoEnvio('salvo');
      return;
    }
    const { erro } = resultado;
    if (erro instanceof RequisicaoCanceladaError) {
      return;
    }
    if (erro instanceof RecursoNaoEncontradoError) {
      setEstadoEnvio('naoEncontrado');
      return;
    }
    if (erro instanceof ErroDeValidacaoError) {
      const daApi = lerErrosDaApi(erro);
      recusar(daApi.campos, daApi.geral);
      return;
    }
    setEstadoEnvio('erroConexao');
  }, [clienteId, estadoEnvio, executar, modoEdicao, recusar, valores]);

  const carga: CargaDoFormulario =
    !modoEdicao || carregou ? 'pronto' : cargaDaLeitura(estadoLeitura.tipo);

  const temAlteracao = CAMPOS_DO_CLIENTE.some((campo) => valores[campo] !== iniciais[campo]);

  return {
    valores,
    alterar,
    carga,
    estadoEnvio,
    errosDeCampo,
    conflitoGeral,
    recusas,
    temAlteracao,
    clienteSalvoId,
    enviar,
    recarregar: leitura.tentarNovamente,
  };
}

function cargaDaLeitura(
  tipo: 'carregando' | 'erroConexao' | 'naoEncontrado' | 'sucesso',
): CargaDoFormulario {
  return tipo === 'sucesso' ? 'carregando' : tipo;
}
