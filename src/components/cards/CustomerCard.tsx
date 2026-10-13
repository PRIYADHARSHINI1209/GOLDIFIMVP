import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';
import { Customer } from '@/types';
import { formatINR } from '@/utils/currency';
import { GoldifiAvatar } from '../ui/GoldifiAvatar';
import { GoldifiStatusBadge } from '../ui/GoldifiStatusBadge';
import { Shadows } from '@/theme/shadows';

interface CustomerCardProps {
  customer: Customer;
  onPress: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onPress }) => {
  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Customer ${customer.name}`}
    >
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <GoldifiAvatar initials={initials} size="sm" backgroundColor={Colors.charcoal} />
          <View style={styles.nameBlock}>
            <Text style={styles.name} numberOfLines={1}>{customer.name}</Text>
            <Text style={styles.code}>{customer.customerCode}</Text>
          </View>
        </View>
        <GoldifiStatusBadge status={customer.status} size="sm" />
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.detailText}>{customer.phone}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.detailText} numberOfLines={1}>{customer.city}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.footerLabel}>Active Loans</Text>
          <Text style={styles.footerValue}>{customer.activeLoansCount}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.footerLabel}>Outstanding</Text>
          <Text style={styles.outstandingAmount}>{formatINR(customer.outstandingAmount)}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  pressed: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  nameBlock: {
    flex: 1,
  },
  name: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  code: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  footerValue: {
    ...Typography.secondaryMedium,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  outstandingAmount: {
    ...Typography.secondaryMedium,
    fontWeight: '700',
    color: Colors.primary,
  },
});
