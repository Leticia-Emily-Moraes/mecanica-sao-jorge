const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';

export function getApiBaseUrl(): string {
  const value = process.env.EXPO_PUBLIC_API_BASE_URL;
  return value && value.length > 0 ? value : DEFAULT_API_BASE_URL;
}
