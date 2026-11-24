import type { ReactElement } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { NotFoundState } from '@/components/ui/not-found-state';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StateView } from '@/components/ui/state-view';
import { VehicleFormFields } from '@/components/veiculos/vehicle-form-fields';
import type { DiscardChangesGuard } from '@/hooks/use-discard-changes-guard';
import type { VehicleForm } from '@/hooks/use-vehicle-form';
import { t } from '@/i18n/strings';

import { styles } from './vehicle-form-view.styles';

export interface VehicleFormViewProps {
  readonly modo: 'novo' | 'editar';
  readonly form: VehicleForm;
  readonly guarda: DiscardChangesGuard;
  readonly onBack: () => void;
}

/**
 * Tela de formulário de veículo: cabeçalho com voltar, leitura inicial (dono ou
 * veículo) com carregando, erro e não encontrado, campos que sobem com o teclado
 * e o diálogo de descarte (X3/X4). Cadastro e edição só diferem no título e nas
 * ações, que vêm de `modo`.
 */
export function VehicleFormView({
  modo,
  form,
  guarda,
  onBack,
}: VehicleFormViewProps): ReactElement {
  const naoEncontrado = form.carga === 'naoEncontrado' || form.estadoEnvio === 'naoEncontrado';
  const pronto = form.carga === 'pronto' && !naoEncontrado && form.clienteNome !== null;

  return (
    <>
      <ScreenHeader
        title={
          modo === 'novo'
            ? t('veiculos.formulario.tituloNovo')
            : t('veiculos.formulario.tituloEditar')
        }
        back={{ label: t('veiculos.formulario.voltar.rotulo'), onPress: onBack }}
      />
      <ScreenContainer constrained>
        {form.carga === 'carregando' && !naoEncontrado ? (
          <StateView state="loading" loadingLabel={t('veiculos.formulario.carregando')} />
        ) : null}
        {form.carga === 'erroConexao' && !naoEncontrado ? (
          <StateView
            state="error"
            title={t('veiculos.detalhe.erro.titulo')}
            message={t('veiculos.detalhe.erro.mensagem')}
            retryLabel={t('veiculos.detalhe.erro.tentar')}
            onRetry={form.recarregar}
            secondaryLabel={t('veiculos.detalhe.erro.voltar')}
            onSecondaryPress={onBack}
          />
        ) : null}
        {naoEncontrado ? (
          <NotFoundState
            title={t('veiculos.formulario.naoEncontrado.titulo')}
            message={t('veiculos.formulario.naoEncontrado.mensagem')}
            actionLabel={t('veiculos.formulario.naoEncontrado.voltar')}
            onAction={onBack}
          />
        ) : null}
        {pronto && form.clienteNome !== null ? (
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <VehicleFormFields
                modo={modo}
                clienteNome={form.clienteNome}
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
        ) : null}
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
