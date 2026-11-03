import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen(): ReactElement {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        Mecânica São Jorge
      </Text>
      <Text style={styles.subtitle}>
        Scaffold do app mobile. As telas de cada funcionalidade chegam a partir da etapa de Login.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4b5563',
  },
});
