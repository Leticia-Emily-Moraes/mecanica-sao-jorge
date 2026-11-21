import { type ReactElement, useEffect, useRef } from 'react';
import { StyleSheet, Text, type TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { InlineAlert } from '@/components/ui/inline-alert';
import { TextField, type TextFieldProps } from '@/components/ui/text-field';
import type {
  CampoDoCliente,
  ErrosDeCampo,
  EstadoEnvio,
  ValoresDoCliente,
} from '@/hooks/use-client-form';
import { isChaveTexto, t } from '@/i18n/strings';
import { color, spacing, typography } from '@/theme/tokens';

export interface ClientFormFieldsProps {
  readonly modo: 'novo' | 'editar';
  readonly valores: ValoresDoCliente;
  readonly errosDeCampo: ErrosDeCampo;
  readonly estadoEnvio: EstadoEnvio;
  readonly conflitoGeral: boolean;
  /** Sobe a cada envio recusado; devolve o foco ao primeiro campo inválido. */
  readonly recusas: number;
  readonly onChange: (campo: CampoDoCliente, valor: string) => void;
  readonly onSubmit: () => void;
  readonly onCancel: () => void;
}

const ORDEM_DOS_CAMPOS: readonly CampoDoCliente[] = [
  'nome',
  'telefone',
  'email',
  'cpf',
  'endereco',
];

function textoDoErro(chave: string): string {
  return isChaveTexto(chave) ? t(chave) : t('formulario.campo.invalido');
}

function textoDaFaixa(
  estadoEnvio: EstadoEnvio,
  quantidade: number,
  conflitoGeral: boolean,
): string | null {
  if (estadoEnvio === 'erroConexao') {
    return t('clientes.formulario.erro.envio');
  }
  if (estadoEnvio !== 'erroValidacao') {
    return null;
  }
  if (conflitoGeral) {
    return t('clientes.formulario.erro.conflito');
  }
  if (quantidade === 0) {
    return null;
  }
  return quantidade === 1
    ? t('clientes.formulario.erro.faixaSingular')
    : t('clientes.formulario.erro.faixaPlural', { quantidade });
}

/**
 * Campos e ações do formulário de cliente (F35, C1–C7 e E1–E3). A validação e o
 * envio são do hook; aqui só se mostra o estado: erro sob o campo e na faixa,
 * campos travados enquanto salva e foco no primeiro campo inválido.
 */
export function ClientFormFields({
  modo,
  valores,
  errosDeCampo,
  estadoEnvio,
  conflitoGeral,
  recusas,
  onChange,
  onSubmit,
  onCancel,
}: ClientFormFieldsProps): ReactElement {
  const refs = useRef<Partial<Record<CampoDoCliente, TextInput | null>>>({});
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

  function campo(nome: CampoDoCliente, extras: Partial<TextFieldProps>): ReactElement {
    const erro = errosDeCampo[nome];
    return (
      <TextField
        ref={(input) => {
          refs.current[nome] = input;
        }}
        label={t(`clientes.formulario.${nome}.rotulo`)}
        placeholder={t(`clientes.formulario.${nome}.placeholder`)}
        value={valores[nome]}
        onChangeText={(valor) => onChange(nome, valor)}
        errorMessage={erro === undefined ? undefined : textoDoErro(erro)}
        editable={!enviando}
        // Dado de terceiro: o serviço de preenchimento não pode oferecer salvar na conta de quem digita.
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
        {...extras}
      />
    );
  }

  return (
    <View>
      {faixa === null ? null : <InlineAlert message={faixa} />}
      {campo('nome', {
        autoCapitalize: 'words',
        returnKeyType: 'next',
      })}
      {campo('telefone', { keyboardType: 'phone-pad' })}
      {campo('email', {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        autoCorrect: false,
      })}
      {campo('cpf', {
        keyboardType: 'number-pad',
        helperText: t('clientes.formulario.cpf.ajuda'),
      })}
      {campo('endereco', { multiline: true })}

      {modo === 'novo' ? (
        <Text style={styles.privacy}>{t('clientes.formulario.privacidade')}</Text>
      ) : null}

      <View style={modo === 'editar' ? styles.actionsRow : undefined}>
        {modo === 'editar' ? (
          <View style={styles.action}>
            <Button
              label={t('clientes.formulario.cancelar')}
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
                ? t('clientes.formulario.salvarNovo')
                : t('clientes.formulario.salvarEdicao')
            }
            onPress={onSubmit}
            loading={enviando}
            loadingLabel={t('clientes.formulario.salvando')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  privacy: {
    marginBottom: spacing.md,
    color: color.text.secondary,
    fontFamily: typography.subtitle.fontFamily,
    fontSize: typography.subtitle.fontSize,
    lineHeight: typography.dialogMessage.lineHeight,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.s10,
  },
  action: {
    flex: 1,
  },
});
