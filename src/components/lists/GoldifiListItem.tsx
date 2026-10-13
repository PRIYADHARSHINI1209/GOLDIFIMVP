import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';

interface GoldifiListItemProps {
  title: string;
  subtitle?: string;
  leadingIcon?: keyof typeof Ionicons.glyphMap;
  leadingIconColor?: string;
  leadingIconBg?: string;
  trailingText?: string;
  trailingNode?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  destructive?: boolean;
}

export const GoldifiListItem: React.FC<GoldifiListItemProps> = ({
  title,
  subtitle,
  leadingIcon,
  leadingIconColor = Colors.primary,
  leadingIconBg = Colors.primaryLight,
  trailingText,
  trailingNode,
  showChevron = true,
  onPress,
  destructive = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && onPress && styles.pressed,
      ]}
      accessibilityRole={onPress ? 'button' : undefined}
    >
      <View style={styles.left}>
        {leadingIcon && (
          <View style={[styles.iconBox, { backgroundColor: leadingIconBg }]}>
            <Ionicons name={leadingIcon} size={20} color={leadingIconColor} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              destructive && { color: Colors.error },
            ]}
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>

      <View style={styles.right}>
        {trailingText && <Text style={styles.trailingText}>{trailingText}</Text>}
        {trailingNode}
        {showChevron && onPress && (
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  pressed: {
    backgroundColor: Colors.surface,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trailingText: {
    ...Typography.secondaryMedium,
    color: Colors.textSecondary,
  },
});
