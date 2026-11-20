import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';

import type { EstadoEnvio, ValoresDoCliente } from '@/hooks/use-client-form';

import { ClientFormFields, type ClientFormFieldsProps } from './client-form-fields';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const VAZIOS: ValoresDoCliente = { nome: '', telefone: '', email: '', cpf: '', endereco: '' };

function renderForm(props: Partial<ClientFormFieldsProps> = {}) {
  const handlers = { onChange: jest.fn(), onSubmit: jest.fn(), onCancel: jest.fn() };
  const completo: ClientFormFieldsProps = {
    modo: 'novo',
    valores: VAZIOS,
    errosDeCampo: {},
    estadoEnvio: 'idle',
    conflitoGeral: false,
    recusas: 0,
    ...handlers,
    ...props,
  };
  const resultado = render(<ClientFormFields {...completo} />);
  return { ...handlers, ...resultado, completo };
}

describe('ClientFormFields', () => {
  it('should show the five fields in order with their labels and the CPF help', () => {
    renderForm();

    expect(screen.getByLabelText('Nome completo *')).toBeTruthy();
    expect(screen.getByLabelText('Telefone (opcional)')).toBeTruthy();
    expect(screen.getByLabelText('E-mail (opcional)')).toBeTruthy();
    expect(
      screen.getByLabelText('CPF (opcional), Só preencha se o cliente pedir nota fiscal.'),
    ).toBeTruthy();
    expect(screen.getByLabelText('Endereço (opcional)')).toBeTruthy();
  });

  it('should use the right keyboard for each field', () => {
    renderForm();

    expect(screen.getByLabelText('Nome completo *').props.autoCapitalize).toBe('words');
    expect(screen.getByLabelText('Telefone (opcional)').props.keyboardType).toBe('phone-pad');
    const email = screen.getByLabelText('E-mail (opcional)');
    expect(email.props.keyboardType).toBe('email-address');
    expect(email.props.autoCapitalize).toBe('none');
    expect(screen.getByLabelText('Endereço (opcional)').props.multiline).toBe(true);
  });

  it('should report the typed text with the field name', () => {
    const { onChange } = renderForm();

    fireEvent.changeText(screen.getByLabelText('Nome completo *'), 'Fulano');

    expect(onChange).toHaveBeenCalledWith('nome', 'Fulano');
  });

  it('should show the privacy notice and a single save button when creating', () => {
    renderForm();

    expect(screen.getByText(/Usamos seu nome, telefone e e-mail/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Salvar cliente' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cancelar' })).toBeNull();
  });

  it('should drop the privacy notice and offer Cancel plus Save changes when editing', () => {
    const { onCancel } = renderForm({ modo: 'editar' });

    expect(screen.queryByText(/Usamos seu nome/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should submit when the save button is pressed', () => {
    const { onSubmit } = renderForm();

    fireEvent.press(screen.getByRole('button', { name: 'Salvar cliente' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should show the error under the field and a plural banner for two fields', () => {
    renderForm({
      estadoEnvio: 'erroValidacao',
      errosDeCampo: {
        nome: 'cliente.form.nome.invalido',
        telefone: 'cliente.form.telefone.invalido',
      },
    });

    expect(screen.getByText('Informe o nome do cliente.')).toBeTruthy();
    expect(screen.getByText('Telefone incompleto. Use (11) 90000-0000.')).toBeTruthy();
    expect(screen.getByText('Corrija os 2 campos destacados para salvar.')).toBeTruthy();
  });

  it('should use the singular banner for one field', () => {
    renderForm({
      estadoEnvio: 'erroValidacao',
      errosDeCampo: { cpf: 'cliente.form.cpf.duplicado' },
    });

    expect(screen.getByText('Já existe um cliente com este CPF.')).toBeTruthy();
    expect(screen.getByText('Corrija o campo destacado para salvar.')).toBeTruthy();
  });

  it('should fall back to a generic text for an error key it does not know', () => {
    renderForm({
      estadoEnvio: 'erroValidacao',
      errosDeCampo: { nome: 'chave.que.nao.existe' },
    });

    expect(screen.getByText('Confira este campo.')).toBeTruthy();
    expect(screen.queryByText('chave.que.nao.existe')).toBeNull();
  });

  it('should show the send failure banner without marking any field', () => {
    renderForm({ estadoEnvio: 'erroConexao', valores: { ...VAZIOS, nome: 'Fulano' } });

    expect(
      screen.getByText('Não foi possível salvar. Verifique a internet da oficina e tente de novo.'),
    ).toBeTruthy();
    expect(screen.queryByText('Informe o nome do cliente.')).toBeNull();
    expect(screen.getByLabelText('Nome completo *').props.value).toBe('Fulano');
  });

  it('should show the general conflict banner when the conflict has no field', () => {
    renderForm({ estadoEnvio: 'erroValidacao', conflitoGeral: true });

    expect(screen.getByText(/os dados conflitam com outro cadastro/)).toBeTruthy();
  });

  it('should lock the fields and show the saving state while sending', () => {
    renderForm({ modo: 'editar', estadoEnvio: 'enviando' });

    expect(screen.getByLabelText('Nome completo *').props.editable).toBe(false);
    expect(screen.getByRole('button', { name: 'Salvando…' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancelar' }).props.accessibilityState).toMatchObject(
      { disabled: true },
    );
  });

  it.each<EstadoEnvio>(['idle', 'erroConexao', 'erroValidacao'])(
    'should keep the fields editable in the state %s',
    (estadoEnvio) => {
      renderForm({ estadoEnvio });

      expect(screen.getByLabelText('Nome completo *').props.editable).toBe(true);
    },
  );

  it('should move the focus to the first invalid field when a new refusal arrives', () => {
    const focus = jest.spyOn(TextInput.prototype, 'focus');
    const { rerender, completo } = renderForm({ recusas: 0 });
    expect(focus).not.toHaveBeenCalled();

    rerender(
      <ClientFormFields
        {...completo}
        recusas={1}
        estadoEnvio="erroValidacao"
        errosDeCampo={{ email: 'cliente.form.email.invalido' }}
      />,
    );

    expect(focus).toHaveBeenCalledTimes(1);
    focus.mockRestore();
  });
});
