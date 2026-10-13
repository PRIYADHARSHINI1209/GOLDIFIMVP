import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';
import { Loan } from '@/types';
import { formatINR } from '@/utils/currency';
import { formatDate, getDaysRemaining } from '@/utils/date';
import { GoldifiStatusBadge } from '../ui/GoldifiStatusBadge';
import { Shadows } from '@/theme/shadows';

interface LoanCardProps {
  loan: Loan;
  onPress: () => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ loan, onPress }) => {
  const daysLeft = getDaysRemaining(loan.dueDate);
  const isOverdue = daysLeft < 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Loan ${loan.loanNumber}`}
    >
      <View style={styles.topRow}>
        <View style={styles.numberBlock}>
          <Text style={styles.loanNumber}>{loan.loanNumber}</Text>
          <Text style={styles.customerName}>{loan.customerName}</Text>
        </View>
        <GoldifiStatusBadge status={loan.status} size="sm" />
      </View>

      <View style={styles.itemSummary}>
        <Ionicons name="sparkles" size={14} color={Colors.primary} style={{ marginTop: 2 }} />
        <Text style={styles.itemText} numberOfLines={1}>
          {loan.pledgedItem.description} ({loan.pledgedItem.grossWeightGrams}g)
        </Text>
      </View>

      <View style={styles.financialRow}>
        <View>
          <Text style={styles.metaLabel}>Principal</Text>
          <Text style={styles.principalValue}>{formatINR(loan.principalAmount)}</Text>
        </View>

        <View style={styles.dueBlock}>
          <Text style={styles.metaLabel}>Total Due</Text>
          <Text style={[styles.dueValue, isOverdue && { color: Colors.error }]}>
            {formatINR(loan.totalAmountDue)}
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.dueInfo}>
          <Ionicons
            name="calendar-outline"
            size={12}
            color={isOverdue ? Colors.error : Colors.textMuted}
          />
          <Text style={[styles.dueText, isOverdue && { color: Colors.error, fontWeight: '600' }]}>
            Due: {formatDate(loan.dueDate)} ({Math.abs(daysLeft)}d {isOverdue ? 'overdue' : 'left'})
          </Text>
        </View>

        <View style={styles.ltvBadge}>
          <Text style={styles.ltvText}>LTV {loan.ltvRatioPercent}%</Text>
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
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  numberBlock: {
    flex: 1,
    marginRight: 8,
  },
  loanNumber: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  customerName: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  itemSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    marginBottom: 10,
  },
  itemText: {
    ...Typography.caption,
    color: Colors.charcoal,
    fontWeight: '500',
    flex: 1,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: 8,
  },
  metaLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  principalValue: {
    ...Typography.secondaryMedium,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  dueBlock: {
    alignItems: 'flex-end',
  },
  dueValue: {
    ...Typography.secondaryMedium,
    color: Colors.primary,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  ltvBadge: {
    backgroundColor: Colors.surfaceSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  ltvText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
