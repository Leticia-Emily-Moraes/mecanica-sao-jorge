import type { ReactElement } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { InfoCard, type InfoRow } from '@/components/ui/info-card';
import { mascararCpf } from '@/formatters/cpf-mask';
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

function linha(rotulo: string, valor: string | null, frase?: string): InfoRow {
  if (valor === null) {
    return { label: rotulo, value: t('clientes.detalhe.naoInformado'), muted: true };
  }
  return frase === undefined
    ? { label: rotulo, value: valor }
    : { label: rotulo, value: valor, accessibilityLabel: frase };
}

/**
 * Dados do cliente, somente leitura (D1/D7). Campo ausente mostra "Não informado".
 * O CPF só aparece mascarado e o leitor de tela lê "CPF parcialmente oculto" (como
 * no Figma), sem asteriscos nem dígitos; CPF vazio, nulo ou incompleto vira
 * "Não informado" (critérios 28 e 29).
 */
export function ClientInfoCard({ cliente }: ClientInfoCardProps): ReactElement {
  const telefone = textoOuNulo(cliente.telefone);
  const cpfMascarado = mascararCpf(cliente.cpf);

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
          t('clientes.detalhe.cpf.rotuloAcessivel'),
        ),
        linha(t('clientes.detalhe.endereco'), textoOuNulo(cliente.endereco)),
      ]}
    />
  );
}
