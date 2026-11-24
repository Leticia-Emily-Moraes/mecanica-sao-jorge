import type { ReactElement } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { ClientFormFields } from '@/components/clientes/client-form-fields';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import type { ClientForm } from '@/hooks/use-client-form';
import type { DiscardChangesGuard } from '@/hooks/use-discard-changes-guard';
import { t } from '@/i18n/strings';

import { styles } from './client-form-view.styles';

export interface ClientFormViewProps {
  readonly modo: 'novo' | 'editar';
  readonly form: ClientForm;
  readonly guarda: DiscardChangesGuard;
  readonly onBack: () => void;
}

/**
 * Tela de formulário de cliente: cabeçalho com voltar, campos que sobem com o
 * teclado e o diálogo de descarte (X1/X2). Cadastro e edição só diferem no
 * título e nas ações, que vêm de `modo`.
 */
export function ClientFormView({ modo, form, guarda, onBack }: ClientFormViewProps): ReactElement {
  return (
    <>
      <ScreenHeader
        title={
          modo === 'novo'
            ? t('clientes.formulario.tituloNovo')
            : t('clientes.formulario.tituloEditar')
        }
        back={{ label: t('clientes.formulario.voltar.rotulo'), onPress: onBack }}
      />
      <ScreenContainer constrained>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <ClientFormFields
              modo={modo}
              valores={form.valores}
              errosDeCampo={form.errosDeCampo}
              estadoEnvio={form.estadoEnvio}
              conflitoGeral={form.conflitoGeral}
              recusas={form.recusas}
              onChange={form.alterar}
              onSubmit={() => void form.enviar()}
              onCancel={onBack}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
      <ConfirmDialog
        visible={guarda.dialogoVisivel}
        stacked
        title={t('comum.descartar.titulo')}
        message={t('comum.descartar.mensagem')}
        cancelLabel={t('comum.descartar.continuar')}
        confirmLabel={t('comum.descartar.confirmar')}
        onCancel={guarda.continuarEditando}
        onConfirm={guarda.descartar}
      />
    </>
  );
}
