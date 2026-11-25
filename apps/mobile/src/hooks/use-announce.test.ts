import { renderHook } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { useAnnounce } from './use-announce';

describe('useAnnounce', () => {
  let anunciar: jest.SpyInstance;

  beforeEach(() => {
    anunciar = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    anunciar.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should announce the message once on mount', () => {
    renderHook(() => useAnnounce('2 clientes encontrados'));

    expect(anunciar).toHaveBeenCalledTimes(1);
    expect(anunciar).toHaveBeenCalledWith('2 clientes encontrados');
  });

  it('should announce nothing when the message is null', () => {
    renderHook(() => useAnnounce(null));

    expect(anunciar).not.toHaveBeenCalled();
  });

  it('should announce again only when the message changes', () => {
    const { rerender } = renderHook(
      ({ mensagem }: { mensagem: string | null }) => useAnnounce(mensagem),
      { initialProps: { mensagem: '2 clientes encontrados' as string | null } },
    );

    rerender({ mensagem: '2 clientes encontrados' });
    expect(anunciar).toHaveBeenCalledTimes(1);

    rerender({ mensagem: 'Nenhum resultado para a busca.' });
    expect(anunciar).toHaveBeenCalledTimes(2);
    expect(anunciar).toHaveBeenLastCalledWith('Nenhum resultado para a busca.');

    rerender({ mensagem: null });
    expect(anunciar).toHaveBeenCalledTimes(2);
  });
});
