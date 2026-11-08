import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Mecânica São Jorge',
  slug: 'mecanica-sao-jorge',
  scheme: 'mecanicasaojorge',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: false,
  },
  android: {},
  web: {
    bundler: 'metro',
  },
  plugins: ['expo-router', 'expo-secure-store'],
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  },
};

export default config;
