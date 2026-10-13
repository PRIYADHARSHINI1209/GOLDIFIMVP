import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Spacing } from '@/theme/spacing';
import { Shadows } from '@/theme/shadows';

interface GoldifiCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: number;
  style?: ViewStyle;
}

export const GoldifiCard: React.FC<GoldifiCardProps> = ({
  children,
  onPress,
  variant = 'outlined',
  padding = Spacing.cardPadding,
  style,
}) => {
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.border,
          ...Shadows.card,
        };
      case 'flat':
        return {
          backgroundColor: Colors.surface,
          borderWidth: 0,
        };
      case 'outlined':
      default:
        return {
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.border,
        };
    }
  };

  const containerStyle = [
    styles.card,
    getCardStyle(),
    { padding },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && { opacity: 0.9, backgroundColor: Colors.surface },
        ]}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    marginBottom: 12,
  },
});
