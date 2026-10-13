import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';
import { PledgedItem } from '@/types';
import { formatINR } from '@/utils/currency';
import { GoldifiStatusBadge } from '../ui/GoldifiStatusBadge';
import { Shadows } from '@/theme/shadows';

interface InventoryCardProps {
  item: PledgedItem;
  onPress: () => void;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Item ${item.id}`}
    >
      <View style={styles.topRow}>
        <View style={styles.idBlock}>
          <Text style={styles.itemId}>{item.id}</Text>
          <Text style={styles.loanRef}>Loan: {item.loanNumber}</Text>
        </View>
        <GoldifiStatusBadge status={item.status} size="sm" />
      </View>

      <Text style={styles.desc}>{item.description}</Text>

      <View style={styles.metaBox}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Weight</Text>
          <Text style={styles.metaVal}>{item.grossWeightGrams}g (Net: {item.netWeightGrams}g)</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Est. Value</Text>
          <Text style={styles.valueText}>{formatINR(item.estimatedMarketValue)}</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.lockerTag}>
          <Ionicons name="cube-outline" size={13} color={Colors.info} />
          <Text style={styles.lockerText}>{item.storageLocker}</Text>
        </View>
        <Text style={styles.customerName}>{item.customerName}</Text>
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
    marginBottom: 6,
  },
  idBlock: {
    flex: 1,
  },
  itemId: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  loanRef: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  desc: {
    ...Typography.secondaryMedium,
    color: Colors.charcoal,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: Radius.sm,
    marginBottom: 8,
  },
  metaItem: {},
  metaLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  metaVal: {
    ...Typography.captionMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  valueText: {
    ...Typography.captionMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lockerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.infoLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  lockerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.info,
  },
  customerName: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
