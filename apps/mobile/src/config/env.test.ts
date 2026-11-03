import Constants from 'expo-constants';

import { getApiBaseUrl } from './env';

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {} as Record<string, unknown>,
    },
  },
}));

function setApiBaseUrlExtra(value: unknown): void {
  (Constants.expoConfig as { extra: Record<string, unknown> }).extra = {
    apiBaseUrl: value,
  };
}

describe('getApiBaseUrl', () => {
  it('should return the configured value when extra.apiBaseUrl is set', () => {
    setApiBaseUrlExtra('https://api.example.com');

    expect(getApiBaseUrl()).toBe('https://api.example.com');
  });

  it('should return the local default when extra.apiBaseUrl is empty', () => {
    setApiBaseUrlExtra('');

    expect(getApiBaseUrl()).toBe('http://localhost:8080/api/v1');
  });

  it('should return the local default when extra.apiBaseUrl is not set', () => {
    setApiBaseUrlExtra(undefined);

    expect(getApiBaseUrl()).toBe('http://localhost:8080/api/v1');
  });
});
