import type { ReactElement } from 'react';
import { View } from 'react-native';

import { SearchField } from '@/components/ui/search-field';
import { SEARCH_MAX_LENGTH } from '@/config/search';
import { t } from '@/i18n/strings';

import { styles } from './client-search-bar.styles';

export interface ClientSearchBarProps {
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly onSubmit: () => void;
  readonly onClear: () => void;
}

/** Busca da lista de clientes (F35, L1): campo com os textos da lista e o respiro do desenho. */
export function ClientSearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
}: ClientSearchBarProps): ReactElement {
  return (
    <View style={styles.search}>
      <SearchField
        value={value}
        onChangeText={onChangeText}
        onSubmit={onSubmit}
        onClear={onClear}
        placeholder={t('clientes.lista.busca.placeholder')}
        label={t('clientes.lista.busca.rotulo')}
        clearLabel={t('clientes.lista.busca.limpar')}
        maxLength={SEARCH_MAX_LENGTH}
      />
    </View>
  );
}
