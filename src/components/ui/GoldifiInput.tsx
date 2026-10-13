import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';

interface GoldifiInputProps extends TextInputProps {
  label: string;
  error?: string;
  helperText?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  prefix?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const GoldifiInput: React.FC<GoldifiInputProps> = ({
  label,
  error,
  helperText,
  leadingIcon,
  prefix,
  isPassword = false,
  containerStyle,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = Boolean(error);

  const getBorderColor = () => {
    if (hasError) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: inputProps.editable === false ? Colors.surfaceSecondary : Colors.white,
          },
        ]}
      >
        {leadingIcon && (
          <Ionicons
            name={leadingIcon}
            size={18}
            color={isFocused ? Colors.primary : Colors.textMuted}
            style={styles.leadingIcon}
          />
        )}
        {prefix && <Text style={styles.prefixText}>{prefix}</Text>}
        <TextInput
          {...inputProps}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, inputProps.style]}
        />
        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {hasError ? (
        <View style={styles.feedbackRow}>
          <Ionicons name="alert-circle" size={14} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.secondaryMedium,
    color: Colors.textPrimary,
    marginBottom: 6,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Spacing.inputHeight,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    height: '100%',
    ...Typography.body,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  leadingIcon: {
    marginRight: 10,
  },
  prefixText: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginRight: 6,
  },
  passwordToggle: {
    padding: 8,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '500',
  },
  helperText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
