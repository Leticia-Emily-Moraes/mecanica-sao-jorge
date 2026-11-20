import { type ReactElement, useEffect, useRef } from 'react';
import { StyleSheet, Text, type TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { InlineAlert } from '@/components/ui/inline-alert';
import { TextField, type TextFieldProps } from '@/components/ui/text-field';
import type { EstadoEnvio } from '@/hooks/use-client-form';
import type {
  CampoDoVeiculo,
  ErrosDeCampoDoVeiculo,
  ValoresDoVeiculo,
} from '@/hooks/use-vehicle-form';
import { isChaveTexto, t } from '@/i18n/strings';
import { color, fontFamily, spacing, typography } from '@/theme/tokens';

export interface VehicleFormFieldsProps {
  readonly modo: 'novo' | 'editar';
  readonly clienteNome: string;
  readonly valores: ValoresDoVeiculo;
  readonly errosDeCampo: ErrosDeCampoDoVeiculo;
  readonly estadoEnvio: EstadoEnvio;
  readonly conflitoGeral: boolean;
  /** Sobe a cada envio recusado; devolve o foco ao primeiro campo inválido. */
  readonly recusas: number;
  readonly onChange: (campo: CampoDoVeiculo, valor: string) => void;
  readonly onSubmit: () => void;
  readonly onCancel: () => void;
}

const ORDEM_DOS_CAMPOS: readonly CampoDoVeiculo[] = ['placa', 'marca', 'modelo', 'ano', 'cor'];

function textoDoErro(chave: string): string {
  return isChaveTexto(chave) ? t(chave) : t('formulario.campo.invalido');
}

function textoDaFaixa(
  estadoEnvio: EstadoEnvio,
  quantidade: number,
  conflitoGeral: boolean,
): string | null {
  if (estadoEnvio === 'erroConexao') {
    return t('veiculos.formulario.erro.envio');
  }
  if (estadoEnvio !== 'erroValidacao') {
    return null;
  }
  if (conflitoGeral) {
    return t('veiculos.formulario.erro.conflito');
  }
  if (quantidade === 0) {
    return null;
  }
  return quantidade === 1
    ? t('veiculos.formulario.erro.faixaSingular')
    : t('veiculos.formulario.erro.faixaPlural', { quantidade });
}

/**
 * Campos e ações do formulário de veículo (F35, N1–N5 e M1–M3). A validação e o
 * envio são do hook; aqui só se mostra o estado. Marca e Modelo, Ano e Cor ficam
 * lado a lado, como no desenho.
 */
export function VehicleFormFields({
  modo,
  clienteNome,
  valores,
  errosDeCampo,
  estadoEnvio,
  conflitoGeral,
  recusas,
  onChange,
  onSubmit,
  onCancel,
}: VehicleFormFieldsProps): ReactElement {
  const refs = useRef<Partial<Record<CampoDoVeiculo, TextInput | null>>>({});
  const enviando = estadoEnvio === 'enviando';
  const quantidade = Object.keys(errosDeCampo).length;
  const faixa = textoDaFaixa(estadoEnvio, quantidade, conflitoGeral);

  useEffect(() => {
    if (recusas === 0) {
      return;
    }
    const primeiro = ORDEM_DOS_CAMPOS.find((campo) => errosDeCampo[campo] !== undefined);
    if (primeiro !== undefined) {
      refs.current[primeiro]?.focus();
    }
    // Só uma recusa nova move o foco; editar o campo não o devolve ao primeiro erro.
  }, [recusas]);

  function campo(nome: CampoDoVeiculo, extras: Partial<TextFieldProps>): ReactElement {
    const erro = errosDeCampo[nome];
    return (
      <TextField
        ref={(input) => {
          refs.current[nome] = input;
        }}
        label={t(`veiculos.formulario.${nome}.rotulo`)}
        placeholder={t(`veiculos.formulario.${nome}.placeholder`)}
        value={valores[nome]}
        onChangeText={(valor) => onChange(nome, valor)}
        errorMessage={erro === undefined ? undefined : textoDoErro(erro)}
        editable={!enviando}
        {...extras}
      />
    );
  }

  return (
    <View>
      {faixa === null ? null : <InlineAlert message={faixa} />}
      <Text
        style={styles.owner}
        accessibilityLabel={t('veiculos.formulario.cliente.acessivel', { nome: clienteNome })}
      >
        <Text style={styles.ownerLabel}>{t('veiculos.formulario.cliente.rotulo')} </Text>
        <Text style={styles.ownerName}>{clienteNome}</Text>
      </Text>
      {campo('placa', {
        autoCapitalize: 'characters',
        autoComplete: 'off',
        autoCorrect: false,
        maxLength: 7,
      })}
      <View style={styles.pair}>
        <View style={styles.half}>
          {campo('marca', { autoCapitalize: 'words', autoComplete: 'off' })}
        </View>
        <View style={styles.half}>
          {campo('modelo', { autoCapitalize: 'words', autoComplete: 'off' })}
        </View>
      </View>
      <View style={styles.pair}>
        <View style={styles.half}>
          {campo('ano', { keyboardType: 'number-pad', autoComplete: 'off', maxLength: 4 })}
        </View>
        <View style={styles.half}>
          {campo('cor', { autoCapitalize: 'words', autoComplete: 'off' })}
        </View>
      </View>

      <View style={modo === 'editar' ? styles.actionsRow : undefined}>
        {modo === 'editar' ? (
          <View style={styles.action}>
            <Button
              label={t('veiculos.formulario.cancelar')}
              onPress={onCancel}
              variant="secondary"
              disabled={enviando}
            />
          </View>
        ) : null}
        <View style={modo === 'editar' ? styles.action : undefined}>
          <Button
            label={
              modo === 'novo'
                ? t('veiculos.formulario.salvarNovo')
                : t('veiculos.formulario.salvarEdicao')
            }
            onPress={onSubmit}
            loading={enviando}
            loadingLabel={t('veiculos.formulario.salvando')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  owner: {
    marginBottom: spacing.s12,
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
  },
  ownerLabel: {
    color: color.text.secondary,
  },
  ownerName: {
    color: color.text.primary,
    fontFamily: fontFamily.bodySemiBold,
  },
  pair: {
    flexDirection: 'row',
    gap: spacing.s10,
  },
  half: {
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.s10,
  },
  action: {
    flex: 1,
  },
});
