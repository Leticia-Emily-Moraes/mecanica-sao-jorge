import { getAppVersion } from './app-version';

// Só a borda (a configuração do Expo) é substituída; a função testada é a real.
let mockExpoConfig: { version?: unknown } | null = null;
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    get expoConfig() {
      return mockExpoConfig;
    },
  },
}));

describe('getAppVersion', () => {
  it('should return the version declared in the Expo config', () => {
    mockExpoConfig = { version: '0.1.0' };

    expect(getAppVersion()).toBe('0.1.0');
  });

  it('should return undefined when the config has no version', () => {
    mockExpoConfig = {};

    expect(getAppVersion()).toBeUndefined();
  });

  it('should return undefined when the version is blank or not a text', () => {
    mockExpoConfig = { version: '  ' };
    expect(getAppVersion()).toBeUndefined();

    mockExpoConfig = { version: 3 };
    expect(getAppVersion()).toBeUndefined();
  });

  it('should return undefined when there is no Expo config at all', () => {
    mockExpoConfig = null;

    expect(getAppVersion()).toBeUndefined();
  });
});
