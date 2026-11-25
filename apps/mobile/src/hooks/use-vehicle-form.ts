import { useCallback, useEffect, useRef, useState } from 'react';

import { apenasDigitos } from '@/formatters/digits';
import {
  ErroDeValidacaoError,
  RecursoNaoEncontradoError,
  RequisicaoCanceladaError,
} from '@/services/api-errors';
import { obterCliente } from '@/services/clients-service';
import type { ClienteDetalhe } from '@/services/clients-types';
import {
  atualizarVeiculo,
  criarVeiculo,
  obterVeiculo,
  type VeiculoEntrada,
} from '@/services/vehicles-service';
import type { VeiculoDetalhe } from '@/services/vehicles-types';
import { isPlacaValida, normalizarPlaca } from '@/validators/placa';

import { useAuthenticatedRequest } from './use-authenticated-request';
import type { CargaDoFormulario, EstadoEnvio } from './use-client-form';
import { type EstadoCarga, useResource } from './use-resource';

export const CAMPOS_DO_VEICULO = ['placa', 'marca', 'modelo', 'ano', 'cor'] as const;

export type CampoDoVeiculo = (typeof CAMPOS_DO_VEICULO)[number];

export type ValoresDoVeiculo = Readonly<Record<CampoDoVeiculo, string>>;

/** Chave i18n por campo, como texto; a tela traduz (o hook não conhece i18n, ADR-030 D3). */
export type ErrosDeCampoDoVeiculo = Readonly<Partial<Record<CampoDoVeiculo, string>>>;

const VALORES_VAZIOS: ValoresDoVeiculo = { placa: '', marca: '', modelo: '', ano: '', cor: '' };

const ANO_MINIMO = 1900;
const TAMANHO_ANO = 4;
/** Modelo do próximo ano já circula no ano anterior. */
const ANOS_A_FRENTE = 1;

function chaveDoErro(campo: CampoDoVeiculo): string {
  return campo === 'placa' ? 'veiculo.form.placa.erro' : `veiculo.form.${campo}.invalido`;
}

function anoValido(texto: string, anoAtual: number): boolean {
  if (!/^[0-9]{4}$/.test(texto)) {
    return false;
  }
  const ano = Number(texto);
  return ano >= ANO_MINIMO && ano <= anoAtual + ANOS_A_FRENTE;
}

/** Validação local, só do que o desenho pede: placa, marca e modelo; ano só se preenchido. */
export function validarVeiculo(valores: ValoresDoVeiculo, anoAtual: number): ErrosDeCampoDoVeiculo {
  const erros: Partial<Record<CampoDoVeiculo, string>> = {};
  if (!isPlacaValida(valores.placa)) {
    erros.placa = chaveDoErro('placa');
  }
  if (valores.marca.trim() === '') {
    erros.marca = chaveDoErro('marca');
  }
  if (valores.modelo.trim() === '') {
    erros.modelo = chaveDoErro('modelo');
  }
  const ano = valores.ano.trim();
  if (ano !== '' && !anoValido(ano, anoAtual)) {
    erros.ano = chaveDoErro('ano');
  }
  return erros;
}

function isCampoDoVeiculo(campo: string): campo is CampoDoVeiculo {
  return CAMPOS_DO_VEICULO.some((conhecido) => conhecido === campo);
}

interface ErrosDaApi {
  readonly campos: ErrosDeCampoDoVeiculo;
  /** Erro que não é de um campo conhecido (409 sem campo, campo fora da lista). */
  readonly geral: boolean;
}

function lerErrosDaApi(erro: ErroDeValidacaoError): ErrosDaApi {
  const campos: Partial<Record<CampoDoVeiculo, string>> = {};
  let geral = erro.campos.length === 0;
  erro.campos.forEach((item) => {
    if (isCampoDoVeiculo(item.campo)) {
      campos[item.campo] = item.chave ?? chaveDoErro(item.campo);
    } else {
      geral = true;
    }
  });
  return { campos, geral };
}

function doDetalhe(veiculo: VeiculoDetalhe): ValoresDoVeiculo {
  return {
    placa: normalizarPlaca(veiculo.placa),
    marca: veiculo.marca,
    modelo: veiculo.modelo,
    ano: veiculo.ano === null ? '' : String(veiculo.ano),
    cor: veiculo.cor ?? '',
  };
}

function aplicarMascara(campo: CampoDoVeiculo, valor: string): string {
  if (campo === 'placa') {
    return normalizarPlaca(valor);
  }
  return campo === 'ano' ? apenasDigitos(valor).slice(0, TAMANHO_ANO) : valor;
}

/** Veículo salvo, para a navegação (ADR-029, D2). */
export interface VeiculoSalvoRef {
  readonly id: number;
  readonly clienteId: number;
}

export interface VehicleForm {
  readonly valores: ValoresDoVeiculo;
  readonly alterar: (campo: CampoDoVeiculo, valor: string) => void;
  readonly carga: CargaDoFormulario;
  readonly estadoEnvio: EstadoEnvio;
  readonly errosDeCampo: ErrosDeCampoDoVeiculo;
  /** 409 ou campo sem lugar no formulário: a tela mostra a faixa de conflito. */
  readonly conflitoGeral: boolean;
  /** Sobe a cada envio recusado; a tela usa para devolver o foco ao primeiro campo inválido. */
  readonly recusas: number;
  readonly temAlteracao: boolean;
  /** Nome do dono, para a linha "Cliente: …"; `null` até a leitura terminar. */
  readonly clienteNome: string | null;
  readonly salvo: VeiculoSalvoRef | null;
  readonly enviar: () => Promise<void>;
  readonly recarregar: () => void;
}

