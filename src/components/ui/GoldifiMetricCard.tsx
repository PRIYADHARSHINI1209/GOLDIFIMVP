import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';
import { Shadows } from '@/theme/shadows';

interface GoldifiMetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'warning' | 'error' | 'success' | 'default';
  onPress?: () => void;
}

export const GoldifiMetricCard: React.FC<GoldifiMetricCardProps> = ({
  label,
  value,
  subtext,
  iconName,
  variant = 'default',
  onPress,
}) => {
  const getTheme = () => {
    switch (variant) {
      case 'primary':
        return { iconBg: Colors.primaryLight, iconColor: Colors.primary, borderColor: Colors.border };
      case 'warning':
        return { iconBg: Colors.warningLight, iconColor: Colors.warning, borderColor: Colors.warningLight };
      case 'error':
        return { iconBg: Colors.errorLight, iconColor: Colors.error, borderColor: Colors.errorLight };
      case 'success':
        return { iconBg: Colors.successLight, iconColor: Colors.success, borderColor: Colors.successLight };
      default:
        return { iconBg: Colors.surfaceSecondary, iconColor: Colors.charcoal, borderColor: Colors.border };
    }
  };

  const theme = getTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: theme.borderColor },
        pressed && onPress && { opacity: 0.9, backgroundColor: Colors.surface },
      ]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View style={styles.topRow}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        <View style={[styles.iconWrapper, { backgroundColor: theme.iconBg }]}>
          <Ionicons name={iconName} size={18} color={theme.iconColor} />
        </View>
      </View>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      {subtext && <Text style={styles.subtext} numberOfLines={1}>{subtext}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    minWidth: 140,
    ...Shadows.subtle,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
    flex: 1,
    marginRight: 6,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...Typography.metricMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtext: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
