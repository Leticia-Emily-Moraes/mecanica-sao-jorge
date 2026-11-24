import { t } from '@/i18n/strings';

export interface AccessProfileTexts {
  /** Texto curto do selo sob o nome (caixa alta). */
  readonly badge: string;
  /** Texto da linha "Perfil de acesso" do cartão. */
  readonly description: string;
}

/**
 * Traduz o perfil devolvido pela API (`ADMIN`, `FUNCIONARIO`) para os textos
 * da tela, vindos do dicionário. Perfil desconhecido aparece como veio, para
 * a tela nunca mostrar vazio nem quebrar. O texto de FUNCIONARIO é proposta
 * (P-15 da planilha F41): o Figma só tem ADMIN.
 */
export function describeAccessProfile(profile: string): AccessProfileTexts {
  switch (profile) {
    case 'ADMIN':
      return { badge: t('perfil.perfilAdmin.selo'), description: t('perfil.perfilAdmin.texto') };
    case 'FUNCIONARIO':
      return {
        badge: t('perfil.perfilFuncionario.selo'),
        description: t('perfil.perfilFuncionario.texto'),
      };
    default:
      return { badge: profile, description: profile };
  }
}
