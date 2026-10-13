import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { Radius } from '@/theme/radius';
import { usePermissions } from '@/hooks/usePermissions';
import { mockPaymentService } from '@/services/payments/paymentService';
import { Payment } from '@/types';
import { PaymentCard } from '@/components/cards/PaymentCard';
import { GoldifiSearchBar } from '@/components/ui/GoldifiSearchBar';
import { GoldifiEmptyState } from '@/components/feedback/GoldifiEmptyState';
import { GoldifiLoadingState } from '@/components/feedback/GoldifiLoadingState';
import { GoldifiAccessDenied } from '@/components/feedback/GoldifiAccessDenied';
import { RoleSimulatorWidget } from '@/components/navigation/RoleSimulatorWidget';

export default function PaymentsScreen() {
  const router = useRouter();
  const { canViewPayments, canCreatePayment } = usePermissions();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPayments = async () => {
    try {
      const list = await mockPaymentService.getPayments(searchQuery);
      setPayments(list);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (canViewPayments) {
      loadPayments();
    }
  }, [searchQuery, canViewPayments]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPayments();
  };

  if (!canViewPayments) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <GoldifiAccessDenied
          requiredPermission="payments.view"
          customMessage="You do not have permission to view payment receipts or cash ledger entries."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Payments & Ledger</Text>
          <Text style={styles.headerSubtitle}>{payments.length} receipts issued</Text>
        </View>
        <View style={styles.headerRight}>
          <RoleSimulatorWidget />
          {canCreatePayment && (
            <Pressable
              onPress={() => router.push('/(app)/payments/create')}
              style={styles.addBtn}
              accessibilityRole="button"
              accessibilityLabel="Record Payment"
            >
              <Ionicons name="add" size={22} color={Colors.white} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.searchSection}>
        <GoldifiSearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search receipt #, borrower, or loan..."
        />
      </View>

      {loading ? (
        <GoldifiLoadingState message="Loading payment transactions..." />
      ) : (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PaymentCard
              payment={item}
              onPress={() => router.push(`/(app)/payments/${item.id}` as any)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <GoldifiEmptyState
              iconName="cash-outline"
              title="No Payment Receipts"
              description={
                searchQuery
                  ? `No receipts matching "${searchQuery}".`
                  : 'Collect interest or principal repayments from active loan borrowers.'
              }
              actionLabel={canCreatePayment ? 'Collect Payment' : undefined}
              onActionPress={() => router.push('/(app)/payments/create')}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.screenTitle,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 14,
    paddingBottom: 4,
    backgroundColor: Colors.white,
  },
  listContent: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: 8,
    paddingBottom: 32,
  },
});
