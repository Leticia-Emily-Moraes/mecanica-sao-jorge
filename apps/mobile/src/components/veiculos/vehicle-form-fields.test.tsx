import { fireEvent, render, screen } from '@testing-library/react-native';
import { TextInput } from 'react-native';

import type { EstadoEnvio } from '@/hooks/use-client-form';
import type { ValoresDoVeiculo } from '@/hooks/use-vehicle-form';

import { VehicleFormFields, type VehicleFormFieldsProps } from './vehicle-form-fields';

jest.mock('@expo/vector-icons', () => ({ Ionicons: () => null }));

const VAZIOS: ValoresDoVeiculo = { placa: '', marca: '', modelo: '', ano: '', cor: '' };

function renderForm(props: Partial<VehicleFormFieldsProps> = {}) {
  const handlers = { onChange: jest.fn(), onSubmit: jest.fn(), onCancel: jest.fn() };
  const completo: VehicleFormFieldsProps = {
    modo: 'novo',
    clienteNome: 'Teodoro Lemos',
    valores: VAZIOS,
    errosDeCampo: {},
    estadoEnvio: 'idle',
    conflitoGeral: false,
    recusas: 0,
    ...handlers,
    ...props,
  };
  const resultado = render(<VehicleFormFields {...completo} />);
  return { ...handlers, ...resultado, completo };
}

describe('VehicleFormFields', () => {
  it('should show the owner line and the five fields with their labels', () => {
    renderForm();

    expect(screen.getByLabelText('Cliente: Teodoro Lemos')).toBeTruthy();
    expect(screen.getByLabelText('Placa *')).toBeTruthy();
    expect(screen.getByLabelText('Marca *')).toBeTruthy();
    expect(screen.getByLabelText('Modelo *')).toBeTruthy();
    expect(screen.getByLabelText('Ano (opcional)')).toBeTruthy();
    expect(screen.getByLabelText('Cor (opcional)')).toBeTruthy();
  });

  it('should use the right keyboard and limits for plate and year', () => {
    renderForm();

    const placa = screen.getByLabelText('Placa *');
    expect(placa.props.autoCapitalize).toBe('characters');
    expect(placa.props.maxLength).toBe(7);
    const ano = screen.getByLabelText('Ano (opcional)');
    expect(ano.props.keyboardType).toBe('number-pad');
    expect(ano.props.maxLength).toBe(4);
  });

  it('should report the typed text with the field name', () => {
    const { onChange } = renderForm();

    fireEvent.changeText(screen.getByLabelText('Modelo *'), 'Civic');

    expect(onChange).toHaveBeenCalledWith('modelo', 'Civic');
  });

  it('should show a single save button when creating', () => {
    renderForm();

    expect(screen.getByRole('button', { name: 'Salvar veículo' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Cancelar' })).toBeNull();
  });

  it('should offer Cancel plus Save changes when editing', () => {
    const { onCancel } = renderForm({ modo: 'editar' });

    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should submit when the save button is pressed', () => {
    const { onSubmit } = renderForm();

    fireEvent.press(screen.getByRole('button', { name: 'Salvar veículo' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should show the errors under the fields and a plural banner for three fields', () => {
    renderForm({
      estadoEnvio: 'erroValidacao',
      errosDeCampo: {
        placa: 'veiculo.form.placa.erro',
        modelo: 'veiculo.form.modelo.invalido',
        ano: 'veiculo.form.ano.invalido',
      },
    });

    expect(screen.getByText('Placa inválida. Use ABC1D23 ou ABC1234.')).toBeTruthy();
    expect(screen.getByText('Informe o modelo.')).toBeTruthy();
    expect(screen.getByText('Ano inválido.')).toBeTruthy();
    expect(screen.getByText('Corrija os 3 campos destacados para salvar.')).toBeTruthy();
  });

  it('should show the duplicate plate with the singular banner', () => {
    renderForm({
      estadoEnvio: 'erroValidacao',
      errosDeCampo: { placa: 'veiculo.form.placa.duplicada' },
    });

    expect(screen.getByText('Esta placa já está cadastrada.')).toBeTruthy();
    expect(screen.getByText('Corrija o campo destacado para salvar.')).toBeTruthy();
  });

  it('should fall back to a generic text for an error key it does not know', () => {
    renderForm({
      estadoEnvio: 'erroValidacao',
      errosDeCampo: { marca: 'chave.que.nao.existe' },
    });

    expect(screen.getByText('Confira este campo.')).toBeTruthy();
    expect(screen.queryByText('chave.que.nao.existe')).toBeNull();
  });

  it('should show the send failure banner without marking any field', () => {
    renderForm({ estadoEnvio: 'erroConexao', valores: { ...VAZIOS, modelo: 'Civic' } });

    expect(
      screen.getByText('Não foi possível salvar. Verifique a internet da oficina e tente de novo.'),
    ).toBeTruthy();
    expect(screen.queryByText('Informe o modelo.')).toBeNull();
    expect(screen.getByLabelText('Modelo *').props.value).toBe('Civic');
  });

  it('should show the general conflict banner when the conflict has no field', () => {
    renderForm({ estadoEnvio: 'erroValidacao', conflitoGeral: true });

    expect(screen.getByText(/os dados conflitam com outro cadastro/)).toBeTruthy();
  });

  it('should lock the fields and show the saving state while sending', () => {
    renderForm({ modo: 'editar', estadoEnvio: 'enviando' });

    expect(screen.getByLabelText('Placa *').props.editable).toBe(false);
    expect(screen.getByRole('button', { name: 'Salvando…' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cancelar' }).props.accessibilityState).toMatchObject(
      { disabled: true },
    );
  });

  it.each<EstadoEnvio>(['idle', 'erroConexao', 'erroValidacao'])(
    'should keep the fields editable in the state %s',
    (estadoEnvio) => {
      renderForm({ estadoEnvio });

      expect(screen.getByLabelText('Placa *').props.editable).toBe(true);
    },
  );

  it('should move the focus to the first invalid field when a new refusal arrives', () => {
    const focus = jest.spyOn(TextInput.prototype, 'focus');
    const { rerender, completo } = renderForm({ recusas: 0 });
    expect(focus).not.toHaveBeenCalled();

    rerender(
      <VehicleFormFields
        {...completo}
        recusas={1}
        estadoEnvio="erroValidacao"
        errosDeCampo={{ modelo: 'veiculo.form.modelo.invalido' }}
      />,
    );

    expect(focus).toHaveBeenCalledTimes(1);
    focus.mockRestore();
  });
});
