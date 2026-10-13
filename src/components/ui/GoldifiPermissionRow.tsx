import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';

interface GoldifiPermissionRowProps {
  label: string;
  description: string;
  isGranted: boolean;
  onToggle?: (granted: boolean) => void;
  disabled?: boolean;
}

export const GoldifiPermissionRow: React.FC<GoldifiPermissionRowProps> = ({
  label,
  description,
  isGranted,
  onToggle,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <View
            style={[
              styles.statusTag,
              { backgroundColor: isGranted ? Colors.successLight : Colors.surfaceSecondary },
            ]}
          >
            <Ionicons
              name={isGranted ? 'checkmark-circle' : 'close-circle'}
              size={12}
              color={isGranted ? Colors.success : Colors.textMuted}
            />
            <Text
              style={[
                styles.statusText,
                { color: isGranted ? Colors.success : Colors.textMuted },
              ]}
            >
              {isGranted ? 'Allowed' : 'Restricted'}
            </Text>
          </View>
        </View>
        <Text style={styles.description}>{description}</Text>
      </View>

      {onToggle && (
        <Switch
          value={isGranted}
          onValueChange={onToggle}
          disabled={disabled}
          trackColor={{ false: Colors.border, true: Colors.primaryLight }}
          thumbColor={isGranted ? Colors.primary : Colors.surfaceSecondary}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  label: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
