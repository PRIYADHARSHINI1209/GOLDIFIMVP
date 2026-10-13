import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface GoldifiButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const GoldifiButton: React.FC<GoldifiButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  iconName,
  iconPosition = 'left',
  fullWidth = true,
  style,
}) => {
  const getButtonStyles = (pressed: boolean): ViewStyle => {
    let backgroundColor: string = Colors.primary;
    let borderColor: string = 'transparent';
    let borderWidth: number = 0;

    switch (variant) {
      case 'primary':
        backgroundColor = pressed ? Colors.primaryPressed : Colors.primary;
        break;
      case 'secondary':
        backgroundColor = pressed ? Colors.surfaceSecondary : Colors.surface;
        break;
      case 'outline':
        backgroundColor = pressed ? Colors.primaryLight : 'transparent';
        borderColor = Colors.primary;
        borderWidth = 1.5;
        break;
      case 'ghost':
        backgroundColor = pressed ? Colors.surfaceSecondary : 'transparent';
        break;
      case 'danger':
        backgroundColor = pressed ? '#A83232' : Colors.error;
        break;
    }

    if (disabled) {
      backgroundColor = Colors.surfaceSecondary;
      borderColor = 'transparent';
    }

    const height =
      size === 'sm' ? Spacing.buttonHeightSm : size === 'lg' ? 56 : Spacing.buttonHeight;
    const paddingHorizontal = size === 'sm' ? 12 : size === 'lg' ? 24 : 16;

    return {
      backgroundColor,
      borderColor,
      borderWidth,
      height,
      paddingHorizontal,
      borderRadius: Radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled ? 0.6 : 1,
    };
  };

  const getTextColor = (): string => {
    if (disabled) return Colors.textMuted;
    switch (variant) {
      case 'primary':
      case 'danger':
        return Colors.white;
      case 'outline':
        return Colors.primary;
      case 'secondary':
      case 'ghost':
        return Colors.textPrimary;
      default:
        return Colors.white;
    }
  };

  const textColor = getTextColor();
  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [getButtonStyles(pressed), style]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {iconName && iconPosition === 'left' && (
            <Ionicons name={iconName} size={iconSize} color={textColor} style={styles.leftIcon} />
          )}
          <Text
            style={[
              Typography.secondaryMedium,
              {
                color: textColor,
                fontWeight: '600',
                fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 15,
              },
            ]}
          >
            {label}
          </Text>
          {iconName && iconPosition === 'right' && (
            <Ionicons name={iconName} size={iconSize} color={textColor} style={styles.rightIcon} />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
