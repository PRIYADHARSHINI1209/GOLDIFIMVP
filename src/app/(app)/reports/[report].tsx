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
import { mockLoanService } from '@/services/loans/loanService';
import { mockPaymentService } from '@/services/payments/paymentService';
import { mockCustomerService } from '@/services/customers/customerService';
import { Loan, Payment, Customer } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';

export default function ReportDetailScreen() {
  const router = useRouter();
  const { report } = useLocalSearchParams<{ report: string }>();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mockLoanService.getLoans('ALL'),
      mockPaymentService.getPayments(),
      mockCustomerService.getCustomers(),
    ]).then(([l, p, c]) => {
      setLoans(l);
      setPayments(p);
      setCustomers(c);
      setLoading(false);
    });
  }, [report]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiHeader title="Report Analytics" showBack />
        <GoldifiLoadingState message="Compiling data tables..." />
      </SafeAreaView>
    );
  }

  const reportId = report || 'loans-summary';

  let title = 'Report Summary';
  let subtitle = 'Financial breakdown';

  if (reportId === 'loans-summary') {
    title = 'Loan Portfolio Report';
    subtitle = `${loans.length} lifetime loan accounts`;
  } else if (reportId === 'collections-summary') {
    title = 'Collections & Revenue';
    subtitle = `${payments.length} ledger receipts`;
  } else if (reportId === 'overdue-risk') {
    title = 'Overdue Default Risk';
    subtitle = 'Delinquency audit report';
  } else if (reportId === 'vault-assets') {
    title = 'Vault Custody Assets';
    subtitle = 'Gold purity and inventory audit';
  }

  const totalDisbursed = loans.reduce((sum, l) => sum + l.principalAmount, 0);
  const totalCollections = payments.reduce((sum, p) => sum + p.amount, 0);
  const overdueLoans = loans.filter((l) => l.status === 'OVERDUE');
  const overdueTotal = overdueLoans.reduce((sum, l) => sum + l.totalAmountDue, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader title={title} subtitle={subtitle} showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Loan Summary Report View */}
        {reportId === 'loans-summary' && (
          <>
            <View style={styles.heroBox}>
              <Text style={styles.heroLabel}>LIFETIME DISBURSEMENTS</Text>
              <Text style={styles.heroVal}>{formatINR(totalDisbursed)}</Text>
              <Text style={styles.heroSub}>Across {loans.length} total gold loan agreements</Text>
            </View>

            <Text style={styles.sectionTitle}>Portfolio Breakdown</Text>
            <View style={styles.statList}>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>Active Performing Loans</Text>
                <Text style={styles.statValue}>
                  {loans.filter((l) => l.status === 'ACTIVE').length} loans
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>Maturity Approaching (7 Days)</Text>
                <Text style={[styles.statValue, { color: Colors.warning }]}>
                  {loans.filter((l) => l.status === 'DUE_SOON').length} loans
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>Delinquent / Overdue</Text>
                <Text style={[styles.statValue, { color: Colors.error }]}>
                  {overdueLoans.length} loans
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>Settled / Closed Accounts</Text>
                <Text style={[styles.statValue, { color: Colors.success }]}>
                  {loans.filter((l) => l.status === 'CLOSED').length} loans
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Collections View */}
        {reportId === 'collections-summary' && (
          <>
            <View style={[styles.heroBox, { backgroundColor: Colors.success }]}>
              <Text style={styles.heroLabel}>TOTAL CASH & DIGITAL COLLECTIONS</Text>
              <Text style={styles.heroVal}>{formatINR(totalCollections)}</Text>
              <Text style={styles.heroSub}>Recorded via Cash Counter & UPI</Text>
            </View>

            <Text style={styles.sectionTitle}>Collection Channels</Text>
            <View style={styles.statList}>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>UPI & Digital (GPay/PhonePe)</Text>
                <Text style={styles.statValue}>
                  {payments.filter((p) => p.paymentMethod === 'UPI').length} transactions
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>Counter Cash</Text>
                <Text style={styles.statValue}>
                  {payments.filter((p) => p.paymentMethod === 'CASH').length} transactions
                </Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>Bank NEFT / IMPS</Text>
                <Text style={styles.statValue}>
                  {payments.filter((p) => p.paymentMethod === 'BANK_TRANSFER').length} transactions
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Overdue Risk View */}
        {reportId === 'overdue-risk' && (
          <>
            <View style={[styles.heroBox, { backgroundColor: Colors.error }]}>
              <Text style={styles.heroLabel}>TOTAL DEFAULT RISK VALUE</Text>
              <Text style={styles.heroVal}>{formatINR(overdueTotal)}</Text>
              <Text style={styles.heroSub}>{overdueLoans.length} accounts past maximum tenure</Text>
            </View>

            <Text style={styles.sectionTitle}>Default Accounts Requiring Notice</Text>
            {overdueLoans.map((l) => (
              <Pressable
                key={l.id}
                onPress={() => router.push(`/(app)/loans/${l.id}` as any)}
                style={styles.overdueCard}
                accessibilityRole="button"
              >
                <View>
                  <Text style={styles.overdueLoanNum}>{l.loanNumber}</Text>
                  <Text style={styles.overdueCust}>{l.customerName} ({l.customerPhone})</Text>
                  <Text style={styles.overdueItem}>{l.pledgedItem.description}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.overdueDueAmount}>{formatINR(l.totalAmountDue)}</Text>
                  <Text style={styles.overdueLtv}>LTV {l.ltvRatioPercent}%</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}

        {/* Vault Collateral View */}
        {reportId === 'vault-assets' && (
          <>
            <View style={[styles.heroBox, { backgroundColor: Colors.info }]}>
              <Text style={styles.heroLabel}>TOTAL VAULT VALUATION</Text>
              <Text style={styles.heroVal}>
                {formatINR(loans.reduce((s, l) => s + l.pledgedItem.estimatedMarketValue, 0))}
              </Text>
              <Text style={styles.heroSub}>Physical gold & bullion custody audit</Text>
            </View>

            <Text style={styles.sectionTitle}>Vault Purity Segregation</Text>
            <View style={styles.statList}>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>22K Hallmarked 916</Text>
                <Text style={styles.statValue}>4 Articles (152.1g total)</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statKey}>24K Bullion / Coins</Text>
                <Text style={styles.statValue}>1 Coin (16.0g total)</Text>
              </View>
            </View>
          </>
        )}

        <View style={{ height: 20 }} />
        <GoldifiButton
          label="Export Audit PDF"
          onPress={() => alert('Report generated and ready to download.')}
          iconName="download-outline"
          size="lg"
        />
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
  heroBox: {
    backgroundColor: Colors.charcoal,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
    opacity: 0.8,
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroVal: {
    ...Typography.metricLarge,
    color: Colors.white,
    fontWeight: '800',
  },
  heroSub: {
    ...Typography.caption,
    color: Colors.white,
    opacity: 0.85,
    marginTop: 4,
  },
  sectionTitle: {
    ...Typography.sectionTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  statList: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  statKey: {
    ...Typography.secondaryMedium,
    color: Colors.textSecondary,
  },
  statValue: {
    ...Typography.secondarySemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  overdueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#F8B4B4',
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 10,
  },
  overdueLoanNum: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  overdueCust: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  overdueItem: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  overdueDueAmount: {
    ...Typography.secondarySemibold,
    fontWeight: '700',
    color: Colors.error,
  },
  overdueLtv: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    marginTop: 4,
  },
});
