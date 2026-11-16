import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import type { TestStyle } from '@/test-utils/flat-style';

import { hasFocusRing } from '@/test-utils/has-focus-ring';
import { color, fontFamily } from '@/theme/tokens';

import { TabBarItem } from './tab-bar-item';

describe('TabBarItem', () => {
  it('should expose the tab role with the accessible label and the selected state', () => {
    render(
      <TabBarItem
        icon="document-text-outline"
        label="Ordens"
        accessibilityLabel="Ordens, aba selecionada"
        selected
      />,
    );

    const tab = screen.getByRole('tab', { name: 'Ordens, aba selecionada' });

    expect(tab.props.accessibilityState).toMatchObject({ selected: true, disabled: false });
    expect(screen.getByText('Ordens')).toBeTruthy();
  });

  it('should report disabled and not call onPress when unavailable', () => {
    const onPress = jest.fn();
    render(
      <TabBarItem
        icon="cube-outline"
        label="Catálogo"
        accessibilityLabel="Catálogo, indisponível nesta versão"
        selected={false}
        unavailable
        onPress={onPress}
      />,
    );

    const tab = screen.getByRole('tab', { name: 'Catálogo, indisponível nesta versão' });
    fireEvent.press(tab);

    expect(tab.props.accessibilityState).toMatchObject({ selected: false, disabled: true });
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should call onPress when available and pressed', () => {
    const onPress = jest.fn();
    render(
      <TabBarItem
        icon="people-outline"
        label="Clientes"
        accessibilityLabel="Clientes"
        selected={false}
        onPress={onPress}
      />,
    );

    fireEvent.press(screen.getByRole('tab', { name: 'Clientes' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should draw the 11 label in Medium when idle, in the muted Tide tone', () => {
    render(
      <TabBarItem
        icon="people-outline"
        label="Clientes"
        accessibilityLabel="Clientes"
        selected={false}
      />,
    );

    expect(StyleSheet.flatten(screen.getByText('Clientes').props.style as TestStyle)).toMatchObject(
      {
        fontFamily: fontFamily.bodyMedium,
        fontSize: 11,
        color: color.text.onBrandMuted,
      },
    );
  });

  it('should draw the selected label in SemiBold with the selected tone, not only a color change', () => {
    render(
      <TabBarItem icon="people-outline" label="Clientes" accessibilityLabel="Clientes" selected />,
    );

    expect(StyleSheet.flatten(screen.getByText('Clientes').props.style as TestStyle)).toMatchObject(
      {
        fontFamily: fontFamily.bodySemiBold,
        fontSize: 11,
        color: color.text.tabSelected,
      },
    );
  });

  it('should have no pill behind the selected item (the F34 pill left)', () => {
    render(
      <TabBarItem icon="people-outline" label="Clientes" accessibilityLabel="Clientes" selected />,
    );

    expect(JSON.stringify(screen.toJSON())).not.toContain(color.action.primaryBackground);
  });

  it('should draw the white ring of 2 px with a 2 px gap only while focused (T1)', () => {
    render(
      <TabBarItem icon="people-outline" label="Clientes" accessibilityLabel="Clientes" selected />,
    );
    const ring = (): boolean =>
      hasFocusRing(screen.getByRole('tab', { name: 'Clientes' }), color.focus.ringOnBrand);

    expect(ring()).toBe(false);

    fireEvent(screen.getByRole('tab', { name: 'Clientes' }), 'focus');
    expect(ring()).toBe(true);

    fireEvent(screen.getByRole('tab', { name: 'Clientes' }), 'blur');
    expect(ring()).toBe(false);
  });

  it('should not use the petro ring, which disappears over the petro bar', () => {
    render(
      <TabBarItem icon="people-outline" label="Clientes" accessibilityLabel="Clientes" selected />,
    );

    fireEvent(screen.getByRole('tab', { name: 'Clientes' }), 'focus');

    expect(hasFocusRing(screen.getByRole('tab', { name: 'Clientes' }))).toBe(false);
  });

  it('should reserve a 2 px ring and a 2 px gap around the item', () => {
    render(
      <TabBarItem icon="people-outline" label="Clientes" accessibilityLabel="Clientes" selected />,
    );
    let node = screen.getByRole('tab', { name: 'Clientes' }).parent;
    while (node && StyleSheet.flatten(node.props.style as TestStyle)?.borderWidth === undefined) {
      node = node.parent;
    }

    expect(StyleSheet.flatten(node?.props.style as TestStyle)).toMatchObject({
      borderWidth: 2,
      padding: 2,
    });
  });

  it('should draw the selected item with the approved #EE8279 and announce it as selected', () => {
    render(
      <TabBarItem icon="people-outline" label="Clientes" accessibilityLabel="Clientes" selected />,
    );

    expect(StyleSheet.flatten(screen.getByText('Clientes').props.style as TestStyle).color).toBe(
      '#EE8279',
    );
    expect(screen.getByRole('tab', { name: 'Clientes' }).props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it('should dim an unavailable item to 50 percent, label and icon (T2)', () => {
    render(
      <TabBarItem
        icon="cube-outline"
        label="Catálogo"
        accessibilityLabel="Catálogo, indisponível nesta versão"
        selected={false}
        unavailable
      />,
    );

    expect(StyleSheet.flatten(screen.getByText('Catálogo').props.style as TestStyle).opacity).toBe(
      0.5,
    );
  });
});
