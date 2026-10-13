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
import { formatDate, getDaysRemaining } from '@/utils/date';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mockLoanService } from '@/services/loans/loanService';
import { mockPaymentService } from '@/services/payments/paymentService';
import { Loan, Payment } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiStatusBadge } from '@/components/ui/GoldifiStatusBadge';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiTimeline } from '@/components/ui/GoldifiTimeline';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { PaymentCard } from '@/components/cards/PaymentCard';

export default function LoanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { canCreatePayment, canCloseLoan } = usePermissions();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  const fetchLoanData = async () => {
    if (!id) return;
    const [l, allPayments] = await Promise.all([
      mockLoanService.getLoanById(id),
      mockPaymentService.getPayments(),
    ]);
    if (l) {
      setLoan(l);
      setPayments(allPayments.filter((p) => p.loanId === l.id));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoanData();
  }, [id]);

  const handleCloseLoan = async () => {
    if (!loan) return;
    setClosing(true);
    await mockLoanService.closeLoan(loan.id, `${user.name} (${user.role})`);
    await fetchLoanData();
    setClosing(false);
    alert('Loan has been marked closed and collateral released.');
  };

  if (loading || !loan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiHeader title="Loan Account" showBack />
        <GoldifiLoadingState message="Loading loan account details..." />
      </SafeAreaView>
    );
  }

  const daysLeft = getDaysRemaining(loan.dueDate);
  const isOverdue = daysLeft < 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title={loan.loanNumber}
        subtitle={`${loan.customerName} • ${loan.branchName}`}
        showBack
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Status & Principal Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.bannerLabel}>CURRENT BALANCE DUE</Text>
              <Text style={[styles.bannerAmount, isOverdue && { color: Colors.error }]}>
                {formatINR(loan.totalAmountDue)}
              </Text>
            </View>
            <GoldifiStatusBadge status={loan.status} />
          </View>

          <View style={styles.loanMetaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.cellLabel}>Principal</Text>
              <Text style={styles.cellVal}>{formatINR(loan.principalAmount)}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.cellLabel}>Monthly Rate</Text>
              <Text style={styles.cellVal}>{loan.monthlyInterestRatePercent}% / mo</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.cellLabel}>Maturity Date</Text>
              <Text style={[styles.cellVal, isOverdue && { color: Colors.error }]}>
                {formatDate(loan.dueDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons: Pay or Close */}
        {loan.status !== 'CLOSED' && (
          <View style={styles.actionsRow}>
            {canCreatePayment && (
              <GoldifiButton
                label="Collect Payment"
                onPress={() =>
                  router.push({
                    pathname: '/(app)/payments/create',
                    params: {
                      loanId: loan.id,
                      loanNumber: loan.loanNumber,
                      customerId: loan.customerId,
                      customerName: loan.customerName,
                    },
                  })
                }
                iconName="card-outline"
                size="md"
                style={{ flex: 1 }}
              />
            )}
            {canCloseLoan && (
              <GoldifiButton
                label="Close & Release"
                onPress={handleCloseLoan}
                loading={closing}
                variant="outline"
                iconName="checkmark-done"
                size="md"
                style={{ flex: 1 }}
              />
            )}
          </View>
        )}

        {/* Pledged Collateral Card */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="sparkles" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Pledged Collateral</Text>
            </View>
            <View style={styles.lockerBadge}>
              <Ionicons name="cube-outline" size={12} color={Colors.info} />
              <Text style={styles.lockerText}>{loan.pledgedItem.storageLocker}</Text>
            </View>
          </View>

          <Text style={styles.itemDesc}>{loan.pledgedItem.description}</Text>

          <View style={styles.specsRow}>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>Purity Benchmark</Text>
              <Text style={styles.specVal}>{loan.pledgedItem.purityKarat || '22K Hallmarked'}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>Gross Weight</Text>
              <Text style={styles.specVal}>{loan.pledgedItem.grossWeightGrams} g</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specLabel}>Net Gold Weight</Text>
              <Text style={styles.specVal}>{loan.pledgedItem.netWeightGrams} g</Text>
            </View>
          </View>

          <View style={styles.ltvSection}>
            <View style={styles.ltvHeader}>
              <Text style={styles.ltvLabel}>Loan-to-Value (LTV) Risk Exposure:</Text>
              <Text style={[styles.ltvVal, { color: loan.ltvRatioPercent > 75 ? Colors.error : Colors.success }]}>
                {loan.ltvRatioPercent}% LTV
              </Text>
            </View>
            <View style={styles.ltvBarBg}>
              <View
                style={[
                  styles.ltvBarFill,
                  {
                    width: `${Math.min(loan.ltvRatioPercent, 100)}%`,
                    backgroundColor: loan.ltvRatioPercent > 75 ? Colors.error : Colors.primary,
                  },
                ]}
              />
            </View>
            <View style={styles.ltvMetaRow}>
              <Text style={styles.ltvMetaText}>Assessed Collateral Market Value:</Text>
              <Text style={styles.ltvMetaVal}>{formatINR(loan.pledgedItem.estimatedMarketValue)}</Text>
            </View>
          </View>
        </View>

        {/* Borrower Dossier Link */}
        <Pressable
          onPress={() => router.push(`/(app)/customers/${loan.customerId}` as any)}
          style={styles.borrowerCard}
          accessibilityRole="button"
        >
          <View style={styles.borrowerInfo}>
            <Ionicons name="person-circle-outline" size={32} color={Colors.primary} />
            <View>
              <Text style={styles.borrowerName}>{loan.customerName}</Text>
              <Text style={styles.borrowerPhone}>{loan.customerPhone}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </Pressable>

        {/* Payment History for this Loan */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="receipt-outline" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Payment Receipts ({payments.length})</Text>
            </View>
          </View>

          {payments.length > 0 ? (
            payments.map((p) => (
              <PaymentCard
                key={p.id}
                payment={p}
                onPress={() => router.push(`/(app)/payments/${p.id}` as any)}
              />
            ))
          ) : (
            <Text style={styles.emptyNote}>No payment installments recorded for this loan yet.</Text>
          )}
        </View>

        {/* Operational Timeline */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="time-outline" size={18} color={Colors.primary} />
              <Text style={styles.cardTitle}>Lifecycle Activity & Audit</Text>
            </View>
          </View>
          <GoldifiTimeline events={loan.timeline} />
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
  statusBanner: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  bannerAmount: {
    ...Typography.screenTitle,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  loanMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: 12,
  },
  metaCell: {
    flex: 1,
  },
  cellLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  cellVal: {
    ...Typography.secondarySemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  lockerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.infoLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  lockerText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.info,
  },
  itemDesc: {
    ...Typography.bodyMedium,
    color: Colors.charcoal,
    fontWeight: '600',
    marginBottom: 12,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  specBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 10,
    borderRadius: Radius.sm,
  },
  specLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  specVal: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  ltvSection: {
    backgroundColor: Colors.surfaceSecondary,
    padding: 12,
    borderRadius: Radius.sm,
  },
  ltvHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ltvLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  ltvVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  ltvBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  ltvBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  ltvMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ltvMetaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  ltvMetaVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  borrowerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 16,
  },
  borrowerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  borrowerName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  borrowerPhone: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  emptyNote: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
