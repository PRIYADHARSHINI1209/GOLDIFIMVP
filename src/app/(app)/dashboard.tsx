import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { formatINR } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { useAuth } from '@/context/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { mockReportService } from '@/services/reports/reportService';
import { mockLoanService } from '@/services/loans/loanService';
import { mockPaymentService } from '@/services/payments/paymentService';
import { DashboardMetrics, Loan, Payment } from '@/types';
import { GoldifiMetricCard } from '@/components/ui/GoldifiMetricCard';
import { GoldifiSectionHeader } from '@/components/ui/GoldifiSectionHeader';
import { GoldifiStatusBadge } from '@/components/ui/GoldifiStatusBadge';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { RoleSimulatorWidget } from '@/components/navigation/RoleSimulatorWidget';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, role } = useAuth();
  const { canCreateLoan, canCreatePayment, canCreateCustomer, canViewInventory, canViewReports } = usePermissions();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentLoans, setRecentLoans] = useState<Loan[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [m, loans, payments] = await Promise.all([
        mockReportService.getDashboardMetrics(),
        mockLoanService.getLoans('ALL'),
        mockPaymentService.getPayments(),
      ]);
      setMetrics(m);
      setRecentLoans(loans.slice(0, 3));
      setRecentPayments(payments.slice(0, 3));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [role]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading || !metrics) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiLoadingState message="Loading branch dashboard..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Mobile Bar */}
      <View style={styles.topBar}>
        <View>
          <View style={styles.branchRow}>
            <Ionicons name="business" size={14} color={Colors.primary} />
            <Text style={styles.branchName} numberOfLines={1}>{user.branchName}</Text>
          </View>
          <Text style={styles.greeting}>Welcome, {user.name.split(' ')[0]}</Text>
        </View>
        <RoleSimulatorWidget />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Scope Banner if All Branches */}
        {user.scope === 'ALL_BRANCHES' && (
          <View style={styles.scopeBanner}>
            <Ionicons name="globe-outline" size={16} color={Colors.primary} />
            <Text style={styles.scopeBannerText}>
              Consolidated Multi-Branch View (3 Active Branches)
            </Text>
          </View>
        )}

        {/* Hero Portfolio Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>TOTAL ACTIVE PORTFOLIO</Text>
          <Text style={styles.heroAmount}>{formatINR(metrics.outstandingPrincipal)}</Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Active Loans</Text>
              <Text style={styles.heroStatValue}>{metrics.totalActiveLoans}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Vault Valuation</Text>
              <Text style={styles.heroStatValue}>{formatINR(metrics.totalInventoryValue)}</Text>
            </View>
            <View style={styles.heroDivider} />
            <View style={styles.heroStatItem}>
              <Text style={styles.heroStatLabel}>Overdue</Text>
              <Text style={[styles.heroStatValue, { color: Colors.error }]}>
                {metrics.overdueLoansCount}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Action Shortcuts */}
        <View style={styles.actionsContainer}>
          {canCreateLoan && (
            <Pressable
              onPress={() => router.push('/(app)/loans/create')}
              style={styles.actionBtn}
              accessibilityRole="button"
            >
              <View style={[styles.actionIconBox, { backgroundColor: Colors.primaryLight }]}>
                <Ionicons name="add-circle" size={22} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>New Loan</Text>
            </Pressable>
          )}

          {canCreatePayment && (
            <Pressable
              onPress={() => router.push('/(app)/payments/create')}
              style={styles.actionBtn}
              accessibilityRole="button"
            >
              <View style={[styles.actionIconBox, { backgroundColor: Colors.successLight }]}>
                <Ionicons name="card" size={22} color={Colors.success} />
              </View>
              <Text style={styles.actionLabel}>Collect Pay</Text>
            </Pressable>
          )}

          {canCreateCustomer && (
            <Pressable
              onPress={() => router.push('/(app)/customers/create')}
              style={styles.actionBtn}
              accessibilityRole="button"
            >
              <View style={[styles.actionIconBox, { backgroundColor: Colors.infoLight }]}>
                <Ionicons name="person-add" size={22} color={Colors.info} />
              </View>
              <Text style={styles.actionLabel}>Add KYC</Text>
            </Pressable>
          )}

          {canViewInventory && (
            <Pressable
              onPress={() => router.push('/(app)/inventory')}
              style={styles.actionBtn}
              accessibilityRole="button"
            >
              <View style={[styles.actionIconBox, { backgroundColor: Colors.surfaceSecondary }]}>
                <Ionicons name="cube" size={22} color={Colors.charcoal} />
              </View>
              <Text style={styles.actionLabel}>Vault Safe</Text>
            </Pressable>
          )}
        </View>

        {/* Today's Operational Pulse */}
        <GoldifiSectionHeader title="Today's Operational Ledger" />
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <GoldifiMetricCard
              label="Today's Disbursements"
              value={formatINR(metrics.todaysNewLoansAmount)}
              subtext={`${metrics.todaysNewLoansCount} new pawn ticket`}
              iconName="arrow-up-circle-outline"
              variant="primary"
              onPress={() => router.push('/(app)/loans')}
            />
            <GoldifiMetricCard
              label="Today's Collections"
              value={formatINR(metrics.todaysPaymentsAmount)}
              subtext={`${metrics.todaysPaymentsCount} receipts cleared`}
              iconName="arrow-down-circle-outline"
              variant="success"
              onPress={() => router.push('/(app)/payments')}
            />
          </View>
          <View style={styles.metricRow}>
            <GoldifiMetricCard
              label="Loans Due Soon"
              value={metrics.dueTodayCount.toString()}
              subtext="Maturing within 7 days"
              iconName="time-outline"
              variant="warning"
              onPress={() => router.push('/(app)/loans')}
            />
            <GoldifiMetricCard
              label="Overdue Risk"
              value={formatINR(metrics.overdueLoansAmount)}
              subtext={`${metrics.overdueLoansCount} defaulted tickets`}
              iconName="alert-circle-outline"
              variant="error"
              onPress={() => router.push('/(app)/loans')}
            />
          </View>
        </View>

        {/* Overdue Warning Callout if any */}
        {metrics.overdueLoansCount > 0 && (
          <Pressable
            onPress={() => router.push('/(app)/loans')}
            style={styles.overdueCallout}
            accessibilityRole="button"
          >
            <View style={styles.calloutIcon}>
              <Ionicons name="alert-circle" size={20} color={Colors.error} />
            </View>
            <View style={styles.calloutContent}>
              <Text style={styles.calloutTitle}>Attention: {metrics.overdueLoansCount} Overdue Loans Require Notice</Text>
              <Text style={styles.calloutDesc}>
                Total default risk {formatINR(metrics.overdueLoansAmount)}. Tap to review borrowers.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.error} />
          </Pressable>
        )}

        {/* Recent Pawn Loans */}
        <GoldifiSectionHeader
          title="Recent Gold Loans"
          actionText="View All"
          onActionPress={() => router.push('/(app)/loans')}
        />
        <View style={styles.recentList}>
          {recentLoans.map((loan) => (
            <Pressable
              key={loan.id}
              onPress={() => router.push(`/(app)/loans/${loan.id}` as any)}
              style={styles.recentItem}
              accessibilityRole="button"
            >
              <View style={styles.recentItemLeft}>
                <View style={styles.loanIconBox}>
                  <Ionicons name="sparkles" size={16} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.recentItemTitle}>{loan.loanNumber} • {loan.customerName}</Text>
                  <Text style={styles.recentItemSub}>{loan.pledgedItem.description}</Text>
                </View>
              </View>
              <View style={styles.recentItemRight}>
                <Text style={styles.recentAmount}>{formatINR(loan.principalAmount)}</Text>
                <GoldifiStatusBadge status={loan.status} size="sm" />
              </View>
            </Pressable>
          ))}
        </View>

        {/* Recent Payments Received */}
        <GoldifiSectionHeader
          title="Recent Payments"
          actionText="View All"
          onActionPress={() => router.push('/(app)/payments')}
        />
        <View style={styles.recentList}>
          {recentPayments.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/(app)/payments/${p.id}` as any)}
              style={styles.recentItem}
              accessibilityRole="button"
            >
              <View style={styles.recentItemLeft}>
                <View style={[styles.loanIconBox, { backgroundColor: Colors.successLight }]}>
                  <Ionicons name="cash" size={16} color={Colors.success} />
                </View>
                <View>
                  <Text style={styles.recentItemTitle}>{p.receiptNumber} • {p.customerName}</Text>
                  <Text style={styles.recentItemSub}>{p.paymentType} via {p.paymentMethod}</Text>
                </View>
              </View>
              <View style={styles.recentItemRight}>
                <Text style={[styles.recentAmount, { color: Colors.success }]}>
                  +{formatINR(p.amount)}
                </Text>
                <Text style={styles.recentDate}>{formatDate(p.paymentDate)}</Text>
              </View>
            </Pressable>
          ))}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.white,
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  branchName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  greeting: {
    ...Typography.sectionTitle,
    fontWeight: '800',
    color: Colors.charcoal,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 16,
    paddingBottom: 32,
  },
  scopeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    marginBottom: 16,
  },
  scopeBannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  heroCard: {
    backgroundColor: Colors.charcoal,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryLight,
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroAmount: {
    ...Typography.display,
    color: Colors.white,
    fontWeight: '800',
    marginBottom: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 14,
  },
  heroStatItem: {
    flex: 1,
  },
  heroDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 8,
  },
  heroStatLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  heroStatValue: {
    ...Typography.secondarySemibold,
    color: Colors.white,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionBtn: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  overdueCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: '#F8B4B4',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  calloutIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutContent: {
    flex: 1,
  },
  calloutTitle: {
    ...Typography.captionSemibold,
    color: Colors.error,
    fontWeight: '700',
  },
  calloutDesc: {
    fontSize: 11,
    color: '#9E2A2B',
    marginTop: 1,
  },
  recentList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    marginBottom: 20,
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  recentItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  loanIconBox: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentItemTitle: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  recentItemSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
    maxWidth: 180,
  },
  recentItemRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  recentAmount: {
    ...Typography.captionSemibold,
    fontWeight: '700',
    color: Colors.charcoal,
  },
  recentDate: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
