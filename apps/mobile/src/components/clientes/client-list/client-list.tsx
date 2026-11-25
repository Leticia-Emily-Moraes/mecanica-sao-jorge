import type { ReactElement } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { ClientRow } from '@/components/clientes/client-row';
import { Button } from '@/components/ui/button';
import { InlineAlert } from '@/components/ui/inline-alert';
import type { EstadoLista } from '@/hooks/use-client-list';
import { t } from '@/i18n/strings';

import { styles, visual } from './client-list.styles';

export type EstadoComLista = Extract<EstadoLista, { tipo: 'sucesso' }>;

export interface ClientListProps {
  readonly estado: EstadoComLista;
  readonly onAbrir: (id: number) => void;
  readonly onNovo: () => void;
  readonly onAtualizar: () => void;
  readonly onCarregarMais: () => void;
}

/** Lista de clientes com resultado (F35, L1/L8): cartões, puxar para atualizar, "Carregar mais" e "Novo cliente". */
export function ClientList({
  estado,
  onAbrir,
  onNovo,
  onAtualizar,
  onCarregarMais,
}: ClientListProps): ReactElement {
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
        <ActivityIndicator color={visual.spinner} />
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