export type AlvoDoFormularioDeVeiculo =
  /** `clienteId` nulo é parâmetro de rota inválido: "não encontrado", sem chamada à API. */
  | { readonly modo: 'novo'; readonly clienteId: number | null }
  | { readonly modo: 'editar'; readonly veiculoId: number | null };

/**
 * Formulário de veículo. Nos dois modos o hook lê antes de liberar os campos:
 * no cadastro, o cliente dono (para mostrar o nome); na edição, o próprio
 * veículo. Os valores digitados nunca mudam em erro, e nada vai para log nem
 * armazenamento.
 */
export function useVehicleForm(alvo: AlvoDoFormularioDeVeiculo): VehicleForm {
  const modoEdicao = alvo.modo === 'editar';
  const clienteIdDaRota = alvo.modo === 'novo' ? alvo.clienteId : null;
  const veiculoIdDaRota = alvo.modo === 'editar' ? alvo.veiculoId : null;
  const { executar } = useAuthenticatedRequest();
  const leituraCliente = useResource<ClienteDetalhe>(clienteIdDaRota, obterCliente);
  const leituraVeiculo = useResource<VeiculoDetalhe>(veiculoIdDaRota, obterVeiculo);
  const leitura = modoEdicao ? leituraVeiculo : leituraCliente;

  const [valores, setValores] = useState<ValoresDoVeiculo>(VALORES_VAZIOS);
  const [iniciais, setIniciais] = useState<ValoresDoVeiculo>(VALORES_VAZIOS);
  const [carregou, setCarregou] = useState(false);
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio>('idle');
  const [errosDeCampo, setErrosDeCampo] = useState<ErrosDeCampoDoVeiculo>({});
  const [conflitoGeral, setConflitoGeral] = useState(false);
  const [recusas, setRecusas] = useState(0);
  const [salvo, setSalvo] = useState<VeiculoSalvoRef | null>(null);
  const enviandoRef = useRef(false);

  const estadoLeitura = leitura.estado;
  const estadoVeiculo = leituraVeiculo.estado;
  useEffect(() => {
    if (carregou || estadoLeitura.tipo !== 'sucesso') {
      return;
    }
    if (modoEdicao && estadoVeiculo.tipo === 'sucesso') {
      const carregados = doDetalhe(estadoVeiculo.dados);
      setValores(carregados);
      setIniciais(carregados);
    }
    setCarregou(true);
  }, [carregou, estadoLeitura, estadoVeiculo, modoEdicao]);

  const alterar = useCallback((campo: CampoDoVeiculo, valor: string): void => {
    setValores((atuais) => ({ ...atuais, [campo]: aplicarMascara(campo, valor) }));
    setErrosDeCampo((atuais) => {
      if (atuais[campo] === undefined) {
        return atuais;
      }
      const resto: Partial<Record<CampoDoVeiculo, string>> = { ...atuais };
      delete resto[campo];
      return resto;
    });
  }, []);

  const recusar = useCallback((erros: ErrosDeCampoDoVeiculo, geral: boolean): void => {
    setErrosDeCampo(erros);
    setConflitoGeral(geral);
    setRecusas((total) => total + 1);
    setEstadoEnvio('erroValidacao');
  }, []);

  const enviar = useCallback(async (): Promise<void> => {
    if (enviandoRef.current || estadoEnvio === 'salvo') {
      return;
    }
    const locais = validarVeiculo(valores, new Date().getFullYear());
    if (Object.keys(locais).length > 0) {
      recusar(locais, false);
      return;
    }

    enviandoRef.current = true;
    setErrosDeCampo({});
    setConflitoGeral(false);
    setEstadoEnvio('enviando');
    const entrada: VeiculoEntrada = valores;
    const resultado = await executar((token, signal) => {
      if (modoEdicao && veiculoIdDaRota !== null) {
        return atualizarVeiculo(veiculoIdDaRota, entrada, token, signal);
      }
      if (clienteIdDaRota !== null) {
        return criarVeiculo(clienteIdDaRota, entrada, token, signal);
      }
      return Promise.reject(new RecursoNaoEncontradoError());
    }, 'envio');
    enviandoRef.current = false;

    if (resultado.ok) {
      setSalvo({ id: resultado.valor.id, clienteId: resultado.valor.clienteId });
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
  }, [clienteIdDaRota, estadoEnvio, executar, modoEdicao, recusar, valores, veiculoIdDaRota]);

  const carga: CargaDoFormulario = carregou ? 'pronto' : cargaDaLeitura(estadoLeitura.tipo);

  const temAlteracao = CAMPOS_DO_VEICULO.some((campo) => valores[campo] !== iniciais[campo]);

  return {
    valores,
    alterar,
    carga,
    estadoEnvio,
    errosDeCampo,
    conflitoGeral,
    recusas,
    temAlteracao,
    clienteNome: nomeDoDono(modoEdicao, leituraCliente.estado, leituraVeiculo.estado),
    salvo,
    enviar,
    recarregar: leitura.tentarNovamente,
  };
}

function cargaDaLeitura(
  tipo: 'carregando' | 'erroConexao' | 'naoEncontrado' | 'sucesso',
): CargaDoFormulario {
  return tipo === 'sucesso' ? 'carregando' : tipo;
}

function nomeDoDono(
  modoEdicao: boolean,
  cliente: EstadoCarga<ClienteDetalhe>,
  veiculo: EstadoCarga<VeiculoDetalhe>,
): string | null {
  if (modoEdicao) {
    return veiculo.tipo === 'sucesso' ? veiculo.dados.clienteNome : null;
  }
  return cliente.tipo === 'sucesso' ? cliente.dados.nome : null;
}
