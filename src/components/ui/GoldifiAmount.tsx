import React from 'react';
import { Text, TextStyle } from 'react-native';
import { formatINR } from '@/utils/currency';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';

interface GoldifiAmountProps {
  amount: number | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'primary';
  style?: TextStyle;
}

export const GoldifiAmount: React.FC<GoldifiAmountProps> = ({
  amount,
  size = 'md',
  variant = 'default',
  style,
}) => {
  const getStyle = (): TextStyle => {
    switch (size) {
      case 'sm':
        return Typography.secondaryMedium;
      case 'md':
        return { ...Typography.sectionTitle, fontWeight: '700' };
      case 'lg':
        return Typography.metricMedium;
      case 'xl':
        return Typography.metricLarge;
    }
  };

  const getColor = (): string => {
    switch (variant) {
      case 'success':
        return Colors.success;
      case 'warning':
        return Colors.warning;
      case 'error':
        return Colors.error;
      case 'primary':
        return Colors.primary;
      default:
        return Colors.textPrimary;
    }
  };

  return (
    <Text style={[getStyle(), { color: getColor() }, style]}>
      {formatINR(amount)}
    </Text>
  );
};
