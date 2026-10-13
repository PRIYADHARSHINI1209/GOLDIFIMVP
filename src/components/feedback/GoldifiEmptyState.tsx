import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { GoldifiButton } from '../ui/GoldifiButton';

interface GoldifiEmptyStateProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const GoldifiEmptyState: React.FC<GoldifiEmptyStateProps> = ({
  iconName,
  title,
  description,
  actionLabel,
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={36} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onActionPress && (
        <View style={styles.actionContainer}>
          <GoldifiButton
            label={actionLabel}
            onPress={onActionPress}
            size="md"
            iconName="add"
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
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    ...Typography.secondary,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionContainer: {
    minWidth: 160,
  },
});
