import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { useAuth } from '@/context/AuthContext';

interface GoldifiHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  showRoleBadge?: boolean;
  onRoleBadgePress?: () => void;
}

export const GoldifiHeader: React.FC<GoldifiHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBackPress,
  rightAction,
  showRoleBadge = false,
  onRoleBadgePress,
}) => {
  const router = useRouter();
  const { role } = useAuth();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack && (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color={Colors.charcoal} />
          </Pressable>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightRow}>
        {showRoleBadge && (
          <Pressable
            onPress={onRoleBadgePress}
            style={styles.roleBadge}
            accessibilityRole="button"
            accessibilityLabel="Role Simulator Switcher"
          >
            <View style={styles.devIndicator} />
            <Text style={styles.roleText}>{role}</Text>
          </Pressable>
        )}
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenHorizontal,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 6,
    marginLeft: -6,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...Typography.sectionTitle,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    gap: 6,
  },
  devIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.charcoal,
    letterSpacing: 0.5,
  },
});
