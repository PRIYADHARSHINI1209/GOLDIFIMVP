import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { formatINR } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { mockPaymentService } from '@/services/payments/paymentService';
import { MOCK_ORGANIZATION } from '@/mock/organizations';
import { Payment } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiDivider } from '@/components/ui/GoldifiDivider';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';

export default function PaymentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    mockPaymentService.getPaymentById(id).then((p) => {
      if (p) setPayment(p);
      setLoading(false);
    });
  }, [id]);

  if (loading || !payment) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiHeader title="Payment Receipt" showBack />
        <GoldifiLoadingState message="Loading payment receipt..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title="Payment Receipt"
        subtitle={payment.receiptNumber}
        showBack
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Printable Thermal/Official Style Receipt Card */}
        <View style={styles.receiptPaper}>
          {/* Shop Stamp / Header */}
          <View style={styles.receiptHeader}>
            <View style={styles.brandIconBox}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.white} />
            </View>
            <Text style={styles.shopName}>{MOCK_ORGANIZATION.name}</Text>
            <Text style={styles.shopAddress}>{MOCK_ORGANIZATION.address}</Text>
            <Text style={styles.gstText}>GSTIN / Lic: {MOCK_ORGANIZATION.taxNumber}</Text>
          </View>

          <GoldifiDivider marginVertical={14} />

          {/* Receipt Title & Meta */}
          <View style={styles.receiptMetaRow}>
            <View>
              <Text style={styles.metaLabel}>RECEIPT NO.</Text>
              <Text style={styles.receiptNumber}>{payment.receiptNumber}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.metaLabel}>DATE & TIME</Text>
              <Text style={styles.metaVal}>{formatDateTime(payment.paymentDate)}</Text>
            </View>
          </View>

          <GoldifiDivider marginVertical={10} />

          {/* Borrower & Loan Details */}
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Customer Name:</Text>
            <Text style={styles.fieldVal}>{payment.customerName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Pawn Loan Account:</Text>
            <Text style={[styles.fieldVal, { color: Colors.primary }]}>{payment.loanNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Payment Nature:</Text>
            <Text style={styles.fieldVal}>{payment.paymentType} Repayment</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.fieldLabel}>Settlement Mode:</Text>
            <Text style={styles.fieldVal}>{payment.paymentMethod}</Text>
          </View>
          {payment.notes && (
            <View style={styles.row}>
              <Text style={styles.fieldLabel}>Reference Note:</Text>
              <Text style={styles.fieldVal}>{payment.notes}</Text>
            </View>
          )}

          <GoldifiDivider marginVertical={14} />

          {/* Total Amount Box */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>NET AMOUNT RECEIVED</Text>
            <Text style={styles.amountTotal}>{formatINR(payment.amount)}</Text>
            <Text style={styles.statusCleared}>CLEARED & RECORDED IN CASH LEDGER</Text>
          </View>

          <GoldifiDivider marginVertical={14} />

          {/* Signature / Staff Footer */}
          <View style={styles.stampFooter}>
            <View>
              <Text style={styles.staffLabel}>Authorized Branch Officer</Text>
              <Text style={styles.staffVal}>{payment.receivedByUserName}</Text>
              <Text style={styles.branchVal}>{payment.branchName}</Text>
            </View>
            <View style={styles.sealCircle}>
              <Ionicons name="checkmark-done-circle" size={32} color={Colors.success} />
              <Text style={styles.sealText}>VERIFIED</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons: Print / Share */}
        <View style={styles.actionButtons}>
          <GoldifiButton
            label="Share Receipt PDF"
            onPress={() => alert('Receipt PDF ready to share via WhatsApp / SMS.')}
            iconName="share-outline"
            size="lg"
          />
          <View style={{ height: 10 }} />
          <GoldifiButton
            label="View Linked Pawn Loan"
            onPress={() => router.push(`/(app)/loans/${payment.loanId}` as any)}
            variant="outline"
            iconName="receipt-outline"
            size="md"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 40,
  },
  receiptPaper: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 18,
    marginBottom: 20,
  },
  receiptHeader: {
    alignItems: 'center',
  },
  brandIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  shopName: {
    ...Typography.sectionTitle,
    fontWeight: '800',
    color: Colors.charcoal,
    textAlign: 'center',
  },
  shopAddress: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 16,
  },
  gstText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: 4,
  },
  receiptMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  receiptNumber: {
    ...Typography.bodyMedium,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  metaVal: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  fieldLabel: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
  },
  fieldVal: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  amountBox: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  amountTotal: {
    ...Typography.metricLarge,
    fontWeight: '800',
    color: Colors.success,
  },
  statusCleared: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.success,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  stampFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  staffLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  staffVal: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
  branchVal: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  sealCircle: {
    alignItems: 'center',
  },
  sealText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
  },
  actionButtons: {
    marginTop: 4,
  },
});
