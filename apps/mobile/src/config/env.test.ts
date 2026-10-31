import { getApiBaseUrl } from './env';

describe('getApiBaseUrl', () => {
  const originalValue = process.env.EXPO_PUBLIC_API_BASE_URL;

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_BASE_URL = originalValue;
  });

  it('should return the configured value when EXPO_PUBLIC_API_BASE_URL is set', () => {
    process.env.EXPO_PUBLIC_API_BASE_URL = 'https://api.example.com';

    expect(getApiBaseUrl()).toBe('https://api.example.com');
  });

  it('should return the local default when EXPO_PUBLIC_API_BASE_URL is empty', () => {
    process.env.EXPO_PUBLIC_API_BASE_URL = '';

    expect(getApiBaseUrl()).toBe('http://localhost:8080/api/v1');
  });
});
