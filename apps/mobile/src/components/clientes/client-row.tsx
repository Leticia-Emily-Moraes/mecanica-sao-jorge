import type { ReactElement } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { ListRow } from '@/components/ui/list-row';
import { contatoDoCliente } from '@/formatters/client-contact';
import { getInitials } from '@/formatters/get-initials';
import { t } from '@/i18n/strings';
import type { ClienteResumo } from '@/services/clients-types';

export interface ClientRowProps {
  readonly cliente: ClienteResumo;
  readonly onPress: (id: number) => void;
}

/** Linha da lista de clientes: iniciais, nome e o contato (telefone, e-mail ou aviso de ausência). */
export function ClientRow({ cliente, onPress }: ClientRowProps): ReactElement {
  const contato = contatoDoCliente(cliente) ?? t('clientes.lista.semContato');

  return (
    <ListRow
      leading={<Avatar variant="small" initials={getInitials(cliente.nome)} />}
      title={cliente.nome}
      subtitle={contato}
      onPress={() => onPress(cliente.id)}
      accessibilityHint={t('clientes.lista.item.dica')}
    />
  );
}
