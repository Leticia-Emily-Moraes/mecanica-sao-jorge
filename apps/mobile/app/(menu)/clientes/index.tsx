import { useRouter } from 'expo-router';
import type { ReactElement } from 'react';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { ClientRow } from '@/components/clientes/client-row';
import { Button } from '@/components/ui/button';
import { InlineAlert } from '@/components/ui/inline-alert';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SearchField } from '@/components/ui/search-field';
import { StateView } from '@/components/ui/state-view';
import { SEARCH_MAX_LENGTH } from '@/config/search';
import { useAnnounce } from '@/hooks/use-announce';
import { type EstadoLista, useClientList } from '@/hooks/use-client-list';
import { t } from '@/i18n/strings';
import {
  limparNomeSugerido,
  nomeSugeridoDoTermo,
  sugerirNomeParaNovoCliente,
} from '@/navigation/new-client-name';
import { color, spacing, typography } from '@/theme/tokens';

type EstadoComLista = Extract<EstadoLista, { tipo: 'sucesso' }>;

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
        <View style={styles.search}>
          <SearchField
            value={termo}
            onChangeText={lista.alterarTermo}
            onSubmit={lista.buscarAgora}
            onClear={lista.limpar}
            placeholder={t('clientes.lista.busca.placeholder')}
            label={t('clientes.lista.busca.rotulo')}
            clearLabel={t('clientes.lista.busca.limpar')}
            maxLength={SEARCH_MAX_LENGTH}
          />
        </View>

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
          <ListaDeClientes
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

interface ListaDeClientesProps {
  readonly estado: EstadoComLista;
  readonly onAbrir: (id: number) => void;
  readonly onNovo: () => void;
  readonly onAtualizar: () => void;
  readonly onCarregarMais: () => void;
}

function ListaDeClientes({
  estado,
  onAbrir,
  onNovo,
  onAtualizar,
  onCarregarMais,
}: ListaDeClientesProps): ReactElement {
  return (
    <>
      {estado.falhaAoAtualizar ? (
        <InlineAlert message={t('clientes.lista.falhaAtualizar')} />
      ) : null}
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={estado.itens}
        keyExtractor={(cliente) => String(cliente.id)}
        renderItem={({ item }) => <ClientRow cliente={item} onPress={onAbrir} />}
        ItemSeparatorComponent={Separador}
        keyboardShouldPersistTaps="handled"
        refreshing={estado.atualizando}
        onRefresh={onAtualizar}
        ListFooterComponent={<RodapeDaLista estado={estado} onCarregarMais={onCarregarMais} />}
      />
      <View style={styles.newAction}>
        <Button label={t('clientes.lista.novo')} icon="add" onPress={onNovo} />
      </View>
    </>
  );
}

function Separador(): ReactElement {
  return <View style={styles.separator} />;
}

function RodapeDaLista({
  estado,
  onCarregarMais,
}: {
  readonly estado: EstadoComLista;
  readonly onCarregarMais: () => void;
}): ReactElement | null {
  if (estado.carregandoMais) {
    return (
      <View
        accessible
        accessibilityLabel={t('clientes.lista.carregandoMais')}
        accessibilityLiveRegion="polite"
        style={styles.footer}
      >
        <ActivityIndicator color={color.text.primary} />
        <Text style={styles.footerText}>{t('clientes.lista.carregandoMais')}</Text>
      </View>
    );
  }
  if (!estado.temMais) {
    return null;
  }
  return (
    <View style={styles.footer}>
      {estado.falhaAoCarregarMais ? (
        <InlineAlert message={t('clientes.lista.erroCarregarMais')} />
      ) : null}
      <Button
        label={t('clientes.lista.carregarMais')}
        onPress={onCarregarMais}
        variant="outlineAccent"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    paddingTop: spacing.md,
    paddingBottom: spacing.s12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  separator: {
    height: spacing.s12,
  },
  footer: {
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  footerText: {
    fontFamily: typography.label.fontFamily,
    fontSize: typography.label.fontSize,
    color: color.text.secondary,
    textAlign: 'center',
  },
  newAction: {
    paddingVertical: spacing.md,
  },
});
