import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';

interface GoldifiBadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle';
  style?: ViewStyle;
}

export const GoldifiBadge: React.FC<GoldifiBadgeProps> = ({
  label,
  variant = 'secondary',
  style,
}) => {
  let bg: string = Colors.surfaceSecondary;
  let text: string = Colors.textSecondary;
  let border: string = 'transparent';

  switch (variant) {
    case 'primary':
      bg = Colors.primary;
      text = Colors.white;
      break;
    case 'outline':
      bg = 'transparent';
      text = Colors.primary;
      border = Colors.primary;
      break;
    case 'subtle':
      bg = Colors.primaryLight;
      text = Colors.primary;
      break;
    default:
      bg = Colors.surfaceSecondary;
      text = Colors.textPrimary;
      break;
  }

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg, borderColor: border, borderWidth: border !== 'transparent' ? 1 : 0 },
        style,
      ]}
    >
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    ...Typography.captionMedium,
    fontWeight: '600',
    fontSize: 11,
  },
});
