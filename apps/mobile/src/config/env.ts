import Constants from 'expo-constants';

const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';

function readApiBaseUrlFromExtra(extra: unknown): string | undefined {
  if (!extra || typeof extra !== 'object' || !('apiBaseUrl' in extra)) {
    return undefined;
  }

  const { apiBaseUrl } = extra as { apiBaseUrl: unknown };
  return typeof apiBaseUrl === 'string' ? apiBaseUrl : undefined;
}

export function getApiBaseUrl(): string {
  const value = readApiBaseUrlFromExtra(Constants.expoConfig?.extra);
  return value && value.length > 0 ? value : DEFAULT_API_BASE_URL;
}
