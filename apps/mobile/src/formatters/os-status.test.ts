import { formatarStatusDaOs, tomDoStatusDaOs } from './os-status';

describe('formatarStatusDaOs', () => {
  it('should replace the underscores with spaces and keep the case', () => {
    expect(formatarStatusDaOs('EM_ANALISE')).toBe('EM ANALISE');
    expect(formatarStatusDaOs('AGUARDANDO_PECA')).toBe('AGUARDANDO PECA');
  });

  it('should keep a single-word status as it is', () => {
    expect(formatarStatusDaOs('ABERTA')).toBe('ABERTA');
  });

  it('should return an empty text for an empty status', () => {
    expect(formatarStatusDaOs('')).toBe('');
  });
});

describe('tomDoStatusDaOs', () => {
  it('should use the in progress badge for EM_ANDAMENTO', () => {
    expect(tomDoStatusDaOs('EM_ANDAMENTO')).toBe('inProgress');
  });

  it('should use the success badge for ENTREGUE', () => {
    expect(tomDoStatusDaOs('ENTREGUE')).toBe('success');
  });

  it.each(['ABERTA', 'EM_ANALISE', 'AGUARDANDO_PECA', 'FINALIZADA', 'CANCELADA', 'OUTRO'])(
    'should use the neutral badge for %s, which has no drawn badge yet',
    (status) => {
      expect(tomDoStatusDaOs(status)).toBe('neutral');
    },
  );
});
