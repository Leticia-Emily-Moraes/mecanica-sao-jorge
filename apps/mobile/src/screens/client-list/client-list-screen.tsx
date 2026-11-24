import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useMemo } from 'react';

import { ClientList } from '@/components/clientes/client-list';
import { ClientSearchBar } from '@/components/clientes/client-search-bar';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateView } from '@/components/ui/state-view';
import { useAnnounce } from '@/hooks/use-announce';
import { type EstadoLista, useClientList } from '@/hooks/use-client-list';
import { t } from '@/i18n/strings';
import {
  limparNomeSugerido,
  nomeSugeridoDoTermo,
  sugerirNomeParaNovoCliente,
} from '@/navigation/new-client-name';

/** Texto falado quando a busca muda o resultado; sem busca aplicada, não fala nada. */
function anuncioDaBusca(estado: EstadoLista, termoAplicado: string): string | null {
  if (termoAplicado === '') {
    return null;
  }
  if (estado.tipo === 'semResultado') {
    return t('clientes.lista.semResultado.anuncio');
  }
  if (estado.tipo === 'sucesso') {
    return estado.total === 1
      ? t('clientes.lista.resultados.um')
      : t('clientes.lista.resultados.varios', { quantidade: estado.total });
  }
  return null;
}

/**
 * Lista de clientes (F35, L1–L8): busca, cartões com o contato, "Carregar mais"
 * e os quatro estados. Só chega aqui o que o hook entrega; nada de CPF, e o
 * toque abre o detalhe levando só o id na rota.
 */
export default function ClientesScreen(): ReactElement {
  const router = useRouter();
  const lista = useClientList();
  const { estado, termo, termoAplicado } = lista;

  useAnnounce(useMemo(() => anuncioDaBusca(estado, termoAplicado), [estado, termoAplicado]));

  function abrirPerfil(): void {
    router.push('/perfil');
  }

  function novoCliente(): void {
    limparNomeSugerido();
    router.push('/clientes/novo');
  }

  const nomeSugerido = nomeSugeridoDoTermo(termoAplicado);

  function cadastrarDaBusca(): void {
    sugerirNomeParaNovoCliente(termoAplicado);
    router.push('/clientes/novo');
  }

  function voltar(): void {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/inicio');
    }
  }

  function abrirCliente(id: number): void {
    router.push(`/clientes/${id}`);
  }

  return (
    <>
      <ScreenHeader
        title={t('clientes.lista.titulo')}
        user={{ label: t('cabecalho.usuario.rotulo'), onPress: abrirPerfil }}
      />
      <ScreenContainer constrained>
        <ClientSearchBar
          value={termo}
          onChangeText={lista.alterarTermo}
          onSubmit={lista.buscarAgora}
          onClear={lista.limpar}
        />

        {estado.tipo === 'carregando' ? (
          <StateView state="loading" loadingLabel={t('clientes.lista.carregando')} />
        ) : null}

        {estado.tipo === 'erroConexao' ? (
          <StateView
            state="error"
            title={t('clientes.lista.erro.titulo')}
            message={t('clientes.lista.erro.mensagem')}
            retryLabel={t('clientes.lista.erro.tentar')}
            onRetry={lista.tentarNovamente}
            secondaryLabel={t('clientes.lista.erro.voltar')}
            onSecondaryPress={voltar}
          />
        ) : null}

        {estado.tipo === 'vazio' ? (
          <StateView
            state="empty"
            icon="people-outline"
            title={t('clientes.lista.vazio.titulo')}
            message={t('clientes.lista.vazio.mensagem')}
            actionLabel={t('clientes.lista.novo')}
            onAction={novoCliente}
          />
        ) : null}

        {estado.tipo === 'semResultado' ? (
          <StateView
            state="empty"
            icon="search-outline"
            title={t('clientes.lista.semResultado.titulo')}
            message={t('clientes.lista.semResultado.mensagem', { termo: termoAplicado })}
            actionLabel={
              nomeSugerido === ''
                ? t('clientes.lista.novo')
                : t('clientes.lista.semResultado.cadastrar', { termo: nomeSugerido })
            }
            onAction={nomeSugerido === '' ? novoCliente : cadastrarDaBusca}
          />
        ) : null}

        {estado.tipo === 'sucesso' ? (
          <ClientList
            estado={estado}
            onAbrir={abrirCliente}
            onNovo={novoCliente}
            onAtualizar={lista.atualizar}
            onCarregarMais={lista.carregarMais}
          />
        ) : null}
      </ScreenContainer>
    </>
  );
}
