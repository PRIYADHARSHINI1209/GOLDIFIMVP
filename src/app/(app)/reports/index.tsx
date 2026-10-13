import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { usePermissions } from '@/hooks/usePermissions';
import { mockReportService } from '@/services/reports/reportService';
import { DashboardMetrics } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';
import { Shadows } from '@/theme/shadows';

export default function ReportsScreen() {
  const router = useRouter();
  const { canViewReports } = usePermissions();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (canViewReports) {
      mockReportService.getDashboardMetrics().then((m) => {
        setMetrics(m);
        setLoading(false);
      });
    }
  }, [canViewReports]);

  if (!canViewReports) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="reports.view"
          customMessage="You do not have administrative clearance to access financial reporting and portfolio analytics."
        />
      </SafeAreaView>
    );
  }

  if (loading || !metrics) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiHeader title="Reports & Analytics" showBack />
        <GoldifiLoadingState message="Aggregating branch ledger records..." />
      </SafeAreaView>
    );
  }

  const reports = [
    {
      id: 'loans-summary',
      title: 'Loan Portfolio Analysis',
      subtitle: `${metrics.totalActiveLoans} active accounts (${formatINR(metrics.activeLoansAmount)})`,
      icon: 'receipt-outline' as const,
      color: Colors.primary,
      bg: Colors.primaryLight,
    },
    {
      id: 'collections-summary',
      title: 'Payments & Revenue',
      subtitle: `Interest collected & principal settlements`,
      icon: 'cash-outline' as const,
      color: Colors.success,
      bg: Colors.successLight,
    },
    {
      id: 'overdue-risk',
      title: 'Overdue & Default Risk',
      subtitle: `${metrics.overdueLoansCount} delinquent accounts (${formatINR(metrics.overdueLoansAmount)})`,
      icon: 'alert-circle-outline' as const,
      color: Colors.error,
      bg: Colors.errorLight,
    },
    {
      id: 'vault-assets',
      title: 'Vault Collateral Assets',
      subtitle: `${metrics.itemsInVault} items in safe storage (${formatINR(metrics.totalInventoryValue)})`,
      icon: 'cube-outline' as const,
      color: Colors.info,
      bg: Colors.infoLight,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title="Reports & Analytics"
        subtitle="Financial intelligence & branch ledger"
        showBack
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* KPI Snapshot Box */}
        <View style={styles.snapshotCard}>
          <Text style={styles.snapshotLabel}>PORTFOLIO LIQUIDITY SNAPSHOT</Text>
          <Text style={styles.snapshotValue}>{formatINR(metrics.outstandingPrincipal)}</Text>
          <Text style={styles.snapshotSub}>Total active principal currently at risk</Text>

          <View style={styles.kpiRow}>
            <View style={styles.kpiItem}>
              <Text style={styles.kpiLabel}>Borrowers</Text>
              <Text style={styles.kpiVal}>{metrics.totalCustomers}</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Text style={styles.kpiLabel}>Vault Worth</Text>
              <Text style={styles.kpiVal}>{formatINR(metrics.totalInventoryValue)}</Text>
            </View>
            <View style={styles.kpiDivider} />
            <View style={styles.kpiItem}>
              <Text style={styles.kpiLabel}>Maturity Risk</Text>
              <Text style={[styles.kpiVal, { color: Colors.error }]}>
                {metrics.overdueLoansCount} Overdue
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionHeader}>AVAILABLE LEDGER REPORTS</Text>

        {reports.map((rep) => (
          <Pressable
            key={rep.id}
            onPress={() => router.push(`/(app)/reports/${rep.id}` as any)}
            style={({ pressed }) => [
              styles.reportCard,
              pressed && styles.reportCardPressed,
            ]}
            accessibilityRole="button"
          >
            <View style={[styles.iconBox, { backgroundColor: rep.bg }]}>
              <Ionicons name={rep.icon} size={22} color={rep.color} />
            </View>

            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{rep.title}</Text>
              <Text style={styles.reportSub}>{rep.subtitle}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>
        ))}
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
  snapshotCard: {
    backgroundColor: Colors.charcoal,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 24,
  },
  snapshotLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primaryLight,
    letterSpacing: 1,
    marginBottom: 4,
  },
  snapshotValue: {
    ...Typography.metricLarge,
    color: Colors.white,
    fontWeight: '800',
  },
  snapshotSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 16,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 12,
  },
  kpiItem: {
    flex: 1,
  },
  kpiDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 8,
  },
  kpiLabel: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  kpiVal: {
    ...Typography.captionSemibold,
    color: Colors.white,
    fontWeight: '700',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
  },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 12,
    ...Shadows.subtle,
  },
  reportCardPressed: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    ...Typography.bodyMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reportSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
