import {
  borderWidth,
  color,
  iconSize,
  opacity,
  radius,
  shadow,
  size,
  spacing,
  typography,
} from './tokens';

/**
 * Trava o hex e a medida do FPdB8 (planilha F41, §6). Os testes de componente
 * comparam com o token; só este arquivo falha se alguém trocar o valor.
 */
describe('tokens (FPdB8 literal values)', () => {
  describe('color.surface', () => {
    it.each([
      ['background', color.surface.background, '#F7F5F2'],
      ['brand', color.surface.brand, '#1E3A3F'],
      ['errorTint', color.surface.errorTint, '#F6E7E5'],
      ['avatar', color.surface.avatar, '#33575D'],
      ['overlay', color.surface.overlay, 'rgba(30, 58, 63, 0.55)'],
      ['onBrandControl', color.surface.onBrandControl, 'rgba(255, 255, 255, 0.12)'],
    ])('should keep %s at the Figma value', (_name, actual, expected) => {
      expect(actual).toBe(expected);
    });
  });

  describe('color.text', () => {
    it.each([
      ['secondary', color.text.secondary, '#6E6A66'],
      ['placeholder', color.text.placeholder, '#6E6A66'],
      ['onBrandMuted', color.text.onBrandMuted, '#B7B2AC'],
      ['tabSelected', color.text.tabSelected, '#EE8279'],
      ['errorOnBanner', color.text.errorOnBanner, '#923631'],
    ])('should keep %s at the Figma value', (_name, actual, expected) => {
      expect(actual).toBe(expected);
    });

    it('should use Flint for the placeholder, the same tone as the secondary text', () => {
      expect(color.text.placeholder).toBe(color.text.secondary);
    });
  });

  describe('color.border and color.action', () => {
    it.each([
      ['default (field at rest)', color.border.default, '#8C8780'],
      ['divider', color.border.divider, '#E2DEDA'],
      ['errorBanner', color.border.errorBanner, '#E2B5B0'],
      ['focusField', color.border.focusField, '#B5453D'],
      ['primaryBackground', color.action.primaryBackground, '#B5453D'],
    ])('should keep %s at the Figma value', (_name, actual, expected) => {
      expect(actual).toBe(expected);
    });
  });

  describe('color.focus', () => {
    it('should draw the ring over the petro bar in white', () => {
      expect(color.focus.ringOnBrand).toBe('#FFFFFF');
    });
  });

  describe('measures', () => {
    it('should keep the control sizes of the frames', () => {
      expect(size).toEqual({
        field: 46,
        button: 50,
        appBar: 56,
        tabBar: 62,
        avatar: 84,
        iconButton: 36,
      });
    });

    it('should keep the icon sizes of the frames', () => {
      expect(iconSize).toMatchObject({ tab: 22, appBar: 18, banner: 18 });
    });

    it('should dim the unavailable tab bar items to 50 percent (T2)', () => {
      expect(opacity.unavailable).toBe(0.5);
    });

    it('should keep the radii and borders of the frames', () => {
      expect(radius).toMatchObject({ sm: 8, dialog: 10, pill: 999 });
      expect(borderWidth).toEqual({ hairline: 1, field: 2 });
    });

    it('should keep the spacing scale used by the frames', () => {
      expect(spacing).toMatchObject({ xs: 4, s6: 6, s10: 10, s12: 12, s14: 14, md: 16, s20: 20 });
    });
  });

  describe('typography', () => {
    it('should keep the tab label at Inter 11 and the selected one in SemiBold', () => {
      expect(typography.tabLabel).toEqual({ fontFamily: 'Inter_500Medium', fontSize: 11 });
      expect(typography.tabLabelSelected).toEqual({
        fontFamily: 'Inter_600SemiBold',
        fontSize: 11,
      });
    });

    it('should keep the banner text at 14 with 19.6 line height', () => {
      expect(typography.banner).toMatchObject({ fontSize: 14, lineHeight: 19.6 });
    });

    it('should keep the dialog title at 22 and its message at 14 over 21', () => {
      expect(typography.dialogTitle).toMatchObject({
        fontFamily: 'BarlowCondensed_700Bold',
        fontSize: 22,
      });
      expect(typography.dialogMessage).toMatchObject({ fontSize: 14, lineHeight: 21 });
    });
  });

  describe('shadow', () => {
    it('should keep the card shadow 0 1 1 at 6 percent petro', () => {
      expect(shadow.card).toMatchObject({
        shadowColor: '#1E3A3F',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 1,
      });
    });

    it('should keep the dialog shadow 0 12 16 at 25 percent black', () => {
      expect(shadow.dialog).toMatchObject({
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      });
    });
  });
});
