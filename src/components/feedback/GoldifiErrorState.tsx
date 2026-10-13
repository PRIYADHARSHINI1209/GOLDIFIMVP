import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiButton } from '../ui/GoldifiButton';

interface GoldifiErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const GoldifiErrorState: React.FC<GoldifiErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to complete the operation. Please verify your connection or try again.',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={38} color={Colors.error} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <View style={styles.buttonWrapper}>
          <GoldifiButton
            label="Try Again"
            onPress={onRetry}
            variant="outline"
            iconName="refresh"
            fullWidth={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: Radius.pill,
    backgroundColor: Colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonWrapper: {
    minWidth: 140,
  },
});
