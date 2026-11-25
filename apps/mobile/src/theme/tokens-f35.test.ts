import { color, layout, size, typography } from './tokens';

/** Trava os tokens da F35 (especificação do ESQUADRO, seção 2 e 8.1). */
describe('tokens (F35)', () => {
  it('should keep the success feedback color at #3E6E4A', () => {
    expect(color.feedback.success).toBe('#3E6E4A');
  });

  it('should keep the in-progress status color at #2C5258', () => {
    expect(color.status.inProgress).toBe('#2C5258');
  });

  it('should size the small avatar at 40 and the list row at 66', () => {
    expect(size.avatarSmall).toBe(40);
    expect(size.listRow).toBe(66);
  });

  it('should limit the content column to 560 on wide screens', () => {
    expect(layout.contentMaxWidth).toBe(560);
  });

  it('should set the detail name at Barlow Condensed 22 and the card title at Inter 15', () => {
    expect(typography.detailName.fontSize).toBe(22);
    expect(typography.cardTitle.fontSize).toBe(15);
    expect(typography.avatarInitialsSmall.fontSize).toBe(17);
  });
});
