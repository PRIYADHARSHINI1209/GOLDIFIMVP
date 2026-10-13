import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Radius } from '@/theme/radius';
import { Typography } from '@/theme/typography';
import { Payment } from '@/types';
import { formatINR } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { Shadows } from '@/theme/shadows';

interface PaymentCardProps {
  payment: Payment;
  onPress: () => void;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Receipt ${payment.receiptNumber}`}
    >
      <View style={styles.topRow}>
        <View style={styles.receiptBlock}>
          <Text style={styles.receiptNumber}>{payment.receiptNumber}</Text>
          <Text style={styles.loanTag}>Loan: {payment.loanNumber}</Text>
        </View>

        <View style={styles.amountBlock}>
          <Text style={styles.amount}>{formatINR(payment.amount)}</Text>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{payment.paymentType}</Text>
          </View>
        </View>
      </View>

      <View style={styles.customerRow}>
        <Ionicons name="person-outline" size={13} color={Colors.textSecondary} />
        <Text style={styles.customerName}>{payment.customerName}</Text>
        <Text style={styles.methodBullet}>•</Text>
        <Text style={styles.methodText}>{payment.paymentMethod}</Text>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.dateText}>{formatDateTime(payment.paymentDate)}</Text>
        <Text style={styles.staffText}>Staff: {payment.receivedByUserName}</Text>
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
  receiptBlock: {
    flex: 1,
  },
  receiptNumber: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  loanTag: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 1,
  },
  amountBlock: {
    alignItems: 'flex-end',
  },
  amount: {
    ...Typography.sectionTitle,
    color: Colors.success,
    fontWeight: '700',
  },
  typeTag: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginTop: 2,
  },
  typeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: 8,
  },
  customerName: {
    ...Typography.captionMedium,
    color: Colors.charcoal,
    fontWeight: '600',
  },
  methodBullet: {
    color: Colors.textMuted,
  },
  methodText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  staffText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
