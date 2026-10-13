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
import { formatDate } from '@/utils/date';
import { usePermissions } from '@/hooks/usePermissions';
import { mockCustomerService } from '@/services/customers/customerService';
import { mockLoanService } from '@/services/loans/loanService';
import { mockPaymentService } from '@/services/payments/paymentService';
import { Customer, Loan, Payment } from '@/types';
import { GoldifiHeader } from '@/components/ui/GoldifiHeader';
import { GoldifiStatusBadge } from '@/components/ui/GoldifiStatusBadge';
import { GoldifiAvatar } from '@/components/ui/GoldifiAvatar';
import { GoldifiButton } from '@/components/ui/GoldifiButton';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { GoldifiSectionHeader } from '@/components/ui/GoldifiSectionHeader';
import { LoanCard } from '@/components/cards/LoanCard';
import { PaymentCard } from '@/components/cards/PaymentCard';

export default function CustomerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { canCreateLoan, canEditCustomer } = usePermissions();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerLoans, setCustomerLoans] = useState<Loan[]>([]);
  const [customerPayments, setCustomerPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'loans' | 'payments'>('loans');

  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      const [c, allLoans, allPayments] = await Promise.all([
        mockCustomerService.getCustomerById(id),
        mockLoanService.getLoans('ALL'),
        mockPaymentService.getPayments(),
      ]);

      if (c) {
        setCustomer(c);
        setCustomerLoans(allLoans.filter((l) => l.customerId === c.id));
        setCustomerPayments(allPayments.filter((p) => p.customerId === c.id));
      }
      setLoading(false);
    }
    fetchDetails();
  }, [id]);

  if (loading || !customer) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiHeader title="Customer Profile" showBack />
        <GoldifiLoadingState message="Loading customer dossier..." />
      </SafeAreaView>
    );
  }

  const initials = customer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoldifiHeader
        title={customer.name}
        subtitle={customer.customerCode}
        showBack
        rightAction={
          canEditCustomer ? (
            <Pressable
              onPress={() => alert('Customer information is up to date.')}
              style={styles.editBtn}
              accessibilityRole="button"
            >
              <Ionicons name="create-outline" size={20} color={Colors.charcoal} />
            </Pressable>
          ) : undefined
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <GoldifiAvatar initials={initials} size="lg" backgroundColor={Colors.charcoal} />
            <View style={styles.profileMeta}>
              <View style={styles.titleRow}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <GoldifiStatusBadge status={customer.status} size="sm" />
              </View>
              <Text style={styles.customerCode}>ID: {customer.customerCode}</Text>
              <Text style={styles.memberSince}>Customer since {formatDate(customer.createdAt)}</Text>
            </View>
          </View>

          {/* KYC Info Box */}
          <View style={styles.kycBox}>
            <View style={styles.kycRow}>
              <Ionicons name="card-outline" size={16} color={Colors.primary} />
              <Text style={styles.kycLabel}>ID Proof ({customer.idProofType}):</Text>
              <Text style={styles.kycVal}>{customer.idProofNumber}</Text>
            </View>
            <View style={styles.kycRow}>
              <Ionicons name="call-outline" size={16} color={Colors.primary} />
              <Text style={styles.kycLabel}>Phone:</Text>
              <Text style={styles.kycVal}>{customer.phone}</Text>
            </View>
            <View style={styles.kycRow}>
              <Ionicons name="location-outline" size={16} color={Colors.primary} />
              <Text style={styles.kycLabel}>Address:</Text>
              <Text style={styles.kycVal} numberOfLines={2}>
                {customer.address}, {customer.city}
              </Text>
            </View>
          </View>
        </View>

        {/* Portfolio Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Active Loans</Text>
            <Text style={styles.statVal}>{customer.activeLoansCount}</Text>
            <Text style={styles.statSub}>Total: {customer.totalLoansCount}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Outstanding</Text>
            <Text style={[styles.statVal, { color: Colors.primary }]}>
              {formatINR(customer.outstandingAmount)}
            </Text>
            <Text style={styles.statSub}>Current Principal</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>Collateral Value</Text>
            <Text style={styles.statVal}>{formatINR(customer.totalValuationPledged)}</Text>
            <Text style={styles.statSub}>In Vault</Text>
          </View>
        </View>

        {/* Action Button: Create Loan */}
        {canCreateLoan && (
          <View style={styles.actionRow}>
            <GoldifiButton
              label="Originate Loan for Customer"
              onPress={() =>
                router.push({
                  pathname: '/(app)/loans/create',
                  params: {
                    customerId: customer.id,
                    customerName: customer.name,
                    customerPhone: customer.phone,
                  },
                })
              }
              iconName="add-circle-outline"
              size="md"
            />
          </View>
        )}

        {/* Segmented History Tabs */}
        <View style={styles.tabToggleRow}>
          <Pressable
            onPress={() => setActiveTab('loans')}
            style={[styles.toggleBtn, activeTab === 'loans' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, activeTab === 'loans' && styles.toggleTextActive]}>
              Loans ({customerLoans.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('payments')}
            style={[styles.toggleBtn, activeTab === 'payments' && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, activeTab === 'payments' && styles.toggleTextActive]}>
              Receipts ({customerPayments.length})
            </Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        {activeTab === 'loans' ? (
          customerLoans.length > 0 ? (
            customerLoans.map((loan) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onPress={() => router.push(`/(app)/loans/${loan.id}` as any)}
              />
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No loans recorded for this customer yet.</Text>
            </View>
          )
        ) : customerPayments.length > 0 ? (
          customerPayments.map((p) => (
            <PaymentCard
              key={p.id}
              payment={p}
              onPress={() => router.push(`/(app)/payments/${p.id}` as any)}
            />
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No payment receipts issued for this customer yet.</Text>
          </View>
        )}
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
  editBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  profileMeta: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  customerName: {
    ...Typography.sectionTitle,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 6,
  },
  customerCode: {
    ...Typography.captionMedium,
    color: Colors.textMuted,
  },
  memberSince: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  kycBox: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 12,
    gap: 8,
  },
  kycRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  kycLabel: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    width: 120,
  },
  kycVal: {
    ...Typography.captionSemibold,
    color: Colors.textPrimary,
    flex: 1,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 14,
    marginBottom: 16,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.divider,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  statVal: {
    ...Typography.secondaryMedium,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    marginBottom: 20,
  },
  tabToggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  toggleBtnActive: {
    backgroundColor: Colors.white,
  },
  toggleText: {
    ...Typography.captionMedium,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: Colors.charcoal,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
  },
  emptyText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
