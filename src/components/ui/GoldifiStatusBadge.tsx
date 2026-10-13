import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';

export type StatusType =
  | 'ACTIVE'
  | 'DUE_SOON'
  | 'OVERDUE'
  | 'CLOSED'
  | 'RENEWED'
  | 'VERIFIED'
  | 'FLAGGED'
  | 'PENDING'
  | 'PLEDGED'
  | 'IN_STORAGE'
  | 'RELEASED';

interface GoldifiStatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
}

export const GoldifiStatusBadge: React.FC<GoldifiStatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let label = status;
  let bg: string = Colors.surfaceSecondary;
  let text: string = Colors.textSecondary;
  let iconName: keyof typeof Ionicons.glyphMap = 'ellipse';

  switch (normalized) {
    case 'ACTIVE':
      label = 'Active';
      bg = Colors.successLight;
      text = Colors.success;
      iconName = 'checkmark-circle-outline';
      break;
    case 'DUE_SOON':
      label = 'Due Soon';
      bg = Colors.warningLight;
      text = Colors.warning;
      iconName = 'time-outline';
      break;
    case 'OVERDUE':
      label = 'Overdue';
      bg = Colors.errorLight;
      text = Colors.error;
      iconName = 'alert-circle-outline';
      break;
    case 'CLOSED':
      label = 'Closed';
      bg = Colors.surfaceSecondary;
      text = Colors.textMuted;
      iconName = 'checkmark-done-outline';
      break;
    case 'RENEWED':
      label = 'Renewed';
      bg = Colors.primaryLight;
      text = Colors.primary;
      iconName = 'sync-outline';
      break;
    case 'VERIFIED':
      label = 'KYC Verified';
      bg = Colors.successLight;
      text = Colors.success;
      iconName = 'shield-checkmark-outline';
      break;
    case 'FLAGGED':
      label = 'Flagged';
      bg = Colors.errorLight;
      text = Colors.error;
      iconName = 'flag-outline';
      break;
    case 'PENDING':
      label = 'Pending';
      bg = Colors.warningLight;
      text = Colors.warning;
      iconName = 'hourglass-outline';
      break;
    case 'PLEDGED':
      label = 'Pledged';
      bg = Colors.primaryLight;
      text = Colors.primary;
      iconName = 'lock-closed-outline';
      break;
    case 'IN_STORAGE':
      label = 'In Vault';
      bg = Colors.infoLight;
      text = Colors.info;
      iconName = 'cube-outline';
      break;
    case 'RELEASED':
      label = 'Released';
      bg = Colors.successLight;
      text = Colors.success;
      iconName = 'arrow-redo-outline';
      break;
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bg },
        isSmall && { paddingVertical: 2, paddingHorizontal: 6 },
      ]}
    >
      <Ionicons
        name={iconName}
        size={isSmall ? 11 : 13}
        color={text}
        style={{ marginRight: 4 }}
      />
      <Text
        style={[
          styles.label,
          { color: text, fontSize: isSmall ? 11 : 12 },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography.captionSemibold,
    fontWeight: '700',
  },
});
