import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

interface GoldifiLoadingStateProps {
  message?: string;
}

export const GoldifiLoadingState: React.FC<GoldifiLoadingStateProps> = ({
  message = 'Loading Goldifi data...',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  message: {
    ...Typography.secondaryMedium,
    color: Colors.textSecondary,
    marginTop: 16,
  },
});
