import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';

interface GoldifiIconButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  color?: string;
  backgroundColor?: string;
  accessibilityLabel: string;
  style?: ViewStyle;
}

export const GoldifiIconButton: React.FC<GoldifiIconButtonProps> = ({
  iconName,
  onPress,
  size = 40,
  iconSize = 20,
  color = Colors.charcoal,
  backgroundColor = Colors.surface,
  accessibilityLabel,
  style,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: Radius.md,
          backgroundColor: pressed ? Colors.surfaceSecondary : backgroundColor,
        },
        style,
      ]}
    >
      <Ionicons name={iconName} size={iconSize} color={color} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
});
