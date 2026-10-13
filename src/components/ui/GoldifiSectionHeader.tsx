import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

interface GoldifiSectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  count?: number;
}

export const GoldifiSectionHeader: React.FC<GoldifiSectionHeaderProps> = ({
  title,
  actionText,
  onActionPress,
  count,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {count !== undefined && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
      {actionText && onActionPress && (
        <Pressable
          onPress={onActionPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={actionText}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  actionText: {
    ...Typography.secondaryMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
});
