import type { ReactElement } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { InfoCard, type InfoRow } from '@/components/ui/info-card';
import { digitosVisiveisDoCpf, mascararCpf } from '@/formatters/cpf-mask';
import { getInitials } from '@/formatters/get-initials';
import { formatarTelefone } from '@/formatters/phone-format';
import { t } from '@/i18n/strings';
import type { ClienteDetalhe } from '@/services/clients-types';

export interface ClientInfoCardProps {
  readonly cliente: ClienteDetalhe;
}

function textoOuNulo(valor: string | null): string | null {
  const aparado = valor?.trim() ?? '';
  return aparado === '' ? null : aparado;
}

function linha(rotulo: string, valor: string | null, valorAcessivel?: string | null): InfoRow {
  if (valor === null) {
    return { label: rotulo, value: t('clientes.detalhe.naoInformado'), muted: true };
  }
  return valorAcessivel
    ? { label: rotulo, value: valor, accessibleValue: valorAcessivel }
    : { label: rotulo, value: valor };
}

/**
 * Dados do cliente, somente leitura (D1/D7). Campo ausente mostra "Não informado".
 * O CPF só aparece mascarado e é lido pelos dígitos visíveis, nunca pelo valor
 * cru (critérios 28 e 29); CPF vazio, nulo ou incompleto vira "Não informado".
 */
export function ClientInfoCard({ cliente }: ClientInfoCardProps): ReactElement {
  const telefone = textoOuNulo(cliente.telefone);
  const cpfMascarado = mascararCpf(cliente.cpf);
  const digitos = digitosVisiveisDoCpf(cliente.cpf);

  return (
    <InfoCard
      header={{
        leading: <Avatar variant="small" initials={getInitials(cliente.nome)} />,
        title: cliente.nome,
      }}
      rows={[
        linha(
          t('clientes.detalhe.telefone'),
          telefone === null ? null : formatarTelefone(telefone),
        ),
        linha(t('clientes.detalhe.email'), textoOuNulo(cliente.email)),
        linha(
          t('clientes.detalhe.cpf'),
          cpfMascarado,
          digitos === null ? null : t('clientes.detalhe.cpf.valorAcessivel', { digitos }),
        ),
        linha(t('clientes.detalhe.endereco'), textoOuNulo(cliente.endereco)),
      ]}
    />
  );
}
